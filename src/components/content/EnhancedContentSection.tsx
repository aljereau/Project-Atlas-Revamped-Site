/**
 * Enhanced Content Section Component
 * Task 4.3.4 - Content component with integrated advanced animation systems
 * Sophisticated content presentation with orchestrated animations and interactions
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { modalAnimations, appleEasing, timing } from '@/animations/modalAnimations';
import { modalContentStagger, globalContentStaggerOrchestrator } from '@/animations/modalContentStagger';
import { microInteractionSystem, globalMicroInteractionManager } from '@/animations/microInteractionSystem';
import { touchResponseSystem, globalTouchResponseManager } from '@/animations/touchResponseSystem';
import { modalPerformanceValidation, globalPerformanceMonitor } from '@/animations/modalPerformanceValidation';
import { advancedGestureRecognition, globalAdvancedGestureManager } from '@/animations/advancedGestureRecognition';

/**
 * Content Section Props
 */
export interface EnhancedContentSectionProps {
  /** Section unique identifier */
  sectionId: string;
  /** Section title */
  title: string;
  /** Section content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Animation profile for content */
  animationProfile?: 'smooth' | 'dramatic' | 'subtle' | 'performance';
  /** Section priority for stagger timing */
  priority?: 'high' | 'medium' | 'low';
  /** Enable advanced features */
  enableGestures?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableMicroInteractions?: boolean;
  enableContentStagger?: boolean;
  /** Content type for optimized animations */
  contentType?: 'text' | 'media' | 'interactive' | 'mixed';
  /** Section layout mode */
  layout?: 'standard' | 'hero' | 'card' | 'minimal';
}

/**
 * Enhanced Content Section Component
 * Orchestrated content animations with advanced interactions
 */
