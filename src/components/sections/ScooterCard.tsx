'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, Badge, BodySmall } from '@/components/ui';
import { ScooterModel } from '@/types';
import { Star, ExternalLink, Award } from 'lucide-react';
import { secureWindowOpen } from '@/utils/secure-window';

interface ScooterCardProps {
  scooter: ScooterModel;
  delay?: number;
}

export const ScooterCard: React.FC<ScooterCardProps> = ({ scooter, delay = 0 }) => {
  const formatPricing = (pricing: ScooterModel['pricing']) => {
    return [
      `1-3 days - ${pricing['1-3']} ฿/day`,
      `3-6 days - ${pricing['3-6']} ฿/day`,
      `7-12 - ${pricing['7-12']} ฿/day`,
      `13-22 - ${pricing['13-22']} ฿/day`,
      `30 days - ${pricing['30']} ฿`,
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px 0px" }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="h-full"
    >
      <Card variant="elevated" padding="none" className="h-full overflow-hidden">
        <div className="relative">
          {/* Best Seller Badge */}
          {scooter.isBestSeller && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="warning" className="flex items-center space-x-1">
                <Award className="w-3 h-3" />
                <span>Best Seller</span>
              </Badge>
            </div>
          )}

          {/* Scooter Image */}
          <div className="relative h-48 md:h-56 bg-gray-50">
            <Image
              src={scooter.image}
              alt={`${scooter.name} scooter`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={false}
            />
          </div>
        </div>

        <CardContent className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-black mb-1">
                {scooter.name}
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="font-medium text-black">{scooter.rating}</span>
                </div>
                <BodySmall>({scooter.reviewCount} reviews)</BodySmall>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-4">
            <div className="bg-surface rounded-lg p-3">
              {formatPricing(scooter.pricing).map((price, index) => (
                <div key={index} className="text-sm text-black">
                  {price}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {scooter.features.map((feature, index) => (
                <BodySmall key={index} className="text-text-secondary">
                  {feature}
                </BodySmall>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              style={{ color: 'white' }}
              onClick={() => secureWindowOpen(scooter.photoLink, '_blank')}
            >
              <span style={{ color: 'white' }}>All photos</span>
              <ExternalLink className="w-3 h-3" style={{ color: 'white' }} />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
