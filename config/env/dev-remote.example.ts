/**
 * Dev-Remote 모드 설정 예시 파일
 * 
 * 사용법:
 * 1. 이 파일을 dev-remote.ts로 복사하세요
 * 2. 실제 프로덕션 서버 URL로 변경하세요
 * 3. yarn dev:remote 로 실행하세요
 * 
 * Host app만 로컬에서 실행하고, Remote app은 프로덕션 서버의 것을 사용합니다.
 * 이 모드는 Host app 개발 시 Remote app의 최신 프로덕션 버전을 테스트할 때 유용합니다.
 * 
 * 예시:
 * - Host는 로컬: http://localhost:11000
 * - Remote는 프로덕션: https://prod-remote.example.com
 */
export const devRemoteConfig = {
    host: {
        port: 11000,
        origin: 'http://localhost:11000',
        url: 'http://localhost:11000',
    },
    remote: {
        port: 12000,
        origin: 'https://prod-remote.example.com',
        url: 'https://prod-remote.example.com',
        manifestUrl: 'https://prod-remote.example.com/mf-manifest.json',
    },
    mode: 'dev-remote' as const,
}
