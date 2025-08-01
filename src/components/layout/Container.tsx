import React from 'react';
import { cn } from '@/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = true,
}) => {
  const baseStyles = ['mx-auto', 'w-full'];
  
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  };

  const paddingStyles = padding ? ['px-4 sm:px-6 lg:px-8'] : [];

  return (
    <div
      className={cn(
        baseStyles,
        sizes[size],
        paddingStyles,
        className
      )}
    >
      {children}
    </div>
  );
};
