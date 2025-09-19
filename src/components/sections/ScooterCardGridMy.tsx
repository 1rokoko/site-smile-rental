'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ScooterModel } from '@/types';
import { Star, Award } from 'lucide-react';
import { secureWindowOpen } from '@/utils/secure-window';

interface ScooterCardGridMyProps {
  scooter: ScooterModel;
  delay?: number;
}

const translateName = (name: string): string => {
  if (name.toLowerCase() === 'best seller') {
    return 'Pilihan Terlaris';
  }
  return name;
};

const translateFeature = (feature: string): string => {
  if (feature.startsWith('Year ')) {
    return feature.replace('Year', 'Tahun');
  }

  if (feature.startsWith('Power CC')) {
    const power = feature.replace('Power CC', '').trim();
    return `Kuasa ${power} CC`;
  }

  if (feature.startsWith('Comfort')) {
    return feature.replace('Comfort', 'Keselesaan');
  }

  if (feature.startsWith('Safety')) {
    return feature.replace('Safety', 'Keselamatan');
  }

  return feature;
};

const formatPricing = (pricing: ScooterModel['pricing']): string[] => {
  const lines: string[] = [];
  if (pricing['1-3'] !== undefined) {
    lines.push(`1-3 hari - ${pricing['1-3']} ฿/hari`);
  }
  if (pricing['3-6'] !== undefined) {
    lines.push(`3-6 hari - ${pricing['3-6']} ฿/hari`);
  }
  if (pricing['7-12'] !== undefined) {
    lines.push(`7-12 hari - ${pricing['7-12']} ฿/hari`);
  }
  if (pricing['13-22'] !== undefined) {
    lines.push(`13-22 hari - ${pricing['13-22']} ฿/hari`);
  }
  if (pricing['30'] !== undefined) {
    lines.push(`30 hari - ${pricing['30']} ฿`);
  }
  return lines;
};

export const ScooterCardGridMy: React.FC<ScooterCardGridMyProps> = ({ scooter, delay = 0 }) => {
  const translatedName = translateName(scooter.name);
  const pricingLines = formatPricing(scooter.pricing);
  const translatedFeatures = scooter.features.map(translateFeature);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="h-full"
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        {scooter.isBestSeller && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Pilihan Terlaris</span>
            </div>
          </div>
        )}

        <div className="relative h-48 sm:h-56 md:h-64 bg-gray-50">
          <Image
            src={scooter.image}
            alt={`Skuter ${translatedName}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            priority={false}
          />
        </div>

        <div className="p-3 sm:p-4">
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-black mb-1">
              {translatedName}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 fill-current" />
                <span className="font-medium text-black text-sm">{scooter.rating}</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-600">({scooter.reviewCount} ulasan)</span>
            </div>
          </div>

          <div className="mb-3">
            <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
              {pricingLines.map((line) => (
                <div key={line} className="text-xs sm:text-sm text-black">
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <div className="grid grid-cols-1 gap-1">
              {translatedFeatures.map((feature) => (
                <div key={feature} className="text-xs sm:text-sm text-gray-600">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              style={{ color: 'white' }}
              onClick={() => secureWindowOpen(scooter.photoLink, '_blank')}
            >
              <span style={{ color: 'white' }}>Semua foto</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
