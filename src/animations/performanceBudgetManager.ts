/**
 * Performance Budget Management System
 * Task 4.4.3 - Performance Budget Management
 * Intelligent animation performance budget management across mobile devices
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { globalMobileDeviceDetector } from './mobileDeviceDetection';
import type { DeviceInfo, AdaptiveAnimationConfig } from './mobileDeviceDetection';

/**
 * Performance Budget Configuration
 */
export interface PerformanceBudget {
  frameRateTarget: number;
  maxAnimationDuration: number;
  maxConcurrentAnimations: number;
  cpuUsageLimit: number;
  memoryUsageLimit: number;
  networkBandwidthThreshold: number;
  batteryLevelThreshold: number;
  enableAdaptiveDegradation: boolean;
  emergencyModeThreshold: number;
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  frameRate: {
    current: number;
    average: number;
    min: number;
    max: number;
    history: number[];
  };
  timing: {
    scriptDuration: number;
    renderDuration: number;
    paintDuration: number;
    compositeTime: number;
  };
  memory: {
    usedSize: number;
    totalSize: number;
    percentage: number;
    gcEvents: number;
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  battery: {
    level: number;
    charging: boolean;
    dischargingTime: number;
  };
  animations: {
    active: number;
    queued: number;
    completed: number;
    dropped: number;
  };
}

/**
 * Performance Grade
 */
export type PerformanceGrade = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

/**
 * Animation Priority Level
 */
export type AnimationPriority = 'critical' | 'high' | 'medium' | 'low' | 'optional';

/**
 * Performance Alert
 */
export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  metric: keyof PerformanceMetrics;
  threshold: number;
  currentValue: number;
  timestamp: number;
  suggestion: string;
}

/**
 * Animation Registration
 */
export interface AnimationRegistration {
  id: string;
  name: string;
  priority: AnimationPriority;
  estimatedDuration: number;
  complexity: 'low' | 'medium' | 'high';
  resourceUsage: {
    cpu: number;
    memory: number;
    gpu: boolean;
  };
  fallbackAvailable: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Budget Allocation
 */
export interface BudgetAllocation {
  frameRateBudget: number;
  cpuBudget: number;
  memoryBudget: number;
  concurrentAnimationBudget: number;
  networkBudget: number;
}

/**
 * Performance Budget Manager Class
 */
export class PerformanceBudgetManager {
  private static instance: PerformanceBudgetManager;
  private isActive = false;
  private budget: PerformanceBudget;
  private metrics: PerformanceMetrics;
  private deviceInfo: DeviceInfo | null = null;
  private animationConfig: AdaptiveAnimationConfig | null = null;
  
  // Animation tracking
  private registeredAnimations = new Map<string, AnimationRegistration>();
  private activeAnimations = new Set<string>();
  private queuedAnimations: string[] = [];
  private animationHistory: { id: string; completed: boolean; duration: number; timestamp: number }[] = [];
  
  // Performance monitoring
  private performanceObserver: PerformanceObserver | null = null;
  private frameRateHistory: number[] = [];
  private lastFrameTime = 0;
  private frameCount = 0;
  private monitoringInterval: NodeJS.Timeout | null = null;
  
  // Alerts and notifications
  private alerts: PerformanceAlert[] = [];
  private alertListeners: ((alert: PerformanceAlert) => void)[] = [];
  
  // Budget allocation
  private currentAllocation: BudgetAllocation | null = null;
  private emergencyMode = false;
  
  constructor() {
    this.budget = this.getDefaultBudget();
    this.metrics = this.getInitialMetrics();
    
    // Listen for device changes
    if (typeof window !== 'undefined') {
      globalMobileDeviceDetector.subscribe(this.handleDeviceChange.bind(this));
    }
  }
  
  static getInstance(): PerformanceBudgetManager {
    if (!PerformanceBudgetManager.instance) {
      PerformanceBudgetManager.instance = new PerformanceBudgetManager();
    }
    return PerformanceBudgetManager.instance;
  }
  
