'use client';

import { useState, useEffect } from 'react';

/**
 * Progressive Enhancement System - Task 4.4.5
 * 
 * Intelligent progressive enhancement system for animation features, providing
 * graceful degradation, feature detection, and adaptive capabilities based on
 * device limitations and user preferences.
 * 
 * Features:
 * - Comprehensive feature detection for animation capabilities
 * - Graceful degradation with fallback animation strategies
 * - User preference detection and respect (reduced motion, high contrast)
 * - Network-aware enhancement loading with connection quality detection
 * - Progressive loading of animation features based on device capabilities
 * - Accessibility-first approach with enhancement layers
 * - Performance-based feature scaling and automatic optimization
 * - User choice preservation with preferences persistence
 */

// Feature Detection Types
export interface FeatureSupport {
  transforms3D: boolean;
  transforms2D: boolean;
  transitions: boolean;
  animations: boolean;
  willChange: boolean;
  gpuAcceleration: boolean;
  webGL: boolean;
  canvas: boolean;
  requestAnimationFrame: boolean;
  performanceAPI: boolean;
  intersectionObserver: boolean;
  mutationObserver: boolean;
  passiveEventListeners: boolean;
  touchEvents: boolean;
  pointerEvents: boolean;
  devicePixelRatio: number;
  reducedMotion: boolean;
  highContrast: boolean;
  forcedColors: boolean;
}

// Enhancement Levels
export type EnhancementLevel = 'minimal' | 'basic' | 'standard' | 'enhanced' | 'maximum';

export interface EnhancementProfile {
  level: EnhancementLevel;
  description: string;
  features: {
    basicAnimations: boolean;
    transformAnimations: boolean;
    complexTransitions: boolean;
    parallaxEffects: boolean;
    particleEffects: boolean;
    threeDTransforms: boolean;
    advancedEasing: boolean;
    gestureRecognition: boolean;
    hapticFeedback: boolean;
    audioFeedback: boolean;
  };
  performance: {
    maxConcurrentAnimations: number;
    frameRateTarget: number;
    memoryBudget: number; // MB
    enableGPUAcceleration: boolean;
  };
  accessibility: {
    respectReducedMotion: boolean;
    provideFallbacks: boolean;
    enhanceContrast: boolean;
    addSkipOptions: boolean;
  };
}

// User Preferences
export interface UserPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  preferredEnhancementLevel: EnhancementLevel;
  enableAnimations: boolean;
  enableParallax: boolean;
  enableHaptics: boolean;
  enableAudio: boolean;
  customAnimationSpeed: number; // multiplier
  lastUpdated: number;
}

// Network Awareness
export interface NetworkCapabilities {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number; // Mbps
  rtt: number; // round trip time in ms
  saveData: boolean;
  isOnline: boolean;
  estimatedBandwidth: number;
  connectionQuality: 'poor' | 'fair' | 'good' | 'excellent';
}

// Progressive Loading
export interface EnhancementModule {
  name: string;
  level: EnhancementLevel;
  priority: 'critical' | 'high' | 'medium' | 'low';
  size: number; // estimated KB
  dependencies: string[];
  loader: () => Promise<any>;
  fallback?: () => any;
  isLoaded: boolean;
  loadTime?: number;
}

// Fallback Strategies
export interface FallbackStrategy {
  name: string;
  description: string;
  conditions: (features: FeatureSupport, preferences: UserPreferences) => boolean;
  apply: (element: HTMLElement) => void;
  cleanup?: (element: HTMLElement) => void;
}

// Main Progressive Enhancement System
export class ProgressiveEnhancementSystem {
  private featureSupport: FeatureSupport;
  private userPreferences: UserPreferences;
  private networkCapabilities: NetworkCapabilities;
  private enhancementProfiles: EnhancementProfile[];
  private currentProfile: EnhancementProfile;
  private enhancementModules: Map<string, EnhancementModule> = new Map();
  private fallbackStrategies: Map<string, FallbackStrategy> = new Map();
  private loadedFeatures: Set<string> = new Set();
  
  private preferenceMonitorInterval: number | null = null;
  private networkMonitorInterval: number | null = null;
  private isInitialized: boolean = false;
  
