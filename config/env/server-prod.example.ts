/**
 * 프로덕션 서버 환경 설정 예시 파일
 *
 * 사용법:
 * 1. 이 파일을 server-prod.ts로 복사하세요
 * 2. 실제 서버 URL로 변경하세요
 * 3. yarn dev:server-prod 로 실행하세요
 *
 * 예시:
 * - 직접 서버 URL 사용:
 *   host: { origin: 'https://prod.example.com', ... }
 *   remote: { origin: 'https://prod-remote.example.com', ... }
 *
 * - Nginx 리버스 프록시 사용:
 *   host: { origin: 'https://prod.example.com/host', ... }
 *   remote: { origin: 'https://prod.example.com/remote', ... }
 */
export const serverProdConfig = {
    host: {
        port: 11000,
        origin: 'https://prod.example.com',
        url: 'https://prod.example.com',
    },
    remote: {
        port: 12000,
        origin: 'https://prod-remote.example.com',
        url: 'https://prod-remote.example.com',
        manifestUrl: 'https://prod-remote.example.com/mf-manifest.json',
    },
    mode: 'server-prod' as const,
}
