import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary))',
          dark: 'rgb(var(--color-primary-dark))',
        },
        secondary: 'rgb(var(--color-secondary))',
        success: 'rgb(var(--color-success))',
        warning: 'rgb(var(--color-warning))',
        danger: 'rgb(var(--color-danger))',
        gray: {
          50: 'rgb(var(--color-gray-50))',
          100: 'rgb(var(--color-gray-100))',
          200: 'rgb(var(--color-gray-200))',
          300: 'rgb(var(--color-gray-300))',
          400: 'rgb(var(--color-gray-400))',
          500: 'rgb(var(--color-gray-500))',
          600: 'rgb(var(--color-gray-600))',
          700: 'rgb(var(--color-gray-700))',
          800: 'rgb(var(--color-gray-800))',
          900: 'rgb(var(--color-gray-900))',
        },
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
}

export default config