  private subscribers: Set<(profile: EnhancementProfile, features: FeatureSupport) => void> = new Set();

  constructor() {
    this.featureSupport = this.detectFeatures();
    this.userPreferences = this.loadUserPreferences();
    this.networkCapabilities = this.detectNetworkCapabilities();
    this.enhancementProfiles = this.createEnhancementProfiles();
    this.currentProfile = this.selectOptimalProfile();
    
    this.setupFallbackStrategies();
    this.setupEnhancementModules();
    this.startMonitoring();
    this.initialize();
  }

  // Feature Detection
  private detectFeatures(): FeatureSupport {
    const testElement = document.createElement('div');
    const style = testElement.style;
    const body = document.body;
    
    // CSS Feature Detection
    const supports = (property: string, value: string) => {
      return CSS.supports && CSS.supports(property, value);
    };

    // 3D Transform Detection
    const transforms3D = supports('transform', 'translateZ(0)') || 
      ('WebkitPerspective' in style) || 
      ('MozPerspective' in style) ||
      ('perspective' in style);

    // 2D Transform Detection
    const transforms2D = supports('transform', 'translateX(0)') ||
      ('WebkitTransform' in style) ||
      ('MozTransform' in style) ||
      ('transform' in style);

    // GPU Acceleration Detection
    let gpuAcceleration = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      gpuAcceleration = !!gl;
    } catch (e) {
      gpuAcceleration = false;
    }

    // Device Pixel Ratio
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Media Query Detection
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const forcedColors = window.matchMedia('(forced-colors: active)').matches;

    // Passive event listener support detection
    const passiveSupported = (() => {
      let passiveSupported = false;
      try {
        const options = {
          get passive() {
            passiveSupported = true;
            return false;
          }
        };
        // Use a dummy event name to test passive support
        const testFn = () => {};
        window.addEventListener('testpassive', testFn, options as any);
        window.removeEventListener('testpassive', testFn, options as any);
      } catch (err) {
        passiveSupported = false;
      }
      return passiveSupported;
    })();

