'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Header,
  Hero,
} from '@/components/sections';

// Dynamic import for below-the-fold components
const ScooterGridWithPromo = dynamic(
  () => import('@/components/sections/ScooterGridWithPromo').then(mod => ({ default: mod.ScooterGridWithPromo })),
  {
    ssr: true,
    loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />
  }
);

const OwnerTestimonial = dynamic(
  () => import('@/components/sections/OwnerTestimonial').then(mod => ({ default: mod.OwnerTestimonial })),
  {
    ssr: true,
    loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
  }
);

const ScamWarning = dynamic(
  () => import('@/components/sections/ScamWarning').then(mod => ({ default: mod.ScamWarning })),
  {
    ssr: true,
    loading: () => <div className="h-48 animate-pulse bg-gray-100 rounded-lg" />
  }
);

const Footer = dynamic(
  () => import('@/components/sections/Footer').then(mod => ({ default: mod.Footer })),
  {
    ssr: true,
    loading: () => <div className="h-96 animate-pulse bg-gray-900 rounded-lg" />
  }
);

// Dynamic import for non-critical components
const FloatingContactButtons = dynamic(
  () => import('@/components/ui/FloatingContactButtons').then(mod => ({ default: mod.FloatingContactButtons })),
  {
    ssr: false,
    loading: () => null
  }
);

export default function Index2() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
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
