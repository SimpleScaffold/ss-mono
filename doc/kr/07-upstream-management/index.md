# Upstream 저장소 관리

Upstream 저장소를 관리하고 동기화하는 방법을 안내합니다.

## 개요

이 프로젝트는 upstream 저장소의 변경사항을 추적하고, 필요할 때 동기화하는 워크플로우를 사용합니다.

**워크플로우 구조:**

- `upstream-main`: upstream 저장소의 상태를 그대로 보관하는 브랜치
- `main`: 내 작업을 진행하는 브랜치
- 필요할 때 `upstream-main`을 `main`으로 merge/rebase

## 초기 설정

### 1. Upstream 저장소 추가

먼저 upstream 저장소를 remote로 추가합니다:

```bash
git remote add upstream [upstream-repository-url]
```

### 2. Upstream-main 브랜치 생성

upstream 저장소의 main 브랜치를 그대로 가져와서 `upstream-main` 브랜치를 생성합니다:

```bash
git fetch upstream
git checkout -b upstream-main upstream/main
```

이제 `upstream-main` 브랜치는 upstream 저장소의 상태를 그대로 반영합니다.

## 업데이트 방법

### Upstream-main 브랜치 갱신

upstream 저장소의 최신 변경사항을 가져와서 `upstream-main` 브랜치를 업데이트합니다:

```bash
git checkout upstream-main
git pull upstream main
```

### Main 브랜치에 합치기

`upstream-main`의 변경사항을 `main` 브랜치에 합칩니다:

#### Merge 방식

```bash
git checkout main
git merge upstream-main
```

#### Rebase 방식 (선택사항)

히스토리를 깔끔하게 유지하고 싶다면 rebase를 사용할 수 있습니다:

```bash
git checkout main
git rebase upstream-main
```

**⚠️ 주의**: rebase는 이미 push한 커밋이 있다면 히스토리를 재작성하므로, 협업 중이라면 주의가 필요합니다.

## 워크플로우 예시

### 시나리오 1: 정기적인 동기화

```bash
# 1. upstream-main 브랜치로 전환
git checkout upstream-main

# 2. upstream 저장소에서 최신 변경사항 가져오기
git pull upstream main

# 3. main 브랜치로 전환
git checkout main

# 4. upstream-main의 변경사항을 main에 merge
git merge upstream-main

# 5. 필요시 push
git push origin main
```

### 시나리오 2: 충돌 해결

merge 시 충돌이 발생한 경우:

```bash
# 충돌 파일 확인
git status

# 충돌 해결 후
git add .
git commit -m "Merge upstream-main into main"
```

## 브랜치 구조

```
upstream/main (원격)
    ↓
upstream-main (로컬, upstream 상태 보관)
    ↓
main (로컬, 내 작업)
    ↓
origin/main (원격, 내 작업)
```

## 팁

### Upstream 변경사항 확인

merge 전에 upstream의 변경사항을 미리 확인:

```bash
git checkout upstream-main
git log main..upstream-main  # main에 없는 커밋 확인
git diff main..upstream-main  # 변경사항 diff 확인
```

### 선택적 Merge

모든 변경사항이 아닌 특정 커밋만 가져오고 싶다면:

```bash
git checkout main
git cherry-pick <commit-hash>
```

### Upstream-main 브랜치 유지

`upstream-main` 브랜치는 upstream 저장소의 순수한 상태를 유지하는 것이 목적이므로, 이 브랜치에는 직접 커밋하지 마세요.

## 주의사항

1. **Upstream-main 브랜치**: upstream 저장소의 상태를 그대로 보관하는 용도로만 사용
2. **충돌 해결**: merge 시 충돌이 발생하면 신중하게 해결
3. **Rebase 주의**: 이미 push한 커밋이 있다면 rebase 사용 시 주의 필요
4. **정기 동기화**: upstream의 변경사항을 정기적으로 확인하고 동기화

## GitHub Actions와의 관계

GitHub Actions를 사용하는 경우, 자동으로 upstream을 동기화하는 워크플로우를 설정할 수 있습니다. 하지만 로컬에서 수동으로 관리하는 경우 위의 방법을 사용합니다.

## 관련 문서

- [프로젝트 구조](../02-project-structure/) - 프로젝트 구조 이해
- [시작하기](../01-getting-started/) - 기본 설정
