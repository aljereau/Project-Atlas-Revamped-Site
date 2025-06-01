/**
 * Sophisticated Micro-Interaction System
 * Task 4.2.2 - Advanced micro-interactions with delightful user feedback
 * Comprehensive system for button press, hover, and touch interactions
 */

import { Variants, MotionValue } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';

/**
 * Button Press Micro-Interactions
 * Sophisticated button feedback with multiple interaction states
 */
export const buttonMicroInteractions: Variants = {
  // Resting state
  idle: {
    scale: 1,
    y: 0,
    rotateX: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  // Hover state with subtle lift
  hover: {
    scale: 1.02,
    y: -1,
    rotateX: 2,
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  // Active press state
  pressed: {
    scale: 0.98,
    y: 0,
    rotateX: 0,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    transition: {
      duration: 0.1,
      ease: appleEasing.sharp,
    },
  },
  
  // Focus state for accessibility
  focused: {
    scale: 1.01,
    y: 0,
    rotateX: 0,
    boxShadow: '0 4px 12px rgba(122, 139, 115, 0.3), 0 0 0 3px rgba(122, 139, 115, 0.1)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.gentle,
    },
  },
  
  // Success state after action completion
  success: {
    scale: [1, 1.05, 1],
    y: [0, -2, 0],
    rotateX: [0, 5, 0],
    boxShadow: [
      '0 4px 12px rgba(0, 0, 0, 0.1)',
      '0 12px 24px rgba(34, 197, 94, 0.2)',
      '0 4px 12px rgba(0, 0, 0, 0.1)',
    ],
    transition: {
      duration: 0.6,
      ease: appleEasing.bounce,
      times: [0, 0.5, 1],
    },
  },
};

/**
 * Card Hover Micro-Interactions
 * Sophisticated card responses with depth and movement
 */
export const cardMicroInteractions: Variants = {
  idle: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    z: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  hover: {
    scale: 1.02,
    rotateX: 2,
    rotateY: 0,
    z: 10,
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  // Tilt effect based on mouse position
  tilt: {
    rotateX: [-2, 2],
    rotateY: [-2, 2],
    transition: {
      duration: timing.slow,
      ease: appleEasing.gentle,
    },
  },
  
  press: {
    scale: 0.98,
    rotateX: 0,
    rotateY: 0,
    z: 0,
    transition: {
      duration: 0.1,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Input Field Micro-Interactions
 * Enhanced form input feedback and validation states
 */
export const inputMicroInteractions: Variants = {
  idle: {
    borderColor: 'rgba(224, 221, 214, 1)', // border-light
    boxShadow: '0 0 0 0 rgba(122, 139, 115, 0)',
    scale: 1,
    transition: {
      duration: timing.fast,
      ease: appleEasing.gentle,
    },
  },
  
  focused: {
    borderColor: 'rgba(122, 139, 115, 1)', // atlas-green
    boxShadow: '0 0 0 3px rgba(122, 139, 115, 0.1)',
    scale: 1.01,
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  valid: {
    borderColor: 'rgba(34, 197, 94, 1)', // green-500
    boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
    scale: 1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  error: {
    borderColor: 'rgba(239, 68, 68, 1)', // red-500
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    scale: 1,
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.4,
      ease: appleEasing.bounce,
      times: [0, 0.2, 0.4, 0.6, 1],
    },
  },
  
  typing: {
    borderColor: 'rgba(122, 139, 115, 0.8)',
    boxShadow: '0 0 0 2px rgba(122, 139, 115, 0.15)',
    scale: 1.005,
    transition: {
      duration: timing.fast,
      ease: appleEasing.gentle,
    },
  },
};

/**
 * Icon Animation Micro-Interactions
 * Delightful icon responses and state changes
 */
export const iconMicroInteractions: Variants = {
  idle: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  hover: {
    scale: 1.1,
    rotate: 5,
    opacity: 1,
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  active: {
    scale: 0.9,
    rotate: 0,
    opacity: 0.8,
    transition: {
      duration: 0.1,
      ease: appleEasing.sharp,
    },
  },
  
  // Spinning loader state
  loading: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
  
  // Success checkmark animation
  success: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, 0],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 0.5,
      ease: appleEasing.bounce,
      times: [0, 0.5, 1],
    },
  },
  
  // Bounce notification
  bounce: {
    scale: [1, 1.3, 1],
    y: [0, -5, 0],
    transition: {
      duration: 0.4,
      ease: appleEasing.bounce,
      times: [0, 0.4, 1],
    },
  },
};

/**
 * Ripple Effect System for Touch Interactions
 */
export const rippleEffectVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0.8,
  },
  
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Advanced Micro-Interaction Manager
 * Coordinates complex interaction sequences and provides haptic-like feedback
 */
export class MicroInteractionManager {
  private activeInteractions = new Set<string>();
  private interactionHistory: Array<{ type: string; timestamp: number }> = [];
  private hapticSupported = 'vibrate' in navigator;
  
  /**
   * Register and execute micro-interaction
   */
  async executeMicroInteraction(
    type: 'button' | 'card' | 'input' | 'icon' | 'ripple',
    state: string,
    element?: HTMLElement,
    options?: { haptic?: boolean; sound?: boolean }
  ): Promise<void> {
    const interactionId = `${type}-${state}-${Date.now()}`;
    
    // Prevent duplicate rapid interactions
    if (this.activeInteractions.has(`${type}-${state}`)) {
      return;
    }
    
    this.activeInteractions.add(`${type}-${state}`);
    
    try {
      // Execute visual interaction
      await this.executeVisualFeedback(type, state, element);
      
      // Execute haptic feedback if supported and requested
      if (options?.haptic && this.hapticSupported) {
        this.executeHapticFeedback(state);
      }
      
      // Log interaction for analytics
      this.logInteraction(type, state);
      
    } catch (error) {
      console.error('Micro-interaction failed:', error);
    } finally {
      // Clean up after interaction
      setTimeout(() => {
        this.activeInteractions.delete(`${type}-${state}`);
      }, 100);
    }
  }
  
  /**
   * Execute visual feedback for interaction
   */
  private async executeVisualFeedback(
    type: string,
    state: string,
    element?: HTMLElement
  ): Promise<void> {
    if (!element) return;
    
    // Add visual feedback class
    element.classList.add(`micro-interaction-${state}`);
    
    // Create ripple effect for touch interactions
    if (state === 'pressed' || state === 'active') {
      this.createRippleEffect(element);
    }
    
    // Remove class after animation
    setTimeout(() => {
      element.classList.remove(`micro-interaction-${state}`);
    }, 300);
  }
  
  /**
   * Create ripple effect on element
   */
  private createRippleEffect(element: HTMLElement): void {
    const ripple = document.createElement('div');
    ripple.className = 'micro-interaction-ripple';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(122, 139, 115, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      margin-left: -10px;
    `;
    
    // Ensure element has relative positioning
    const position = getComputedStyle(element).position;
    if (position === 'static') {
      element.style.position = 'relative';
    }
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
  
  /**
   * Execute haptic feedback patterns
   */
  private executeHapticFeedback(state: string): void {
    if (!this.hapticSupported) return;
    
    const patterns = {
      hover: [10],
      pressed: [20],
      success: [30, 10, 30],
      error: [50, 20, 50, 20, 50],
      focus: [5],
    };
    
    const pattern = patterns[state as keyof typeof patterns] || [10];
    navigator.vibrate(pattern);
  }
  
  /**
   * Log interaction for analytics
   */
  private logInteraction(type: string, state: string): void {
    this.interactionHistory.push({
      type: `${type}-${state}`,
      timestamp: Date.now(),
    });
    
    // Keep only last 100 interactions
    if (this.interactionHistory.length > 100) {
      this.interactionHistory = this.interactionHistory.slice(-100);
    }
  }
  
  /**
   * Get interaction analytics
   */
  getInteractionAnalytics(): {
    total: number;
    byType: Record<string, number>;
    recent: Array<{ type: string; timestamp: number }>;
  } {
    const byType: Record<string, number> = {};
    
    this.interactionHistory.forEach(interaction => {
      byType[interaction.type] = (byType[interaction.type] || 0) + 1;
    });
    
    return {
      total: this.interactionHistory.length,
      byType,
      recent: this.interactionHistory.slice(-10),
    };
  }
  
  /**
   * Clear interaction history
   */
  clearHistory(): void {
    this.interactionHistory = [];
  }
}

/**
 * Mouse Tracking for Tilt Effects
 */
export class MouseTiltTracker {
  private element: HTMLElement | null = null;
  private isTracking = false;
  private sensitivity = 0.1;
  
  /**
   * Start tracking mouse for tilt effects
   */
  startTracking(element: HTMLElement, sensitivity = 0.1): void {
    this.element = element;
    this.sensitivity = sensitivity;
    this.isTracking = true;
    
    element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }
  
  /**
   * Stop tracking mouse
   */
  stopTracking(): void {
    if (this.element) {
      this.element.removeEventListener('mousemove', this.handleMouseMove.bind(this));
      this.element.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
    
    this.isTracking = false;
    this.element = null;
  }
  
  /**
   * Handle mouse move for tilt calculation
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.element || !this.isTracking) return;
    
    const rect = this.element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) * this.sensitivity;
    const rotateY = (centerX - x) * this.sensitivity;
    
    this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
  
  /**
   * Reset tilt on mouse leave
   */
  private handleMouseLeave(): void {
    if (!this.element) return;
    
    this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }
}

/**
 * Global Micro-Interaction Manager Instance
 */
export const globalMicroInteractionManager = new MicroInteractionManager();

/**
 * Utility Functions for Micro-Interactions
 */
export const microInteractionUtils = {
  /**
   * Create custom button interaction
   */
  createCustomButtonInteraction(
    hoverScale = 1.02,
    pressScale = 0.98,
    hoverY = -1
  ): Variants {
    return {
      idle: { scale: 1, y: 0 },
      hover: { 
        scale: hoverScale, 
        y: hoverY,
        transition: { duration: 0.15, ease: appleEasing.primary }
      },
      pressed: { 
        scale: pressScale, 
        y: 0,
        transition: { duration: 0.1, ease: appleEasing.sharp }
      },
    };
  },
  
  /**
   * Create custom icon animation
   */
  createCustomIconAnimation(
    hoverScale = 1.1,
    rotation = 5
  ): Variants {
    return {
      idle: { scale: 1, rotate: 0 },
      hover: { 
        scale: hoverScale, 
        rotate: rotation,
        transition: { duration: 0.2, ease: appleEasing.primary }
      },
    };
  },
  
  /**
   * Add ripple effect to element
   */
  addRippleEffect(element: HTMLElement, event: MouseEvent): void {
    globalMicroInteractionManager.executeMicroInteraction(
      'ripple',
      'pressed',
      element,
      { haptic: true }
    );
  },
};

/**
 * CSS-in-JS Styles for Micro-Interactions
 */
export const microInteractionStyles = {
  rippleKeyframes: `
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `,
  
  interactionBase: {
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    userSelect: 'none' as const,
    WebkitTapHighlightColor: 'transparent',
  },
  
  buttonBase: {
    ...this.interactionBase,
    transformOrigin: 'center',
    willChange: 'transform, box-shadow',
  },
  
  cardBase: {
    ...this.interactionBase,
    transformOrigin: 'center',
    willChange: 'transform, box-shadow',
    perspective: '1000px',
  },
};

/**
 * Export micro-interaction system
 */
export const microInteractionSystem = {
  button: buttonMicroInteractions,
  card: cardMicroInteractions,
  input: inputMicroInteractions,
  icon: iconMicroInteractions,
  ripple: rippleEffectVariants,
  manager: MicroInteractionManager,
  mouseTracker: MouseTiltTracker,
  utils: microInteractionUtils,
  styles: microInteractionStyles,
  global: globalMicroInteractionManager,
} as const; 