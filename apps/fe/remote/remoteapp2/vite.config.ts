import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { getRemoteConfig, type EnvMode } from '../../../../config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../../')

const envMode = (process.env.MF_ENV || 'local') as EnvMode
const remoteConfig = getRemoteConfig(envMode)

// remoteapp2는 포트 3003 사용
const remoteapp2Port = 3003
const remoteapp2Origin = envMode === 'local' 
    ? `http://localhost:${remoteapp2Port}`
    : remoteConfig.origin

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
        origin: remoteapp2Origin,
        port: remoteapp2Port,
        hmr: {
            port: remoteapp2Port,
            host: remoteapp2Origin.replace(/^https?:\/\//, '').split(':')[0] || 'localhost',
        },
        fs: {
            allow: [repoRoot],
        },
    },
})
