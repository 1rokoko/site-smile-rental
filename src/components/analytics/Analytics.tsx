'use client';

import Script from 'next/script';

export const Analytics = () => {
  return (
    <>
      {/* Yandex.Metrika counter */}
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

          ym(102271585, 'init', {webvisor:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});
        `}
      </Script>
      
      <noscript>
        <div>
          <img 
            src="https://mc.yandex.ru/watch/102271585" 
            style={{position:'absolute', left:'-9999px'}} 
            alt="" 
          />
        </div>
      </noscript>

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XQYEJ26C2J"
        strategy="afterInteractive"
      />
      
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XQYEJ26C2J');
        `}
      </Script>
    </>
  );
};
