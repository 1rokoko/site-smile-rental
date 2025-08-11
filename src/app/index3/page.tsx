'use client';

import React from 'react';
import dynamic from 'next/dynamic';
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

// Dynamic import for non-critical components
const FloatingContactButtons = dynamic(
  () => import('@/components/ui/FloatingContactButtons').then(mod => ({ default: mod.FloatingContactButtons })),
  {
    ssr: false,
    loading: () => null
  }
);

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
