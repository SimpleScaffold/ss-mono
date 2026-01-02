/**
 * className 병합 유틸리티 함수
 * TODO: clsx와 tailwind-merge 의존성 추가 필요
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

