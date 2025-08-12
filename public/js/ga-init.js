// Google Analytics initialization moved to external file to avoid inline scripts
// This helps us remove 'unsafe-inline' from script-src in production CSP

(function(){
  try {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} // eslint-disable-line @typescript-eslint/no-unused-vars
    gtag('js', new Date());
    gtag('config', 'G-XQYEJ26C2J');
    // Transparent: No dynamic code execution, no obfuscation
    // Only standard GA initialization
  } catch (e) {
    // Fail safe: never throw
    // console.error('GA init failed', e);
  }
})();
