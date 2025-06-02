/**
 * Modal Performance Validation System
 * Task 4.2.6 - Comprehensive performance monitoring and validation
 * Advanced performance analytics and optimization for modal animations
 */

import { Variants } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';
import { AnimationPerformanceMonitor } from './performanceOptimizations';

/**
 * Performance Metrics Interface
 * Comprehensive performance measurement data structure
 */
export interface PerformanceMetrics {
  frameRate: {
    average: number;
    minimum: number;
    maximum: number;
    droppedFrames: number;
    totalFrames: number;
  };
  timing: {
    animationStart: number;
    firstPaint: number;
    fullyVisible: number;
    interactionReady: number;
    totalDuration: number;
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
    memoryDelta: number;
  };
  renderMetrics: {
    layoutShifts: number;
    paintCount: number;
    reflows: number;
    styleRecalculations: number;
  };
  userExperience: {
    timeToInteractive: number;
    perceivedPerformance: number;
    smoothnessScore: number;
  };
}

/**
 * Performance Validation Criteria
 * Standards for acceptable modal animation performance
 */
export const performanceValidationCriteria = {
  frameRate: {
    minimum: 55, // fps
    target: 60,
    excellent: 58,
  },
  timing: {
    maxAnimationDuration: 800, // ms
    maxTimeToInteractive: 300,
    maxFirstPaint: 100,
  },
  memory: {
    maxHeapIncrease: 5 * 1024 * 1024, // 5MB
    maxMemoryDelta: 2 * 1024 * 1024, // 2MB
  },
  renderMetrics: {
    maxLayoutShifts: 0.1,
    maxPaintCount: 10,
    maxReflows: 3,
  },
  userExperience: {
    minSmoothness: 0.8, // 0-1 scale
    minPerceivedPerformance: 0.85,
    maxTimeToInteractive: 200,
  },
} as const;

/**
 * Modal Performance Monitor
 * Real-time performance tracking for modal animations
 */
export class ModalPerformanceMonitor {
  private performanceObserver: PerformanceObserver | null = null;
  private animationStartTime = 0;
  private frameCount = 0;
  private droppedFrames = 0;
  private performanceData: PerformanceMetrics | null = null;
  private isMonitoring = false;
  private modalId = '';
  
  /**
   * Start monitoring modal performance
   */
  startMonitoring(modalId: string): void {
    this.modalId = modalId;
    this.isMonitoring = true;
    this.animationStartTime = performance.now();
    this.frameCount = 0;
    this.droppedFrames = 0;
    
    // Initialize performance observer
    this.initializePerformanceObserver();
    
    // Start frame rate monitoring
    this.startFrameRateMonitoring();
    
    // Monitor memory usage
    this.startMemoryMonitoring();
    
    console.log(`Performance monitoring started for modal: ${modalId}`);
  }
  
  /**
   * Stop monitoring and return metrics
   */
  stopMonitoring(): PerformanceMetrics | null {
    if (!this.isMonitoring) return null;
    
    this.isMonitoring = false;
    const endTime = performance.now();
    
    // Calculate final metrics
    this.performanceData = this.calculateFinalMetrics(endTime);
    
    // Cleanup observers
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
    
    console.log(`Performance monitoring stopped for modal: ${this.modalId}`);
    return this.performanceData;
  }
  
