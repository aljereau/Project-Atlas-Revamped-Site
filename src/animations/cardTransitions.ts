/**
 * Navigation Card to Modal Transformation System
 * Smooth transitions from homepage cards to full modal experiences
 * Task 4.1.2 - Apple notch-inspired fluid transformations
 */

import { Variants, Transition } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';

/**
 * Homepage Navigation Card Animation States
 */
export const navigationCardVariants: Variants = {
  // Resting state - normal card appearance
  idle: {
    scale: 1,
    y: 0,
    rotate: 0,
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  // Hover state - subtle lift and expansion
  hover: {
    scale: 1.02,
    y: -2,
    rotate: 0,
    borderRadius: '14px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  // Active/pressed state - slight compression
  pressed: {
    scale: 0.98,
    y: 0,
    rotate: 0,
    borderRadius: '10px',
    transition: {
      duration: 0.1,
      ease: appleEasing.sharp,
    },
  },
  
  // Preparing to expand - intermediate state
  expanding: {
    scale: 1.05,
    y: -5,
    rotate: 0,
    borderRadius: '16px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Transformed to modal - full expansion
  modal: {
    scale: 1,
    y: 0,
    rotate: 0,
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    zIndex: 50,
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Card Content Animation during Transformation
 */
export const cardContentVariants: Variants = {
  // Normal card content display
  card: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: timing.fast,
      ease: appleEasing.gentle,
    },
  },
  
  // Content fading out during expansion
  expanding: {
    opacity: 0.7,
    scale: 0.95,
    y: -5,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Content hidden in modal state (replaced by modal content)
  modal: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Modal Content Reveal Animation
 * Content that appears when card transforms to modal
 */
export const modalContentRevealVariants: Variants = {
  // Hidden state - before modal opens
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
  
  // Revealed state - modal content visible
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: timing.slow,
      ease: appleEasing.gentle,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  
  // Exiting state - modal closing
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
};

/**
 * Card-specific transformation variants for different homepage cards
 */

// "What We Build" card transformation
export const whatWeBuildCardVariants: Variants = {
  ...navigationCardVariants,
  modal: {
    ...navigationCardVariants.modal,
    // Custom positioning for tools modal
    x: 0,
    y: 0,
    width: '100%',
    maxWidth: '1200px',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// "Why We Exist" card transformation  
export const whyWeExistCardVariants: Variants = {
  ...navigationCardVariants,
  modal: {
    ...navigationCardVariants.modal,
    // Custom positioning for about modal
    x: 0,
    y: 0,
    width: '100%',
    maxWidth: '1000px',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.12,
      delayChildren: 0.25,
    },
  },
};

// "Who We Are" card transformation
export const whoWeAreCardVariants: Variants = {
  ...navigationCardVariants,
  modal: {
    ...navigationCardVariants.modal,
    // Custom positioning for team modal
    x: 0,
    y: 0,
    width: '100%',
    maxWidth: '900px',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

// "Our Timeline" card transformation
export const ourTimelineCardVariants: Variants = {
  ...navigationCardVariants,
  modal: {
    ...navigationCardVariants.modal,
    // Custom positioning for project log modal
    x: 0,
    y: 0,
    width: '100%',
    maxWidth: '1100px',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

/**
 * Card Icon Animation during Transformation
 */
export const cardIconVariants: Variants = {
  idle: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  expanding: {
    scale: 1.2,
    rotate: 0,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  modal: {
    scale: 0.8,
    rotate: 0,
    opacity: 0,
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Card Border Animation for Visual Feedback
 */
export const cardBorderVariants: Variants = {
  idle: {
    borderWidth: '1px',
    borderColor: 'rgba(224, 221, 214, 1)', // border-light from design system
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  hover: {
    borderWidth: '2px',
    borderColor: 'rgba(122, 139, 115, 0.3)', // atlas-green with opacity
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  expanding: {
    borderWidth: '2px',
    borderColor: 'rgba(122, 139, 115, 0.6)', // stronger atlas-green
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  modal: {
    borderWidth: '0px',
    borderColor: 'rgba(122, 139, 115, 0)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Utility function to create card-specific transition timing
 */
export function createCardTransition(
  expandDuration = timing.slow,
  staggerDelay = 0.1,
  childrenDelay = 0.2
): Transition {
  return {
    duration: expandDuration,
    ease: appleEasing.primary,
    staggerChildren: staggerDelay,
    delayChildren: childrenDelay,
  };
}

/**
 * Shared layout transition for smooth card-to-modal transformation
 */
export const sharedLayoutTransition: Transition = {
  type: 'tween',
  duration: timing.slow,
  ease: appleEasing.primary,
};

/**
 * Animation sequence controller for card-to-modal transformation
 */
export interface CardTransformationSequence {
  card: keyof typeof navigationCardVariants;
  content: keyof typeof cardContentVariants;
  modalContent: keyof typeof modalContentRevealVariants;
  icon: keyof typeof cardIconVariants;
  border: keyof typeof cardBorderVariants;
}

export const transformationSequences = {
  // Idle state - all elements at rest
  idle: {
    card: 'idle',
    content: 'card',
    modalContent: 'hidden',
    icon: 'idle',
    border: 'idle',
  } as CardTransformationSequence,
  
  // Hover state - subtle feedback
  hover: {
    card: 'hover',
    content: 'card',
    modalContent: 'hidden',
    icon: 'hover',
    border: 'hover',
  } as CardTransformationSequence,
  
  // Pressed state - quick feedback
  pressed: {
    card: 'pressed',
    content: 'card',
    modalContent: 'hidden',
    icon: 'idle',
    border: 'hover',
  } as CardTransformationSequence,
  
  // Expanding state - preparing for modal
  expanding: {
    card: 'expanding',
    content: 'expanding',
    modalContent: 'hidden',
    icon: 'expanding',
    border: 'expanding',
  } as CardTransformationSequence,
  
  // Modal state - full transformation complete
  modal: {
    card: 'modal',
    content: 'modal',
    modalContent: 'visible',
    icon: 'modal',
    border: 'modal',
  } as CardTransformationSequence,
} as const;

/**
 * Export card animation variants for different card types
 */
export const cardVariants = {
  navigation: navigationCardVariants,
  whatWeBuild: whatWeBuildCardVariants,
  whyWeExist: whyWeExistCardVariants,
  whoWeAre: whoWeAreCardVariants,
  ourTimeline: ourTimelineCardVariants,
  content: cardContentVariants,
  modalContentReveal: modalContentRevealVariants,
  icon: cardIconVariants,
  border: cardBorderVariants,
} as const; 