'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ScooterModel } from '@/types';
import { Star, Award } from 'lucide-react';

interface ScooterCardGridProps {
  scooter: ScooterModel;
  delay?: number;
}

export const ScooterCardGrid: React.FC<ScooterCardGridProps> = ({ scooter, delay = 0 }) => {
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
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="h-full"
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        {/* Best Seller Badge */}
        {scooter.isBestSeller && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Best Seller</span>
            </div>
          </div>
        )}

        {/* Scooter Image */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gray-50">
          <img
            src={scooter.image}
            alt={`${scooter.name} scooter`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-black mb-1">
              {scooter.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 fill-current" />
                <span className="font-medium text-black text-sm">{scooter.rating}</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-600">({scooter.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-3">
            <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
              {formatPricing(scooter.pricing).map((price, index) => (
                <div key={index} className="text-xs sm:text-sm text-black">
                  {price}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-3">
            <div className="grid grid-cols-1 gap-1">
              {scooter.features.map((feature, index) => (
                <div key={index} className="text-xs sm:text-sm text-gray-600">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* All Photos Button */}
          <div className="mt-auto">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              style={{ color: 'white' }}
              onClick={() => window.open(scooter.photoLink, '_blank')}
            >
              <span style={{ color: 'white' }}>All photos</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
