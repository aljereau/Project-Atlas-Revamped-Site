/**
 * Mobile Device Detection & Adaptation System
 * Task 4.4.1 - Mobile Device Detection & Adaptation
 * Intelligent device detection and adaptive animation configurations for mobile optimization
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Device Type Classification
 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'tv' | 'watch' | 'unknown';

/**
 * Device Performance Tier
 */
export type PerformanceTier = 'high' | 'medium' | 'low' | 'minimal';

/**
 * Mobile Platform Detection
 */
export type MobilePlatform = 'ios' | 'android' | 'windows' | 'unknown';

/**
 * Device Capabilities
 */
export interface DeviceCapabilities {
  touchSupport: boolean;
  multiTouchSupport: boolean;
  hoverSupport: boolean;
  orientationSupport: boolean;
  motionSupport: boolean;
  vibrationSupport: boolean;
  networkSupport: 'wifi' | '4g' | '3g' | '2g' | 'unknown';
  batterySupport: boolean;
  memoryLevel: 'high' | 'medium' | 'low';
  cpuCores: number;
  gpuAcceleration: boolean;
}

/**
 * Device Information
 */
export interface DeviceInfo {
  type: DeviceType;
  platform: MobilePlatform;
  performanceTier: PerformanceTier;
  capabilities: DeviceCapabilities;
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
    orientation: 'portrait' | 'landscape';
  };
  features: {
    reduceMotion: boolean;
    highContrast: boolean;
    darkMode: boolean;
    forcedColors: boolean;
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  performance: {
    memory: number;
    cpuClass: number;
    hardwareConcurrency: number;
  };
}

/**
 * Animation Configuration Based on Device
 */
export interface AdaptiveAnimationConfig {
  enableComplexAnimations: boolean;
  enableParallax: boolean;
  enableBlur: boolean;
  enableShadows: boolean;
  enableTransforms3D: boolean;
  frameRateTarget: number;
  animationDuration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easingProfile: 'smooth' | 'snappy' | 'minimal';
  interactionDebounce: number;
  gestureThresholds: {
    swipeDistance: number;
    swipeVelocity: number;
    tapTimeout: number;
    longPressTimeout: number;
  };
}

/**
 * Mobile Device Detection Class
 */
