
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import { listenForRemoteRebuilds } from '@antdevx/vite-plugin-hmr-sync'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import { getHostConfig, getRemoteConfig, type EnvMode } from '../../../../config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../../')

// 환경 모드 가져오기 (환경 변수 또는 기본값)
const envMode = (process.env.MF_ENV || 'local') as EnvMode
const hostConfig = getHostConfig(envMode)
const remoteConfig = getRemoteConfig(envMode)

function waitForRemote(): Plugin {
    let waitPromise: Promise<void> | null = null

    return {
        name: 'wait-for-remote',
        configureServer(server) {
            // 로컬 모드일 때만 remote 대기
            if (envMode === 'local') {
                waitPromise = waitForRemoteApp(remoteConfig.manifestUrl)
            }

            server.middlewares.use(async (req, res, next) => {
                if (waitPromise) {
                    await waitPromise
                    waitPromise = null
                }
                next()
            })
        },
    }
}
async function waitForRemoteApp(
    remoteUrl: string,
    maxRetries = 30,
    delay = 1000
): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await new Promise<void>((resolve, reject) => {
                const req = http.get(remoteUrl, (res) => {
                    if (res.statusCode === 200) {
                        resolve()
                    } else {
                        reject(new Error(`Status: ${res.statusCode}`))
                    }
                })
                req.on('error', reject)
                req.setTimeout(1000, () => {
                    req.destroy()
                    reject(new Error('Timeout'))
                })
            })
            console.log('✓ Remote app is ready')
            return
        } catch (error) {
            if (i === 0) {
                console.log('⏳ Waiting for remote app to be ready...')
            }
            await new Promise((resolve) => setTimeout(resolve, delay))
        }
    }

    console.warn('⚠ Remote app did not become ready, continuing anyway...')
}

export default defineConfig({
    build: {
        target: 'chrome89',
    },
    plugins: [
        react(),
        tailwindcss(),
        waitForRemote(),
        // 로컬 모드일 때만 HMR 동기화
        ...(envMode === 'local' ? [
            listenForRemoteRebuilds({
                allowedApps: ['remoteapp1'],
                hotPayload: 'full-reload',
            })
        ] : []),
        federation({
            name: 'hostapp1',
            manifest: true,
            remotes: {
                remoteapp1: {
                    type: 'module',
                    name: 'remoteapp1',
                    entry: remoteConfig.manifestUrl,
                },
            },
            shared: {
                react: {
                    singleton: true,
                },
                'react/': {
                    singleton: true,
                },
                'react-dom': {
                    singleton: true,
                },
            },
            dts: false,
        }),
    ],
    resolve: {
        alias: [
            {
                find: /^@\//,
                replacement: `${path.resolve(__dirname, '../../../../packages/fe/ui/src')}/`,
            },
        ],
    },
    server: {
        origin: hostConfig.origin,
        port: hostConfig.port,
        hmr: {
            port: hostConfig.port,
            host: hostConfig.origin.replace(/^https?:\/\//, '').split(':')[0] || 'localhost',
        },
        fs: {
            allow: [repoRoot],
        },
    },
})
