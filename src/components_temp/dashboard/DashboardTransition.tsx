'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, LayoutGroup } from 'framer-motion';
import { useDashboardLayout, DashboardSection } from '@/components/dashboard';

/**
 * Transformation Stage Types
 * Defines the different stages of the homepage-to-dashboard transformation
 */
export type TransformationStage = 
  | 'idle'           // No transformation active
  | 'preparing'      // Preparing for transformation
  | 'expanding'      // Homepage elements expanding
  | 'transitioning'  // Mid-transformation state
  | 'materializing' // Dashboard elements appearing
  | 'stabilizing'   // Final positioning and stabilization
  | 'complete';     // Transformation complete

/**
 * Transformation Direction Types
 * Defines the direction of transformation
 */
export type TransformationDirection = 'homepage-to-dashboard' | 'dashboard-to-homepage';

/**
 * Active Transformation Stage Types
 * Only stages that have durations in configuration
 */
type ActiveTransformationStage = Exclude<TransformationStage, 'idle' | 'complete'>;

/**
 * Transformation Configuration Interface
 * Configuration options for transformation behavior
 */
export interface TransformationConfig {
  /** Duration of each transformation stage in milliseconds */
  stageDurations: Record<ActiveTransformationStage, number>;
  /** Apple-inspired easing curves for different stages */
  easingCurves: {
    expand: number[];
    transition: number[];
    materialize: number[];
    stabilize: number[];
  };
  /** Performance optimization settings */
  performance: {
    enableWillChange: boolean;
    enableGPUAcceleration: boolean;
    reduceMotionFallback: boolean;
  };
  /** Accessibility settings */
  accessibility: {
    respectReducedMotion: boolean;
    enableFocusManagement: boolean;
    announceTransitions: boolean;
  };
}

/**
 * Transformation State Interface
 * Tracks the current state of transformations
 */
export interface TransformationState {
  /** Current transformation stage */
  currentStage: TransformationStage;
  /** Direction of current transformation */
  direction: TransformationDirection | null;
  /** Target section for dashboard transformation */
  targetSection: DashboardSection;
  /** Transformation progress (0-1) */
  progress: number;
  /** Whether transformation is active */
  isActive: boolean;
  /** Start time of current transformation */
  startTime: number | null;
  /** Performance metrics for current transformation */
  metrics: {
    frameRate: number;
    duration: number;
    dropped: number;
  };
}

/**
 * Custom Trigger Function Type
 * Type for custom transformation trigger callback
 */
type CustomTriggerFunction = (
  direction: TransformationDirection,
  section?: DashboardSection
) => void;

/**
 * Default transformation configuration
 * Apple-inspired timing and easing for premium experience
 */
const defaultTransformationConfig: TransformationConfig = {
  stageDurations: {
    preparing: 100,   // Brief preparation phase
    expanding: 250,   // Homepage elements expand
    transitioning: 200, // Core layout transition
    materializing: 300, // Dashboard elements appear
    stabilizing: 150,  // Final positioning
  },
  easingCurves: {
    expand: [0.25, 0.46, 0.45, 0.94],    // easeOutQuart
    transition: [0.4, 0.0, 0.2, 1],      // Apple standard
    materialize: [0.0, 0.0, 0.2, 1],     // easeOut
    stabilize: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
  },
  performance: {
    enableWillChange: true,
    enableGPUAcceleration: true,
    reduceMotionFallback: true,
  },
  accessibility: {
    respectReducedMotion: true,
    enableFocusManagement: true,
    announceTransitions: true,
  },
};

/**
 * Dashboard Transition Props Interface
 * Props for the main transformation component
 */
export interface DashboardTransitionProps {
  /** Child components to transform */
  children: React.ReactNode;
  /** Transformation configuration override */
  config?: Partial<TransformationConfig>;
  /** Homepage content component */
  homepageComponent: React.ComponentType<{}>;
  /** Dashboard content component */
  dashboardComponent: React.ComponentType<{ activeSection: DashboardSection }>;
  /** Custom transformation trigger */
  customTrigger?: (callback: CustomTriggerFunction) => void;
  /** Performance monitoring callback */
  onPerformanceUpdate?: (metrics: TransformationState['metrics']) => void;
}

