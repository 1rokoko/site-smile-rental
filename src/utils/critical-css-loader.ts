/**
 * Security-compliant critical CSS loader
 * Replaces dangerouslySetInnerHTML with safer alternatives
 * Google Ads compliant implementation with CSP support
 */

import { injectSecureStyle } from './csp-nonce';

export const CRITICAL_CSS = `
/* Critical CSS for above-the-fold content */
/* Reset and base styles */
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
::before,::after{--tw-content:''}
html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}
body{margin:0;line-height:inherit}

/* Typography - Critical heading styles */
h1,h2{margin:0;font-weight:inherit;font-size:inherit}
h1{font-size:2.25rem;line-height:2.5rem;font-weight:700;color:var(--color-text-primary);line-height:1.25;letter-spacing:-0.025em}
@media (min-width:768px){h1{font-size:3rem;line-height:1}}

/* Layout - Critical container and section styles */
.container{width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
@media (min-width:640px){.container{max-width:640px}}
@media (min-width:768px){.container{max-width:768px;padding-left:1.5rem;padding-right:1.5rem}}
@media (min-width:1024px){.container{max-width:1024px}}
@media (min-width:1280px){.container{max-width:1280px}}
@media (min-width:1536px){.container{max-width:1536px}}

/* Section padding */
.section-md{padding-top:3rem;padding-bottom:3rem}
@media (min-width:768px){.section-md{padding-top:4rem;padding-bottom:4rem}}

/* Colors and variables */
:root{
  --color-primary:0 122 255;
  --color-primary-dark:10 132 255;
  --color-secondary:255 149 0;
  --color-success:52 199 89;
  --color-warning:255 204 0;
  --color-danger:255 59 48;
  --color-white:255 255 255;
  --color-gray-50:248 248 248;
  --color-gray-100:242 242 247;
  --color-gray-200:229 229 234;
  --color-gray-300:199 199 204;
  --color-gray-400:142 142 147;
  --color-gray-500:99 99 102;
  --color-gray-600:72 72 74;
  --color-gray-700:58 58 60;
  --color-gray-800:44 44 46;
  --color-gray-900:28 28 30;
  --color-black:0 0 0;
  --color-surface:rgb(var(--color-white));
  --color-surface-elevated:rgb(var(--color-gray-50));
  --color-text-primary:rgb(var(--color-gray-900));
  --color-text-secondary:rgb(var(--color-gray-600));
  --color-text-tertiary:rgb(var(--color-gray-500));
  --color-border:rgb(var(--color-gray-200));
  --color-border-light:rgb(var(--color-gray-100));
  --font-sans:var(--font-geist-sans),ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;
}

/* Critical utility classes */
.text-center{text-align:center}
.text-black{color:#000}
.text-orange-500{color:#f97316}
.mb-6{margin-bottom:1.5rem}
.max-w-4xl{max-width:56rem}
.mx-auto{margin-left:auto;margin-right:auto}
.min-h-screen{min-height:100vh}
.bg-background{background-color:var(--color-surface)}
.space-y-8>:not([hidden])~:not([hidden]){margin-top:2rem}
@media (min-width:768px){.md\\:space-y-12>:not([hidden])~:not([hidden]){margin-top:3rem}}

/* Header styles */
.sticky{position:sticky}
.top-0{top:0}
.z-50{z-index:50}
.backdrop-blur-md{backdrop-filter:blur(12px)}
.bg-opacity-95{background-color:rgb(var(--color-surface-elevated)/0.95)}
.border-b{border-bottom-width:1px}
.border-border-light{border-color:var(--color-border-light)}
.flex{display:flex}
.items-center{align-items:center}
.justify-between{justify-content:space-between}
.py-4{padding-top:1rem;padding-bottom:1rem}

/* Font loading optimization */
@font-face{
  font-family:'Geist';
  font-style:normal;
  font-weight:400;
  font-display:swap;
  src:url('/_next/static/media/geist-sans-latin-400-normal.woff2') format('woff2');
}
@font-face{
  font-family:'Geist';
  font-style:normal;
  font-weight:700;
  font-display:swap;
  src:url('/_next/static/media/geist-sans-latin-700-normal.woff2') format('woff2');
}

/* Anti-aliasing */
.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

/* Hide elements that are not critical */
.hidden{display:none}
@media (min-width:640px){.sm\\:block{display:block}}
@media (min-width:640px){.sm\\:hidden{display:none}}

/* CSS Containment for performance */
.container{contain:layout style}
.section{contain:layout}
.card{contain:layout style}
.hero-section{contain:layout style paint}
.grid{contain:layout}
.motion-div{contain:layout style}

/* Performance optimizations */
.will-change-transform{will-change:transform}
.will-change-opacity{will-change:opacity}
.transform-gpu{transform:translateZ(0)}
.backface-hidden{backface-visibility:hidden}
`;

/**
 * Security-compliant CSS injection function
 * Uses CSP-compliant methods instead of dangerouslySetInnerHTML
 */
export function injectCriticalCSS(): void {
  // Use the CSP-compliant injection method
  injectSecureStyle(CRITICAL_CSS, 'critical-css');
}

/**
 * Security-compliant non-critical CSS loader
 * Replaces the dynamic script creation pattern
 */
export function loadNonCriticalCSS(href: string): void {
  // Only run on client side
  if (typeof window === 'undefined') return;

  try {
    // Check if CSS is already loaded
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) return;

    // Create link element using standard DOM methods
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = href;
    linkElement.media = 'print'; // Load as print to avoid render blocking

    // Security: Add integrity check if possible
    if (href.startsWith('/')) {
      linkElement.crossOrigin = 'anonymous';
    }

    // Switch to all media after load
    linkElement.onload = function() {
      linkElement.media = 'all';
    };

    // Error handling
    linkElement.onerror = function() {
      console.error(`Failed to load CSS: ${href}`);
    };

    // Append to head
    const head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(linkElement);

    console.log(`✅ Non-critical CSS loaded securely: ${href}`);
  } catch (error) {
    console.error(`❌ Failed to load non-critical CSS ${href}:`, error);
  }
}

/**
 * Initialize secure CSS loading after page load
 * Replaces the inline script in layout.tsx
 */
export function initializeSecureCSS(): void {
  // Only run on client side
  if (typeof window === 'undefined') return;

  // Inject critical CSS immediately
  injectCriticalCSS();

  // Load non-critical CSS after page load
  if (document.readyState === 'loading') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Add any non-critical CSS files here
        // loadNonCriticalCSS('/path/to/non-critical.css');
      }, 50);
    });
  } else {
    // Page already loaded
    setTimeout(() => {
      // Add any non-critical CSS files here
      // loadNonCriticalCSS('/path/to/non-critical.css');
    }, 50);
  }
}