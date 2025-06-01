/**
 * Enhanced Navigation Card Component
 * Task 4.3.2 - Homepage component with integrated advanced animations
 * Comprehensive animation integration with all Phase 4 animation systems
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { modalAnimations, appleEasing, timing } from '@/animations/modalAnimations';
import { cardTransitions } from '@/animations/cardTransitions';
import { microInteractionSystem, globalMicroInteractionManager } from '@/animations/microInteractionSystem';
import { touchResponseSystem, globalTouchResponseManager } from '@/animations/touchResponseSystem';
import { advancedGestureRecognition, globalAdvancedGestureManager } from '@/animations/advancedGestureRecognition';
import { modalContentStagger, globalContentStaggerOrchestrator } from '@/animations/modalContentStagger';
import { modalPerformanceValidation, globalPerformanceMonitor } from '@/animations/modalPerformanceValidation';

/**
 * Enhanced Navigation Card Props
 */
export interface EnhancedNavigationCardProps {
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Click handler */
  onClick: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Animation profile */
  animationProfile?: 'smooth' | 'dramatic' | 'subtle' | 'performance';
  /** Enable advanced features */
  enableGestures?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableMicroInteractions?: boolean;
  /** Card priority for stagger timing */
  priority?: 'high' | 'medium' | 'low';
  /** Card index for stagger calculation */
  index?: number;
}

/**
 * Enhanced Navigation Card Component
 * Integrated with all Phase 4 animation systems
 */
