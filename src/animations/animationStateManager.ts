/**
 * Animation State Manager
 * Task 4.3.5 - Centralized animation state management with performance optimization
 * Comprehensive state coordination across all animation systems
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { animations, appleEasing, timing } from './modalAnimations';
import { modalContentStagger, globalContentStaggerOrchestrator } from './modalContentStagger';
import { microInteractionSystem, globalMicroInteractionManager } from './microInteractionSystem';
import { touchResponseSystem, TouchResponseManager } from './touchResponseSystem';
import { advancedGestureRecognition, globalAdvancedGestureManager } from './advancedGestureRecognition';
import { modalPerformanceValidation, globalPerformanceMonitor } from './modalPerformanceValidation';

/**
 * Animation State Configuration
 */
export interface AnimationStateConfig {
  componentId: string;
  persistState?: boolean;
  enablePerformanceOptimization?: boolean;
  enableGlobalCoordination?: boolean;
  animationProfile?: 'smooth' | 'dramatic' | 'subtle' | 'performance' | 'accessibility';
  priority?: 'high' | 'medium' | 'low';
  memoryManagement?: {
    maxCacheSize: number;
    cleanupInterval: number;
    enableGarbageCollection: boolean;
  };
}

/**
 * Component Animation State
 */
export interface ComponentAnimationState {
  id: string;
  isActive: boolean;
  animationProfile: string;
  lastActive: number;
  performanceMetrics?: any;
  interactions: {
    gestures: number;
    microInteractions: number;
    staggerAnimations: number;
  };
  resourceUsage: {
    memoryUsage: number;
    cpuUsage: number;
    frameRate: number;
  };
}

/**
 * Global Animation State
 */
export interface GlobalAnimationState {
  totalActiveComponents: number;
  globalPerformance: {
    frameRate: number;
    memoryUsage: number;
    activeBudget: number;
  };
  systemLoad: 'low' | 'medium' | 'high' | 'critical';
  adaptiveMode: boolean;
  emergencyMode: boolean;
}

/**
 * Animation State Manager Class
 * Centralized coordination and optimization
 */
export class AnimationStateManager {
  private componentStates = new Map<string, ComponentAnimationState>();
  private globalState: GlobalAnimationState;
  private stateCache = new Map<string, any>();
  private performanceHistory: number[] = [];
  private adaptiveThresholds = {
    frameRate: { good: 55, poor: 45, critical: 30 },
    memory: { good: 50, poor: 75, critical: 90 },
    load: { low: 0.3, medium: 0.6, high: 0.8 },
  };
  
  private cleanupInterval: number | null = null;
  private monitoringInterval: number | null = null;
  
  constructor() {
    this.globalState = {
      totalActiveComponents: 0,
      globalPerformance: {
        frameRate: 60,
        memoryUsage: 0,
        activeBudget: 100,
      },
      systemLoad: 'low',
      adaptiveMode: true,
      emergencyMode: false,
    };
    
    this.initializeSystemMonitoring();
  }
  
  /**
   * Initialize component animation state
   */
  async initializeComponent(config: AnimationStateConfig): Promise<ComponentAnimationState> {
    const componentState: ComponentAnimationState = {
      id: config.componentId,
      isActive: true,
      animationProfile: config.animationProfile || 'smooth',
      lastActive: Date.now(),
      interactions: {
        gestures: 0,
        microInteractions: 0,
        staggerAnimations: 0,
      },
      resourceUsage: {
        memoryUsage: 0,
        cpuUsage: 0,
        frameRate: 60,
      },
    };
    
    // Store component state
    this.componentStates.set(config.componentId, componentState);
    this.updateGlobalState();
    
    // Initialize performance monitoring if enabled
    if (config.enablePerformanceOptimization) {
      await this.initializePerformanceMonitoring(config.componentId);
    }
    
    // Load persisted state if enabled
    if (config.persistState) {
      await this.loadPersistedState(config.componentId);
    }
    
    // Initialize memory management
    if (config.memoryManagement) {
      this.setupMemoryManagement(config);
    }
    
    console.log(`Animation state initialized for component: ${config.componentId}`);
    return componentState;
  }
  
  /**
   * Update component animation state
   */
  updateComponentState(
    componentId: string, 
    updates: Partial<ComponentAnimationState>
  ): ComponentAnimationState | null {
    const currentState = this.componentStates.get(componentId);
    if (!currentState) return null;
    
    const updatedState = {
      ...currentState,
      ...updates,
      lastActive: Date.now(),
    };
    
    this.componentStates.set(componentId, updatedState);
    this.updateGlobalState();
    
    // Trigger adaptive optimizations if needed
    this.checkAdaptiveOptimizations(componentId, updatedState);
    
    return updatedState;
  }
  
