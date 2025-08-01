'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H2, Body, FadeInView, AnimatedCard } from '@/components/ui';
import { EXACT_CONTENT } from '@/data/exact-content';
import { 
  Gift, 
  UtensilsCrossed, 
  Camera, 
  MapPin, 
  Heart, 
  PartyPopper,
  Clock,
  Star
} from 'lucide-react';
import { animations } from '@/lib/animations';

export const BonusSection: React.FC = () => {
  const { bonus } = EXACT_CONTENT;

  const bonusIcons = [
    <Gift key="gift" className="w-6 h-6" />,
    <UtensilsCrossed key="restaurant" className="w-6 h-6" />,
    <MapPin key="tour" className="w-6 h-6" />,
    <Gift key="free" className="w-6 h-6" />,
    <Clock key="time" className="w-6 h-6" />,
    <Camera key="photo" className="w-6 h-6" />,
    <Heart key="couples" className="w-6 h-6" />,
    <PartyPopper key="party" className="w-6 h-6" />,
    <UtensilsCrossed key="gastro" className="w-6 h-6" />
  ];

  return (
    <Section padding="xl" background="surface">
      <Container>
        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-orange-500">
            {bonus.title}
          </H2>
          <Body className="text-black max-w-3xl mx-auto">
            {bonus.subtitle}
          </Body>
        </FadeInView>

        <motion.div
          variants={animations.staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px 0px" }}
        >
          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="md">
            {bonus.items.map((item, index) => (
              <motion.div key={index} variants={animations.staggerItem}>
                <AnimatedCard
                  variant="elevated"
                  padding="lg"
                  hover={true}
                  className="h-full text-center"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {bonusIcons[index]}
                    </div>
                    <Body className="font-medium text-text-primary">
                      {item}
                    </Body>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </Grid>
        </motion.div>

        {/* Highlight Section */}
        <FadeInView animation="scaleIn" delay={0.3} className="mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-warning fill-current" />
              <Star className="w-6 h-6 text-warning fill-current" />
              <Star className="w-6 h-6 text-warning fill-current" />
            </div>
            <H2 className="mb-4 text-text-primary">
              {bonus.subtitle}
            </H2>
            <Body className="text-text-secondary max-w-2xl mx-auto">
              Experience Phuket like never before with our carefully curated routes and exclusive partnerships.
            </Body>
          </div>
        </FadeInView>
      </Container>
    </Section>
  );
};
