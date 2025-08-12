const fs = require('fs');
const path = require('path');

// Critical CSS for above-the-fold content
const criticalCSS = `
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
`;

function injectCriticalCSS() {
  console.log('🎨 Injecting critical CSS into layout files...');

  const layoutPaths = [
    'src/app/layout.tsx',
    'smile-rental-modern/src/app/layout.tsx'
  ];

  layoutPaths.forEach(layoutPath => {
    if (fs.existsSync(layoutPath)) {
      let content = fs.readFileSync(layoutPath, 'utf8');
      
      // Check if critical CSS is already injected
      if (content.includes('/* Critical CSS for above-the-fold content */')) {
        console.log(`✅ Critical CSS already injected in ${layoutPath}`);
        return;
      }

      // Find the head section and inject critical CSS
      const headEndIndex = content.indexOf('</head>');
      if (headEndIndex !== -1) {
        const criticalCSSBlock = `
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: \`${criticalCSS.replace(/`/g, '\\`')}\`
        }} />
`;
        
        content = content.slice(0, headEndIndex) + criticalCSSBlock + content.slice(headEndIndex);
        
        fs.writeFileSync(layoutPath, content);
        console.log(`✅ Critical CSS injected into ${layoutPath}`);
      } else {
        console.log(`❌ Could not find </head> tag in ${layoutPath}`);
      }
    } else {
      console.log(`⚠️ Layout file not found: ${layoutPath}`);
    }
  });
}

function createCriticalCSSFile() {
  console.log('📄 Creating critical CSS file...');
  
  const criticalCSSPath = 'public/critical.css';
  fs.writeFileSync(criticalCSSPath, criticalCSS);
  console.log(`✅ Critical CSS file created: ${criticalCSSPath}`);
}

// Run the injection
console.log('🚀 Starting Critical CSS Optimization...');
console.log('=' .repeat(50));

injectCriticalCSS();
createCriticalCSSFile();

console.log('\n🎯 Critical CSS optimization completed!');
console.log('This should reduce render-blocking CSS and improve LCP.');
