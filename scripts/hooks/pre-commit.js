#!/usr/bin/env node

/**
 * Pre-commit hook - Soft-fail strategy
 * 모든 환경(WSL, Windows, macOS 등)에서 동작하도록 설계되었습니다.
 */

import { execSync, spawnSync } from 'child_process'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = resolve(__dirname, '../../..')

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

function run(cmd) {
    console.log(`🚀 Running: ${cmd}`)
    execSync(cmd, {
        cwd: repoRoot,
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: process.env,
    })
}

console.log('🔍 [Local Verify] Checking code quality...')

try {
    // 1. 패키지 매니저 시도
    if (hasCommand('yarn')) {
        run('yarn lint-staged')
    } else if (hasCommand('pnpm')) {
        run('pnpm lint-staged')
    } else if (hasCommand('npm')) {
        run('npm run lint-staged')
    } else {
        // 2. 직접 실행 시도
        const directPath = join(repoRoot, 'node_modules/lint-staged/bin/lint-staged.js')
        if (existsSync(directPath)) {
            run(`node "${directPath}"`)
        } else {
            console.warn('⚠️  No package manager or lint-staged found. Skipping local check.')
        }
    }
    console.log('✅ [Local Verify] Done.\n')
} catch (e) {
    console.warn('\n⚠️  [Local Verify] Failed or skipped. Final check will be done in CI.')
    console.warn('   This is normal - local hooks are for convenience only.')
}

// 로컬에서는 무조건 성공으로 처리 (커밋 차단 방지)
process.exit(0)
