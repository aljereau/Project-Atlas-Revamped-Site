/**
 * Enhanced Modal Entrance/Exit Transition System
 * Task 4.2.1 - Sophisticated modal transitions with depth and momentum
 * Advanced animation system for seamless modal experiences
 */

import { Variants, Transition } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';

/**
 * Enhanced Modal Entrance Animations with Depth
 * Creates immersive modal appearances with sophisticated depth cues
 */
export const enhancedEntranceVariants: Variants = {
  // Hidden state - pre-entrance
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 60,
    rotateX: 15,
    rotateY: 0,
    rotateZ: 0,
    transformOrigin: 'center bottom',
    filter: 'blur(8px)',
    // Advanced transform matrix for depth
    transform: 'perspective(1200px) rotateX(15deg) translateY(60px) scale3d(0.85, 0.85, 1)',
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
  },
  
  // Emerging state - initial appearance
  emerging: {
    opacity: 0.4,
    scale: 0.92,
    y: 30,
    rotateX: 8,
    rotateY: 0,
    rotateZ: 0,
    transformOrigin: 'center bottom',
    filter: 'blur(4px)',
    transform: 'perspective(1200px) rotateX(8deg) translateY(30px) scale3d(0.92, 0.92, 1)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Materializing state - gaining solidity
  materializing: {
    opacity: 0.8,
    scale: 0.98,
    y: 10,
    rotateX: 3,
    rotateY: 0,
    rotateZ: 0,
    transformOrigin: 'center center',
    filter: 'blur(1px)',
    transform: 'perspective(1200px) rotateX(3deg) translateY(10px) scale3d(0.98, 0.98, 1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: timing.slow,
      ease: appleEasing.gentle,
    },
  },
  
  // Visible state - fully present
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    transformOrigin: 'center center',
    filter: 'blur(0px)',
    transform: 'perspective(1200px) rotateX(0deg) translateY(0px) scale3d(1, 1, 1)',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.25)',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  
  // Floating state - subtle animation loop
  floating: {
    y: [0, -3, 0],
    scale: [1, 1.002, 1],
    rotateX: [0, 0.5, 0],
    boxShadow: [
      '0 30px 80px rgba(0, 0, 0, 0.25)',
      '0 35px 90px rgba(0, 0, 0, 0.3)',
      '0 30px 80px rgba(0, 0, 0, 0.25)',
    ],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/**
 * Enhanced Modal Exit Animations with Momentum
 * Creates smooth exits with physics-based momentum
 */
export const enhancedExitVariants: Variants = {
  // Beginning to fade
  fading: {
    opacity: 0.8,
    scale: 0.98,
    y: -5,
    rotateX: 0,
    filter: 'blur(0px)',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  // Dissolving with momentum
  dissolving: {
    opacity: 0.4,
    scale: 0.94,
    y: -20,
    rotateX: -5,
    filter: 'blur(2px)',
    transform: 'perspective(1200px) rotateX(-5deg) translateY(-20px) scale3d(0.94, 0.94, 1)',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
  
  // Departing with velocity
  departing: {
    opacity: 0.1,
    scale: 0.88,
    y: -40,
    rotateX: -12,
    filter: 'blur(6px)',
    transform: 'perspective(1200px) rotateX(-12deg) translateY(-40px) scale3d(0.88, 0.88, 1)',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Hidden - completely gone
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -60,
    rotateX: -20,
    filter: 'blur(10px)',
    transform: 'perspective(1200px) rotateX(-20deg) translateY(-60px) scale3d(0.8, 0.8, 1)',
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Staggered Content Reveal System for Modal Sections
 */
export const staggeredContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    filter: 'blur(4px)',
  },
  
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.95,
    filter: 'blur(2px)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Modal Header Enhanced Transitions
 */
export const modalHeaderVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.8,
    rotateX: 20,
    transformOrigin: 'center bottom',
  },
  
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transformOrigin: 'center center',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      delay: 0.1,
    },
  },
  
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    rotateX: -10,
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Modal Body Sections with Progressive Reveal
 */
export const modalBodyVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.95,
    rotateX: 8,
  },
  
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
  
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    rotateX: -4,
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
      staggerChildren: 0.04,
    },
  },
};

/**
 * Modal Footer with Delayed Entrance
 */
export const modalFooterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
      delay: 0.5,
    },
  },
  
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Advanced Modal Animation Orchestrator
 * Coordinates complex modal entrance/exit sequences
 */
export class ModalAnimationOrchestrator {
  private isAnimating = false;
  private currentPhase: 'hidden' | 'entering' | 'visible' | 'exiting' = 'hidden';
  private animationQueue: Array<() => Promise<void>> = [];
  
