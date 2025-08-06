import React from 'react';
import {
  HeaderRu,
  HeroRu,
  ScooterGridWithPromoRu,
  OwnerTestimonialRu,
  ScamWarningRu,
  FooterRu,
} from '@/components/sections';
import { FloatingContactButtonsRu } from '@/components/ui';

export default function ScooterRental() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderRu />
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
