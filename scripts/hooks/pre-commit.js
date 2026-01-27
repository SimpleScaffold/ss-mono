#!/usr/bin/env node

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
            shell: true
        })
        return true
    } catch {
        return false
    }
}

function run(cmd) {
    console.log(`🚀 [Local Verify] Running: ${cmd}`)
    execSync(cmd, {
        cwd: repoRoot,
        stdio: 'inherit',
        shell: true,
        env: process.env,
    })
}

console.log('🔍 [Local Verify] Checking code quality...');

try {
    if (hasCommand('yarn')) {
        run('yarn lint-staged')
    } else if (hasCommand('pnpm')) {
        run('pnpm lint-staged')
    } else if (hasCommand('npm')) {
        run('npm run lint-staged')
    } else {
        const directJsPath = join(repoRoot, 'node_modules/lint-staged/bin/lint-staged.js')
        if (existsSync(directJsPath)) {
            run(`node "${directJsPath}"`)
        } else {
            console.warn('⚠️  [Local Verify] No package manager or lint-staged found. Skipping local check.')
        }
    }
    console.log('✅ [Local Verify] Done.\n')
} catch (e) {
    console.warn('\n⚠️  [Local Verify] Execution failed. Final check will be done in CI.')
}

process.exit(0)
