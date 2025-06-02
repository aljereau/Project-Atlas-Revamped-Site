/**
 * Modal Component Integration System
 * Task 4.3.1 - Modal Integration with Enhanced Component Coordination
 * Comprehensive modal animation integration with component lifecycle management
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import type { DeviceInfo } from './mobileDeviceDetection';
import { animations, panelExpansionVariants, backdropVariants, appleEasing, timing } from './modalAnimations';
import { enhancedModalTransitions } from './enhancedModalTransitions';
import { modalContentStagger, globalContentStaggerOrchestrator } from './modalContentStagger';
import { microInteractionSystem, globalMicroInteractionManager } from './microInteractionSystem';
import { touchResponseSystem, TouchResponseManager } from './touchResponseSystem';
import { advancedGestureRecognition, globalAdvancedGestureManager } from './advancedGestureRecognition';
import { modalPerformanceValidation, globalPerformanceMonitor } from './modalPerformanceValidation';
import { performanceOptimizedVariants } from './performanceOptimizations';

/**
 * Integrated Modal Animation Configuration
 * Comprehensive configuration for all animation features
 */
export interface IntegratedModalConfig {
  modalId: string;
  animationProfile?: 'smooth' | 'dramatic' | 'subtle' | 'performance' | 'accessibility';
  enableGestures?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableContentStagger?: boolean;
  enableMicroInteractions?: boolean;
  enableTouchResponse?: boolean;
  contentComplexity?: 'low' | 'medium' | 'high';
  targetDevice?: 'mobile' | 'tablet' | 'desktop';
  customVariants?: Variants;
  staggerConfig?: {
    sections: string[];
    baseDelay: number;
    maxDelay: number;
  };
}

/**
 * Modal Animation Profiles
 * Pre-configured animation combinations for different use cases
 */
export const modalAnimationProfiles = {
  smooth: {
    entrance: enhancedModalTransitions.entrance,
    exit: enhancedModalTransitions.exit,
    content: modalContentStagger.progressive,
    backdrop: backdropVariants,
    performance: { gpuOptimization: true, frameRate: 60 },
  },
  dramatic: {
    entrance: enhancedModalTransitions.entrance,
    exit: enhancedModalTransitions.exit,
    content: modalContentStagger.sections.header,
    backdrop: backdropVariants,
    performance: { gpuOptimization: true, frameRate: 60 },
  },
  subtle: {
    entrance: enhancedModalTransitions.entrance,
    exit: enhancedModalTransitions.exit,
    content: modalContentStagger.sections.body,
    backdrop: backdropVariants,
    performance: { gpuOptimization: false, frameRate: 30 },
  },
  performance: {
    entrance: enhancedModalTransitions.entrance,
    exit: enhancedModalTransitions.exit,
    content: modalContentStagger.loading,
    backdrop: { initial: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } },
    performance: { gpuOptimization: true, frameRate: 120 },
  },
  accessibility: {
    entrance: { initial: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } },
    exit: { initial: { opacity: 1 }, visible: { opacity: 0 } },
    content: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    backdrop: { initial: { opacity: 0 }, visible: { opacity: 0.5 }, exit: { opacity: 0 } },
    performance: { gpuOptimization: false, frameRate: 30 },
  },
} as const;

/**
 * Integrated Modal Animation Manager
 * Central coordinator for all modal animation systems
 */
export class IntegratedModalAnimationManager {
  private activeModals = new Map<string, IntegratedModalConfig>();
  private performanceMetrics = new Map<string, any>();
  private gestureHandlers = new Map<string, any>();
  private contentStaggerControllers = new Map<string, any>();
  
