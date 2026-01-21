/**
 * Host App (Shell) 설정
 * 
 * 모노레포 구조에 맞춘 Vite 설정:
 * - React 플러그인
 * - Tailwind CSS v4 플러그인 (@tailwindcss/vite)
 * - Module Federation 플러그인 (@module-federation/vite)
 * - Workspace 패키지 경로 alias 설정
 * - 루트 디렉토리 접근 허용 (모노레포 의존성 해결)
 */
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import { listenForRemoteRebuilds } from '@antdevx/vite-plugin-hmr-sync';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../../');

// Remote app이 준비될 때까지 기다리는 플러그인
function waitForRemote(): Plugin {
  let waitPromise: Promise<void> | null = null;
  
  return {
    name: 'wait-for-remote',
    configureServer(server) {
      // 서버 시작 시점에 체크 시작 (비동기로 실행)
      waitPromise = waitForRemoteApp();
      
      // 첫 요청이 들어올 때까지 remote app이 준비될 때까지 대기
      server.middlewares.use(async (req, res, next) => {
        if (waitPromise) {
          await waitPromise;
          waitPromise = null; // 한 번만 기다림
        }
        next();
      });
    },
  };
}

// Remote app이 준비될 때까지 대기하는 함수
async function waitForRemoteApp(maxRetries = 30, delay = 1000): Promise<void> {
  const remoteUrl = 'http://localhost:3002/mf-manifest.json';
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(remoteUrl, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Status: ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.setTimeout(1000, () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      console.log('✓ Remote app is ready');
      return;
    } catch (error) {
      if (i === 0) {
        console.log('⏳ Waiting for remote app to be ready...');
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.warn('⚠ Remote app did not become ready, continuing anyway...');
}

export default defineConfig({
  build: {
    target: 'chrome89', // top-level await 지원을 위해 필요
  },
  plugins: [
    react(),
    tailwindcss(), // Tailwind CSS v4 플러그인 (CSS-first 방식)
    waitForRemote(), // Remote app 대기 플러그인
    listenForRemoteRebuilds({
      allowedApps: ['remoteapp1'], // 허용할 remote app 목록
      hotPayload: 'full-reload', // 전체 새로고침 (또는 'hmr' 사용 가능)
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
      dts: false, // 개발 모드에서 타입 생성 비활성화 (성능 향상)
      dev: {
        disableRuntimePlugins: false, // 개발 모드에서 런타임 플러그인 활성화
      },
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
      allow: [repoRoot], // 모노레포 루트 접근 허용
    },
  },
});

