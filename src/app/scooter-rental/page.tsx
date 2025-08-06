import React from 'react';
import {
  HeaderRu,
  LanguageBarRu,
  HeroRu,
  ScooterGridWithPromoRu,
  OwnerTestimonialRu,
  ScamWarningRu,
  FooterRu,
} from '@/components/sections';
import { FloatingContactButtonsRu } from '@/components/ui';

export default function ScooterRentalRu() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderRu />
      <LanguageBarRu />
      <main className="space-y-8 md:space-y-12">
        <HeroRu />
        <ScooterGridWithPromoRu />
        <ScamWarningRu />
        <OwnerTestimonialRu />
      </main>
      <FooterRu />
      <FloatingContactButtonsRu />
    </div>
  );
}

// 🚀 Русская версия - точная копия главной страницы с переводом
