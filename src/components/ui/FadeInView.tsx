'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { animations, viewportSettings } from '@/lib/animations';

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  stagger?: boolean;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  className,
  delay = 0,
  animation = 'fadeInUp',
  stagger = false,
}) => {
  if (stagger) {
    return (
      <motion.div
        variants={animations.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={viewportSettings}
        className={className}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={animations.staggerItem}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  const animationConfig = {
    ...animations[animation],
    transition: {
      ...animations[animation].transition,
      delay,
    },
  };

  return (
    <motion.div
      {...animationConfig}
      viewport={viewportSettings}
      className={className}
    >
      {children}
    </motion.div>
  );
};
