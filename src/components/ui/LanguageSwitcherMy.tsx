'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LanguageSwitcherMyProps {
  className?: string;
}

const USFlag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="40" fill="#B22234" />
    <rect width="60" height="3.08" y="3.08" fill="white" />
    <rect width="60" height="3.08" y="9.23" fill="white" />
    <rect width="60" height="3.08" y="15.38" fill="white" />
    <rect width="60" height="3.08" y="21.54" fill="white" />
    <rect width="60" height="3.08" y="27.69" fill="white" />
    <rect width="60" height="3.08" y="33.85" fill="white" />
    <rect width="24" height="21.54" fill="#3C3B6E" />
    <g fill="white">
      <circle cx="3" cy="3" r="0.8" />
      <circle cx="9" cy="3" r="0.8" />
      <circle cx="15" cy="3" r="0.8" />
      <circle cx="21" cy="3" r="0.8" />
      <circle cx="6" cy="6" r="0.8" />
      <circle cx="12" cy="6" r="0.8" />
      <circle cx="18" cy="6" r="0.8" />
      <circle cx="3" cy="9" r="0.8" />
      <circle cx="9" cy="9" r="0.8" />
      <circle cx="15" cy="9" r="0.8" />
      <circle cx="21" cy="9" r="0.8" />
      <circle cx="6" cy="12" r="0.8" />
      <circle cx="12" cy="12" r="0.8" />
      <circle cx="18" cy="12" r="0.8" />
      <circle cx="3" cy="15" r="0.8" />
      <circle cx="9" cy="15" r="0.8" />
      <circle cx="15" cy="15" r="0.8" />
      <circle cx="21" cy="15" r="0.8" />
      <circle cx="6" cy="18" r="0.8" />
      <circle cx="12" cy="18" r="0.8" />
      <circle cx="18" cy="18" r="0.8" />
    </g>
  </svg>
);

const MYFlag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="40" fill="#CC0001" />
    <rect width="60" height="4" y="4" fill="white" />
    <rect width="60" height="4" y="12" fill="white" />
    <rect width="60" height="4" y="20" fill="white" />
    <rect width="60" height="4" y="28" fill="white" />
    <rect width="60" height="4" y="36" fill="white" />
    <rect width="24" height="22" fill="#010066" />
    <circle cx="12" cy="11" r="7" fill="#FFCC00" />
    <polygon points="12,4 13.4,8.5 18,8.5 14.2,11.2 15.6,15.7 12,13 8.4,15.7 9.8,11.2 6,8.5 10.6,8.5" fill="#010066" />
  </svg>
);

export const LanguageSwitcherMy: React.FC<LanguageSwitcherMyProps> = ({ className }) => {
  const [currentLanguage, setCurrentLanguage] = useState('my');

  const languages = [
    {
      code: 'en',
      name: 'English',
      shortName: 'EN',
      FlagComponent: USFlag,
    },
    {
      code: 'my',
      name: 'Bahasa Melayu',
      shortName: 'MY',
      FlagComponent: MYFlag,
    },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);

    if (languageCode === 'en') {
      window.location.href = '/';
    } else if (languageCode === 'my') {
      window.location.href = '/my';
    }
  };

  return (
    <div className={cn('flex items-center justify-center space-x-3', className)}>
      {languages.map((language) => (
        <motion.button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={cn(
            'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300',
            'border-2 shadow-lg hover:shadow-xl',
            'bg-white hover:bg-gray-50 active:bg-gray-100',
            'transform hover:-translate-y-0.5',
            currentLanguage === language.code
              ? 'border-orange-500 shadow-orange-200 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300'
          )}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <language.FlagComponent className="w-8 h-6 rounded-sm shadow-sm border border-gray-200" />
          <span
            className={cn(
              'text-sm font-semibold transition-colors',
              currentLanguage === language.code
                ? 'text-orange-600'
                : 'text-gray-700 hover:text-orange-600'
            )}
          >
            {language.shortName}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
