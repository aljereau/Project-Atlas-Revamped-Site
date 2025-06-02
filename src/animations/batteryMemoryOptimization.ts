'use client';

import React, { useState, useEffect } from 'react';

/**
 * Battery & Memory Optimization - Task 4.4.4
 * 
 * Intelligent power management and memory optimization system for mobile animation
 * performance, providing battery-aware animation adjustments, memory leak prevention,
 * and resource-conscious operation modes.
 * 
 * Features:
 * - Real-time battery level monitoring with adaptive animation adjustments
 * - Memory usage optimization with automatic cleanup and garbage collection
 * - Power-saving modes with graduated animation reduction strategies
 * - Charging state awareness for performance scaling
 * - Memory leak detection and prevention for long-running animations
 * - Resource pooling and efficient memory management
 * - Background/foreground state optimization
 * - Thermal management with performance throttling
 */

// Battery Management Types
export interface BatteryStatus {
  level: number; // 0-1
  charging: boolean;
  chargingTime: number; // seconds until charged
  dischargingTime: number; // seconds until discharged
  isLowPower: boolean;
  isCritical: boolean;
  lastUpdated: number;
}

export interface PowerSavingMode {
  name: string;
  batteryThreshold: number;
  animationReduction: number; // percentage
  frameRateTarget: number;
  disableComplexAnimations: boolean;
  disableParallaxEffects: boolean;
  disableNonEssentialAnimations: boolean;
  memoryOptimizationLevel: 'none' | 'moderate' | 'aggressive';
}

// Memory Management Types
export interface MemoryMetrics {
  usedJSHeapSize: number; // bytes
  totalJSHeapSize: number; // bytes
  jsHeapSizeLimit: number; // bytes
  animationHeapUsage: number; // bytes
  leakSuspicionLevel: number; // 0-100
  gcFrequency: number; // collections per minute
  memoryPressure: 'low' | 'medium' | 'high' | 'critical';
  lastCleanup: number;
}

export interface MemoryOptimizationConfig {
  maxHeapUsage: number; // MB
  cleanupThreshold: number; // MB
  gcTriggerThreshold: number; // MB
  animationPoolSize: number;
  enableObjectPooling: boolean;
  enableAutoCleanup: boolean;
  cleanupInterval: number; // ms
  leakDetectionEnabled: boolean;
}

// Thermal Management
export interface ThermalState {
  level: 'nominal' | 'fair' | 'serious' | 'critical';
  temperature: number; // estimated CPU temperature
  throttlingActive: boolean;
  coolingStrategy: 'none' | 'reduce_animations' | 'pause_non_essential' | 'emergency_stop';
  lastThermalEvent: number;
}

// Resource Pool Management
export interface ResourcePool<T> {
  pool: T[];
  active: Set<T>;
  factory: () => T;
  reset: (item: T) => void;
  maxSize: number;
  currentSize: number;
}

// Animation Resource Types
export interface AnimationContext {
  id: string;
  element: HTMLElement;
  startTime: number;
  duration: number;
  complexity: 'low' | 'medium' | 'high';
  memoryUsage: number;
  isEssential: boolean;
}

export interface MemoryLeak {
  context: string;
  memoryGrowth: number;
  duration: number;
  severity: 'minor' | 'moderate' | 'severe';
  detectedAt: number;
}

// Main Battery & Memory Optimization Manager
export class BatteryMemoryOptimizationManager {
  private batteryStatus: BatteryStatus;
  private memoryMetrics: MemoryMetrics;
  private thermalState: ThermalState;
  private powerSavingModes: PowerSavingMode[];
  private currentPowerMode: PowerSavingMode;
  private memoryConfig: MemoryOptimizationConfig;
  
  private animationContexts: Map<string, AnimationContext> = new Map();
  private memoryLeaks: MemoryLeak[] = [];
  private resourcePools: Map<string, ResourcePool<any>> = new Map();
  
  private batteryMonitorInterval: number | null = null;
  private memoryMonitorInterval: number | null = null;
  private cleanupInterval: number | null = null;
  private isMonitoring: boolean = false;
  
  private visibilityChangeHandler: () => void;
  private pageVisibilityState: 'visible' | 'hidden' = 'visible';
  
  private subscribers: Set<(status: {
    battery: BatteryStatus;
    memory: MemoryMetrics;
    thermal: ThermalState;
    powerMode: PowerSavingMode;
  }) => void> = new Set();

