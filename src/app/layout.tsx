import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://274418.selcdn.ru" />
        <link rel="preconnect" href="https://photos.app.goo.gl" />
        <link rel="dns-prefetch" href="https://274418.selcdn.ru" />
        <link rel="dns-prefetch" href="https://photos.app.goo.gl" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