  /**
   * Execute sophisticated modal entrance sequence
   */
  async executeEntranceSequence(): Promise<void> {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentPhase = 'entering';
    
    try {
      // Phase 1: Initial emergence
      await this.runAnimationPhase('emerging', 300);
      
      // Phase 2: Materialization
      await this.runAnimationPhase('materializing', 500);
      
      // Phase 3: Full visibility with content stagger
      await this.runAnimationPhase('visible', 600);
      
      // Phase 4: Floating state
      this.currentPhase = 'visible';
      
    } catch (error) {
      console.error('Modal entrance animation failed:', error);
    } finally {
      this.isAnimating = false;
    }
  }
  
  /**
   * Execute sophisticated modal exit sequence
   */
  async executeExitSequence(): Promise<void> {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentPhase = 'exiting';
    
    try {
      // Phase 1: Begin fade
      await this.runAnimationPhase('fading', 200);
      
      // Phase 2: Dissolve with momentum
      await this.runAnimationPhase('dissolving', 300);
      
      // Phase 3: Departure
      await this.runAnimationPhase('departing', 300);
      
      // Phase 4: Complete hidden state
      await this.runAnimationPhase('hidden', 200);
      
      this.currentPhase = 'hidden';
      
    } catch (error) {
      console.error('Modal exit animation failed:', error);
    } finally {
      this.isAnimating = false;
    }
  }
  
  /**
   * Run individual animation phase
   */
  private async runAnimationPhase(phase: string, duration: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }
  
  /**
   * Get current animation state
   */
  getCurrentPhase(): string {
    return this.currentPhase;
  }
  
  /**
   * Check if modal is currently animating
   */
  isCurrentlyAnimating(): boolean {
    return this.isAnimating;
  }
}

/**
 * Modal Transition Configuration Presets
 */
export const modalTransitionPresets = {
  // Standard modal with enhanced depth
  standard: {
    entrance: enhancedEntranceVariants,
    exit: enhancedExitVariants,
    content: staggeredContentVariants,
    timing: {
      total: 1200,
      stagger: 100,
      delay: 200,
    },
  },
  
  // Quick modal for simple content
  quick: {
    entrance: {
      hidden: { opacity: 0, scale: 0.9, y: 20 },
      visible: { 
        opacity: 1, scale: 1, y: 0,
        transition: { duration: 0.3, ease: appleEasing.primary }
      },
    },
    exit: {
      visible: { opacity: 1, scale: 1, y: 0 },
      hidden: { 
        opacity: 0, scale: 0.95, y: -10,
        transition: { duration: 0.2, ease: appleEasing.sharp }
      },
    },
    timing: {
      total: 300,
      stagger: 50,
      delay: 0,
    },
  },
  
  // Dramatic modal for important content
  dramatic: {
    entrance: enhancedEntranceVariants,
    exit: enhancedExitVariants,
    content: staggeredContentVariants,
    timing: {
      total: 1800,
      stagger: 150,
      delay: 300,
    },
  },
} as const;

/**
 * Utility Functions for Modal Transitions
 */
export const modalTransitionUtils = {
  /**
   * Create custom entrance transition
   */
  createCustomEntrance(
    scale = 0.85,
    yOffset = 60,
    rotateX = 15,
    duration = timing.slow
  ): Variants {
    return {
      hidden: {
        opacity: 0,
        scale,
        y: yOffset,
        rotateX,
        filter: 'blur(8px)',
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        transition: {
          duration,
          ease: appleEasing.primary,
          staggerChildren: 0.1,
        },
      },
    };
  },
  
  /**
   * Create custom exit transition
   */
  createCustomExit(
    scale = 0.88,
    yOffset = -40,
    rotateX = -12,
    duration = timing.normal
  ): Variants {
    return {
      visible: { opacity: 1, scale: 1, y: 0, rotateX: 0 },
      hidden: {
        opacity: 0,
        scale,
        y: yOffset,
        rotateX,
        filter: 'blur(6px)',
        transition: {
          duration,
          ease: appleEasing.sharp,
        },
      },
    };
  },
};

/**
 * Global Modal Animation Orchestrator Instance
 */
export const globalModalOrchestrator = new ModalAnimationOrchestrator();

/**
 * Export enhanced modal transition system
 */
export const enhancedModalTransitions = {
  entrance: enhancedEntranceVariants,
  exit: enhancedExitVariants,
  content: staggeredContentVariants,
  header: modalHeaderVariants,
  body: modalBodyVariants,
  footer: modalFooterVariants,
  orchestrator: ModalAnimationOrchestrator,
  presets: modalTransitionPresets,
  utils: modalTransitionUtils,
  global: globalModalOrchestrator,
} as const; 