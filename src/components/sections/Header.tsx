'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { Badge } from '@/components/ui';
import { EXACT_CONTENT } from '@/data/exact-content';
import { CONTACT_INFO } from '@/lib/constants';
import { animations } from '@/lib/animations';
import { Star, MessageCircle, Phone } from 'lucide-react';

export const Header: React.FC = () => {
  const { reviews } = EXACT_CONTENT;

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
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            {...animations.fadeIn}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center space-x-6"
          >
            {/* Trustpilot Image */}
            <div className="relative w-32 h-16">
              <Image
                src="https://static.craftum.com/zeLa4rzLhQtrU7pfeBgaeN0ihbo=/370x0/filters:no_upscale()/https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/6ca4a4dd-3265-4638-a796-92d11edcbb8c.png"
                alt="Trustpilot Reviews"
                fill
                className="object-contain"
              />
            </div>

            {/* Google Image */}
            <div className="relative w-32 h-16">
              <Image
                src="https://static.craftum.com/Q3DjJKbR9CzYmiovTJdIJkHCdkY=/416x0/filters:no_upscale()/https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/658342/1a943978-581e-4754-8228-27179fe11967.jpg"
                alt="Google Reviews"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Contact Buttons */}
          <motion.div
            {...animations.slideInRight}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-2"
          >
            <a
              href={CONTACT_INFO.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href={CONTACT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-success text-white rounded-full hover:bg-green-600 transition-colors duration-200"
            >
              <Phone className="w-5 h-5" />
            </a>
          </motion.div>
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
            {reviews.hostadvice.rating} Hostadvice
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
