'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { Badge } from '@/components/ui';
import { EXACT_CONTENT_MY } from '@/data/exact-content-my';
import { animations } from '@/lib/animations';
import { Star } from 'lucide-react';

export const HeaderMy: React.FC = () => {
  const { reviews } = EXACT_CONTENT_MY;

  return (
    <motion.header
      {...animations.fadeInDown}
      className="bg-surface-elevated border-b border-border-light sticky top-0 z-50 backdrop-blur-md bg-opacity-95"
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div
            {...animations.scaleIn}
            className="flex items-center space-x-3"
          >
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-semibold text-text-primary">
                Smile Rental
              </h1>
              <p className="text-sm text-text-secondary">Phuket</p>
            </div>
            {/* Trustpilot badge for mobile */}
            <div className="sm:hidden ml-2">
              <Image
                src="/images/trustpilot-reviews.png"
                alt="Ulasan Trustpilot"
                width={80}
                height={24}
                loading="lazy"
                decoding="async"
                sizes="80px"
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Reviews Section - Centered */}
          <motion.div
            {...animations.fadeIn}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center justify-center space-x-6 flex-1"
          >
            <div className="relative w-32 h-16">
              <Image
                src="/images/trustpilot-reviews.png"
                alt="Ulasan Trustpilot"
                fill
                className="object-contain"
              />
            </div>

            <div className="text-left">
              <div className="text-sm font-semibold text-black">
                Dipercayai oleh 500+ pelanggan
              </div>
              <div className="text-xs text-yellow-500">
                ★★★★★ 4.9/5
              </div>
              <div className="text-xs text-black">
                Disahkan Google Maps
              </div>
            </div>
          </motion.div>

          <div className="hidden md:block w-32"></div>
        </div>

        {/* Mobile Reviews */}
        <motion.div
          {...animations.fadeInUp}
          transition={{ delay: 0.4 }}
          className="md:hidden pb-4 flex items-center justify-center space-x-4"
        >
          <Badge variant="success" size="sm">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {reviews.google.rating} Google
          </Badge>
          <Badge variant="primary" size="sm">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {reviews.tripadvisor.rating} TripAdvisor
          </Badge>
          <Badge variant="warning" size="sm">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {reviews.trustscore.rating} TrustScore
          </Badge>
        </motion.div>
      </Container>
    </motion.header>
  );
};
