# 시작하기

SS Mono Final 프로젝트를 시작하는 방법을 안내합니다.

## 사전 요구사항

- Node.js 18 이상
- Yarn 4.12.0 이상

## 설치

프로젝트 루트에서 다음 명령어를 실행하세요:

```bash
yarn install
```

이 명령어는 모든 워크스페이스의 의존성을 설치합니다.

## 개발 서버 실행

### 모든 애플리케이션 동시 실행

```bash
yarn dev
```

이 명령어는 Turborepo를 사용하여 모든 애플리케이션을 동시에 실행합니다.

### 개별 애플리케이션 실행

특정 애플리케이션만 실행하려면:

```bash
# Vite1 (포트 3001)
cd apps/fe/vite1
yarn dev

# Vite2 (포트 3002)
cd apps/fe/vite2
yarn dev

# Vite3 (포트 3003)
cd apps/fe/vite3
yarn dev
```

## 빌드

모든 패키지와 애플리케이션을 빌드:

```bash
yarn build
```

개별 패키지 빌드:

```bash
cd packages/fe/ui
yarn build
```

## Lint

코드 린트 실행:

```bash
yarn lint
```

## 다음 단계

- [프로젝트 구조](./02-project-structure.md) 확인
- [공통 설정](./03-common-config.md) 이해
- [패키지 가이드](./04-packages/) 참고

