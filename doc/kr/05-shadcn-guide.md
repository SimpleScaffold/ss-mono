# shadcn/ui 컴포넌트 추가 가이드

shadcn/ui 컴포넌트를 `@repo/fe-ui` 패키지에 추가하는 방법을 안내합니다.

## 📦 컴포넌트 추가 방법

shadcn/ui 컴포넌트를 추가하는 방법은 **2가지**가 있습니다.

### 방법 1: yarn dlx 사용 (수동 실행)

`yarn dlx`로 컴포넌트를 추가한 후, 수동으로 `update-exports`를 실행합니다.

```bash
# 1. 컴포넌트 추가
cd packages/fe/ui
yarn dlx shadcn@latest add [컴포넌트명]

# 2. exports 자동 업데이트
yarn update-exports
```

**예시:**
```bash
cd packages/fe/ui
yarn dlx shadcn@latest add button
yarn update-exports
```

### 방법 2: wrapper 스크립트 사용 (자동 실행) ⭐ 권장

우리가 만든 wrapper 스크립트를 사용하면 컴포넌트 추가 후 자동으로 `update-exports`가 실행됩니다.

```bash
cd packages/fe/ui
yarn shadcn add [컴포넌트명]
```

**예시:**
```bash
cd packages/fe/ui
yarn shadcn add button
```

이 방법을 사용하면:
1. `yarn dlx shadcn@latest add` 실행
2. 컴포넌트 파일 생성
3. **자동으로** `yarn update-exports` 실행
4. Entry point 파일과 `package.json` exports 자동 업데이트

## 📁 파일 구조

컴포넌트를 추가하면 다음 구조로 파일이 생성됩니다:

```
packages/fe/ui/src/
├── lib/shadcn/ui/
│   └── [컴포넌트명].tsx          # 실제 컴포넌트 파일
└── exports/
    └── [컴포넌트명].ts            # Entry point 파일 (자동 생성)
```

## 🔧 사용 방법

컴포넌트를 추가한 후, 다른 앱에서 다음과 같이 import할 수 있습니다:

### 하위 경로 import (필수)

shadcn/ui 컴포넌트는 하위 경로로만 import할 수 있습니다:

```typescript
import { Button } from '@repo/fe-ui/button';
import { Card } from '@repo/fe-ui/card';
import { Dialog } from '@repo/fe-ui/dialog';
import { Drawer } from '@repo/fe-ui/drawer';
```

**참고**: `@repo/fe-ui` 루트 import는 Theme, Assets, Utils 등에만 사용됩니다. shadcn/ui 컴포넌트는 하위 경로로만 import해야 합니다.

## 📝 자동 생성되는 파일

`yarn update-exports` 또는 `yarn shadcn add` 실행 시 자동으로 생성/업데이트되는 파일:

1. **Entry point 파일**: `src/exports/[컴포넌트명].ts`
   - 컴포넌트와 타입을 re-export하는 파일

2. **package.json exports**: 
   - `"./[컴포넌트명]"` 경로가 자동으로 추가됩니다

**참고**: `src/index.ts`는 더 이상 shadcn/ui 컴포넌트를 export하지 않습니다. 모든 컴포넌트는 하위 경로로만 import할 수 있습니다.

## 🛠️ 스크립트 설명

### `yarn update-exports`
- `src/lib/shadcn/ui/` 디렉토리의 모든 컴포넌트를 스캔
- 각 컴포넌트의 export를 분석
- Entry point 파일과 `package.json` exports 자동 생성/업데이트

### `yarn shadcn add [컴포넌트명]`
- shadcn 컴포넌트 추가 + 자동으로 `update-exports` 실행
- `yarn dlx shadcn@latest add` + `yarn update-exports`를 한 번에 실행

### `yarn watch-components`
- `src/lib/shadcn/ui/` 디렉토리를 감시
- 파일이 추가/변경되면 자동으로 `update-exports` 실행
- 개발 중 백그라운드로 실행하여 자동화 가능

## 💡 팁

- **새 컴포넌트 추가 시**: `yarn shadcn add` 사용 (자동 실행)
- **여러 컴포넌트 일괄 추가 후**: `yarn update-exports` 한 번만 실행
- **자동화 원할 때**: 별도 터미널에서 `yarn watch-components` 실행

## ⚠️ 주의사항

- `yarn dlx shadcn@latest add`를 직접 사용할 경우, 반드시 `yarn update-exports`를 수동으로 실행해야 합니다
- Entry point 파일(`src/exports/`)은 자동 생성되므로 수동으로 수정하지 마세요
- `package.json`의 exports 필드도 자동으로 관리되므로 직접 수정하지 마세요

## 관련 문서

- [@repo/fe-ui 패키지 가이드](./04-packages/fe-ui.md) - 패키지 사용법
- [프로젝트 구조](./02-project-structure.md) - 파일 구조 설명