  /**
   * Initialize modal with integrated animation systems
   */
  async initializeModal(config: IntegratedModalConfig): Promise<{
    variants: any;
    handlers: any;
    monitors: any;
  }> {
    const { modalId, animationProfile = 'smooth' } = config;
    
    // Store active modal configuration
    this.activeModals.set(modalId, config);
    
    // Get animation profile
    const profile = modalAnimationProfiles[animationProfile];
    
    // Initialize performance monitoring
    let performanceMonitor = null;
    if (config.enablePerformanceMonitoring) {
      performanceMonitor = await this.initializePerformanceMonitoring(modalId, config);
    }
    
    // Initialize gesture recognition
    let gestureHandlers = null;
    if (config.enableGestures) {
      gestureHandlers = await this.initializeGestureRecognition(modalId, config);
    }
    
    // Initialize content stagger
    let staggerController = null;
    if (config.enableContentStagger) {
      staggerController = await this.initializeContentStagger(modalId, config);
    }
    
    // Initialize micro-interactions
    let microInteractions = null;
    if (config.enableMicroInteractions) {
      microInteractions = await this.initializeMicroInteractions(modalId, config);
    }
    
    // Initialize touch response
    let touchResponse = null;
    if (config.enableTouchResponse) {
      touchResponse = await this.initializeTouchResponse(modalId, config);
    }
    
    return {
      variants: {
        modal: profile.entrance,
        backdrop: profile.backdrop,
        content: profile.content,
        exit: profile.exit,
        custom: config.customVariants,
      },
      handlers: {
        gesture: gestureHandlers,
        touch: touchResponse,
        microInteraction: microInteractions,
      },
      monitors: {
        performance: performanceMonitor,
        stagger: staggerController,
      },
    };
  }
  
  /**
   * Initialize performance monitoring for modal
   */
  private async initializePerformanceMonitoring(
    modalId: string,
    config: IntegratedModalConfig
  ): Promise<any> {
    const monitor = globalPerformanceMonitor;
    
    // Configure performance criteria based on profile
    const criteria = {
      low: { frameRate: 30, complexity: 1 },
      medium: { frameRate: 45, complexity: 1.5 },
      high: { frameRate: 60, complexity: 2 },
    }[config.contentComplexity || 'medium'];
    
    monitor.startMonitoring(modalId);
    this.performanceMetrics.set(modalId, { monitor, criteria });
    
    return {
      monitor,
      startMonitoring: () => monitor.startMonitoring(modalId),
      stopMonitoring: () => monitor.stopMonitoring(),
      getMetrics: () => this.performanceMetrics.get(modalId),
    };
  }
  
  /**
   * Initialize gesture recognition for modal
   */
  private async initializeGestureRecognition(
    modalId: string,
    config: IntegratedModalConfig
  ): Promise<any> {
    const gestureManager = globalAdvancedGestureManager;
    
    // Configure gestures based on device and content
    const enabledGestures = this.getGestureConfiguration(config);
    
    const handlers = {
      onGestureRecognized: (data: any) => {
        console.log(`Gesture recognized in modal ${modalId}:`, data.gestureName);
        this.handleModalGesture(modalId, data);
      },
    };
    
    // Register gesture handlers
    enabledGestures.forEach(gestureName => {
      gestureManager.onGestureRecognized(gestureName, handlers.onGestureRecognized);
    });
    
    this.gestureHandlers.set(modalId, { gestureManager, enabledGestures, handlers });
    
    return handlers;
  }
  
  /**
   * Initialize content stagger for modal
   */
  private async initializeContentStagger(
    modalId: string,
    config: IntegratedModalConfig
  ): Promise<any> {
    const orchestrator = globalContentStaggerOrchestrator;
    
    const staggerConfig = config.staggerConfig || {
      sections: ['header', 'body', 'footer'],
      baseDelay: 0.1,
      maxDelay: 0.3,
    };
    
    const controller = {
      registerContent: (contentId: string, element: HTMLElement, contentConfig: any) => {
        orchestrator.registerContent(contentId, element, {
          ...contentConfig,
          priority: this.getContentPriority(contentConfig.section),
        });
      },
      executeStagger: () => orchestrator.executeStaggeredReveal(modalId),
      clearQueue: () => orchestrator.clearContentQueue(),
    };
    
    this.contentStaggerControllers.set(modalId, controller);
    
    return controller;
  }
  
  /**
   * Initialize micro-interactions for modal
   */
  private async initializeMicroInteractions(
    modalId: string,
    config: IntegratedModalConfig
  ): Promise<any> {
    const microManager = globalMicroInteractionManager;
    
    const interactionConfig = {
      enableHaptic: config.targetDevice === 'mobile',
      enableVisualFeedback: true,
      enableAnalytics: config.enablePerformanceMonitoring,
    };
    
    return {
      buttonHover: (element: HTMLElement) => 
        microManager.applyButtonMicroInteraction(element, 'default', interactionConfig),
      cardHover: (element: HTMLElement) => 
        microManager.applyCardMicroInteraction(element, 'subtle', interactionConfig),
      inputFocus: (element: HTMLElement) => 
        microManager.applyInputMicroInteraction(element, 'focus', interactionConfig),
    };
  }
  
