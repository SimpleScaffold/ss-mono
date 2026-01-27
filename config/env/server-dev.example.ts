/**
 * 개발 서버 환경 설정 예시 파일
 *
 * 사용법:
 * 1. 이 파일을 server-dev.ts로 복사하세요
 * 2. 실제 서버 URL로 변경하세요
 * 3. yarn dev:server-dev 로 실행하세요
 *
 * 예시:
 * - 직접 서버 URL 사용:
 *   host: { origin: 'https://dev.example.com', ... }
 *   remote: { origin: 'https://dev-remote.example.com', ... }
 *
 * - Nginx 리버스 프록시 사용:
 *   host: { origin: 'https://dev.example.com/host', ... }
 *   remote: { origin: 'https://dev.example.com/remote', ... }
 */
export const serverDevConfig = {
    host: {
        port: 11000,
        origin: 'https://dev.example.com',
        url: 'https://dev.example.com',
    },
    remote: {
        port: 12000,
        origin: 'https://dev-remote.example.com',
        url: 'https://dev-remote.example.com',
        manifestUrl: 'https://dev-remote.example.com/mf-manifest.json',
    },
    mode: 'server-dev' as const,
}
