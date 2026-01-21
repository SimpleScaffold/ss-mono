#!/usr/bin/env node
/**
 * Husky hook 예제
 *
 * 이 파일은 허스키 설정에서 크로스 플랫폼 유틸리티를 사용하는 예제입니다.
 *
 * 사용법:
 * 1. .husky/pre-commit 파일을 생성
 * 2. 이 스크립트를 참고하여 필요한 작업 수행
 */

import {
    readFileSafe,
    writeFileSafe,
    ensurePathExists,
    getPlatformInfo,
} from '../utils/cross-platform.js'

async function preCommitHook() {
    try {
        // 플랫폼 정보 출력 (디버깅용)
        const platform = getPlatformInfo()
        console.log(`Running on ${platform.name} (${platform.platform})`)

        // 예제: index.ts 파일 읽기 및 검증
        const indexPath = './packages/fe/ui/src/index.ts'

        try {
            ensurePathExists(indexPath, 'file')
            const content = await readFileSafe(indexPath)

            // 예제: 특정 패턴 검증
            if (!content.includes('// Common Components')) {
                console.error(
                    'Error: index.ts must contain "// Common Components" marker',
                )
                process.exit(1)
            }

            console.log('✅ Pre-commit checks passed')
        } catch (error) {
            console.error('Pre-commit check failed:', error.message)
            process.exit(1)
        }
    } catch (error) {
        console.error('Hook error:', error.message)
        process.exit(1)
    }
}

// 스크립트로 직접 실행된 경우에만 실행
if (import.meta.url === `file://${process.argv[1]}`) {
    preCommitHook()
}

export { preCommitHook }