export default function EnhancedContentSection({
  sectionId,
  title,
  children,
  className = '',
  animationProfile = 'smooth',
  priority = 'medium',
  enableGestures = true,
  enablePerformanceMonitoring = true,
  enableMicroInteractions = true,
  enableContentStagger = true,
  contentType = 'mixed',
  layout = 'standard',
}: EnhancedContentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [gestureData, setGestureData] = useState<any>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Intersection observer for viewport-based animations
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // Motion values for sophisticated interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sectionScale = useSpring(1, { stiffness: 300, damping: 30 });
  const contentOpacity = useSpring(1, { stiffness: 400, damping: 40 });
  const elevationLevel = useSpring(0, { stiffness: 500, damping: 50 });
  
  // Transform values for parallax and depth effects
  const titleY = useTransform(mouseY, [-200, 200], [10, -10]);
  const contentY = useTransform(mouseY, [-200, 200], [5, -5]);
  const rotateX = useTransform(mouseY, [-200, 200], [2, -2]);
  const rotateY = useTransform(mouseX, [-200, 200], [-1, 1]);
  
  // Initialize content animation systems
  useEffect(() => {
    if (isInView && !isInitialized) {
      initializeContentAnimations();
    }
  }, [isInView, isInitialized]);
  
  // Initialize animation systems for content section
  const initializeContentAnimations = useCallback(async () => {
    try {
      // Initialize performance monitoring
      if (enablePerformanceMonitoring) {
        await initializePerformanceMonitoring();
      }
      
      // Initialize content stagger system
      if (enableContentStagger) {
        await initializeContentStagger();
      }
      
      // Initialize micro-interactions
      if (enableMicroInteractions) {
        await initializeMicroInteractions();
      }
      
      // Initialize gesture recognition
      if (enableGestures) {
        await initializeGestureRecognition();
      }
      
      setIsInitialized(true);
      
    } catch (error) {
      console.error(`Failed to initialize animations for section ${sectionId}:`, error);
    }
  }, [sectionId, enablePerformanceMonitoring, enableContentStagger, enableMicroInteractions, enableGestures]);
  
  // Initialize performance monitoring
  const initializePerformanceMonitoring = useCallback(async () => {
    globalPerformanceMonitor.startMonitoring(sectionId);
    
    // Monitor for section performance
    setTimeout(async () => {
      const metrics = globalPerformanceMonitor.stopMonitoring();
      setPerformanceMetrics(metrics);
      
      if (metrics && metrics.frameRate.average < 55) {
        console.warn(`Content section ${sectionId} performance below 60fps:`, metrics);
      }
    }, 2000);
  }, [sectionId]);
  
  // Initialize content stagger orchestration
  const initializeContentStagger = useCallback(async () => {
    if (!sectionRef.current) return;
    
    // Register section title
    if (titleRef.current) {
      globalContentStaggerOrchestrator.registerContent(`${sectionId}-title`, titleRef.current, {
        type: 'text',
        section: 'header',
        length: title.length,
        priority: 'high',
      });
    }
    
    // Register section content
    if (contentRef.current) {
      globalContentStaggerOrchestrator.registerContent(`${sectionId}-content`, contentRef.current, {
        type: contentType,
        section: 'body',
        length: contentRef.current.textContent?.length || 500,
        priority,
      });
    }
    
    // Execute staggered reveal
    setTimeout(() => {
      globalContentStaggerOrchestrator.executeStaggeredReveal(sectionId);
    }, 200);
  }, [sectionId, title, contentType, priority]);
  
  // Initialize micro-interactions
  const initializeMicroInteractions = useCallback(async () => {
    if (!sectionRef.current) return;
    
    // Apply micro-interactions to interactive elements
    const interactiveElements = sectionRef.current.querySelectorAll('button, a, [data-interactive]');
    interactiveElements.forEach((element, index) => {
      try {
        globalMicroInteractionManager.applyGenericMicroInteraction(element as HTMLElement, 'default', {
          enableHaptic: false,
          enableVisualFeedback: true,
          enableAnalytics: enablePerformanceMonitoring,
          delayIndex: index * 0.05,
        });
      } catch (error) {
        console.warn('Failed to apply micro-interaction:', error);
      }
    });
  }, [enablePerformanceMonitoring]);
  
  // Initialize gesture recognition
  const initializeGestureRecognition = useCallback(async () => {
    if (!sectionRef.current) return;
    
    try {
      // Initialize touch tracking for section
      globalTouchResponseManager.initializeTouchTracking(sectionRef.current);
      
      // Handle content-specific gestures
      globalAdvancedGestureManager.onGestureRecognized('doubleTap', (data) => {
        console.log(`Double tap on content section: ${sectionId}`);
        setGestureData(data);
        
        // Trigger content focus animation
        sectionScale.set(1.02);
        elevationLevel.set(8);
        setTimeout(() => {
          sectionScale.set(1);
          elevationLevel.set(0);
        }, 400);
      });
      
      globalAdvancedGestureManager.onGestureRecognized('circularSwipe', (data) => {
        console.log(`Circular swipe on content section: ${sectionId}`);
        setGestureData(data);
        
        // Trigger rotation feedback
        setIsInteracting(true);
        setTimeout(() => setIsInteracting(false), 600);
      });
      
    } catch (error) {
      console.warn('Failed to initialize gesture recognition:', error);
    }
  }, [sectionId, sectionScale, elevationLevel]);
  
  // Handle mouse movement for parallax effects
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!sectionRef.current || animationProfile === 'performance') return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  }, [mouseX, mouseY, animationProfile]);
  
  // Handle section hover states
  const handleHoverStart = useCallback(() => {
    if (animationProfile !== 'performance') {
      elevationLevel.set(4);
      contentOpacity.set(1);
    }
  }, [elevationLevel, contentOpacity, animationProfile]);
  
  const handleHoverEnd = useCallback(() => {
    elevationLevel.set(0);
    mouseX.set(0);
    mouseY.set(0);
  }, [elevationLevel, mouseX, mouseY]);
  
  // Animation variants based on profile and layout
  const getContentAnimationVariants = useCallback(() => {
    const isHero = layout === 'hero';
    const isCard = layout === 'card';
    const isMinimal = layout === 'minimal';
    
    const profiles = {
      smooth: {
        section: {
          initial: { 
            opacity: 0, 
            y: isHero ? 60 : 30, 
            scale: isCard ? 0.95 : 1 
          },
          visible: {
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              duration: timing.verySlow,
              ease: appleEasing.primary,
              staggerChildren: 0.15,
              delayChildren: 0.2,
            },
          },
        },
        title: {
          initial: { opacity: 0, y: 20, scale: 0.9 },
          visible: {
            opacity: 1, y: 0, scale: 1,
            transition: {
              duration: timing.slow,
              ease: appleEasing.gentle,
            },
          },
        },
        content: {
          initial: { opacity: 0, y: 30 },
          visible: {
            opacity: 1, y: 0,
            transition: {
              duration: timing.slow,
              ease: appleEasing.primary,
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        },
      },
      dramatic: {
        section: {
          initial: { 
            opacity: 0, 
            y: isHero ? 100 : 60, 
            scale: 0.8, 
            rotateX: 15 
          },
          visible: {
            opacity: 1, 
            y: 0, 
            scale: 1, 
            rotateX: 0,
            transition: {
              duration: timing.verySlow * 1.5,
              ease: appleEasing.bounce,
              staggerChildren: 0.2,
              delayChildren: 0.3,
            },
          },
        },
        title: {
          initial: { opacity: 0, y: 40, scale: 0.8, rotateY: -10 },
          visible: {
            opacity: 1, y: 0, scale: 1, rotateY: 0,
            transition: {
              duration: timing.verySlow,
              ease: appleEasing.primary,
            },
          },
        },
        content: {
          initial: { opacity: 0, y: 50, scale: 0.9 },
          visible: {
            opacity: 1, y: 0, scale: 1,
            transition: {
              duration: timing.verySlow,
              ease: appleEasing.bounce,
              staggerChildren: 0.15,
              delayChildren: 0.4,
            },
          },
        },
      },
      subtle: {
        section: {
          initial: { opacity: 0, y: isMinimal ? 5 : 15 },
          visible: {
            opacity: 1, y: 0,
            transition: {
              duration: timing.normal,
              ease: appleEasing.gentle,
              staggerChildren: 0.05,
              delayChildren: 0.1,
            },
          },
        },
        title: {
          initial: { opacity: 0, y: 10 },
          visible: {
            opacity: 1, y: 0,
            transition: {
              duration: timing.normal,
              ease: appleEasing.gentle,
            },
          },
        },
        content: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.fast,
              staggerChildren: 0.03,
              delayChildren: 0.1,
            },
          },
        },
      },
      performance: {
        section: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.fast,
              staggerChildren: 0.01,
            },
          },
        },
        title: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: timing.fast },
          },
        },
        content: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: timing.fast },
          },
        },
      },
    };
    
    return profiles[animationProfile];
  }, [animationProfile, layout]);
  
  // Layout-specific classes
  const getLayoutClasses = useCallback(() => {
    const baseClasses = 'relative';
    
    switch (layout) {
      case 'hero':
        return `${baseClasses} py-16 lg:py-24 text-center`;
      case 'card':
        return `${baseClasses} p-6 bg-white rounded-2xl border border-soft-beige/30 shadow-lg`;
      case 'minimal':
        return `${baseClasses} py-4`;
      default:
        return `${baseClasses} py-8`;
    }
  }, [layout]);
  
  const variants = getContentAnimationVariants();
  
  return (
    <motion.section
      ref={sectionRef}
      id={sectionId}
      className={`${getLayoutClasses()} ${className}`}
      variants={variants.section}
      initial="initial"
      animate={isInView ? "visible" : "initial"}
      onMouseMove={handleMouseMove}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{
        scale: sectionScale,
        rotateX: animationProfile === 'dramatic' ? rotateX : 0,
        rotateY: animationProfile === 'dramatic' ? rotateY : 0,
        boxShadow: useTransform(
          elevationLevel,
          [0, 8],
          ['0 2px 8px rgba(122, 139, 115, 0.08)', '0 12px 32px rgba(122, 139, 115, 0.15)']
        ),
      }}
    >
      {/* Performance indicator (development only) */}
      {performanceMetrics && process.env.NODE_ENV === 'development' && (
        <motion.div
          className="absolute top-2 right-2 text-xs bg-slate-100 px-2 py-1 rounded z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Section: {performanceMetrics.frameRate.average.toFixed(1)}fps
        </motion.div>
      )}
      
      {/* Gesture feedback indicator */}
      {gestureData && (
        <motion.div
          className="absolute top-2 left-2 w-3 h-3 bg-atlas-green rounded-full z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Section title */}
      <motion.h2
        ref={titleRef}
        className={`
          font-serif font-semibold text-slate-900 mb-6
          ${layout === 'hero' ? 'text-4xl md:text-5xl lg:text-6xl mb-8' : 
            layout === 'card' ? 'text-2xl mb-4' : 
            layout === 'minimal' ? 'text-xl mb-3' : 'text-3xl md:text-4xl'}
        `}
        variants={variants.title}
        style={{
          y: animationProfile === 'dramatic' ? titleY : 0,
          opacity: contentOpacity,
        }}
      >
        {title}
      </motion.h2>
      
      {/* Section content */}
      <motion.div
        ref={contentRef}
        className="space-y-4"
        variants={variants.content}
        style={{
          y: animationProfile === 'dramatic' ? contentY : 0,
          opacity: contentOpacity,
        }}
      >
        {children}
      </motion.div>
      
      {/* Interaction feedback overlay */}
      {isInteracting && (
        <motion.div
          className="absolute inset-0 bg-atlas-green/5 rounded-2xl pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: appleEasing.primary }}
        />
      )}
      
      {/* Hover overlay for card layout */}
      {layout === 'card' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-atlas-green/5 to-transparent rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: elevationLevel.get() > 0 ? 1 : 0 }}
          transition={{ duration: timing.normal, ease: appleEasing.gentle }}
        />
      )}
    </motion.section>
  );
} 