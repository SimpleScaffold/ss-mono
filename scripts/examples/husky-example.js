#!/usr/bin/env node

import {
    readFileSafe,
    writeFileSafe,
    ensurePathExists,
    getPlatformInfo,
} from '../utils/cross-platform.js'

async function preCommitHook() {
    try {
        const platform = getPlatformInfo()
        console.log(`Running on ${platform.name} (${platform.platform})`)

        const indexPath = './packages/fe/ui/src/index.ts'

        try {
            ensurePathExists(indexPath, 'file')
            const content = await readFileSafe(indexPath)

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

if (import.meta.url === `file://${process.argv[1]}`) {
    preCommitHook()
}

export { preCommitHook }