  /**
   * Get default performance budget
   */
  private getDefaultBudget(): PerformanceBudget {
    return {
      frameRateTarget: 60,
      maxAnimationDuration: 1000,
      maxConcurrentAnimations: 5,
      cpuUsageLimit: 70,
      memoryUsageLimit: 80,
      networkBandwidthThreshold: 1.5,
      batteryLevelThreshold: 0.2,
      enableAdaptiveDegradation: true,
      emergencyModeThreshold: 30,
    };
  }
  
  /**
   * Get initial performance metrics
   */
  private getInitialMetrics(): PerformanceMetrics {
    return {
      frameRate: {
        current: 60,
        average: 60,
        min: 60,
        max: 60,
        history: [],
      },
      timing: {
        scriptDuration: 0,
        renderDuration: 0,
        paintDuration: 0,
        compositeTime: 0,
      },
      memory: {
        usedSize: 0,
        totalSize: 100,
        percentage: 0,
        gcEvents: 0,
      },
      network: {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
        saveData: false,
      },
      battery: {
        level: 1,
        charging: false,
        dischargingTime: Infinity,
      },
      animations: {
        active: 0,
        queued: 0,
        completed: 0,
        dropped: 0,
      },
    };
  }
  
  /**
   * Handle device information changes
   */
  private handleDeviceChange(deviceInfo: DeviceInfo): void {
    this.deviceInfo = deviceInfo;
    this.animationConfig = globalMobileDeviceDetector.getAdaptiveAnimationConfig();
    this.adaptBudgetToDevice();
  }
  
  /**
   * Adapt budget configuration to device capabilities
   */
  private adaptBudgetToDevice(): void {
    if (!this.deviceInfo || !this.animationConfig) return;
    
    const { type, performanceTier, capabilities } = this.deviceInfo;
    
    // Base budget adjustments by device type
    switch (type) {
      case 'mobile':
        this.budget.frameRateTarget = Math.min(this.animationConfig.frameRateTarget, 60);
        this.budget.maxConcurrentAnimations = 3;
        this.budget.cpuUsageLimit = 60;
        this.budget.memoryUsageLimit = 70;
        break;
        
      case 'tablet':
        this.budget.frameRateTarget = this.animationConfig.frameRateTarget;
        this.budget.maxConcurrentAnimations = 4;
        this.budget.cpuUsageLimit = 65;
        this.budget.memoryUsageLimit = 75;
        break;
        
      case 'desktop':
        this.budget.frameRateTarget = 60;
        this.budget.maxConcurrentAnimations = 8;
        this.budget.cpuUsageLimit = 80;
        this.budget.memoryUsageLimit = 85;
        break;
        
      default:
        // Keep default budget
        break;
    }
    
    // Performance tier adjustments
    switch (performanceTier) {
      case 'high':
        this.budget.maxConcurrentAnimations *= 1.5;
        this.budget.cpuUsageLimit += 10;
        this.budget.maxAnimationDuration = 1500;
        break;
        
      case 'medium':
        // Keep base adjustments
        break;
        
      case 'low':
        this.budget.frameRateTarget = Math.min(this.budget.frameRateTarget, 45);
        this.budget.maxConcurrentAnimations = Math.max(this.budget.maxConcurrentAnimations - 1, 2);
        this.budget.cpuUsageLimit -= 10;
        this.budget.maxAnimationDuration = 800;
        break;
        
      case 'minimal':
        this.budget.frameRateTarget = Math.min(this.budget.frameRateTarget, 30);
        this.budget.maxConcurrentAnimations = 2;
        this.budget.cpuUsageLimit -= 20;
        this.budget.memoryUsageLimit -= 10;
        this.budget.maxAnimationDuration = 500;
        this.budget.enableAdaptiveDegradation = true;
        break;
    }
    
    // Capability-based adjustments
    if (!capabilities.gpuAcceleration) {
      this.budget.cpuUsageLimit -= 15;
      this.budget.maxConcurrentAnimations = Math.max(this.budget.maxConcurrentAnimations - 1, 1);
    }
    
    if (capabilities.memoryLevel === 'low') {
      this.budget.memoryUsageLimit -= 15;
      this.budget.maxConcurrentAnimations = Math.max(this.budget.maxConcurrentAnimations - 1, 1);
    }
    
    // Network-based adjustments
    switch (capabilities.networkSupport) {
      case '2g':
        this.budget.networkBandwidthThreshold = 0.5;
        break;
      case '3g':
        this.budget.networkBandwidthThreshold = 1.0;
        break;
      case '4g':
      case 'wifi':
        this.budget.networkBandwidthThreshold = 2.0;
        break;
    }
    
    // Accessibility adjustments
    if (this.deviceInfo.features.reduceMotion) {
      this.budget.maxAnimationDuration = Math.min(this.budget.maxAnimationDuration, 300);
      this.budget.maxConcurrentAnimations = 1;
    }
    
    // Calculate budget allocation
    this.calculateBudgetAllocation();
    
    console.log('Performance budget adapted for device:', {
      device: type,
      tier: performanceTier,
      budget: this.budget,
      allocation: this.currentAllocation,
    });
  }
  
