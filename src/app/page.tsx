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
export const dynamic = 'force-static';
export const revalidate = 3600;


export default function Home() {
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

// 🚀 Automated deployment test - August 4, 2025 - Internet restored!
