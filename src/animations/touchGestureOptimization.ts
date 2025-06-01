/**
 * Touch Gesture Optimization System
 * Task 4.4.2 - Touch Gesture Optimization
 * Optimized touch interactions specifically designed for mobile devices
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { globalMobileDeviceDetector } from './mobileDeviceDetection';
import type { DeviceInfo, AdaptiveAnimationConfig } from './mobileDeviceDetection';

/**
 * Touch Event Types
 */
export type TouchEventType = 
  | 'tap' 
  | 'double-tap' 
  | 'long-press' 
  | 'swipe' 
  | 'pinch' 
  | 'rotate' 
  | 'drag' 
  | 'flick'
  | 'edge-swipe'
  | 'force-touch';

/**
 * Swipe Direction
 */
export type SwipeDirection = 'up' | 'down' | 'left' | 'right' | 'diagonal';

/**
 * Touch Point Information
 */
export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  pressure: number;
  radiusX: number;
  radiusY: number;
  timestamp: number;
}

/**
 * Touch Gesture Data
 */
export interface TouchGestureData {
  type: TouchEventType;
  startTime: number;
  duration: number;
  startPoint: TouchPoint;
  currentPoint: TouchPoint;
  endPoint?: TouchPoint;
  deltaX: number;
  deltaY: number;
  distance: number;
  velocity: number;
  direction?: SwipeDirection;
  scale?: number;
  rotation?: number;
  force?: number;
  touchCount: number;
  target: HTMLElement;
}

/**
 * Touch Configuration
 */
export interface TouchConfig {
  enableTap: boolean;
  enableDoubleTap: boolean;
  enableLongPress: boolean;
  enableSwipe: boolean;
  enablePinch: boolean;
  enableRotation: boolean;
  enableDrag: boolean;
  enableForceTouch: boolean;
  tapTimeout: number;
  doubleTapDelay: number;
  longPressTimeout: number;
  swipeThreshold: number;
  pinchThreshold: number;
  rotationThreshold: number;
  velocityThreshold: number;
  preventDefault: boolean;
  enableFeedback: boolean;
  enableAnalytics: boolean;
}

/**
 * Touch Optimization Settings
 */
export interface TouchOptimizationSettings {
  deviceSpecific: boolean;
  adaptToPerformance: boolean;
  enablePrediction: boolean;
  enableCoalescing: boolean;
  enablePassiveListeners: boolean;
  debounceTouch: number;
  throttleGestures: number;
  enableTouchHistory: boolean;
  maxHistoryLength: number;
  enableHapticFeedback: boolean;
  enableVisualFeedback: boolean;
}

/**
 * Touch History Entry
 */
interface TouchHistoryEntry {
  point: TouchPoint;
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
}

/**
 * Touch Gesture Handler
 */
export type TouchGestureHandler = (gesture: TouchGestureData) => void;

/**
 * Touch Gesture Optimization Class
 */
export class TouchGestureOptimizer {
  private element: HTMLElement | null = null;
  private isActive = false;
  private config: TouchConfig;
  private settings: TouchOptimizationSettings;
  private deviceInfo: DeviceInfo | null = null;
  private animationConfig: AdaptiveAnimationConfig | null = null;
  
  // Touch tracking
  private activeTouches = new Map<number, TouchPoint>();
  private touchHistory = new Map<number, TouchHistoryEntry[]>();
  private gestureData: Partial<TouchGestureData> = {};
  private lastTouchTime = 0;
  private tapCount = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  
  // Event handlers
  private handlers = new Map<TouchEventType, TouchGestureHandler[]>();
  
  // Performance optimization
  private rafId: number | null = null;
  private coalescedEvents: TouchEvent[] = [];
  private lastProcessTime = 0;
  
  constructor(element?: HTMLElement) {
    this.config = this.getDefaultConfig();
    this.settings = this.getDefaultSettings();
    
    if (element) {
      this.attachTo(element);
    }
    
    // Listen for device changes
    globalMobileDeviceDetector.subscribe(this.handleDeviceChange.bind(this));
  }
  
