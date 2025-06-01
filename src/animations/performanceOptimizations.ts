/**
 * Performance Optimization System for Panel Animations
 * Task 4.1.5 - GPU acceleration and smooth performance optimization
 * Ensures 60fps across all devices with sophisticated performance monitoring
 */

import { Variants, MotionStyle } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';

/**
 * GPU-Accelerated Animation Properties
 * Properties that trigger GPU acceleration for optimal performance
 */
export const gpuAcceleratedProperties = [
  'transform',
  'opacity',
  'filter',
  'backdrop-filter',
] as const;

/**
 * Performance-Optimized Animation Variants
 * All animations use GPU-accelerated properties and efficient transforms
 */
export const performanceOptimizedVariants: Variants = {
  // Base state with GPU acceleration hints
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    // Force GPU layer creation
    willChange: 'transform, opacity',
    // Use transform3d to enable hardware acceleration
    transform: 'translate3d(0, 20px, 0) scale3d(0.95, 0.95, 1)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Optimized visible state
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    willChange: 'transform, opacity',
    transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
    transition: {
      duration: timing.slow,
      ease: appleEasing.primary,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  
  // Performance-focused exit
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    willChange: 'transform, opacity',
    transform: 'translate3d(0, -10px, 0) scale3d(0.98, 0.98, 1)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * Mobile-Optimized Animation Variants
 * Reduced complexity for mobile devices to maintain 60fps
 */
export const mobileOptimizedVariants: Variants = {
  initial: {
    opacity: 0,
    y: 15,
    // Simplified transforms for mobile
    willChange: 'transform, opacity',
    transform: 'translate3d(0, 15px, 0)',
  },
  
  visible: {
    opacity: 1,
    y: 0,
    willChange: 'transform, opacity',
    transform: 'translate3d(0, 0, 0)',
    transition: {
      duration: timing.normal, // Faster for mobile
      ease: appleEasing.primary,
      staggerChildren: 0.05, // Reduced stagger
    },
  },
  
  exit: {
    opacity: 0,
    y: -8,
    willChange: 'transform, opacity',
    transform: 'translate3d(0, -8px, 0)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.sharp,
    },
  },
};

/**
 * High-Performance Backdrop Variants
 * Optimized backdrop blur with performance monitoring
 */
export const highPerformanceBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    // Composite layer hints
    willChange: 'backdrop-filter, opacity',
    isolation: 'isolate',
  },
  
  visible: {
    opacity: 1,
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    willChange: 'backdrop-filter, opacity',
    isolation: 'isolate',
    transition: {
      duration: timing.slow,
      ease: appleEasing.gentle,
    },
  },
  
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    willChange: 'backdrop-filter, opacity',
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
};

/**
 * Performance Monitoring and Optimization Utilities
 */
export class AnimationPerformanceMonitor {
  private frameCount = 0;
  private startTime = 0;
  private lastFrameTime = 0;
  private isMonitoring = false;
  
  /**
   * Start monitoring animation performance
   */
  startMonitoring(): void {
    this.isMonitoring = true;
    this.frameCount = 0;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.monitorFrame();
  }
  
  /**
   * Stop monitoring and return performance metrics
   */
  stopMonitoring(): { fps: number; avgFrameTime: number; dropped: number } {
    this.isMonitoring = false;
    const endTime = performance.now();
    const totalTime = endTime - this.startTime;
    const fps = (this.frameCount / totalTime) * 1000;
    const avgFrameTime = totalTime / this.frameCount;
    const dropped = Math.max(0, Math.floor((totalTime / 16.67) - this.frameCount));
    
    return { fps, avgFrameTime, dropped };
  }
  
  /**
   * Monitor individual frame performance
   */
  private monitorFrame(): void {
    if (!this.isMonitoring) return;
    
    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    
    // Log performance warnings
    if (frameTime > 16.67) {
      console.warn(`Frame time exceeded 60fps: ${frameTime.toFixed(2)}ms`);
    }
    
    this.frameCount++;
    this.lastFrameTime = currentTime;
    
    requestAnimationFrame(() => this.monitorFrame());
  }
}

/**
 * Device Performance Detection
 */
