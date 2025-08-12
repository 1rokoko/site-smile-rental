'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';
import { handleContactClick } from '@/utils/secure-window';

export const FloatingContactButtonsRu: React.FC = () => {
  const handleTelegramClick = () => {
    handleContactClick('telegram', CONTACT_INFO.telegram);
  };

  const handleWhatsAppClick = () => {
    handleContactClick('whatsapp', CONTACT_INFO.whatsapp);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 px-4">
      {/* Telegram Button */}
      <motion.button
        onClick={handleTelegramClick}
        className="flex items-center justify-center space-x-2 sm:space-x-3 bg-blue-500 hover:bg-blue-600 px-4 py-3 sm:px-6 sm:py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl min-w-[140px] sm:min-w-[160px] text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        <span className="font-medium text-base sm:text-lg text-white">Telegram</span>
      </motion.button>

      {/* WhatsApp Button */}
      <motion.button
        onClick={handleWhatsAppClick}
        className="flex items-center justify-center space-x-2 sm:space-x-3 bg-green-500 hover:bg-green-600 px-4 py-3 sm:px-6 sm:py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl min-w-[140px] sm:min-w-[160px] text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        <span className="font-medium text-base sm:text-lg text-white">WhatsApp</span>
      </motion.button>
    </div>
  );
};
