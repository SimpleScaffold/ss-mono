# SS Mono Final - Monorepo

독립적인 프론트엔드 애플리케이션 모노레포 프로젝트입니다.

## 구조

```
ss-mono-final/
├── apps/
│   └── fe/
│       ├── host/
│       │   └── vite1/           # Host 애플리케이션 (포트 3001)
│       └── remote/
│           ├── vite2/           # Remote 애플리케이션 (포트 3002)
│           └── vite3/           # Remote 애플리케이션 (포트 3003)
├── packages/
│   ├── fe/
│   │   ├── ui/               # 공통 UI 컴포넌트 패키지
│   │   └── utils/            # 공통 유틸리티 패키지
│   └── shared/
│       └── config/           # 공유 설정 (tsconfig, eslint)
├── package.json
├── turbo.json
└── tsconfig.base.json
```

## 기술 스택

- **Package Manager**: Yarn 4
- **Build Tool**: Turborepo, Vite
- **Styling**: Tailwind CSS v4 (CSS-first, config 파일 없음)
- **Framework**: React 18
- **Language**: TypeScript

## 설치

```bash
yarn install
```

## 실행

모든 애플리케이션을 동시에 실행:

```bash
yarn dev
```

개별 애플리케이션 실행:

```bash
# Vite1 (Host)
cd apps/fe/host/vite1
yarn dev

# Vite2 (Remote)
cd apps/fe/remote/vite2
yarn dev

# Vite3 (Remote)
cd apps/fe/remote/vite3
yarn dev
```

## 빌드

```bash
yarn build
```

## Tailwind CSS v4 사용법

이 프로젝트는 Tailwind CSS v4의 CSS-first 방식을 사용합니다.

- `tailwind.config.*` 파일을 사용하지 않습니다
- Vite 플러그인(`@tailwindcss/vite`)을 사용합니다
- CSS 파일에서 `@import "tailwindcss"`로 Tailwind를 import합니다

### 공통 UI 패키지의 CSS 사용

```css
@import "tailwindcss";
@import "@repo/fe-ui/tokens.css";
@import "@repo/fe-ui/base.css";
```

## 애플리케이션 구조

각 애플리케이션은 완전히 독립적으로 실행됩니다:

- **vite1**: 포트 3001
- **vite2**: 포트 3002  
- **vite3**: 포트 3003

각 애플리케이션은 서로 다른 도메인에서 실행될 수 있으며, 공통 패키지(`@repo/fe-ui`, `@repo/fe-utils`)를 공유합니다.

## 📚 문서

자세한 문서는 [`doc/kr/`](./doc/kr/index.md) 폴더를 참고하세요.

- [시작하기](./doc/kr/01-getting-started.md)
- [프로젝트 구조](./doc/kr/02-project-structure.md)
- [공통 설정](./doc/kr/03-common-config.md)
- [패키지 가이드](./doc/kr/04-packages/)
- [shadcn/ui 가이드](./doc/kr/05-shadcn-guide.md)
- [Upstream 저장소 관리](./doc/kr/07-upstream-management.md)

