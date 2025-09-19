'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, FadeInView } from '@/components/ui';
import { Star } from 'lucide-react';
import { IMAGE_CATALOG } from '@/data/image-catalog';

export const PromoBlock2My: React.FC = () => {
  return (
    <Section padding="lg">
      <Container>
        <FadeInView animation="fadeInUp" className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-orange-500 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <img
                    src={IMAGE_CATALOG.scooters.premiumHelmet.src}
                    alt="Helmet Premium"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <H2 className="mb-4 text-black">
                  Helmet Premium
                </H2>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-6 h-6 text-orange-500 fill-current" />
                    <span className="text-2xl font-bold text-black">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInView>
      </Container>
    </Section>
  );
};
