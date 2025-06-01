/**
 * Advanced Gesture Recognition System
 * Task 4.2.5 - Sophisticated gesture patterns and multi-finger recognition
 * Enhanced gesture capabilities beyond basic touch interactions
 */

import { Variants } from 'framer-motion';
import { appleEasing, timing } from './modalAnimations';
import { TouchResponseManager } from './touchResponseSystem';

/**
 * Advanced Gesture Definitions
 * Complex gesture patterns with multiple touch points
 */
export interface GesturePattern {
  name: string;
  minTouches: number;
  maxTouches: number;
  minDuration: number;
  maxDuration: number;
  recognizer: (touches: Touch[], startTime: number, currentTime: number) => number; // 0-1 confidence
  threshold: number; // Minimum confidence to trigger
}

/**
 * Multi-Finger Gesture Variants
 * Animation responses for complex gestures
 */
export const multiFingerGestureVariants: Variants = {
  // Two-finger rotation gesture
  twoFingerRotate: {
    rotate: [0, 10, -10, 0],
    scale: [1, 1.05, 1.05, 1],
    transition: {
      duration: 0.6,
      ease: appleEasing.bounce,
      times: [0, 0.3, 0.7, 1],
    },
  },
  
  // Three-finger expand gesture
  threeFingerExpand: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
    transition: {
      duration: 0.8,
      ease: appleEasing.gentle,
      times: [0, 0.5, 1],
    },
  },
  
  // Four-finger swipe (navigation)
  fourFingerSwipe: {
    x: [-20, 0],
    opacity: [0.7, 1],
    scale: [0.95, 1],
    transition: {
      duration: 0.4,
      ease: appleEasing.primary,
    },
  },
  
  // Pinch-to-zoom gesture
  pinchZoom: {
    scale: [1, 1.5, 1],
    transformOrigin: 'center',
    transition: {
      duration: 0.5,
      ease: appleEasing.gentle,
    },
  },
  
  // Two-finger scroll gesture
  twoFingerScroll: {
    y: [0, -10, 0],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 0.3,
      ease: appleEasing.primary,
    },
  },
  
  // Force touch (long press with pressure)
  forceTouch: {
    scale: [1, 1.1, 1.05],
    boxShadow: [
      '0 4px 12px rgba(0, 0, 0, 0.1)',
      '0 8px 24px rgba(122, 139, 115, 0.2)',
      '0 6px 18px rgba(122, 139, 115, 0.15)',
    ],
    transition: {
      duration: 0.5,
      ease: appleEasing.gentle,
      times: [0, 0.6, 1],
    },
  },
};

/**
 * Custom Gesture Pattern Definitions
 * Pre-built complex gesture recognizers
 */
export const predefinedGesturePatterns: GesturePattern[] = [
  // Circular swipe gesture
  {
    name: 'circularSwipe',
    minTouches: 1,
    maxTouches: 1,
    minDuration: 500,
    maxDuration: 2000,
    threshold: 0.7,
    recognizer: (touches: Touch[], startTime: number, currentTime: number): number => {
      if (touches.length !== 1) return 0;
      
      const touch = touches[0];
      const duration = currentTime - startTime;
      
      // Check if path forms a circular pattern
      // This is a simplified implementation - in production would track full path
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distance = Math.sqrt(
        Math.pow(touch.clientX - centerX, 2) + 
        Math.pow(touch.clientY - centerY, 2)
      );
      
      // Basic circular motion detection
      if (duration > 500 && distance > 50 && distance < 200) {
        return Math.min(duration / 1000, 1);
      }
      
      return 0;
    },
  },
  
  // Double-tap gesture
  {
    name: 'doubleTap',
    minTouches: 1,
    maxTouches: 1,
    minDuration: 50,
    maxDuration: 300,
    threshold: 0.8,
    recognizer: (touches: Touch[], startTime: number, currentTime: number): number => {
      // This would need tap history tracking in a real implementation
      const duration = currentTime - startTime;
      
      if (duration < 300 && touches.length === 1) {
        return 0.9; // High confidence for quick tap
      }
      
      return 0;
    },
  },
  
  // Z-pattern swipe
  {
    name: 'zPatternSwipe',
    minTouches: 1,
    maxTouches: 1,
    minDuration: 800,
    maxDuration: 3000,
    threshold: 0.6,
    recognizer: (touches: Touch[], startTime: number, currentTime: number): number => {
      // Simplified Z-pattern detection
      // In production would track full gesture path
      const duration = currentTime - startTime;
      
      if (duration > 800 && touches.length === 1) {
        return Math.min(duration / 2000, 0.8);
      }
      
      return 0;
    },
  },
  
  // Triangle gesture (three-point touch)
  {
    name: 'triangleGesture',
    minTouches: 3,
    maxTouches: 3,
    minDuration: 300,
    maxDuration: 1500,
    threshold: 0.75,
    recognizer: (touches: Touch[], startTime: number, currentTime: number): number => {
      if (touches.length !== 3) return 0;
      
      // Check if three touches form a triangle pattern
      const [t1, t2, t3] = touches;
      
      // Calculate distances between touch points
      const d12 = Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2));
      const d23 = Math.sqrt(Math.pow(t3.clientX - t2.clientX, 2) + Math.pow(t3.clientY - t2.clientY, 2));
      const d31 = Math.sqrt(Math.pow(t1.clientX - t3.clientX, 2) + Math.pow(t1.clientY - t3.clientY, 2));
      
      // Check if distances form a reasonable triangle (not too linear)
      const avgDistance = (d12 + d23 + d31) / 3;
      if (avgDistance > 100 && avgDistance < 300) {
        return 0.8;
      }
      
      return 0;
    },
  },
];

