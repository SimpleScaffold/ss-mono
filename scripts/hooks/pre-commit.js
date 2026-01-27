#!/usr/bin/env node

/**
 * Pre-commit hook for cross-platform compatibility
 * Supports Windows, Linux, macOS, and WSL
 */

import { execSync } from 'child_process'
import { getPlatformInfo } from '../utils/cross-platform.js'

function runLintStaged() {
    try {
        const platform = getPlatformInfo()
        console.log(`🔍 Running pre-commit checks on ${platform.name}...`)

        // yarn lint-staged 실행
        // yarn이 PATH에 있으므로 직접 실행 가능
        execSync('yarn lint-staged', {
            stdio: 'inherit',
            shell: process.platform === 'win32' ? true : false,
        })

        console.log('✅ Pre-commit checks passed')
    } catch (error) {
        console.error('❌ Pre-commit checks failed')
        process.exit(1)
    }
}

runLintStaged()
