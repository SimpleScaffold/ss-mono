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

### 4. Git Hooks 연동 (Pre-commit)

프로젝트는 **husky**와 **lint-staged**를 사용하여 커밋 전 자동으로 포맷팅과 린팅을 실행합니다.

#### 🎯 핵심 원칙 (중요)

> **로컬 hook은 개발 편의용 (soft-fail)**  
> **모든 강제 검증은 CI에서만 수행**

- ✅ 로컬 hook 실패해도 커밋 허용 (개발 편의성 우선)
- ✅ 최종 검증은 CI에서만 수행 (일관성 보장)
- ✅ 다양한 환경(WSL/nvm/yarn/corepack/Windows/macOS) 지원

#### 설정 방법

1. **의존성 설치** (이미 설정됨):
   ```bash
   yarn add -D husky lint-staged
   ```

2. **Husky 초기화**:
   ```bash
   yarn prepare
   # 또는 직접 실행
   yarn husky
   ```
   
   **참고**: Husky 9.x에서는 `husky install`이 deprecated되었고, `husky`만 실행하면 됩니다.

3. **Pre-commit Hook 설정**:
   `.husky/pre-commit` 파일은 단순히 Node.js 스크립트를 호출합니다:
   ```bash
   #!/usr/bin/env sh
   # Husky 9.x - Simple trigger only
   # 로컬 hook은 개발 편의용 (soft-fail)
   # 모든 강제 검증은 CI에서만 수행
   
   node scripts/hooks/pre-commit.js || exit 0
   ```
   
   **중요**: `|| exit 0`으로 실패해도 커밋을 허용합니다 (soft-fail).

4. **lint-staged 설정**:
   `.lintstagedrc.js` 파일에서 스테이징된 파일에만 포맷팅과 린팅을 적용합니다:
   ```javascript
   export default {
       '*.{js,jsx,ts,tsx}': [
           'prettier --write',
           'eslint --fix --max-warnings=0',
       ],
       '*.{json,css,scss,md}': ['prettier --write'],
   }
   ```

#### 아키텍처 설계

**구조:**
```
repo/
├─ scripts/
│  └─ hooks/
│     └─ pre-commit.js    # 단일 진입점 (모든 로직 처리)
├─ .husky/
│  └─ pre-commit          # 단순 트리거만 (soft-fail)
└─ .lintstagedrc.js       # lint-staged 설정
```

**원칙:**
- ❌ Husky에서 복잡한 로직 처리 금지
- ❌ PATH 의존적인 명령어 직접 호출 금지
- ✅ 모든 분기 처리는 JS 안에서만 수행
- ✅ 실패 시 soft-fail (커밋 허용)

#### 크로스 플랫폼 지원

프로젝트는 다음 환경에서 작동하도록 설계되었습니다:

- ✅ **Windows** (Git Bash, CMD, PowerShell, GitHub Desktop)
- ✅ **Linux**
- ✅ **macOS**
- ✅ **WSL** (Windows Subsystem for Linux)
- ✅ **NVM** (Node Version Manager)
- ✅ **Corepack** (Yarn/PNPM 관리)

**구현 방식:**

- `.husky/pre-commit`은 단순히 Node.js 스크립트 호출만 담당
- `scripts/hooks/pre-commit.js`에서 모든 환경 분기 처리
- 여러 패키지 매니저(pnpm/yarn/npm) 자동 감지 및 시도
- 실패해도 경고만 출력하고 계속 진행 (soft-fail)

#### 동작 방식

커밋 시 다음이 자동으로 실행됩니다:

1. **스테이징된 파일만 체크**: `lint-staged`가 Git에 스테이징된 파일만 선택
2. **Prettier 포맷팅**: 자동으로 코드 포맷팅
3. **ESLint 린팅**: 자동 수정 가능한 문제는 수정
4. **변경사항 자동 스테이징**: 포맷팅/수정된 파일이 자동으로 다시 스테이징됨
5. **Soft-fail**: 실패해도 커밋 허용 (경고만 출력)

