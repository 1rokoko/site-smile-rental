import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = [
    'inline-flex items-center justify-center',
    'font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95',
  ];

  const variants = {
    primary: [
      'bg-primary text-white',
      'hover:bg-primary-dark',
      'focus:ring-primary/50',
      'shadow-md hover:shadow-lg',
    ],
    secondary: [
      'bg-secondary text-white',
      'hover:bg-orange-600',
      'focus:ring-secondary/50',
      'shadow-md hover:shadow-lg',
    ],
    outline: [
      'border-2 border-primary text-primary bg-transparent',
      'hover:bg-primary hover:text-white',
      'focus:ring-primary/50',
    ],
    ghost: [
      'text-gray-700 bg-transparent',
      'hover:bg-gray-100',
      'focus:ring-gray-300',
    ],
  };

  const sizes = {
    sm: ['px-3 py-1.5 text-sm', 'rounded-md'],
    md: ['px-4 py-2 text-base', 'rounded-lg'],
    lg: ['px-6 py-3 text-lg', 'rounded-xl'],
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
