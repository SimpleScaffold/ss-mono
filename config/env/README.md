# 환경 설정 파일

이 디렉토리는 마이크로 프론트엔드 환경별 설정을 관리합니다.

## 📋 파일 구조

```
config/env/
├── local.ts                    # 로컬 개발 환경 (git에 포함됨)
├── server-dev.example.ts       # 개발 서버 예시 파일
├── server-prod.example.ts      # 프로덕션 서버 예시 파일
├── dev-remote.example.ts       # Dev-Remote 모드 예시 파일
└── README.md                   # 이 파일
```

## 🚀 초기 설정

처음 프로젝트를 클론한 후, 예시 파일을 복사하여 실제 설정 파일을 생성하세요:

```bash
# 개발 서버 설정
cp config/env/server-dev.example.ts config/env/server-dev.ts

# 프로덕션 서버 설정
cp config/env/server-prod.example.ts config/env/server-prod.ts

# Dev-Remote 모드 설정
cp config/env/dev-remote.example.ts config/env/dev-remote.ts
```

### 설정 파일 구조

각 환경 설정 파일은 다음과 같은 구조를 가집니다:

```typescript
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
```

### Nginx 리버스 프록시 사용 예시

```typescript
export const serverDevConfig = {
    host: {
        port: 11000,
        origin: 'https://dev.example.com/host',
        url: 'https://dev.example.com/host',
    },
    remote: {
        port: 12000,
        origin: 'https://dev.example.com/remote',
        url: 'https://dev.example.com/remote',
        manifestUrl: 'https://dev.example.com/remote/mf-manifest.json',
    },
    mode: 'server-dev' as const,
}
```

## 📝 사용 가능한 환경

| 환경            | 설정 파일        | 사용법                 | Git 포함 | 설명                           |
| --------------- | ---------------- | ---------------------- | -------- | ------------------------------ |
| **Local**       | `local.ts`       | `yarn dev`             | ✅       | 모든 앱을 로컬에서 실행        |
| **Server Dev**  | `server-dev.ts`  | `yarn dev:server-dev`  | ❌       | 개발 서버에 배포된 앱 사용     |
| **Server Prod** | `server-prod.ts` | `yarn dev:server-prod` | ❌       | 프로덕션 서버에 배포된 앱 사용 |
| **Dev-Remote**  | `dev-remote.ts`  | `yarn dev:remote`      | ❌       | Host는 로컬, Remote는 프로덕션 |

## 🔧 사용 방법

### 환경 변수

환경 모드는 `MF_ENV` 환경 변수로 제어됩니다:

- `local` (기본값)
- `server-dev`
- `server-prod`
- `dev-remote`

### 개발 서버 실행

```bash
# 로컬에서 모든 앱 실행 (기본)
yarn dev

# 개발 서버 환경으로 실행
yarn dev:server-dev

# 프로덕션 서버 환경으로 실행
yarn dev:server-prod

# Dev-Remote 모드 (host만 로컬, remote는 prod)
yarn dev:remote

# 환경 변수를 직접 지정하여 실행
MF_ENV=server-dev yarn dev
```

### Vite 설정에서의 사용

환경 설정은 `vite.config.ts`에서 다음과 같이 사용됩니다:

```typescript
import { getHostConfig, getRemoteConfig, type EnvMode } from '../../../../config'

const envMode = (process.env.MF_ENV || 'local') as EnvMode
const hostConfig = getHostConfig(envMode)
const remoteConfig = getRemoteConfig(envMode)

export default defineConfig({
    federation({
        remotes: {
            remoteapp1: {
                entry: remoteConfig.manifestUrl,  // 환경별 URL 사용
            },
        },
    }),
    server: {
        origin: hostConfig.origin,
        port: hostConfig.port,
    },
})
```

## 🔒 보안 고려사항

### Git 보안

- ✅ `local.ts`는 git에 포함됩니다 (localhost만 포함되어 안전함)
- ❌ `server-dev.ts`, `server-prod.ts`, `dev-remote.ts`는 `.gitignore`에 포함되어 git에 올라가지 않습니다
- ✅ 예시 파일(`*.example.ts`)만 git에 포함됩니다

### 빌드 산출물 보안

**주의**: 빌드된 파일(`dist`)에 실제 서버 URL이 포함됩니다.

Module Federation이 런타임에 remote app을 로드하기 위해 필요하므로, 빌드 산출물에 URL이 포함되는 것은 정상입니다.

#### 안전한 경우

- 공개적으로 접근 가능한 프론트엔드 서버 URL
- 클라이언트가 접근해야 하는 URL

#### 위험한 경우

- 내부 네트워크 전용 서버 URL
- 인증이 필요한 내부 API 서버 URL
- VPN이나 방화벽으로 보호된 서버 URL

**권장사항**: 내부 서버 URL은 프론트엔드에서 직접 접근하지 않도록 아키텍처를 설계하세요.

## 🐛 문제 해결

### 환경 변수가 적용되지 않는 경우

1. 환경 변수 확인:

    ```bash
    echo $MF_ENV
    ```

2. 스크립트에서 환경 변수 확인:

    ```bash
    MF_ENV=server-dev yarn dev
    ```

3. Windows 사용자의 경우 `cross-env` 사용:
    ```json
    {
        "scripts": {
            "dev": "cross-env MF_ENV=local turbo run dev"
        }
    }
    ```

### 설정 파일을 찾을 수 없는 경우

1. 설정 파일이 존재하는지 확인:

    ```bash
    ls config/env/server-dev.ts
    ```

2. 예시 파일에서 복사:
    ```bash
    cp config/env/server-dev.example.ts config/env/server-dev.ts
    ```

## 📚 추가 정보

더 자세한 내용은 [환경 설정 가이드](../../doc/kr/09-environment-config/index.md)를 참고하세요.
