import type { Metadata } from "next";
// SECURITY FIX: Removed Google Fonts to eliminate 404 errors and improve Google Ads compliance
import "./globals.css";
import "./critical.css"; // GOOGLE ADS FIX: Static CSS instead of dynamic injection
import { Analytics } from "@/components/analytics";
import { SecurityValidator } from "@/components/layout/SecurityValidator";

// SECURITY FIX: Using system fonts instead of external Google Fonts
// This eliminates 404 errors and potential "hacked site" flags from Google Ads

export const metadata: Metadata = {
  title: "Smile Rental Phuket - №1 Scooter Rental for Safety and Comfort",
  description: "Premium scooter rental in Phuket with video recorder protection, insurance coverage, and no hidden fees. From 250฿/day with 6000฿ bonus.",
  keywords: "scooter rental phuket, motorcycle rental phuket, bike rental thailand, phuket transport, yamaha nmax rental",
  authors: [{ name: "Smile Rental Phuket" }],
  openGraph: {
    title: "Smile Rental Phuket - №1 Scooter Rental for Safety and Comfort",
    description: "Premium scooter rental in Phuket with video recorder protection, insurance coverage, and no hidden fees.",
    url: "https://smilerentalphuket.com",
    siteName: "Smile Rental Phuket",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smile Rental Phuket - №1 Scooter Rental for Safety and Comfort",
    description: "Premium scooter rental in Phuket with video recorder protection, insurance coverage, and no hidden fees.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#f97316',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#f97316',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="YxLY-d5B7WPjkgGfePklJ_tu64TDvkj_xQy2RW8SajM" />

        {/* CSP is now set via headers in middleware.ts; removed meta tag to avoid duplicate/conflicting policies and to eliminate 'unsafe-*' in production */}

        {/* Critical resource hints for external domains - SECURITY FIX: Removed Google Fonts */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://photos.app.goo.gl" />

        {/* SECURITY FIX: Removed font preloading to eliminate 404 errors */}
        {/* System fonts are used instead for Google Ads compliance */}
        {/* Security headers are served via middleware.ts with enhanced CSP */}
      
        {/* Critical CSS will be injected securely via client-side script */}
        {/* This approach eliminates dangerouslySetInnerHTML for Google Ads compliance */}

        {/* Non-critical CSS loading moved to secure client-side utilities */}
        {/* This eliminates the dangerouslySetInnerHTML script for Google Ads compliance */}
</head>
      <body
        className="antialiased font-system"
      >
        {/* GOOGLE ADS FIX: Removed SecureCSSLoader to eliminate dynamic CSS injection */}
        <SecurityValidator />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
