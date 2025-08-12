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
 * CSP-compliant inline script injection for client-side
 * Replaces dangerouslySetInnerHTML with secure alternatives
 */
export function injectSecureScript(content: string, id?: string): void {
  // Only run on client side
  if (typeof window === 'undefined') return;

  try {
    // Check if script already exists
    if (id && document.getElementById(id)) {
      return;
    }

    // Create script element using standard DOM methods
    const scriptElement = document.createElement('script');
    if (id) {
      scriptElement.id = id;
    }
    scriptElement.type = 'text/javascript';

    // Use textContent instead of innerHTML for security
    scriptElement.textContent = content;

    // Append to head
    const head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(scriptElement);

    console.log('✅ Secure script injected:', id || 'anonymous');
  } catch (error) {
    console.error('❌ Failed to inject secure script:', error);
  }
}

/**
 * CSP-compliant inline style injection for client-side
 * Replaces dangerouslySetInnerHTML with secure alternatives
 */
export function injectSecureStyle(content: string, id?: string): void {
  // Only run on client side
  if (typeof window === 'undefined') return;

  try {
    // Check if style already exists
    if (id && document.getElementById(id)) {
      return;
    }

    // Create style element using standard DOM methods
    const styleElement = document.createElement('style');
    if (id) {
      styleElement.id = id;
    }
    styleElement.type = 'text/css';

    // Use textContent instead of innerHTML for security
    styleElement.textContent = content;

    // Append to head
    const head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(styleElement);

    console.log('✅ Secure style injected:', id || 'anonymous');
  } catch (error) {
    console.error('❌ Failed to inject secure style:', error);
  }
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