  /**
   * Calculate budget allocation
   */
  private calculateBudgetAllocation(): void {
    this.currentAllocation = {
      frameRateBudget: this.budget.frameRateTarget,
      cpuBudget: this.budget.cpuUsageLimit,
      memoryBudget: this.budget.memoryUsageLimit,
      concurrentAnimationBudget: this.budget.maxConcurrentAnimations,
      networkBudget: this.budget.networkBandwidthThreshold,
    };
  }
  
  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.initializePerformanceObserver();
    this.startFrameRateMonitoring();
    this.startSystemMonitoring();
    
    console.log('Performance budget monitoring started');
  }
  
  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    console.log('Performance budget monitoring stopped');
  }
  
  /**
   * Initialize Performance Observer
   */
  private initializePerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.processPerformanceEntries(entries);
      });
      
      this.performanceObserver.observe({
        entryTypes: ['measure', 'navigation', 'paint', 'frame'],
      });
    } catch (error) {
      console.warn('Failed to initialize Performance Observer:', error);
    }
  }
  
  /**
   * Process performance entries
   */
  private processPerformanceEntries(entries: PerformanceEntry[]): void {
    entries.forEach(entry => {
      switch (entry.entryType) {
        case 'measure':
          this.updateTimingMetrics(entry);
          break;
        case 'paint':
          this.updatePaintMetrics(entry);
          break;
        case 'frame':
          this.updateFrameMetrics(entry);
          break;
      }
    });
    
    this.checkPerformanceThresholds();
  }
  
  /**
   * Start frame rate monitoring
   */
  private startFrameRateMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.updateFrameRateMetrics(fps);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (this.isActive) {
        requestAnimationFrame(measureFrameRate);
      }
    };
    
    requestAnimationFrame(measureFrameRate);
  }
  
  /**
   * Start system monitoring
   */
  private startSystemMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.updateSystemMetrics();
      this.updateAnimationMetrics();
      this.evaluatePerformanceGrade();
      this.manageAnimationQueue();
    }, 1000);
  }
  
  /**
   * Update frame rate metrics
   */
  private updateFrameRateMetrics(fps: number): void {
    this.metrics.frameRate.current = fps;
    this.frameRateHistory.push(fps);
    
    // Keep history limited
    if (this.frameRateHistory.length > 60) {
      this.frameRateHistory.shift();
    }
    
    // Calculate statistics
    this.metrics.frameRate.history = [...this.frameRateHistory];
    this.metrics.frameRate.average = this.frameRateHistory.reduce((sum, rate) => sum + rate, 0) / this.frameRateHistory.length;
    this.metrics.frameRate.min = Math.min(...this.frameRateHistory);
    this.metrics.frameRate.max = Math.max(...this.frameRateHistory);
  }
  
  /**
   * Update timing metrics
   */
  private updateTimingMetrics(entry: PerformanceEntry): void {
    if (entry.name.includes('script')) {
      this.metrics.timing.scriptDuration = entry.duration;
    } else if (entry.name.includes('render')) {
      this.metrics.timing.renderDuration = entry.duration;
    }
  }
  
  /**
   * Update paint metrics
   */
  private updatePaintMetrics(entry: PerformanceEntry): void {
    if (entry.name === 'first-paint') {
      this.metrics.timing.paintDuration = entry.startTime;
    } else if (entry.name === 'first-contentful-paint') {
      this.metrics.timing.compositeTime = entry.startTime;
    }
  }
  
  /**
   * Update frame metrics
   */
  private updateFrameMetrics(entry: PerformanceEntry): void {
    // Process frame-specific metrics
    this.metrics.timing.renderDuration = entry.duration;
  }
  
  /**
   * Update system metrics
   */
  private updateSystemMetrics(): void {
    // Memory metrics
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memory.usedSize = memory.usedJSHeapSize;
      this.metrics.memory.totalSize = memory.totalJSHeapSize;
      this.metrics.memory.percentage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
    }
    
    // Network metrics
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.network.effectiveType = connection.effectiveType || '4g';
      this.metrics.network.downlink = connection.downlink || 10;
      this.metrics.network.rtt = connection.rtt || 50;
      this.metrics.network.saveData = connection.saveData || false;
    }
    
    // Battery metrics
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.metrics.battery.level = battery.level;
        this.metrics.battery.charging = battery.charging;
        this.metrics.battery.dischargingTime = battery.dischargingTime;
      });
    }
  }
  
  /**
   * Update animation metrics
   */
  private updateAnimationMetrics(): void {
    this.metrics.animations.active = this.activeAnimations.size;
    this.metrics.animations.queued = this.queuedAnimations.length;
    this.metrics.animations.completed = this.animationHistory.filter(h => h.completed).length;
    this.metrics.animations.dropped = this.animationHistory.filter(h => !h.completed).length;
  }
  
  /**
   * Check performance thresholds
   */
  private checkPerformanceThresholds(): void {
    const alerts: PerformanceAlert[] = [];
    
    // Frame rate threshold
    if (this.metrics.frameRate.current < this.budget.frameRateTarget * 0.8) {
      alerts.push({
        id: `fps-${Date.now()}`,
        type: this.metrics.frameRate.current < this.budget.frameRateTarget * 0.5 ? 'critical' : 'warning',
        message: `Frame rate below target: ${this.metrics.frameRate.current}fps`,
        metric: 'frameRate',
        threshold: this.budget.frameRateTarget,
        currentValue: this.metrics.frameRate.current,
        timestamp: Date.now(),
        suggestion: 'Consider reducing animation complexity or enabling performance mode',
      });
    }
    
    // Memory threshold
    if (this.metrics.memory.percentage > this.budget.memoryUsageLimit) {
      alerts.push({
        id: `memory-${Date.now()}`,
        type: this.metrics.memory.percentage > 90 ? 'critical' : 'warning',
        message: `Memory usage above limit: ${this.metrics.memory.percentage.toFixed(1)}%`,
        metric: 'memory',
        threshold: this.budget.memoryUsageLimit,
        currentValue: this.metrics.memory.percentage,
        timestamp: Date.now(),
        suggestion: 'Consider garbage collection or reducing concurrent animations',
      });
    }
    
    // Battery threshold
    if (this.metrics.battery.level < this.budget.batteryLevelThreshold && !this.metrics.battery.charging) {
      alerts.push({
        id: `battery-${Date.now()}`,
        type: 'warning',
        message: `Low battery level: ${(this.metrics.battery.level * 100).toFixed(0)}%`,
        metric: 'battery',
        threshold: this.budget.batteryLevelThreshold,
        currentValue: this.metrics.battery.level,
        timestamp: Date.now(),
        suggestion: 'Enable battery saving mode to reduce animation complexity',
      });
    }
    
    // Network threshold
    if (this.metrics.network.downlink < this.budget.networkBandwidthThreshold) {
      alerts.push({
        id: `network-${Date.now()}`,
        type: 'warning',
        message: `Low network bandwidth: ${this.metrics.network.downlink}Mbps`,
        metric: 'network',
        threshold: this.budget.networkBandwidthThreshold,
        currentValue: this.metrics.network.downlink,
        timestamp: Date.now(),
        suggestion: 'Reduce animation complexity for better performance on slow connections',
      });
    }
    
    // Process alerts
    alerts.forEach(alert => this.processAlert(alert));
    
    // Check for emergency mode
    const criticalAlerts = alerts.filter(a => a.type === 'critical');
    if (criticalAlerts.length > 0 && !this.emergencyMode) {
      this.enableEmergencyMode();
    } else if (criticalAlerts.length === 0 && this.emergencyMode) {
      this.disableEmergencyMode();
    }
  }
  
  /**
   * Process performance alert
   */
  private processAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);
    
    // Keep alerts limited
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }
    
    // Notify listeners
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.error('Alert listener error:', error);
      }
    });
    
    console.warn('Performance alert:', alert);
  }
  
  /**
   * Enable emergency mode
   */
  private enableEmergencyMode(): void {
    this.emergencyMode = true;
    
    // Cancel low-priority animations
    this.queuedAnimations = this.queuedAnimations.filter(id => {
      const registration = this.registeredAnimations.get(id);
      return registration && registration.priority !== 'low' && registration.priority !== 'optional';
    });
    
    // Reduce budget limits
    if (this.currentAllocation) {
      this.currentAllocation.frameRateBudget = Math.min(this.currentAllocation.frameRateBudget, 30);
      this.currentAllocation.concurrentAnimationBudget = Math.min(this.currentAllocation.concurrentAnimationBudget, 2);
    }
    
    console.warn('Emergency performance mode enabled');
  }
  
  /**
   * Disable emergency mode
   */
  private disableEmergencyMode(): void {
    this.emergencyMode = false;
    this.calculateBudgetAllocation();
    
    console.log('Emergency performance mode disabled');
  }
  
  /**
   * Evaluate performance grade
   */
  private evaluatePerformanceGrade(): PerformanceGrade {
    let score = 0;
    
    // Frame rate scoring (40%)
    const fpsRatio = this.metrics.frameRate.current / this.budget.frameRateTarget;
    score += Math.min(fpsRatio, 1) * 40;
    
    // Memory scoring (25%)
    const memoryScore = Math.max(0, 1 - (this.metrics.memory.percentage / 100)) * 25;
    score += memoryScore;
    
    // Animation efficiency scoring (20%)
    const animationEfficiency = this.metrics.animations.active <= this.budget.maxConcurrentAnimations ? 20 : 10;
    score += animationEfficiency;
    
    // Network scoring (15%)
    const networkScore = Math.min(this.metrics.network.downlink / this.budget.networkBandwidthThreshold, 1) * 15;
    score += networkScore;
    
    // Determine grade
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }
  
  /**
   * Register animation
   */
  registerAnimation(animation: AnimationRegistration): void {
    this.registeredAnimations.set(animation.id, animation);
    console.log(`Animation registered: ${animation.name} (${animation.priority})`);
  }
  
  /**
   * Request animation execution
   */
  requestAnimation(animationId: string): boolean {
    const registration = this.registeredAnimations.get(animationId);
    if (!registration) {
      console.warn(`Animation not found: ${animationId}`);
      return false;
    }
    
    // Check if animation can run immediately
    if (this.canRunAnimation(registration)) {
      this.startAnimation(animationId);
      return true;
    }
    
    // Queue animation if allowed
    if (this.shouldQueueAnimation(registration)) {
      this.queuedAnimations.push(animationId);
      console.log(`Animation queued: ${registration.name}`);
      return true;
    }
    
    // Reject animation
    console.log(`Animation rejected: ${registration.name} (performance budget exceeded)`);
    return false;
  }
  
  /**
   * Check if animation can run
   */
  private canRunAnimation(registration: AnimationRegistration): boolean {
    // Check concurrent animation limit
    if (this.activeAnimations.size >= this.budget.maxConcurrentAnimations) {
      return false;
    }
    
    // Check performance conditions
    if (this.emergencyMode && registration.priority !== 'critical') {
      return false;
    }
    
    // Check resource availability
    if (this.metrics.memory.percentage > this.budget.memoryUsageLimit * 0.9) {
      return registration.priority === 'critical';
    }
    
    // Check frame rate
    if (this.metrics.frameRate.current < this.budget.frameRateTarget * 0.7) {
      return registration.priority === 'critical' || registration.priority === 'high';
    }
    
    return true;
  }
  
  /**
   * Check if animation should be queued
   */
  private shouldQueueAnimation(registration: AnimationRegistration): boolean {
    // Always queue critical animations
    if (registration.priority === 'critical') {
      return true;
    }
    
    // Don't queue optional animations in emergency mode
    if (this.emergencyMode && registration.priority === 'optional') {
      return false;
    }
    
    // Queue based on priority and current queue size
    const maxQueueSize = this.budget.maxConcurrentAnimations * 2;
    return this.queuedAnimations.length < maxQueueSize;
  }
  
  /**
   * Start animation
   */
  private startAnimation(animationId: string): void {
    const registration = this.registeredAnimations.get(animationId);
    if (!registration) return;
    
    this.activeAnimations.add(animationId);
    
    // Call animation start callback
    if (registration.onStart) {
      registration.onStart();
    }
    
    // Set completion timeout
    setTimeout(() => {
      this.completeAnimation(animationId);
    }, registration.estimatedDuration);
    
    console.log(`Animation started: ${registration.name}`);
  }
  
  /**
   * Complete animation
   */
  completeAnimation(animationId: string): void {
    const registration = this.registeredAnimations.get(animationId);
    if (!registration) return;
    
    this.activeAnimations.delete(animationId);
    
    // Add to history
    this.animationHistory.push({
      id: animationId,
      completed: true,
      duration: registration.estimatedDuration,
      timestamp: Date.now(),
    });
    
    // Call completion callback
    if (registration.onComplete) {
      registration.onComplete();
    }
    
    console.log(`Animation completed: ${registration.name}`);
    
    // Process next queued animation
    this.processNextQueuedAnimation();
  }
  
  /**
   * Cancel animation
   */
  cancelAnimation(animationId: string): void {
    const registration = this.registeredAnimations.get(animationId);
    if (!registration) return;
    
    this.activeAnimations.delete(animationId);
    
    // Remove from queue if present
    const queueIndex = this.queuedAnimations.indexOf(animationId);
    if (queueIndex > -1) {
      this.queuedAnimations.splice(queueIndex, 1);
    }
    
    // Add to history as cancelled
    this.animationHistory.push({
      id: animationId,
      completed: false,
      duration: 0,
      timestamp: Date.now(),
    });
    
    // Call cancellation callback
    if (registration.onCancel) {
      registration.onCancel();
    }
    
    console.log(`Animation cancelled: ${registration.name}`);
  }
  
  /**
   * Manage animation queue
   */
  private manageAnimationQueue(): void {
    // Process queued animations if resources are available
    while (this.queuedAnimations.length > 0 && this.activeAnimations.size < this.budget.maxConcurrentAnimations) {
      const nextAnimationId = this.queuedAnimations.shift();
      if (nextAnimationId) {
        const registration = this.registeredAnimations.get(nextAnimationId);
        if (registration && this.canRunAnimation(registration)) {
          this.startAnimation(nextAnimationId);
        }
      }
    }
  }
  
  /**
   * Process next queued animation
   */
  private processNextQueuedAnimation(): void {
    if (this.queuedAnimations.length > 0 && this.activeAnimations.size < this.budget.maxConcurrentAnimations) {
      const nextAnimationId = this.queuedAnimations.shift();
      if (nextAnimationId) {
        this.startAnimation(nextAnimationId);
      }
    }
  }
  
  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Get current budget
   */
  getBudget(): PerformanceBudget {
    return { ...this.budget };
  }
  
  /**
   * Get budget allocation
   */
  getBudgetAllocation(): BudgetAllocation | null {
    return this.currentAllocation ? { ...this.currentAllocation } : null;
  }
  
  /**
   * Get performance grade
   */
  getPerformanceGrade(): PerformanceGrade {
    return this.evaluatePerformanceGrade();
  }
  
  /**
   * Get recent alerts
   */
  getRecentAlerts(count = 10): PerformanceAlert[] {
    return this.alerts.slice(-count);
  }
  
  /**
   * Get animation statistics
   */
  getAnimationStatistics(): {
    registered: number;
    active: number;
    queued: number;
    completed: number;
    cancelled: number;
    performance: PerformanceGrade;
  } {
    return {
      registered: this.registeredAnimations.size,
      active: this.activeAnimations.size,
      queued: this.queuedAnimations.length,
      completed: this.animationHistory.filter(h => h.completed).length,
      cancelled: this.animationHistory.filter(h => !h.completed).length,
      performance: this.getPerformanceGrade(),
    };
  }
  
  /**
   * Update budget configuration
   */
  updateBudget(newBudget: Partial<PerformanceBudget>): void {
    this.budget = { ...this.budget, ...newBudget };
    this.calculateBudgetAllocation();
    console.log('Performance budget updated:', this.budget);
  }
  
  /**
   * Subscribe to performance alerts
   */
  onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertListeners.push(callback);
    
    return () => {
      const index = this.alertListeners.indexOf(callback);
      if (index > -1) {
        this.alertListeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Check if emergency mode is active
   */
  isEmergencyMode(): boolean {
    return this.emergencyMode;
  }
  
  /**
   * Get device information
   */
  getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }
  
  /**
   * Force budget recalculation
   */
  recalculateBudget(): void {
    this.adaptBudgetToDevice();
  }
  
  /**
   * Clear animation history
   */
  clearHistory(): void {
    this.animationHistory = [];
    this.alerts = [];
  }
  
  /**
   * Destroy budget manager
   */
  destroy(): void {
    this.stopMonitoring();
    this.registeredAnimations.clear();
    this.activeAnimations.clear();
    this.queuedAnimations = [];
    this.alertListeners = [];
    this.clearHistory();
  }
}