    return {
      transforms3D,
      transforms2D,
      transitions: supports('transition', 'opacity 1s ease'),
      animations: supports('animation', 'none'),
      willChange: supports('will-change', 'transform'),
      gpuAcceleration,
      webGL: gpuAcceleration,
      canvas: !!document.createElement('canvas').getContext,
      requestAnimationFrame: 'requestAnimationFrame' in window,
      performanceAPI: 'performance' in window,
      intersectionObserver: 'IntersectionObserver' in window,
      mutationObserver: 'MutationObserver' in window,
      passiveEventListeners: passiveSupported,
      touchEvents: 'ontouchstart' in window,
      pointerEvents: 'onpointerdown' in window,
      devicePixelRatio,
      reducedMotion,
      highContrast,
      forcedColors
    };
  }

  // User Preferences Management
  private loadUserPreferences(): UserPreferences {
    const defaultPreferences: UserPreferences = {
      reducedMotion: this.featureSupport.reducedMotion,
      highContrast: this.featureSupport.highContrast,
      preferredEnhancementLevel: 'standard',
      enableAnimations: !this.featureSupport.reducedMotion,
      enableParallax: !this.featureSupport.reducedMotion,
      enableHaptics: true,
      enableAudio: false,
      customAnimationSpeed: 1.0,
      lastUpdated: Date.now()
    };

    try {
      const stored = localStorage.getItem('atlasAnimationPreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultPreferences, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }

    return defaultPreferences;
  }

  private saveUserPreferences(): void {
    try {
      localStorage.setItem('atlasAnimationPreferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }

  // Network Capabilities Detection
  private detectNetworkCapabilities(): NetworkCapabilities {
    const navigator = window.navigator as any;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    let capabilities: NetworkCapabilities = {
      effectiveType: '4g',
      downlink: 10,
      rtt: 100,
      saveData: false,
      isOnline: navigator.onLine || true,
      estimatedBandwidth: 10,
      connectionQuality: 'good'
    };

    if (connection) {
      capabilities = {
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false,
        isOnline: navigator.onLine || true,
        estimatedBandwidth: connection.downlink || 10,
        connectionQuality: this.classifyConnectionQuality(connection.effectiveType, connection.downlink)
      };
    }

    return capabilities;
  }

  private classifyConnectionQuality(effectiveType: string, downlink: number): NetworkCapabilities['connectionQuality'] {
    if (effectiveType === 'slow-2g' || downlink < 0.5) return 'poor';
    if (effectiveType === '2g' || downlink < 1.5) return 'fair';
    if (effectiveType === '3g' || downlink < 5) return 'good';
    return 'excellent';
  }

  // Enhancement Profiles
  private createEnhancementProfiles(): EnhancementProfile[] {
    return [
      {
        level: 'minimal',
        description: 'Essential animations only, maximum compatibility',
        features: {
          basicAnimations: true,
          transformAnimations: false,
          complexTransitions: false,
          parallaxEffects: false,
          particleEffects: false,
          threeDTransforms: false,
          advancedEasing: false,
          gestureRecognition: false,
          hapticFeedback: false,
          audioFeedback: false
        },
        performance: {
          maxConcurrentAnimations: 3,
          frameRateTarget: 30,
          memoryBudget: 25,
          enableGPUAcceleration: false
        },
        accessibility: {
          respectReducedMotion: true,
          provideFallbacks: true,
          enhanceContrast: true,
          addSkipOptions: true
        }
      },
      {
        level: 'basic',
        description: 'Simple animations with careful resource usage',
        features: {
          basicAnimations: true,
          transformAnimations: true,
          complexTransitions: false,
          parallaxEffects: false,
          particleEffects: false,
          threeDTransforms: false,
          advancedEasing: true,
          gestureRecognition: false,
          hapticFeedback: false,
          audioFeedback: false
        },
        performance: {
          maxConcurrentAnimations: 5,
          frameRateTarget: 45,
          memoryBudget: 50,
          enableGPUAcceleration: true
        },
        accessibility: {
          respectReducedMotion: true,
          provideFallbacks: true,
          enhanceContrast: false,
          addSkipOptions: true
        }
      },
      {
        level: 'standard',
        description: 'Balanced animations with good performance',
        features: {
          basicAnimations: true,
          transformAnimations: true,
          complexTransitions: true,
          parallaxEffects: true,
          particleEffects: false,
          threeDTransforms: true,
          advancedEasing: true,
          gestureRecognition: true,
          hapticFeedback: false,
          audioFeedback: false
        },
        performance: {
          maxConcurrentAnimations: 8,
          frameRateTarget: 60,
          memoryBudget: 75,
          enableGPUAcceleration: true
        },
        accessibility: {
          respectReducedMotion: true,
          provideFallbacks: true,
          enhanceContrast: false,
          addSkipOptions: false
        }
      },
      {
        level: 'enhanced',
        description: 'Rich animations with advanced features',
        features: {
          basicAnimations: true,
          transformAnimations: true,
          complexTransitions: true,
          parallaxEffects: true,
          particleEffects: true,
          threeDTransforms: true,
          advancedEasing: true,
          gestureRecognition: true,
          hapticFeedback: true,
          audioFeedback: false
        },
        performance: {
          maxConcurrentAnimations: 12,
          frameRateTarget: 60,
          memoryBudget: 100,
          enableGPUAcceleration: true
        },
        accessibility: {
          respectReducedMotion: true,
          provideFallbacks: false,
          enhanceContrast: false,
          addSkipOptions: false
        }
      },
      {
        level: 'maximum',
        description: 'All features enabled, high-end devices only',
        features: {
          basicAnimations: true,
          transformAnimations: true,
          complexTransitions: true,
          parallaxEffects: true,
          particleEffects: true,
          threeDTransforms: true,
          advancedEasing: true,
          gestureRecognition: true,
          hapticFeedback: true,
          audioFeedback: true
        },
        performance: {
          maxConcurrentAnimations: 20,
          frameRateTarget: 60,
          memoryBudget: 150,
          enableGPUAcceleration: true
        },
        accessibility: {
          respectReducedMotion: true,
          provideFallbacks: false,
          enhanceContrast: false,
          addSkipOptions: false
        }
      }
    ];
  }

  // Profile Selection Logic
  private selectOptimalProfile(): EnhancementProfile {
    // Check user preference first
    if (this.userPreferences.preferredEnhancementLevel !== 'standard') {
      const preferredProfile = this.enhancementProfiles.find(p => p.level === this.userPreferences.preferredEnhancementLevel);
      if (preferredProfile && this.isProfileSupported(preferredProfile)) {
        return preferredProfile;
      }
    }

    // Reduced motion users get minimal profile
    if (this.userPreferences.reducedMotion || !this.userPreferences.enableAnimations) {
      return this.enhancementProfiles.find(p => p.level === 'minimal')!;
    }

    // Network-based selection
    if (this.networkCapabilities.saveData || this.networkCapabilities.connectionQuality === 'poor') {
      return this.enhancementProfiles.find(p => p.level === 'basic')!;
    }

    // Feature-based selection
    const score = this.calculateDeviceCapabilityScore();
    
    if (score >= 0.9 && this.networkCapabilities.connectionQuality === 'excellent') {
      return this.enhancementProfiles.find(p => p.level === 'maximum')!;
    } else if (score >= 0.7) {
      return this.enhancementProfiles.find(p => p.level === 'enhanced')!;
    } else if (score >= 0.5) {
      return this.enhancementProfiles.find(p => p.level === 'standard')!;
    } else if (score >= 0.3) {
      return this.enhancementProfiles.find(p => p.level === 'basic')!;
    } else {
      return this.enhancementProfiles.find(p => p.level === 'minimal')!;
    }
  }

  private calculateDeviceCapabilityScore(): number {
    let score = 0;
    const features = this.featureSupport;

    // Core animation support (40% of score)
    if (features.transforms3D) score += 0.15;
    if (features.transforms2D) score += 0.10;
    if (features.transitions) score += 0.10;
    if (features.animations) score += 0.05;

    // Performance indicators (30% of score)
    if (features.gpuAcceleration) score += 0.15;
    if (features.requestAnimationFrame) score += 0.05;
    if (features.performanceAPI) score += 0.05;
    if (features.willChange) score += 0.05;

    // Modern API support (20% of score)
    if (features.intersectionObserver) score += 0.05;
    if (features.mutationObserver) score += 0.05;
    if (features.passiveEventListeners) score += 0.05;
    if (features.pointerEvents) score += 0.05;

    // Device quality indicators (10% of score)
    if (features.devicePixelRatio >= 2) score += 0.05;
    if (features.touchEvents) score += 0.025;
    if (features.webGL) score += 0.025;

    return Math.min(1, score);
  }

  private isProfileSupported(profile: EnhancementProfile): boolean {
    const features = this.featureSupport;
    
    // Check minimum requirements for the profile
    if (profile.features.threeDTransforms && !features.transforms3D) return false;
    if (profile.features.transformAnimations && !features.transforms2D) return false;
    if (profile.features.complexTransitions && (!features.transitions || !features.animations)) return false;
    if (profile.features.gestureRecognition && !features.pointerEvents && !features.touchEvents) return false;
    
    return true;
  }

  // Fallback Strategies Setup
  private setupFallbackStrategies(): void {
    // No animation fallback
    this.fallbackStrategies.set('no-animation', {
      name: 'No Animation',
      description: 'Instant state changes without animation',
      conditions: (features, preferences) => preferences.reducedMotion || !preferences.enableAnimations,
      apply: (element) => {
        element.style.transition = 'none';
        element.style.animation = 'none';
      },
      cleanup: (element) => {
        element.style.transition = '';
        element.style.animation = '';
      }
    });

    // Simple fade fallback
    this.fallbackStrategies.set('simple-fade', {
      name: 'Simple Fade',
      description: 'Basic opacity transitions only',
      conditions: (features, preferences) => !features.transforms2D || preferences.reducedMotion,
      apply: (element) => {
        element.style.transition = 'opacity 0.3s ease';
      }
    });

    // Transform fallback to position
    this.fallbackStrategies.set('position-fallback', {
      name: 'Position Fallback',
      description: 'Use position changes instead of transforms',
      conditions: (features, preferences) => !features.transforms2D,
      apply: (element) => {
        element.style.transition = 'left 0.3s ease, top 0.3s ease';
      }
    });

    // High contrast enhancement
    this.fallbackStrategies.set('high-contrast', {
      name: 'High Contrast',
      description: 'Enhanced contrast for accessibility',
      conditions: (features, preferences) => preferences.highContrast || features.forcedColors,
      apply: (element) => {
        element.style.filter = 'contrast(1.5)';
        element.style.borderWidth = '2px';
      }
    });
  }

  // Enhancement Modules Setup
  private setupEnhancementModules(): void {
    // Advanced easing functions
    this.enhancementModules.set('advanced-easing', {
      name: 'Advanced Easing Functions',
      level: 'basic',
      priority: 'medium',
      size: 15,
      dependencies: [],
      loader: () => this.loadAdvancedEasing(),
      fallback: () => this.basicEasingFallback(),
      isLoaded: false
    });

    // 3D transform utilities
    this.enhancementModules.set('3d-transforms', {
      name: '3D Transform Utilities',
      level: 'standard',
      priority: 'medium',
      size: 25,
      dependencies: ['advanced-easing'],
      loader: () => this.load3DTransforms(),
      fallback: () => this.transform2DFallback(),
      isLoaded: false
    });

    // Particle effects
    this.enhancementModules.set('particle-effects', {
      name: 'Particle Effects',
      level: 'enhanced',
      priority: 'low',
      size: 75,
      dependencies: ['3d-transforms', 'advanced-easing'],
      loader: () => this.loadParticleEffects(),
      fallback: () => this.simpleEffectsFallback(),
      isLoaded: false
    });

    // Gesture recognition
    this.enhancementModules.set('gesture-recognition', {
      name: 'Advanced Gesture Recognition',
      level: 'standard',
      priority: 'high',
      size: 40,
      dependencies: [],
      loader: () => this.loadGestureRecognition(),
      fallback: () => this.basicGestureFallback(),
      isLoaded: false
    });

    // Haptic feedback
    this.enhancementModules.set('haptic-feedback', {
      name: 'Haptic Feedback',
      level: 'enhanced',
      priority: 'low',
      size: 10,
      dependencies: [],
      loader: () => this.loadHapticFeedback(),
      fallback: () => this.visualFeedbackFallback(),
      isLoaded: false
    });
  }

  // Module Loaders (stub implementations)
  private async loadAdvancedEasing(): Promise<any> {
    // Simulate loading advanced easing functions
    await new Promise(resolve => setTimeout(resolve, 100));
    return { loaded: true, type: 'advanced-easing' };
  }

  private async load3DTransforms(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return { loaded: true, type: '3d-transforms' };
  }

  private async loadParticleEffects(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { loaded: true, type: 'particle-effects' };
  }

  private async loadGestureRecognition(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { loaded: true, type: 'gesture-recognition' };
  }

  private async loadHapticFeedback(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return { loaded: true, type: 'haptic-feedback' };
  }

  // Fallback Implementations
  private basicEasingFallback() {
    return { type: 'basic-easing', ease: 'ease-in-out' };
  }

  private transform2DFallback() {
    return { type: '2d-fallback', transforms: ['translateX', 'translateY', 'scale'] };
  }

  private simpleEffectsFallback() {
    return { type: 'simple-effects', effects: ['fade', 'slide'] };
  }

  private basicGestureFallback() {
    return { type: 'basic-gestures', gestures: ['click', 'touch'] };
  }

  private visualFeedbackFallback() {
    return { type: 'visual-feedback', methods: ['highlight', 'scale'] };
  }

  // Monitoring
  private startMonitoring(): void {
    // Monitor preference changes
    this.preferenceMonitorInterval = window.setInterval(() => {
      this.checkPreferenceChanges();
    }, 5000);

    // Monitor network changes
    this.networkMonitorInterval = window.setInterval(() => {
      this.updateNetworkCapabilities();
    }, 10000);

    // Listen for media query changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.userPreferences.reducedMotion = e.matches;
      this.reevaluateProfile();
    });

    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.userPreferences.highContrast = e.matches;
      this.reevaluateProfile();
    });

    // Listen for network changes
    window.addEventListener('online', () => this.updateNetworkCapabilities());
    window.addEventListener('offline', () => this.updateNetworkCapabilities());
  }

  private checkPreferenceChanges(): void {
    // Check for changes in system preferences that might affect enhancement level
    const newFeatures = this.detectFeatures();
    
    if (newFeatures.reducedMotion !== this.featureSupport.reducedMotion ||
        newFeatures.highContrast !== this.featureSupport.highContrast) {
      this.featureSupport = newFeatures;
      this.reevaluateProfile();
    }
  }

  private updateNetworkCapabilities(): void {
    const newCapabilities = this.detectNetworkCapabilities();
    
    if (newCapabilities.connectionQuality !== this.networkCapabilities.connectionQuality ||
        newCapabilities.saveData !== this.networkCapabilities.saveData) {
      this.networkCapabilities = newCapabilities;
      this.reevaluateProfile();
    }
  }

  private reevaluateProfile(): void {
    const newProfile = this.selectOptimalProfile();
    
    if (newProfile.level !== this.currentProfile.level) {
      this.currentProfile = newProfile;
      this.notifySubscribers();
      this.loadRequiredModules();
    }
  }

  // Initialization and Module Loading
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Apply fallback strategies first
    this.applyFallbackStrategies(document.body);

    // Load required modules for current profile
    await this.loadRequiredModules();

    this.isInitialized = true;
  }

  private async loadRequiredModules(): Promise<void> {
    const profile = this.currentProfile;
    const requiredModules: string[] = [];

    // Determine which modules to load based on profile features
    if (profile.features.advancedEasing) requiredModules.push('advanced-easing');
    if (profile.features.threeDTransforms) requiredModules.push('3d-transforms');
    if (profile.features.particleEffects) requiredModules.push('particle-effects');
    if (profile.features.gestureRecognition) requiredModules.push('gesture-recognition');
    if (profile.features.hapticFeedback) requiredModules.push('haptic-feedback');

    // Sort by priority and load
    const modulesToLoad = requiredModules
      .map(name => this.enhancementModules.get(name)!)
      .filter(module => module && !module.isLoaded)
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    for (const module of modulesToLoad) {
      await this.loadModule(module);
    }
  }

  private async loadModule(module: EnhancementModule): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Check dependencies
      for (const dep of module.dependencies) {
        const depModule = this.enhancementModules.get(dep);
        if (depModule && !depModule.isLoaded) {
          await this.loadModule(depModule);
        }
      }

      // Load the module
      const result = await module.loader();
      module.isLoaded = true;
      module.loadTime = Date.now() - startTime;
      this.loadedFeatures.add(module.name);

      console.log(`Enhancement module '${module.name}' loaded in ${module.loadTime}ms`);
      
    } catch (error) {
      console.warn(`Failed to load enhancement module '${module.name}':`, error);
      
      // Use fallback if available
      if (module.fallback) {
        const fallback = module.fallback();
        console.log(`Using fallback for '${module.name}':`, fallback);
      }
    }
  }

  // Fallback Strategy Application
  private applyFallbackStrategies(container: HTMLElement): void {
    const animations = container.querySelectorAll('[data-animation]');
    
    animations.forEach(element => {
      this.applyElementFallbacks(element as HTMLElement);
    });
  }

  private applyElementFallbacks(element: HTMLElement): void {
    const strategyEntries = Array.from(this.fallbackStrategies.entries());
    for (const [name, strategy] of strategyEntries) {
      if (strategy.conditions(this.featureSupport, this.userPreferences)) {
        strategy.apply(element);
        element.setAttribute('data-fallback-applied', name);
      }
    }
  }

  // Public API
  public getCurrentProfile(): EnhancementProfile {
    return { ...this.currentProfile };
  }

  public getFeatureSupport(): FeatureSupport {
    return { ...this.featureSupport };
  }

  public getUserPreferences(): UserPreferences {
    return { ...this.userPreferences };
  }

  public updateUserPreferences(updates: Partial<UserPreferences>): void {
    this.userPreferences = {
      ...this.userPreferences,
      ...updates,
      lastUpdated: Date.now()
    };
    
    this.saveUserPreferences();
    this.reevaluateProfile();
  }

  public getLoadedFeatures(): string[] {
    return Array.from(this.loadedFeatures);
  }

  public getNetworkCapabilities(): NetworkCapabilities {
    return { ...this.networkCapabilities };
  }

  public getAvailableProfiles(): EnhancementProfile[] {
    return this.enhancementProfiles.map(p => ({ ...p }));
  }

  public isFeatureEnabled(feature: keyof EnhancementProfile['features']): boolean {
    return this.currentProfile.features[feature];
  }

  public shouldApplyFallback(fallbackName: string): boolean {
    const strategy = this.fallbackStrategies.get(fallbackName);
    return strategy ? strategy.conditions(this.featureSupport, this.userPreferences) : false;
  }

  // Element Enhancement
  public enhanceElement(element: HTMLElement, options?: {
    forceFallbacks?: boolean;
    customLevel?: EnhancementLevel;
  }): void {
    const profile = options?.customLevel 
      ? this.enhancementProfiles.find(p => p.level === options.customLevel) || this.currentProfile
      : this.currentProfile;

    // Apply appropriate enhancements based on profile
    this.applyElementEnhancements(element, profile);
    
    if (options?.forceFallbacks || this.shouldUseFallbacks()) {
      this.applyElementFallbacks(element);
    }
  }

  private applyElementEnhancements(element: HTMLElement, profile: EnhancementProfile): void {
    if (profile.performance.enableGPUAcceleration && this.featureSupport.willChange) {
      element.style.willChange = 'transform, opacity';
    }

    // Apply other enhancements based on profile features
    element.setAttribute('data-enhancement-level', profile.level);
  }

  private shouldUseFallbacks(): boolean {
    return this.userPreferences.reducedMotion || 
           this.networkCapabilities.saveData ||
           this.networkCapabilities.connectionQuality === 'poor';
  }

  // Subscription Management
  public subscribe(callback: (profile: EnhancementProfile, features: FeatureSupport) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.currentProfile, this.featureSupport);
      } catch (error) {
        console.error('Progressive Enhancement System: Subscriber error:', error);
      }
    });
  }

  // Cleanup
  public destroy(): void {
    if (this.preferenceMonitorInterval) {
      clearInterval(this.preferenceMonitorInterval);
      this.preferenceMonitorInterval = null;
    }

    if (this.networkMonitorInterval) {
      clearInterval(this.networkMonitorInterval);
      this.networkMonitorInterval = null;
    }

    this.subscribers.clear();
    this.loadedFeatures.clear();
  }
}

