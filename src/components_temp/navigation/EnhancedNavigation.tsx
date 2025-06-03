/**
 * Enhanced Navigation Component
 * Task 4.3.3 - Navigation animation coordination with advanced animation systems
 * Sophisticated navigation with coordinated transitions and state management
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useModalContext } from '@/components/modals/ModalProvider';
import { modalAnimations, appleEasing, timing } from '@/animations/modalAnimations';
import { microInteractionSystem, globalMicroInteractionManager } from '@/animations/microInteractionSystem';
import { touchResponseSystem, globalTouchResponseManager } from '@/animations/touchResponseSystem';
import { modalContentStagger, globalContentStaggerOrchestrator } from '@/animations/modalContentStagger';
import { modalPerformanceValidation, globalPerformanceMonitor } from '@/animations/modalPerformanceValidation';

/**
 * Enhanced Navigation Props
 */
export interface EnhancedNavigationProps {
  /** Additional CSS classes */
  className?: string;
  /** Animation profile for navigation */
  animationProfile?: 'smooth' | 'dramatic' | 'subtle' | 'performance';
  /** Enable advanced features */
  enableGestures?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableMicroInteractions?: boolean;
  /** Navigation layout mode */
  layout?: 'horizontal' | 'vertical' | 'compact';
  /** Enable navigation state persistence */
  persistState?: boolean;
}

/**
 * Navigation Item Interface
 */
