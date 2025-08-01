'use client';

import React from 'react';
import { Container, Section, Grid } from '@/components/layout';
import { H2, FadeInView } from '@/components/ui';
import { ScooterCardGrid } from './ScooterCardGrid';
import { PromoBlock1 } from './PromoBlock1';
import { PromoBlock2 } from './PromoBlock2';
import { PromoBlock3 } from './PromoBlock3';
import { SCOOTERS } from '@/data/scooters';

export const ScooterGridWithPromo: React.FC = () => {
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
          {groupIndex === 0 && <PromoBlock1 />}
          {groupIndex === 1 && <PromoBlock2 />}
          {groupIndex === 2 && <PromoBlock3 />}
        </div>
      ))}
    </div>
  );
};