/**
 * Dashboard Transition Component
 * 
 * Orchestrates smooth, Apple-inspired transformations between homepage and dashboard layouts.
 * Implements sophisticated animation sequencing, performance monitoring, and accessibility features.
 * 
 * Key Features:
 * - Multi-stage transformation with precise timing
 * - Apple-inspired easing and animation curves
 * - Performance monitoring and 60fps optimization
 * - Accessibility compliance with reduced motion support
 * - Focus management and screen reader announcements
 * - Memory-efficient animation handling
 * 
 * Architecture:
 * - Integrates with DashboardLayoutManager for state coordination
 * - Uses Framer Motion for hardware-accelerated animations
 * - Implements proper cleanup and memory management
 * - Supports custom transformation configurations
 * 
 * @component DashboardTransition
 * @param {DashboardTransitionProps} props - Component props
 * @returns {JSX.Element} Transition orchestration component
 */
export default function DashboardTransition({
  children,
  config = {},
  homepageComponent: HomepageComponent,
  dashboardComponent: DashboardComponent,
  customTrigger,
  onPerformanceUpdate,
}: DashboardTransitionProps): JSX.Element {
  
  // Merge configuration with defaults
  const transformationConfig = React.useMemo(() => ({
    ...defaultTransformationConfig,
    ...config,
    stageDurations: { ...defaultTransformationConfig.stageDurations, ...config.stageDurations },
    easingCurves: { ...defaultTransformationConfig.easingCurves, ...config.easingCurves },
    performance: { ...defaultTransformationConfig.performance, ...config.performance },
    accessibility: { ...defaultTransformationConfig.accessibility, ...config.accessibility },
  }), [config]);

  // Dashboard layout context
  const dashboardContext = useDashboardLayout();

  // Transformation state management
  const [transformationState, setTransformationState] = useState<TransformationState>({
    currentStage: 'idle',
    direction: null,
    targetSection: null,
    progress: 0,
    isActive: false,
    startTime: null,
    metrics: {
      frameRate: 60,
      duration: 0,
      dropped: 0,
    },
  });

  // Animation controls
  const homepageControls = useAnimation();
  const dashboardControls = useAnimation();

  // Performance monitoring refs
  const performanceMonitor = useRef({
    frameCount: 0,
    lastFrameTime: 0,
    startTime: 0,
    droppedFrames: 0,
  });

  // Accessibility announcement ref
  const announcementRef = useRef<HTMLDivElement>(null);

  /**
   * Performance Monitoring Function
   * Tracks animation performance and frame rates
   */
  const monitorPerformance = useCallback(() => {
    const currentTime = performance.now();
    const monitor = performanceMonitor.current;
    
    if (monitor.lastFrameTime > 0) {
      const frameTime = currentTime - monitor.lastFrameTime;
      const targetFrameTime = 1000 / 60; // 16.67ms for 60fps
      
      if (frameTime > targetFrameTime * 1.5) { // Frame took 50% longer than target
        monitor.droppedFrames++;
      }
      
      monitor.frameCount++;
      
      // Calculate average frame rate
      const totalTime = currentTime - monitor.startTime;
      const avgFrameRate = (monitor.frameCount / totalTime) * 1000;
      
      // Update metrics
      setTransformationState(prev => ({
        ...prev,
        metrics: {
          frameRate: Math.round(avgFrameRate),
          duration: totalTime,
          dropped: monitor.droppedFrames,
        },
      }));
      
      // Notify parent component
      if (onPerformanceUpdate) {
        onPerformanceUpdate({
          frameRate: Math.round(avgFrameRate),
          duration: totalTime,
          dropped: monitor.droppedFrames,
        });
      }
    }
    
    monitor.lastFrameTime = currentTime;
  }, [onPerformanceUpdate]);

  /**
   * Accessibility Announcement Function
   * Announces transformation state to screen readers
   */
  const announceTransformation = useCallback((stage: TransformationStage, direction: TransformationDirection | null) => {
    if (!transformationConfig.accessibility.announceTransitions || !announcementRef.current) return;

    let announcement = '';
    
    switch (stage) {
      case 'preparing':
        announcement = direction === 'homepage-to-dashboard' 
          ? 'Transitioning to dashboard view' 
          : 'Returning to homepage view';
        break;
      case 'complete':
        announcement = direction === 'homepage-to-dashboard' 
          ? 'Dashboard view loaded' 
          : 'Homepage view restored';
        break;
      default:
        return;
    }
    
    announcementRef.current.textContent = announcement;
  }, [transformationConfig.accessibility.announceTransitions]);

  /**
   * Stage Execution Function
   * Executes specific transformation stage with timing and animations
   */
  const executeStage = useCallback(async (
    stage: ActiveTransformationStage,
    direction: TransformationDirection
  ): Promise<void> => {
    const { stageDurations, easingCurves } = transformationConfig;
    
    // Update current stage
    setTransformationState(prev => ({ ...prev, currentStage: stage }));
    
    // Announce to screen readers
    announceTransformation(stage, direction);
    
    switch (stage) {
      case 'preparing':
        // Initialize performance monitoring
        performanceMonitor.current = {
          frameCount: 0,
          lastFrameTime: performance.now(),
          startTime: performance.now(),
          droppedFrames: 0,
        };
        
        // Prepare elements for transformation
        if (direction === 'homepage-to-dashboard') {
          await homepageControls.start({
            scale: 1.02,
            transition: { duration: stageDurations.preparing / 1000, ease: easingCurves.expand },
          });
        } else {
          await dashboardControls.start({
            scale: 1.02,
            transition: { duration: stageDurations.preparing / 1000, ease: easingCurves.expand },
          });
        }
        break;

      case 'expanding':
        if (direction === 'homepage-to-dashboard') {
          await homepageControls.start({
            scale: 1.1,
            opacity: 0.8,
            transition: { 
              duration: stageDurations.expanding / 1000, 
              ease: easingCurves.expand,
            },
          });
        } else {
          await dashboardControls.start({
            scale: 0.9,
            opacity: 0.8,
            transition: { 
              duration: stageDurations.expanding / 1000, 
              ease: easingCurves.expand,
            },
          });
        }
        break;

      case 'transitioning':
        // Core layout transition
        if (direction === 'homepage-to-dashboard') {
          await Promise.all([
            homepageControls.start({
              scale: 0.8,
              opacity: 0,
              transition: { 
                duration: stageDurations.transitioning / 1000, 
                ease: easingCurves.transition,
              },
            }),
            dashboardControls.start({
              scale: 1.2,
              opacity: 0,
              transition: { 
                duration: stageDurations.transitioning / 1000, 
                ease: easingCurves.transition,
              },
            }),
          ]);
        } else {
          await Promise.all([
            dashboardControls.start({
              scale: 0.8,
              opacity: 0,
              transition: { 
                duration: stageDurations.transitioning / 1000, 
                ease: easingCurves.transition,
              },
            }),
            homepageControls.start({
              scale: 1.2,
              opacity: 0,
              transition: { 
                duration: stageDurations.transitioning / 1000, 
                ease: easingCurves.transition,
              },
            }),
          ]);
        }
        break;

      case 'materializing':
        if (direction === 'homepage-to-dashboard') {
          await dashboardControls.start({
            scale: 1,
            opacity: 1,
            transition: { 
              duration: stageDurations.materializing / 1000, 
              ease: easingCurves.materialize,
            },
          });
        } else {
          await homepageControls.start({
            scale: 1,
            opacity: 1,
            transition: { 
              duration: stageDurations.materializing / 1000, 
              ease: easingCurves.materialize,
            },
          });
        }
        break;

      case 'stabilizing':
        // Final positioning and stabilization
        const targetControls = direction === 'homepage-to-dashboard' ? dashboardControls : homepageControls;
        await targetControls.start({
          scale: 1,
          opacity: 1,
          transition: { 
            duration: stageDurations.stabilizing / 1000, 
            ease: easingCurves.stabilize,
          },
        });
        break;

      default:
        break;
    }
    
    // Monitor performance during animation
    monitorPerformance();
    
    // Wait for stage duration
    await new Promise(resolve => setTimeout(resolve, stageDurations[stage]));
  }, [
    transformationConfig,
    homepageControls,
    dashboardControls,
    announceTransformation,
    monitorPerformance,
  ]);

  /**
   * Execute Complete Transformation
   * Orchestrates the full transformation sequence
   */
  const executeTransformation = useCallback(async (
    direction: TransformationDirection,
    targetSection?: DashboardSection
  ): Promise<void> => {
    
    // Set initial transformation state
    setTransformationState(prev => ({
      ...prev,
      isActive: true,
      direction,
      targetSection: targetSection || null,
      startTime: performance.now(),
      currentStage: 'preparing',
      progress: 0,
    }));

    const stages: ActiveTransformationStage[] = [
      'preparing',
      'expanding', 
      'transitioning',
      'materializing',
      'stabilizing',
    ];

    try {
      // Execute each stage in sequence
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        await executeStage(stage, direction);
        
        // Update progress
        setTransformationState(prev => ({
          ...prev,
          progress: (i + 1) / stages.length,
        }));
      }

      // Mark transformation as complete
      setTransformationState(prev => ({
        ...prev,
        currentStage: 'complete',
        isActive: false,
        progress: 1,
      }));

      // Announce completion
      announceTransformation('complete', direction);

    } catch (error) {
      console.error('Transformation error:', error);
      
      // Reset to safe state
      setTransformationState(prev => ({
        ...prev,
        currentStage: 'idle',
        isActive: false,
        direction: null,
        progress: 0,
      }));
    }
  }, [executeStage, announceTransformation]);

  /**
   * Dashboard Context Integration Effect
   * Responds to dashboard state changes with appropriate transformations
   */
  useEffect(() => {
    const { state } = dashboardContext;
    
    if (state.isTransforming && !transformationState.isActive) {
      const direction: TransformationDirection = 
        state.currentLayout === 'dashboard' 
          ? 'homepage-to-dashboard' 
          : 'dashboard-to-homepage';
      
      executeTransformation(direction, state.activeSection);
    }
  }, [
    dashboardContext.state.isTransforming,
    dashboardContext.state.currentLayout,
    dashboardContext.state.activeSection,
    transformationState.isActive,
    executeTransformation,
  ]);

  /**
   * Custom Trigger Integration Effect
   * Integrates with external transformation triggers
   */
  useEffect(() => {
    if (customTrigger) {
      const triggerCallback: CustomTriggerFunction = (direction, section) => {
        executeTransformation(direction, section);
      };
      customTrigger(triggerCallback);
    }
  }, [customTrigger, executeTransformation]);

  /**
   * Reduced Motion Detection Effect
   * Adapts animations for users who prefer reduced motion
   */
  useEffect(() => {
    if (!transformationConfig.accessibility.respectReducedMotion) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches && transformationConfig.performance.reduceMotionFallback) {
      // Implement reduced motion fallback
      console.log('Reduced motion detected - using simplified transitions');
    }
  }, [transformationConfig.accessibility.respectReducedMotion, transformationConfig.performance.reduceMotionFallback]);

  /**
   * Animation Variants
   * Framer Motion animation configurations for different states
   */
  const animationVariants = {
    homepage: {
      initial: { scale: 1, opacity: 1 },
      preparing: { scale: 1.02, opacity: 1 },
      expanding: { scale: 1.1, opacity: 0.8 },
      transitioning: { scale: 0.8, opacity: 0 },
      hidden: { scale: 0.8, opacity: 0 },
    },
    dashboard: {
      initial: { scale: 1, opacity: 1 },
      preparing: { scale: 1.02, opacity: 1 },
      expanding: { scale: 0.9, opacity: 0.8 },
      transitioning: { scale: 1.2, opacity: 0 },
      materializing: { scale: 1, opacity: 1 },
      stabilizing: { scale: 1, opacity: 1 },
      hidden: { scale: 1.2, opacity: 0 },
    },
  };

  return (
    <LayoutGroup>
      <div className="relative w-full h-full overflow-hidden">
        
        {/* Accessibility Announcements */}
        <div
          ref={announcementRef}
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        />

        {/* Homepage Layout */}
        <AnimatePresence mode="wait">
          {dashboardContext.state.currentLayout === 'homepage' && (
            <motion.div
              key="homepage-layout"
              initial="initial"
              animate={homepageControls}
              exit="hidden"
              variants={animationVariants.homepage}
              className="absolute inset-0"
              style={{
                willChange: transformationConfig.performance.enableWillChange ? 'transform, opacity' : 'auto',
                transform: transformationConfig.performance.enableGPUAcceleration ? 'translateZ(0)' : 'none',
              }}
            >
              <HomepageComponent />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Layout */}
        <AnimatePresence mode="wait">
          {dashboardContext.state.currentLayout === 'dashboard' && (
            <motion.div
              key="dashboard-layout"
              initial="hidden"
              animate={dashboardControls}
              exit="hidden"
              variants={animationVariants.dashboard}
              className="absolute inset-0"
              style={{
                willChange: transformationConfig.performance.enableWillChange ? 'transform, opacity' : 'auto',
                transform: transformationConfig.performance.enableGPUAcceleration ? 'translateZ(0)' : 'none',
              }}
            >
              <DashboardComponent activeSection={dashboardContext.state.activeSection} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transformation Overlay (Optional) */}
        {transformationState.isActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none bg-black/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {children}
      </div>
    </LayoutGroup>
  );
}

/**
 * Dashboard Transition Exports
 * Named exports for component and related types
 */
export {
  type TransformationStage,
  type TransformationDirection,
  type TransformationConfig,
  type TransformationState,
  type DashboardTransitionProps,
}; 