  /**
   * Initialize touch response for modal
   */
  private async initializeTouchResponse(
    modalId: string,
    config: IntegratedModalConfig
  ): Promise<any> {
    const touchManager = globalTouchResponseManager;
    
    const touchConfig = {
      enableGestures: config.enableGestures,
      enableVisualEffects: true,
      enableHapticFeedback: config.targetDevice === 'mobile',
    };
    
    return {
      enableTouchTracking: (element: HTMLElement) => 
        touchManager.initializeTouchTracking(element),
      onSwipe: (direction: string, callback: () => void) => 
        touchManager.onSwipeGesture(direction, callback),
      onPinch: (callback: (scale: number) => void) => 
        touchManager.onPinchGesture(callback),
    };
  }
  
  /**
   * Get gesture configuration based on modal config
   */
  private getGestureConfiguration(config: IntegratedModalConfig): string[] {
    const baseGestures = ['doubleTap'];
    
    if (config.targetDevice === 'mobile') {
      return [...baseGestures, 'circularSwipe', 'triangleGesture'];
    } else if (config.targetDevice === 'tablet') {
      return [...baseGestures, 'circularSwipe', 'zPatternSwipe'];
    } else {
      return baseGestures;
    }
  }
  
  /**
   * Get content priority for stagger timing
   */
  private getContentPriority(section: string): 'high' | 'medium' | 'low' {
    switch (section) {
      case 'header': return 'high';
      case 'navigation': return 'high';
      case 'body': return 'medium';
      case 'media': return 'low';
      case 'footer': return 'low';
      default: return 'medium';
    }
  }
  
  /**
   * Handle modal gesture recognition
   */
  private handleModalGesture(modalId: string, gestureData: any): void {
    const config = this.activeModals.get(modalId);
    if (!config) return;
    
    // Handle different gestures
    switch (gestureData.gestureName) {
      case 'doubleTap':
        this.handleDoubleTapGesture(modalId, gestureData);
        break;
      case 'circularSwipe':
        this.handleCircularSwipeGesture(modalId, gestureData);
        break;
      case 'triangleGesture':
        this.handleTriangleGesture(modalId, gestureData);
        break;
    }
  }
  
  /**
   * Handle double tap gesture
   */
  private handleDoubleTapGesture(modalId: string, gestureData: any): void {
    // Trigger modal zoom/focus animation
    console.log(`Double tap detected in modal ${modalId} - triggering focus animation`);
  }
  
  /**
   * Handle circular swipe gesture
   */
  private handleCircularSwipeGesture(modalId: string, gestureData: any): void {
    // Trigger modal rotation or navigation
    console.log(`Circular swipe detected in modal ${modalId} - triggering rotation animation`);
  }
  
  /**
   * Handle triangle gesture
   */
  private handleTriangleGesture(modalId: string, gestureData: any): void {
    // Trigger special action or Easter egg
    console.log(`Triangle gesture detected in modal ${modalId} - triggering special animation`);
  }
  
  /**
   * Cleanup modal animation systems
   */
  cleanupModal(modalId: string): void {
    // Stop performance monitoring
    const performanceData = this.performanceMetrics.get(modalId);
    if (performanceData) {
      performanceData.monitor.stopMonitoring();
      this.performanceMetrics.delete(modalId);
    }
    
    // Cleanup gesture handlers
    this.gestureHandlers.delete(modalId);
    
    // Cleanup content stagger
    const staggerController = this.contentStaggerControllers.get(modalId);
    if (staggerController) {
      staggerController.clearQueue();
      this.contentStaggerControllers.delete(modalId);
    }
    
    // Remove from active modals
    this.activeModals.delete(modalId);
  }
  
  /**
   * Get modal statistics
   */
  getModalStatistics(): {
    activeModals: number;
    performanceData: any[];
    gestureStats: any;
  } {
    const performanceData = Array.from(this.performanceMetrics.values());
    const gestureStats = globalAdvancedGestureManager.getRecognitionStatistics();
    
    return {
      activeModals: this.activeModals.size,
      performanceData,
      gestureStats,
    };
  }
}

