# 환경 설정 가이드

마이크로 프론트엔드 환경별 설정 관리 가이드입니다.

## 📋 목차

- [개요](#개요)
- [환경 설정 구조](#환경-설정-구조)
- [사용 가능한 환경](#사용-가능한-환경)
- [초기 설정](#초기-설정)
- [사용 방법](#사용-방법)
- [보안 고려사항](#보안-고려사항)

## 개요

이 프로젝트는 여러 환경(로컬, 개발 서버, 프로덕션 서버)에서 실행될 수 있도록 환경별 설정을 관리합니다.

### 주요 특징

- ✅ 환경별 URL 설정 관리
- ✅ TypeScript 기반 타입 안전성
- ✅ Git 보안 (실제 서버 URL은 git에 포함되지 않음)
- ✅ Nginx 리버스 프록시 지원

## 환경 설정 구조

```
config/
├── env/
│   ├── local.ts                    # 로컬 개발 환경 (git에 포함됨)
│   ├── server-dev.example.ts       # 개발 서버 예시 파일
│   ├── server-prod.example.ts       # 프로덕션 서버 예시 파일
│   ├── dev-remote.example.ts       # Dev-Remote 모드 예시 파일
│   └── README.md                    # 설정 가이드
└── index.ts                         # 설정 로더
```

### 설정 파일 구조

각 환경 설정 파일은 다음과 같은 구조를 가집니다:

```typescript
export const localConfig = {
    host: {
        port: 3001,
        origin: 'http://localhost:3001',
        url: 'http://localhost:3001',
    },
    remote: {
        port: 3002,
        origin: 'http://localhost:3002',
        url: 'http://localhost:3002',
        manifestUrl: 'http://localhost:3002/mf-manifest.json',
    },
    mode: 'local' as const,
}
```

## 사용 가능한 환경

### 1. Local (로컬)

- **설정 파일**: `config/env/local.ts`
- **사용법**: `yarn dev`
- **설명**: 모든 앱을 로컬에서 실행합니다.
- **Git 포함**: ✅ (안전함, localhost만 포함)

### 2. Server Dev (개발 서버)

- **설정 파일**: `config/env/server-dev.ts`
- **사용법**: `yarn dev:server-dev`
- **설명**: 개발 서버에 배포된 앱들을 사용합니다.
- **Git 포함**: ❌ (실제 서버 URL이 포함될 수 있음)

### 3. Server Prod (프로덕션 서버)

- **설정 파일**: `config/env/server-prod.ts`
- **사용법**: `yarn dev:server-prod`
- **설명**: 프로덕션 서버에 배포된 앱들을 사용합니다.
- **Git 포함**: ❌ (실제 서버 URL이 포함될 수 있음)

### 4. Dev-Remote (하이브리드 모드)

- **설정 파일**: `config/env/dev-remote.ts`
- **사용법**: `yarn dev:remote`
- **설명**: Host app만 로컬에서 실행하고, Remote app은 프로덕션 서버의 것을 사용합니다.
- **Git 포함**: ❌ (실제 서버 URL이 포함될 수 있음)
- **사용 시나리오**: Host app 개발 시 Remote app의 최신 프로덕션 버전을 테스트할 때 유용합니다.

## 초기 설정

### 1. 프로젝트 클론 후 설정 파일 생성

처음 프로젝트를 클론한 후, 예시 파일을 복사하여 실제 설정 파일을 생성하세요:

```bash
# 개발 서버 설정
cp config/env/server-dev.example.ts config/env/server-dev.ts

# 프로덕션 서버 설정
cp config/env/server-prod.example.ts config/env/server-prod.ts

# Dev-Remote 모드 설정
cp config/env/dev-remote.example.ts config/env/dev-remote.ts
```

### 2. 실제 서버 URL로 변경

각 파일을 열어 실제 서버 URL로 변경하세요:

#### 직접 서버 URL 사용 예시

```typescript
// config/env/server-dev.ts
export const serverDevConfig = {
    host: {
        port: 3001,
        origin: 'https://dev.example.com',
        url: 'https://dev.example.com',
    },
    remote: {
        port: 3002,
        origin: 'https://dev-remote.example.com',
        url: 'https://dev-remote.example.com',
        manifestUrl: 'https://dev-remote.example.com/mf-manifest.json',
    },
    mode: 'server-dev' as const,
}
```

#### Nginx 리버스 프록시 사용 예시

```typescript
// config/env/server-dev.ts
export const serverDevConfig = {
    host: {
        port: 3001,
        origin: 'https://dev.example.com/host',
        url: 'https://dev.example.com/host',
    },
    remote: {
        port: 3002,
        origin: 'https://dev.example.com/remote',
        url: 'https://dev.example.com/remote',
        manifestUrl: 'https://dev.example.com/remote/mf-manifest.json',
    },
    mode: 'server-dev' as const,
}
```

## 사용 방법

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
```

### 빌드

```bash
# 빌드 (환경 무관, 기본 설정 사용)
yarn build
```

빌드는 환경과 무관하게 동일하게 수행됩니다. 환경별 차이는 런타임(dev/preview)에만 적용됩니다.

### 프리뷰

```bash
# 빌드된 결과물 프리뷰
yarn preview

# 환경 변수를 직접 지정하여 프리뷰
MF_ENV=server-dev yarn preview
```

## 환경 변수

환경 모드는 `MF_ENV` 환경 변수로 제어됩니다:

- `local` (기본값)
- `server-dev`
- `server-prod`
- `dev-remote`

### 직접 환경 변수 지정

```bash
# 환경 변수를 직접 지정하여 실행
MF_ENV=server-dev yarn dev
MF_ENV=server-prod yarn build
```

## Vite 설정에서의 사용

환경 설정은 `vite.config.ts`에서 다음과 같이 사용됩니다:

```typescript
// apps/fe/host/hostapp1/vite.config.ts
import { getHostConfig, getRemoteConfig, type EnvMode } from '../../../../config'

const envMode = (process.env.MF_ENV || 'local') as EnvMode
const hostConfig = getHostConfig(envMode)
const remoteConfig = getRemoteConfig(envMode)

export default defineConfig({
    // ...
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
        // ...
    },
})
```

## 보안 고려사항

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

**권장사항**:

- 내부 서버 URL은 프론트엔드에서 직접 접근하지 않도록 아키텍처를 설계하세요
- CI/CD에서 환경 변수로 관리하는 것을 권장합니다

## 문제 해결

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

### 빌드 시 잘못된 URL이 포함되는 경우

빌드 시점에 `MF_ENV` 환경 변수가 올바르게 설정되었는지 확인하세요:

```bash
# 빌드 전 환경 변수 확인
MF_ENV=server-prod yarn build
```

## 추가 정보

- [Module Federation 설정](./08-shell-micro-apps/index.md)
- [프로젝트 구조](./02-project-structure/index.md)
