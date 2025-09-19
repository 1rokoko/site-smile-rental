import type { Metadata } from "next";
import React from "react";
import {
  HeaderMy,
  LanguageBarMy,
  HeroMy,
  ScooterGridWithPromoMy,
  ScamWarningMy,
  OwnerTestimonialMy,
  FooterMy,
} from "@/components/sections";
import { FloatingContactButtonsMy } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sewa Skuter No.1 di Phuket | Smile Rental (Bahasa Melayu)",
  description:
    "Sewa skuter No.1 di Phuket dengan perlindungan dashcam, insurans kecurian, dan tiada caj tersembunyi. Dari 100฿ sehari termasuk bonus percuma 6000฿.",
};

export default function MalayHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderMy />
      <LanguageBarMy />
      <main className="space-y-8 md:space-y-12">
        <HeroMy />
        <ScooterGridWithPromoMy />
        <ScamWarningMy />
        <OwnerTestimonialMy />
      </main>
      <FooterMy />
      <FloatingContactButtonsMy />
    </div>
  );
}
