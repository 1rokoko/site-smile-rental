'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';
import { EXACT_CONTENT_RU } from '@/data/exact-content-ru';

export const FloatingContactButtonsRu: React.FC = () => {
  const { contact } = EXACT_CONTENT_RU;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col space-y-3">
      {/* WhatsApp Button */}
      <motion.a
        href={CONTACT_INFO.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline font-medium text-white">{contact.whatsapp}</span>
      </motion.a>

      {/* Telegram Button */}
      <motion.a
        href={CONTACT_INFO.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Send className="w-5 h-5" />
        <span className="hidden sm:inline font-medium text-white">{contact.telegram}</span>
      </motion.a>
    </div>
  );
};
