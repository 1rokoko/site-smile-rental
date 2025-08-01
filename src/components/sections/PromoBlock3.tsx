'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, Body, FadeInView } from '@/components/ui';
import { Gift, UtensilsCrossed } from 'lucide-react';

export const PromoBlock3: React.FC = () => {
  return (
    <Section padding="xl">
      <Container>
        {/* Without Us Section */}
        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="text-center mb-8">
            <H2 className="mb-6 text-black">Without us:</H2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <Body className="text-black text-lg max-w-2xl">
                You spend a lot of time searching for locations and what to visit
              </Body>
            </div>
          </div>
        </FadeInView>

        {/* With Us Section */}
        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="text-center mb-8">
            <H2 className="mb-6 text-orange-500">With us:</H2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <Body className="text-black text-lg max-w-2xl">
                Everything is thought out: you save +20 hours on vacation planning,
                you save up to 4,000 baht on 5* restaurants and excursions
              </Body>
            </div>
          </div>
        </FadeInView>

        {/* Only With Us Section */}
        <FadeInView animation="fadeInUp">
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-8">
            <div className="text-center">
              <H2 className="mb-8 text-black">
                Only <span className="text-orange-500">with us:</span>
              </H2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <Body className="text-black text-lg">
                    Medical insurance* + Full insurance*
                  </Body>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                    <UtensilsCrossed className="w-8 h-8 text-white" />
                  </div>
                  <Body className="text-black text-lg">
                    No Passport Deposit - No hidden fees
                  </Body>
                </div>
              </div>
            </div>
          </div>
        </FadeInView>
      </Container>
    </Section>
  );
};
