# 스크립트 유틸리티

크로스 플랫폼 스크립트 유틸리티 모음입니다. Windows, macOS, Linux/WSL 환경에서 일관되게 작동합니다.

## 개요

`scripts/utils/cross-platform.js`는 모노레포 내의 스크립트에서 사용하는 크로스 플랫폼 유틸리티 함수들을 제공합니다.

## 사용법

### 기본 사용

```javascript
import {
  getDirname,
  resolvePath,
  normalizeLineEndings,
  ensurePathExists,
  readFileSafe,
  writeFileSafe,
  joinPath,
  isWindows,
  isMacOS,
  isLinux,
  getPlatformInfo,
} from '../../../../scripts/utils/cross-platform.js';

// ES 모듈에서 __dirname 가져오기
const __dirname = getDirname(import.meta.url);

// 크로스 플랫폼 경로 해결
const filePath = resolvePath(__dirname, '../src/index.ts');

// 파일 읽기 (줄바꿈 자동 정규화)
const content = await readFileSafe(filePath);

// 파일 쓰기 (LF 줄바꿈으로 저장)
await writeFileSafe(filePath, content);
```

### 허스키 설정 예제

`.husky/pre-commit` 파일에서 사용:

```bash
#!/usr/bin/env node
import { readFileSafe, writeFileSafe } from '../../scripts/utils/cross-platform.js';

// 파일 읽기 및 정규화
const content = await readFileSafe('./src/index.ts');

// 변경사항 적용
const newContent = content.replace(/old/g, 'new');

// 파일 쓰기
await writeFileSafe('./src/index.ts', newContent);
```

## API

### `getDirname(importMetaUrl)`

ES 모듈에서 `__dirname`을 가져옵니다.

**매개변수:**
- `importMetaUrl`: `import.meta.url` 값

**반환값:**
- 현재 파일의 디렉토리 경로

**예시:**
```javascript
const __dirname = getDirname(import.meta.url);
```

### `resolvePath(...pathSegments)`

절대 경로로 해결합니다. 모든 플랫폼에서 일관되게 작동합니다.

**매개변수:**
- `...pathSegments`: 경로 세그먼트들

**반환값:**
- 해결된 절대 경로

**예시:**
```javascript
const filePath = resolvePath(__dirname, '../src/index.ts');
```

### `normalizeLineEndings(content)`

줄바꿈을 LF로 정규화합니다 (CRLF, CR → LF).

**매개변수:**
- `content`: 정규화할 문자열

**반환값:**
- LF 줄바꿈으로 정규화된 문자열

**예시:**
```javascript
const normalized = normalizeLineEndings(content);
```

### `ensurePathExists(path, type)`

경로 존재 여부를 확인하고 없으면 에러를 던집니다.

**매개변수:**
- `path`: 확인할 경로
- `type`: `'file'` 또는 `'directory'`

**예시:**
```javascript
ensurePathExists('./src', 'directory');
ensurePathExists('./src/index.ts', 'file');
```

### `readFileSafe(filePath, encoding)`

파일을 읽고 줄바꿈을 자동으로 정규화합니다.

**매개변수:**
- `filePath`: 읽을 파일 경로
- `encoding`: 인코딩 (기본값: `'utf-8'`)

**반환값:**
- 파일 내용 (Promise)

**예시:**
```javascript
const content = await readFileSafe('./src/index.ts');
```

### `writeFileSafe(filePath, content, encoding)`

파일을 쓰고 LF 줄바꿈으로 저장합니다.

**매개변수:**
- `filePath`: 쓸 파일 경로
- `content`: 파일 내용
- `encoding`: 인코딩 (기본값: `'utf-8'`)

**예시:**
```javascript
await writeFileSafe('./src/index.ts', content);
```

### `joinPath(...pathSegments)`

경로를 플랫폼에 맞게 결합합니다.

**매개변수:**
- `...pathSegments`: 경로 세그먼트들

**반환값:**
- 결합된 경로

**예시:**
```javascript
const path = joinPath(__dirname, '../src', 'index.ts');
```

### `isWindows()`, `isMacOS()`, `isLinux()`

플랫폼 감지 함수들입니다.

**반환값:**
- `boolean`: 플랫폼 일치 여부

**예시:**
```javascript
if (isWindows()) {
  // Windows 특정 로직
}
```

### `getPlatformInfo()`

플랫폼 정보를 반환합니다.

**반환값:**
- 플랫폼 정보 객체

**예시:**
```javascript
const info = getPlatformInfo();
console.log(info.platform); // 'win32', 'darwin', 'linux'
```

## 사용 사례

이 유틸리티는 다음 스크립트에서 사용됩니다:

- `packages/fe/ui/scripts/update-exports.js` - 컴포넌트 export 자동 업데이트
- `packages/fe/ui/scripts/shadcn-wrapper.js` - shadcn 컴포넌트 추가 래퍼
- `packages/fe/ui/scripts/watch-components.js` - 파일 감시 스크립트

## 관련 문서

- [프로젝트 구조](../02-project-structure.md) - 스크립트 위치
- [shadcn/ui 가이드](../05-shadcn-guide.md) - 스크립트 사용 예시

