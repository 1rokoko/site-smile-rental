import React from 'react';
import { cn } from '@/utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'surface' | 'elevated';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  padding = 'lg',
  background = 'default',
  id,
}) => {
  const baseStyles = ['w-full'];

  const paddings = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 md:py-20',
    xl: 'py-20 md:py-24',
  };

  const backgrounds = {
    default: 'bg-background',
    surface: 'bg-surface',
    elevated: 'bg-surface-elevated',
  };

  return (
    <section
      id={id}
      className={cn(
        baseStyles,
        paddings[padding],
        backgrounds[background],
        className
      )}
    >
      {children}
    </section>
  );
};