interface NavigationItem {
  id: string;
  label: string;
  action: () => void;
  icon?: string;
  badge?: number;
  isActive?: boolean;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Enhanced Navigation Component
 * Coordinated animations and sophisticated interactions
 */
export default function EnhancedNavigation({
  className = '',
  animationProfile = 'smooth',
  enableGestures = true,
  enablePerformanceMonitoring = true,
  enableMicroInteractions = true,
  layout = 'horizontal',
  persistState = true,
}: EnhancedNavigationProps) {
  const { openModal } = useModalContext();
  const navRef = useRef<HTMLNavElement>(null);
  const [activeItem, setActiveItem] = useState<string>('home');
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Motion values for sophisticated interactions
  const navY = useMotionValue(0);
  const navOpacity = useSpring(1, { stiffness: 300, damping: 30 });
  const itemScale = useSpring(1, { stiffness: 400, damping: 40 });
  const backgroundColor = useMotionValue('rgba(255, 255, 255, 0.95)');
  
  // Navigation items with comprehensive configuration
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      priority: 'high',
      action: () => {
        setActiveItem('home');
        // Navigate to homepage
        window.location.hash = '';
      },
    },
    {
      id: 'about',
      label: 'About',
      icon: '👥',
      priority: 'high',
      action: () => {
        setActiveItem('about');
        openModal('about-atlas', null, { 
          size: 'xl',
          animationProfile: animationProfile,
        });
      },
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: '🛠️',
      badge: 1, // New tool indicator
      priority: 'high',
      action: () => {
        setActiveItem('tools');
        openModal('atlas-tools', null, { 
          size: 'xl',
          animationProfile: 'dramatic',
        });
      },
    },
    {
      id: 'project-log',
      label: 'Project Log',
      icon: '📊',
      priority: 'medium',
      action: () => {
        setActiveItem('project-log');
        openModal('project-log', null, { 
          size: 'xl',
          animationProfile: animationProfile,
        });
      },
    },
    {
      id: 'get-involved',
      label: 'Get Involved',
      icon: '🤝',
      priority: 'medium',
      action: () => {
        setActiveItem('get-involved');
        openModal('get-involved', null, { 
          size: 'xl',
          animationProfile: animationProfile,
        });
      },
    },
  ];
  
  // Initialize navigation animation systems
  useEffect(() => {
    initializeNavigationAnimations();
    
    // Load persisted state
    if (persistState) {
      const savedActiveItem = localStorage.getItem('atlas-nav-active');
      if (savedActiveItem) {
        setActiveItem(savedActiveItem);
      }
    }
  }, []);
  
  // Initialize animation systems
  const initializeNavigationAnimations = useCallback(async () => {
    const navId = 'enhanced-navigation';
    
    try {
      // Initialize performance monitoring
      if (enablePerformanceMonitoring) {
        await initializePerformanceMonitoring(navId);
      }
      
      // Initialize micro-interactions for navigation items
      if (enableMicroInteractions) {
        await initializeMicroInteractions();
      }
      
      // Initialize gesture recognition
      if (enableGestures) {
        await initializeGestureRecognition(navId);
      }
      
      // Register navigation for content stagger
      await initializeContentStagger(navId);
      
    } catch (error) {
      console.error('Failed to initialize navigation animations:', error);
    }
  }, [enablePerformanceMonitoring, enableMicroInteractions, enableGestures]);
  
  // Initialize performance monitoring
  const initializePerformanceMonitoring = useCallback(async (navId: string) => {
    globalPerformanceMonitor.startMonitoring(navId);
    
    // Monitor navigation performance
    setTimeout(async () => {
      const metrics = globalPerformanceMonitor.stopMonitoring();
      setPerformanceData(metrics);
      
      if (metrics && metrics.frameRate.average < 55) {
        console.warn('Navigation performance below 60fps:', metrics);
      }
    }, 2000);
  }, []);
  
  // Initialize micro-interactions
  const initializeMicroInteractions = useCallback(async () => {
    if (!navRef.current) return;
    
    // Apply micro-interactions to navigation items
    const navItems = navRef.current.querySelectorAll('[data-nav-item]');
    navItems.forEach(item => {
      globalMicroInteractionManager.applyButtonMicroInteraction(item as HTMLElement, 'subtle', {
        enableHaptic: false,
        enableVisualFeedback: true,
        enableAnalytics: enablePerformanceMonitoring,
      });
    });
  }, [enablePerformanceMonitoring]);
  
  // Initialize gesture recognition
  const initializeGestureRecognition = useCallback(async (navId: string) => {
    if (!navRef.current) return;
    
    // Enable navigation-specific gestures
    globalTouchResponseManager.initializeTouchTracking(navRef.current);
    
    // Swipe gestures for navigation
    globalTouchResponseManager.onSwipeGesture('left', () => {
      console.log('Swipe left - next navigation item');
      navigateNext();
    });
    
    globalTouchResponseManager.onSwipeGesture('right', () => {
      console.log('Swipe right - previous navigation item');
      navigatePrevious();
    });
  }, []);
  
  // Initialize content stagger
  const initializeContentStagger = useCallback(async (navId: string) => {
    if (!navRef.current) return;
    
    // Register navigation items for staggered animation
    navigationItems.forEach((item, index) => {
      const element = navRef.current?.querySelector(`[data-nav-item="${item.id}"]`) as HTMLElement;
      if (element) {
        globalContentStaggerOrchestrator.registerContent(`${navId}-${item.id}`, element, {
          type: 'interactive',
          section: 'navigation',
          length: item.label.length,
          priority: item.priority,
        });
      }
    });
  }, []);
  
  // Navigate to next item
  const navigateNext = useCallback(() => {
    const currentIndex = navigationItems.findIndex(item => item.id === activeItem);
    const nextIndex = (currentIndex + 1) % navigationItems.length;
    const nextItem = navigationItems[nextIndex];
    nextItem.action();
  }, [activeItem, navigationItems]);
  
  // Navigate to previous item
  const navigatePrevious = useCallback(() => {
    const currentIndex = navigationItems.findIndex(item => item.id === activeItem);
    const prevIndex = currentIndex === 0 ? navigationItems.length - 1 : currentIndex - 1;
    const prevItem = navigationItems[prevIndex];
    prevItem.action();
  }, [activeItem, navigationItems]);
  
  // Handle navigation item click
  const handleItemClick = useCallback((item: NavigationItem) => {
    // Persist state
    if (persistState) {
      localStorage.setItem('atlas-nav-active', item.id);
    }
    
    // Trigger micro-interaction
    itemScale.set(0.95);
    setTimeout(() => itemScale.set(1), 150);
    
    // Execute action
    item.action();
  }, [persistState, itemScale]);
  
  // Handle navigation item hover
  const handleItemHover = useCallback((itemId: string | null) => {
    setHoveredItem(itemId);
    
    if (itemId) {
      itemScale.set(1.05);
    } else {
      itemScale.set(1);
    }
  }, [itemScale]);
  
  // Animation variants based on profile and layout
  const getNavigationVariants = useCallback(() => {
    const isVertical = layout === 'vertical';
    const isCompact = layout === 'compact';
    
    const profiles = {
      smooth: {
        container: {
          initial: { opacity: 0, y: isVertical ? 20 : -20 },
          visible: {
            opacity: 1, y: 0,
            transition: {
              duration: timing.slow,
              ease: appleEasing.primary,
              staggerChildren: 0.1,
              delayChildren: 0.1,
            },
          },
        },
        item: {
          initial: { opacity: 0, scale: 0.9, y: isVertical ? 10 : 0, x: isVertical ? 0 : 10 },
          visible: {
            opacity: 1, scale: 1, y: 0, x: 0,
            transition: {
              duration: timing.normal,
              ease: appleEasing.gentle,
            },
          },
          hover: {
            scale: 1.05,
            y: isVertical ? 0 : -2,
            transition: { duration: timing.fast, ease: appleEasing.primary },
          },
          tap: {
            scale: 0.95,
            transition: { duration: timing.fast, ease: appleEasing.sharp },
          },
        },
        indicator: {
          initial: { scaleX: 0, opacity: 0 },
          active: {
            scaleX: 1, opacity: 1,
            transition: { duration: timing.normal, ease: appleEasing.primary },
          },
        },
      },
      dramatic: {
        container: {
          initial: { opacity: 0, y: isVertical ? 40 : -40, scale: 0.9 },
          visible: {
            opacity: 1, y: 0, scale: 1,
            transition: {
              duration: timing.verySlow,
              ease: appleEasing.bounce,
              staggerChildren: 0.15,
              delayChildren: 0.2,
            },
          },
        },
        item: {
          initial: { opacity: 0, scale: 0.8, rotateX: isVertical ? 15 : 0, rotateY: isVertical ? 0 : 15 },
          visible: {
            opacity: 1, scale: 1, rotateX: 0, rotateY: 0,
            transition: {
              duration: timing.slow,
              ease: appleEasing.primary,
            },
          },
          hover: {
            scale: 1.1,
            rotateY: isVertical ? 0 : 5,
            rotateX: isVertical ? -5 : 0,
            transition: { duration: timing.normal, ease: appleEasing.primary },
          },
          tap: {
            scale: 0.9,
            rotateX: isVertical ? 5 : 0,
            rotateY: isVertical ? 0 : -5,
            transition: { duration: timing.fast, ease: appleEasing.sharp },
          },
        },
        indicator: {
          initial: { scaleX: 0, opacity: 0, y: 10 },
          active: {
            scaleX: 1, opacity: 1, y: 0,
            transition: { duration: timing.slow, ease: appleEasing.bounce },
          },
        },
      },
      subtle: {
        container: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.normal,
              staggerChildren: 0.05,
            },
          },
        },
        item: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: timing.fast },
          },
          hover: {
            opacity: 0.8,
            transition: { duration: timing.fast },
          },
          tap: {
            opacity: 0.6,
            transition: { duration: timing.fast },
          },
        },
        indicator: {
          initial: { scaleX: 0 },
          active: {
            scaleX: 1,
            transition: { duration: timing.fast },
          },
        },
      },
      performance: {
        container: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: timing.fast },
          },
        },
        item: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: timing.fast },
          },
          hover: { opacity: 0.8 },
          tap: { opacity: 0.6 },
        },
        indicator: {
          initial: { scaleX: 0 },
          active: { scaleX: 1 },
        },
      },
    };
    
    return profiles[animationProfile];
  }, [animationProfile, layout]);
  
  const variants = getNavigationVariants();
  
  // Layout-specific classes
  const getLayoutClasses = useCallback(() => {
    switch (layout) {
      case 'vertical':
        return 'flex-col space-y-2';
      case 'compact':
        return 'flex-row space-x-1';
      default:
        return 'flex-row space-x-6';
    }
  }, [layout]);
  
  return (
    <motion.nav
      ref={navRef}
      className={`
        relative bg-white/95 backdrop-blur-md border border-soft-beige/30 rounded-2xl
        shadow-lg hover:shadow-xl transition-shadow duration-200
        ${layout === 'vertical' ? 'p-4' : 'px-6 py-4'}
        ${className}
      `}
      variants={variants.container}
      initial="initial"
      animate="visible"
      style={{
        y: navY,
        opacity: navOpacity,
        backgroundColor,
      }}
    >
      {/* Performance indicator (development only) */}
      {performanceData && process.env.NODE_ENV === 'development' && (
        <motion.div
          className="absolute -top-8 right-0 text-xs bg-slate-900 text-white px-2 py-1 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Nav: {performanceData.frameRate.average.toFixed(1)}fps
        </motion.div>
      )}
      
      {/* Navigation items */}
      <motion.div
        className={`flex ${getLayoutClasses()}`}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative"
            variants={variants.item}
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => handleItemHover(item.id)}
            onHoverEnd={() => handleItemHover(null)}
            data-nav-item={item.id}
          >
            {/* Navigation item button */}
            <motion.button
              className={`
                relative flex items-center space-x-2 px-4 py-2 rounded-xl
                font-sans font-medium transition-colors duration-200
                ${activeItem === item.id 
                  ? 'text-atlas-green bg-atlas-green/10' 
                  : 'text-slate-600 hover:text-atlas-green hover:bg-atlas-green/5'
                }
                ${layout === 'compact' ? 'px-2 py-1 text-sm' : ''}
              `}
              onClick={() => handleItemClick(item)}
              style={{ scale: hoveredItem === item.id ? itemScale : 1 }}
            >
              {/* Icon */}
              {item.icon && (
                <motion.span
                  className="text-lg"
                  animate={{ 
                    rotate: activeItem === item.id ? [0, 10, 0] : 0,
                    scale: hoveredItem === item.id ? 1.1 : 1,
                  }}
                  transition={{ duration: timing.fast }}
                >
                  {item.icon}
                </motion.span>
              )}
              
              {/* Label */}
              <span className={layout === 'compact' ? 'hidden sm:inline' : ''}>
                {item.label}
              </span>
              
              {/* Badge */}
              <AnimatePresence>
                {item.badge && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-bright-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: timing.fast, ease: appleEasing.bounce }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* Active indicator */}
            <AnimatePresence>
              {activeItem === item.id && (
                <motion.div
                  className={`
                    absolute bg-atlas-green rounded-full
                    ${layout === 'vertical' 
                      ? 'left-0 top-1/2 w-1 h-6 -translate-y-1/2' 
                      : 'bottom-0 left-1/2 h-1 w-8 -translate-x-1/2'
                    }
                  `}
                  variants={variants.indicator}
                  initial="initial"
                  animate="active"
                  exit="initial"
                  layoutId="nav-indicator"
                />
              )}
            </AnimatePresence>
            
            {/* Hover effect */}
            <AnimatePresence>
              {hoveredItem === item.id && (
                <motion.div
                  className="absolute inset-0 bg-atlas-green/10 rounded-xl pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: timing.fast }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-atlas-green/5 via-transparent to-bright-orange/5 rounded-2xl pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: appleEasing.gentle,
        }}
      />
    </motion.nav>
  );
} 