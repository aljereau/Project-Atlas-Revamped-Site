/**
 * Backdrop Blur and Overlay Animation System
 * Task 4.1.4 - Sophisticated backdrop animations during modal transitions
 * Apple-inspired blur effects and overlay animations
 */

import { Variants } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';

/**
 * Advanced Backdrop Blur Animation with Apple-Inspired Effects
 */
export const advancedBackdropVariants: Variants = {
  // Hidden state - no backdrop
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px) saturate(1)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    scale: 1.1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
  
  // Appearing state - gradual blur in
  appearing: {
    opacity: 0.6,
    backdropFilter: 'blur(4px) saturate(1.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    scale: 1.05,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Visible state - full backdrop effect
  visible: {
    opacity: 1,
    backdropFilter: 'blur(16px) saturate(1.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    scale: 1,
    transition: {
      duration: timing.slow,
      ease: appleEasing.gentle,
      staggerChildren: 0.1,
    },
  },
  
  // Dismissing state - fade out
  dismissing: {
    opacity: 0.3,
    backdropFilter: 'blur(8px) saturate(1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    scale: 1.02,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Exit state - complete removal
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px) saturate(1)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    scale: 1.1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Layered Backdrop System for Complex Visual Depth
 */
export const layeredBackdropVariants: Variants = {
  // Base layer - primary blur
  baseLayer: {
    hidden: {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      backgroundColor: 'rgba(44, 44, 44, 0)',
    },
    visible: {
      opacity: 1,
      backdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(44, 44, 44, 0.3)',
      transition: {
        duration: timing.slow,
        ease: appleEasing.primary,
      },
    },
    exit: {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      backgroundColor: 'rgba(44, 44, 44, 0)',
      transition: {
        duration: timing.normal,
        ease: appleEasing.sharp,
      },
    },
  },
  
  // Accent layer - subtle color wash
  accentLayer: {
    hidden: {
      opacity: 0,
      backgroundColor: 'rgba(122, 139, 115, 0)',
      scale: 0.9,
    },
    visible: {
      opacity: 0.15,
      backgroundColor: 'rgba(122, 139, 115, 0.1)',
      scale: 1,
      transition: {
        duration: timing.verySlow,
        ease: appleEasing.gentle,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      backgroundColor: 'rgba(122, 139, 115, 0)',
      scale: 1.1,
      transition: {
        duration: timing.normal,
        ease: appleEasing.primary,
      },
    },
  },
};

/**
 * Modal Container Overlay with Sophisticated Shadow System
 */
export const modalOverlayVariants: Variants = {
  // Hidden state - no overlay
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    rotateX: 5,
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    borderRadius: '16px',
    transformOrigin: 'center bottom',
  },
  
  // Emerging state - appearing from bottom
  emerging: {
    opacity: 0.8,
    scale: 0.95,
    y: 20,
    rotateX: 2,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    borderRadius: '20px',
    transformOrigin: 'center bottom',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Visible state - full modal display
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
    borderRadius: '24px',
    transformOrigin: 'center center',
    transition: {
      duration: timing.slow,
      ease: appleEasing.gentle,
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
  
  // Floating state - subtle breathing animation
  floating: {
    y: [0, -2, 0],
    scale: [1, 1.002, 1],
    boxShadow: [
      '0 25px 80px rgba(0, 0, 0, 0.25)',
      '0 30px 90px rgba(0, 0, 0, 0.3)',
      '0 25px 80px rgba(0, 0, 0, 0.25)',
    ],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
  
  // Exit state - smooth disappear
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -30,
    rotateX: -3,
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    transformOrigin: 'center top',
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Backdrop Gradient Overlay for Visual Depth
 */
export const gradientOverlayVariants: Variants = {
  hidden: {
    opacity: 0,
    background: 'linear-gradient(135deg, rgba(122, 139, 115, 0) 0%, rgba(44, 44, 44, 0) 100%)',
    scale: 0.8,
  },
  
  visible: {
    opacity: 1,
    background: 'linear-gradient(135deg, rgba(122, 139, 115, 0.1) 0%, rgba(44, 44, 44, 0.3) 100%)',
    scale: 1,
    transition: {
      duration: timing.verySlow,
      ease: appleEasing.gentle,
      delay: 0.2,
    },
  },
  
  exit: {
    opacity: 0,
    background: 'linear-gradient(135deg, rgba(122, 139, 115, 0) 0%, rgba(44, 44, 44, 0) 100%)',
    scale: 1.2,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
};

/**
 * Interactive Backdrop with Touch Response
 */
export const interactiveBackdropVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  // Response to tap/click
  pressed: {
    scale: 1.01,
    opacity: 0.9,
    transition: {
      duration: 0.1,
      ease: appleEasing.sharp,
    },
  },
  
  // Ripple effect from touch point
  ripple: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 0.6,
      ease: appleEasing.gentle,
      times: [0, 0.3, 1],
    },
  },
};

/**
 * Performance-Optimized Backdrop for Mobile
 */
export const mobileBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    // Reduced blur for mobile performance
    backdropFilter: 'blur(0px)',
  },
  
  visible: {
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    // Lighter blur for mobile
    backdropFilter: 'blur(8px)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  exit: {
    opacity: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backdropFilter: 'blur(0px)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Utility function to create backdrop sequences
 */
export function createBackdropSequence(isMobile = false): Variants {
  return isMobile ? mobileBackdropVariants : advancedBackdropVariants;
}

/**
 * Backdrop animation system exports
 */
export const backdropAnimations = {
  advanced: advancedBackdropVariants,
  layered: layeredBackdropVariants,
  modalOverlay: modalOverlayVariants,
  gradient: gradientOverlayVariants,
  interactive: interactiveBackdropVariants,
  mobile: mobileBackdropVariants,
} as const;

/**
 * Backdrop timing and easing configurations
 */
export const backdropTimings = {
  // Quick backdrop for snappy interactions
  quick: {
    duration: timing.fast,
    ease: appleEasing.sharp,
  },
  
  // Smooth backdrop for elegant transitions
  smooth: {
    duration: timing.slow,
    ease: appleEasing.primary,
  },
  
  // Gentle backdrop for subtle effects
  gentle: {
    duration: timing.verySlow,
    ease: appleEasing.gentle,
  },
} as const; 