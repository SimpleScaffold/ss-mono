# @repo/fe-utils 패키지

공통 유틸리티 함수 패키지입니다.

## 개요

`@repo/fe-utils`는 프로젝트 전반에서 사용하는 공통 유틸리티 함수를 제공하는 패키지입니다.

## 설치

이 패키지는 모노레포 내부 패키지이므로 별도 설치가 필요 없습니다.

## 사용법

### Import

```typescript
import { formatDate } from '@repo/fe-utils';
```

## 제공 함수

### `formatDate(date: Date): string`

날짜를 한국어 형식으로 포맷팅합니다.

**예시:**

```typescript
import { formatDate } from '@repo/fe-utils';

const date = new Date();
const formatted = formatDate(date);
// 예: "2024. 1. 15."
```

## 파일 구조

```
packages/fe/utils/src/
└── index.ts                 # Export 파일
```

## 함수 추가

새로운 유틸리티 함수를 추가하려면:

1. `packages/fe/utils/src/index.ts`에 함수 작성
2. `export`로 내보내기
3. 다른 패키지/앱에서 `@repo/fe-utils`로 import하여 사용

**예시:**

```typescript
// packages/fe/utils/src/index.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};
```

## 관련 문서

- [프로젝트 구조](../02-project-structure/) - 패키지 구조 설명
- [공통 설정](../03-common-config/) - TypeScript 설정

