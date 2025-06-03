'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardLayout, DashboardSection } from '@/components/dashboard';

/**
 * Bottom Navigation Tab Interface
 * Defines structure for bottom navigation tabs
 */
export interface BottomNavigationTab {
  /** Unique identifier for the tab */
  id: DashboardSection;
  /** Display label for the tab */
  label: string;
  /** Icon component or icon name */
  icon: React.ReactNode | string;
  /** Whether tab is currently active */
  isActive: boolean;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Badge count or indicator */
  badge?: number | string;
  /** Tab description for accessibility */
  description?: string;
}

/**
 * Bottom Navigation State Interface
 * Manages internal bottom navigation component state
 */
export interface BottomNavigationState {
  /** Currently focused tab (keyboard navigation) */
  focusedTab: DashboardSection | null;
  /** Whether navigation is in compact mode */
  isCompact: boolean;
  /** Animation state */
  animationState: 'idle' | 'transitioning' | 'settling';
  /** Last interaction timestamp */
  lastInteraction: number;
}

/**
 * Bottom Navigation Configuration Interface
 * Configuration options for bottom navigation behavior
 */
export interface BottomNavigationConfig {
  /** Enable smooth tab transitions */
  enableTransitions: boolean;
  /** Auto-hide on scroll */
  autoHideOnScroll: boolean;
  /** Compact mode threshold (screen width) */
  compactModeThreshold: number;
  /** Animation duration in milliseconds */
  animationDuration: number;
  /** Enable haptic feedback */
  enableHapticFeedback: boolean;
  /** Show tab labels */
  showLabels: boolean;
  /** Tab highlight color */
  highlightColor: string;
}

/**
 * Bottom Navigation Props Interface
 * Props for the main bottom navigation component
 */
export interface DashboardBottomNavigationProps {
  /** Custom navigation tabs override */
  navigationTabs?: BottomNavigationTab[];
  /** Bottom navigation configuration */
  config?: Partial<BottomNavigationConfig>;
  /** Custom CSS classes */
  className?: string;
  /** Position variant */
  position?: 'fixed' | 'sticky' | 'relative';
  /** Navigation callback */
  onNavigate?: (section: DashboardSection) => void;
  /** Tab change callback */
  onTabChange?: (tab: BottomNavigationTab) => void;
}

/**
 * Default Bottom Navigation Configuration
 * Optimized settings for Atlas bottom navigation
 */
const defaultBottomNavConfig: BottomNavigationConfig = {
  enableTransitions: true,
  autoHideOnScroll: false,
  compactModeThreshold: 480,
  animationDuration: 250,
  enableHapticFeedback: true,
  showLabels: true,
  highlightColor: 'sage-green',
};

/**
 * Default Bottom Navigation Tabs
 * Secondary Atlas navigation items
 */
const defaultBottomNavigationTabs: BottomNavigationTab[] = [
  {
    id: 'why-we-exist',
    label: 'Why We Exist',
    icon: '🎯',
    isActive: false,
    description: 'Our mission and purpose',
  },
  {
    id: 'who-we-are',
    label: 'Who We Are',
    icon: '👥',
    isActive: false,
    description: 'Team and company culture',
  },
  {
    id: 'our-timeline',
    label: 'Our Timeline',
    icon: '📅',
    isActive: false,
    description: 'Company journey and milestones',
  },
  {
    id: 'about-atlas',
    label: 'About Atlas',
    icon: '🏢',
    isActive: false,
    description: 'Company overview and details',
  },
];

/**
 * Dashboard Bottom Navigation Component
 * 
 * Secondary navigation system for Atlas dashboard with smooth animations,
 * responsive behavior, accessibility compliance, and mobile optimization.
 * 
 * Key Features:
 * - Responsive tab navigation with smooth transitions
 * - Auto-hide on scroll functionality
 * - Haptic feedback for mobile interactions
 * - Keyboard navigation support
 * - Accessibility compliance (ARIA, focus management)
 * - Integration with dashboard layout system
 * - Compact mode for small screens
 * - Performance optimized animations
 * 
 * Architecture:
 * - Component composition with reusable navigation tabs
 * - State management following React best practices
 * - Performance optimized with proper memoization
 * - TypeScript strict mode compliance
 * - Atlas Design System integration
 * 
 * @component DashboardBottomNavigation
 * @param {DashboardBottomNavigationProps} props - Component props
 * @returns {JSX.Element} Bottom navigation component
 */
