'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H2, Body, FadeInView } from '@/components/ui';
import { Gift, UtensilsCrossed, Camera, PartyPopper, Clock } from 'lucide-react';

export const PromoBlock1My: React.FC = () => {
  const bonusItems = [
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Diskaun hingga 6000 ฿',
      subtitle: '50 restoran terbaik',
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Diskaun 200 ฿ untuk',
      subtitle: 'mana-mana lawatan',
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Terima 2000 ฿',
      subtitle: 'secara percuma',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '10 tahun memilih',
      subtitle: 'lokasi terbaik Phuket',
    },
  ];

  const additionalItems = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'Laluan foto',
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Laluan untuk pasangan',
    },
    {
      icon: <PartyPopper className="w-8 h-8" />,
      title: 'Pesta bujang Phuket*',
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Lawatan gastronomi',
    },
  ];

  return (
    <Section padding="xl" background="surface" id="bonus-section">
      <Container>
        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">
            Sehingga <span className="text-orange-500">6 000฿</span> untuk setiap sewaan:
          </H2>
        </FadeInView>

        <Grid cols={{ default: 2, md: 4 }} gap="md" className="mb-12">
          {bonusItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                {item.icon}
              </div>
              <div className="text-black font-medium text-sm sm:text-base">
                {item.title}
              </div>
              {item.subtitle && (
                <div className="text-black font-medium text-sm sm:text-base">
                  {item.subtitle}
                </div>
              )}
            </motion.div>
          ))}
        </Grid>

        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">
            <span className="text-orange-500">2000฿</span> percuma Nikmati seperti <span className="text-orange-500">VIP</span> tanpa perlu merancang
          </H2>
          <Body className="text-black max-w-3xl mx-auto">
            Rangkaian perjalanan yang teliti untuk percutian paling beremosi dan diingati.
          </Body>
        </FadeInView>

        <Grid cols={{ default: 2, md: 4 }} gap="md">
          {additionalItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                {item.icon}
              </div>
              <div className="text-black font-medium text-sm sm:text-base">
                {item.title}
              </div>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};
