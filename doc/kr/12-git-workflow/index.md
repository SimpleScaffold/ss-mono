# Git 워크플로우 및 커밋 가이드

이 가이드는 Husky와 lint-staged를 사용한 코드 품질 관리와 WSL 환경에서의 커밋 방법을 설명합니다.

## 📋 목차

- [Husky & lint-staged 소개](#husky--lint-staged-소개)
- [WSL 환경에서의 커밋 (GitHub Desktop 포함)](#wsl-환경에서의-커밋-github-desktop-포함)
- [바뀐 파일만 포맷팅 및 린트](#바뀐-파일만-포맷팅-및-린트)
- [주의사항 및 문제 해결](#주의사항-및-문제-해결)

## Husky & lint-staged 소개

프로젝트에서는 커밋 전(pre-commit)에 자동으로 코드를 검사하여 품질을 유지합니다.

- **Husky**: Git Hook을 쉽게 관리할 수 있게 해주는 도구입니다.
- **lint-staged**: Git의 `Staged` 상태인 파일(커밋 예정인 파일)에 대해서만 특정 명령어를 실행해주는 도구입니다.

이 조합을 통해 전체 프로젝트가 아닌, **내가 수정한 파일에 대해서만** 자동으로 포맷팅과 린트 검사가 수행됩니다.

## WSL 환경에서의 커밋 (GitHub Desktop 포함)

WSL에서 프로젝트를 진행하지만 Windows에 설치된 GitHub Desktop이나 Sourcetree 같은 GUI 클라이언트를 사용하는 경우, Git Hook이 WSL 내부의 개발 환경(Node.js, Yarn 등)을 찾지 못하는 문제가 발생할 수 있습니다.

이를 해결하기 위해 프로젝트의 `.husky/pre-commit` 스크립트는 다음과 같이 동작합니다:

1.  **환경 감지**: 커밋이 시도된 곳이 Windows인지 WSL 내부인지 자동으로 감지합니다.
2.  **WSL 프록시**: Windows(Git Bash 등)에서 커밋을 시도하면 자동으로 WSL 내부의 쉘(`zsh` 또는 `bash`)을 호출합니다.
3.  **환경 로드**: WSL 내부의 NVM, Corepack 설정을 자동으로 로드하여 정확한 `yarn` 위치를 찾아 실행합니다.

### 장점

- Windows 클라이언트에서도 별도의 설정 없이 커밋만 하면 WSL 내부의 린트 도구가 작동합니다.
- 프로젝트 내부에 `yarn` 경로를 하드코딩하지 않고 실행 시점에 동적으로 찾아내어 유연합니다.

## 바뀐 파일만 포맷팅 및 린트

커밋 시 실행되는 프로세스는 다음과 같습니다:

1.  수정된 파일 중 커밋할 파일들을 선택(Stage)합니다.
2.  커밋 버튼을 누르면 `.husky/pre-commit`이 실행됩니다.
3.  `lint-staged`가 호출되어 스테이징된 파일들을 검사합니다.
    - `*.{js,jsx,ts,tsx}`: `prettier`로 포맷팅 후 `eslint`로 린트 검사
    - `*.{json,css,scss,md}`: `prettier`로 포맷팅만 수행
4.  문제가 없다면 자동으로 포맷팅된 내용이 커밋에 포함됩니다.

## 주의사항 및 문제 해결

### 1. 부분 스테이징과 충돌 방지 (`--no-stash`)

파일의 일부 줄만 선택해서 커밋할 때 `lint-staged`가 원래 파일을 임시 보관(Stash)하면서 충돌이 발생할 수 있습니다. 이를 방지하기 위해 프로젝트에서는 `--no-stash` 옵션을 사용합니다.

### 2. "command not found: yarn" 오류 발생 시

만약 커밋 중 `yarn`을 찾지 못한다는 메시지가 나오면 다음을 확인하세요:

- WSL 내부에 `zsh`가 설치되어 있고 `.zshrc`에 NVM 설정이 되어 있는지 확인합니다.
- `corepack enable` 명령어를 통해 Yarn 4가 활성화되어 있는지 확인합니다.

### 3. 강제 커밋이 필요한 경우

린트 오류를 무시하고 긴급하게 커밋해야 할 경우(권장하지 않음):

```bash
git commit -m "your message" --no-verify
```

GUI 클라이언트에서는 보통 "Commit anyway" 버튼이나 설정을 통해 가능합니다.

---

이 가이드를 통해 모든 팀원이 일관된 코드 스타일을 유지하고, 환경에 구애받지 않는 안정적인 개발 환경을 구축할 수 있습니다.
