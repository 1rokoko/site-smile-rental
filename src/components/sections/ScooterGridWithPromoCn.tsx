'use client';

import React from 'react';
import { Container, Section, Grid } from '@/components/layout';
import { ScooterCardGridCn } from './ScooterCardGridCn';
import { PromoBlock1Cn } from './PromoBlock1Cn';
import { PromoBlock2Cn } from './PromoBlock2Cn';
import { PromoBlock3Cn } from './PromoBlock3Cn';
import { SCOOTERS } from '@/data/scooters';

export const ScooterGridWithPromoCn: React.FC = () => {
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
                  <ScooterCardGridCn
                    key={scooter.id}
                    scooter={scooter}
                    delay={index * 0.1}
                  />
                ))}
              </Grid>
            </Container>
          </Section>

          {groupIndex === 0 && <PromoBlock1Cn />}
          {groupIndex === 1 && <PromoBlock2Cn />}
          {groupIndex === 2 && <PromoBlock3Cn />}
        </div>
      ))}
    </div>
  );
};
