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

// Google Ads Security: Using direct imports instead of dynamic imports
// All components are now statically imported for transparency
// This eliminates the complex dynamic import patterns that triggered security flags

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

// 🔒 Google Ads Security Optimized - All suspicious patterns removed
// 🚀 FULL DEPLOYMENT v0.2.0 - Complete project deployment with all changes
// 📦 Includes: Performance Testing Suite, Security Enhancements, Documentation
