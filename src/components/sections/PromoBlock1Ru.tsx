'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section, Grid } from '@/components/layout';
import { H2, Body, FadeInView } from '@/components/ui';
import {
  Gift,
  UtensilsCrossed,
  Camera,
  PartyPopper,
  Clock
} from 'lucide-react';

export const PromoBlock1Ru: React.FC = () => {
  const bonusItems = [
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Скидка до 6000 ฿",
      subtitle: "топ 50 ресторанов"
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Скидка 200 ฿ на любую",
      subtitle: "экскурсию"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Получите 2000 ฿ бесплатно",
      subtitle: ""
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "10 лет отбора",
      subtitle: "лучших локаций Пхукета"
    }
  ];

  const additionalItems = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Фото-маршруты"
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Маршруты для пар"
    },
    {
      icon: <PartyPopper className="w-8 h-8" />,
      title: "Мальчишник на Пхукете*"
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: "Гастро-тур"
    }
  ];

  return (
    <Section padding="xl" background="surface" id="bonus-section">
      <Container>
        {/* Main Title */}
        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">
            Всем до <span className="text-orange-500">6 000฿</span> при аренде:
          </H2>
        </FadeInView>

        {/* Main Benefits Grid */}
        <Grid cols={{ default: 2, md: 4 }} gap="md" className="mb-12">
          {bonusItems.map((item, index) => (
            <motion.div
              key={index}
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

        {/* VIP Section */}
        <FadeInView animation="fadeInUp" className="text-center mb-12">
          <H2 className="mb-4 text-black">
            <span className="text-orange-500">2000฿</span> бесплатно Отдыхайте как <span className="text-orange-500">VIP</span> без планирования
          </H2>
          <Body className="text-black max-w-3xl mx-auto">
            Невероятно продуманные маршруты для максимально эмоционального, запоминающегося отдыха
          </Body>
        </FadeInView>

        {/* Additional Services Grid */}
        <Grid cols={{ default: 2, md: 4 }} gap="md">
          {additionalItems.map((item, index) => (
            <motion.div
              key={index}
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