export default function EnhancedNavigationCard({
  title,
  description,
  onClick,
  className = '',
  animationProfile = 'smooth',
  enableGestures = true,
  enablePerformanceMonitoring = true,
  enableMicroInteractions = true,
  priority = 'medium',
  index = 0,
}: EnhancedNavigationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [gestureData, setGestureData] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  
  // Motion values for sophisticated interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  const elevation = useSpring(0, { stiffness: 400, damping: 40 });
  
  // Animation variants based on profile
  const getAnimationVariants = useCallback(() => {
    const profiles = {
      smooth: {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: {
            duration: timing.slow,
            ease: appleEasing.gentle,
            delay: index * 0.1,
          },
        },
        hover: {
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(122, 139, 115, 0.15)',
          transition: { duration: timing.normal, ease: appleEasing.primary },
        },
        tap: {
          scale: 0.98,
          y: -4,
          transition: { duration: timing.fast, ease: appleEasing.sharp },
        },
      },
      dramatic: {
        initial: { opacity: 0, y: 40, scale: 0.8, rotateX: 15 },
        visible: {
          opacity: 1, y: 0, scale: 1, rotateX: 0,
          transition: {
            duration: timing.verySlow,
            ease: appleEasing.bounce,
            delay: index * 0.15,
          },
        },
        hover: {
          y: -12,
          scale: 1.05,
          rotateX: -5,
          boxShadow: '0 25px 50px rgba(122, 139, 115, 0.2)',
          transition: { duration: timing.normal, ease: appleEasing.primary },
        },
        tap: {
          scale: 0.95,
          rotateX: 2,
          transition: { duration: timing.fast, ease: appleEasing.sharp },
        },
      },
      subtle: {
        initial: { opacity: 0, y: 10 },
        visible: {
          opacity: 1, y: 0,
          transition: {
            duration: timing.normal,
            ease: appleEasing.gentle,
            delay: index * 0.05,
          },
        },
        hover: {
          y: -2,
          boxShadow: '0 8px 16px rgba(122, 139, 115, 0.08)',
          transition: { duration: timing.fast, ease: appleEasing.primary },
        },
        tap: {
          scale: 0.99,
          transition: { duration: timing.fast, ease: appleEasing.sharp },
        },
      },
      performance: {
        initial: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: timing.fast,
            delay: index * 0.02,
          },
        },
        hover: {
          boxShadow: '0 4px 8px rgba(122, 139, 115, 0.1)',
          transition: { duration: timing.fast },
        },
        tap: {
          scale: 0.98,
          transition: { duration: timing.fast },
        },
      },
    };
    
    return profiles[animationProfile];
  }, [animationProfile, index]);
  
  // Initialize animation systems
  useEffect(() => {
    if (!cardRef.current) return;
    
    const cardElement = cardRef.current;
    const cardId = `navigation-card-${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Initialize performance monitoring
    if (enablePerformanceMonitoring) {
      initializePerformanceMonitoring(cardId);
    }
    
    // Initialize micro-interactions
    if (enableMicroInteractions) {
      initializeMicroInteractions(cardElement);
    }
    
    // Initialize gesture recognition
    if (enableGestures) {
      initializeGestureRecognition(cardElement, cardId);
    }
    
    // Register for content stagger
    globalContentStaggerOrchestrator.registerContent(cardId, cardElement, {
      type: 'card',
      section: 'navigation',
      length: title.length + description.length,
      priority,
    });
    
    return () => {
      // Cleanup
      globalContentStaggerOrchestrator.clearContentQueue();
    };
  }, [title, description, enablePerformanceMonitoring, enableMicroInteractions, enableGestures, priority]);
  
  // Initialize performance monitoring
  const initializePerformanceMonitoring = useCallback(async (cardId: string) => {
    try {
      globalPerformanceMonitor.startMonitoring(cardId);
      
      // Monitor for 2 seconds then get metrics
      setTimeout(async () => {
        const metrics = globalPerformanceMonitor.stopMonitoring();
        setPerformanceMetrics(metrics);
        
        if (metrics && metrics.frameRate.average < 55) {
          console.warn(`Card performance below 60fps: ${cardId}`, metrics);
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }, []);
  
  // Initialize micro-interactions
  const initializeMicroInteractions = useCallback((element: HTMLElement) => {
    try {
      globalMicroInteractionManager.applyCardMicroInteraction(element, 'subtle', {
        enableHaptic: false,
        enableVisualFeedback: true,
        enableAnalytics: enablePerformanceMonitoring,
      });
    } catch (error) {
      console.error('Failed to initialize micro-interactions:', error);
    }
  }, [enablePerformanceMonitoring]);
  
  // Initialize gesture recognition
  const initializeGestureRecognition = useCallback((element: HTMLElement, cardId: string) => {
    try {
      // Enable basic gestures for cards
      globalAdvancedGestureManager.onGestureRecognized('doubleTap', (data) => {
        console.log(`Double tap on card: ${cardId}`);
        setGestureData(data);
        // Trigger special animation or action
        scale.set(1.1);
        setTimeout(() => scale.set(1), 200);
      });
      
      // Initialize touch tracking
      globalTouchResponseManager.initializeTouchTracking(element);
    } catch (error) {
      console.error('Failed to initialize gesture recognition:', error);
    }
  }, [scale]);
  
  // Handle mouse move for 3D tilt effect
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  }, [mouseX, mouseY]);
  
  // Handle hover state
  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
    scale.set(1.02);
    elevation.set(12);
  }, [scale, elevation]);
  
  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    scale.set(1);
    elevation.set(0);
    mouseX.set(0);
    mouseY.set(0);
  }, [scale, elevation, mouseX, mouseY]);
  
  // Handle press state
  const handleTapStart = useCallback(() => {
    setIsPressed(true);
    scale.set(0.98);
  }, [scale]);
  
  const handleTapEnd = useCallback(() => {
    setIsPressed(false);
    scale.set(isHovered ? 1.02 : 1);
    onClick();
  }, [scale, isHovered, onClick]);
  
  const variants = getAnimationVariants();
  
  return (
    <motion.div
      ref={cardRef}
      className={`
        relative p-6 bg-white rounded-2xl border border-soft-beige/30 cursor-pointer
        hover:border-atlas-green/20 transition-colors duration-200
        ${className}
      `}
      variants={variants}
      initial="initial"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onMouseMove={handleMouseMove}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onTapStart={handleTapStart}
      onTap={handleTapEnd}
      style={{
        rotateX: animationProfile === 'dramatic' ? rotateX : 0,
        rotateY: animationProfile === 'dramatic' ? rotateY : 0,
        scale,
        boxShadow: useTransform(
          elevation,
          [0, 12],
          ['0 4px 12px rgba(122, 139, 115, 0.08)', '0 20px 40px rgba(122, 139, 115, 0.15)']
        ),
      }}
    >
      {/* Performance indicator (debug mode) */}
      {performanceMetrics && process.env.NODE_ENV === 'development' && (
        <motion.div
          className="absolute top-2 right-2 text-xs bg-slate-100 px-2 py-1 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {performanceMetrics.frameRate.average.toFixed(1)}fps
        </motion.div>
      )}
      
      {/* Gesture feedback indicator */}
      {gestureData && (
        <motion.div
          className="absolute top-2 left-2 w-3 h-3 bg-atlas-green rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Card content with staggered animations */}
      <motion.div
        className="space-y-3"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {/* Title */}
        <motion.h3
          className="font-serif text-xl font-semibold text-slate-900"
          variants={{
            initial: { opacity: 0, y: 10 },
            visible: {
              opacity: 1, y: 0,
              transition: { duration: timing.normal, ease: appleEasing.gentle },
            },
          }}
        >
          {title}
        </motion.h3>
        
        {/* Description */}
        <motion.p
          className="font-sans text-sm text-slate-600 leading-relaxed"
          variants={{
            initial: { opacity: 0, y: 10 },
            visible: {
              opacity: 1, y: 0,
              transition: { duration: timing.normal, ease: appleEasing.gentle },
            },
          }}
        >
          {description}
        </motion.p>
        
        {/* Interactive elements */}
        <motion.div
          className="flex items-center justify-between pt-2"
          variants={{
            initial: { opacity: 0, y: 10 },
            visible: {
              opacity: 1, y: 0,
              transition: { duration: timing.normal, ease: appleEasing.gentle },
            },
          }}
        >
          {/* Expand indicator */}
          <motion.div
            className="flex items-center text-xs text-atlas-green font-medium"
            whileHover={{ x: 2 }}
            transition={{ duration: timing.fast, ease: appleEasing.primary }}
          >
            <span>Explore</span>
            <motion.svg
              className="w-4 h-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: isHovered ? 2 : 0 }}
              transition={{ duration: timing.fast }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
          
          {/* Priority indicator */}
          <motion.div
            className={`
              w-2 h-2 rounded-full
              ${priority === 'high' ? 'bg-bright-orange' : 
                priority === 'medium' ? 'bg-atlas-green' : 'bg-slate-300'}
            `}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: appleEasing.gentle,
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Hover overlay effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-atlas-green/5 to-transparent rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: timing.normal, ease: appleEasing.gentle }}
      />
      
      {/* Press ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-atlas-green/10 rounded-2xl pointer-events-none"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: appleEasing.primary }}
        />
      )}
    </motion.div>
  );
} 