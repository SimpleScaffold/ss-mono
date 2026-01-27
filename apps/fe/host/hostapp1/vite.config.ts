import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import { listenForRemoteRebuilds } from '@antdevx/vite-plugin-hmr-sync'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import {
    getHostConfig,
    getRemoteConfig,
    type EnvMode,
} from '../../../../config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../../')

const DEFAULT_ENV_MODE = 'local' as const
const REMOTE_APP_2_PORT = 12001
const HTTP_TIMEOUT_MS = 1000
const MAX_RETRIES = 30
const RETRY_DELAY_MS = 1000

const envMode = (process.env.MF_ENV || DEFAULT_ENV_MODE) as EnvMode
const hostConfig = getHostConfig(envMode)
const remoteConfig = getRemoteConfig(envMode)

const REMOTE_APP_URLS = {
    remoteapp1: remoteConfig.manifestUrl,
    remoteapp2: `http://localhost:${REMOTE_APP_2_PORT}/mf-manifest.json`,
} as const

function waitForRemoteApp(
    remoteUrl: string,
    maxRetries = MAX_RETRIES,
    delay = RETRY_DELAY_MS,
): Promise<void> {
    return new Promise((resolve) => {
        let retryCount = 0

        const attemptConnection = async (): Promise<void> => {
            try {
                await new Promise<void>((resolve, reject) => {
                    const request = http.get(remoteUrl, (response) => {
                        if (response.statusCode === 200) {
                            resolve()
                        } else {
                            reject(
                                new Error(
                                    `HTTP ${response.statusCode ?? 'unknown'}`,
                                ),
                            )
                        }
                    })

                    request.on('error', reject)
                    request.setTimeout(HTTP_TIMEOUT_MS, () => {
                        request.destroy()
                        reject(new Error('Connection timeout'))
                    })
                })

                console.log('✓ Remote app is ready')
                resolve()
            } catch (error) {
                retryCount++

                if (retryCount === 1) {
                    console.log('⏳ Waiting for remote app to be ready...')
                }

                if (retryCount >= maxRetries) {
                    console.warn(
                        '⚠ Remote app did not become ready, continuing anyway...',
                    )
                    resolve()
                    return
                }

                await new Promise((resolve) => setTimeout(resolve, delay))
                return attemptConnection()
            }
        }

        attemptConnection()
    })
}

function waitForRemote(): Plugin {
    let waitPromise: Promise<void> | null = null

    return {
        name: 'wait-for-remote',
        configureServer(server) {
            if (envMode === 'local') {
                waitPromise = Promise.all([
                    waitForRemoteApp(REMOTE_APP_URLS.remoteapp1),
                    waitForRemoteApp(REMOTE_APP_URLS.remoteapp2),
                ]).then(() => undefined)
            }

            server.middlewares.use(async (_req, _res, next) => {
                if (waitPromise) {
                    await waitPromise
                    waitPromise = null
                }
                next()
            })
        },
    }
}

const SHARED_DEPENDENCIES = {
    react: { singleton: true },
    'react/': { singleton: true },
    'react-dom': { singleton: true },
} as const

const REMOTE_APP_2_ENTRY =
    envMode === 'local'
        ? REMOTE_APP_URLS.remoteapp2
        : remoteConfig.manifestUrl.replace('12000', String(REMOTE_APP_2_PORT))

function extractHostFromOrigin(origin: string): string {
    const match = origin.replace(/^https?:\/\//, '').split(':')[0]
    return match || 'localhost'
}

export default defineConfig({
    build: {
        target: 'chrome89',
    },
    plugins: [
        react(),
        tailwindcss(),
        waitForRemote(),
        ...(envMode === 'local'
            ? [
                  listenForRemoteRebuilds({
                      allowedApps: ['remoteapp1', 'remoteapp2'],
                      hotPayload: 'full-reload',
                  }),
              ]
            : []),
        federation({
            name: 'hostapp1',
            manifest: true,
            remotes: {
                remoteapp1: {
                    type: 'module',
                    name: 'remoteapp1',
                    entry: remoteConfig.manifestUrl,
                },
                remoteapp2: {
                    type: 'module',
                    name: 'remoteapp2',
                    entry: REMOTE_APP_2_ENTRY,
                },
            },
            shared: SHARED_DEPENDENCIES,
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
        origin: 'http://localhost:11001',
        port: 11001,
        hmr: {
            port: 11001,
            host: 'localhost',
        },
        fs: {
            allow: [repoRoot],
        },
    },
})
