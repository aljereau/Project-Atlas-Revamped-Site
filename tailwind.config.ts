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
        // Neutral Foundation
        'paper-white': '#FEFEFE',
        'paper-cream': '#FAF8F5',
        'soft-beige': '#F5F2ED',
        'warm-gray': '#E8E5E0',
        
        // Content Colors
        'text-primary': '#2C2C2C',
        'text-secondary': '#6B6B6B',
        'text-muted': '#9A9A9A',
        
        // Brand Accents - Atlas Green
        'atlas-green': {
          DEFAULT: '#7A8B73',
          light: '#A4B49A',
          dark: '#5C6B54',
        },
        
        // Contrast & Energy - Orange
        'bright-orange': {
          DEFAULT: '#E67E22',
          hover: '#D35400',
          light: '#F39C12',
        },
        
        // Functional Colors
        'border-light': '#E0DDD6',
        'border-medium': '#D0CCC3',
        'shadow-subtle': 'rgba(44, 44, 44, 0.08)',
      },
      fontFamily: {
        // Serif for Headlines - Intellectual, Readable
        serif: ['Crimson Text', 'Times New Roman', 'serif'],
        // Sans-serif for UI - Clean, Modern
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        // Monospace for Code/Data - Technical Elements
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Headlines
        'xxl': '3.5rem',    // Welcome to Atlas
        'xl': '2.25rem',    // Section Headers
        'lg': '1.5rem',     // Panel Titles
        // Body Text
        'base': '1rem',     // Standard paragraph
        'sm': '0.875rem',   // Secondary info
        'xs': '0.75rem',    // Captions, metadata
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        'xxl': '3rem',     // 48px
        'xxxl': '4rem',    // 64px
      },
      borderRadius: {
        'card': '16px',
        'container': '24px',
        'button': '12px',
        'menu': '8px',
      },
      boxShadow: {
        'subtle': '0 4px 12px rgba(44, 44, 44, 0.08)',
        'hover': '0 6px 16px rgba(44, 44, 44, 0.12)',
      },
      animation: {
        'panel-slide': 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'subtle-bounce': 'subtleBounce 0.1s ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        subtleBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config 