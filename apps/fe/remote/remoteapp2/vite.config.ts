import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { getRemoteConfig, type EnvMode } from '../../../../config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../../')

const DEFAULT_ENV_MODE = 'local' as const
const REMOTE_APP_2_PORT = 3003

const envMode = (process.env.MF_ENV || DEFAULT_ENV_MODE) as EnvMode
const remoteConfig = getRemoteConfig(envMode)

const remoteapp2Origin =
    envMode === 'local'
        ? `http://localhost:${REMOTE_APP_2_PORT}`
        : remoteConfig.origin

const SHARED_DEPENDENCIES = {
    react: { singleton: true },
    'react/': { singleton: true },
    'react-dom': { singleton: true },
} as const

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
        federation({
            name: 'remoteapp2',
            manifest: true,
            exposes: {
                './RemoteApp2': './src/RemoteApp2.tsx',
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
        origin: remoteapp2Origin,
        port: REMOTE_APP_2_PORT,
        hmr: {
            port: REMOTE_APP_2_PORT,
            host: extractHostFromOrigin(remoteapp2Origin),
        },
        fs: {
            allow: [repoRoot],
        },
    },
})