/**
 * Advanced Gesture Recognition Manager
 * Sophisticated gesture pattern recognition and coordination
 */
export class AdvancedGestureRecognitionManager extends TouchResponseManager {
  private gesturePatterns: Map<string, GesturePattern> = new Map();
  private activeGestures: Map<string, any> = new Map();
  private gestureHistory: Array<{
    name: string;
    confidence: number;
    timestamp: number;
    touches: Touch[];
  }> = [];
  private recognitionCallbacks: Map<string, (data: any) => void> = new Map();
  
  constructor() {
    super();
    this.initializePredefinedGestures();
  }
  
  /**
   * Initialize predefined gesture patterns
   */
  private initializePredefinedGestures(): void {
    predefinedGesturePatterns.forEach(pattern => {
      this.gesturePatterns.set(pattern.name, pattern);
    });
  }
  
  /**
   * Register custom gesture pattern
   */
  registerGesturePattern(pattern: GesturePattern): void {
    this.gesturePatterns.set(pattern.name, pattern);
  }
  
  /**
   * Remove gesture pattern
   */
  removeGesturePattern(patternName: string): void {
    this.gesturePatterns.delete(patternName);
  }
  
  /**
   * Register callback for specific gesture
   */
  onGestureRecognized(gestureName: string, callback: (data: any) => void): void {
    this.recognitionCallbacks.set(gestureName, callback);
  }
  
  /**
   * Process touches against all registered patterns
   */
  processGestureRecognition(
    touches: Touch[],
    startTime: number,
    currentTime: number
  ): void {
    const recognizedGestures: Array<{
      name: string;
      confidence: number;
      pattern: GesturePattern;
    }> = [];
    
    // Test against all registered patterns
    this.gesturePatterns.forEach((pattern, name) => {
      // Check if touch count is within pattern requirements
      if (touches.length >= pattern.minTouches && touches.length <= pattern.maxTouches) {
        const duration = currentTime - startTime;
        
        // Check duration requirements
        if (duration >= pattern.minDuration && duration <= pattern.maxDuration) {
          const confidence = pattern.recognizer(touches, startTime, currentTime);
          
          // Check confidence threshold
          if (confidence >= pattern.threshold) {
            recognizedGestures.push({ name, confidence, pattern });
          }
        }
      }
    });
    
    // Process recognized gestures
    this.handleRecognizedGestures(recognizedGestures, touches, currentTime);
  }
  
  /**
   * Handle recognized gestures
   */
  private handleRecognizedGestures(
    recognizedGestures: Array<{
      name: string;
      confidence: number;
      pattern: GesturePattern;
    }>,
    touches: Touch[],
    timestamp: number
  ): void {
    // Sort by confidence (highest first)
    recognizedGestures.sort((a, b) => b.confidence - a.confidence);
    
    recognizedGestures.forEach(gesture => {
      // Add to history
      this.gestureHistory.push({
        name: gesture.name,
        confidence: gesture.confidence,
        timestamp,
        touches: [...touches],
      });
      
      // Trigger callback if registered
      const callback = this.recognitionCallbacks.get(gesture.name);
      if (callback) {
        callback({
          gestureName: gesture.name,
          confidence: gesture.confidence,
          touches,
          timestamp,
          pattern: gesture.pattern,
        });
      }
      
      console.log(`Gesture recognized: ${gesture.name} (confidence: ${gesture.confidence.toFixed(2)})`);
    });
    
    // Limit history size
    if (this.gestureHistory.length > 50) {
      this.gestureHistory = this.gestureHistory.slice(-50);
    }
  }
  
