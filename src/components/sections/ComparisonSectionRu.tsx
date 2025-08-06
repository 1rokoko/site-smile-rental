'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H2, H3, Body, FadeInView, AnimatedCard } from '@/components/ui';
import { EXACT_CONTENT_RU } from '@/data/exact-content-ru';
import { X, Check, Star } from 'lucide-react';
import { animations } from '@/lib/animations';

export const ComparisonSectionRu: React.FC = () => {
  const { comparison } = EXACT_CONTENT_RU;

  return (
    <Section padding="xl">
      <Container>
        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">Почему выбирают Smile Rental?</H2>
          <Body className="text-black max-w-2xl mx-auto">
            Посмотрите разницу между арендой у нас и у других провайдеров.
          </Body>
        </FadeInView>

        <Grid cols={{ default: 1, lg: 3 }} gap="lg">
          {/* Without Us */}
          <motion.div
            variants={animations.staggerItem}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px 0px" }}
          >
            <AnimatedCard
              variant="outlined"
              padding="lg"
              className="h-full text-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center">
                  <X className="w-8 h-8 text-danger" />
                </div>
                <H3 className="text-danger">
                  {comparison.withoutUs.title}
                </H3>
                <Body className="text-text-secondary">
                  {comparison.withoutUs.text}
                </Body>
              </div>
            </AnimatedCard>
          </motion.div>

          {/* With Us */}
          <motion.div
            variants={animations.staggerItem}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px 0px" }}
            transition={{ delay: 0.1 }}
          >
            <AnimatedCard
              variant="elevated"
              padding="lg"
              className="h-full text-center border-2 border-primary/20"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <H3 className="text-primary">
                  {comparison.withUs.title}
                </H3>
                <Body className="text-text-secondary">
                  {comparison.withUs.text}
                </Body>
              </div>
            </AnimatedCard>
          </motion.div>

          {/* Only With Us */}
          <motion.div
            variants={animations.staggerItem}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px 0px" }}
            transition={{ delay: 0.2 }}
          >
            <AnimatedCard
              variant="elevated"
              padding="lg"
              className="h-full text-center bg-gradient-to-br from-success/5 to-primary/5"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-success fill-current" />
                </div>
                <H3 className="text-success">
                  {comparison.onlyWithUs.title}
                </H3>
                <div className="space-y-2">
                  {comparison.onlyWithUs.items.map((item, index) => (
                    <Body key={index} className="text-text-secondary">
                      {item}
                    </Body>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        </Grid>
      </Container>
    </Section>
  );
};
