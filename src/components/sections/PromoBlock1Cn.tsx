'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H2, Body, FadeInView } from '@/components/ui';
import { EXACT_CONTENT_CN } from '@/data/exact-content-cn';
import { Gift, UtensilsCrossed, Camera, PartyPopper, Clock } from 'lucide-react';

export const PromoBlock1Cn: React.FC = () => {
  const { bonus } = EXACT_CONTENT_CN;
  const highlights = bonus.items.slice(0, 4);
  const extras = bonus.items.slice(4);

  const icons = [
    <Gift key="gift" className="w-8 h-8" />,
    <UtensilsCrossed key="tour" className="w-8 h-8" />,
    <Gift key="free" className="w-8 h-8" />,
    <Clock key="time" className="w-8 h-8" />,
  ];

  const extraIcons = [
    <Camera key="photo" className="w-8 h-8" />,
    <UtensilsCrossed key="couple" className="w-8 h-8" />,
    <PartyPopper key="party" className="w-8 h-8" />,
    <UtensilsCrossed key="gastro" className="w-8 h-8" />,
  ];

  return (
    <Section padding="xl" background="surface" id="bonus-section">
      <Container>
        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">{bonus.title}</H2>
        </FadeInView>

        <Grid cols={{ default: 2, md: 4 }} gap="md" className="mb-12">
          {highlights.map((text, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                {icons[index]}
              </div>
              <div className="text-black font-medium text-sm sm:text-base">
                {text}
              </div>
            </motion.div>
          ))}
        </Grid>

        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">{bonus.subtitle}</H2>
          <Body className="text-black max-w-3xl mx-auto">
            我们为您的假期安排好一切，让您尽情享受每一刻。
          </Body>
        </FadeInView>

        <Grid cols={{ default: 2, md: 4 }} gap="md">
          {extras.map((text, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                {extraIcons[index]}
              </div>
              <div className="text-black font-medium text-sm sm:text-base">
                {text}
              </div>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};
