# @repo/fe-ui 패키지

공통 UI 컴포넌트 패키지입니다.

## 개요

`@repo/fe-ui`는 프로젝트 전반에서 사용하는 공통 UI 컴포넌트를 제공하는 패키지입니다.

**주요 기능:**
- shadcn/ui 기반 컴포넌트
- Theme 시스템
- Assets (폰트, 아이콘 등)
- 유틸리티 함수

## 설치

이 패키지는 모노레포 내부 패키지이므로 별도 설치가 필요 없습니다.

## 사용법

모든 export는 하위 경로로 import합니다:

### 컴포넌트 Import

shadcn/ui 컴포넌트:

```typescript
import { Button } from '@repo/fe-ui/button';
import { Card } from '@repo/fe-ui/card';
import { Dialog } from '@repo/fe-ui/dialog';
import { Drawer } from '@repo/fe-ui/drawer';
```

### Theme 사용

Theme도 하위 경로로 import합니다:

```typescript
import { ThemeProvider, useTheme } from '@repo/fe-ui/theme';

function App() {
  return (
    <ThemeProvider>
      {/* 앱 내용 */}
    </ThemeProvider>
  );
}
```

### Utils 사용

유틸리티 함수도 하위 경로로 import합니다:

```typescript
import { cn } from '@repo/fe-ui/utils';
```

### Assets 사용

Assets도 하위 경로로 import합니다:

```typescript
import '@repo/fe-ui/assets';
```

## CSS 사용법

### Tailwind CSS 설정

앱의 CSS 파일에서 다음과 같이 import합니다:

```css
@import "tailwindcss";
@import "@repo/fe-ui/tokens.css";
@import "@repo/fe-ui/base.css";
```

### 사용 가능한 CSS 파일

- `@repo/fe-ui/styles` 또는 `@repo/fe-ui/styles/index.css` - 전체 스타일
- `@repo/fe-ui/styles/tokens.css` - 디자인 토큰
- `@repo/fe-ui/styles/variables.css` - CSS 변수
- `@repo/fe-ui/styles/palette.css` - 색상 팔레트
- `@repo/fe-ui/styles/base.css` - 기본 스타일

## 파일 구조

```
packages/fe/ui/src/
├── lib/shadcn/ui/          # shadcn/ui 컴포넌트
├── exports/                # Entry point 파일들
├── theme/                  # Theme 시스템
├── assets/                 # Assets (폰트, 아이콘 등)
└── styles/                 # CSS 파일들
```

## 컴포넌트 추가

새로운 shadcn/ui 컴포넌트를 추가하는 방법은 [shadcn/ui 가이드](../05-shadcn-guide/)를 참고하세요.

## 관련 문서

- [shadcn/ui 가이드](../05-shadcn-guide/) - 컴포넌트 추가 방법
- [공통 설정](../03-common-config/) - TypeScript, Path Mapping 설정

