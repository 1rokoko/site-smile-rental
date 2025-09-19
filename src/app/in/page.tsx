import type { Metadata } from "next";
import React from "react";
import {
  HeaderIn,
  LanguageBarIn,
  HeroIn,
  ScooterGridWithPromoIn,
  ScamWarningIn,
  OwnerTestimonialIn,
  FooterIn,
} from "@/components/sections";
import { FloatingContactButtonsIn } from "@/components/ui";

export const metadata: Metadata = {
  title: "फुकेत स्कूटर रेंटल No.1 | Smile Rental (हिन्दी)",
  description:
    "फुकेत में नंबर 1 स्कूटर रेंटल – डैशकैम सुरक्षा, चोरी बीमा और शून्य छिपे शुल्क के साथ। 100฿ प्रतिदिन से, 6000฿ बोनस समेत।",
};

export default function HindiHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderIn />
      <LanguageBarIn />
      <main className="space-y-8 md:space-y-12">
        <HeroIn />
        <ScooterGridWithPromoIn />
        <ScamWarningIn />
        <OwnerTestimonialIn />
      </main>
      <FooterIn />
      <FloatingContactButtonsIn />
    </div>
  );
}
