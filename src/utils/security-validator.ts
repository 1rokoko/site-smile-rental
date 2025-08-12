/**
 * Security validator for Google Ads compliance
 * Checks for potentially dangerous JavaScript patterns
 */

export interface SecurityReport {
  isSecure: boolean;
  issues: string[];
  warnings: string[];
  recommendations: string[];
}

/**
 * Validates the current page for Google Ads compliance
 */
export function validatePageSecurity(): SecurityReport {
  const issues: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check for dangerous patterns in the DOM (heuristics tuned to avoid false positives in Next.js dev)
  if (typeof window !== 'undefined') {
    const isDev = process.env.NODE_ENV === 'development';

    // Note: React props like dangerouslySetInnerHTML never appear in the DOM.
    // Scanning for that substring in HTML yields false positives from framework internals.
    // Therefore we intentionally DO NOT check for it here.

    // Check for document.write in live DOM only (rare and truly dangerous)
    const htmlContent = document.documentElement.outerHTML;
    if (htmlContent.includes('document.write')) {
      issues.push('document.write usage detected');
    }

    // In development, Next.js may include eval/Function in its dev overlay/runtime.
    // Avoid flagging these in dev; only flag in production builds.
    if (!isDev) {
      if (htmlContent.includes('eval(')) {
        issues.push('eval() usage detected');
      }
      if (htmlContent.includes('Function(')) {
        issues.push('Function() constructor usage detected');
      }
    }

    // Check for inline event handlers
    const inlineEvents = document.querySelectorAll('[onclick], [onload], [onerror], [onmouseover]');
    if (inlineEvents.length > 0) {
      warnings.push(`${inlineEvents.length} inline event handlers found`);
    }

    // Check for external scripts
    const externalScripts = Array.from(document.querySelectorAll('script[src]'))
      .filter(script => {
        const src = (script as HTMLScriptElement).src;
        return src && !src.includes(window.location.hostname) && 
               !src.includes('googletagmanager.com') && 
               !src.includes('google-analytics.com');
      });

    if (externalScripts.length > 0) {
      warnings.push(`${externalScripts.length} external scripts from non-Google domains`);
    }

    // Check for missing CSP
    const metaCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!metaCsp) {
      recommendations.push('Consider adding Content-Security-Policy meta tag');
    }

    // Check for HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push('Site not served over HTTPS');
    }
  }

  const isSecure = issues.length === 0;

  return {
    isSecure,
    issues,
    warnings,
    recommendations
  };
}

/**
 * Logs security report to console (development only)
 */
export function logSecurityReport(): void {
  if (process.env.NODE_ENV === 'development') {
    const report = validatePageSecurity();
    
    console.group('🔒 Security Validation Report');
    console.log(`Status: ${report.isSecure ? '✅ SECURE' : '❌ ISSUES FOUND'}`);
    
    if (report.issues.length > 0) {
      console.group('❌ Issues:');
      report.issues.forEach(issue => console.error(`• ${issue}`));
      console.groupEnd();
    }
    
    if (report.warnings.length > 0) {
      console.group('⚠️ Warnings:');
      report.warnings.forEach(warning => console.warn(`• ${warning}`));
      console.groupEnd();
    }
    
    if (report.recommendations.length > 0) {
      console.group('💡 Recommendations:');
      report.recommendations.forEach(rec => console.info(`• ${rec}`));
      console.groupEnd();
    }
    
    console.groupEnd();
  }
}

/**
 * Validates and reports security status for Google Ads compliance
 */
export function validateGoogleAdsCompliance(): boolean {
  const report = validatePageSecurity();
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    logSecurityReport();
  }
  
  return report.isSecure;
}