/**
 * Global performance budget manager instance
 */
export const globalPerformanceBudgetManager = PerformanceBudgetManager.getInstance();

/**
 * React hook for performance budget management
 */
export const usePerformanceBudgetManager = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [budget, setBudget] = useState<PerformanceBudget | null>(null);
  const [performanceGrade, setPerformanceGrade] = useState<PerformanceGrade>('good');
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const managerRef = useRef<PerformanceBudgetManager>(globalPerformanceBudgetManager);
  
  useEffect(() => {
    const manager = managerRef.current;
    
    // Start monitoring
    manager.startMonitoring();
    
    // Subscribe to alerts
    const unsubscribeAlerts = manager.onAlert((alert) => {
      setAlerts(prev => [...prev.slice(-9), alert]);
    });
    
    // Update state periodically
    const interval = setInterval(() => {
      setMetrics(manager.getMetrics());
      setBudget(manager.getBudget());
      setPerformanceGrade(manager.getPerformanceGrade());
      setEmergencyMode(manager.isEmergencyMode());
    }, 1000);
    
    // Initial state
    setMetrics(manager.getMetrics());
    setBudget(manager.getBudget());
    setPerformanceGrade(manager.getPerformanceGrade());
    setEmergencyMode(manager.isEmergencyMode());
    
    return () => {
      manager.stopMonitoring();
      unsubscribeAlerts();
      clearInterval(interval);
    };
  }, []);
  
  const registerAnimation = useCallback((animation: AnimationRegistration) => {
    managerRef.current.registerAnimation(animation);
  }, []);
  
  const requestAnimation = useCallback((animationId: string) => {
    return managerRef.current.requestAnimation(animationId);
  }, []);
  
  const cancelAnimation = useCallback((animationId: string) => {
    managerRef.current.cancelAnimation(animationId);
  }, []);
  
  const completeAnimation = useCallback((animationId: string) => {
    managerRef.current.completeAnimation(animationId);
  }, []);
  
  const updateBudget = useCallback((newBudget: Partial<PerformanceBudget>) => {
    managerRef.current.updateBudget(newBudget);
  }, []);
  
  const getAnimationStatistics = useCallback(() => {
    return managerRef.current.getAnimationStatistics();
  }, []);
  
  return {
    metrics,
    budget,
    performanceGrade,
    alerts,
    emergencyMode,
    registerAnimation,
    requestAnimation,
    cancelAnimation,
    completeAnimation,
    updateBudget,
    getAnimationStatistics,
    manager: managerRef.current,
  };
};

/**
 * Export performance budget management system
 */
export const performanceBudgetManagement = {
  manager: PerformanceBudgetManager,
  hook: usePerformanceBudgetManager,
  global: globalPerformanceBudgetManager,
  types: {
    PerformanceBudget,
    PerformanceMetrics,
    PerformanceGrade,
    AnimationPriority,
    PerformanceAlert,
    AnimationRegistration,
    BudgetAllocation,
  },
} as const; 