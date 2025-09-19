'use client';

import React from 'react';
import { Container, Section, Grid } from '@/components/layout';
import { ScooterCardGridMy } from './ScooterCardGridMy';
import { PromoBlock1My } from './PromoBlock1My';
import { PromoBlock2My } from './PromoBlock2My';
import { PromoBlock3My } from './PromoBlock3My';
import { SCOOTERS } from '@/data/scooters';

export const ScooterGridWithPromoMy: React.FC = () => {
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
                  <ScooterCardGridMy
                    key={scooter.id}
                    scooter={scooter}
                    delay={index * 0.1}
                  />
                ))}
              </Grid>
            </Container>
          </Section>

          {groupIndex === 0 && <PromoBlock1My />}
          {groupIndex === 1 && <PromoBlock2My />}
          {groupIndex === 2 && <PromoBlock3My />}
        </div>
      ))}
    </div>
  );
};