  constructor(config?: Partial<MemoryOptimizationConfig>) {
    this.memoryConfig = this.createMemoryConfig(config);
    this.powerSavingModes = this.createPowerSavingModes();
    this.currentPowerMode = this.powerSavingModes[0]; // Normal mode
    
    this.batteryStatus = this.initializeBatteryStatus();
    this.memoryMetrics = this.initializeMemoryMetrics();
    this.thermalState = this.initializeThermalState();
    
    this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
    
    this.setupResourcePools();
    this.setupEventListeners();
    this.startMonitoring();
  }

  // Configuration Setup
  private createMemoryConfig(overrides?: Partial<MemoryOptimizationConfig>): MemoryOptimizationConfig {
    const defaultConfig: MemoryOptimizationConfig = {
      maxHeapUsage: 100, // MB
      cleanupThreshold: 75, // MB
      gcTriggerThreshold: 50, // MB
      animationPoolSize: 20,
      enableObjectPooling: true,
      enableAutoCleanup: true,
      cleanupInterval: 30000, // 30 seconds
      leakDetectionEnabled: true
    };

    return { ...defaultConfig, ...overrides };
  }

  private createPowerSavingModes(): PowerSavingMode[] {
    return [
      {
        name: 'normal',
        batteryThreshold: 100,
        animationReduction: 0,
        frameRateTarget: 60,
        disableComplexAnimations: false,
        disableParallaxEffects: false,
        disableNonEssentialAnimations: false,
        memoryOptimizationLevel: 'none'
      },
      {
        name: 'moderate_saving',
        batteryThreshold: 30,
        animationReduction: 25,
        frameRateTarget: 45,
        disableComplexAnimations: false,
        disableParallaxEffects: true,
        disableNonEssentialAnimations: false,
        memoryOptimizationLevel: 'moderate'
      },
      {
        name: 'aggressive_saving',
        batteryThreshold: 15,
        animationReduction: 50,
        frameRateTarget: 30,
        disableComplexAnimations: true,
        disableParallaxEffects: true,
        disableNonEssentialAnimations: true,
        memoryOptimizationLevel: 'aggressive'
      },
      {
        name: 'critical_saving',
        batteryThreshold: 5,
        animationReduction: 80,
        frameRateTarget: 20,
        disableComplexAnimations: true,
        disableParallaxEffects: true,
        disableNonEssentialAnimations: true,
        memoryOptimizationLevel: 'aggressive'
      }
    ];
  }

  // Status Initialization
  private initializeBatteryStatus(): BatteryStatus {
    return {
      level: 1.0,
      charging: true,
      chargingTime: Infinity,
      dischargingTime: Infinity,
      isLowPower: false,
      isCritical: false,
      lastUpdated: Date.now()
    };
  }

  private initializeMemoryMetrics(): MemoryMetrics {
    const performance = window.performance as any;
    const memory = performance.memory || {};

    return {
      usedJSHeapSize: memory.usedJSHeapSize || 0,
      totalJSHeapSize: memory.totalJSHeapSize || 0,
      jsHeapSizeLimit: memory.jsHeapSizeLimit || 0,
      animationHeapUsage: 0,
      leakSuspicionLevel: 0,
      gcFrequency: 0,
      memoryPressure: 'low',
      lastCleanup: Date.now()
    };
  }

  private initializeThermalState(): ThermalState {
    return {
      level: 'nominal',
      temperature: 25, // estimated base temperature
      throttlingActive: false,
      coolingStrategy: 'none',
      lastThermalEvent: Date.now()
    };
  }

  // Resource Pool Setup
  private setupResourcePools(): void {
    if (this.memoryConfig.enableObjectPooling) {
      // Animation frames pool
      this.createResourcePool('animationFrames', {
        factory: () => ({ id: '', startTime: 0, duration: 0, progress: 0 }),
        reset: (frame: any) => {
          frame.id = '';
          frame.startTime = 0;
          frame.duration = 0;
          frame.progress = 0;
        },
        maxSize: this.memoryConfig.animationPoolSize
      });

      // DOM element pools for common animation elements
      this.createResourcePool('transformElements', {
        factory: () => {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.opacity = '0';
          div.style.pointerEvents = 'none';
          return div;
        },
        reset: (element: HTMLElement) => {
          element.style.transform = '';
          element.style.opacity = '0';
          element.innerHTML = '';
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        },
        maxSize: 10
      });
    }
  }

