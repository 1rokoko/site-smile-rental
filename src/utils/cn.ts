import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * GOOGLE ADS FIX: Disabled window opening functionality
 * This function has been disabled to prevent Google Ads from flagging
 * window.open() as suspicious behavior
 */
export function safeWindowOpen(url: string, target: string = '_blank'): void {
  console.warn('⚠️ Window opening disabled for Google Ads compliance');
  console.log(`Attempted to open URL: ${url} (blocked for compliance)`);
}
