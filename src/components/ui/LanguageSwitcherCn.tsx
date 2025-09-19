'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LanguageSwitcherCnProps {
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

const CNFlag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="40" fill="#DE2910" />
    <polygon points="6,6 7,9 10,9 7.5,11 8.5,14 6,12 3.5,14 4.5,11 2,9 5,9" fill="#FFDE00" />
    <polygon points="12,4 12.6,5.8 14.5,5.8 13,6.9 13.6,8.7 12,7.6 10.4,8.7 11,6.9 9.5,5.8 11.4,5.8" fill="#FFDE00" />
    <polygon points="14,8 14.6,9.8 16.5,9.8 15,10.9 15.6,12.7 14,11.6 12.4,12.7 13,10.9 11.5,9.8 13.4,9.8" fill="#FFDE00" />
    <polygon points="12,12 12.6,13.8 14.5,13.8 13,14.9 13.6,16.7 12,15.6 10.4,16.7 11,14.9 9.5,13.8 11.4,13.8" fill="#FFDE00" />
    <polygon points="10,8 10.6,9.8 12.5,9.8 11,10.9 11.6,12.7 10,11.6 8.4,12.7 9,10.9 7.5,9.8 9.4,9.8" fill="#FFDE00" />
  </svg>
);

export const LanguageSwitcherCn: React.FC<LanguageSwitcherCnProps> = ({ className }) => {
  const [currentLanguage, setCurrentLanguage] = useState('cn');

  const languages = [
    {
      code: 'en',
      name: 'English',
      shortName: 'EN',
      FlagComponent: USFlag,
    },
    {
      code: 'cn',
      name: '中文',
      shortName: 'CN',
      FlagComponent: CNFlag,
    },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);

    if (languageCode === 'en') {
      window.location.href = '/';
    } else if (languageCode === 'cn') {
      window.location.href = '/cn';
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
