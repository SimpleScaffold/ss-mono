/**
 * Cross-platform utilities for scripts
 * 
 * This module provides utilities that work consistently across
 * Windows, macOS, and Linux/WSL environments.
 * 
 * @example
 * ```javascript
 * import { resolvePath, normalizeLineEndings, ensurePathExists } from './scripts/utils/cross-platform.js';
 * 
 * const filePath = resolvePath(__dirname, '../src/index.ts');
 * const content = normalizeLineEndings(await readFile(filePath, 'utf-8'));
 * ```
 */

import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

/**
 * Get __dirname equivalent for ES modules
 * @param {string} importMetaUrl - import.meta.url from the calling module
 * @returns {string} Directory path of the calling module
 */
export function getDirname(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  return dirname(__filename);
}

/**
 * Resolve a path to an absolute path, ensuring cross-platform compatibility
 * Works correctly on Windows, macOS, and Linux/WSL
 * 
 * @param {...string} pathSegments - Path segments to join and resolve
 * @returns {string} Absolute resolved path
 * 
 * @example
 * ```javascript
 * const absolutePath = resolvePath(__dirname, '../src', 'index.ts');
 * // On Windows: C:\project\src\index.ts
 * // On Linux: /home/user/project/src/index.ts
 * ```
 */
export function resolvePath(...pathSegments) {
  return resolve(...pathSegments);
}

/**
 * Normalize line endings to LF (Unix-style) for consistency across platforms
 * Converts CRLF (Windows) and CR (old Mac) to LF
 * 
 * @param {string} content - File content with potentially mixed line endings
 * @returns {string} Content with normalized LF line endings
 * 
 * @example
 * ```javascript
 * const content = await readFile('file.txt', 'utf-8');
 * const normalized = normalizeLineEndings(content);
 * ```
 */
export function normalizeLineEndings(content) {
  if (typeof content !== 'string') {
    return content;
  }
  // Convert CRLF (\r\n) and CR (\r) to LF (\n)
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Ensure a file or directory path exists, throw error if not
 * 
 * @param {string} path - Path to check
 * @param {string} type - Type of path: 'file' or 'directory' (default: 'file')
 * @throws {Error} If path does not exist
 * 
 * @example
 * ```javascript
 * try {
 *   ensurePathExists('/path/to/file.ts', 'file');
 * } catch (error) {
 *   console.error('Path does not exist:', error.message);
 * }
 * ```
 */
export function ensurePathExists(path, type = 'file') {
  if (!existsSync(path)) {
    const typeLabel = type === 'directory' ? 'directory' : 'file';
    throw new Error(`${typeLabel} not found: ${path}`);
  }
}

/**
 * Read a file safely with normalized line endings
 * 
 * @param {string} filePath - Path to the file
 * @param {string} encoding - File encoding (default: 'utf-8')
 * @returns {Promise<string>} File content with normalized line endings
 * 
 * @example
 * ```javascript
 * const content = await readFileSafe('./src/index.ts');
 * ```
 */
export async function readFileSafe(filePath, encoding = 'utf-8') {
  ensurePathExists(filePath, 'file');
  const content = await readFile(filePath, encoding);
  return normalizeLineEndings(content);
}

/**
 * Write a file safely with LF line endings
 * Ensures consistent line endings across all platforms
 * 
 * @param {string} filePath - Path to write the file
 * @param {string} content - Content to write
 * @param {string} encoding - File encoding (default: 'utf-8')
 * @returns {Promise<void>}
 * 
 * @example
 * ```javascript
 * await writeFileSafe('./src/index.ts', 'export const x = 1;\n');
 * ```
 */
export async function writeFileSafe(filePath, content, encoding = 'utf-8') {
  // Ensure content uses LF line endings
  const normalizedContent = normalizeLineEndings(content);
  await writeFile(filePath, normalizedContent, encoding);
}

/**
 * Join path segments in a cross-platform way
 * Wrapper around path.join for consistency
 * 
 * @param {...string} pathSegments - Path segments to join
 * @returns {string} Joined path
 * 
 * @example
 * ```javascript
 * const filePath = joinPath(__dirname, 'src', 'index.ts');
 * ```
 */
export function joinPath(...pathSegments) {
  return join(...pathSegments);
}

/**
 * Check if running on Windows
 * 
 * @returns {boolean} True if running on Windows
 */
export function isWindows() {
  return process.platform === 'win32';
}

/**
 * Check if running on macOS
 * 
 * @returns {boolean} True if running on macOS
 */
export function isMacOS() {
  return process.platform === 'darwin';
}

/**
 * Check if running on Linux (including WSL)
 * 
 * @returns {boolean} True if running on Linux
 */
export function isLinux() {
  return process.platform === 'linux';
}

/**
 * Get platform-specific information
 * 
 * @returns {object} Platform information
 * @returns {string} returns.platform - Platform name ('win32', 'darwin', 'linux')
 * @returns {string} returns.name - Human-readable platform name
 * @returns {string} returns.lineEnding - Default line ending for the platform
 */
export function getPlatformInfo() {
  const platform = process.platform;
  const platformNames = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
  };
  
  return {
    platform,
    name: platformNames[platform] || platform,
    lineEnding: platform === 'win32' ? '\r\n' : '\n',
  };
}

