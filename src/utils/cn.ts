import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely opens a URL in a new window/tab
 * Prevents hydration errors by checking for window availability
 */
export function safeWindowOpen(url: string, target: string = '_blank'): void {
  if (typeof window !== 'undefined') {
    window.open(url, target);
  }
}
