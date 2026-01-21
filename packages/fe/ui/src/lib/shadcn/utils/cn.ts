import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

/**
 * className 병합 유틸리티 함수
 * clsx와 tailwind-merge를 사용하여 클래스명을 병합합니다.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