  /**
   * Get default touch configuration
   */
  private getDefaultConfig(): TouchConfig {
    return {
      enableTap: true,
      enableDoubleTap: true,
      enableLongPress: true,
      enableSwipe: true,
      enablePinch: true,
      enableRotation: false,
      enableDrag: true,
      enableForceTouch: false,
      tapTimeout: 300,
      doubleTapDelay: 250,
      longPressTimeout: 500,
      swipeThreshold: 50,
      pinchThreshold: 0.1,
      rotationThreshold: 15,
      velocityThreshold: 0.3,
      preventDefault: true,
      enableFeedback: true,
      enableAnalytics: true,
    };
  }
  
  /**
   * Get default optimization settings
   */
  private getDefaultSettings(): TouchOptimizationSettings {
    return {
      deviceSpecific: true,
      adaptToPerformance: true,
      enablePrediction: true,
      enableCoalescing: true,
      enablePassiveListeners: true,
      debounceTouch: 0,
      throttleGestures: 16,
      enableTouchHistory: true,
      maxHistoryLength: 10,
      enableHapticFeedback: true,
      enableVisualFeedback: true,
    };
  }
  
  /**
   * Handle device information changes
   */
  private handleDeviceChange(deviceInfo: DeviceInfo): void {
    this.deviceInfo = deviceInfo;
    this.animationConfig = globalMobileDeviceDetector.getAdaptiveAnimationConfig();
    this.optimizeForDevice();
  }
  
  /**
   * Optimize configuration for current device
   */
  private optimizeForDevice(): void {
    if (!this.deviceInfo || !this.animationConfig) return;
    
    const { type, performanceTier, capabilities } = this.deviceInfo;
    
    // Optimize based on device type
    if (type === 'mobile') {
      this.config.swipeThreshold = this.animationConfig.gestureThresholds.swipeDistance;
      this.config.tapTimeout = this.animationConfig.gestureThresholds.tapTimeout;
      this.config.longPressTimeout = this.animationConfig.gestureThresholds.longPressTimeout;
      this.settings.debounceTouch = this.animationConfig.interactionDebounce;
    }
    
    // Optimize for performance tier
    switch (performanceTier) {
      case 'high':
        this.settings.enablePrediction = true;
        this.settings.enableCoalescing = true;
        this.settings.maxHistoryLength = 15;
        this.settings.throttleGestures = 8;
        break;
        
      case 'medium':
        this.settings.enablePrediction = true;
        this.settings.enableCoalescing = true;
        this.settings.maxHistoryLength = 10;
        this.settings.throttleGestures = 16;
        break;
        
      case 'low':
        this.settings.enablePrediction = false;
        this.settings.enableCoalescing = true;
        this.settings.maxHistoryLength = 5;
        this.settings.throttleGestures = 32;
        break;
        
      case 'minimal':
        this.settings.enablePrediction = false;
        this.settings.enableCoalescing = false;
        this.settings.maxHistoryLength = 3;
        this.settings.throttleGestures = 50;
        this.config.enableRotation = false;
        this.config.enableForceTouch = false;
        break;
    }
    
    // Optimize for touch capabilities
    if (!capabilities.multiTouchSupport) {
      this.config.enablePinch = false;
      this.config.enableRotation = false;
    }
    
    if (!capabilities.vibrationSupport) {
      this.settings.enableHapticFeedback = false;
    }
    
    // Adjust for accessibility features
    if (this.deviceInfo.features.reduceMotion) {
      this.settings.enableVisualFeedback = false;
      this.config.enableFeedback = false;
    }
    
    console.log('Touch gesture optimization applied for device:', {
      type,
      performanceTier,
      config: this.config,
      settings: this.settings,
    });
  }
  
  /**
   * Attach to DOM element
   */
  attachTo(element: HTMLElement): void {
    if (this.element === element && this.isActive) return;
    
    this.detach();
    this.element = element;
    this.activate();
  }
  
  /**
   * Detach from current element
   */
  detach(): void {
    if (!this.element || !this.isActive) return;
    
    this.deactivate();
    this.element = null;
  }
  
