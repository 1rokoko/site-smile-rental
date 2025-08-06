'use client';

import React from 'react';
import { Container, Section, Grid } from '@/components/layout';
import { H2, FadeInView } from '@/components/ui';
import { ScooterCard } from './ScooterCard';
import { SCOOTERS } from '@/data/scooters';

export const ScooterGridRu: React.FC = () => {
  return (
    <Section padding="md">
      <Container>
        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">Наш автопарк скутеров</H2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Выберите из нашей премиальной коллекции хорошо обслуживаемых скутеров,
            каждый оснащен функциями безопасности и комплексной страховкой.
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
