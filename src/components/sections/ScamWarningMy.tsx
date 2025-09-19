'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, H3, Body, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_MY } from '@/data/exact-content-my';
import { AlertTriangle, MapPin } from 'lucide-react';

export const ScamWarningMy: React.FC = () => {
  const { scamWarning } = EXACT_CONTENT_MY;

  return (
    <Section id="scam-warning-section" padding="md" background="elevated">
      <Container>
        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-400 p-2 rounded-full mr-4">
              <AlertTriangle className="w-6 h-6 text-black" />
            </div>
            <H2 className="text-yellow-500 font-bold inline">
              {scamWarning.title.split(':')[0]}:
            </H2>
            <H2 className="text-black font-bold inline ml-2">
              {scamWarning.title.split(':')[1]?.trim()}
            </H2>
          </div>

          <div className="flex items-center mb-6">
            <div className="bg-red-500 p-2 rounded-full mr-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <H3 className="text-yellow-500 font-bold inline">
              {scamWarning.subtitle.split(':')[0]}:
            </H3>
            <H3 className="text-black font-bold inline ml-2">
              {scamWarning.subtitle.split(':')[1]?.trim()}
            </H3>
          </div>

          <div className="mb-6">
            <H3 className="mb-4 text-black font-bold">{scamWarning.topScams.title}</H3>
            <div className="space-y-3">
              {scamWarning.topScams.items.map((scam, index) => (
                <div key={scam} className="flex items-start space-x-4">
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

          <Body className="text-yellow-500 font-bold text-lg text-center">
            {scamWarning.conclusion}
          </Body>
        </FadeInView>
      </Container>
    </Section>
  );
};
