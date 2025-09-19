'use client';

import React from 'react';
import { Container, Section, Grid } from '@/components/layout';
import { ScooterCardGridIn } from './ScooterCardGridIn';
import { PromoBlock1In } from './PromoBlock1In';
import { PromoBlock2In } from './PromoBlock2In';
import { PromoBlock3In } from './PromoBlock3In';
import { SCOOTERS } from '@/data/scooters';

export const ScooterGridWithPromoIn: React.FC = () => {
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
                  <ScooterCardGridIn
                    key={scooter.id}
                    scooter={scooter}
                    delay={index * 0.1}
                  />
                ))}
              </Grid>
            </Container>
          </Section>

          {groupIndex === 0 && <PromoBlock1In />}
          {groupIndex === 1 && <PromoBlock2In />}
          {groupIndex === 2 && <PromoBlock3In />}
        </div>
      ))}
    </div>
  );
};