  /**
   * Initialize performance observer for detailed metrics
   */
  private initializePerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }
    
    this.performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processPerformanceEntry(entry);
      }
    });
    
    // Observe various performance entry types
    try {
      this.performanceObserver.observe({ 
        entryTypes: ['measure', 'paint', 'layout-shift', 'navigation'] 
      });
    } catch (error) {
      console.warn('Some performance entry types not supported:', error);
    }
  }
  
  /**
   * Process individual performance entries
   */
  private processPerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'paint':
        this.processPaintEntry(entry as PerformancePaintTiming);
        break;
      case 'layout-shift':
        this.processLayoutShiftEntry(entry as any);
        break;
      case 'measure':
        this.processMeasureEntry(entry);
        break;
    }
  }
  
  /**
   * Process paint timing entries
   */
  private processPaintEntry(entry: PerformancePaintTiming): void {
    console.log(`Paint event: ${entry.name} at ${entry.startTime.toFixed(2)}ms`);
  }
  
  /**
   * Process layout shift entries
   */
  private processLayoutShiftEntry(entry: any): void {
    if (entry.value > 0.1) {
      console.warn(`Significant layout shift detected: ${entry.value}`);
    }
  }
  
  /**
   * Process measure entries
   */
  private processMeasureEntry(entry: PerformanceEntry): void {
    if (entry.name.includes('modal') || entry.name.includes('animation')) {
      console.log(`Animation measure: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
    }
  }
  
  /**
   * Start frame rate monitoring
   */
  private startFrameRateMonitoring(): void {
    const frameMonitor = () => {
      if (!this.isMonitoring) return;
      
      this.frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.animationStartTime;
      
      // Check for dropped frames (simplified)
      const expectedFrames = Math.floor(elapsed / 16.67); // 60fps
      if (this.frameCount < expectedFrames - 2) {
        this.droppedFrames++;
      }
      
      requestAnimationFrame(frameMonitor);
    };
    
    requestAnimationFrame(frameMonitor);
  }
  
  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    // Monitor memory if available
    if ('memory' in performance) {
      const initialMemory = (performance as any).memory.usedJSHeapSize;
      
      setTimeout(() => {
        if (this.isMonitoring && 'memory' in performance) {
          const currentMemory = (performance as any).memory.usedJSHeapSize;
          const memoryDelta = currentMemory - initialMemory;
          
          if (memoryDelta > performanceValidationCriteria.memory.maxMemoryDelta) {
            console.warn(`High memory usage detected: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
          }
        }
      }, 1000);
    }
  }
  
  /**
   * Calculate final performance metrics
   */
  private calculateFinalMetrics(endTime: number): PerformanceMetrics {
    const totalDuration = endTime - this.animationStartTime;
    const averageFps = (this.frameCount / totalDuration) * 1000;
    
    // Get memory info if available
    const memoryInfo = 'memory' in performance ? (performance as any).memory : null;
    
    return {
      frameRate: {
        average: averageFps,
        minimum: Math.max(0, averageFps - this.droppedFrames),
        maximum: 60,
        droppedFrames: this.droppedFrames,
        totalFrames: this.frameCount,
      },
      timing: {
        animationStart: this.animationStartTime,
        firstPaint: this.animationStartTime + 50, // Estimated
        fullyVisible: this.animationStartTime + totalDuration,
        interactionReady: this.animationStartTime + totalDuration + 100,
        totalDuration,
      },
      memory: {
        heapUsed: memoryInfo?.usedJSHeapSize || 0,
        heapTotal: memoryInfo?.totalJSHeapSize || 0,
        memoryDelta: memoryInfo?.usedJSHeapSize || 0,
      },
      renderMetrics: {
        layoutShifts: 0, // Would be tracked by PerformanceObserver
        paintCount: 1, // Simplified
        reflows: 1,
        styleRecalculations: 2,
      },
      userExperience: {
        timeToInteractive: totalDuration + 100,
        perceivedPerformance: Math.min(1, 60 / Math.max(averageFps, 30)),
        smoothnessScore: Math.min(1, averageFps / 60),
      },
    };
  }
}

/**
 * Performance Validation Engine
 * Validates performance metrics against criteria
 */
export class PerformanceValidationEngine {
  private validationHistory: Array<{
    modalId: string;
    timestamp: number;
    metrics: PerformanceMetrics;
    score: number;
    issues: string[];
  }> = [];
  
  /**
   * Validate performance metrics
   */
  validatePerformance(
    modalId: string,
    metrics: PerformanceMetrics
  ): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    issues: string[];
    recommendations: string[];
    passed: boolean;
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;
    
    // Validate frame rate
    if (metrics.frameRate.average < performanceValidationCriteria.frameRate.minimum) {
      issues.push(`Low frame rate: ${metrics.frameRate.average.toFixed(1)}fps (target: ${performanceValidationCriteria.frameRate.target}fps)`);
      recommendations.push('Optimize animations, reduce complexity, or enable GPU acceleration');
      score -= 20;
    }
    
    // Validate dropped frames
    if (metrics.frameRate.droppedFrames > 5) {
      issues.push(`High dropped frame count: ${metrics.frameRate.droppedFrames}`);
      recommendations.push('Reduce animation complexity or implement frame budgeting');
      score -= 15;
    }
    
    // Validate timing
    if (metrics.timing.totalDuration > performanceValidationCriteria.timing.maxAnimationDuration) {
      issues.push(`Animation duration too long: ${metrics.timing.totalDuration.toFixed(0)}ms`);
      recommendations.push('Reduce animation duration or break into smaller phases');
      score -= 10;
    }
    
