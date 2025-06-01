/**
 * Interactive Feedback & Touch Response System
 * Task 4.2.3 - Advanced touch interactions with gesture recognition
 * Comprehensive system for touch, swipe, pinch, and complex gestures
 */

import { Variants, PanInfo, DragControls } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';

/**
 * Touch Interaction Variants
 * Responsive animations for different touch states
 */
export const touchInteractionVariants: Variants = {
  // Initial touch state
  idle: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    x: 0,
    y: 0,
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  // Touch press feedback
  pressed: {
    scale: 0.95,
    opacity: 0.8,
    transition: {
      duration: 0.1,
      ease: appleEasing.sharp,
    },
  },
  
  // Dragging state
  dragging: {
    scale: 1.05,
    opacity: 0.9,
    rotate: 2,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  // Swiping feedback
  swiping: {
    scale: 0.98,
    opacity: 0.7,
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  // Long press state
  longPress: {
    scale: 1.02,
    opacity: 1,
    boxShadow: '0 0 0 4px rgba(122, 139, 115, 0.2)',
    transition: {
      duration: timing.normal,
      ease: appleEasing.gentle,
    },
  },
  
  // Release with momentum
  released: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    x: 0,
    y: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
};

/**
 * Gesture Response Animations
 * Specific animations for recognized gestures
 */
export const gestureResponseVariants: Variants = {
  // Swipe left response
  swipeLeft: {
    x: -100,
    opacity: 0,
    rotate: -5,
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
  
  // Swipe right response
  swipeRight: {
    x: 100,
    opacity: 0,
    rotate: 5,
    transition: {
      duration: timing.normal,
      ease: appleEasing.sharp,
    },
  },
  
  // Swipe up response
  swipeUp: {
    y: -100,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Swipe down response
  swipeDown: {
    y: 100,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: timing.normal,
      ease: appleEasing.primary,
    },
  },
  
  // Pinch zoom in
  pinchIn: {
    scale: 1.2,
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
  
  // Pinch zoom out
  pinchOut: {
    scale: 0.8,
    transition: {
      duration: timing.fast,
      ease: appleEasing.primary,
    },
  },
};

/**
 * Advanced Touch Response Manager
 * Handles complex touch interactions and gesture recognition
 */
export class TouchResponseManager {
  private element: HTMLElement | null = null;
  private isTracking = false;
  private touchStartTime = 0;
  private touchStartPosition = { x: 0, y: 0 };
  private currentTouches = new Map<number, Touch>();
  private gestureCallbacks: Map<string, (data: any) => void> = new Map();
  private longPressTimer: NodeJS.Timeout | null = null;
  private longPressThreshold = 500; // milliseconds
  private swipeThreshold = 50; // pixels
  private velocityThreshold = 0.5; // pixels per millisecond
  
  /**
   * Initialize touch tracking on element
   */
  initializeTouchTracking(element: HTMLElement): void {
    this.element = element;
    this.isTracking = true;
    
    // Add touch event listeners
    element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });
    
    // Add mouse events for desktop testing
    element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    element.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }
  
  /**
   * Stop touch tracking
   */
  stopTouchTracking(): void {
    if (!this.element) return;
    
    // Remove all event listeners
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
    this.element.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    
    this.isTracking = false;
    this.element = null;
    this.clearLongPressTimer();
  }
  
  /**
   * Register gesture callback
   */
  onGesture(gesture: string, callback: (data: any) => void): void {
    this.gestureCallbacks.set(gesture, callback);
  }
  
  /**
   * Remove gesture callback
   */
  offGesture(gesture: string): void {
    this.gestureCallbacks.delete(gesture);
  }
  
  /**
   * Handle touch start
   */
  private handleTouchStart(event: TouchEvent): void {
    if (!this.isTracking) return;
    
    this.touchStartTime = Date.now();
    
    // Handle multiple touches
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      this.currentTouches.set(touch.identifier, touch);
      
      if (i === 0) {
        this.touchStartPosition = { x: touch.clientX, y: touch.clientY };
        this.startLongPressTimer();
      }
    }
    
    // Trigger press callback
    this.triggerGesture('press', {
      position: this.touchStartPosition,
      touches: this.currentTouches.size,
    });
    
    // Prevent default for gesture handling
    if (this.currentTouches.size > 1) {
      event.preventDefault();
    }
  }
  
  /**
   * Handle touch move
   */
  private handleTouchMove(event: TouchEvent): void {
    if (!this.isTracking || this.currentTouches.size === 0) return;
    
    // Clear long press timer on move
    this.clearLongPressTimer();
    
    // Update current touches
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      this.currentTouches.set(touch.identifier, touch);
    }
    
    if (this.currentTouches.size === 1) {
      // Single touch - handle swipe
      this.handleSwipeDetection(event.changedTouches[0]);
    } else if (this.currentTouches.size === 2) {
      // Two touches - handle pinch
      this.handlePinchDetection();
    }
    
    // Trigger drag callback
    this.triggerGesture('drag', {
      touches: Array.from(this.currentTouches.values()),
      delta: this.calculateTouchDelta(event.changedTouches[0]),
    });
    
    event.preventDefault();
  }
  
  /**
   * Handle touch end
   */
  private handleTouchEnd(event: TouchEvent): void {
    if (!this.isTracking) return;
    
    const touchDuration = Date.now() - this.touchStartTime;
    this.clearLongPressTimer();
    
    // Remove ended touches
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      this.currentTouches.delete(touch.identifier);
      
      if (this.currentTouches.size === 0) {
        // Last touch ended - check for tap or swipe
        const delta = this.calculateTouchDelta(touch);
        const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
        const velocity = distance / touchDuration;
        
        if (distance < 10 && touchDuration < 300) {
          // Quick tap
          this.triggerGesture('tap', {
            position: { x: touch.clientX, y: touch.clientY },
            duration: touchDuration,
          });
        } else if (velocity > this.velocityThreshold) {
          // Swipe gesture
          this.recognizeSwipeDirection(delta, velocity);
        }
      }
    }
    
    // Trigger release callback
    this.triggerGesture('release', {
      duration: touchDuration,
      finalTouches: this.currentTouches.size,
    });
  }
  
  /**
   * Handle touch cancel
   */
  private handleTouchCancel(event: TouchEvent): void {
    this.clearLongPressTimer();
    this.currentTouches.clear();
    
    this.triggerGesture('cancel', {
      reason: 'touch_cancelled',
    });
  }
  
  /**
   * Handle mouse events for desktop testing
   */
  private handleMouseDown(event: MouseEvent): void {
    this.handleTouchStart({
      changedTouches: [{
        identifier: 0,
        clientX: event.clientX,
        clientY: event.clientY,
      }] as any,
      preventDefault: () => event.preventDefault(),
    } as TouchEvent);
  }
  
  private handleMouseMove(event: MouseEvent): void {
    if (this.currentTouches.size === 0) return;
    
    this.handleTouchMove({
      changedTouches: [{
        identifier: 0,
        clientX: event.clientX,
        clientY: event.clientY,
      }] as any,
      preventDefault: () => event.preventDefault(),
    } as TouchEvent);
  }
  
  private handleMouseUp(event: MouseEvent): void {
    this.handleTouchEnd({
      changedTouches: [{
        identifier: 0,
        clientX: event.clientX,
        clientY: event.clientY,
      }] as any,
      preventDefault: () => event.preventDefault(),
    } as TouchEvent);
  }
  
  /**
   * Handle swipe detection
   */
  private handleSwipeDetection(touch: Touch): void {
    const delta = this.calculateTouchDelta(touch);
    const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    
    if (distance > this.swipeThreshold) {
      this.triggerGesture('swipe', {
        direction: this.getSwipeDirection(delta),
        distance,
        delta,
      });
    }
  }
  
  /**
   * Handle pinch detection
   */
  private handlePinchDetection(): void {
    const touches = Array.from(this.currentTouches.values());
    if (touches.length !== 2) return;
    
    const distance = this.calculateTouchDistance(touches[0], touches[1]);
    
    this.triggerGesture('pinch', {
      distance,
      center: this.calculateTouchCenter(touches[0], touches[1]),
    });
  }
  
  /**
   * Start long press timer
   */
  private startLongPressTimer(): void {
    this.clearLongPressTimer();
    
    this.longPressTimer = setTimeout(() => {
      this.triggerGesture('longPress', {
        position: this.touchStartPosition,
        duration: this.longPressThreshold,
      });
    }, this.longPressThreshold);
  }
  
  /**
   * Clear long press timer
   */
  private clearLongPressTimer(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }
  
  /**
   * Calculate touch delta from start position
   */
  private calculateTouchDelta(touch: Touch): { x: number; y: number } {
    return {
      x: touch.clientX - this.touchStartPosition.x,
      y: touch.clientY - this.touchStartPosition.y,
    };
  }
  
  /**
   * Calculate distance between two touches
   */
  private calculateTouchDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * Calculate center point between two touches
   */
  private calculateTouchCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }
  
  /**
   * Recognize swipe direction from delta
   */
  private recognizeSwipeDirection(delta: { x: number; y: number }, velocity: number): void {
    const absX = Math.abs(delta.x);
    const absY = Math.abs(delta.y);
    
    let direction: string;
    
    if (absX > absY) {
      direction = delta.x > 0 ? 'right' : 'left';
    } else {
      direction = delta.y > 0 ? 'down' : 'up';
    }
    
    this.triggerGesture('swipe', {
      direction,
      velocity,
      delta,
      distance: Math.sqrt(delta.x * delta.x + delta.y * delta.y),
    });
  }
  
  /**
   * Get swipe direction from delta
   */
  private getSwipeDirection(delta: { x: number; y: number }): string {
    const absX = Math.abs(delta.x);
    const absY = Math.abs(delta.y);
    
    if (absX > absY) {
      return delta.x > 0 ? 'right' : 'left';
    } else {
      return delta.y > 0 ? 'down' : 'up';
    }
  }
  
  /**
   * Trigger gesture callback
   */
  private triggerGesture(gesture: string, data: any): void {
    const callback = this.gestureCallbacks.get(gesture);
    if (callback) {
      callback(data);
    }
  }
}