  /**
   * Activate touch gesture recognition
   */
  private activate(): void {
    if (!this.element || this.isActive) return;
    
    const options = this.settings.enablePassiveListeners ? { passive: false } : false;
    
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), options);
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), options);
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), options);
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), options);
    
    // Add pointer events for enhanced touch support
    if ('PointerEvent' in window) {
      this.element.addEventListener('pointerdown', this.handlePointerDown.bind(this), options);
      this.element.addEventListener('pointermove', this.handlePointerMove.bind(this), options);
      this.element.addEventListener('pointerup', this.handlePointerUp.bind(this), options);
      this.element.addEventListener('pointercancel', this.handlePointerCancel.bind(this), options);
    }
    
    this.isActive = true;
    console.log('Touch gesture optimization activated');
  }
  
  /**
   * Deactivate touch gesture recognition
   */
  private deactivate(): void {
    if (!this.element || !this.isActive) return;
    
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
    
    if ('PointerEvent' in window) {
      this.element.removeEventListener('pointerdown', this.handlePointerDown.bind(this));
      this.element.removeEventListener('pointermove', this.handlePointerMove.bind(this));
      this.element.removeEventListener('pointerup', this.handlePointerUp.bind(this));
      this.element.removeEventListener('pointercancel', this.handlePointerCancel.bind(this));
    }
    
    this.clearActiveGestures();
    this.isActive = false;
    
    console.log('Touch gesture optimization deactivated');
  }
  
  /**
   * Handle touch start event
   */
  private handleTouchStart(event: TouchEvent): void {
    if (this.settings.enableCoalescing) {
      this.coalescedEvents.push(event);
      this.scheduleEventProcessing();
    } else {
      this.processTouchStart(event);
    }
  }
  
  /**
   * Process touch start event
   */
  private processTouchStart(event: TouchEvent): void {
    const now = Date.now();
    
    // Apply debouncing
    if (this.settings.debounceTouch > 0 && now - this.lastTouchTime < this.settings.debounceTouch) {
      return;
    }
    
    this.lastTouchTime = now;
    
    // Process each touch point
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchPoint = this.createTouchPoint(touch);
      
      this.activeTouches.set(touch.identifier, touchPoint);
      
      if (this.settings.enableTouchHistory) {
        this.touchHistory.set(touch.identifier, [{
          point: touchPoint,
          velocity: { x: 0, y: 0 },
          acceleration: { x: 0, y: 0 },
        }]);
      }
    }
    
    // Initialize gesture detection
    this.initializeGestureDetection(event);
    
    // Start long press detection
    if (this.config.enableLongPress && event.touches.length === 1) {
      this.startLongPressDetection(event);
    }
    
    if (this.config.preventDefault) {
      event.preventDefault();
    }
  }
  
  /**
   * Handle touch move event
   */
  private handleTouchMove(event: TouchEvent): void {
    if (this.settings.enableCoalescing) {
      this.coalescedEvents.push(event);
      this.scheduleEventProcessing();
    } else {
      this.processTouchMove(event);
    }
  }
  
  /**
   * Process touch move event
   */
  private processTouchMove(event: TouchEvent): void {
    // Update active touches
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchPoint = this.createTouchPoint(touch);
      const previousPoint = this.activeTouches.get(touch.identifier);
      
      if (previousPoint) {
        this.activeTouches.set(touch.identifier, touchPoint);
        
        // Update touch history
        if (this.settings.enableTouchHistory) {
          this.updateTouchHistory(touch.identifier, touchPoint, previousPoint);
        }
        
        // Update gesture data
        this.updateGestureData(event);
      }
    }
    
    // Cancel long press if movement detected
    if (this.longPressTimer && this.hasSignificantMovement()) {
      this.cancelLongPress();
    }
    
    // Detect ongoing gestures
    this.detectGestures(event);
    
    if (this.config.preventDefault) {
      event.preventDefault();
    }
  }
  
  /**
   * Handle touch end event
   */
  private handleTouchEnd(event: TouchEvent): void {
    this.processTouchEnd(event);
  }
  
  /**
   * Process touch end event
   */
  private processTouchEnd(event: TouchEvent): void {
    // Process ended touches
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const touchPoint = this.createTouchPoint(touch);
      
      if (this.activeTouches.has(touch.identifier)) {
        this.activeTouches.delete(touch.identifier);
        this.touchHistory.delete(touch.identifier);
      }
    }
    
    // Finalize gesture detection
    this.finalizeGestureDetection(event);
    
    // Clear gesture data if no more touches
    if (this.activeTouches.size === 0) {
      this.clearActiveGestures();
    }
    
    if (this.config.preventDefault) {
      event.preventDefault();
    }
  }
  
  /**
   * Handle touch cancel event
   */
  private handleTouchCancel(event: TouchEvent): void {
    this.clearActiveGestures();
    
    if (this.config.preventDefault) {
      event.preventDefault();
    }
  }
  
  /**
   * Handle pointer events (enhanced touch support)
   */
  private handlePointerDown(event: PointerEvent): void {
    if (event.pointerType === 'touch') {
      // Enhanced force touch detection
      if (this.config.enableForceTouch && 'pressure' in event) {
        this.detectForceTouch(event);
      }
    }
  }
  
  private handlePointerMove(event: PointerEvent): void {
    if (event.pointerType === 'touch' && this.config.enableForceTouch) {
      this.updateForceTouch(event);
    }
  }
  
  private handlePointerUp(event: PointerEvent): void {
    if (event.pointerType === 'touch' && this.config.enableForceTouch) {
      this.finalizeForceTouch(event);
    }
  }
  
  private handlePointerCancel(event: PointerEvent): void {
    this.clearActiveGestures();
  }
  
  /**
   * Schedule event processing for coalescing
   */
  private scheduleEventProcessing(): void {
    if (this.rafId !== null) return;
    
    this.rafId = requestAnimationFrame(() => {
      const now = Date.now();
      
      // Throttle gesture processing
      if (now - this.lastProcessTime >= this.settings.throttleGestures) {
        this.processCoalescedEvents();
        this.lastProcessTime = now;
      }
      
      this.rafId = null;
    });
  }
  
  /**
   * Process coalesced events
   */
  private processCoalescedEvents(): void {
    const events = [...this.coalescedEvents];
    this.coalescedEvents = [];
    
    events.forEach(event => {
      switch (event.type) {
        case 'touchstart':
          this.processTouchStart(event);
          break;
        case 'touchmove':
          this.processTouchMove(event);
          break;
      }
    });
  }
  
  /**
   * Create touch point from touch event
   */
  private createTouchPoint(touch: Touch): TouchPoint {
    return {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      pressure: 'force' in touch ? (touch as any).force : 1,
      radiusX: 'radiusX' in touch ? (touch as any).radiusX : 20,
      radiusY: 'radiusY' in touch ? (touch as any).radiusY : 20,
      timestamp: Date.now(),
    };
  }
  
  /**
   * Update touch history
   */
  private updateTouchHistory(touchId: number, currentPoint: TouchPoint, previousPoint: TouchPoint): void {
    const history = this.touchHistory.get(touchId);
    if (!history) return;
    
    const deltaTime = currentPoint.timestamp - previousPoint.timestamp;
    const velocity = {
      x: deltaTime > 0 ? (currentPoint.x - previousPoint.x) / deltaTime : 0,
      y: deltaTime > 0 ? (currentPoint.y - previousPoint.y) / deltaTime : 0,
    };
    
    const lastEntry = history[history.length - 1];
    const acceleration = {
      x: deltaTime > 0 ? (velocity.x - lastEntry.velocity.x) / deltaTime : 0,
      y: deltaTime > 0 ? (velocity.y - lastEntry.velocity.y) / deltaTime : 0,
    };
    
    history.push({
      point: currentPoint,
      velocity,
      acceleration,
    });
    
    // Limit history length
    while (history.length > this.settings.maxHistoryLength) {
      history.shift();
    }
  }
  
  /**
   * Initialize gesture detection
   */
  private initializeGestureDetection(event: TouchEvent): void {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const touchPoint = this.createTouchPoint(touch);
      
      this.gestureData = {
        startTime: Date.now(),
        startPoint: touchPoint,
        currentPoint: touchPoint,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        velocity: 0,
        touchCount: 1,
        target: event.target as HTMLElement,
      };
    }
  }
  
  /**
   * Update gesture data
   */
  private updateGestureData(event: TouchEvent): void {
    if (!this.gestureData.startPoint || event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    const currentPoint = this.createTouchPoint(touch);
    
    this.gestureData.currentPoint = currentPoint;
    this.gestureData.deltaX = currentPoint.x - this.gestureData.startPoint.x;
    this.gestureData.deltaY = currentPoint.y - this.gestureData.startPoint.y;
    this.gestureData.distance = Math.sqrt(
      this.gestureData.deltaX ** 2 + this.gestureData.deltaY ** 2
    );
    
    const deltaTime = currentPoint.timestamp - this.gestureData.startPoint.timestamp;
    this.gestureData.velocity = deltaTime > 0 ? this.gestureData.distance / deltaTime : 0;
  }
  
  /**
   * Detect gestures during movement
   */
  private detectGestures(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.detectSwipe();
      this.detectDrag();
    } else if (event.touches.length === 2) {
      this.detectPinch(event);
      this.detectRotation(event);
    }
  }
  
  /**
   * Finalize gesture detection
   */
  private finalizeGestureDetection(event: TouchEvent): void {
    if (!this.gestureData.startPoint) return;
    
    const now = Date.now();
    this.gestureData.duration = now - (this.gestureData.startTime || now);
    this.gestureData.endPoint = this.gestureData.currentPoint;
    
    // Detect tap gestures
    if (this.gestureData.distance! < this.config.swipeThreshold) {
      this.detectTap();
    } else if (this.gestureData.velocity! > this.config.velocityThreshold) {
      this.emitSwipeGesture();
    }
  }
  
  /**
   * Detect tap gesture
   */
  private detectTap(): void {
    if (!this.config.enableTap) return;
    
    const now = Date.now();
    
    if (this.config.enableDoubleTap && now - this.lastTouchTime < this.config.doubleTapDelay) {
      this.tapCount++;
      
      if (this.tapCount === 2) {
        this.emitGesture('double-tap');
        this.tapCount = 0;
        return;
      }
    } else {
      this.tapCount = 1;
    }
    
    // Emit single tap after delay to check for double tap
    setTimeout(() => {
      if (this.tapCount === 1) {
        this.emitGesture('tap');
        this.tapCount = 0;
      }
    }, this.config.doubleTapDelay);
  }
  
  /**
   * Detect swipe gesture
   */
  private detectSwipe(): void {
    if (!this.config.enableSwipe || !this.gestureData.distance) return;
    
    if (this.gestureData.distance > this.config.swipeThreshold) {
      this.gestureData.direction = this.calculateSwipeDirection();
    }
  }
  
  /**
   * Emit swipe gesture
   */
  private emitSwipeGesture(): void {
    if (!this.gestureData.direction) return;
    
    this.gestureData.type = 'swipe';
    this.emitGesture('swipe');
  }
  
  /**
   * Calculate swipe direction
   */
  private calculateSwipeDirection(): SwipeDirection {
    const { deltaX, deltaY } = this.gestureData;
    
    if (!deltaX || !deltaY) return 'right';
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }
  
  /**
   * Detect drag gesture
   */
  private detectDrag(): void {
    if (!this.config.enableDrag) return;
    
    if (this.gestureData.distance! > this.config.swipeThreshold) {
      this.gestureData.type = 'drag';
      this.emitGesture('drag');
    }
  }
  
  /**
   * Detect pinch gesture
   */
  private detectPinch(event: TouchEvent): void {
    if (!this.config.enablePinch || event.touches.length !== 2) return;
    
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    
    const distance = Math.sqrt(
      (touch2.clientX - touch1.clientX) ** 2 + (touch2.clientY - touch1.clientY) ** 2
    );
    
    // Calculate scale based on initial distance
    // This would need initial distance tracking for full implementation
    this.gestureData.scale = 1; // Simplified for this example
    this.gestureData.type = 'pinch';
    this.emitGesture('pinch');
  }
  
  /**
   * Detect rotation gesture
   */
  private detectRotation(event: TouchEvent): void {
    if (!this.config.enableRotation || event.touches.length !== 2) return;
    
    // Calculate rotation angle between two touches
    // This would need full implementation with angle tracking
    this.gestureData.rotation = 0; // Simplified for this example
    this.gestureData.type = 'rotate';
    this.emitGesture('rotate');
  }
  
  /**
   * Start long press detection
   */
  private startLongPressDetection(event: TouchEvent): void {
    this.longPressTimer = setTimeout(() => {
      if (this.activeTouches.size === 1 && !this.hasSignificantMovement()) {
        this.emitGesture('long-press');
      }
      this.longPressTimer = null;
    }, this.config.longPressTimeout);
  }
  
  /**
   * Cancel long press detection
   */
  private cancelLongPress(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }
  
  /**
   * Check for significant movement
   */
  private hasSignificantMovement(): boolean {
    return (this.gestureData.distance || 0) > this.config.swipeThreshold * 0.5;
  }
  
  /**
   * Detect force touch
   */
  private detectForceTouch(event: PointerEvent): void {
    if ('pressure' in event && event.pressure > 0.5) {
      this.gestureData.type = 'force-touch';
      this.gestureData.force = event.pressure;
      this.emitGesture('force-touch');
    }
  }
  
  /**
   * Update force touch
   */
  private updateForceTouch(event: PointerEvent): void {
    if (this.gestureData.type === 'force-touch' && 'pressure' in event) {
      this.gestureData.force = event.pressure;
    }
  }
  
  /**
   * Finalize force touch
   */
  private finalizeForceTouch(event: PointerEvent): void {
    if (this.gestureData.type === 'force-touch') {
      this.gestureData.endPoint = this.gestureData.currentPoint;
      this.emitGesture('force-touch');
    }
  }
  
  /**
   * Emit gesture event
   */
  private emitGesture(type: TouchEventType): void {
    const handlers = this.handlers.get(type);
    if (!handlers || handlers.length === 0) return;
    
    const gestureData: TouchGestureData = {
      type,
      startTime: this.gestureData.startTime!,
      duration: this.gestureData.duration || 0,
      startPoint: this.gestureData.startPoint!,
      currentPoint: this.gestureData.currentPoint!,
      endPoint: this.gestureData.endPoint,
      deltaX: this.gestureData.deltaX || 0,
      deltaY: this.gestureData.deltaY || 0,
      distance: this.gestureData.distance || 0,
      velocity: this.gestureData.velocity || 0,
      direction: this.gestureData.direction,
      scale: this.gestureData.scale,
      rotation: this.gestureData.rotation,
      force: this.gestureData.force,
      touchCount: this.gestureData.touchCount || 1,
      target: this.gestureData.target!,
    };
    
    // Provide feedback
    if (this.config.enableFeedback) {
      this.provideFeedback(type);
    }
    
    // Emit to handlers
    handlers.forEach(handler => {
      try {
        handler(gestureData);
      } catch (error) {
        console.error('Touch gesture handler error:', error);
      }
    });
    
    // Analytics
    if (this.config.enableAnalytics) {
      this.recordGestureAnalytics(gestureData);
    }
  }
  
  /**
   * Provide haptic/visual feedback
   */
  private provideFeedback(type: TouchEventType): void {
    // Haptic feedback
    if (this.settings.enableHapticFeedback && navigator.vibrate) {
      const patterns: Record<TouchEventType, number | number[]> = {
        'tap': 50,
        'double-tap': [50, 50, 50],
        'long-press': 200,
        'swipe': 75,
        'pinch': [25, 25, 25],
        'rotate': [25, 25, 25],
        'drag': 0,
        'flick': 100,
        'edge-swipe': [100, 50, 100],
        'force-touch': 300,
      };
      
      const pattern = patterns[type];
      if (pattern && pattern !== 0) {
        navigator.vibrate(pattern);
      }
    }
    
    // Visual feedback
    if (this.settings.enableVisualFeedback && this.element) {
      this.element.classList.add('touch-feedback');
      setTimeout(() => {
        this.element?.classList.remove('touch-feedback');
      }, 150);
    }
  }
  
  /**
   * Record gesture analytics
   */
  private recordGestureAnalytics(gestureData: TouchGestureData): void {
    console.log('Touch gesture analytics:', {
      type: gestureData.type,
      duration: gestureData.duration,
      distance: gestureData.distance,
      velocity: gestureData.velocity,
      device: this.deviceInfo?.type,
      performanceTier: this.deviceInfo?.performanceTier,
    });
  }
  
  /**
   * Clear active gestures
   */
  private clearActiveGestures(): void {
    this.activeTouches.clear();
    this.touchHistory.clear();
    this.gestureData = {};
    this.cancelLongPress();
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  /**
   * Add gesture event listener
   */
  on(type: TouchEventType, handler: TouchGestureHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    
    this.handlers.get(type)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }
  
  /**
   * Remove gesture event listener
   */
  off(type: TouchEventType, handler?: TouchGestureHandler): void {
    if (!handler) {
      this.handlers.delete(type);
    } else {
      const handlers = this.handlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    }
  }
  
  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<TouchConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.optimizeForDevice();
  }
  
  /**
   * Update optimization settings
   */
  updateSettings(newSettings: Partial<TouchOptimizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.optimizeForDevice();
  }
  
  /**
   * Get current configuration
   */
  getConfig(): TouchConfig {
    return { ...this.config };
  }
  
  /**
   * Get current settings
   */
  getSettings(): TouchOptimizationSettings {
    return { ...this.settings };
  }
  
  /**
   * Get device information
   */
  getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }
  
  /**
   * Get touch statistics
   */
  getStatistics(): {
    activeTouches: number;
    gestureHistory: number;
    isOptimized: boolean;
    performance: string;
  } {
    return {
      activeTouches: this.activeTouches.size,
      gestureHistory: Array.from(this.touchHistory.values()).reduce((sum, history) => sum + history.length, 0),
      isOptimized: this.settings.deviceSpecific && !!this.deviceInfo,
      performance: this.deviceInfo?.performanceTier || 'unknown',
    };
  }
  
  /**
   * Destroy optimizer
   */
  destroy(): void {
    this.detach();
    this.handlers.clear();
    this.clearActiveGestures();
  }
}

