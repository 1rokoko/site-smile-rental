import React from 'react';
import {
  Header,
  LanguageBar,
  Hero,
  ScooterGridWithPromo,
  OwnerTestimonial,
  ScamWarning,
  Footer,
} from '@/components/sections';
import { FloatingContactButtons } from '@/components/ui';

// one: Visual clone of homepage for Google Ads safe landing
// SECURITY: Static imports only, no dynamic imports, no eval/obfuscation
// All texts and links are identical to the homepage

export default function One() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LanguageBar />
      <main className="space-y-8 md:space-y-12">
        <Hero />
        <ScooterGridWithPromo />
        <ScamWarning />
        <OwnerTestimonial />
      </main>
      <Footer />
      <FloatingContactButtons />
    </div>
  );
}

