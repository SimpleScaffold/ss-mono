#!/usr/bin/env node

/**
 * Pre-commit hook - Soft-fail strategy
 * 
 * 원칙:
 * - 로컬 hook은 개발 편의용 (실패해도 커밋 허용)
 * - 모든 강제 검증은 CI에서만 수행
 * - 다양한 환경(WSL/nvm/yarn/corepack/Windows/macOS) 지원
 */

import { execSync, spawnSync } from 'child_process'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = resolve(__dirname, '../../..')

/**
 * 명령어가 사용 가능한지 확인
 */
function hasCommand(cmd) {
    try {
        spawnSync(cmd, ['--version'], {
            stdio: 'ignore',
            shell: process.platform === 'win32',
        })
        return true
    } catch {
        return false
    }
}

/**
 * 명령어 실행 (실패해도 예외 던지지 않음)
 */
function runCommand(cmd, options = {}) {
    try {
        execSync(cmd, {
            cwd: repoRoot,
            stdio: 'inherit',
            shell: process.platform === 'win32',
            env: process.env,
            ...options,
        })
        return true
    } catch {
        return false
    }
}

/**
 * lint-staged 실행 시도
 */
function runLintStaged() {
    console.log('🔍 Running pre-commit checks (local hook - soft-fail)...\n')

    // 실행 방법 목록 (우선순위 순)
    const methods = [
        { name: 'pnpm', cmd: 'pnpm lint-staged' },
        { name: 'yarn', cmd: 'yarn lint-staged' },
        { name: 'npm', cmd: 'npm run lint-staged' },
        { name: 'npx', cmd: 'npx lint-staged' },
    ]

    // node_modules/.bin/lint-staged 직접 실행
    const lintStagedPath = join(repoRoot, 'node_modules', '.bin', 'lint-staged')
    const lintStagedJsPath = join(repoRoot, 'node_modules', 'lint-staged', 'bin', 'lint-staged.js')

    if (existsSync(lintStagedJsPath)) {
        methods.push({
            name: 'node (direct)',
            cmd: `node "${lintStagedJsPath}"`,
        })
    }

    if (existsSync(lintStagedPath)) {
        methods.push({
            name: 'node_modules/.bin',
            cmd: `node "${lintStagedPath}"`,
        })
    }

    // 각 방법 시도
    for (const method of methods) {
        // 패키지 매니저 확인
        if (method.name !== 'node (direct)' && method.name !== 'node_modules/.bin') {
            if (!hasCommand(method.name === 'pnpm' ? 'pnpm' : method.name === 'yarn' ? 'yarn' : 'npm')) {
                continue
            }
        }

        console.log(`  Trying: ${method.name}...`)
        if (runCommand(method.cmd)) {
            console.log('\n✅ Pre-commit checks passed (format & lint)')
            return true
        }
    }

    // 모든 방법 실패
    console.warn('\n⚠️  Local pre-commit checks failed (soft-fail)')
    console.warn('   This is normal - local hooks are for convenience only.')
    console.warn('   Final validation will be done in CI.\n')
    return false
}

// 실행 (실패해도 exit 0 - soft-fail)
try {
    runLintStaged()
    process.exit(0) // 항상 성공으로 종료 (로컬 hook은 관대하게)
} catch (error) {
    console.warn('\n⚠️  Pre-commit hook error (soft-fail):', error.message)
    console.warn('   Continuing with commit...\n')
    process.exit(0) // 실패해도 커밋 허용
}