/**
 * Global touch gesture optimizer instance
 */
export const globalTouchGestureOptimizer = new TouchGestureOptimizer();

/**
 * React hook for touch gesture optimization
 */
export const useTouchGestureOptimization = (elementRef?: React.RefObject<HTMLElement>) => {
  const [optimizer] = useState(() => new TouchGestureOptimizer());
  const [isActive, setIsActive] = useState(false);
  const [statistics, setStatistics] = useState(optimizer.getStatistics());
  
  // Attach to element when ref changes
  useEffect(() => {
    if (elementRef?.current) {
      optimizer.attachTo(elementRef.current);
      setIsActive(true);
    }
    
    return () => {
      optimizer.detach();
      setIsActive(false);
    };
  }, [elementRef?.current, optimizer]);
  
  // Update statistics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStatistics(optimizer.getStatistics());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [optimizer]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      optimizer.destroy();
    };
  }, [optimizer]);
  
  const addGestureListener = useCallback((type: TouchEventType, handler: TouchGestureHandler) => {
    return optimizer.on(type, handler);
  }, [optimizer]);
  
  const removeGestureListener = useCallback((type: TouchEventType, handler?: TouchGestureHandler) => {
    optimizer.off(type, handler);
  }, [optimizer]);
  
  const updateConfig = useCallback((config: Partial<TouchConfig>) => {
    optimizer.updateConfig(config);
  }, [optimizer]);
  
  const updateSettings = useCallback((settings: Partial<TouchOptimizationSettings>) => {
    optimizer.updateSettings(settings);
  }, [optimizer]);
  
  return {
    optimizer,
    isActive,
    statistics,
    addGestureListener,
    removeGestureListener,
    updateConfig,
    updateSettings,
    config: optimizer.getConfig(),
    settings: optimizer.getSettings(),
    deviceInfo: optimizer.getDeviceInfo(),
  };
};

/**
 * Export touch gesture optimization system
 */
export const touchGestureOptimization = {
  optimizer: TouchGestureOptimizer,
  hook: useTouchGestureOptimization,
  global: globalTouchGestureOptimizer,
  types: {
    TouchEventType,
    SwipeDirection,
    TouchPoint,
    TouchGestureData,
    TouchConfig,
    TouchOptimizationSettings,
    TouchGestureHandler,
  },
} as const; 