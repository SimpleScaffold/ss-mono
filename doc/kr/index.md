# SS Mono Final 문서

SS Mono Final 모노레포 프로젝트의 전체 문서입니다.

## 📚 목차

### 1. [시작하기](./01-getting-started/)

- 프로젝트 설치
- 개발 서버 실행
- 빌드 방법

### 2. [프로젝트 구조](./02-project-structure/)

- 모노레포 구조 설명
- Apps 구조
- Packages 구조

### 3. [공통 설정](./03-common-config/)

- TypeScript 설정
- ESLint 설정
- Path Mapping
- Workspace 설정

### 4. [패키지 가이드](./04-packages/)

- [@repo/fe-ui](./04-packages/fe-ui.md) - 공통 UI 컴포넌트 패키지
- [@repo/fe-utils](./04-packages/fe-utils.md) - 공통 유틸리티 패키지

### 5. [shadcn/ui 가이드](./05-shadcn-guide/)

- 컴포넌트 추가 방법
- 파일 구조
- 사용 방법

### 6. [스크립트 유틸리티](./06-scripts/utils.md)

- 크로스 플랫폼 유틸리티
- API 문서

### 7. [Upstream 저장소 관리](./07-upstream-management/)

- Upstream 저장소 동기화
- 브랜치 관리
- Merge/Rebase 방법

### 8. [Shell + Micro Apps 아키텍처](./08-shell-micro-apps/)

- 모듈 페더레이션 기반 아키텍처
- Shell 앱 (hostapp1) 역할 및 설정
- Micro Apps (remoteapp1, remoteapp2) 역할 및 설정
- [Host 앱과 Remote 앱 기능 정의](./08-shell-micro-apps/host-remote-features.md) - 기능 분리 가이드
- 라이브러리 및 의존성 관리
- 스타일링 시스템
- 개발 워크플로우 및 배포 전략

### 9. [환경 설정 가이드](./09-environment-config/)

- 환경별 설정 관리 (로컬, 개발 서버, 프로덕션)
- 환경 변수 사용법
- 초기 설정 방법
- 보안 고려사항
- Nginx 리버스 프록시 지원

### 10. [Cesium 지도 가이드](./10-cesium-guide/)

- Cesium 3D 지도 통합 및 사용법
- Redux 기반 상태 관리
- UI 컴포넌트 및 유틸리티 함수
- 설정 및 커스터마이징
- 예제 및 문제 해결

### 11. [코드 품질 관리](./11-code-quality/)

- Prettier 설정 및 사용법
- ESLint 설정 및 사용법
- 코드 포맷팅 및 린팅 가이드
- IDE 통합 방법
- 문제 해결

## 🚀 빠른 시작

```bash
# 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build
```

## 📖 추가 정보

더 자세한 내용은 각 섹션의 문서를 참고하세요.
