
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import { listenForRemoteRebuilds } from '@antdevx/vite-plugin-hmr-sync'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../../')

function waitForRemote(): Plugin {
    let waitPromise: Promise<void> | null = null

    return {
        name: 'wait-for-remote',
        configureServer(server) {
            waitPromise = waitForRemoteApp()

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
async function waitForRemoteApp(maxRetries = 30, delay = 1000): Promise<void> {
    const remoteUrl = 'http://localhost:3002/mf-manifest.json'

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
        listenForRemoteRebuilds({
            allowedApps: ['remoteapp1'],
            hotPayload: 'full-reload',
        }),
        federation({
            name: 'hostapp1',
            manifest: true,
            remotes: {
                remoteapp1: {
                    type: 'module',
                    name: 'remoteapp1',
                    entry: 'http://localhost:3002/mf-manifest.json',
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
        origin: 'http://localhost:3001',
        port: 3001,
        hmr: {
            port: 3001,
            host: 'localhost',
        },
        fs: {
            allow: [repoRoot],
        },
    },
})