#### 로컬 Hook vs CI 검증

| 항목 | 로컬 Hook | CI |
|------|-----------|-----|
| 목적 | 개발 편의성 | 코드 품질 보장 |
| 실패 시 | 커밋 허용 (soft-fail) | 커밋 차단 (hard-fail) |
| 환경 | 다양한 환경 지원 | 표준화된 환경 |
| 우회 | 가능 (정상 동작) | 불가능 |

#### 예제

```bash
# 정상적인 커밋 (자동으로 포맷팅/린팅 실행)
git add .
git commit -m "feat: 새로운 기능 추가"
# ✅ 포맷팅/린팅 성공 → 커밋 완료

# 포맷팅/린팅 실패 시 (로컬 hook)
git add .
git commit -m "feat: 새로운 기능 추가"
# ⚠️  로컬 hook 실패 (soft-fail)
# → 경고만 출력하고 커밋 허용
# → 최종 검증은 CI에서 수행

# CI에서 실패 시
# ❌ CI 검증 실패 → PR 머지 불가
# → 코드 수정 후 다시 커밋 필요
```

#### CI 설정 (필수)

로컬 hook은 soft-fail이므로, **반드시 CI에서 검증을 수행**해야 합니다:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
      - run: yarn install --frozen-lockfile
      - run: yarn lint        # ESLint 검증
      - run: yarn format:check  # Prettier 검증
```

**중요**: CI에서 실패하면 PR 머지가 불가능하므로, 코드 품질이 보장됩니다.

### 5. IDE 통합

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

### 로컬 Hook 문제 해결

로컬 hook은 **soft-fail 전략**을 사용하므로, 실패해도 커밋이 허용됩니다. 이는 정상 동작입니다.

#### 로컬 Hook이 작동하지 않는 경우

**중요**: 로컬 hook 실패는 정상입니다. 최종 검증은 CI에서 수행됩니다.

1. **수동 실행 테스트**:
   ```bash
   # 터미널에서 직접 테스트
   node scripts/hooks/pre-commit.js
   ```

2. **패키지 매니저 확인**:
   ```bash
   # 사용 가능한 패키지 매니저 확인
   which pnpm yarn npm
   pnpm --version || yarn --version || npm --version
   ```

3. **node_modules 확인**:
   ```bash
   # lint-staged 설치 확인
   ls -la node_modules/.bin/lint-staged
   ls -la node_modules/lint-staged/bin/lint-staged.js
   ```

4. **수동 실행**:
   ```bash
   # 스테이징된 파일이 있는 상태에서
   yarn lint-staged
   # 또는
   npx lint-staged
   ```

#### GitHub Desktop 사용자

GitHub Desktop에서 hook이 작동하지 않아도 **정상**입니다:

- 로컬 hook은 개발 편의용입니다
- 실패해도 커밋이 허용됩니다 (soft-fail)
- 최종 검증은 CI에서 수행됩니다

**대안**: 터미널에서 커밋하면 정상 작동합니다:
```bash
git add .
git commit -m "feat: 새로운 기능"
```

#### CI 검증 확인

로컬 hook이 작동하지 않아도, CI에서 검증이 수행되므로 코드 품질은 보장됩니다:

1. GitHub에서 PR 생성
2. CI 실행 확인
3. CI 실패 시 코드 수정 후 다시 커밋

**핵심**: 로컬 hook 실패 = 정상 동작 (CI에서 최종 검증)

## 참고 자료

- [Prettier 공식 문서](https://prettier.io/docs/en/)
- [ESLint 공식 문서](https://eslint.org/docs/latest/)
- [TypeScript ESLint 문서](https://typescript-eslint.io/)
- [React ESLint 플러그인](https://github.com/jsx-eslint/eslint-plugin-react)
