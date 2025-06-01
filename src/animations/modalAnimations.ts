/**
 * Apple Notch-Inspired Modal Animation System
 * Sophisticated Framer Motion animations for Atlas Site modals and panels
 * Following Phase 4 requirements for fluid panel expansions and modal transitions
 */

import { Variants, Transition } from 'framer-motion';

// Apple-inspired easing curves for smooth, natural motion
export const appleEasing = {
  // Primary Apple easing - smooth and natural
  primary: [0.4, 0.0, 0.2, 1],
  // Gentle easing for content reveals
  gentle: [0.25, 0.1, 0.25, 1],
  // Sharp easing for quick interactions
  sharp: [0.4, 0.0, 0.6, 1],
  // Bounce easing for playful interactions
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// Animation timing constants
export const timing = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

/**
 * Apple Notch-Inspired Panel Expansion Animations
 * Creates smooth panel-to-modal transitions with sophisticated easing
 */
export const panelExpansionVariants: Variants = {
  // Initial state - compact panel
  initial: {
    scale: 0.95,
    opacity: 0,
    y: 20,
    borderRadius: '16px',
    transformOrigin: 'center top',
  },
  
  // Expanded state - full modal
  expanded: {
    scale: 1,
    opacity: 1,
    y: 0,
    borderRadius: '24px',
    transformOrigin: 'center top',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  
  // Exit state - smooth collapse
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 10,
    borderRadius: '12px',
    transformOrigin: 'center top',
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Modal Backdrop Animation with Apple-inspired blur effect
 */
export const backdropVariants: Variants = {
  initial: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  
  visible: {
    opacity: 1,
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    transition: {
      duration: timing.slow,
      ease: appleEasing.gentle,
    },
  },
  
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
};

/**
 * Navigation Card to Modal Transformation
 * Smooth transition from homepage cards to full modal experience
 */
export const cardToModalVariants: Variants = {
  card: {
    scale: 1,
    borderRadius: '12px',
    y: 0,
    opacity: 1,
    transition: {
      duration: timing.fast,
      ease: appleEasing.gentle,
    },
  },
  
  expanding: {
    scale: 1.02,
    borderRadius: '16px',
    y: -5,
    opacity: 1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  modal: {
    scale: 1,
    borderRadius: '24px',
    y: 0,
    opacity: 1,
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Content Stagger Animation for Modal Sections
 * Apple-inspired staggered content reveal
 */
export const contentStaggerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Header Animation with Apple-style emphasis
 */
export const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      delay: 0.1,
    },
  },
  
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Button and Interactive Element Animations
 */
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
    transition: {
      duration: timing.fast,
      ease: appleEasing.gentle,
    },
  },
  
  hover: {
    scale: 1.02,
    y: -1,
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Panel Slide Animation for Content Expansion
 * Smooth sliding panels inspired by Apple's interface design
 */
export const panelSlideVariants: Variants = {
  collapsed: {
    height: 'auto',
    opacity: 1,
    clipPath: 'inset(0 0 0 0)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  expanded: {
    height: 'auto',
    opacity: 1,
    clipPath: 'inset(0 0 0 0)',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.05,
    },
  },
};

/**
 * Micro-interaction animations for enhanced user feedback
 */
export const microInteractionVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 0.6,
      ease: appleEasing.gentle,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
  
  glow: {
    boxShadow: [
      '0 0 0 0 rgba(122, 139, 115, 0)',
      '0 0 0 8px rgba(122, 139, 115, 0.1)',
      '0 0 0 0 rgba(122, 139, 115, 0)',
    ],
    transition: {
      duration: timing.verySlow,
      ease: appleEasing.gentle,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/**
 * Custom transition configurations for different use cases
 */
export const transitions = {
  // Smooth modal open/close
  modal: {
    duration: timing.slow,
    ease: appleEasing.primary,
  } as Transition,
  
  // Quick interactions
  interaction: {
    duration: timing.fast,
    ease: appleEasing.sharp,
  } as Transition,
  
  // Content loading
  content: {
    duration: timing.normal,
    ease: appleEasing.gentle,
  } as Transition,
  
  // Staggered animations
  stagger: {
    staggerChildren: 0.1,
    delayChildren: 0.2,
  } as Transition,
} as const;

/**
 * Spring configurations for natural motion
 */
export const springs = {
  // Gentle spring for content
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  },
  
  // Bouncy spring for interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    restDelta: 0.001,
  },
  
  // Snappy spring for quick feedback
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    restDelta: 0.001,
  },
} as const;

/**
 * Utility function to create custom panel expansion animation
 */
export function createPanelExpansion(
  initialScale = 0.95,
  finalScale = 1,
  duration = timing.slow
): Variants {
  return {
    initial: {
      scale: initialScale,
      opacity: 0,
      y: 20,
      borderRadius: '16px',
    },
    expanded: {
      scale: finalScale,
      opacity: 1,
      y: 0,
      borderRadius: '24px',
      transition: {
        duration,
        ease: appleEasing.primary,
        staggerChildren: 0.1,
      },
    },
    exit: {
      scale: initialScale,
      opacity: 0,
      y: 10,
      transition: {
        duration: timing.normal,
        ease: appleEasing.sharp,
      },
    },
  };
}

/**
 * Utility function for reduced motion preferences
 */
export function getReducedMotionVariants(variants: Variants): Variants {
  const reducedVariants: Variants = {};
  
  Object.keys(variants).forEach((key) => {
    const variant = variants[key];
    if (typeof variant === 'object') {
      reducedVariants[key] = {
        ...variant,
        transition: {
          duration: 0.01, // Nearly instant
          ease: 'linear',
        },
      };
    }
  });
  
  return reducedVariants;
}

/**
 * Export all animation variants for easy access
 */
export const animations = {
  panelExpansion: panelExpansionVariants,
  backdrop: backdropVariants,
  cardToModal: cardToModalVariants,
  contentStagger: contentStaggerVariants,
  header: headerVariants,
  button: buttonVariants,
  panelSlide: panelSlideVariants,
  microInteraction: microInteractionVariants,
} as const; 