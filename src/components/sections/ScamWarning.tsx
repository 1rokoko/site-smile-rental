'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, H3, Body, FadeInView } from '@/components/ui';
import { EXACT_CONTENT } from '@/data/exact-content';
import { AlertTriangle, MapPin } from 'lucide-react';

export const ScamWarning: React.FC = () => {
  const { scamWarning } = EXACT_CONTENT;

  return (
    <Section padding="md" background="elevated">
      <Container>
        <FadeInView animation="fadeInUp" className="mb-12">
          {/* Header with Warning Triangle */}
          <div className="flex items-center mb-4">
            <div className="bg-yellow-400 p-2 rounded-full mr-4">
              <AlertTriangle className="w-6 h-6 text-black" />
            </div>
            <H2 className="text-yellow-500 font-bold inline">
              Phuket Road Scams:
            </H2>
            <H2 className="text-black font-bold inline ml-2">
              Survival Guide
            </H2>
          </div>

          {/* Must Have Section with Red Pin */}
          <div className="flex items-center mb-6">
            <div className="bg-red-500 p-2 rounded-full mr-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <H3 className="text-yellow-500 font-bold inline">
              Must: Dashcam
            </H3>
            <H3 className="text-black font-bold inline ml-2">
              (saves $1,500+)
            </H3>
          </div>

          {/* Top 3 Scams */}
          <div className="mb-6">
            <H3 className="mb-4 text-black font-bold">Top 3 scams:</H3>
            <div className="space-y-3">
              {scamWarning.topScams.items.map((scam, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <Body className="text-left text-black font-medium">
                    {scam}
                  </Body>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Warning */}
          <Body className="text-yellow-500 font-bold text-lg text-center">
            No video = Pay up to $1,500 + to scammers. But We have it
          </Body>
        </FadeInView>
      </Container>
    </Section>
  );
};
