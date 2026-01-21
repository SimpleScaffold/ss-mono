import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

export function getDirname(importMetaUrl) {
    const __filename = fileURLToPath(importMetaUrl)
    return dirname(__filename)
}

export function resolvePath(...pathSegments) {
    return resolve(...pathSegments)
}

export function normalizeLineEndings(content) {
    if (typeof content !== 'string') {
        return content
    }
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

export function ensurePathExists(path, type = 'file') {
    if (!existsSync(path)) {
        const typeLabel = type === 'directory' ? 'directory' : 'file'
        throw new Error(`${typeLabel} not found: ${path}`)
    }
}

export async function readFileSafe(filePath, encoding = 'utf-8') {
    ensurePathExists(filePath, 'file')
    const content = await readFile(filePath, encoding)
    return normalizeLineEndings(content)
}

export async function writeFileSafe(filePath, content, encoding = 'utf-8') {
    const normalizedContent = normalizeLineEndings(content)
    await writeFile(filePath, normalizedContent, encoding)
}

export function joinPath(...pathSegments) {
    return join(...pathSegments)
}

export function isWindows() {
    return process.platform === 'win32'
}

export function isMacOS() {
    return process.platform === 'darwin'
}

export function isLinux() {
    return process.platform === 'linux'
}

export function getPlatformInfo() {
    const platform = process.platform
    const platformNames = {
        win32: 'Windows',
        darwin: 'macOS',
        linux: 'Linux',
    }

    return {
        platform,
        name: platformNames[platform] || platform,
        lineEnding: platform === 'win32' ? '\r\n' : '\n',
    }
}
