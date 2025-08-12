import type { Metadata } from "next";
import "../globals.css";
import { Analytics } from "@/components/analytics";
import { SecureCSSLoader } from "@/components/layout/SecureCSSLoader";
import { SecurityValidator } from "@/components/layout/SecurityValidator";

export const metadata: Metadata = {
  title: "Smile Rental Phuket - №1 Scooter Rental for Safety and Comfort",
  description:
    "Premium scooter rental in Phuket with video recorder protection, insurance coverage, and no hidden fees. From 250฿/day with 6000฿ bonus.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnects kept for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className="antialiased font-system">
        {/* Keep enhanced site features on main site */}
        <SecureCSSLoader />
        <SecurityValidator />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

