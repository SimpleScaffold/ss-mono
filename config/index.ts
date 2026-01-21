/**
 * 환경 설정 로더
 * 
 * 환경 변수 MF_ENV를 통해 환경별 설정을 로드합니다.
 * 
 * 사용 가능한 환경:
 * - 'local': 로컬 개발 환경 (기본값)
 * - 'server-dev': 개발 서버 환경
 * - 'server-prod': 프로덕션 서버 환경
 * - 'dev-remote': Dev-Remote 모드 (host는 로컬, remote는 prod)
 * 
 * 예시:
 *   MF_ENV=server-dev yarn dev
 *   MF_ENV=dev-remote yarn dev --filter=@repo/host-app
 */

import { localConfig } from './env/local'
import { serverDevConfig } from './env/server-dev'
import { serverProdConfig } from './env/server-prod'
import { devRemoteConfig } from './env/dev-remote'

export type EnvMode = 'local' | 'server-dev' | 'server-prod' | 'dev-remote'

const configs = {
    local: localConfig,
    'server-dev': serverDevConfig,
    'server-prod': serverProdConfig,
    'dev-remote': devRemoteConfig,
}

export function getConfig(mode?: EnvMode) {
    const envMode = (mode || process.env.MF_ENV || 'local') as EnvMode
    return configs[envMode]
}

export function getHostConfig(mode?: EnvMode) {
    return getConfig(mode).host
}

export function getRemoteConfig(mode?: EnvMode) {
    return getConfig(mode).remote
}