// React Hook
export function useProgressiveEnhancement() {
  const [system] = useState(() => new ProgressiveEnhancementSystem());
  const [profile, setProfile] = useState(system.getCurrentProfile());
  const [features, setFeatures] = useState(system.getFeatureSupport());

  useEffect(() => {
    const unsubscribe = system.subscribe((newProfile, newFeatures) => {
      setProfile(newProfile);
      setFeatures(newFeatures);
    });

    return () => {
      unsubscribe();
      system.destroy();
    };
  }, [system]);

  return {
    system,
    profile,
    features,
    preferences: system.getUserPreferences(),
    networkCapabilities: system.getNetworkCapabilities(),
    loadedFeatures: system.getLoadedFeatures(),
    updatePreferences: (updates: Partial<UserPreferences>) => system.updateUserPreferences(updates),
    enhanceElement: (element: HTMLElement, options?: any) => system.enhanceElement(element, options),
    isFeatureEnabled: (feature: keyof EnhancementProfile['features']) => system.isFeatureEnabled(feature)
  };
}

// Singleton Instance
let globalProgressiveEnhancementSystem: ProgressiveEnhancementSystem | null = null;

export function getGlobalProgressiveEnhancementSystem(): ProgressiveEnhancementSystem {
  if (!globalProgressiveEnhancementSystem) {
    globalProgressiveEnhancementSystem = new ProgressiveEnhancementSystem();
  }
  return globalProgressiveEnhancementSystem;
}

export default ProgressiveEnhancementSystem; 