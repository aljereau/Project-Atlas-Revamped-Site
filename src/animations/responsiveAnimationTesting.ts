/**
 * Cross-Device Animation Testing System
 * Task 4.1.6 - Test panel animations across different screen sizes and device types
 * Comprehensive testing framework for animation responsiveness and performance
 */

import { Variants } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';
import { devicePerformance, AnimationPerformanceMonitor } from './performanceOptimizations';

/**
 * Screen Size Breakpoints for Animation Testing
 */
export const screenBreakpoints = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  laptop: { min: 1024, max: 1439 },
  desktop: { min: 1440, max: 1919 },
  ultrawide: { min: 1920, max: Infinity },
} as const;

/**
 * Device Type Detection for Animation Optimization
 */
export class DeviceAnimationTester {
  private currentBreakpoint: keyof typeof screenBreakpoints = 'desktop';
  private performanceMetrics: Map<string, any> = new Map();
  
  /**
   * Get current screen breakpoint
   */
  getCurrentBreakpoint(): keyof typeof screenBreakpoints {
    const width = window.innerWidth;
    
    for (const [breakpoint, range] of Object.entries(screenBreakpoints)) {
      if (width >= range.min && width <= range.max) {
        this.currentBreakpoint = breakpoint as keyof typeof screenBreakpoints;
        return this.currentBreakpoint;
      }
    }
    
    return 'desktop';
  }
  
  /**
   * Test animation performance on current device
   */
  async testAnimationPerformance(animationName: string): Promise<{
    fps: number;
    avgFrameTime: number;
    dropped: number;
    breakpoint: string;
    deviceType: string;
  }> {
    const monitor = new AnimationPerformanceMonitor();
    const breakpoint = this.getCurrentBreakpoint();
    const deviceType = devicePerformance.isMobile() ? 'mobile' : 'desktop';
    
    // Start monitoring
    monitor.startMonitoring();
    
    // Simulate animation for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Stop monitoring and get results
    const metrics = monitor.stopMonitoring();
    
    const result = {
      ...metrics,
      breakpoint,
      deviceType,
    };
    
    this.performanceMetrics.set(animationName, result);
    return result;
  }
  
  /**
   * Get comprehensive device capabilities
   */
  getDeviceCapabilities(): {
    screen: { width: number; height: number; ratio: number };
    performance: 'high' | 'medium' | 'low';
    connection: string;
    features: string[];
  } {
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio || 1,
    };
    
    const performance = devicePerformance.getAnimationComplexity();
    
    const connection = (navigator as any).connection?.effectiveType || 'unknown';
    
    const features = [];
    if ('PerformanceObserver' in window) features.push('performance-observer');
    if ('IntersectionObserver' in window) features.push('intersection-observer');
    if ('ResizeObserver' in window) features.push('resize-observer');
    if (CSS.supports('backdrop-filter', 'blur(10px)')) features.push('backdrop-filter');
    if (CSS.supports('will-change', 'transform')) features.push('will-change');
    
    return { screen, performance, connection, features };
  }
}

/**
 * Responsive Animation Variants for Different Screen Sizes
 */
export const responsiveAnimationVariants = {
  // Mobile-optimized animations (0-767px)
  mobile: {
    panel: {
      initial: { opacity: 0, y: 10, scale: 0.98 },
      visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.25, ease: appleEasing.primary }
      },
      exit: { opacity: 0, y: -5, scale: 0.99 }
    },
    modal: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { duration: 0.3, ease: appleEasing.gentle, staggerChildren: 0.05 }
      },
      exit: { opacity: 0, scale: 0.98, y: -10 }
    },
  } as { panel: Variants; modal: Variants },
  
  // Tablet-optimized animations (768-1023px)
  tablet: {
    panel: {
      initial: { opacity: 0, y: 15, scale: 0.96 },
      visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.35, ease: appleEasing.primary }
      },
      exit: { opacity: 0, y: -8, scale: 0.98 }
    },
    modal: {
      initial: { opacity: 0, scale: 0.94, y: 30 },
      visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { duration: 0.4, ease: appleEasing.gentle, staggerChildren: 0.08 }
      },
      exit: { opacity: 0, scale: 0.97, y: -15 }
    },
  } as { panel: Variants; modal: Variants },
  
  // Desktop-optimized animations (1024px+)
  desktop: {
    panel: {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.5, ease: appleEasing.primary }
      },
      exit: { opacity: 0, y: -10, scale: 0.98 }
    },
    modal: {
      initial: { opacity: 0, scale: 0.92, y: 40 },
      visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { duration: 0.6, ease: appleEasing.gentle, staggerChildren: 0.1 }
      },
      exit: { opacity: 0, scale: 0.96, y: -20 }
    },
  } as { panel: Variants; modal: Variants },
} as const;

/**
 * Animation Test Suite for Cross-Device Validation
 */
export class AnimationTestSuite {
  private tester = new DeviceAnimationTester();
  private testResults: Map<string, any> = new Map();
  