/**
 * Touch Feedback Visual Effects
 */
export const touchFeedbackEffects = {
  /**
   * Create touch ripple at position
   */
  createTouchRipple(element: HTMLElement, x: number, y: number): void {
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(122, 139, 115, 0.3);
      width: ${size}px;
      height: ${size}px;
      left: ${x - rect.left - size / 2}px;
      top: ${y - rect.top - size / 2}px;
      transform: scale(0);
      animation: touch-ripple-animation 0.6s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  },
  
  /**
   * Create long press glow effect
   */
  createLongPressGlow(element: HTMLElement): void {
    element.style.boxShadow = '0 0 0 4px rgba(122, 139, 115, 0.3)';
    element.style.transition = 'box-shadow 0.3s ease';
    
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 1000);
  },
  
  /**
   * Create swipe trail effect
   */
  createSwipeTrail(element: HTMLElement, direction: string): void {
    const trail = document.createElement('div');
    trail.className = 'swipe-trail';
    
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)',
    };
    
    trail.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(122, 139, 115, 0.2), transparent);
      transform: ${transforms[direction as keyof typeof transforms] || 'translateX(0)'};
      animation: swipe-trail-animation 0.3s ease-out;
      pointer-events: none;
      z-index: 999;
    `;
    
    element.appendChild(trail);
    
    setTimeout(() => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    }, 300);
  },
};

/**
 * CSS Keyframes for Touch Effects
 */
export const touchEffectStyles = `
  @keyframes touch-ripple-animation {
    to {
      transform: scale(1);
      opacity: 0;
    }
  }
  
  @keyframes swipe-trail-animation {
    from {
      opacity: 0.8;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(1.1);
    }
  }
