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
        // Enhanced Organic Paper Foundation
        'paper': {
          'white': '#FEFEFE',
          'cream': '#FAF8F5',
          'warm': '#F7F4EF',         // New - warmer cream tone
          'stone': '#F2EFE8',        // New - deeper paper texture
          'shadow': '#EBE7DD',       // New - paper edge shadows
        },
        
        // Refined Beige & Gray Spectrum  
        'organic': {
          'beige': '#F5F2ED',
          'sand': '#F0EDE6',         // New - warmer beige
          'linen': '#EAE6DD',        // New - textured neutral
          'ash': '#E5E1D8',          // New - sophisticated gray-beige
        },
        
        'editorial': {
          'charcoal': '#2C2C2C',     // Existing text-primary
          'graphite': '#3A3A3A',     // New - lighter charcoal
          'ink': '#1F1F1F',          // New - deeper black for emphasis
          'slate': '#6B6B6B',        // Existing text-secondary  
          'stone': '#8A8A8A',        // New - warmer gray
          'mist': '#9A9A9A',         // Existing text-muted
          'whisper': '#B8B8B8',      // New - lighter muted
        },
        
        // Legacy compatibility (preserved exactly)
        'soft-beige': '#F5F2ED',
        'warm-gray': '#E8E5E0',
        'text-primary': '#2C2C2C',
        'text-secondary': '#6B6B6B',
        'text-muted': '#9A9A9A',
        
        // Enhanced Atlas Green with Organic Variations
        'atlas-green': {
          DEFAULT: '#7A8B73',
          '50': '#F4F6F3',           // New - very light sage
          '100': '#E8ECE5',          // New - light sage background
          '200': '#C8D2C1',          // New - soft sage
          '300': '#A4B49A',          // Existing light
          '400': '#8FA084',          // New - medium sage
          '500': '#7A8B73',          // Existing default
          '600': '#6B7A63',          // New - deeper sage
          '700': '#5C6B54',          // Existing dark
          '800': '#4A5645',          // New - forest sage
          '900': '#394136',          // New - deep forest
          'light': '#A4B49A',        // Legacy compatibility
          'dark': '#5C6B54',         // Legacy compatibility
        },
        
        // Enhanced Orange with Editorial Warmth
        'bright-orange': {
          DEFAULT: '#E67E22',
          '50': '#FDF6F0',           // New - very light orange
          '100': '#FAEBE0',          // New - cream orange
          '200': '#F5D1B8',          // New - soft orange
          '300': '#F39C12',          // Existing light
          '400': '#E67E22',          // Existing default
          '500': '#D35400',          // Existing hover
          '600': '#C44E00',          // New - deeper orange
          '700': '#A54000',          // New - burnt orange
          '800': '#8A3500',          // New - dark burnt
          '900': '#6D2A00',          // New - deep burnt
          'hover': '#D35400',        // Legacy compatibility
          'light': '#F39C12',        // Legacy compatibility
        },
        
        // Enhanced Border System with Organic Feel
        'border': {
          'paper': '#F0ECE3',        // New - paper-like border
          'light': '#E0DDD6',        // Existing
          'organic': '#DDD9CE',      // New - warmer light border
          'medium': '#D0CCC3',       // Existing
          'natural': '#C8C3B8',      // New - natural border tone
          'dark': '#B8B2A5',         // New - deeper border
          'editorial': '#A8A199',     // New - sophisticated border
        },
        
        // Enhanced Shadow System with Depth
        'shadow': {
          'paper': 'rgba(44, 44, 44, 0.04)',      // New - very subtle paper shadow
          'subtle': 'rgba(44, 44, 44, 0.08)',     // Existing
          'soft': 'rgba(44, 44, 44, 0.12)',       // New - gentle shadow
          'organic': 'rgba(60, 60, 60, 0.08)',    // New - warmer shadow tone
          'editorial': 'rgba(44, 44, 44, 0.16)',  // New - sophisticated depth
          'depth': 'rgba(44, 44, 44, 0.20)',      // New - pronounced depth
        },
      },
      fontFamily: {
        // Enhanced Editorial Typography Stack
        'editorial-serif': ['var(--font-crimson)', 'Crimson Text', 'Crimson Pro', 'Times New Roman', 'serif'],
        'editorial-sans': ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'editorial-mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        
        // Legacy compatibility (preserved exactly)
        serif: ['var(--font-crimson)', 'Crimson Text', 'Times New Roman', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        // Enhanced Editorial Hierarchy
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // New - hero headlines
        'hero': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],   // Atlas welcome
        'title': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],   // New - major titles
        'headline': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.005em' }], // Section headers
        'subhead': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0' }],      // New - sub-headlines
        'large': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],          // Panel titles
        'body': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],    // New - enhanced body
        'text': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],        // Standard paragraph
        'small': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],   // Secondary info
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],  // Captions, metadata
        'micro': ['0.625rem', { lineHeight: '1.3', letterSpacing: '0.03em' }],   // New - tiny text
        
        // Legacy compatibility (preserved exactly)
        'xxl': '3.5rem',    // Welcome to Atlas
        'xl': '2.25rem',    // Section Headers
        'lg': '1.5rem',     // Panel Titles
        'base': '1rem',     // Standard paragraph
        'sm': '0.875rem',   // Secondary info
        'xs': '0.75rem',    // Captions, metadata
      },
      
      fontWeight: {
        // Enhanced Editorial Weight Scale
        'hairline': '100',
        'thin': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      
      letterSpacing: {
        'tightest': '-0.025em',
        'tighter': '-0.02em',
        'tight': '-0.015em',
        'snug': '-0.01em',
        'normal': '0',
        'wide': '0.01em',
        'wider': '0.02em',
        'widest': '0.03em',
      },
      
      lineHeight: {
        'none': '1',
        'tight': '1.1',
        'snug': '1.15',
        'normal': '1.2',
        'relaxed': '1.3',
        'loose': '1.4',
        'reading': '1.6',    // New - optimal reading line height
        'spacious': '1.8',   // New - very loose line height
      },
      spacing: {
        // Enhanced Organic Rhythm System
        'hair': '0.125rem',     // 2px - finest details
        'px': '1px',            // Hairline borders
        'xs': '0.25rem',        // 4px - existing
        'sm': '0.5rem',         // 8px - existing  
        'md': '1rem',           // 16px - existing
        'lg': '1.5rem',         // 24px - existing
        'xl': '2rem',           // 32px - existing
        'xxl': '3rem',          // 48px - existing
        'xxxl': '4rem',         // 64px - existing
        
        // Editorial Spacing Scale
        'micro': '0.125rem',    // 2px - micro adjustments
        'tiny': '0.375rem',     // 6px - small elements
        'compact': '0.625rem',  // 10px - compact spacing
        'cozy': '0.875rem',     // 14px - cozy spacing
        'comfortable': '1.25rem', // 20px - comfortable reading
        'spacious': '1.75rem',  // 28px - generous spacing
        'airy': '2.5rem',       // 40px - airy layouts
        'generous': '3.5rem',   // 56px - generous sections
        'vast': '5rem',         // 80px - vast spacing
        'epic': '6rem',         // 96px - epic sections
        
        // Content-Specific Spacing
        'paragraph': '1.5rem',  // Standard paragraph spacing
        'section': '3rem',      // Section breaks
        'chapter': '4rem',      // Major content breaks
        'article': '6rem',      // Article separation
        
        // Component-Specific Spacing  
        'card-pad': '1.5rem',   // Card internal padding
        'card-gap': '1rem',     // Gap between cards
        'panel-pad': '2rem',    // Panel internal padding
        'panel-gap': '1.5rem',  // Gap between panels
        'nav-pad': '0.75rem',   // Navigation padding
        'nav-gap': '0.5rem',    // Navigation gaps
        
        // Layout Rhythm
        'rhythm-1': '0.5rem',   // 8px - tight rhythm
        'rhythm-2': '1rem',     // 16px - standard rhythm
        'rhythm-3': '1.5rem',   // 24px - relaxed rhythm
        'rhythm-4': '2rem',     // 32px - loose rhythm
        'rhythm-5': '3rem',     // 48px - spacious rhythm
        'rhythm-6': '4rem',     // 64px - generous rhythm
      },
      borderRadius: {
        // Enhanced Organic Shape System
        'none': '0',
        'hairline': '1px',      // Barely visible curve
        'micro': '2px',         // Tiny curve
        'soft': '4px',          // Soft corners
        'smooth': '6px',        // Smooth corners
        'menu': '8px',          // Existing - menu buttons
        'organic': '10px',      // Natural feeling curve
        'button': '12px',       // Existing - button radius
        'gentle': '14px',       // Gentle curve
        'card': '16px',         // Existing - card radius
        'panel': '18px',        // Panel corners
        'warm': '20px',         // Warm, welcoming curve
        'embrace': '22px',      // Embracing curve
        'container': '24px',    // Existing - container radius
        'cozy': '28px',         // Cozy, intimate curve
        'generous': '32px',     // Generous curve
        'full': '9999px',       // Fully rounded
        
        // Editorial Radius Scale
        'editorial-sm': '6px',   // Small editorial elements
        'editorial-md': '12px',  // Medium editorial elements
        'editorial-lg': '18px',  // Large editorial elements
        'editorial-xl': '24px',  // Extra large editorial elements
      },
      boxShadow: {
        // Enhanced Editorial Shadow System
        'none': 'none',
        
        // Paper-like Shadows
        'paper': '0 1px 3px rgba(44, 44, 44, 0.04)',                  // Minimal paper shadow
        'paper-sm': '0 2px 6px rgba(44, 44, 44, 0.06)',               // Small paper shadow
        'paper-md': '0 4px 12px rgba(44, 44, 44, 0.08)',              // Medium paper shadow
        'paper-lg': '0 8px 24px rgba(44, 44, 44, 0.10)',              // Large paper shadow
        
        // Organic Shadows with Warmth
        'organic': '0 2px 8px rgba(60, 60, 60, 0.08)',                // Organic warm shadow
        'organic-md': '0 4px 16px rgba(60, 60, 60, 0.10)',            // Medium organic shadow
        'organic-lg': '0 8px 32px rgba(60, 60, 60, 0.12)',            // Large organic shadow
        
        // Editorial Depth System
        'editorial': '0 3px 12px rgba(44, 44, 44, 0.12)',             // Editorial shadow
        'editorial-md': '0 6px 24px rgba(44, 44, 44, 0.14)',          // Medium editorial shadow
        'editorial-lg': '0 12px 48px rgba(44, 44, 44, 0.16)',         // Large editorial shadow
        
        // Sophisticated Depth
        'depth-1': '0 1px 4px rgba(44, 44, 44, 0.08)',                // Level 1 depth
        'depth-2': '0 2px 8px rgba(44, 44, 44, 0.10)',                // Level 2 depth
        'depth-3': '0 4px 16px rgba(44, 44, 44, 0.12)',               // Level 3 depth
        'depth-4': '0 8px 32px rgba(44, 44, 44, 0.14)',               // Level 4 depth
        'depth-5': '0 16px 64px rgba(44, 44, 44, 0.16)',              // Level 5 depth
        
        // Interactive Shadows
        'hover-gentle': '0 4px 16px rgba(44, 44, 44, 0.10)',          // Gentle hover effect
        'hover-warm': '0 6px 20px rgba(60, 60, 60, 0.12)',            // Warm hover effect
        'hover-editorial': '0 8px 32px rgba(44, 44, 44, 0.14)',       // Editorial hover effect
        
        // Card Stack Effects
        'stack-1': '0 2px 8px rgba(44, 44, 44, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.05)', // First card in stack
        'stack-2': '0 4px 16px rgba(44, 44, 44, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.05)', // Second card in stack
        'stack-3': '0 8px 32px rgba(44, 44, 44, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05)', // Third card in stack
        
        // Legacy compatibility (preserved exactly)
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