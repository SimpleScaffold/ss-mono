/**
 * Remote App 1 설정
 *
 * 모노레포 구조에 맞춘 Vite 설정:
 * - React 플러그인
 * - Tailwind CSS v4 플러그인 (@tailwindcss/vite)
 * - Module Federation 플러그인 (@module-federation/vite)
 * - Workspace 패키지 경로 alias 설정
 * - 루트 디렉토리 접근 허용 (모노레포 의존성 해결)
 */
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
        target: 'chrome89', // top-level await 지원을 위해 필요
    },
    plugins: [
        react(),
        tailwindcss(), // Tailwind CSS v4 플러그인 (CSS-first 방식)
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
            dts: false, // 개발 모드에서 타입 생성 비활성화 (성능 향상)
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
            allow: [repoRoot], // 모노레포 루트 접근 허용
        },
    },
})
