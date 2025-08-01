'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { animations, viewportSettings } from '@/lib/animations';
import { cn } from '@/utils/cn';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  delay?: number;
  animation?: 'fadeInUp' | 'scaleIn' | 'slideInLeft' | 'slideInRight';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  variant = 'elevated',
  padding = 'md',
  hover = true,
  delay = 0,
  animation = 'fadeInUp',
}) => {
  const animationConfig = {
    ...animations[animation],
    transition: {
      ...animations[animation].transition,
      delay,
    },
  };

  const hoverConfig = hover ? animations.hoverScale : {};

  return (
    <motion.div
      {...animationConfig}
      {...hoverConfig}
      viewport={viewportSettings}
      className={cn(className)}
    >
      <Card
        variant={variant}
        padding={padding}
        hover={false} // Disable Card's hover since we're using Framer Motion
      >
        {children}
      </Card>
    </motion.div>
  );
};
