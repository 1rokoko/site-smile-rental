import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely opens a URL in a new window/tab
 * Enhanced security version - now imports from secure-window utilities
 * Prevents hydration errors by checking for window availability
 */
export function safeWindowOpen(url: string, target: string = '_blank'): void {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.warn('safeWindowOpen called on server side');
    return;
  }

  try {
    // Use the secure window opening function
    const success = window.open(url, target, 'noopener=yes,noreferrer=yes');
    if (success) {
      success.opener = null;
      console.log(`✅ Successfully opened URL: ${url}`);
    } else {
      console.warn('Failed to open window - popup blocked or other issue');
    }
  } catch (error) {
    console.error('Error in safeWindowOpen:', error);
  }
}
