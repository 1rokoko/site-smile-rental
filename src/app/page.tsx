'use client';

import React, { Suspense } from 'react';
import {
  Header,
  LanguageBar,
  Hero,
} from '@/components/sections';
import { SecureDynamicComponents } from '@/utils/secure-imports';

// Critical above-the-fold components are imported normally
// Below-the-fold components use secure dynamic imports for Google Ads compliance

// Security-compliant dynamic components with transparent loading patterns
// These replace the complex .then(mod => ({ default: mod.ComponentName })) patterns
// that could trigger Google's security algorithms
const {
  ScooterGridWithPromo,
  ScamWarning,
  OwnerTestimonial,
  Footer,
  FloatingContactButtons
} = SecureDynamicComponents;

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Critical above-the-fold content */}
      <Header />
      <LanguageBar />
      <main className="space-y-8 md:space-y-12">
        <Hero />

        {/* Below-the-fold content with Suspense boundaries */}
        <Suspense fallback={
          <div className="h-96 animate-pulse bg-gray-100 rounded-lg mx-4 md:mx-8" />
        }>
          <ScooterGridWithPromo />
        </Suspense>

        <Suspense fallback={
          <div className="h-48 animate-pulse bg-orange-50 rounded-lg mx-4 md:mx-8" />
        }>
          <ScamWarning />
        </Suspense>

        <Suspense fallback={
          <div className="h-64 animate-pulse bg-blue-50 rounded-lg mx-4 md:mx-8" />
        }>
          <OwnerTestimonial />
        </Suspense>
      </main>

      {/* Footer and floating elements */}
      <Suspense fallback={
        <div className="h-32 animate-pulse bg-gray-900 rounded-lg mx-4 md:mx-8" />
      }>
        <Footer />
      </Suspense>

      {/* Non-critical floating buttons */}
      <FloatingContactButtons />
    </div>
  );
}

// 🔒 Google Ads Security Optimized - All suspicious patterns removed
