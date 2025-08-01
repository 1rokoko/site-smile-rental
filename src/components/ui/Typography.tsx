import React from 'react';
import { cn } from '@/utils/cn';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

// Heading Components
export const H1: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h1',
}) => {
  return (
    <Component
      className={cn(
        'text-4xl md:text-5xl font-bold text-text-primary leading-tight tracking-tight',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const H2: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h2',
}) => {
  return (
    <Component
      className={cn(
        'text-3xl md:text-4xl font-semibold text-text-primary leading-tight',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const H3: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h3',
}) => {
  return (
    <Component
      className={cn(
        'text-2xl md:text-3xl font-semibold text-text-primary leading-snug',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const H4: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'h4',
}) => {
  return (
    <Component
      className={cn(
        'text-xl md:text-2xl font-medium text-text-primary leading-snug',
        className
      )}
    >
      {children}
    </Component>
  );
};

// Body Text Components
export const BodyLarge: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
}) => {
  return (
    <Component
      className={cn(
        'text-lg text-text-primary leading-relaxed',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const Body: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
}) => {
  return (
    <Component
      className={cn(
        'text-base text-text-primary leading-relaxed',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const BodySmall: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
}) => {
  return (
    <Component
      className={cn(
        'text-sm text-text-secondary leading-relaxed',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const Caption: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'span',
}) => {
  return (
    <Component
      className={cn(
        'text-xs text-text-tertiary leading-normal',
        className
      )}
    >
      {children}
    </Component>
  );
};

// Special Text Components
export const Lead: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
}) => {
  return (
    <Component
      className={cn(
        'text-xl text-text-secondary leading-relaxed font-light',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const Muted: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'span',
}) => {
  return (
    <Component
      className={cn(
        'text-text-tertiary',
        className
      )}
    >
      {children}
    </Component>
  );
};
