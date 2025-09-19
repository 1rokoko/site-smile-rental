import type { Metadata } from "next";
import React from "react";
import {
  HeaderKr,
  LanguageBarKr,
  HeroKr,
  ScooterGridWithPromoKr,
  ScamWarningKr,
  OwnerTestimonialKr,
  FooterKr,
} from "@/components/sections";
import { FloatingContactButtonsKr } from "@/components/ui";

export const metadata: Metadata = {
  title: "푸켓 스쿠터 렌탈 No.1 | Smile Rental (한국어)",
  description:
    "푸켓 최고의 스쿠터 렌탈 – 블랙박스 제공, 도난 보험, 숨겨진 비용 없음. 하루 100฿부터 6000฿ 보너스 포함.",
};

export default function KoreanHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderKr />
      <LanguageBarKr />
      <main className="space-y-8 md:space-y-12">
        <HeroKr />
        <ScooterGridWithPromoKr />
        <ScamWarningKr />
        <OwnerTestimonialKr />
      </main>
      <FooterKr />
      <FloatingContactButtonsKr />
    </div>
  );
}
