import { readdir } from 'fs/promises'
import {
    getDirname,
    resolvePath,
    readFileSafe,
    writeFileSafe,
    ensurePathExists,
    joinPath,
} from '../../../../scripts/utils/cross-platform.js'

const __dirname = getDirname(import.meta.url)

const UI_DIR = resolvePath(__dirname, '../src/lib/shadcn/ui')
const INDEX_FILE = resolvePath(__dirname, '../src/index.ts')
const SRC_DIR = resolvePath(__dirname, '../src')
const EXPORTS_DIR = resolvePath(__dirname, '../src/exports')
const PACKAGE_JSON = resolvePath(__dirname, '../package.json')

async function getComponentExports(filePath) {
    try {
        const content = await readFileSafe(filePath)
        const exportMatches = content.match(/export\s+(?:type\s+)?\{([^}]+)\}/g)

        if (!exportMatches) return null

        const exports = []
        for (const match of exportMatches) {
            const items = match.match(/\{([^}]+)\}/)?.[1]
            if (items) {
                const names = items
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0)
                exports.push(...names)
            }
        }

        return exports.length > 0 ? exports : null
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error)
        return null
    }
}

async function getTypeExports(filePath) {
    try {
        const content = await readFileSafe(filePath)
        const types = []

        const typeExportMatches = content.match(/export\s+type\s+\{([^}]+)\}/g)
        if (typeExportMatches) {
            for (const match of typeExportMatches) {
                const items = match.match(/\{([^}]+)\}/)?.[1]
                if (items) {
                    const names = items
                        .split(',')
                        .map((s) => s.trim().split(/\s+as\s+/)[0])
                    types.push(...names)
                }
            }
        }

        const interfaceMatches = content.match(/export\s+interface\s+(\w+)/g)
        if (interfaceMatches) {
            for (const match of interfaceMatches) {
                const name = match.match(/export\s+interface\s+(\w+)/)?.[1]
                if (name) {
                    types.push(name)
                }
            }
        }

        return types.length > 0 ? types : null
    } catch (error) {
        return null
    }
}

async function updateIndexFile() {
    try {
        ensurePathExists(UI_DIR, 'directory')
        ensurePathExists(INDEX_FILE, 'file')

        const files = await readdir(UI_DIR)
        const componentFiles = files.filter((f) => {
            if (!f.endsWith('.tsx') && !f.endsWith('.ts')) {
                return false
            }
            if (isExcludedFileName(f)) {
                console.log(`⚠️  Excluding file: ${f}`)
                return false
            }
            return true
        })

        console.log(
            `Found ${componentFiles.length} component files: ${componentFiles.join(', ')}`,
        )

        const components = []

        for (const file of componentFiles) {
            const filePath = joinPath(UI_DIR, file)
            const componentName = file.replace(/\.(tsx|ts)$/, '')

            const exports = await getComponentExports(filePath)
            const typeExports = await getTypeExports(filePath)

            console.log(
                `Processing ${componentName}: exports=${exports?.length || 0}, types=${typeExports?.length || 0}`,
            )

            if (exports && exports.length > 0) {
                components.push({
                    name: componentName,
                    exports: exports,
                    types: typeExports || [],
                })
            }
        }

        if (components.length === 0) {
            console.warn('No components found to export')
            return
        }

        console.log(
            'ℹ️  Skipping index.ts update - using sub-path exports only',
        )
        console.log(
            `   Components will be available via: @repo/fe-ui/${components.map((c) => c.name).join(', @repo/fe-ui/')}`,
        )

        return components
    } catch (error) {
        console.error('Error updating index.ts:', error.message)
        if (error.stack) {
            console.error(error.stack)
        }
        process.exit(1)
    }
}

const EXCLUDED_PATTERNS = [
    /^stories?\./i, // stories, story
    /\.stories?\./i, // *.stories.ts
    /\.test\./i, // *.test.ts
    /\.spec\./i, // *.spec.ts
    /\.mock\./i, // *.mock.ts
    /\.d\.ts$/i, // *.d.ts (타입 선언 파일)
]

function isExcludedFileName(fileName) {
    return EXCLUDED_PATTERNS.some((pattern) => pattern.test(fileName))
}

async function createEntryPointFiles(components) {
    try {
        await ensurePathExists(EXPORTS_DIR, 'directory')

        for (const comp of components) {
            if (isExcludedFileName(comp.name)) {
                console.warn(`⚠️  Skipping excluded file: ${comp.name}.ts`)
                continue
            }

            const entryPointPath = joinPath(EXPORTS_DIR, `${comp.name}.ts`)

            const validExports = comp.exports.filter(
                (e) => e && e.trim().length > 0,
            )

            if (validExports.length === 0) {
                console.warn(
                    `⚠️  No valid exports found for ${comp.name}, skipping entry point file`,
                )
                continue
            }

            let content = ''

            if (validExports.length === 1) {
                content += `export { ${validExports[0]} } from '../lib/shadcn/ui/${comp.name}';\n`
            } else {
                content += `export {\n  ${validExports.join(',\n  ')},\n} from '../lib/shadcn/ui/${comp.name}';\n`
            }

            const validTypes = comp.types.filter(
                (t) => t && t.trim().length > 0,
            )
            if (validTypes.length > 0) {
                content += '\n'
                for (const type of validTypes) {
                    content += `export type { ${type} } from '../lib/shadcn/ui/${comp.name}';\n`
                }
            }

            await writeFileSafe(entryPointPath, content)
            console.log(`✅ Created entry point: exports/${comp.name}.ts`)
        }
    } catch (error) {
        console.error('Error creating entry point files:', error.message)
        if (error.stack) {
            console.error(error.stack)
        }
        process.exit(1)
    }
}

async function updatePackageJson(components) {
    try {
        const packageJsonContent = await readFileSafe(PACKAGE_JSON)
        const packageJson = JSON.parse(packageJsonContent)

        const existingExports = { ...packageJson.exports }

        const newExports = {
            './*': {
                import: './src/exports/*.ts',
                types: './src/exports/*.ts',
            },
        }

        Object.keys(existingExports).forEach((key) => {
            if (key.startsWith('./styles')) {
                newExports[key] = existingExports[key]
            }
        })

        packageJson.exports = newExports

        const updatedContent = JSON.stringify(packageJson, null, 2) + '\n'
        await writeFileSafe(PACKAGE_JSON, updatedContent)
        console.log('✅ package.json exports updated successfully!')
        console.log('   Using wildcard pattern: ./src/exports/*.ts')
    } catch (error) {
        console.error('Error updating package.json:', error.message)
        if (error.stack) {
            console.error(error.stack)
        }
        process.exit(1)
    }
}

async function main() {
    const components = await updateIndexFile()
    await createEntryPointFiles(components)
    await updatePackageJson(components)
    console.log('\n🎉 All exports updated successfully!')
}

main()
