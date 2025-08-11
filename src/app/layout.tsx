import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics/Analytics";

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
        {/* Security headers are served via middleware.ts with enhanced CSP */}
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
