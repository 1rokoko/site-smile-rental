import type { Metadata } from "next";
import React from "react";
import {
  HeaderCn,
  LanguageBarCn,
  HeroCn,
  ScooterGridWithPromoCn,
  ScamWarningCn,
  OwnerTestimonialCn,
  FooterCn,
} from "@/components/sections";
import { FloatingContactButtonsCn } from "@/components/ui";

export const metadata: Metadata = {
  title: "普吉岛 No.1 摩托租赁 | Smile Rental (中文)",
  description:
    "普吉岛首选摩托租赁：配备行车记录仪、含盗抢保险，无隐藏费用。每天 100฿ 起，含 6000฿ 礼包。",
};

export default function ChineseHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderCn />
      <LanguageBarCn />
      <main className="space-y-8 md:space-y-12">
        <HeroCn />
        <ScooterGridWithPromoCn />
        <ScamWarningCn />
        <OwnerTestimonialCn />
      </main>
      <FooterCn />
      <FloatingContactButtonsCn />
    </div>
  );
}
