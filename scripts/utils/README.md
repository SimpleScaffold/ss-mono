# Scripts Utilities

크로스 플랫폼 스크립트 유틸리티 모음입니다. Windows, macOS, Linux/WSL 환경에서 일관되게 작동합니다.

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
} from './scripts/utils/cross-platform.js';

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

### `resolvePath(...pathSegments)`
절대 경로로 해결합니다. 모든 플랫폼에서 일관되게 작동합니다.

### `normalizeLineEndings(content)`
줄바꿈을 LF로 정규화합니다 (CRLF, CR → LF).

### `ensurePathExists(path, type)`
경로 존재 여부를 확인하고 없으면 에러를 던집니다.

### `readFileSafe(filePath, encoding)`
파일을 읽고 줄바꿈을 자동으로 정규화합니다.

### `writeFileSafe(filePath, content, encoding)`
파일을 쓰고 LF 줄바꿈으로 저장합니다.

### `joinPath(...pathSegments)`
경로를 플랫폼에 맞게 결합합니다.

### `isWindows()`, `isMacOS()`, `isLinux()`
플랫폼 감지 함수들입니다.

### `getPlatformInfo()`
플랫폼 정보를 반환합니다.

