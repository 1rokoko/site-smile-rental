'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, Body, FadeInView } from '@/components/ui';
import { Gift, UtensilsCrossed } from 'lucide-react';

export const PromoBlock3My: React.FC = () => {
  return (
    <Section padding="xl">
      <Container>
        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="text-center mb-8">
            <H2 className="mb-6 text-black">Tanpa kami:</H2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <Body className="text-black text-lg max-w-2xl">
                Anda habiskan banyak masa mencari lokasi dan aktiviti menarik
              </Body>
            </div>
          </div>
        </FadeInView>

        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="text-center mb-8">
            <H2 className="mb-6 text-orange-500">Bersama kami:</H2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <Body className="text-black text-lg max-w-2xl">
                Semua sudah dirancang: jimat masa merancang dan jimat hingga 4,000 baht pada restoran dan lawatan 5*
              </Body>
            </div>
          </div>
        </FadeInView>

        <FadeInView animation="fadeInUp">
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-8">
            <div className="text-center">
              <H2 className="mb-8 text-black">
                Hanya <span className="text-orange-500">bersama kami:</span>
              </H2>

              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <Body className="text-black text-lg">
                    Insurans perubatan* + Insurans penuh*
                  </Body>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                    <UtensilsCrossed className="w-8 h-8 text-white" />
                  </div>
                  <Body className="text-black text-lg">
                    Tiada deposit pasport - Tiada caj tersembunyi
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
