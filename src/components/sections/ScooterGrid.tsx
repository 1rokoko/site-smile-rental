'use client';

import React from 'react';
import { Container, Section, Grid } from '@/components/layout';
import { H2, FadeInView } from '@/components/ui';
import { ScooterCard } from './ScooterCard';
import { SCOOTERS } from '@/data/scooters';

export const ScooterGrid: React.FC = () => {
  return (
    <Section padding="xl">
      <Container>
        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">Our Scooter Fleet</H2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Choose from our premium collection of well-maintained scooters,
            each equipped with safety features and comprehensive insurance.
          </p>
        </FadeInView>

        <Grid
          cols={{ default: 1, md: 2, lg: 3 }}
          gap="lg"
        >
          {SCOOTERS.map((scooter, index) => (
            <ScooterCard
              key={scooter.id}
              scooter={scooter}
              delay={index * 0.1}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};
