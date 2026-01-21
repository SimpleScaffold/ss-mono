/**
 * Remote App 1 설정
 * 
 * 모노레포 구조에 맞춘 Vite 설정:
 * - React 플러그인
 * - Tailwind CSS v4 플러그인 (@tailwindcss/vite)
 * - Workspace 패키지 경로 alias 설정
 * - 루트 디렉토리 접근 허용 (모노레포 의존성 해결)
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../../');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind CSS v4 플러그인 (CSS-first 방식)
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
    port: 3002,
    fs: {
      allow: [repoRoot], // 모노레포 루트 접근 허용
    },
  },
});

