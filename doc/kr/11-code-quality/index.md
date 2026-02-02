# 코드 품질 관리 가이드

Prettier와 ESLint를 사용한 코드 포맷팅 및 린팅 가이드입니다.

## 📋 목차

- [Prettier 설정](#prettier-설정)
- [ESLint 설정](#eslint-설정)
- [사용 방법](#사용-방법)
- [설정 파일 위치](#설정-파일-위치)
- [주의사항](#주의사항)

## Prettier 설정

### 설정 파일

프로젝트 루트의 `.prettierrc` 파일에서 Prettier 설정을 관리합니다.

```json
{
    "singleQuote": true,
    "tabWidth": 4,
    "semi": false,
    "trailingComma": "all",
    "arrowParens": "always",
    "bracketSpacing": true,
    "endOfLine": "auto",
    "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 주요 설정 옵션

- **`singleQuote`**: `true` - 작은따옴표 사용
- **`tabWidth`**: `4` - 들여쓰기 4칸
- **`semi`**: `false` - 세미콜론 제거
- **`trailingComma`**: `"all"` - 가능한 모든 곳에 trailing comma 추가
- **`arrowParens`**: `"always"` - 화살표 함수 매개변수 항상 괄호 사용
- **`bracketSpacing`**: `true` - 객체 리터럴 중괄호 내부 공백 사용
- **`endOfLine`**: `"auto"` - OS에 따라 자동으로 줄바꿈 문자 설정
- **`plugins`**: Tailwind CSS 클래스 자동 정렬 플러그인 사용

### 무시 파일 (`.prettierignore`)

다음 파일/폴더는 Prettier 포맷팅에서 제외됩니다:

```
node_modules
dist
build
.next
.turbo
coverage
*.lock
yarn.lock
package-lock.json

# Build artifacts and temp files
**/dist/**
**/.__mf__temp/**
**/.vite/**

# Explicitly include apps/fe even though it's in .gitignore
!apps/fe/**
# But exclude build artifacts and temp files
apps/fe/**/dist/**
apps/fe/**/.__mf__temp/**
apps/fe/**/.vite/**
```

**주의사항**: `apps/fe` 디렉토리는 별도 레포로 관리되지만, 소스 코드는 포맷팅 대상에 포함됩니다. 빌드 결과물과 임시 파일만 제외됩니다.

## ESLint 설정

### 설정 파일

ESLint 설정은 `packages/shared/config/eslint.config.js`에서 중앙 관리됩니다.

```javascript
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-unused-vars': 'off', // TypeScript 버전 사용
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]
```

### 주요 규칙

- **JavaScript 표준 규칙**: `@eslint/js`의 recommended 설정 사용
- **TypeScript 규칙**: `typescript-eslint`의 recommended 설정 사용
- **React 규칙**: `eslint-plugin-react`의 recommended 설정 사용
- **React Hooks 규칙**: `eslint-plugin-react-hooks`의 recommended 설정 사용
- **커스텀 규칙**:
    - `react/react-in-jsx-scope`: `off` - React 17+에서는 import 불필요
    - `@typescript-eslint/no-unused-vars`: `warn` - 사용하지 않는 변수 경고
    - `no-unused-vars`: `off` - TypeScript 버전 사용

## 사용 방법

### 포맷팅 (Prettier)

```bash
# 모든 파일 포맷팅
yarn format
# 특정 파일/디렉토리 포맷팅
yarn prettier --write "src/**/*.{ts,tsx}"
# 포맷팅 확인만 (변경하지 않음)
yarn prettier --check "**/*.{js,jsx,ts,tsx,json,css,scss,md}"
```

### 린팅 (ESLint)

```bash
# 모든 파일 린팅
yarn lint
# 특정 파일/디렉토리 린팅
yarn eslint "src/**/*.{ts,tsx}"
# 자동 수정 가능한 문제 수정
yarn eslint --fix "src/**/*.{ts,tsx}"
```

### 통합 실행

Turbo를 통해 모든 워크스페이스에서 실행:

```bash
# 모든 패키지에서 린트 실행
yarn turbo run lint

# 모든 패키지에서 포맷 확인
yarn prettier --check "**/*.{js,jsx,ts,tsx,json,css,scss,md}"
```

## 설정 파일 위치

### Prettier

- **설정 파일**: `.prettierrc` (루트)
- **무시 파일**: `.prettierignore` (루트)
- **의존성**: `package.json`의 `devDependencies`

### ESLint

- **설정 파일**: `packages/shared/config/eslint.config.js`
- **의존성**: `packages/shared/config/package.json`의 `devDependencies`

각 앱/패키지는 루트의 ESLint 설정을 상속받습니다. 필요시 각 패키지의 `package.json`에 `eslintConfig` 필드를 추가하여 오버라이드할 수 있습니다.

## 주의사항

### 1. 빌드 결과물 포맷팅 방지

다음 파일들은 자동으로 포맷팅에서 제외됩니다:

- `dist/`, `build/` - 빌드 결과물
- `.__mf__temp/` - Module Federation 임시 파일
- `.vite/` - Vite 빌드 캐시
- `node_modules/` - 의존성 패키지

### 2. apps/fe 디렉토리 처리

`apps/fe` 디렉토리는 `.gitignore`에서 무시되지만, Prettier는 소스 코드를 포맷팅합니다:

- ✅ 소스 파일 (`src/**`) - 포맷팅 대상
- ❌ 빌드 결과물 (`dist/**`) - 포맷팅 제외
- ❌ 임시 파일 (`.__mf__temp/**`, `.vite/**`) - 포맷팅 제외

### 3. Tailwind CSS 클래스 정렬

Prettier의 `prettier-plugin-tailwindcss` 플러그인이 Tailwind CSS 클래스를 자동으로 정렬합니다. 클래스 순서는 Tailwind의 권장 순서를 따릅니다.

### 4. IDE 통합

#### VSCode/Cursor

`.vscode/settings.json`에 다음 설정을 추가하면 저장 시 자동 포맷팅이 가능합니다:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

#### WebStorm/IntelliJ

1. Settings → Languages & Frameworks → JavaScript → Prettier
2. Prettier 패키지 경로 설정
3. "On save" 옵션 활성화

## 문제 해결

### Prettier가 특정 파일을 포맷팅하지 않는 경우

1. `.prettierignore` 파일 확인
2. 파일 확장자가 지원되는지 확인 (`.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.css`, `.scss`, `.md`)
3. `yarn prettier --check <파일경로>`로 직접 확인

### ESLint 오류가 발생하는 경우

1. `packages/shared/config/eslint.config.js` 설정 확인
2. 필요한 플러그인이 설치되어 있는지 확인
3. TypeScript 설정이 올바른지 확인

### 충돌하는 규칙이 있는 경우

Prettier와 ESLint가 충돌하는 경우, `eslint-config-prettier`를 사용하여 ESLint의 포맷팅 관련 규칙을 비활성화할 수 있습니다. 현재 프로젝트에서는 충돌이 없도록 설정되어 있습니다.

## 참고 자료

- [Prettier 공식 문서](https://prettier.io/docs/en/)
- [ESLint 공식 문서](https://eslint.org/docs/latest/)
- [TypeScript ESLint 문서](https://typescript-eslint.io/)
- [React ESLint 플러그인](https://github.com/jsx-eslint/eslint-plugin-react)
