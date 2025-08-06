'use client';

import React from 'react';
import { Container, Section } from '@/components/layout';
import { H2, Body, FadeInView } from '@/components/ui';
import { Gift, UtensilsCrossed } from 'lucide-react';

export const PromoBlock3Ru: React.FC = () => {
  return (
    <Section padding="xl">
      <Container>
        {/* Without Us Section */}
        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="text-center mb-8">
            <H2 className="mb-6 text-black">Без нас:</H2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <Body className="text-black text-lg max-w-2xl">
                Вы тратите много времени на поиск локаций и что посетить
              </Body>
            </div>
          </div>
        </FadeInView>

        {/* With Us Section */}
        <FadeInView animation="fadeInUp" className="mb-12">
          <div className="text-center mb-8">
            <H2 className="mb-6 text-orange-500">С нами:</H2>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <Body className="text-black text-lg max-w-2xl">
                Все продумано: вы экономите +20 часов на планировании отпуска,
                экономите до 4000 бат в 5* ресторанах и экскурсиях
              </Body>
            </div>
          </div>
        </FadeInView>

        {/* Only With Us Section */}
        <FadeInView animation="fadeInUp">
          <div className="text-center">
            <H2 className="mb-6 text-orange-500">Только с нами:</H2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <Body className="text-black text-lg">
                  Медицинская страховка* + Полная страховка*
                </Body>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="w-8 h-8 text-white" />
                </div>
                <Body className="text-black text-lg">
                  Без залога паспорта - Без скрытых комиссий
                </Body>
              </div>
            </div>
          </div>
        </FadeInView>
      </Container>
    </Section>
  );
};
