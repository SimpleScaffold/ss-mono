#!/usr/bin/env node

/**
 * Remote 앱들이 준비될 때까지 대기하는 스크립트
 * Remote 앱의 manifest 파일이 준비되면 "✓ Remote app is ready" 메시지를 출력하고 종료합니다.
 */

import http from 'http'

const HTTP_TIMEOUT_MS = 1000
const MAX_RETRIES = 60 // 최대 60초 대기
const RETRY_DELAY_MS = 1000

const REMOTE_APP_URLS = {
    remoteapp1: 'http://localhost:12000/mf-manifest.json',
    remoteapp2: 'http://localhost:12001/mf-manifest.json',
}

function waitForRemoteApp(
    remoteUrl,
    remoteName,
    maxRetries = MAX_RETRIES,
    delay = RETRY_DELAY_MS,
) {
    return new Promise((resolve) => {
        let retryCount = 0

        const attemptConnection = async () => {
            try {
                await new Promise((resolve, reject) => {
                    const request = http.get(remoteUrl, (response) => {
                        if (response.statusCode === 200) {
                            resolve()
                        } else {
                            reject(
                                new Error(
                                    `HTTP ${response.statusCode ?? 'unknown'}`,
                                ),
                            )
                        }
                    })

                    request.on('error', reject)
                    request.setTimeout(HTTP_TIMEOUT_MS, () => {
                        request.destroy()
                        reject(new Error('Connection timeout'))
                    })
                })

                console.log(`✓ ${remoteName} is ready`)
                resolve()
            } catch (error) {
                retryCount++

                if (retryCount === 1) {
                    console.log(`⏳ Waiting for ${remoteName} to be ready...`)
                }

                if (retryCount >= maxRetries) {
                    console.warn(
                        `⚠ ${remoteName} did not become ready after ${maxRetries} attempts, continuing anyway...`,
                    )
                    resolve()
                    return
                }

                await new Promise((resolve) => setTimeout(resolve, delay))
                return attemptConnection()
            }
        }

        attemptConnection()
    })
}

async function main() {
    await Promise.all([
        waitForRemoteApp(REMOTE_APP_URLS.remoteapp1, 'remoteapp1'),
        waitForRemoteApp(REMOTE_APP_URLS.remoteapp2, 'remoteapp2'),
    ])

    console.log('✓ All remote apps are ready')
    process.exit(0)
}

main().catch((error) => {
    console.error('Error waiting for remote apps:', error)
    process.exit(1)
})
