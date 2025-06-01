/**
 * Modal Overlay Content Stagger System
 * Task 4.2.4 - Progressive content reveal with sophisticated timing
 * Advanced stagger coordination for modal content sections
 */

import { Variants, Transition, Orchestration } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';

/**
 * Progressive Content Reveal Variants
 * Sophisticated timing for sequential content appearance
 */
export const progressiveRevealVariants: Variants = {
  // Hidden state - content preparation
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    filter: 'blur(4px)',
    transformOrigin: 'center top',
  },
  
  // Emerging state - content beginning to appear
  emerging: {
    opacity: 0.3,
    y: 10,
    scale: 0.98,
    filter: 'blur(2px)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.gentle,
    },
  },
  
  // Visible state - fully revealed content
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Exit state - content leaving
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    filter: 'blur(2px)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Section-Based Stagger Coordination
 * Different timing patterns for various content sections
 */
export const sectionStaggerVariants = {
  // Header sections - fastest reveal
  header: {
    hidden: { opacity: 0, y: 15, scale: 0.96 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: {
        duration: timing.fast,
        ease: appleEasing.primary,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  } as Variants,
  
  // Content body - medium reveal
  body: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: {
        duration: timing.normal,
        ease: appleEasing.gentle,
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  } as Variants,
  
  // Navigation elements - quick reveal
  navigation: {
    hidden: { opacity: 0, x: -10, scale: 0.98 },
    visible: {
      opacity: 1, x: 0, scale: 1,
      transition: {
        duration: timing.fast,
        ease: appleEasing.primary,
        staggerChildren: 0.04,
        delayChildren: 0.15,
      },
    },
  } as Variants,
  
  // Footer actions - delayed reveal
  footer: {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: {
        duration: timing.normal,
        ease: appleEasing.gentle,
        staggerChildren: 0.06,
        delayChildren: 0.4,
      },
    },
  } as Variants,
  
  // Media content - specialized reveal
  media: {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(8px)' },
    visible: {
      opacity: 1, scale: 1, filter: 'blur(0px)',
      transition: {
        duration: timing.slow,
        ease: appleEasing.gentle,
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  } as Variants,
} as const;

/**
 * Dynamic Stagger Based on Content Complexity
 * Adaptive timing based on content characteristics
 */
export class DynamicStaggerController {
  private contentComplexity: Map<string, number> = new Map();
  private baseStaggerDelay = 0.08;
  private maxStaggerDelay = 0.15;
  private minStaggerDelay = 0.03;
  
  /**
   * Calculate dynamic stagger timing based on content complexity
   */
  calculateStaggerTiming(
    contentType: 'text' | 'image' | 'video' | 'interactive' | 'list' | 'card',
    contentLength: number,
    hasMedia: boolean = false
  ): {
    staggerChildren: number;
    delayChildren: number;
    duration: number;
  } {
    // Base complexity scores
    const complexityScores = {
      text: 1,
      image: 1.5,
      video: 2.5,
      interactive: 3,
      list: 1.2,
      card: 1.8,
    };
    
    const baseComplexity = complexityScores[contentType] || 1;
    const lengthMultiplier = Math.min(contentLength / 100, 2); // Cap at 2x
    const mediaMultiplier = hasMedia ? 1.3 : 1;
    
    const totalComplexity = baseComplexity * lengthMultiplier * mediaMultiplier;
    
    // Calculate adaptive timing
    const staggerChildren = Math.min(
      Math.max(this.baseStaggerDelay * totalComplexity, this.minStaggerDelay),
      this.maxStaggerDelay
    );
    
    const delayChildren = staggerChildren * 2.5;
    const duration = timing.normal * (1 + totalComplexity * 0.2);
    
    return { staggerChildren, delayChildren, duration };
  }
  
  /**
   * Create dynamic stagger variants for specific content
   */
  createDynamicStaggerVariants(
    contentId: string,
    contentConfig: {
      type: 'text' | 'image' | 'video' | 'interactive' | 'list' | 'card';
      length: number;
      hasMedia?: boolean;
      priority?: 'high' | 'medium' | 'low';
    }
  ): Variants {
    const timing = this.calculateStaggerTiming(
      contentConfig.type,
      contentConfig.length,
      contentConfig.hasMedia
    );
    
    // Adjust for priority
    if (contentConfig.priority === 'high') {
      timing.staggerChildren *= 0.7;
      timing.delayChildren *= 0.8;
    } else if (contentConfig.priority === 'low') {
      timing.staggerChildren *= 1.3;
      timing.delayChildren *= 1.2;
    }
    
    this.contentComplexity.set(contentId, timing.staggerChildren);
    
    return {
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
        filter: 'blur(4px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration: timing.duration,
          ease: appleEasing.gentle,
          staggerChildren: timing.staggerChildren,
          delayChildren: timing.delayChildren,
        },
      },
    };
  }
  
  /**
   * Get complexity score for content
   */
  getContentComplexity(contentId: string): number {
    return this.contentComplexity.get(contentId) || this.baseStaggerDelay;
  }
}

/**
 * Performance-Optimized Content Loading Animations
 * Efficient animations for content appearance
 */
export const optimizedLoadingVariants: Variants = {
  // Skeleton loading state
  skeleton: {
    opacity: 0.6,
    backgroundPosition: '200% 0',
    transition: {
      backgroundPosition: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  },
  
  // Content loading
  loading: {
    opacity: 0.8,
    scale: 0.98,
    transition: {
      duration: timing.fast,
      ease: appleEasing.gentle,
    },
  },
  
  // Content loaded and visible
  loaded: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
      staggerChildren: 0.06,
    },
  },
  
  // Error state
  error: {
    opacity: 0.7,
    scale: 0.98,
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.4,
      ease: appleEasing.bounce,
      times: [0, 0.2, 0.4, 0.6, 1],
    },
  },
};

