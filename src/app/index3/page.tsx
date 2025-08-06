import React from 'react';
import {
  Header,
  LanguageBar,
  Hero,
  ScooterGrid,
  BonusSection,
  ComparisonSection,
  OwnerTestimonial,
  ScamWarning,
  Footer,
} from '@/components/sections';
import { FloatingContactButtons } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LanguageBar />
      <main>
        <Hero />
        <ScooterGrid />
        <BonusSection />
        <ComparisonSection />
        <ScamWarning />
        <OwnerTestimonial />
      </main>
      <Footer />
      <FloatingContactButtons />
    </div>
  );
}

// 🚀 Automated deployment test - August 4, 2025 - Internet restored!
