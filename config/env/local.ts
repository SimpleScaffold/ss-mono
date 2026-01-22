/**
 * 로컬 개발 환경 설정
 * 
 * 사용법: yarn dev
 * 
 * 모든 앱을 로컬에서 실행합니다.
 * - Host apps: http://localhost:11000, http://localhost:11001, ...
 * - Global app: http://localhost:11002
 * - Remote apps: http://localhost:12000, http://localhost:12001, ...
 */
export const localConfig = {
    host: {
        port: 11000,
        origin: 'http://localhost:11000',
        url: 'http://localhost:11000',
    },
    globalApp: {
        port: 11002,
        origin: 'http://localhost:11002',
        url: 'http://localhost:11002',
    },
    remote: {
        port: 12000,
        origin: 'http://localhost:12000',
        url: 'http://localhost:12000',
        manifestUrl: 'http://localhost:12000/mf-manifest.json',
    },
    mode: 'local' as const,
}
