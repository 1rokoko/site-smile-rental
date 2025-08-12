/**
 * Content Security Policy (CSP) nonce utilities
 * Provides secure script and style loading for Google Ads compliance
 */

import crypto from 'crypto';

/**
 * Generates a cryptographically secure nonce for CSP
 * Used for inline scripts and styles
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Gets the CSP nonce from request headers
 * Returns undefined if not available (e.g., in client-side code)
 * Note: This function is for server-side use only
 */
export function getCSPNonce(): string | undefined {
  try {
    // Only available on server-side
    if (typeof window !== 'undefined') {
      return undefined;
    }

    // For now, return undefined as we're using client-side injection
    // In a full implementation, this would get the nonce from server context
    return undefined;
  } catch {
    // Headers not available (e.g., in static generation)
    return undefined;
  }
}

/**
 * Creates a secure script tag with CSP nonce
 * For use in server-side rendering
 */
export function createSecureScript(content: string, nonce?: string): string {
  const nonceAttr = nonce ? ` nonce="${nonce}"` : '';
  return `<script${nonceAttr}>${content}</script>`;
}

/**
 * Creates a secure style tag with CSP nonce
 * For use in server-side rendering
 */
export function createSecureStyle(content: string, nonce?: string): string {
  const nonceAttr = nonce ? ` nonce="${nonce}"` : '';
  return `<style${nonceAttr}>${content}</style>`;
}

/**
 * GOOGLE ADS FIX: Removed dynamic script injection
 * This function has been disabled to prevent Google Ads from flagging
 * dynamic DOM manipulation as suspicious behavior
 */
export function injectSecureScript(content: string, id?: string): void {
  console.warn('⚠️ Dynamic script injection disabled for Google Ads compliance');
  // Function disabled - use static script files instead
}

/**
 * GOOGLE ADS FIX: Removed dynamic style injection
 * This function has been disabled to prevent Google Ads from flagging
 * dynamic DOM manipulation as suspicious behavior
 */
export function injectSecureStyle(content: string, id?: string): void {
  console.warn('⚠️ Dynamic style injection disabled for Google Ads compliance');
  // Function disabled - use static CSS files instead
}

/**
 * Validates and sanitizes script content for CSP compliance
 * Removes potentially dangerous patterns
 */
export function sanitizeScriptContent(content: string): string {
  // Remove potentially dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /document\.write\s*\(/gi,
    /innerHTML\s*=/gi,
    /outerHTML\s*=/gi,
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi
  ];

  let sanitized = content;

  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      console.warn('⚠️ Dangerous pattern detected and removed:', pattern);
      sanitized = sanitized.replace(pattern, '/* REMOVED_DANGEROUS_PATTERN */');
    }
  }

  return sanitized;
}

/**
 * CSP policy configuration for different environments
 */
export const CSP_POLICIES = {
  development: {
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: blob: https: http:",
  },
  production: {
    'script-src': "'self' https://www.googletagmanager.com https://www.google-analytics.com",
    'style-src': "'self' https://fonts.googleapis.com",
    'img-src': "'self' data: blob: https:",
  }
};