export default function DashboardBottomNavigation({
  navigationTabs = defaultBottomNavigationTabs,
  config = {},
  className = '',
  position = 'fixed',
  onNavigate,
  onTabChange,
}: DashboardBottomNavigationProps): JSX.Element {

  // Merge configuration with defaults
  const bottomNavConfig = React.useMemo(() => ({
    ...defaultBottomNavConfig,
    ...config,
  }), [config]);

  // Dashboard layout context
  const dashboardContext = useDashboardLayout();

  // Bottom navigation internal state
  const [navState, setNavState] = useState<BottomNavigationState>({
    focusedTab: null,
    isCompact: false,
    animationState: 'idle',
    lastInteraction: Date.now(),
  });

  // Refs for DOM manipulation and scroll detection
  const bottomNavRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Map<DashboardSection, HTMLButtonElement>>(new Map());

  /**
   * Navigation Tabs with Active State
   * Computes navigation tabs with current active state
   */
  const navigationTabsWithState = React.useMemo(() => {
    return navigationTabs.map(tab => ({
      ...tab,
      isActive: dashboardContext.isSectionActive(tab.id),
    }));
  }, [navigationTabs, dashboardContext]);

  /**
   * Handle Tab Click
   * Processes navigation to different dashboard sections
   */
  const handleTabClick = useCallback((tab: BottomNavigationTab) => {
    if (tab.disabled) return;

    // Update animation state
    setNavState(prev => ({
      ...prev,
      animationState: 'transitioning',
      focusedTab: tab.id,
      lastInteraction: Date.now(),
    }));

    // Haptic feedback for mobile
    if (bottomNavConfig.enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Navigate via dashboard context
    dashboardContext.navigateToSection(tab.id);

    // Notify parent components
    if (onNavigate) {
      onNavigate(tab.id);
    }
    if (onTabChange) {
      onTabChange(tab);
    }

    // Reset animation state
    setTimeout(() => {
      setNavState(prev => ({ ...prev, animationState: 'settling' }));
      setTimeout(() => {
        setNavState(prev => ({ ...prev, animationState: 'idle' }));
      }, 100);
    }, bottomNavConfig.animationDuration);
  }, [dashboardContext, onNavigate, onTabChange, bottomNavConfig]);

  /**
   * Keyboard Navigation Handler
   * Implements keyboard navigation for accessibility
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;
    
    // Handle arrow key navigation
    if (['ArrowLeft', 'ArrowRight'].includes(key)) {
      event.preventDefault();
      
      const currentIndex = navigationTabsWithState.findIndex(
        tab => tab.id === navState.focusedTab
      );
      
      let nextIndex;
      if (key === 'ArrowRight') {
        nextIndex = currentIndex < navigationTabsWithState.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : navigationTabsWithState.length - 1;
      }
      
      const nextTab = navigationTabsWithState[nextIndex];
      if (nextTab && !nextTab.disabled) {
        setNavState(prev => ({ ...prev, focusedTab: nextTab.id }));
        
        // Focus the tab element
        const tabRef = tabRefs.current.get(nextTab.id);
        if (tabRef) {
          tabRef.focus();
        }
      }
    }

    // Handle Enter/Space key
    if (['Enter', ' '].includes(key) && navState.focusedTab) {
      event.preventDefault();
      const activeTab = navigationTabsWithState.find(tab => tab.id === navState.focusedTab);
      if (activeTab) {
        handleTabClick(activeTab);
      }
    }
  }, [navigationTabsWithState, navState.focusedTab, handleTabClick]);

  /**
   * Responsive Behavior Effect
   * Handles responsive behavior and compact mode
   */
  useEffect(() => {
    const handleResize = () => {
      const isCompact = window.innerWidth < bottomNavConfig.compactModeThreshold;
      setNavState(prev => ({ ...prev, isCompact }));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [bottomNavConfig.compactModeThreshold]);

  /**
   * Dashboard Context Sync Effect
   * Syncs bottom navigation with dashboard state changes
   */
  useEffect(() => {
    if (dashboardContext.state.activeSection) {
      setNavState(prev => ({
        ...prev,
        focusedTab: dashboardContext.state.activeSection,
      }));
    }
  }, [dashboardContext.state.activeSection]);

  /**
   * Animation Variants
   * Framer Motion animation configurations
   */
  const bottomNavVariants = {
    hidden: {
      y: 100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
        staggerChildren: 0.05,
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const indicatorVariants = {
    initial: { scaleX: 0, originX: 0.5 },
    animate: { 
      scaleX: 1,
      transition: {
        duration: bottomNavConfig.animationDuration / 1000,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  return (
    <motion.nav
      ref={bottomNavRef}
      className={`
        ${position === 'fixed' ? 'fixed' : position === 'sticky' ? 'sticky' : 'relative'}
        bottom-0 left-0 right-0 z-30
        bg-white/95 backdrop-blur-md border-t border-sage-green/20
        shadow-lg supports-[backdrop-filter]:bg-white/80
        ${className}
      `}
      initial="hidden"
      animate="visible"
      variants={bottomNavVariants}
      onKeyDown={handleKeyDown}
      role="navigation"
      aria-label="Bottom navigation"
    >
      {/* Tab Container */}
      <div className={`
        flex justify-center items-center
        ${navState.isCompact ? 'px-2' : 'px-4'}
        py-2 max-w-md mx-auto
      `}>
        {navigationTabsWithState.map((tab, index) => (
          <motion.div
            key={tab.id}
            variants={tabVariants}
            className="flex-1 relative"
          >
            <BottomNavigationTab
              tab={tab}
              isCompact={navState.isCompact}
              isFocused={navState.focusedTab === tab.id}
              showLabels={bottomNavConfig.showLabels}
              highlightColor={bottomNavConfig.highlightColor}
              onClick={() => handleTabClick(tab)}
              onFocus={() => setNavState(prev => ({ ...prev, focusedTab: tab.id }))}
              ref={(el: HTMLButtonElement | null) => {
                if (el) {
                  tabRefs.current.set(tab.id, el);
                } else {
                  tabRefs.current.delete(tab.id);
                }
              }}
            />

            {/* Active Tab Indicator */}
            {tab.isActive && (
              <motion.div
                className={`
                  absolute bottom-0 left-1/2 -translate-x-1/2
                  w-8 h-1 bg-${bottomNavConfig.highlightColor} rounded-full
                `}
                initial="initial"
                animate="animate"
                variants={indicatorVariants}
                layoutId="bottomNavIndicator"
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
}

/**
 * Bottom Navigation Tab Component
 * Individual navigation tab with hover, focus, and active states
 */
interface BottomNavigationTabProps {
  tab: BottomNavigationTab;
  isCompact: boolean;
  isFocused: boolean;
  showLabels: boolean;
  highlightColor: string;
  onClick: () => void;
  onFocus: () => void;
}

const BottomNavigationTab = React.forwardRef<HTMLButtonElement, BottomNavigationTabProps>(
  ({ tab, isCompact, isFocused, showLabels, highlightColor, onClick, onFocus }, ref) => {
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        onFocus={onFocus}
        disabled={tab.disabled}
        className={`
          flex flex-col items-center justify-center p-2 rounded-lg
          transition-all duration-200 group relative
          ${tab.isActive 
            ? `text-${highlightColor}` 
            : 'text-charcoal-light hover:text-charcoal-dark focus:text-charcoal-dark'
          }
          ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isFocused ? `ring-2 ring-${highlightColor}/30` : ''}
          focus:outline-none
          ${isCompact ? 'min-w-0' : 'min-w-16'}
        `}
        whileHover={!tab.disabled ? { scale: 1.05 } : {}}
        whileTap={!tab.disabled ? { scale: 0.95 } : {}}
        aria-label={tab.description || tab.label}
        aria-current={tab.isActive ? 'page' : undefined}
      >
        {/* Icon */}
        <div className={`
          flex items-center justify-center relative
          ${isCompact ? 'text-lg' : 'text-xl'}
          ${tab.isActive ? 'transform scale-110' : ''}
          transition-transform duration-200
        `}>
          {typeof tab.icon === 'string' ? (
            <span>{tab.icon}</span>
          ) : (
            tab.icon
          )}
          
          {/* Badge */}
          {tab.badge && (
            <span className={`
              absolute -top-1 -right-1 px-1 py-0.5 text-xs rounded-full
              bg-orange-warm text-white min-w-4 h-4 flex items-center justify-center
              ${isCompact ? 'text-xs' : 'text-xs'}
            `}>
              {tab.badge}
            </span>
          )}
        </div>

        {/* Label */}
        {showLabels && !isCompact && (
          <span className={`
            text-xs mt-1 font-medium leading-none
            ${tab.isActive ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'}
            transition-opacity duration-200
          `}>
            {tab.label}
          </span>
        )}

        {/* Hover Effect */}
        <motion.div
          className={`
            absolute inset-0 rounded-lg bg-${highlightColor}/5
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          `}
          initial={false}
          animate={{ opacity: tab.isActive ? 0.1 : 0 }}
        />
      </motion.button>
    );
  }
);

BottomNavigationTab.displayName = 'BottomNavigationTab';

/**
 * Dashboard Bottom Navigation Exports
 * Named exports for component and related types
 */
export {
  type BottomNavigationTab,
  type BottomNavigationState,
  type BottomNavigationConfig,
  type DashboardBottomNavigationProps,
}; 