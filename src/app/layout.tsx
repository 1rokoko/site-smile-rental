import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

        <link rel="preconnect" href="https://photos.app.goo.gl" />
        <link rel="dns-prefetch" href="https://photos.app.goo.gl" />
        {/* Enhanced Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' https://photos.app.goo.gl https://static.craftum.com https://mc.yandex.ru https://www.googletagmanager.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://photos.app.goo.gl https://static.craftum.com https://mc.yandex.ru; connect-src 'self' https://mc.yandex.ru https://www.google-analytics.com; frame-src 'self' https://www.google.com https://maps.google.com;" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