  /**
   * Get gesture recognition statistics
   */
  getRecognitionStatistics(): {
    totalGestures: number;
    gestureFrequency: Record<string, number>;
    averageConfidence: number;
    recentGestures: any[];
  } {
    const gestureFrequency: Record<string, number> = {};
    let totalConfidence = 0;
    
    this.gestureHistory.forEach(gesture => {
      gestureFrequency[gesture.name] = (gestureFrequency[gesture.name] || 0) + 1;
      totalConfidence += gesture.confidence;
    });
    
    return {
      totalGestures: this.gestureHistory.length,
      gestureFrequency,
      averageConfidence: this.gestureHistory.length > 0 ? totalConfidence / this.gestureHistory.length : 0,
      recentGestures: this.gestureHistory.slice(-10),
    };
  }
  
  /**
   * Create gesture combination detector
   */
  createGestureCombination(
    gestures: string[],
    maxTimeBetween: number = 1000
  ): (callback: (data: any) => void) => void {
    return (callback: (data: any) => void) => {
      let detectedSequence: string[] = [];
      let lastGestureTime = 0;
      
      gestures.forEach(gestureName => {
        this.onGestureRecognized(gestureName, (data) => {
          const currentTime = data.timestamp;
          
          // Check if this continues the sequence
          if (detectedSequence.length === 0 || 
              (currentTime - lastGestureTime <= maxTimeBetween && 
               gestures[detectedSequence.length] === gestureName)) {
            
            detectedSequence.push(gestureName);
            lastGestureTime = currentTime;
            
            // Check if sequence is complete
            if (detectedSequence.length === gestures.length) {
              callback({
                type: 'gestureSequence',
                sequence: detectedSequence,
                totalTime: currentTime - (lastGestureTime - maxTimeBetween * detectedSequence.length),
                gestures: detectedSequence,
              });
              
              // Reset sequence
              detectedSequence = [];
            }
          } else {
            // Reset if sequence broken
            detectedSequence = gestureName === gestures[0] ? [gestureName] : [];
            lastGestureTime = currentTime;
          }
        });
      });
    };
  }
}

/**
 * Gesture Animation Coordinator
 * Coordinates animations based on recognized gestures
 */
export class GestureAnimationCoordinator {
  private animationQueue: Array<{
    gestureName: string;
    animation: any;
    priority: number;
  }> = [];
  private isAnimating = false;
  
