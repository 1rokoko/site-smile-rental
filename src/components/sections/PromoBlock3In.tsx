'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, Body, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_IN } from '@/data/exact-content-in';
import { Gift, UtensilsCrossed } from 'lucide-react';

export const PromoBlock3In: React.FC = () => {
  const { comparison } = EXACT_CONTENT_IN;

  return (
    <Section padding="xl">
      <Container>
        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="text-center mb-8">
            <H2 className="mb-6 text-black">{comparison.withoutUs.title}</H2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <Body className="text-black text-lg max-w-2xl">
                {comparison.withoutUs.text}
              </Body>
            </div>
          </div>
        </FadeInView>

        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="text-center mb-8">
            <H2 className="mb-6 text-orange-500">{comparison.withUs.title}</H2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <Body className="text-black text-lg max-w-2xl">
                {comparison.withUs.text}
              </Body>
            </div>
          </div>
        </FadeInView>

        <FadeInView animation="fadeInUp">
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-8">
            <div className="text-center">
              <H2 className="mb-8 text-black">
                {comparison.onlyWithUs.title}
              </H2>

              <div className="space-y-6">
                {comparison.onlyWithUs.items.map((item, index) => (
                  <div key={item} className="flex items-center justify-center space-x-4">
                    <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                      {(index === 0 ? <Gift className="w-8 h-8 text-white" /> : <UtensilsCrossed className="w-8 h-8 text-white" />)}
                    </div>
                    <Body className="text-black text-lg">
                      {item}
                    </Body>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInView>
      </Container>
    </Section>
  );
};