/**
 * Integrated Modal Component Wrapper
 * React component that provides integrated animation capabilities
 * Note: This component should be in a .tsx file for proper JSX support
 */
export interface IntegratedModalProps {
  children: any; // React.ReactNode
  config: IntegratedModalConfig;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// Component implementation commented out due to .ts file extension
// This should be moved to a .tsx file for proper JSX support
/*
export const IntegratedModal: React.FC<IntegratedModalProps> = ({
  children,
  config,
  isOpen,
  onClose,
  className = '',
}) => {
  // Component implementation would go here
  return null;
};
*/

/**
 * Modal Animation Utilities Hook
 * Custom hook for accessing animation utilities in modal components
 */
export const useModalAnimations = (modalId: string) => {
  const [manager] = useState(() => new IntegratedModalAnimationManager());
  
  return {
    initializeModal: (config: IntegratedModalConfig) => manager.initializeModal(config),
    cleanupModal: () => manager.cleanupModal(modalId),
    getStatistics: () => manager.getModalStatistics(),
  };
};

/**
 * Quick Setup Functions for Common Modal Types
 */
export const modalAnimationQuickSetup = {
  /**
   * Setup for About Atlas modal
   */
  aboutAtlas: (): IntegratedModalConfig => ({
    modalId: 'about-atlas',
    animationProfile: 'smooth',
    enableGestures: true,
    enablePerformanceMonitoring: true,
    enableContentStagger: true,
    enableMicroInteractions: true,
    enableTouchResponse: true,
    contentComplexity: 'medium',
    targetDevice: 'desktop',
    staggerConfig: {
      sections: ['header', 'team', 'mission', 'principles', 'footer'],
      baseDelay: 0.1,
      maxDelay: 0.4,
    },
  }),
  
  /**
   * Setup for Atlas Tools modal
   */
  atlasTools: (): IntegratedModalConfig => ({
    modalId: 'atlas-tools',
    animationProfile: 'dramatic',
    enableGestures: true,
    enablePerformanceMonitoring: true,
    enableContentStagger: true,
    enableMicroInteractions: true,
    enableTouchResponse: true,
    contentComplexity: 'high',
    targetDevice: 'desktop',
    staggerConfig: {
      sections: ['header', 'analyzer', 'tools', 'timeline', 'cta'],
      baseDelay: 0.15,
      maxDelay: 0.5,
    },
  }),
  
  /**
   * Setup for Project Log modal
   */
  projectLog: (): IntegratedModalConfig => ({
    modalId: 'project-log',
    animationProfile: 'smooth',
    enableGestures: true,
    enablePerformanceMonitoring: true,
    enableContentStagger: true,
    enableMicroInteractions: true,
    enableTouchResponse: true,
    contentComplexity: 'medium',
    targetDevice: 'desktop',
    staggerConfig: {
      sections: ['header', 'filters', 'entries', 'footer'],
      baseDelay: 0.1,
      maxDelay: 0.3,
    },
  }),
  
  /**
   * Setup for Get Involved modal
   */
  getInvolved: (): IntegratedModalConfig => ({
    modalId: 'get-involved',
    animationProfile: 'smooth',
    enableGestures: true,
    enablePerformanceMonitoring: true,
    enableContentStagger: true,
    enableMicroInteractions: true,
    enableTouchResponse: true,
    contentComplexity: 'medium',
    targetDevice: 'desktop',
    staggerConfig: {
      sections: ['header', 'personas', 'content', 'contact', 'footer'],
      baseDelay: 0.12,
      maxDelay: 0.35,
    },
  }),
};

/**
 * Global Integrated Modal Animation Manager Instance
 */
export const globalIntegratedModalManager = new IntegratedModalAnimationManager();

/**
 * Export modal component integration system
 */
export const modalComponentIntegration = {
  manager: IntegratedModalAnimationManager,
  component: IntegratedModal,
  hook: useModalAnimations,
  profiles: modalAnimationProfiles,
  quickSetup: modalAnimationQuickSetup,
  global: globalIntegratedModalManager,
} as const; 