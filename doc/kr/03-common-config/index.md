# 공통 설정

프로젝트에서 사용하는 공통 설정에 대해 설명합니다.

## TypeScript 설정

### 기본 설정 (`tsconfig.base.json`)

프로젝트 루트의 `tsconfig.base.json`이 모든 패키지와 앱의 기본 설정을 제공합니다.

**주요 설정:**

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "jsx": "react-jsx",
        "strict": true,
        "baseUrl": ".",
        "paths": {
            "@repo/fe-ui": ["./packages/fe/ui/src"],
            "@repo/fe-ui/*": ["./packages/fe/ui/src/exports/*"],
            "@repo/fe-utils": ["./packages/fe/utils/src"],
            "@repo/shared-config": ["./packages/shared/config"]
        }
    }
}
```

### Path Mapping

모노레포 내에서 패키지를 쉽게 import하기 위해 path mapping이 설정되어 있습니다:

- `@repo/fe-ui` → `./packages/fe/ui/src`
- `@repo/fe-ui/*` → `./packages/fe/ui/src/exports/*`
- `@repo/fe-utils` → `./packages/fe/utils/src`
- `@repo/shared-config` → `./packages/shared/config`

**사용 예시:**

```typescript
// Path mapping을 사용한 import
import { Button } from '@repo/fe-ui/button'
import { formatDate } from '@repo/fe-utils'
```

### 패키지별 설정

각 패키지와 앱은 `tsconfig.base.json`을 확장하여 사용합니다:

```json
{
    "extends": "../../../tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

## ESLint 설정

### 공유 설정 (`@repo/shared-config`)

ESLint 설정은 `packages/shared/config/eslint.config.js`에 정의되어 있습니다.

**주요 설정:**

- React 플러그인
- React Hooks 플러그인
- TypeScript 지원

**사용법:**

각 패키지/앱의 `eslint.config.js`에서 확장:

```javascript
import sharedConfig from '@repo/shared-config/eslint.config.js'

export default [
    ...sharedConfig,
    // 추가 설정
]
```

## Tailwind CSS 설정

이 프로젝트는 Tailwind CSS v4의 CSS-first 방식을 사용합니다.

**특징:**

- `tailwind.config.*` 파일 없음
- Vite 플러그인(`@tailwindcss/vite`) 사용
- CSS 파일에서 `@import "tailwindcss"`로 import

**사용 예시:**

```css
@import 'tailwindcss';
@import '@repo/fe-ui/tokens.css';
@import '@repo/fe-ui/base.css';
```

## Workspace 설정

### Yarn Workspaces

프로젝트는 Yarn 4의 Workspaces 기능을 사용합니다.

**설정 위치:** `package.json`

```json
{
    "workspaces": ["apps/fe/*", "packages/*", "packages/*/*"]
}
```

### 패키지 관리

모든 패키지는 루트에서 통합 관리됩니다:

```bash
# 모든 워크스페이스에 패키지 추가
yarn workspace @repo/fe-ui add [package]

# 특정 워크스페이스에서 실행
yarn workspace @repo/fe-ui [command]
```

## Turborepo 설정

빌드 파이프라인은 `turbo.json`에서 관리됩니다.

**주요 스크립트:**

- `dev`: 개발 서버 실행
- `build`: 프로덕션 빌드
- `lint`: 코드 린트

각 패키지/앱의 `package.json`에서 해당 스크립트를 정의하면 Turborepo가 자동으로 감지합니다.

## 다음 단계

- [패키지 가이드](../04-packages/) 확인
- [shadcn/ui 가이드](../05-shadcn-guide/) 참고