/**
 * Modal Content Stagger Orchestrator
 * Coordinates complex content reveal sequences
 */
export class ModalContentStaggerOrchestrator {
  private staggerController = new DynamicStaggerController();
  private activeAnimations = new Set<string>();
  private contentQueue: Array<{
    id: string;
    element: HTMLElement;
    config: any;
    priority: number;
  }> = [];
  
  /**
   * Register content for staggered reveal
   */
  registerContent(
    contentId: string,
    element: HTMLElement,
    config: {
      type: 'text' | 'image' | 'video' | 'interactive' | 'list' | 'card';
      length: number;
      hasMedia?: boolean;
      priority?: 'high' | 'medium' | 'low';
      section?: 'header' | 'body' | 'navigation' | 'footer' | 'media';
    }
  ): void {
    const priorityValue = {
      high: 1,
      medium: 2,
      low: 3,
    }[config.priority || 'medium'];
    
    this.contentQueue.push({
      id: contentId,
      element,
      config,
      priority: priorityValue,
    });
    
    // Sort by priority
    this.contentQueue.sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * Execute staggered content reveal sequence
   */
  async executeStaggeredReveal(modalId: string): Promise<void> {
    if (this.activeAnimations.has(modalId)) {
      console.warn(`Stagger animation already active for modal: ${modalId}`);
      return;
    }
    
    this.activeAnimations.add(modalId);
    
    try {
      // Group content by section
      const sectionGroups = this.groupContentBySections();
      
      // Execute section-by-section reveal
      await this.revealSectionGroups(sectionGroups, modalId);
      
    } catch (error) {
      console.error('Content stagger animation failed:', error);
    } finally {
      this.activeAnimations.delete(modalId);
    }
  }
  
  /**
   * Group content by sections for coordinated reveal
   */
  private groupContentBySections(): Map<string, any[]> {
    const groups = new Map();
    
    this.contentQueue.forEach(content => {
      const section = content.config.section || 'body';
      if (!groups.has(section)) {
        groups.set(section, []);
      }
      groups.get(section).push(content);
    });
    
    return groups;
  }
  
  /**
   * Reveal content groups in coordinated sequence
   */
  private async revealSectionGroups(
    sectionGroups: Map<string, any[]>,
    modalId: string
  ): Promise<void> {
    // Define section reveal order
    const sectionOrder = ['header', 'navigation', 'body', 'media', 'footer'];
    
    for (const sectionName of sectionOrder) {
      const sectionContent = sectionGroups.get(sectionName);
      if (!sectionContent || sectionContent.length === 0) continue;
      
      // Calculate section delay based on previous sections
      const sectionIndex = sectionOrder.indexOf(sectionName);
      const baseDelay = sectionIndex * 0.1;
      
      // Reveal section content with stagger
      await this.revealSectionContent(sectionContent, baseDelay);
    }
  }
  
  /**
   * Reveal content within a section
   */
  private async revealSectionContent(
    sectionContent: any[],
    baseDelay: number
  ): Promise<void> {
    return new Promise((resolve) => {
      let completedAnimations = 0;
      
      sectionContent.forEach((content, index) => {
        const staggerDelay = baseDelay + (index * 0.06);
        
        setTimeout(() => {
          // Trigger content reveal animation
          content.element.style.opacity = '1';
          content.element.style.transform = 'translateY(0) scale(1)';
          content.element.style.filter = 'blur(0px)';
          
          completedAnimations++;
          if (completedAnimations === sectionContent.length) {
            resolve();
          }
        }, staggerDelay * 1000);
      });
    });
  }
  
  /**
   * Clear content queue
   */
  clearContentQueue(): void {
    this.contentQueue = [];
  }
  
  /**
   * Get stagger timing for content
   */
  getStaggerTimingForContent(contentId: string): any {
    const content = this.contentQueue.find(c => c.id === contentId);
    if (!content) return null;
    
    return this.staggerController.calculateStaggerTiming(
      content.config.type,
      content.config.length,
      content.config.hasMedia
    );
  }
}

/**
 * Integration with Existing Modal Transition System
 */
export const modalStaggerIntegration = {
  /**
   * Combine modal transitions with content stagger
   */
  createIntegratedModalVariants(
    modalTransitionVariants: Variants,
    contentStaggerConfig: any
  ): Variants {
    return {
      ...modalTransitionVariants,
      visible: {
        ...modalTransitionVariants.visible,
        transition: {
          ...modalTransitionVariants.visible?.transition,
          staggerChildren: contentStaggerConfig.staggerChildren || 0.08,
          delayChildren: contentStaggerConfig.delayChildren || 0.2,
        },
      },
    };
  },
  
  /**
   * Create modal-aware stagger timing
   */
  createModalAwareStaggerTiming(
    modalAnimationDuration: number,
    contentComplexity: number
  ): Transition {
    const staggerDelay = Math.max(0.05, modalAnimationDuration * 0.3);
    const childDelay = modalAnimationDuration * 0.7;
    
    return {
      duration: timing.normal * (1 + contentComplexity * 0.15),
      ease: appleEasing.gentle,
      staggerChildren: staggerDelay,
      delayChildren: childDelay,
    };
  },
};

/**
 * Global Content Stagger Orchestrator Instance
 */
export const globalContentStaggerOrchestrator = new ModalContentStaggerOrchestrator();

/**
 * Global Dynamic Stagger Controller Instance
 */
export const globalStaggerController = new DynamicStaggerController();

/**
 * Utility Functions for Content Stagger
 */
export const contentStaggerUtils = {
  /**
   * Quick setup for common content types
   */
  quickSetup: {
    textContent: (length: number) => globalStaggerController.createDynamicStaggerVariants(
      `text-${Date.now()}`,
      { type: 'text', length, priority: 'medium' }
    ),
    
    cardGrid: (cardCount: number) => globalStaggerController.createDynamicStaggerVariants(
      `cards-${Date.now()}`,
      { type: 'card', length: cardCount * 50, priority: 'medium' }
    ),
    
    mediaContent: (hasVideo: boolean = false) => globalStaggerController.createDynamicStaggerVariants(
      `media-${Date.now()}`,
      { type: hasVideo ? 'video' : 'image', length: 100, hasMedia: true, priority: 'low' }
    ),
    
    interactiveElement: () => globalStaggerController.createDynamicStaggerVariants(
      `interactive-${Date.now()}`,
      { type: 'interactive', length: 150, priority: 'high' }
    ),
  },
  
  /**
   * Performance monitoring for stagger animations
   */
  monitorStaggerPerformance(contentId: string): void {
    const startTime = performance.now();
    
    // Monitor frame rate during stagger
    let frameCount = 0;
    const frameMonitor = () => {
      frameCount++;
      const elapsed = performance.now() - startTime;
      
      if (elapsed < 2000) { // Monitor for 2 seconds
        requestAnimationFrame(frameMonitor);
      } else {
        const fps = (frameCount / elapsed) * 1000;
        if (fps < 55) {
          console.warn(`Stagger performance below 60fps: ${fps.toFixed(1)}fps for ${contentId}`);
        }
      }
    };
    
    requestAnimationFrame(frameMonitor);
  },
};

/**
 * Export modal content stagger system
 */
export const modalContentStagger = {
  progressive: progressiveRevealVariants,
  sections: sectionStaggerVariants,
  loading: optimizedLoadingVariants,
  orchestrator: ModalContentStaggerOrchestrator,
  controller: DynamicStaggerController,
  integration: modalStaggerIntegration,
  utils: contentStaggerUtils,
  global: {
    orchestrator: globalContentStaggerOrchestrator,
    controller: globalStaggerController,
  },
} as const; 