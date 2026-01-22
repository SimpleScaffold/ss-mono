/**
 * 로컬 개발 환경 설정
 * 
 * 사용법: yarn dev
 * 
 * 모든 앱을 로컬에서 실행합니다.
 * - Host app: http://localhost:3001
 * - Global app: http://localhost:3004
 * - Remote app: http://localhost:3002
 */
export const localConfig = {
    host: {
        port: 3001,
        origin: 'http://localhost:3001',
        url: 'http://localhost:3001',
    },
    globalApp: {
        port: 3004,
        origin: 'http://localhost:3004',
        url: 'http://localhost:3004',
    },
    remote: {
        port: 3002,
        origin: 'http://localhost:3002',
        url: 'http://localhost:3002',
        manifestUrl: 'http://localhost:3002/mf-manifest.json',
    },
    mode: 'local' as const,
}
