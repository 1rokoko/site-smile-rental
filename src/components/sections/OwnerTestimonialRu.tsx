'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, Body, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_RU } from '@/data/exact-content-ru';

export const OwnerTestimonialRu: React.FC = () => {
  const { ownerQuote } = EXACT_CONTENT_RU;

  return (
    <Section padding="lg" background="surface">
      <Container>
        <FadeInView animation="fadeInUp" className="text-center max-w-4xl mx-auto">
          <H2 className="mb-8 text-black">Слово владельца</H2>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-border-light">
            <Body className="text-lg text-black mb-6 italic">
              "{ownerQuote.text}"
            </Body>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="text-right">
                <div className="font-semibold text-black">{ownerQuote.author}</div>
                <div className="text-sm text-text-secondary">{ownerQuote.title}</div>
              </div>
            </div>
          </div>
        </FadeInView>
      </Container>
    </Section>
  );
};