export class MobileDeviceDetector {
  private static instance: MobileDeviceDetector;
  private deviceInfo: DeviceInfo | null = null;
  private listeners: ((deviceInfo: DeviceInfo) => void)[] = [];
  private networkInfo: NetworkInformation | null = null;
  private batteryManager: BatteryManager | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeDetection();
    }
  }
  
  static getInstance(): MobileDeviceDetector {
    if (!MobileDeviceDetector.instance) {
      MobileDeviceDetector.instance = new MobileDeviceDetector();
    }
    return MobileDeviceDetector.instance;
  }
  
  /**
   * Initialize device detection
   */
  private async initializeDetection(): Promise<void> {
    try {
      // Detect basic device information
      const deviceType = this.detectDeviceType();
      const platform = this.detectMobilePlatform();
      const capabilities = await this.detectDeviceCapabilities();
      const viewport = this.getViewportInfo();
      const features = this.detectAccessibilityFeatures();
      const network = await this.detectNetworkInfo();
      const performance = this.detectPerformanceInfo();
      
      // Determine performance tier
      const performanceTier = this.calculatePerformanceTier(capabilities, performance, deviceType);
      
      this.deviceInfo = {
        type: deviceType,
        platform,
        performanceTier,
        capabilities,
        viewport,
        features,
        network,
        performance,
      };
      
      // Setup dynamic monitoring
      this.setupDynamicMonitoring();
      
      // Notify listeners
      this.notifyListeners();
      
      console.log('Device detection initialized:', this.deviceInfo);
      
    } catch (error) {
      console.error('Failed to initialize device detection:', error);
      this.deviceInfo = this.getFallbackDeviceInfo();
    }
  }
  
  /**
   * Detect device type based on user agent and screen size
   */
  private detectDeviceType(): DeviceType {
    const userAgent = navigator.userAgent.toLowerCase();
    const { innerWidth, innerHeight } = window;
    const minDimension = Math.min(innerWidth, innerHeight);
    const maxDimension = Math.max(innerWidth, innerHeight);
    
    // TV detection
    if (userAgent.includes('tv') || userAgent.includes('smart-tv') || 
        (maxDimension > 1920 && window.devicePixelRatio <= 1)) {
      return 'tv';
    }
    
    // Watch detection
    if (userAgent.includes('watch') || maxDimension < 300) {
      return 'watch';
    }
    
    // Mobile detection
    if (userAgent.includes('mobile') || 
        userAgent.includes('iphone') || 
        userAgent.includes('ipod') ||
        minDimension < 768) {
      return 'mobile';
    }
    
    // Tablet detection
    if (userAgent.includes('tablet') || 
        userAgent.includes('ipad') ||
        (minDimension >= 768 && minDimension < 1024)) {
      return 'tablet';
    }
    
    // Desktop
    if (minDimension >= 1024) {
      return 'desktop';
    }
    
    return 'unknown';
  }
  
  /**
   * Detect mobile platform
   */
  private detectMobilePlatform(): MobilePlatform {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('iphone') || 
        userAgent.includes('ipad') || 
        userAgent.includes('ipod') ||
        userAgent.includes('mac os')) {
      return 'ios';
    }
    
    if (userAgent.includes('android')) {
      return 'android';
    }
    
    if (userAgent.includes('windows phone') || 
        userAgent.includes('windows mobile')) {
      return 'windows';
    }
    
    return 'unknown';
  }
  
  /**
   * Detect device capabilities
   */
  private async detectDeviceCapabilities(): Promise<DeviceCapabilities> {
    const capabilities: DeviceCapabilities = {
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      multiTouchSupport: navigator.maxTouchPoints > 1,
      hoverSupport: window.matchMedia('(hover: hover)').matches,
      orientationSupport: 'orientation' in window,
      motionSupport: 'DeviceMotionEvent' in window,
      vibrationSupport: 'vibrate' in navigator,
      networkSupport: 'unknown',
      batterySupport: 'getBattery' in navigator,
      memoryLevel: 'medium',
      cpuCores: navigator.hardwareConcurrency || 4,
      gpuAcceleration: this.detectGPUAcceleration(),
    };
    
    // Network capability detection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      capabilities.networkSupport = this.classifyNetworkType(connection.effectiveType);
    }
    
    // Memory level detection
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      capabilities.memoryLevel = this.classifyMemoryLevel(memory.totalJSHeapSize);
    }
    
    return capabilities;
  }
  
  /**
   * Detect GPU acceleration support
   */
  private detectGPUAcceleration(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }
  
  /**
   * Classify network type
   */
  private classifyNetworkType(effectiveType: string): 'wifi' | '4g' | '3g' | '2g' | 'unknown' {
    switch (effectiveType) {
      case '4g':
        return '4g';
      case '3g':
        return '3g';
      case '2g':
        return '2g';
      case 'slow-2g':
        return '2g';
      default:
        return 'unknown';
    }
  }
  
  /**
   * Classify memory level
   */
  private classifyMemoryLevel(totalMemory: number): 'high' | 'medium' | 'low' {
    const memoryGB = totalMemory / (1024 * 1024 * 1024);
    
    if (memoryGB >= 8) return 'high';
    if (memoryGB >= 4) return 'medium';
    return 'low';
  }
  
  /**
   * Get viewport information
   */
  private getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' as const : 'portrait' as const,
    };
  }
  
  /**
   * Detect accessibility features
   */
  private detectAccessibilityFeatures() {
    return {
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      forcedColors: window.matchMedia('(forced-colors: active)').matches,
    };
  }
  
  /**
   * Detect network information
   */
  private async detectNetworkInfo() {
    const defaultNetwork = {
      effectiveType: 'unknown',
      downlink: 10,
      rtt: 50,
      saveData: false,
    };
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 50,
        saveData: connection.saveData || false,
      };
    }
    
    return defaultNetwork;
  }
  
  /**
   * Detect performance information
   */
  private detectPerformanceInfo() {
    const defaultPerformance = {
      memory: 4 * 1024 * 1024 * 1024, // 4GB default
      cpuClass: 2,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
    };
    
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        memory: memory.totalJSHeapSize || defaultPerformance.memory,
        cpuClass: this.estimateCPUClass(),
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
      };
    }
    
    return defaultPerformance;
  }
  
  /**
   * Estimate CPU class based on benchmarks
   */
  private estimateCPUClass(): number {
    // Simple benchmark to estimate CPU performance
    const start = performance.now();
    let iterations = 0;
    const timeLimit = 10; // 10ms benchmark
    
    while (performance.now() - start < timeLimit) {
      Math.random() * Math.random();
      iterations++;
    }
    
    // Classify based on iterations per millisecond
    const iterationsPerMs = iterations / timeLimit;
    
    if (iterationsPerMs > 50000) return 4; // High-end
    if (iterationsPerMs > 25000) return 3; // Mid-high
    if (iterationsPerMs > 10000) return 2; // Mid-range
    return 1; // Low-end
  }
  
  /**
   * Calculate performance tier
   */
  private calculatePerformanceTier(
    capabilities: DeviceCapabilities,
    performance: any,
    deviceType: DeviceType
  ): PerformanceTier {
    let score = 0;
    
    // Device type scoring
    switch (deviceType) {
      case 'desktop':
        score += 40;
        break;
      case 'tablet':
        score += 25;
        break;
      case 'mobile':
        score += 15;
        break;
      default:
        score += 10;
    }
    
    // Memory scoring
    switch (capabilities.memoryLevel) {
      case 'high':
        score += 30;
        break;
      case 'medium':
        score += 20;
        break;
      case 'low':
        score += 10;
        break;
    }
    
    // CPU scoring
    score += Math.min(capabilities.cpuCores * 5, 20);
    
    // GPU acceleration
    if (capabilities.gpuAcceleration) {
      score += 10;
    }
    
    // Network scoring
    switch (capabilities.networkSupport) {
      case 'wifi':
      case '4g':
        score += 10;
        break;
      case '3g':
        score += 5;
        break;
      default:
        score += 0;
    }
    
    // Classify performance tier
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    if (score >= 40) return 'low';
    return 'minimal';
  }
  
  /**
   * Setup dynamic monitoring for device changes
   */
  private setupDynamicMonitoring(): void {
    // Monitor viewport changes
    window.addEventListener('resize', this.handleViewportChange.bind(this));
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // Monitor network changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', this.handleNetworkChange.bind(this));
    }
    
    // Monitor battery changes
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.batteryManager = battery;
        battery.addEventListener('levelchange', this.handleBatteryChange.bind(this));
        battery.addEventListener('chargingchange', this.handleBatteryChange.bind(this));
      });
    }
    
    // Monitor accessibility preference changes
    const mediaQueries = [
      { query: '(prefers-reduced-motion: reduce)', feature: 'reduceMotion' },
      { query: '(prefers-contrast: high)', feature: 'highContrast' },
      { query: '(prefers-color-scheme: dark)', feature: 'darkMode' },
      { query: '(forced-colors: active)', feature: 'forcedColors' },
    ];
    
    mediaQueries.forEach(({ query, feature }) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', () => this.handleAccessibilityChange(feature));
    });
  }
  
  /**
   * Handle viewport changes
   */
  private handleViewportChange(): void {
    if (!this.deviceInfo) return;
    
    const newViewport = this.getViewportInfo();
    this.deviceInfo.viewport = newViewport;
    
    // Re-classify device type if dimensions change significantly
    const newDeviceType = this.detectDeviceType();
    if (newDeviceType !== this.deviceInfo.type) {
      this.deviceInfo.type = newDeviceType;
      this.deviceInfo.performanceTier = this.calculatePerformanceTier(
        this.deviceInfo.capabilities,
        this.deviceInfo.performance,
        newDeviceType
      );
    }
    
    this.notifyListeners();
  }
  
  /**
   * Handle orientation changes
   */
  private handleOrientationChange(): void {
    setTimeout(() => {
      this.handleViewportChange();
    }, 100); // Delay to ensure dimensions are updated
  }
  
  /**
   * Handle network changes
   */
  private handleNetworkChange(): void {
    if (!this.deviceInfo || !('connection' in navigator)) return;
    
    const connection = (navigator as any).connection;
    this.deviceInfo.network = {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 10,
      rtt: connection.rtt || 50,
      saveData: connection.saveData || false,
    };
    
    // Update network capability classification
    this.deviceInfo.capabilities.networkSupport = this.classifyNetworkType(connection.effectiveType);
    
    this.notifyListeners();
  }
  
  /**
   * Handle battery changes
   */
  private handleBatteryChange(): void {
    // Battery changes can affect performance recommendations
    this.notifyListeners();
  }
  
  /**
   * Handle accessibility preference changes
   */
  private handleAccessibilityChange(feature: string): void {
    if (!this.deviceInfo) return;
    
    const newFeatures = this.detectAccessibilityFeatures();
    this.deviceInfo.features = newFeatures;
    
    this.notifyListeners();
  }
  
  /**
   * Get fallback device info
   */
  private getFallbackDeviceInfo(): DeviceInfo {
    return {
      type: 'unknown',
      platform: 'unknown',
      performanceTier: 'medium',
      capabilities: {
        touchSupport: 'ontouchstart' in window,
        multiTouchSupport: false,
        hoverSupport: true,
        orientationSupport: false,
        motionSupport: false,
        vibrationSupport: false,
        networkSupport: 'unknown',
        batterySupport: false,
        memoryLevel: 'medium',
        cpuCores: 4,
        gpuAcceleration: false,
      },
      viewport: {
        width: window.innerWidth || 1920,
        height: window.innerHeight || 1080,
        devicePixelRatio: 1,
        orientation: 'landscape',
      },
      features: {
        reduceMotion: false,
        highContrast: false,
        darkMode: false,
        forcedColors: false,
      },
      network: {
        effectiveType: 'unknown',
        downlink: 10,
        rtt: 50,
        saveData: false,
      },
      performance: {
        memory: 4 * 1024 * 1024 * 1024,
        cpuClass: 2,
        hardwareConcurrency: 4,
      },
    };
  }
  
  /**
   * Get adaptive animation configuration
   */
  getAdaptiveAnimationConfig(): AdaptiveAnimationConfig {
    if (!this.deviceInfo) {
      return this.getDefaultAnimationConfig();
    }
    
    const { performanceTier, capabilities, features, type } = this.deviceInfo;
    
    // Base configuration by performance tier
    const configs: Record<PerformanceTier, AdaptiveAnimationConfig> = {
      high: {
        enableComplexAnimations: true,
        enableParallax: true,
        enableBlur: true,
        enableShadows: true,
        enableTransforms3D: true,
        frameRateTarget: 60,
        animationDuration: { fast: 150, normal: 300, slow: 500 },
        easingProfile: 'smooth',
        interactionDebounce: 0,
        gestureThresholds: {
          swipeDistance: 50,
          swipeVelocity: 0.5,
          tapTimeout: 300,
          longPressTimeout: 500,
        },
      },
      medium: {
        enableComplexAnimations: true,
        enableParallax: true,
        enableBlur: capabilities.gpuAcceleration,
        enableShadows: true,
        enableTransforms3D: capabilities.gpuAcceleration,
        frameRateTarget: 60,
        animationDuration: { fast: 200, normal: 400, slow: 600 },
        easingProfile: 'smooth',
        interactionDebounce: 16,
        gestureThresholds: {
          swipeDistance: 60,
          swipeVelocity: 0.4,
          tapTimeout: 350,
          longPressTimeout: 600,
        },
      },
      low: {
        enableComplexAnimations: false,
        enableParallax: false,
        enableBlur: false,
        enableShadows: false,
        enableTransforms3D: false,
        frameRateTarget: 45,
        animationDuration: { fast: 250, normal: 500, slow: 750 },
        easingProfile: 'snappy',
        interactionDebounce: 32,
        gestureThresholds: {
          swipeDistance: 80,
          swipeVelocity: 0.3,
          tapTimeout: 400,
          longPressTimeout: 800,
        },
      },
      minimal: {
        enableComplexAnimations: false,
        enableParallax: false,
        enableBlur: false,
        enableShadows: false,
        enableTransforms3D: false,
        frameRateTarget: 30,
        animationDuration: { fast: 100, normal: 200, slow: 300 },
        easingProfile: 'minimal',
        interactionDebounce: 50,
        gestureThresholds: {
          swipeDistance: 100,
          swipeVelocity: 0.2,
          tapTimeout: 500,
          longPressTimeout: 1000,
        },
      },
    };
    
    let config = configs[performanceTier];
    
    // Apply accessibility overrides
    if (features.reduceMotion) {
      config = {
        ...config,
        enableComplexAnimations: false,
        enableParallax: false,
        animationDuration: {
          fast: Math.min(config.animationDuration.fast, 100),
          normal: Math.min(config.animationDuration.normal, 200),
          slow: Math.min(config.animationDuration.slow, 300),
        },
        easingProfile: 'minimal',
      };
    }
    
    // Apply mobile-specific adjustments
    if (type === 'mobile') {
      config.gestureThresholds.swipeDistance *= 1.2;
      config.gestureThresholds.tapTimeout += 50;
      config.interactionDebounce = Math.max(config.interactionDebounce, 16);
    }
    
    return config;
  }
  
  /**
   * Get default animation configuration
   */
  private getDefaultAnimationConfig(): AdaptiveAnimationConfig {
    return {
      enableComplexAnimations: true,
      enableParallax: true,
      enableBlur: true,
      enableShadows: true,
      enableTransforms3D: true,
      frameRateTarget: 60,
      animationDuration: { fast: 200, normal: 400, slow: 600 },
      easingProfile: 'smooth',
      interactionDebounce: 16,
      gestureThresholds: {
        swipeDistance: 60,
        swipeVelocity: 0.4,
        tapTimeout: 300,
        longPressTimeout: 500,
      },
    };
  }
  
  /**
   * Get current device information
   */
  getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }
  
  /**
   * Check if device is mobile
   */
  isMobile(): boolean {
    return this.deviceInfo?.type === 'mobile' || false;
  }
  
  /**
   * Check if device is tablet
   */
  isTablet(): boolean {
    return this.deviceInfo?.type === 'tablet' || false;
  }
  
  /**
   * Check if device is desktop
   */
  isDesktop(): boolean {
    return this.deviceInfo?.type === 'desktop' || false;
  }
  
  /**
   * Check if device supports touch
   */
  supportsTouch(): boolean {
    return this.deviceInfo?.capabilities.touchSupport || false;
  }
  
  /**
   * Check if reduced motion is preferred
   */
  prefersReducedMotion(): boolean {
    return this.deviceInfo?.features.reduceMotion || false;
  }
  
  /**
   * Get battery level (if available)
   */
  getBatteryLevel(): number | null {
    return this.batteryManager?.level || null;
  }
  
  /**
   * Check if device is charging
   */
  isCharging(): boolean {
    return this.batteryManager?.charging || false;
  }
  
  /**
   * Subscribe to device changes
   */
  subscribe(callback: (deviceInfo: DeviceInfo) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current info if available
    if (this.deviceInfo) {
      callback(this.deviceInfo);
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    if (this.deviceInfo) {
      this.listeners.forEach(listener => listener(this.deviceInfo!));
    }
  }
  
  /**
   * Force re-detection
   */
  async refresh(): Promise<void> {
    await this.initializeDetection();
  }
  
  /**
   * Cleanup resources
   */
  destroy(): void {
    // Remove event listeners
    window.removeEventListener('resize', this.handleViewportChange.bind(this));
    window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    if ('connection' in navigator) {
      (navigator as any).connection.removeEventListener('change', this.handleNetworkChange.bind(this));
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.listeners = [];
  }
}

/**
 * Global device detector instance
 */
export const globalMobileDeviceDetector = MobileDeviceDetector.getInstance();

/**
 * React hook for device detection
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [animationConfig, setAnimationConfig] = useState<AdaptiveAnimationConfig | null>(null);
  const detectorRef = useRef<MobileDeviceDetector>(globalMobileDeviceDetector);
  
  useEffect(() => {
    const detector = detectorRef.current;
    
    // Subscribe to device changes
    const unsubscribe = detector.subscribe((info) => {
      setDeviceInfo(info);
      setAnimationConfig(detector.getAdaptiveAnimationConfig());
    });
    
    // Get initial info
    const initialInfo = detector.getDeviceInfo();
    if (initialInfo) {
      setDeviceInfo(initialInfo);
      setAnimationConfig(detector.getAdaptiveAnimationConfig());
    }
    
    return unsubscribe;
  }, []);
  
  // Convenient helper functions
  const isMobile = useCallback(() => detectorRef.current.isMobile(), []);
  const isTablet = useCallback(() => detectorRef.current.isTablet(), []);
  const isDesktop = useCallback(() => detectorRef.current.isDesktop(), []);
  const supportsTouch = useCallback(() => detectorRef.current.supportsTouch(), []);
  const prefersReducedMotion = useCallback(() => detectorRef.current.prefersReducedMotion(), []);
  const getBatteryLevel = useCallback(() => detectorRef.current.getBatteryLevel(), []);
  const isCharging = useCallback(() => detectorRef.current.isCharging(), []);
  const refresh = useCallback(() => detectorRef.current.refresh(), []);
  
  return {
    deviceInfo,
    animationConfig,
    isMobile,
    isTablet,
    isDesktop,
    supportsTouch,
    prefersReducedMotion,
    getBatteryLevel,
    isCharging,
    refresh,
    detector: detectorRef.current,
  };
};

/**
 * Export device detection system
 */
export const mobileDeviceDetection = {
  detector: MobileDeviceDetector,
  hook: useDeviceDetection,
  global: globalMobileDeviceDetector,
} as const; 