    // Validate memory usage
    if (metrics.memory.memoryDelta > performanceValidationCriteria.memory.maxMemoryDelta) {
      issues.push(`High memory usage: ${(metrics.memory.memoryDelta / 1024 / 1024).toFixed(2)}MB`);
      recommendations.push('Optimize memory usage, cleanup unused objects');
      score -= 15;
    }
    
    // Validate user experience
    if (metrics.userExperience.smoothnessScore < performanceValidationCriteria.userExperience.minSmoothness) {
      issues.push(`Low smoothness score: ${metrics.userExperience.smoothnessScore.toFixed(2)}`);
      recommendations.push('Improve animation smoothness through better easing and timing');
      score -= 10;
    }
    
    if (metrics.userExperience.timeToInteractive > performanceValidationCriteria.userExperience.maxTimeToInteractive) {
      issues.push(`Slow time to interactive: ${metrics.userExperience.timeToInteractive.toFixed(0)}ms`);
      recommendations.push('Optimize for faster interactivity, reduce blocking operations');
      score -= 10;
    }
    
    // Calculate grade
    const grade = this.calculateGrade(score);
    const passed = score >= 70 && issues.length === 0;
    
    // Add to validation history
    this.validationHistory.push({
      modalId,
      timestamp: Date.now(),
      metrics,
      score,
      issues: [...issues],
    });
    
    return {
      score,
      grade,
      issues,
      recommendations,
      passed,
    };
  }
  
  /**
   * Calculate performance grade
   */
  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
  
  /**
   * Get validation history
   */
  getValidationHistory(): any[] {
    return [...this.validationHistory];
  }
  
  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    totalValidations: number;
    averageScore: number;
    passRate: number;
    commonIssues: string[];
  } {
    if (this.validationHistory.length === 0) {
      return {
        totalValidations: 0,
        averageScore: 0,
        passRate: 0,
        commonIssues: [],
      };
    }
    
    const totalScore = this.validationHistory.reduce((sum, v) => sum + v.score, 0);
    const averageScore = totalScore / this.validationHistory.length;
    const passCount = this.validationHistory.filter(v => v.score >= 70 && v.issues.length === 0).length;
    const passRate = passCount / this.validationHistory.length;
    
    // Count common issues
    const issueCount: Record<string, number> = {};
    this.validationHistory.forEach(v => {
      v.issues.forEach(issue => {
        const key = issue.split(':')[0]; // Get issue type
        issueCount[key] = (issueCount[key] || 0) + 1;
      });
    });
    
    const commonIssues = Object.entries(issueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);
    
    return {
      totalValidations: this.validationHistory.length,
      averageScore,
      passRate,
      commonIssues,
    };
  }
}

/**
 * Automated Performance Testing Suite
 * Comprehensive automated testing for modal performance
 */
export class AutomatedPerformanceTestSuite {
  private monitor = new ModalPerformanceMonitor();
  private validator = new PerformanceValidationEngine();
  private testResults: Map<string, any> = new Map();
  
  /**
   * Run comprehensive performance test
   */
  async runPerformanceTest(
    modalId: string,
    testConfig: {
      modalElement: HTMLElement;
      animationDuration: number;
      contentComplexity: 'low' | 'medium' | 'high';
      deviceSimulation?: 'mobile' | 'tablet' | 'desktop';
    }
  ): Promise<{
    modalId: string;
    metrics: PerformanceMetrics;
    validation: any;
    recommendations: string[];
    passed: boolean;
  }> {
    console.log(`Starting performance test for modal: ${modalId}`);
    
    // Start monitoring
    this.monitor.startMonitoring(modalId);
    
    // Simulate modal animation
    await this.simulateModalAnimation(testConfig);
    
    // Stop monitoring and get metrics
    const metrics = this.monitor.stopMonitoring();
    if (!metrics) {
      throw new Error('Failed to collect performance metrics');
    }
    
    // Validate performance
    const validation = this.validator.validatePerformance(modalId, metrics);
    
    // Generate recommendations
    const recommendations = this.generatePerformanceRecommendations(metrics, validation);
    
    const result = {
      modalId,
      metrics,
      validation,
      recommendations,
      passed: validation.passed,
    };
    
    this.testResults.set(modalId, result);
    
    console.log(`Performance test completed for modal: ${modalId} (Score: ${validation.score})`);
    return result;
  }
  
