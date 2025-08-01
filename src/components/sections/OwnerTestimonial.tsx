'use client';

import React from 'react';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { H3, Body, FadeInView, AnimatedCard } from '@/components/ui';
import { EXACT_CONTENT } from '@/data/exact-content';
import { IMAGE_CATALOG } from '@/data/image-catalog';
import { Quote } from 'lucide-react';

export const OwnerTestimonial: React.FC = () => {
  const { ownerQuote } = EXACT_CONTENT;

  return (
    <Section padding="xl" background="surface">
      <Container size="md">
        <FadeInView animation="scaleIn">
          <AnimatedCard
            variant="elevated"
            padding="lg"
            className="text-center"
          >
            <div className="flex flex-col items-center space-y-6">
              {/* Quote Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Quote className="w-8 h-8 text-primary" />
              </div>

              {/* Quote Text */}
              <Body className="text-lg text-text-primary italic max-w-3xl leading-relaxed">
                "{ownerQuote.text}"
              </Body>

              {/* Owner Info */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={IMAGE_CATALOG.owner.alex.src}
                    alt={IMAGE_CATALOG.owner.alex.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <H3 className="text-text-primary mb-1">
                    {ownerQuote.author}
                  </H3>
                  <Body className="text-text-secondary capitalize">
                    {ownerQuote.title}
                  </Body>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </FadeInView>
      </Container>
    </Section>
  );
};