  /**
   * Get component animation state
   */
  getComponentState(componentId: string): ComponentAnimationState | null {
    return this.componentStates.get(componentId) || null;
  }
  
  /**
   * Get global animation state
   */
  getGlobalState(): GlobalAnimationState {
    return { ...this.globalState };
  }
  
  /**
   * Deactivate component animation state
   */
  deactivateComponent(componentId: string): boolean {
    const componentState = this.componentStates.get(componentId);
    if (!componentState) return false;
    
    componentState.isActive = false;
    componentState.lastActive = Date.now();
    
    this.updateGlobalState();
    
    // Persist state if needed
    this.persistComponentState(componentId, componentState);
    
    console.log(`Animation state deactivated for component: ${componentId}`);
    return true;
  }
  
  /**
   * Clean up component animation state
   */
  cleanupComponent(componentId: string): boolean {
    const removed = this.componentStates.delete(componentId);
    
    if (removed) {
      this.updateGlobalState();
      this.stateCache.delete(componentId);
      console.log(`Animation state cleaned up for component: ${componentId}`);
    }
    
    return removed;
  }
  
  /**
   * Initialize system-wide performance monitoring
   */
  private initializeSystemMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.updateGlobalPerformanceMetrics();
      this.checkSystemHealth();
      this.performAdaptiveOptimizations();
    }, 1000);
  }
  
  /**
   * Initialize performance monitoring for component
   */
  private async initializePerformanceMonitoring(componentId: string): Promise<void> {
    try {
      globalPerformanceMonitor.startMonitoring(componentId);
      
      // Monitor component performance for 3 seconds
      setTimeout(async () => {
        const metrics = globalPerformanceMonitor.stopMonitoring();
        
        if (metrics) {
          this.updateComponentState(componentId, {
            performanceMetrics: metrics,
            resourceUsage: {
              memoryUsage: metrics.memory?.heapUsed || 0,
              cpuUsage: 0, // Would need additional monitoring
              frameRate: metrics.frameRate?.average || 60,
            },
          });
        }
      }, 3000);
      
    } catch (error) {
      console.warn(`Failed to initialize performance monitoring for ${componentId}:`, error);
    }
  }
  
  /**
   * Update global state based on component states
   */
  private updateGlobalState(): void {
    const activeComponents = Array.from(this.componentStates.values()).filter(state => state.isActive);
    
    this.globalState.totalActiveComponents = activeComponents.length;
    
    // Calculate average performance metrics
    const avgFrameRate = this.calculateAverageFrameRate(activeComponents);
    const totalMemoryUsage = this.calculateTotalMemoryUsage(activeComponents);
    
    this.globalState.globalPerformance.frameRate = avgFrameRate;
    this.globalState.globalPerformance.memoryUsage = totalMemoryUsage;
    
    // Update system load
    this.updateSystemLoad();
    
    // Update performance history
    this.performanceHistory.push(avgFrameRate);
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
  }
  
  /**
   * Calculate average frame rate across active components
   */
  private calculateAverageFrameRate(activeComponents: ComponentAnimationState[]): number {
    if (activeComponents.length === 0) return 60;
    
    const frameRates = activeComponents
      .map(state => state.resourceUsage.frameRate)
      .filter(rate => rate > 0);
    
    if (frameRates.length === 0) return 60;
    
    return frameRates.reduce((sum, rate) => sum + rate, 0) / frameRates.length;
  }
  
  /**
   * Calculate total memory usage
   */
  private calculateTotalMemoryUsage(activeComponents: ComponentAnimationState[]): number {
    return activeComponents.reduce((total, state) => total + state.resourceUsage.memoryUsage, 0);
  }
  
  /**
   * Update system load classification
   */
  private updateSystemLoad(): void {
    const { frameRate, memoryUsage } = this.globalState.globalPerformance;
    const componentLoad = this.globalState.totalActiveComponents / 20; // Normalize to 20 max components
    
    const frameRateScore = frameRate < this.adaptiveThresholds.frameRate.critical ? 1 :
                          frameRate < this.adaptiveThresholds.frameRate.poor ? 0.7 :
                          frameRate < this.adaptiveThresholds.frameRate.good ? 0.4 : 0;
    
    const memoryScore = memoryUsage > this.adaptiveThresholds.memory.critical ? 1 :
                       memoryUsage > this.adaptiveThresholds.memory.poor ? 0.7 :
                       memoryUsage > this.adaptiveThresholds.memory.good ? 0.4 : 0;
    
    const totalLoad = (frameRateScore + memoryScore + componentLoad) / 3;
    
    if (totalLoad > this.adaptiveThresholds.load.high) {
      this.globalState.systemLoad = 'critical';
      this.globalState.emergencyMode = true;
    } else if (totalLoad > this.adaptiveThresholds.load.medium) {
      this.globalState.systemLoad = 'high';
      this.globalState.emergencyMode = false;
    } else if (totalLoad > this.adaptiveThresholds.load.low) {
      this.globalState.systemLoad = 'medium';
      this.globalState.emergencyMode = false;
    } else {
      this.globalState.systemLoad = 'low';
      this.globalState.emergencyMode = false;
    }
  }
  
  /**
   * Check and apply adaptive optimizations for component
   */
  private checkAdaptiveOptimizations(
    componentId: string, 
    componentState: ComponentAnimationState
  ): void {
    if (!this.globalState.adaptiveMode) return;
    
    const { frameRate } = componentState.resourceUsage;
    
    // Poor performance detected - suggest optimization
    if (frameRate < this.adaptiveThresholds.frameRate.poor) {
      this.optimizeComponentPerformance(componentId, 'reduce-complexity');
    }
    
    // Critical performance - emergency optimization
    if (frameRate < this.adaptiveThresholds.frameRate.critical) {
      this.optimizeComponentPerformance(componentId, 'emergency-mode');
    }
  }
  
  /**
   * Apply performance optimizations to component
   */
  private optimizeComponentPerformance(componentId: string, mode: 'reduce-complexity' | 'emergency-mode'): void {
    const componentState = this.componentStates.get(componentId);
    if (!componentState) return;
    
    console.log(`Applying ${mode} optimization to component: ${componentId}`);
    
    switch (mode) {
      case 'reduce-complexity':
        // Switch to performance animation profile
        this.updateComponentState(componentId, {
          animationProfile: 'performance',
        });
        break;
        
      case 'emergency-mode':
        // Disable non-essential animations
        this.updateComponentState(componentId, {
          animationProfile: 'accessibility',
        });
        break;
    }
  }
  
  /**
   * Update global performance metrics
   */
  private updateGlobalPerformanceMetrics(): void {
    // This would integrate with browser performance APIs in a real implementation
    const mockFrameRate = 60 - Math.random() * 10; // Simulate frame rate variation
    const mockMemoryUsage = Math.random() * 100; // Simulate memory usage
    
    this.globalState.globalPerformance.frameRate = mockFrameRate;
    this.globalState.globalPerformance.memoryUsage = mockMemoryUsage;
  }
  
  /**
   * Check overall system health
   */
  private checkSystemHealth(): void {
    const recentPerformance = this.performanceHistory.slice(-10);
    const avgRecentPerformance = recentPerformance.reduce((sum, rate) => sum + rate, 0) / recentPerformance.length;
    
    // Performance degradation detected
    if (avgRecentPerformance < this.adaptiveThresholds.frameRate.poor) {
      console.warn('System performance degradation detected - applying global optimizations');
      this.performGlobalOptimizations();
    }
  }
  
  /**
   * Perform adaptive optimizations
   */
  private performAdaptiveOptimizations(): void {
    if (!this.globalState.adaptiveMode) return;
    
    // Clean up inactive components
    this.cleanupInactiveComponents();
    
    // Optimize based on system load
    switch (this.globalState.systemLoad) {
      case 'high':
        this.reduceGlobalAnimationComplexity();
        break;
      case 'critical':
        this.enableEmergencyMode();
        break;
    }
  }
  
  /**
   * Perform global optimizations
   */
  private performGlobalOptimizations(): void {
    console.log('Performing global animation optimizations');
    
    // Switch low-priority components to performance mode
    this.componentStates.forEach((state, componentId) => {
      if (state.isActive && state.resourceUsage.frameRate < this.adaptiveThresholds.frameRate.good) {
        this.optimizeComponentPerformance(componentId, 'reduce-complexity');
      }
    });
  }
  
  /**
   * Clean up inactive components
   */
  private cleanupInactiveComponents(): void {
    const inactiveThreshold = Date.now() - (5 * 60 * 1000); // 5 minutes
    
    this.componentStates.forEach((state, componentId) => {
      if (!state.isActive && state.lastActive < inactiveThreshold) {
        this.cleanupComponent(componentId);
      }
    });
  }
  
  /**
   * Reduce global animation complexity
   */
  private reduceGlobalAnimationComplexity(): void {
    console.log('Reducing global animation complexity');
    
    // Switch all components to subtle or performance mode
    this.componentStates.forEach((state, componentId) => {
      if (state.isActive && state.animationProfile !== 'performance') {
        this.updateComponentState(componentId, {
          animationProfile: 'subtle',
        });
      }
    });
  }
  
  /**
   * Enable emergency performance mode
   */
  private enableEmergencyMode(): void {
    console.warn('Enabling emergency performance mode');
    
    // Switch all components to accessibility mode (minimal animations)
    this.componentStates.forEach((state, componentId) => {
      if (state.isActive) {
        this.updateComponentState(componentId, {
          animationProfile: 'accessibility',
        });
      }
    });
  }
  
  /**
   * Load persisted state for component
   */
  private async loadPersistedState(componentId: string): Promise<void> {
    try {
      const persistedState = localStorage.getItem(`atlas-animation-state-${componentId}`);
      if (persistedState) {
        const state = JSON.parse(persistedState);
        this.stateCache.set(componentId, state);
        console.log(`Loaded persisted state for component: ${componentId}`);
      }
    } catch (error) {
      console.warn(`Failed to load persisted state for ${componentId}:`, error);
    }
  }
  
  /**
   * Persist component state
   */
  private persistComponentState(componentId: string, state: ComponentAnimationState): void {
    try {
      localStorage.setItem(`atlas-animation-state-${componentId}`, JSON.stringify(state));
    } catch (error) {
      console.warn(`Failed to persist state for ${componentId}:`, error);
    }
  }
  
  /**
   * Setup memory management for component
   */
  private setupMemoryManagement(config: AnimationStateConfig): void {
    if (!config.memoryManagement) return;
    
    const { cleanupInterval, enableGarbageCollection } = config.memoryManagement;
    
    if (enableGarbageCollection) {
      setInterval(() => {
        this.performGarbageCollection();
      }, cleanupInterval);
    }
  }
  
  /**
   * Perform garbage collection
   */
  private performGarbageCollection(): void {
    // Clean up old cache entries
    const cacheThreshold = Date.now() - (10 * 60 * 1000); // 10 minutes
    
    this.stateCache.forEach((value, key) => {
      if (value.lastAccessed && value.lastAccessed < cacheThreshold) {
        this.stateCache.delete(key);
      }
    });
    
    console.log('Animation state garbage collection completed');
  }
  
  /**
   * Get comprehensive system statistics
   */
  getSystemStatistics(): {
    components: ComponentAnimationState[];
    global: GlobalAnimationState;
    performance: {
      history: number[];
      average: number;
      trend: 'improving' | 'stable' | 'degrading';
    };
  } {
    const recentHistory = this.performanceHistory.slice(-20);
    const average = recentHistory.reduce((sum, rate) => sum + rate, 0) / recentHistory.length;
    
    // Determine trend
    const firstHalf = recentHistory.slice(0, 10);
    const secondHalf = recentHistory.slice(10);
    const firstAvg = firstHalf.reduce((sum, rate) => sum + rate, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, rate) => sum + rate, 0) / secondHalf.length;
    
    const trend = secondAvg > firstAvg + 2 ? 'improving' :
                 secondAvg < firstAvg - 2 ? 'degrading' : 'stable';
    
    return {
      components: Array.from(this.componentStates.values()),
      global: this.getGlobalState(),
      performance: {
        history: [...this.performanceHistory],
        average,
        trend,
      },
    };
  }
  
  /**
   * Cleanup and destroy state manager
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    this.componentStates.clear();
    this.stateCache.clear();
    
    console.log('Animation State Manager destroyed');
  }
}

/**
 * Global Animation State Manager Instance
 */
