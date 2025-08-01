import React from 'react';
import { cn } from '@/utils/cn';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
}) => {
  const baseStyles = ['grid', 'w-full'];

  // Generate responsive grid classes
  const gridCols = [];
  if (cols.default) gridCols.push(`grid-cols-${cols.default}`);
  if (cols.sm) gridCols.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) gridCols.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) gridCols.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) gridCols.push(`xl:grid-cols-${cols.xl}`);

  const gaps = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
    xl: 'gap-8 md:gap-10',
  };

  return (
    <div
      className={cn(
        baseStyles,
        gridCols,
        gaps[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  span,
}) => {
  const spanClasses = [];
  
  if (span?.default) spanClasses.push(`col-span-${span.default}`);
  if (span?.sm) spanClasses.push(`sm:col-span-${span.sm}`);
  if (span?.md) spanClasses.push(`md:col-span-${span.md}`);
  if (span?.lg) spanClasses.push(`lg:col-span-${span.lg}`);
  if (span?.xl) spanClasses.push(`xl:col-span-${span.xl}`);

  return (
    <div className={cn(spanClasses, className)}>
      {children}
    </div>
  );
};
