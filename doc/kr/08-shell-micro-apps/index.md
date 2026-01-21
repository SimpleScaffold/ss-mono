# Shell + Micro Apps 아키텍처

모듈 페더레이션 기반의 Shell + Micro Apps 아키텍처 가이드입니다.

## 📋 목차

- [개요](#개요)
- [아키텍처 구조](#아키텍처-구조)
- [Shell 앱 (hostapp1)](#shell-앱-hostapp1)
- [Micro Apps (remoteapp1, remoteapp2)](#micro-apps-remoteapp1-remoteapp2)
- [저장소 관리 전략](#저장소-관리-전략)
- [모듈 페더레이션 설정](#모듈-페더레이션-설정)
- [라이브러리 및 의존성 관리](#라이브러리-및-의존성-관리)
- [스타일링 시스템](#스타일링-시스템)
- [개발 워크플로우](#개발-워크플로우)
- [배포 전략](#배포-전략)

## 개요

이 프로젝트는 **모듈 페더레이션(Module Federation)** 기술을 활용하여 Shell 앱과 여러 Micro Apps를 런타임에 통합하는 아키텍처를 채택합니다.

### 핵심 개념

- **Shell 앱**: 호스트(Host) 역할을 하는 메인 애플리케이션
- **Micro Apps**: 리모트(Remote) 역할을 하는 독립적인 마이크로 프론트엔드 애플리케이션
- **런타임 통합**: 빌드 타임이 아닌 런타임에 모듈을 동적으로 로드하고 결합

### 주요 장점

1. **독립적 개발 및 배포**: 각 Micro App은 독립적으로 개발, 빌드, 배포 가능
2. **기술 스택 유연성**: 각 앱이 서로 다른 기술 스택을 사용할 수 있음 (현재는 모두 React + Vite)
3. **코드 공유**: 공통 컴포넌트와 라이브러리를 효율적으로 공유
4. **확장성**: 새로운 Micro App을 쉽게 추가 가능
5. **메모리 효율성**: Shell에서 단일 인스턴스로 공통 리소스(Cesium Viewer 등) 관리

## 아키텍처 구조

### 현재 구조 (모듈 페더레이션 적용 전)

```
ss-mono/
├── apps/fe/
│   ├── host/
│   │   └── hostapp1/       # Shell 앱 (호스트 예정)
│   └── remote/
│       ├── remoteapp1/     # Micro App 1 (리모트 예정)
│       └── remoteapp2/     # Micro App 2 (리모트 예정)
├── packages/
│   ├── fe/
│   │   ├── ui/         # 공통 UI 컴포넌트 (Shadcn UI)
│   │   └── utils/      # 공통 유틸리티
│   └── shared/
│       └── config/     # 공유 설정
```

**현재 상태:**
- 각 앱은 독립적으로 실행됨 (포트 3001, 3002, 3003)
- 공통 패키지(`@repo/fe-ui`)를 빌드 타임에 공유
- 모듈 페더레이션 설정 없음

### 향후 구조 (모듈 페더레이션 적용 후)

```
┌─────────────────────────────────────────────────────────┐
│                    Shell App (hostapp1)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  - Cesium Viewer (단일 인스턴스)                 │   │
│  │  - 공통 컴포넌트 Expose (@repo/fe-ui)            │   │
│  │  - Shell 레이아웃 및 네비게이션                   │   │
│  │  - 런타임 모듈 로더                                │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                               │
│         ┌────────────────┼────────────────┐            │
│         │                 │                │            │
│    ┌────▼────┐      ┌─────▼─────┐   ┌─────▼─────┐     │
│    │ Micro   │      │  Micro    │   │  Micro    │     │
│    │ App 1   │      │  App 2    │   │  App N    │     │
│    │ (remoteapp1) │      │ (remoteapp2)   │   │  (추가)   │     │
│    └─────────┘      └───────────┘   └───────────┘     │
└─────────────────────────────────────────────────────────┘
```

**런타임 통합:**
- Shell 앱이 각 Micro App을 동적으로 로드
- 공통 컴포넌트는 Shell에서 Expose하여 Micro Apps가 공유 사용
- 각 Micro App은 독립적으로 빌드 및 배포 가능

## Shell 앱 (hostapp1)

### 역할 및 책임

Shell 앱은 전체 애플리케이션의 **호스트(Host)** 역할을 수행합니다.

#### 1. Cesium Viewer 관리
- **단일 인스턴스**: 메모리 효율성을 위해 Shell에서 단일 Cesium Viewer 인스턴스를 생성하고 관리
- **공유 리소스**: Micro Apps는 Shell이 제공하는 Cesium Viewer 인스턴스를 사용

```typescript
// Shell 앱에서 Cesium Viewer 초기화
import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer('cesiumContainer');

// Micro Apps에 Cesium Viewer 제공
export { viewer };
```

#### 2. 공통 컴포넌트 Expose (SSOT)
- **Shadcn UI 컴포넌트**: `@repo/fe-ui` 패키지의 컴포넌트를 모듈 페더레이션으로 Expose
- **Single Source of Truth**: 디자인 변경 시 Shell만 업데이트하면 모든 Micro Apps에 즉시 반영
- **버전 일관성**: 모든 Micro Apps가 동일한 버전의 컴포넌트 사용

```typescript
// Shell의 vite.config.ts에서 Expose 설정
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        microApp1: 'http://localhost:3002/assets/remoteEntry.js',
        microApp2: 'http://localhost:3003/assets/remoteEntry.js',
      },
      exposes: {
        './Button': './packages/fe/ui/src/exports/button.ts',
        './Dialog': './packages/fe/ui/src/exports/dialog.ts',
        './Theme': './packages/fe/ui/src/exports/theme.ts',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
  ],
});
```

#### 3. Shell 레이아웃 및 네비게이션
- **공통 레이아웃**: 헤더, 사이드바, 푸터 등 공통 UI 구조
- **라우팅 관리**: Micro Apps 간 네비게이션 및 라우팅 통합
- **상태 관리**: 전역 상태 관리 (필요 시)

#### 4. 런타임 모듈 로더
- **동적 로딩**: Micro Apps를 런타임에 동적으로 로드
- **에러 핸들링**: 로딩 실패 시 처리
- **로딩 상태**: 로딩 중 UI 표시

### 파일 구조 (예상)

```
apps/fe/host/hostapp1/
├── src/
│   ├── shell/
│   │   ├── ShellLayout.tsx      # Shell 레이아웃
│   │   ├── CesiumViewer.tsx     # Cesium Viewer 컴포넌트
│   │   └── ModuleLoader.tsx     # Micro App 로더
│   ├── routes/
│   │   └── index.tsx            # 라우팅 설정
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts               # 모듈 페더레이션 설정 포함
└── package.json
```

## Micro Apps (remoteapp1, remoteapp2)

### 역할 및 책임

Micro Apps는 **리모트(Remote)** 역할을 수행하는 독립적인 애플리케이션입니다.

#### 1. 독립적 기능 개발
- **기능 격리**: 각 Micro App은 특정 기능 영역을 담당
- **독립 개발**: Shell 앱의 핵심 코드를 수정하지 않고 자체 기능만 개발
- **독립 배포**: 각 Micro App은 독립적으로 빌드 및 배포 가능

#### 2. Shell 리소스 사용
- **공통 컴포넌트**: Shell에서 Expose한 컴포넌트를 동적으로 Import
- **Cesium Viewer**: Shell이 제공하는 Cesium Viewer 인스턴스 사용
- **API 클라이언트**: Shell이 제공하는 공통 API 클라이언트 사용

```typescript
// Micro App에서 Shell의 컴포넌트 사용
const Button = React.lazy(() => import('shell/Button'));
const Dialog = React.lazy(() => import('shell/Dialog'));

function MicroApp() {
  return (
    <div>
      <Button>Click me</Button>
      <Dialog>...</Dialog>
    </div>
  );
}
```

#### 3. 단방향 데이터 흐름
- **읽기 전용**: Shell의 리소스는 자유롭게 사용 가능
- **격리**: Shell의 핵심 코드를 직접 수정하거나 오염시킬 수 없음
- **독립성**: 각 Micro App은 자체 상태 관리 및 로직 보유

### 표준 템플릿

각 Micro App은 동일한 보일러플레이트 구조를 따릅니다:

```
apps/fe/remote/remoteapp1/ (또는 remoteapp2)
├── src/
│   ├── components/          # Micro App 전용 컴포넌트
│   ├── hooks/              # Micro App 전용 훅
│   ├── utils/              # Micro App 전용 유틸리티
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts          # 모듈 페더레이션 Remote 설정
└── package.json
```

### 로컬 개발 환경

Micro App 개발 시:

1. **호스트 레포지토리 클론**: Shell 앱 레포지토리를 클론하여 실제 운영 환경과 동일한 Shell 위에서 개발
2. **동시 실행**: Shell 앱과 Micro App을 동시에 실행하여 통합 테스트
3. **Hot Reload**: 각 앱의 변경사항이 실시간으로 반영

```bash
# 터미널 1: Shell 앱 실행
cd apps/fe/host/hostapp1
yarn dev

# 터미널 2: Micro App 실행
cd apps/fe/remote/remoteapp1
yarn dev
```

## 저장소 관리 전략

### 저장소 구조

각 Micro App은 **독립적인 Git 레포지토리**를 가지고 있으며, Shell 앱은 중앙 모노레포에서 관리됩니다.

```
저장소 구조:
├── shell-repo/              # Shell 앱 레포지토리 (모노레포)
│   ├── apps/fe/host/hostapp1/  # Shell 앱
│   └── packages/            # 공통 패키지
│
├── micro-app-1-repo/        # Micro App 1 독립 레포지토리
│   └── src/
│
├── micro-app-2-repo/        # Micro App 2 독립 레포지토리
│   └── src/
│
└── micro-app-n-repo/        # Micro App N 독립 레포지토리
    └── src/
```

### Micro Apps의 독립 레포지토리

#### 특징

- **완전한 독립성**: 각 Micro App은 자체 Git 레포지토리를 보유
- **독립적 버전 관리**: 각 레포지토리에서 독립적인 버전 관리 및 릴리즈
- **팀별 소유권**: 각 Micro App은 담당 팀이 독립적으로 관리
- **배포 독립성**: 각 레포지토리에서 독립적으로 CI/CD 파이프라인 운영

#### 레포지토리 구조 예시

```
micro-app-1-repo/
├── .github/
│   └── workflows/           # CI/CD 파이프라인
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts          # 모듈 페더레이션 Remote 설정
├── package.json
├── tsconfig.json
└── README.md
```

### Shell의 PR 기반 통합 관리

Shell 레포지토리는 **Pull Request(PR)**를 통해 원하는 Micro App만 선택적으로 통합합니다.

#### 통합 프로세스

1. **Micro App 개발**: 각 Micro App은 독립 레포지토리에서 개발
2. **배포 및 빌드**: Micro App이 자체 CI/CD를 통해 빌드 및 배포
3. **PR 생성**: Shell 레포지토리에 Micro App 통합을 위한 PR 생성
4. **검토 및 승인**: Shell 팀이 PR을 검토하고 승인
5. **통합**: 승인된 Micro App만 Shell에 통합

#### PR 템플릿 예시

```markdown
## Micro App 통합 요청

### Micro App 정보
- **이름**: Micro App 1
- **레포지토리**: https://github.com/org/micro-app-1-repo
- **버전**: v1.2.0
- **배포 URL**: https://cdn.example.com/micro-app-1/v1.2.0/

### 변경 사항
- [ ] Shell의 vite.config.ts에 Remote 추가
- [ ] 환경 변수 설정 추가
- [ ] 문서 업데이트

### 테스트 체크리스트
- [ ] 로컬 환경에서 통합 테스트 완료
- [ ] Shell과의 호환성 확인
- [ ] 공통 컴포넌트 사용 확인
```

#### Shell의 vite.config.ts 업데이트

```typescript
// apps/fe/host/hostapp1/vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'shell',
      remotes: {
        // PR을 통해 승인된 Micro App만 추가
        microApp1: process.env.VITE_MICRO_APP_1_URL || 'http://localhost:3002/assets/remoteEntry.js',
        microApp2: process.env.VITE_MICRO_APP_2_URL || 'http://localhost:3003/assets/remoteEntry.js',
        // 새로 통합할 Micro App
        // microApp3: process.env.VITE_MICRO_APP_3_URL || 'http://localhost:3004/assets/remoteEntry.js',
      },
      // ...
    }),
  ],
});
```

### 통합 관리 전략

#### 1. 선택적 통합

- **필요한 앱만 통합**: 모든 Micro App을 자동으로 통합하지 않고, Shell 팀이 검토 후 필요한 앱만 선택
- **품질 보장**: PR 검토 과정을 통해 코드 품질 및 호환성 확인
- **안정성 우선**: 검증되지 않은 Micro App은 통합하지 않음

#### 2. 버전 관리

- **명시적 버전 지정**: 각 Micro App의 버전을 명확히 지정
- **호환성 관리**: Shell과 Micro App 간 버전 호환성 체크
- **롤백 가능**: 문제 발생 시 이전 버전으로 롤백 가능

#### 3. 환경별 관리

```typescript
// 개발 환경
remotes: {
  microApp1: 'http://localhost:3002/assets/remoteEntry.js',
}

// 스테이징 환경
remotes: {
  microApp1: 'https://staging.example.com/micro-app-1/v1.2.0/assets/remoteEntry.js',
}

// 프로덕션 환경
remotes: {
  microApp1: 'https://cdn.example.com/micro-app-1/v1.2.0/assets/remoteEntry.js',
}
```

### Micro App 제거 프로세스

더 이상 필요하지 않은 Micro App을 제거할 때:

1. **PR 생성**: Micro App 제거를 위한 PR 생성
2. **의존성 확인**: 다른 Micro App이나 Shell에서 해당 앱을 사용하는지 확인
3. **제거**: `vite.config.ts`에서 Remote 설정 제거
4. **문서 업데이트**: 관련 문서에서 제거된 앱 정보 삭제

### 장점

#### Micro App 독립 레포지토리

- **완전한 독립성**: 각 팀이 독립적으로 개발 및 배포
- **빠른 개발 속도**: Shell 레포지토리와의 의존성 없이 빠르게 개발
- **명확한 소유권**: 각 Micro App의 소유권이 명확함

#### Shell의 PR 기반 관리

- **품질 보장**: PR 검토를 통한 코드 품질 관리
- **선택적 통합**: 필요한 앱만 선택적으로 통합
- **안정성**: 검증된 Micro App만 통합하여 안정성 확보
- **명확한 통합 프로세스**: PR을 통한 명확한 통합 프로세스

### 개발 워크플로우 통합

#### Micro App 개발자 관점

```bash
# 1. 독립 레포지토리에서 개발
cd micro-app-1-repo
git checkout -b feature/new-feature
# 개발 작업...

# 2. 자체 레포지토리에 커밋 및 푸시
git commit -m "Add new feature"
git push origin feature/new-feature

# 3. 자체 레포지토리에서 PR 생성 및 머지
# (자체 레포지토리에서 독립적으로 관리)

# 4. 배포 후 Shell 레포지토리에 통합 PR 생성
# (Shell 레포지토리에서)
```

#### Shell 관리자 관점

```bash
# 1. Micro App 통합 PR 검토
# GitHub/GitLab에서 PR 확인

# 2. 로컬에서 테스트
git checkout pr/micro-app-integration
yarn install
yarn dev

# 3. 통합 테스트 수행
# Shell과 Micro App 간 호환성 확인

# 4. PR 승인 및 머지
# 검토 완료 후 PR 머지
```

## 모듈 페더레이션 설정

### Vite 플러그인

Vite에서 모듈 페더레이션을 사용하기 위해 `@originjs/vite-plugin-federation` 플러그인을 사용합니다.

### Shell 앱 설정 (hostapp1)

```typescript
// apps/fe/host/hostapp1/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../../');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'shell',
      filename: 'remoteEntry.js',
      // Remote Apps 설정
      remotes: {
        microApp1: 'http://localhost:3002/assets/remoteEntry.js',
        microApp2: 'http://localhost:3003/assets/remoteEntry.js',
      },
      // Expose할 모듈 (공통 컴포넌트)
      exposes: {
        './Button': './packages/fe/ui/src/exports/button.ts',
        './Dialog': './packages/fe/ui/src/exports/dialog.ts',
        './Drawer': './packages/fe/ui/src/exports/drawer.ts',
        './Card': './packages/fe/ui/src/exports/card.ts',
        './Theme': './packages/fe/ui/src/exports/theme.ts',
        './Utils': './packages/fe/ui/src/exports/utils.ts',
        './CesiumViewer': './src/shell/CesiumViewer.tsx',
      },
      // 공유 의존성
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${path.resolve(__dirname, '../../../../packages/fe/ui/src')}/`,
      },
    ],
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,
    fs: {
      allow: [repoRoot],
    },
  },
});
```

### Micro App 설정 (remoteapp1, remoteapp2)

```typescript
// apps/fe/remote/remoteapp1/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../../');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'microApp1', // 또는 'microApp2'
      filename: 'remoteEntry.js',
      // Expose할 Micro App 컴포넌트
      exposes: {
        './MicroApp': './src/App.tsx',
      },
      // Shell에서 제공하는 모듈 사용
      remotes: {
        shell: 'http://localhost:3001/assets/remoteEntry.js',
      },
      // 공유 의존성
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${path.resolve(__dirname, '../../../../packages/fe/ui/src')}/`,
      },
    ],
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3002, // remoteapp2는 3003
    fs: {
      allow: [repoRoot],
    },
  },
});
```

### 패키지 의존성 추가

```bash
# 루트 package.json에 추가
yarn add -D -W @originjs/vite-plugin-federation
```

## 라이브러리 및 의존성 관리

### 공유 의존성 (Shared Dependencies)

모듈 페더레이션에서 공유되는 의존성은 `singleton: true`로 설정하여 단일 인스턴스를 보장합니다.

**현재 공유 의존성:**
- `react`: ^18.2.0
- `react-dom`: ^18.2.0

**향후 추가 가능한 공유 의존성:**
- `cesium`: Cesium 라이브러리 (Shell에서만 관리)
- `@repo/fe-ui`: 공통 UI 컴포넌트 (Shell에서 Expose)
- `@repo/fe-utils`: 공통 유틸리티

### 의존성 버전 관리

1. **공유 의존성**: 루트 `package.json`에서 중앙 관리
2. **앱별 의존성**: 각 앱의 `package.json`에서 관리
3. **버전 충돌 방지**: Yarn의 `overrides` 사용

```json
// 루트 package.json
{
  "overrides": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### 코드 공유 전략

#### 1. 공통 컴포넌트 (`@repo/fe-ui`)
- **위치**: `packages/fe/ui`
- **공유 방식**: Shell에서 Expose하여 런타임에 공유
- **장점**: 빌드 타임 의존성 없이 런타임에 동적 로드

#### 2. 공통 유틸리티 (`@repo/fe-utils`)
- **위치**: `packages/fe/utils`
- **공유 방식**: Shell에서 Expose 또는 각 앱에서 직접 Import
- **용도**: 날짜 포맷팅, 데이터 변환 등 유틸리티 함수

#### 3. 공통 설정 (`@repo/shared-config`)
- **위치**: `packages/shared/config`
- **공유 방식**: 빌드 타임에 각 앱에서 확장하여 사용
- **용도**: TypeScript 설정, ESLint 설정

## 스타일링 시스템

### Tailwind CSS v4

프로젝트는 **Tailwind CSS v4**의 CSS-first 방식을 사용합니다.

#### 특징

1. **Config 파일 없음**: `tailwind.config.js` 파일을 사용하지 않음
2. **CSS-first**: CSS 파일에서 직접 Tailwind를 import
3. **Vite 플러그인**: `@tailwindcss/vite` 플러그인 사용

#### 설정 방법

```css
/* 각 앱의 styles.css */
@import "tailwindcss";
@import "@repo/fe-ui/styles";
```

#### 스타일 격리

- **CSS 변수**: 각 Micro App이 독립적인 CSS 변수 스코프를 가짐
- **클래스 충돌 방지**: Tailwind의 유틸리티 클래스는 자동으로 격리됨
- **테마 공유**: Shell에서 정의한 테마를 Micro Apps가 공유

### Shadcn UI

**Shadcn UI**는 코드 소유권을 보장하는 컴포넌트 구조를 제공합니다.

#### 구조

```
packages/fe/ui/src/
├── lib/shadcn/ui/        # Shadcn UI 컴포넌트 소스
├── exports/              # Export 파일들
└── styles/               # 스타일 파일들
```

#### 사용 방법

**Shell에서 Expose:**
```typescript
// Shell의 vite.config.ts
exposes: {
  './Button': './packages/fe/ui/src/exports/button.ts',
  './Dialog': './packages/fe/ui/src/exports/dialog.ts',
}
```

**Micro App에서 사용:**
```typescript
// Micro App에서 동적 Import
const Button = React.lazy(() => import('shell/Button'));
const Dialog = React.lazy(() => import('shell/Dialog'));
```

#### SSOT (Single Source of Truth)

- **중앙 관리**: Shell에서만 컴포넌트 소스 코드 관리
- **즉시 반영**: 디자인 변경 시 Shell만 업데이트하면 모든 Micro Apps에 반영
- **버전 일관성**: 모든 앱이 동일한 버전의 컴포넌트 사용

### 테마 시스템

#### Theme Provider

```typescript
// Shell에서 Expose
exposes: {
  './Theme': './packages/fe/ui/src/exports/theme.ts',
}

// Micro App에서 사용
import { ThemeProvider } from 'shell/Theme';

function MicroApp() {
  return (
    <ThemeProvider>
      {/* 앱 내용 */}
    </ThemeProvider>
  );
}
```

#### CSS 변수

```css
/* packages/fe/ui/src/styles/variables.css */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... */
}
```

## 개발 워크플로우

### 로컬 개발 환경 설정

#### 1. 저장소 클론

**Shell 레포지토리 클론:**
```bash
git clone <shell-repository-url>
cd shell-repo
yarn install
```

**Micro App 레포지토리 클론 (필요 시):**
```bash
# Micro App 1 개발 시
git clone <micro-app-1-repository-url>
cd micro-app-1-repo
yarn install

# Micro App 2 개발 시
git clone <micro-app-2-repository-url>
cd micro-app-2-repo
yarn install
```

**참고**: Micro App은 독립 레포지토리에서 개발하지만, Shell과의 통합 테스트를 위해 Shell 레포지토리도 필요합니다.

#### 2. 개발 서버 실행

**옵션 1: 모든 앱 동시 실행**
```bash
yarn dev
```

**옵션 2: 개별 실행**
```bash
# 터미널 1: Shell 앱
cd apps/fe/host/hostapp1
yarn dev

# 터미널 2: Micro App 1
cd apps/fe/remote/remoteapp1
yarn dev

# 터미널 3: Micro App 2
cd apps/fe/remote/remoteapp2
yarn dev
```

#### 3. 개발 포트

- Shell 앱 (hostapp1): `http://localhost:3001`
- Micro App 1 (remoteapp1): `http://localhost:3002`
- Micro App 2 (remoteapp2): `http://localhost:3003`

### Micro App 개발 프로세스

1. **독립 레포지토리에서 개발**: 각 Micro App은 자체 Git 레포지토리에서 개발
2. **보일러플레이트 사용**: 표준 템플릿을 기반으로 새 Micro App 생성
3. **Shell 리소스 활용**: Shell에서 Expose한 컴포넌트 및 리소스 사용
4. **독립 개발**: 자체 기능만 개발 (Shell 코드 수정 불가)
5. **자체 배포**: 독립 레포지토리에서 CI/CD를 통해 배포
6. **Shell 통합**: 배포 완료 후 Shell 레포지토리에 PR을 생성하여 통합 요청
7. **통합 테스트**: Shell과 함께 실행하여 통합 테스트

### Hot Module Replacement (HMR)

- **각 앱 독립 HMR**: 각 앱의 변경사항이 해당 앱에만 반영
- **크로스 앱 HMR**: Shell의 컴포넌트 변경 시 모든 Micro Apps에 반영 (런타임)

### 디버깅

#### Chrome DevTools

- **소스맵**: 각 앱의 소스맵이 독립적으로 생성
- **네트워크 탭**: 모듈 페더레이션 로딩 확인
- **React DevTools**: 각 앱의 컴포넌트 트리 확인

#### 로깅

```typescript
// Shell 앱에서
console.log('[Shell] Module loaded');

// Micro App에서
console.log('[MicroApp1] Component rendered');
```

## 배포 전략

### 빌드

#### Shell 앱 빌드

Shell 앱은 Shell 레포지토리에서 빌드됩니다:

```bash
# Shell 레포지토리에서
cd shell-repo
cd apps/fe/host/hostapp1
yarn build
```

#### Micro App 빌드

각 Micro App은 **독립 레포지토리**에서 빌드됩니다:

```bash
# Micro App 1 레포지토리에서
cd micro-app-1-repo
yarn build

# Micro App 2 레포지토리에서
cd micro-app-2-repo
yarn build
```

**중요**: Micro App은 Shell 레포지토리와 분리된 독립 레포지토리에서 빌드 및 배포됩니다.

### 배포 구조

```
배포 환경/
├── shell/                    # Shell 앱 배포
│   ├── index.html
│   ├── assets/
│   │   ├── remoteEntry.js    # Shell의 Entry Point
│   │   └── ...
│   └── ...
├── micro-app-1/              # Micro App 1 배포
│   ├── assets/
│   │   ├── remoteEntry.js    # Micro App 1의 Entry Point
│   │   └── ...
│   └── ...
└── micro-app-2/              # Micro App 2 배포
    ├── assets/
    │   ├── remoteEntry.js    # Micro App 2의 Entry Point
    │   └── ...
    └── ...
```

### 환경 변수

#### Shell 앱

```typescript
// vite.config.ts
export default defineConfig({
  // ...
  remotes: {
    microApp1: process.env.VITE_MICRO_APP_1_URL || 'http://localhost:3002/assets/remoteEntry.js',
    microApp2: process.env.VITE_MICRO_APP_2_URL || 'http://localhost:3003/assets/remoteEntry.js',
  },
});
```

#### Micro App

```typescript
// vite.config.ts
export default defineConfig({
  // ...
  remotes: {
    shell: process.env.VITE_SHELL_URL || 'http://localhost:3001/assets/remoteEntry.js',
  },
});
```

### CDN 배포

각 앱을 별도의 CDN 경로에 배포:

- Shell: `https://cdn.example.com/shell/`
- Micro App 1: `https://cdn.example.com/micro-app-1/`
- Micro App 2: `https://cdn.example.com/micro-app-2/`

### 버전 관리

- **독립 버전**: 각 Micro App은 독립 레포지토리에서 독립적인 버전 관리
- **호환성**: Shell과 Micro Apps 간 버전 호환성 관리
- **롤백**: 각 앱을 독립적으로 롤백 가능
- **PR 기반 통합**: Shell 레포지토리에서 PR을 통해 특정 버전의 Micro App만 통합

### 배포 워크플로우

#### Micro App 배포

1. **독립 레포지토리에서 배포**: 각 Micro App은 자체 레포지토리의 CI/CD를 통해 배포
2. **버전 태깅**: 배포 시 명확한 버전 태그 생성
3. **CDN 배포**: 배포된 Micro App은 CDN에 업로드
4. **Shell 통합 PR**: 배포 완료 후 Shell 레포지토리에 통합 PR 생성

#### Shell 배포

1. **Micro App 통합 확인**: PR을 통해 통합된 Micro App 목록 확인
2. **환경 변수 설정**: 각 Micro App의 배포 URL을 환경 변수로 설정
3. **Shell 빌드 및 배포**: Shell 앱 빌드 및 배포
4. **통합 테스트**: 배포 후 Shell과 Micro Apps 간 통합 동작 확인

## 참고 자료

### 관련 문서

- [프로젝트 구조](../02-project-structure/) - 전체 모노레포 구조
- [@repo/fe-ui 가이드](../04-packages/fe-ui.md) - 공통 UI 컴포넌트 패키지
- [shadcn/ui 가이드](../05-shadcn-guide/) - 컴포넌트 추가 방법

### 외부 자료

- [Module Federation 공식 문서](https://module-federation.github.io/)
- [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [Shadcn UI 문서](https://ui.shadcn.com/)

## 다음 단계

1. **모듈 페더레이션 플러그인 설치**: `@originjs/vite-plugin-federation` 추가
2. **Shell 앱 설정**: hostapp1에 모듈 페더레이션 Host 설정 추가
3. **Micro Apps 독립 레포지토리 생성**: 각 Micro App을 위한 독립 Git 레포지토리 생성
4. **Micro Apps 설정**: 각 Micro App 레포지토리에 모듈 페더레이션 Remote 설정 추가
5. **PR 템플릿 작성**: Shell 레포지토리에 Micro App 통합을 위한 PR 템플릿 작성
6. **Cesium 통합**: Shell 앱에 Cesium Viewer 추가
7. **공통 컴포넌트 Expose**: Shell에서 `@repo/fe-ui` 컴포넌트 Expose 설정
8. **CI/CD 파이프라인 설정**: 각 Micro App 레포지토리에 독립적인 CI/CD 파이프라인 구성