  /**
   * Run comprehensive animation tests
   */
  async runFullTestSuite(): Promise<{
    device: any;
    performance: Map<string, any>;
    compatibility: any;
    recommendations: string[];
  }> {
    console.log('🚀 Starting comprehensive animation test suite...');
    
    // Get device information
    const device = this.tester.getDeviceCapabilities();
    console.log('📱 Device capabilities:', device);
    
    // Test performance for each animation type
    const animationTypes = ['panel-expansion', 'modal-transition', 'card-transform', 'backdrop-blur'];
    const performance = new Map();
    
    for (const animationType of animationTypes) {
      console.log(`🧪 Testing ${animationType}...`);
      const result = await this.tester.testAnimationPerformance(animationType);
      performance.set(animationType, result);
      
      if (result.fps < 55) {
        console.warn(`⚠️ ${animationType} performance below 60fps: ${result.fps.toFixed(1)}fps`);
      } else {
        console.log(`✅ ${animationType} performance: ${result.fps.toFixed(1)}fps`);
      }
    }
    
    // Test compatibility
    const compatibility = await this.testFeatureCompatibility();
    
    // Generate recommendations
    const recommendations = this.generateOptimizationRecommendations(device, performance);
    
    const results = { device, performance, compatibility, recommendations };
    this.testResults.set('full-suite', results);
    
    console.log('✨ Animation test suite completed!');
    return results;
  }
  
  /**
   * Test feature compatibility across devices
   */
  private async testFeatureCompatibility(): Promise<{
    backdropFilter: boolean;
    transform3d: boolean;
    willChange: boolean;
    reducedMotion: boolean;
    intersectionObserver: boolean;
  }> {
    return {
      backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
      transform3d: CSS.supports('transform', 'translate3d(0, 0, 0)'),
      willChange: CSS.supports('will-change', 'transform'),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      intersectionObserver: 'IntersectionObserver' in window,
    };
  }
  
  /**
   * Generate optimization recommendations based on test results
   */
  private generateOptimizationRecommendations(
    device: any,
    performance: Map<string, any>
  ): string[] {
    const recommendations: string[] = [];
    
    // Performance-based recommendations
    const avgFps = Array.from(performance.values()).reduce((sum, p) => sum + p.fps, 0) / performance.size;
    
    if (avgFps < 50) {
      recommendations.push('Use mobile-optimized animation variants');
      recommendations.push('Reduce animation complexity and duration');
      recommendations.push('Disable backdrop blur on low-end devices');
    } else if (avgFps < 55) {
      recommendations.push('Use medium complexity animations');
      recommendations.push('Monitor performance during concurrent animations');
    }
    
    // Device-specific recommendations
    if (device.screen.width < 768) {
      recommendations.push('Use touch-optimized animations with larger interaction areas');
      recommendations.push('Reduce stagger delays for faster perceived performance');
    }
    
    if (device.performance === 'low') {
      recommendations.push('Implement progressive enhancement for animations');
      recommendations.push('Use will-change property judiciously');
    }
    
    if (device.connection === 'slow-2g' || device.connection === '2g') {
      recommendations.push('Preload critical animation assets');
      recommendations.push('Use minimal animations for slow connections');
    }
    
    return recommendations;
  }
  
  /**
   * Test specific breakpoint animations
   */
  async testBreakpointAnimations(): Promise<Map<string, any>> {
    const results = new Map();
    const breakpoint = this.tester.getCurrentBreakpoint();
    
    console.log(`🔍 Testing animations for ${breakpoint} breakpoint...`);
    
    // Test panel animations
    const panelResult = await this.tester.testAnimationPerformance(`panel-${breakpoint}`);
    results.set('panel', panelResult);
    
    // Test modal animations
    const modalResult = await this.tester.testAnimationPerformance(`modal-${breakpoint}`);
    results.set('modal', modalResult);
    
    return results;
  }
}

/**
 * Responsive Animation Hooks and Utilities
 */
export function getResponsiveAnimationVariants(): {
  panel: Variants;
  modal: Variants;
} {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  if (width < 768) {
    return responsiveAnimationVariants.mobile;
  } else if (width < 1024) {
    return responsiveAnimationVariants.tablet;
  } else {
    return responsiveAnimationVariants.desktop;
  }
}

/**
 * Animation Testing Utilities
 */
export const animationTestUtils = {
  /**
   * Create test environment for animations
   */
  createTestEnvironment(): HTMLElement {
    const testContainer = document.createElement('div');
    testContainer.id = 'animation-test-container';
    testContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
    `;
    document.body.appendChild(testContainer);
    return testContainer;
  },
  
  /**
   * Clean up test environment
   */
  cleanupTestEnvironment(): void {
    const testContainer = document.getElementById('animation-test-container');
    if (testContainer) {
      testContainer.remove();
    }
  },
  
  /**
   * Measure animation frame rate
   */
  measureFrameRate(duration = 1000): Promise<number> {
    return new Promise((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();
      
      function countFrame() {
        frameCount++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed < duration) {
          requestAnimationFrame(countFrame);
        } else {
          const fps = (frameCount / elapsed) * 1000;
          resolve(fps);
        }
      }
      
      requestAnimationFrame(countFrame);
    });
  },
};

/**
 * Global test suite instance
 */
export const globalAnimationTestSuite = new AnimationTestSuite();

/**
 * Export testing configurations
 */
export const animationTesting = {
  tester: DeviceAnimationTester,
  testSuite: AnimationTestSuite,
  variants: responsiveAnimationVariants,
  utils: animationTestUtils,
  global: globalAnimationTestSuite,
} as const; 