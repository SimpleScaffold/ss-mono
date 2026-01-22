import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'

/**
 * 폰트 파일을 자동으로 preload하는 Vite 플러그인
 * 
 * 사용법:
 * ```ts
 * import { fontPreloadPlugin } from '../../../../scripts/utils/vite-font-preload-plugin'
 * 
 * export default defineConfig({
 *   plugins: [
 *     fontPreloadPlugin(),
 *   ],
 * })
 * ```
 */
export function fontPreloadPlugin(): Plugin {
    return {
        name: 'vite-font-preload',
        transformIndexHtml: {
            order: 'pre',
            handler(html, ctx) {
                const repoRoot = path.resolve(__dirname, '../../../../')
                const fontDir = path.resolve(
                    repoRoot,
                    'packages/fe/ui/src/assets/fonts'
                )

                if (!fs.existsSync(fontDir)) {
                    return html
                }

                const preloadLinks: string[] = []

                // 가장 중요한 폰트만 preload (Regular weight)
                // 필요시 다른 weight도 추가 가능
                const preloadFonts = [
                    'Pretendard-Regular',
                    // 필요시 추가:
                    // 'Pretendard-Medium',
                    // 'Pretendard-SemiBold',
                ]

                function walk(dir: string) {
                    if (!fs.existsSync(dir)) return

                    const files = fs.readdirSync(dir)
                    for (const file of files) {
                        const fullPath = path.join(dir, file)
                        const stat = fs.statSync(fullPath)

                        if (stat.isDirectory()) {
                            walk(fullPath)
                        } else if (file.endsWith('.woff2')) {
                            // woff2만 preload (더 작고 빠름)
                            const fontName = file.split('.')[0]
                            if (preloadFonts.includes(fontName)) {
                                // Vite의 public path를 사용하여 올바른 경로 생성
                                const relativePath = path
                                    .relative(repoRoot, fullPath)
                                    .replace(/\\/g, '/')
                                const publicPath = `/${relativePath}`

                                preloadLinks.push(
                                    `<link rel="preload" href="${publicPath}" as="font" type="font/woff2" crossorigin="anonymous">`
                                )
                            }
                        }
                    }
                }

                walk(fontDir)

                if (preloadLinks.length > 0) {
                    return html.replace(
                        '</head>',
                        `    ${preloadLinks.join('\n    ')}\n</head>`
                    )
                }

                return html
            },
        },
    }
}
