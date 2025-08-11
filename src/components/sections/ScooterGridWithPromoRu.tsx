'use client';

import React from 'react';
import { Container, Section, Grid } from '@/components/layout';
import { ScooterCardGrid } from './ScooterCardGrid';
import { PromoBlock1Ru } from './PromoBlock1Ru';
import { PromoBlock2Ru } from './PromoBlock2Ru';
import { PromoBlock3Ru } from './PromoBlock3Ru';
import { SCOOTERS } from '@/data/scooters';

export const ScooterGridWithPromoRu: React.FC = () => {
  // Split scooters into groups of 4
  const scooterGroups = [];
  for (let i = 0; i < SCOOTERS.length; i += 4) {
    scooterGroups.push(SCOOTERS.slice(i, i + 4));
  }

  return (
    <div>
      {scooterGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          {/* Scooter Group */}
          <Section padding="lg">
            <Container>
              <Grid
                cols={{ default: 2, md: 3, lg: 4 }}
                gap="lg"
              >
                {group.map((scooter, index) => (
                  <ScooterCardGrid
                    key={scooter.id}
                    scooter={scooter}
                    delay={index * 0.1}
                  />
                ))}
              </Grid>
            </Container>
          </Section>

          {/* Promo Blocks after specific groups */}
          {groupIndex === 0 && <PromoBlock1Ru />}
          {groupIndex === 1 && <PromoBlock2Ru />}
          {groupIndex === 2 && <PromoBlock3Ru />}
        </div>
      ))}
    </div>
  );
};
