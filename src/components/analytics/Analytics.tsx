'use client';

import Script from 'next/script';

export const Analytics = () => {
  return (
    <>
      {/* Google Analytics - externalized to avoid inline scripts for CSP compliance */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XQYEJ26C2J"
        strategy="afterInteractive"
      />
      <Script
        src="/js/ga-init.js"
        strategy="afterInteractive"
      />
    </>
  );
};