export const globalAnimationStateManager = new AnimationStateManager();

/**
 * React Hook for Animation State Management
 */
export const useAnimationState = (config: AnimationStateConfig) => {
  const [componentState, setComponentState] = useState<ComponentAnimationState | null>(null);
  const [globalState, setGlobalState] = useState<GlobalAnimationState | null>(null);
  const stateManagerRef = useRef<AnimationStateManager>(globalAnimationStateManager);
  
  // Initialize component state
  useEffect(() => {
    const initializeState = async () => {
      try {
        const state = await stateManagerRef.current.initializeComponent(config);
        setComponentState(state);
        setGlobalState(stateManagerRef.current.getGlobalState());
      } catch (error) {
        console.error('Failed to initialize animation state:', error);
      }
    };
    
    initializeState();
    
    // Cleanup on unmount
    return () => {
      stateManagerRef.current.deactivateComponent(config.componentId);
    };
  }, [config.componentId]);
  
  // Update component state
  const updateState = useCallback((updates: Partial<ComponentAnimationState>) => {
    const updatedState = stateManagerRef.current.updateComponentState(config.componentId, updates);
    if (updatedState) {
      setComponentState(updatedState);
      setGlobalState(stateManagerRef.current.getGlobalState());
    }
  }, [config.componentId]);
  
  // Get system statistics
  const getStatistics = useCallback(() => {
    return stateManagerRef.current.getSystemStatistics();
  }, []);
  
  return {
    componentState,
    globalState,
    updateState,
    getStatistics,
    stateManager: stateManagerRef.current,
  };
};

/**
 * Export animation state management system
 */
export const animationStateManagement = {
  manager: AnimationStateManager,
  hook: useAnimationState,
  global: globalAnimationStateManager,
} as const; 