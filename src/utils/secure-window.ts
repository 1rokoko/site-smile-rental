/**
 * Security-compliant window utilities
 * Replaces potentially suspicious window manipulation patterns
 * Google Ads compliant implementation
 */

/**
 * Safely opens a URL in a new window/tab with enhanced security
 * Replaces the basic safeWindowOpen function with more robust security
 */
export function secureWindowOpen(url: string, target: string = '_blank'): boolean {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.warn('secureWindowOpen called on server side');
    return false;
  }

  try {
    // Validate URL to prevent malicious redirects
    if (!isValidURL(url)) {
      console.error('Invalid URL provided to secureWindowOpen:', url);
      return false;
    }

    // Use explicit security features for new windows
    const windowFeatures = [
      'noopener=yes',
      'noreferrer=yes',
      'popup=yes'
    ].join(',');

    // Open window with security features
    const newWindow = window.open(url, target, windowFeatures);

    // Additional security: Clear opener reference
    if (newWindow) {
      newWindow.opener = null;
      console.log(`✅ Securely opened URL: ${url}`);
      return true;
    } else {
      console.warn('Failed to open window - popup blocked?');
      return false;
    }
  } catch (error) {
    console.error('Error in secureWindowOpen:', error);
    return false;
  }
}

/**
 * Validates URLs to prevent malicious redirects
 * Ensures only safe URLs are opened
 */
function isValidURL(url: string): boolean {
  try {
    // Allow relative URLs starting with /
    if (url.startsWith('/')) {
      return true;
    }

    // Parse absolute URLs
    const urlObj = new URL(url);

    // Allow only HTTPS and HTTP protocols
    if (!['https:', 'http:'].includes(urlObj.protocol)) {
      return false;
    }

    // Block suspicious patterns
    const suspiciousPatterns = [
      'javascript:',
      'data:',
      'vbscript:',
      'file:',
      'ftp:'
    ];

    const lowerUrl = url.toLowerCase();
    for (const pattern of suspiciousPatterns) {
      if (lowerUrl.includes(pattern)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('URL validation error:', error);
    return false;
  }
}

/**
 * Security-compliant navigation function
 * Alternative to window.location manipulation
 */
export function secureNavigate(url: string, replace: boolean = false): boolean {
  // Only run on client side
  if (typeof window === 'undefined') {
    console.warn('secureNavigate called on server side');
    return false;
  }

  try {
    // Validate URL
    if (!isValidURL(url)) {
      console.error('Invalid URL provided to secureNavigate:', url);
      return false;
    }

    // Use secure navigation
    if (replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }

    console.log(`✅ Securely navigated to: ${url}`);
    return true;
  } catch (error) {
    console.error('Error in secureNavigate:', error);
    return false;
  }
}

/**
 * Enhanced contact button handler
 * Replaces the basic click handlers with security validation
 */
export function handleContactClick(contactType: 'telegram' | 'whatsapp', url: string): void {
  // Validate contact type and URL
  const allowedDomains = {
    telegram: ['t.me', 'telegram.me'],
    whatsapp: ['api.whatsapp.com', 'wa.me', 'whatsapp.com']
  };

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    // Check if domain is allowed for this contact type
    const allowed = allowedDomains[contactType].some(allowedDomain =>
      domain === allowedDomain || domain.endsWith('.' + allowedDomain)
    );

    if (!allowed) {
      console.error(`Invalid domain for ${contactType}: ${domain}`);
      return;
    }

    // Open securely
    const success = secureWindowOpen(url, '_blank');

    if (success) {
      // Optional: Track contact interaction securely
      console.log(`✅ Contact opened: ${contactType}`);
    }
  } catch (error) {
    console.error(`Error handling ${contactType} contact:`, error);
  }
}

/**
 * Backward compatibility function
 * Maintains the same API as the original safeWindowOpen
 */
export function safeWindowOpen(url: string, target: string = '_blank'): void {
  secureWindowOpen(url, target);
}