  private createResourcePool<T>(name: string, config: {
    factory: () => T;
    reset: (item: T) => void;
    maxSize: number;
  }): void {
    const pool: ResourcePool<T> = {
      pool: [],
      active: new Set(),
      factory: config.factory,
      reset: config.reset,
      maxSize: config.maxSize,
      currentSize: 0
    };

    this.resourcePools.set(name, pool);
  }

  // Event Listeners Setup
  private setupEventListeners(): void {
    // Page visibility for background optimization
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    
    // Window focus/blur events
    window.addEventListener('focus', () => this.handleFocusChange(true));
    window.addEventListener('blur', () => this.handleFocusChange(false));
    
    // Memory pressure events (if supported)
    if ('memory' in performance && 'addEventListener' in (performance as any).memory) {
      (performance as any).memory.addEventListener('memorypressure', this.handleMemoryPressure.bind(this));
    }
  }

  // Monitoring Management
  public startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    
    // Battery monitoring
    this.startBatteryMonitoring();
    
    // Memory monitoring
    this.memoryMonitorInterval = window.setInterval(() => {
      this.updateMemoryMetrics();
      this.detectMemoryLeaks();
      this.updateThermalState();
      this.optimizePowerMode();
      this.notifySubscribers();
    }, 5000); // Every 5 seconds

