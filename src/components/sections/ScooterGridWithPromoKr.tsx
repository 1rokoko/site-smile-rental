'use client';

import React from 'react';
import { Container, Section, Grid } from '@/components/layout';
import { ScooterCardGridKr } from './ScooterCardGridKr';
import { PromoBlock1Kr } from './PromoBlock1Kr';
import { PromoBlock2Kr } from './PromoBlock2Kr';
import { PromoBlock3Kr } from './PromoBlock3Kr';
import { SCOOTERS } from '@/data/scooters';

export const ScooterGridWithPromoKr: React.FC = () => {
  const scooterGroups: typeof SCOOTERS[] = [];
  for (let i = 0; i < SCOOTERS.length; i += 4) {
    scooterGroups.push(SCOOTERS.slice(i, i + 4));
  }

  return (
    <div>
      {scooterGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <Section padding="lg">
            <Container>
              <Grid cols={{ default: 2, md: 3, lg: 4 }} gap="lg">
                {group.map((scooter, index) => (
                  <ScooterCardGridKr
                    key={scooter.id}
                    scooter={scooter}
                    delay={index * 0.1}
                  />
                ))}
              </Grid>
            </Container>
          </Section>

          {groupIndex === 0 && <PromoBlock1Kr />}
          {groupIndex === 1 && <PromoBlock2Kr />}
          {groupIndex === 2 && <PromoBlock3Kr />}
        </div>
      ))}
    </div>
  );
};
