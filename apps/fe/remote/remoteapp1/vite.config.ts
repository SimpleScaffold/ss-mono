import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../../')

export default defineConfig({
    build: {
        target: 'chrome89',
    },
    plugins: [
        react(),
        tailwindcss(),
        federation({
            name: 'remoteapp1',
            manifest: true,
            exposes: {
                './RemoteApp1': './src/RemoteApp1.tsx',
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
        origin: 'http://localhost:3002',
        port: 3002,
        hmr: {
            port: 3002,
            host: 'localhost',
        },
        fs: {
            allow: [repoRoot],
        },
    },
})
