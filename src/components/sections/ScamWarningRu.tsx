'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, H3, Body, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_RU } from '@/data/exact-content-ru';
import { AlertTriangle, Shield } from 'lucide-react';

export const ScamWarningRu: React.FC = () => {
  const { scamWarning } = EXACT_CONTENT_RU;

  return (
    <Section id="scam-warning-section" padding="lg" background="surface">
      <Container>
        <FadeInView animation="fadeInUp" className="text-center max-w-4xl mx-auto">
          <H2 className="mb-4 text-black">{scamWarning.title}</H2>
          <H3 className="mb-8 text-orange-500">{scamWarning.subtitle}</H3>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            
            <H3 className="mb-6 text-red-700">{scamWarning.topScams.title}</H3>
            
            <div className="space-y-4 mb-6">
              {scamWarning.topScams.items.map((scam, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <Body className="text-red-700 font-medium">{scam}</Body>
                </div>
              ))}
            </div>
            
            <Body className="text-red-800 font-bold text-lg">
              {scamWarning.conclusion}
            </Body>
          </div>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-8 h-8 text-green-600" />
              <Body className="text-green-800 font-bold text-lg">
                У нас есть видеорегистратор на каждом скутере!
              </Body>
            </div>
          </div>
        </FadeInView>
      </Container>
    </Section>
  );
};