`;

/**
 * Global Touch Response Manager Instance
 */
export const globalTouchManager = new TouchResponseManager();

/**
 * Touch Response Utility Functions
 */
export const touchResponseUtils = {
  /**
   * Enable touch interactions on element
   */
  enableTouchInteractions(
    element: HTMLElement,
    options: {
      onTap?: (data: any) => void;
      onSwipe?: (data: any) => void;
      onLongPress?: (data: any) => void;
      onPinch?: (data: any) => void;
    } = {}
  ): TouchResponseManager {
    const manager = new TouchResponseManager();
    manager.initializeTouchTracking(element);
    
    // Register callbacks
    if (options.onTap) manager.onGesture('tap', options.onTap);
    if (options.onSwipe) manager.onGesture('swipe', options.onSwipe);
    if (options.onLongPress) manager.onGesture('longPress', options.onLongPress);
    if (options.onPinch) manager.onGesture('pinch', options.onPinch);
    
    return manager;
  },
  
  /**
   * Disable touch interactions
   */
  disableTouchInteractions(manager: TouchResponseManager): void {
    manager.stopTouchTracking();
  },
  
  /**
   * Create custom gesture recognizer
   */
  createCustomGesture(
    name: string,
    recognizer: (touches: Touch[], duration: number) => boolean
  ): (manager: TouchResponseManager) => void {
    return (manager: TouchResponseManager) => {
      manager.onGesture('drag', (data) => {
        if (recognizer(data.touches, Date.now() - data.startTime)) {
          manager.onGesture(name, data);
        }
      });
    };
  },
};

/**
 * Export touch response system
 */
export const touchResponseSystem = {
  variants: touchInteractionVariants,
  gestures: gestureResponseVariants,
  manager: TouchResponseManager,
  effects: touchFeedbackEffects,
  styles: touchEffectStyles,
  utils: touchResponseUtils,
  global: globalTouchManager,
} as const; 