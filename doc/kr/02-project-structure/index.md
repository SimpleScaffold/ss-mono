# 프로젝트 구조

SS Mono Final 모노레포의 구조를 설명합니다.

## 전체 구조

```
ss-mono-final/
├── apps/                          # 애플리케이션
│   └── fe/
│       ├── host/                  # Host 애플리케이션 모음
│       │   └── hostapp1/          # 메인 Shell 앱 (포트 3001)
│       └── remote/                # Remote 애플리케이션 모음
│           ├── remoteapp1/        # Micro App 1 (포트 3002)
│           └── remoteapp2/        # Micro App 2 (포트 3003)
├── packages/                      # 공유 패키지
│   ├── fe/
│   │   ├── ui/                    # 공통 UI 컴포넌트 패키지
│   │   └── utils/                 # 공통 유틸리티 패키지
│   └── shared/
│       └── config/                # 공유 설정 (tsconfig, eslint)
├── doc/                           # 문서
│   └── kr/                        # 한국어 문서
├── scripts/                       # 스크립트
│   └── utils/                     # 스크립트 유틸리티
├── package.json                   # 루트 패키지 설정
├── turbo.json                     # Turborepo 설정
└── tsconfig.base.json             # TypeScript 기본 설정
```

## Apps 구조

### host/hostapp1
- **경로**: `apps/fe/host/hostapp1`
- **패키지명**: `@repo/host-app`
- **포트**: 3001
- **역할**: Host 애플리케이션 (Shell)
- **설명**: 메인 애플리케이션으로 각 Micro App을 런타임에 통합합니다.

### remote/remoteapp1
- **경로**: `apps/fe/remote/remoteapp1`
- **패키지명**: `@repo/remote-app1`
- **포트**: 3002
- **역할**: Remote 애플리케이션 (Micro App)
- **설명**: 특정 기능을 담당하며 독립적으로 실행 및 배포됩니다.

### remote/remoteapp2
- **경로**: `apps/fe/remote/remoteapp2`
- **패키지명**: `@repo/remote-app2`
- **포트**: 3003
- **역할**: Remote 애플리케이션 (Micro App)
- **설명**: 특정 기능을 담당하며 독립적으로 실행 및 배포됩니다.

각 애플리케이션은 완전히 독립적으로 실행되며, 공통 패키지를 공유합니다.

## Packages 구조

### @repo/fe-ui
공통 UI 컴포넌트 패키지입니다.

**주요 기능:**
- shadcn/ui 컴포넌트
- Theme 시스템
- Assets (폰트, 아이콘 등)
- Utils (cn 함수 등)

**사용법:**
```typescript
import { Button } from '@repo/fe-ui/button';
import { ThemeProvider } from '@repo/fe-ui';
```

자세한 내용은 [@repo/fe-ui 가이드](../04-packages/fe-ui.md)를 참고하세요.

### @repo/fe-utils
공통 유틸리티 함수 패키지입니다.

**주요 기능:**
- 날짜 포맷팅
- 기타 유틸리티 함수

**사용법:**
```typescript
import { formatDate } from '@repo/fe-utils';
```

자세한 내용은 [@repo/fe-utils 가이드](../04-packages/fe-utils.md)를 참고하세요.

### @repo/shared-config
공유 설정 패키지입니다.

**포함 내용:**
- TypeScript 설정 (`tsconfig.json`)
- ESLint 설정 (`eslint.config.js`)

각 패키지와 앱은 이 설정을 확장하여 사용합니다.

## Workspace 설정

프로젝트는 Yarn Workspaces를 사용하여 모노레포를 관리합니다.

**워크스페이스 패턴:**
```json
{
  "workspaces": [
    "apps/fe/host/*",
    "apps/fe/remote/*",
    "packages/*",
    "packages/*/*"
  ]
}
```

이 설정으로 다음 디렉토리들이 워크스페이스로 인식됩니다:
- `apps/fe/host/hostapp1`
- `apps/fe/remote/remoteapp1`, `apps/fe/remote/remoteapp2`
- `packages/fe/ui`, `packages/fe/utils`
- `packages/shared/config`

## 빌드 도구

### Turborepo
모노레포의 빌드와 실행을 관리합니다.

**주요 기능:**
- 병렬 실행
- 캐싱
- 의존성 그래프 관리

### Vite
각 애플리케이션의 빌드 도구로 사용됩니다.

**특징:**
- 빠른 개발 서버
- HMR (Hot Module Replacement)
- 최적화된 프로덕션 빌드

## 다음 단계

- [공통 설정](../03-common-config/) 확인
- [패키지 가이드](../04-packages/) 참고