    // Cleanup interval
    if (this.memoryConfig.enableAutoCleanup) {
      this.cleanupInterval = window.setInterval(() => {
        this.performMemoryCleanup();
      }, this.memoryConfig.cleanupInterval);
    }
  }

  public stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    
    if (this.batteryMonitorInterval) {
      clearInterval(this.batteryMonitorInterval);
      this.batteryMonitorInterval = null;
    }

    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
      this.memoryMonitorInterval = null;
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Battery Monitoring
  private async startBatteryMonitoring(): Promise<void> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.updateBatteryStatus(battery);
        
        // Set up battery event listeners
        battery.addEventListener('chargingchange', () => this.updateBatteryStatus(battery));
        battery.addEventListener('levelchange', () => this.updateBatteryStatus(battery));
        battery.addEventListener('chargingtimechange', () => this.updateBatteryStatus(battery));
        battery.addEventListener('dischargingtimechange', () => this.updateBatteryStatus(battery));

        // Periodic battery updates
        this.batteryMonitorInterval = window.setInterval(() => {
          this.updateBatteryStatus(battery);
        }, 10000); // Every 10 seconds

      } catch (error) {
        console.warn('Battery API not available:', error);
        // Fallback to estimated battery status
        this.useFallbackBatteryMonitoring();
      }
    } else {
      this.useFallbackBatteryMonitoring();
    }
  }

  private updateBatteryStatus(battery: any): void {
    this.batteryStatus = {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      isLowPower: battery.level < 0.3,
      isCritical: battery.level < 0.1,
      lastUpdated: Date.now()
    };
  }

  private useFallbackBatteryMonitoring(): void {
    // Estimate battery usage based on performance degradation
    this.batteryMonitorInterval = window.setInterval(() => {
      const estimatedLevel = this.estimateBatteryLevel();
      this.batteryStatus = {
        ...this.batteryStatus,
        level: estimatedLevel,
        isLowPower: estimatedLevel < 0.3,
        isCritical: estimatedLevel < 0.1,
        lastUpdated: Date.now()
      };
    }, 15000); // Every 15 seconds
  }

  private estimateBatteryLevel(): number {
    // Simple heuristic based on performance metrics
    const performance = window.performance as any;
    const memory = performance.memory;
    
    if (memory) {
      const memoryPressure = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      const estimatedDrain = Math.min(0.01, memoryPressure * 0.005);
      return Math.max(0.05, this.batteryStatus.level - estimatedDrain);
    }
    
    return Math.max(0.05, this.batteryStatus.level - 0.001);
  }

  // Memory Monitoring
  private updateMemoryMetrics(): void {
    const performance = window.performance as any;
    const memory = performance.memory;

    if (memory) {
      const previousUsage = this.memoryMetrics.usedJSHeapSize;
      
      this.memoryMetrics = {
        ...this.memoryMetrics,
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };

      // Calculate memory pressure
      const usageMB = memory.usedJSHeapSize / (1024 * 1024);
      this.memoryMetrics.memoryPressure = this.calculateMemoryPressure(usageMB);

      // Update animation-specific memory usage
      this.updateAnimationMemoryUsage();

      // Detect potential garbage collection
      if (memory.usedJSHeapSize < previousUsage * 0.8) {
        this.memoryMetrics.gcFrequency++;
      }
    }
  }

  private calculateMemoryPressure(usageMB: number): 'low' | 'medium' | 'high' | 'critical' {
    const threshold = this.memoryConfig.maxHeapUsage;
    
    if (usageMB > threshold * 0.9) return 'critical';
    if (usageMB > threshold * 0.75) return 'high';
    if (usageMB > threshold * 0.5) return 'medium';
    return 'low';
  }

  private updateAnimationMemoryUsage(): void {
    let totalAnimationMemory = 0;
    
    // Convert Map values to array to avoid iteration issues
    const contexts = Array.from(this.animationContexts.values());
    for (const context of contexts) {
      totalAnimationMemory += context.memoryUsage;
    }
    
    this.memoryMetrics.animationHeapUsage = totalAnimationMemory;
  }

  // Memory Leak Detection
  private detectMemoryLeaks(): void {
    if (!this.memoryConfig.leakDetectionEnabled) return;

    const currentUsage = this.memoryMetrics.usedJSHeapSize / (1024 * 1024); // MB
    const timeSinceLastCleanup = Date.now() - this.memoryMetrics.lastCleanup;
    
    // Check for sustained memory growth
    if (timeSinceLastCleanup > 60000) { // 1 minute
      const memoryGrowthRate = currentUsage / (timeSinceLastCleanup / 60000); // MB per minute
      
      if (memoryGrowthRate > 1) { // Growing more than 1MB per minute
        const leak: MemoryLeak = {
          context: 'general',
          memoryGrowth: memoryGrowthRate,
          duration: timeSinceLastCleanup,
          severity: memoryGrowthRate > 5 ? 'severe' : memoryGrowthRate > 2 ? 'moderate' : 'minor',
          detectedAt: Date.now()
        };
        
        this.memoryLeaks.push(leak);
        this.handleMemoryLeak(leak);
      }
    }

    // Update leak suspicion level
    this.memoryMetrics.leakSuspicionLevel = Math.min(100, this.memoryLeaks.length * 20);
  }

  private handleMemoryLeak(leak: MemoryLeak): void {
    console.warn('Memory leak detected:', leak);
    
    if (leak.severity === 'severe') {
      this.performAggressiveCleanup();
    } else if (leak.severity === 'moderate') {
      this.performMemoryCleanup();
    }
  }

  // Thermal Management
  private updateThermalState(): void {
    // Estimate thermal state based on performance metrics
    const cpuUsage = this.estimateCPUUsage();
    const memoryPressure = this.memoryMetrics.memoryPressure;
    
    let thermalLevel: ThermalState['level'] = 'nominal';
    let estimatedTemp = 25;
    
    if (cpuUsage > 0.8 || memoryPressure === 'critical') {
      thermalLevel = 'critical';
      estimatedTemp = 85;
    } else if (cpuUsage > 0.6 || memoryPressure === 'high') {
      thermalLevel = 'serious';
      estimatedTemp = 70;
    } else if (cpuUsage > 0.4 || memoryPressure === 'medium') {
      thermalLevel = 'fair';
      estimatedTemp = 55;
    }

    this.thermalState = {
      level: thermalLevel,
      temperature: estimatedTemp,
      throttlingActive: thermalLevel === 'serious' || thermalLevel === 'critical',
      coolingStrategy: this.determineCoolingStrategy(thermalLevel),
      lastThermalEvent: thermalLevel !== 'nominal' ? Date.now() : this.thermalState.lastThermalEvent
    };
  }

  private estimateCPUUsage(): number {
    // Rough estimation based on animation count and memory usage
    const animationLoad = this.animationContexts.size / 10;
    const memoryLoad = this.memoryMetrics.usedJSHeapSize / this.memoryMetrics.jsHeapSizeLimit;
    
    return Math.min(1, (animationLoad + memoryLoad) / 2);
  }

  private determineCoolingStrategy(thermalLevel: ThermalState['level']): ThermalState['coolingStrategy'] {
    switch (thermalLevel) {
      case 'critical':
        return 'emergency_stop';
      case 'serious':
        return 'pause_non_essential';
      case 'fair':
        return 'reduce_animations';
      default:
        return 'none';
    }
  }

  // Power Mode Optimization
  private optimizePowerMode(): void {
    const batteryLevel = this.batteryStatus.level * 100;
    const isCharging = this.batteryStatus.charging;
    const thermalLevel = this.thermalState.level;
    
    // If charging and not overheating, use normal mode
    if (isCharging && thermalLevel === 'nominal') {
      this.currentPowerMode = this.powerSavingModes[0]; // normal
      return;
    }

    // Select appropriate power saving mode based on battery level
    let selectedMode = this.powerSavingModes[0]; // default to normal
    
    for (const mode of this.powerSavingModes) {
      if (batteryLevel <= mode.batteryThreshold) {
        selectedMode = mode;
        break;
      }
    }

    // Override for thermal management
    if (thermalLevel === 'critical' || thermalLevel === 'serious') {
      selectedMode = this.powerSavingModes[this.powerSavingModes.length - 1]; // most aggressive
    }

    this.currentPowerMode = selectedMode;
  }

  // Memory Cleanup Operations
  public performMemoryCleanup(): void {
    const startTime = Date.now();
    let cleanupCount = 0;

    // Clean up completed animation contexts
    const contextEntries = Array.from(this.animationContexts.entries());
    for (const [id, context] of contextEntries) {
      if (Date.now() - context.startTime > context.duration + 5000) { // 5 second grace period
        this.animationContexts.delete(id);
        cleanupCount++;
      }
    }

    // Clean up resource pools
    const poolValues = Array.from(this.resourcePools.values());
    for (const pool of poolValues) {
      const targetSize = Math.floor(pool.maxSize * 0.7); // Keep 70% of max size
      while (pool.pool.length > targetSize) {
        pool.pool.pop();
        pool.currentSize--;
      }
    }

    // Clear old memory leaks
    this.memoryLeaks = this.memoryLeaks.filter(leak => 
      Date.now() - leak.detectedAt < 300000 // Keep leaks for 5 minutes
    );

    this.memoryMetrics.lastCleanup = Date.now();
    
    console.log(`Memory cleanup completed in ${Date.now() - startTime}ms, cleaned ${cleanupCount} contexts`);
  }

  private performAggressiveCleanup(): void {
    // Stop all non-essential animations
    const contextEntries = Array.from(this.animationContexts.entries());
    for (const [id, context] of contextEntries) {
      if (!context.isEssential) {
        this.animationContexts.delete(id);
      }
    }

    // Clear all resource pools
    const poolValues = Array.from(this.resourcePools.values());
    for (const pool of poolValues) {
      pool.pool.length = 0;
      pool.active.clear();
      pool.currentSize = 0;
    }

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }

    this.performMemoryCleanup();
    
    console.warn('Aggressive memory cleanup performed due to severe leak detection');
  }

  // Resource Pool Management
  public acquireResource<T>(poolName: string): T | null {
    const pool = this.resourcePools.get(poolName) as ResourcePool<T>;
    if (!pool) return null;

    let resource: T;
    
    if (pool.pool.length > 0) {
      resource = pool.pool.pop()!;
    } else if (pool.currentSize < pool.maxSize) {
      resource = pool.factory();
      pool.currentSize++;
    } else {
      return null; // Pool exhausted
    }

    pool.active.add(resource);
    return resource;
  }

  public releaseResource<T>(poolName: string, resource: T): void {
    const pool = this.resourcePools.get(poolName) as ResourcePool<T>;
    if (!pool || !pool.active.has(resource)) return;

    pool.active.delete(resource);
    pool.reset(resource);
    pool.pool.push(resource);
  }

  // Animation Context Management
  public registerAnimation(context: Omit<AnimationContext, 'id'>): string {
    const id = `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullContext: AnimationContext = { ...context, id };
    
    this.animationContexts.set(id, fullContext);
    return id;
  }

  public unregisterAnimation(id: string): void {
    this.animationContexts.delete(id);
  }

  public getAnimationRecommendations(): {
    shouldReduceAnimations: boolean;
    shouldDisableComplexAnimations: boolean;
    shouldDisableNonEssential: boolean;
    recommendedFrameRate: number;
    memoryOptimizationLevel: string;
  } {
    return {
      shouldReduceAnimations: this.currentPowerMode.animationReduction > 0,
      shouldDisableComplexAnimations: this.currentPowerMode.disableComplexAnimations,
      shouldDisableNonEssential: this.currentPowerMode.disableNonEssentialAnimations,
      recommendedFrameRate: this.currentPowerMode.frameRateTarget,
      memoryOptimizationLevel: this.currentPowerMode.memoryOptimizationLevel
    };
  }

  // Event Handlers
  private handleVisibilityChange(): void {
    this.pageVisibilityState = document.hidden ? 'hidden' : 'visible';
    
    if (document.hidden) {
      // Page is hidden, reduce all animations
      this.pauseNonEssentialAnimations();
    } else {
      // Page is visible, resume animations based on power mode
      this.resumeAnimations();
    }
  }

  private handleFocusChange(focused: boolean): void {
    if (!focused) {
      this.pauseNonEssentialAnimations();
    } else {
      this.resumeAnimations();
    }
  }

  private handleMemoryPressure(event: any): void {
    console.warn('Memory pressure detected:', event);
    this.performAggressiveCleanup();
  }

  private pauseNonEssentialAnimations(): void {
    // Implementation would pause animations marked as non-essential
    console.log('Pausing non-essential animations due to background state');
  }

  private resumeAnimations(): void {
    // Implementation would resume animations based on current power mode
    console.log('Resuming animations based on current power mode:', this.currentPowerMode.name);
  }

  // Public API
  public getCurrentStatus() {
    return {
      battery: { ...this.batteryStatus },
      memory: { ...this.memoryMetrics },
      thermal: { ...this.thermalState },
      powerMode: { ...this.currentPowerMode }
    };
  }

  public getPowerSavingModes(): PowerSavingMode[] {
    return [...this.powerSavingModes];
  }

  public getMemoryLeaks(): MemoryLeak[] {
    return [...this.memoryLeaks];
  }

  public getResourcePoolStatus(): Record<string, {
    active: number;
    available: number;
    total: number;
    maxSize: number;
  }> {
    const status: any = {};
    
    const poolEntries = Array.from(this.resourcePools.entries());
    for (const [name, pool] of poolEntries) {
      status[name] = {
        active: pool.active.size,
        available: pool.pool.length,
        total: pool.currentSize,
        maxSize: pool.maxSize
      };
    }
    
    return status;
  }

  // Subscription Management
  public subscribe(callback: (status: {
    battery: BatteryStatus;
    memory: MemoryMetrics;
    thermal: ThermalState;
    powerMode: PowerSavingMode;
  }) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    const status = this.getCurrentStatus();
    this.subscribers.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Battery Memory Optimization: Subscriber error:', error);
      }
    });
  }

  // Cleanup and Destruction
  public destroy(): void {
    this.stopMonitoring();
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    window.removeEventListener('focus', () => this.handleFocusChange(true));
    window.removeEventListener('blur', () => this.handleFocusChange(false));
    
    this.animationContexts.clear();
    this.memoryLeaks = [];
    this.resourcePools.clear();
    this.subscribers.clear();
  }
}

// React Hook
export function useBatteryMemoryOptimization(config?: Partial<MemoryOptimizationConfig>) {
  const [manager] = useState(() => new BatteryMemoryOptimizationManager(config));
  const [status, setStatus] = useState(manager.getCurrentStatus());

  useEffect(() => {
    const unsubscribe = manager.subscribe(setStatus);
    return () => {
      unsubscribe();
      manager.destroy();
    };
  }, [manager]);

  return {
    manager,
    ...status,
    recommendations: manager.getAnimationRecommendations(),
    resourcePools: manager.getResourcePoolStatus(),
    memoryLeaks: manager.getMemoryLeaks()
  };
}

// Singleton Instance
let globalBatteryMemoryManager: BatteryMemoryOptimizationManager | null = null;

export function getGlobalBatteryMemoryManager(): BatteryMemoryOptimizationManager {
  if (!globalBatteryMemoryManager) {
    globalBatteryMemoryManager = new BatteryMemoryOptimizationManager();
  }
  return globalBatteryMemoryManager;
}

export default BatteryMemoryOptimizationManager; 