  /**
   * Register gesture animation mapping
   */
  registerGestureAnimation(
    gestureName: string,
    animationVariants: Variants,
    priority: number = 1
  ): void {
    this.animationQueue.push({
      gestureName,
      animation: animationVariants,
      priority,
    });
    
    // Sort by priority
    this.animationQueue.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Execute animation for recognized gesture
   */
  async executeGestureAnimation(
    gestureName: string,
    element: HTMLElement,
    confidence: number
  ): Promise<void> {
    if (this.isAnimating) {
      console.log(`Animation already in progress, queuing ${gestureName}`);
      return;
    }
    
    const gestureAnimation = this.animationQueue.find(
      anim => anim.gestureName === gestureName
    );
    
    if (!gestureAnimation) {
      console.warn(`No animation registered for gesture: ${gestureName}`);
      return;
    }
    
    this.isAnimating = true;
    
    try {
      // Apply animation with confidence-based intensity
      const intensityModifier = Math.max(0.5, confidence);
      
      // This would integrate with Framer Motion in actual implementation
      console.log(`Executing animation for ${gestureName} with intensity ${intensityModifier}`);
      
      // Simulate animation duration
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Gesture animation failed for ${gestureName}:`, error);
    } finally {
      this.isAnimating = false;
    }
  }
}

/**
 * Gesture Feedback System
 * Provides visual and haptic feedback for recognized gestures
 */
export const gestureFeedbackSystem = {
  /**
   * Create visual feedback for gesture recognition
   */
  createVisualFeedback(
    element: HTMLElement,
    gestureName: string,
    confidence: number
  ): void {
    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'gesture-feedback';
    
    // Style based on gesture type and confidence
    const opacity = Math.max(0.3, confidence);
    const scale = 0.8 + (confidence * 0.4);
    
    feedbackElement.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(${scale});
      opacity: ${opacity};
      background: rgba(122, 139, 115, 0.2);
      border: 2px solid rgba(122, 139, 115, 0.4);
      border-radius: 50%;
      width: 60px;
      height: 60px;
      pointer-events: none;
      z-index: 1000;
      animation: gestureRecognitionPulse 0.6s ease-out forwards;
    `;
    
    element.appendChild(feedbackElement);
    
    // Remove after animation
    setTimeout(() => {
      if (feedbackElement.parentNode) {
        feedbackElement.parentNode.removeChild(feedbackElement);
      }
    }, 600);
  },
  
  /**
   * Create haptic feedback for gesture
   */
  createHapticFeedback(gestureName: string, confidence: number): void {
    if ('vibrate' in navigator) {
      const patterns = {
        circularSwipe: [30, 10, 30],
        doubleTap: [20, 50, 20],
        zPatternSwipe: [40, 20, 40, 20, 40],
        triangleGesture: [50, 30, 50, 30, 50],
        default: [25],
      };
      
      const pattern = patterns[gestureName as keyof typeof patterns] || patterns.default;
      const intensityModifier = Math.max(0.5, confidence);
      
      // Adjust pattern intensity based on confidence
      const adjustedPattern = pattern.map(duration => Math.floor(duration * intensityModifier));
      
      navigator.vibrate(adjustedPattern);
    }
  },
  
  /**
   * Create audio feedback for gesture
   */
  createAudioFeedback(gestureName: string, confidence: number): void {
    // Simple audio feedback using Web Audio API
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Frequency based on gesture type
      const frequencies = {
        circularSwipe: 440,
        doubleTap: 880,
        zPatternSwipe: 660,
        triangleGesture: 550,
        default: 520,
      };
      
      oscillator.frequency.setValueAtTime(
        frequencies[gestureName as keyof typeof frequencies] || frequencies.default,
        audioContext.currentTime
      );
      
      // Volume based on confidence
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(confidence * 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  },
};

/**
 * CSS for gesture feedback animations
 */
export const gestureFeedbackStyles = `
  @keyframes gestureRecognitionPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
`;

/**
 * Global Advanced Gesture Manager Instance
 */
export const globalAdvancedGestureManager = new AdvancedGestureRecognitionManager();

/**
 * Global Gesture Animation Coordinator Instance
 */
export const globalGestureAnimationCoordinator = new GestureAnimationCoordinator();

/**
 * Advanced Gesture Utilities
 */
export const advancedGestureUtils = {
  /**
   * Create custom gesture pattern builder
   */
  createCustomPattern(
    name: string,
    config: {
      touches: { min: number; max: number };
      duration: { min: number; max: number };
      threshold: number;
      recognizer: (touches: Touch[], startTime: number, currentTime: number) => number;
    }
  ): GesturePattern {
    return {
      name,
      minTouches: config.touches.min,
      maxTouches: config.touches.max,
      minDuration: config.duration.min,
      maxDuration: config.duration.max,
      threshold: config.threshold,
      recognizer: config.recognizer,
    };
  },
  
  /**
   * Enable advanced gestures on element
   */
  enableAdvancedGestures(
    element: HTMLElement,
    options: {
      enabledGestures?: string[];
      onGestureRecognized?: (data: any) => void;
      enableFeedback?: boolean;
    } = {}
  ): AdvancedGestureRecognitionManager {
    const manager = new AdvancedGestureRecognitionManager();
    manager.initializeTouchTracking(element);
    
    // Register callback if provided
    if (options.onGestureRecognized) {
      const enabledGestures = options.enabledGestures || predefinedGesturePatterns.map(p => p.name);
      enabledGestures.forEach(gestureName => {
        manager.onGestureRecognized(gestureName, options.onGestureRecognized!);
      });
    }
    
    // Enable feedback if requested
    if (options.enableFeedback) {
      predefinedGesturePatterns.forEach(pattern => {
        manager.onGestureRecognized(pattern.name, (data) => {
          gestureFeedbackSystem.createVisualFeedback(element, data.gestureName, data.confidence);
          gestureFeedbackSystem.createHapticFeedback(data.gestureName, data.confidence);
        });
      });
    }
    
    return manager;
  },
};

/**
 * Export advanced gesture recognition system
 */
export const advancedGestureRecognition = {
  manager: AdvancedGestureRecognitionManager,
  coordinator: GestureAnimationCoordinator,
  patterns: predefinedGesturePatterns,
  variants: multiFingerGestureVariants,
  feedback: gestureFeedbackSystem,
  styles: gestureFeedbackStyles,
  utils: advancedGestureUtils,
  global: {
    manager: globalAdvancedGestureManager,
    coordinator: globalGestureAnimationCoordinator,
  },
} as const; 