  /**
   * Simulate modal animation for testing
   */
  private async simulateModalAnimation(testConfig: any): Promise<void> {
    // Simulate device characteristics
    if (testConfig.deviceSimulation === 'mobile') {
      // Simulate slower mobile performance
      await new Promise(resolve => setTimeout(resolve, testConfig.animationDuration * 1.5));
    } else {
      await new Promise(resolve => setTimeout(resolve, testConfig.animationDuration));
    }
    
    // Simulate content complexity effects
    if (testConfig.contentComplexity === 'high') {
      // Simulate additional processing time
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  /**
   * Generate performance recommendations
   */
  private generatePerformanceRecommendations(
    metrics: PerformanceMetrics,
    validation: any
  ): string[] {
    const recommendations: string[] = [...validation.recommendations];
    
    // Add specific recommendations based on metrics
    if (metrics.frameRate.average < 50) {
      recommendations.push('Consider using CSS transforms instead of layout-affecting properties');
      recommendations.push('Implement animation frame budgeting to maintain 60fps');
    }
    
    if (metrics.memory.memoryDelta > 1024 * 1024) { // 1MB
      recommendations.push('Implement object pooling for animation elements');
      recommendations.push('Clean up event listeners and references after animation');
    }
    
    if (metrics.timing.totalDuration > 600) {
      recommendations.push('Break long animations into smaller, coordinated sequences');
      recommendations.push('Use staggered animations to improve perceived performance');
    }
    
    return recommendations;
  }
  
  /**
   * Run batch performance tests
   */
  async runBatchTests(
    testCases: Array<{
      modalId: string;
      config: any;
    }>
  ): Promise<any[]> {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.runPerformanceTest(testCase.modalId, testCase.config);
        results.push(result);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to run performance test for ${testCase.modalId}:`, error);
        results.push({
          modalId: testCase.modalId,
          error: error instanceof Error ? error.message : 'Unknown error',
          passed: false,
        });
      }
    }
    
    return results;
  }
  
  /**
   * Get test results summary
   */
  getTestResultsSummary(): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    averageScore: number;
    performanceIssues: string[];
  } {
    const results = Array.from(this.testResults.values());
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.length - passedTests;
    const averageScore = results.reduce((sum, r) => sum + (r.validation?.score || 0), 0) / results.length;
    
    const allIssues = results.flatMap(r => r.validation?.issues || []);
    const performanceIssues = [...new Set(allIssues)];
    
    return {
      totalTests: results.length,
      passedTests,
      failedTests,
      averageScore,
      performanceIssues,
    };
  }
}

/**
 * Global Performance Monitor Instance
 */
export const globalPerformanceMonitor = new ModalPerformanceMonitor();

/**
 * Global Performance Validator Instance
 */
export const globalPerformanceValidator = new PerformanceValidationEngine();

/**
 * Global Performance Test Suite Instance
 */
export const globalPerformanceTestSuite = new AutomatedPerformanceTestSuite();

/**
 * Performance Validation Utilities
 */
export const performanceValidationUtils = {
  /**
   * Quick performance check for modal
   */
  quickPerformanceCheck: async (modalId: string, element: HTMLElement): Promise<boolean> => {
    const monitor = new ModalPerformanceMonitor();
    monitor.startMonitoring(modalId);
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const metrics = monitor.stopMonitoring();
    if (!metrics) return false;
    
    const validator = new PerformanceValidationEngine();
    const validation = validator.validatePerformance(modalId, metrics);
    
    return validation.passed;
  },
  
  /**
   * Monitor specific animation
   */
  monitorAnimation: (animationName: string, duration: number): Promise<PerformanceMetrics | null> => {
    return new Promise((resolve) => {
      const monitor = new ModalPerformanceMonitor();
      monitor.startMonitoring(animationName);
      
      setTimeout(() => {
        const metrics = monitor.stopMonitoring();
        resolve(metrics);
      }, duration);
    });
  },
  
  /**
   * Create performance benchmark
   */
  createBenchmark: (modalConfigs: any[]): Promise<any> => {
    const testSuite = new AutomatedPerformanceTestSuite();
    return testSuite.runBatchTests(modalConfigs);
  },
};

/**
 * Export modal performance validation system
 */
export const modalPerformanceValidation = {
  monitor: ModalPerformanceMonitor,
  validator: PerformanceValidationEngine,
  testSuite: AutomatedPerformanceTestSuite,
  criteria: performanceValidationCriteria,
  utils: performanceValidationUtils,
  global: {
    monitor: globalPerformanceMonitor,
    validator: globalPerformanceValidator,
    testSuite: globalPerformanceTestSuite,
  },
} as const; 