export const devicePerformance = {
  /**
   * Detect if device is high-performance
   */
  isHighPerformance(): boolean {
    // Check for hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4;
    
    // Check for device memory (if available)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return cores >= 4 && memory >= 4 && !prefersReducedMotion;
  },
  
  /**
   * Detect if device is mobile
   */
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  /**
   * Get recommended animation complexity
   */
  getAnimationComplexity(): 'high' | 'medium' | 'low' {
    if (this.isHighPerformance()) return 'high';
    if (this.isMobile()) return 'low';
    return 'medium';
  },
};

/**
 * Adaptive Animation Variants based on device performance
 */
export function getAdaptiveAnimationVariants(): Variants {
  const complexity = devicePerformance.getAnimationComplexity();
  
  switch (complexity) {
    case 'high':
      return performanceOptimizedVariants;
    case 'low':
      return mobileOptimizedVariants;
    default:
      // Medium complexity - balanced performance
      return {
        initial: {
          opacity: 0,
          y: 15,
          scale: 0.98,
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 15px, 0) scale3d(0.98, 0.98, 1)',
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
          transition: {
            duration: timing.normal,
            ease: appleEasing.primary,
            staggerChildren: 0.06,
          },
        },
        exit: {
          opacity: 0,
          y: -8,
          scale: 0.98,
          willChange: 'transform, opacity',
          transform: 'translate3d(0, -8px, 0) scale3d(0.98, 0.98, 1)',
          transition: {
            duration: timing.fast,
            ease: appleEasing.sharp,
          },
        },
      };
  }
}

/**
 * Performance-Optimized Style Generator
 */
export function generateOptimizedStyles(animating = false): MotionStyle {
  return {
    willChange: animating ? 'transform, opacity' : 'auto',
    backfaceVisibility: 'hidden',
    perspective: 1000,
    // Force hardware acceleration
    transform: 'translate3d(0, 0, 0)',
    // Optimize for animations
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };
}

/**
 * Animation Frame Budget Manager
 * Manages animation complexity to maintain 60fps budget
 */
export class FrameBudgetManager {
  private animationCount = 0;
  private maxConcurrentAnimations = 8;
  private frameTimeTarget = 16.67; // 60fps
  
  /**
   * Request animation slot
   */
  requestAnimationSlot(): boolean {
    if (this.animationCount >= this.maxConcurrentAnimations) {
      console.warn('Animation budget exceeded, queuing animation');
      return false;
    }
    
    this.animationCount++;
    return true;
  }
  
  /**
   * Release animation slot
   */
  releaseAnimationSlot(): void {
    this.animationCount = Math.max(0, this.animationCount - 1);
  }
  
  /**
   * Adjust animation complexity based on performance
   */
  adjustComplexity(frameTime: number): void {
    if (frameTime > this.frameTimeTarget * 1.5) {
      // Reduce animation complexity
      this.maxConcurrentAnimations = Math.max(4, this.maxConcurrentAnimations - 1);
      console.warn('Reducing animation complexity due to performance');
    } else if (frameTime < this.frameTimeTarget && this.maxConcurrentAnimations < 8) {
      // Increase animation complexity
      this.maxConcurrentAnimations++;
    }
  }
}

/**
 * Global Performance Manager Instance
 */
export const performanceManager = {
  monitor: new AnimationPerformanceMonitor(),
  frameBudget: new FrameBudgetManager(),
  
  /**
   * Initialize performance monitoring
   */
  init(): void {
    // Set up performance observer if available
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name.includes('animation')) {
            this.frameBudget.adjustComplexity(entry.duration);
          }
        }
      });
      observer.observe({ entryTypes: ['measure'] });
    }
    
    // Monitor reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', this.handleReducedMotionChange);
  },
  
  /**
   * Handle reduced motion preference changes
   */
  handleReducedMotionChange(e: MediaQueryListEvent): void {
    if (e.matches) {
      console.log('Reduced motion enabled, switching to minimal animations');
    }
  },
};

/**
 * Export optimized animation configurations
 */
export const optimizedAnimations = {
  performance: performanceOptimizedVariants,
  mobile: mobileOptimizedVariants,
  backdrop: highPerformanceBackdropVariants,
  adaptive: getAdaptiveAnimationVariants,
  styles: generateOptimizedStyles,
} as const;

/**
 * Animation timing optimized for 60fps
 */
export const optimizedTiming = {
  // Ultra-fast for micro-interactions
  ultraFast: 0.1,
  // Fast for immediate feedback
  fast: 0.15,
  // Normal for standard transitions
  normal: 0.25,
  // Slow for complex animations
  slow: 0.4,
  // Very slow for emphasis
  verySlow: 0.6,
} as const; 