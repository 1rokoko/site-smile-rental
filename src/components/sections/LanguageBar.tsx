'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { LanguageSwitcher } from '@/components/ui';
import { animations } from '@/lib/animations';

export const LanguageBar: React.FC = () => {
  return (
    <motion.div
      {...animations.fadeInDown}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50 py-4 shadow-sm"
    >
      <Container>
        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>
      </Container>
    </motion.div>
  );
};
