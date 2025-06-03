'use client';

import React, { useCallback, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { AtlasContent } from '@/types';

/**
 * Dashboard Layout States
 * Defines the primary layout modes for the Atlas application
 */
export type DashboardLayoutState = 'homepage' | 'dashboard';

/**
 * Dashboard Section Types
 * Defines all possible content sections that can be displayed in dashboard panels
 */
export type DashboardSection = 
  | 'what-we-build' 
  | 'why-we-exist' 
  | 'who-we-are' 
  | 'our-timeline'
  | 'about-atlas'
  | 'atlas-tools' 
  | 'project-log'
  | 'get-involved'
  | 'contact'
  | null;

/**
 * Dashboard Layout Manager State Interface
 * Comprehensive state management for dashboard layout transformations
 */
export interface DashboardLayoutManagerState {
  /** Current layout mode (homepage or dashboard) */
  currentLayout: DashboardLayoutState;
  /** Active content section in dashboard panel */
  activeSection: DashboardSection;
  /** Whether layout is currently transforming */
  isTransforming: boolean;
  /** Dashboard visibility state for animations */
  isDashboardVisible: boolean;
  /** Navigation history for proper back/forward functionality */
  navigationHistory: DashboardSection[];
  /** Previous layout for restore functionality */
  previousLayout: DashboardLayoutState | null;
  /** URL sync state for browser navigation */
  urlSyncEnabled: boolean;
  /** Mobile layout adaptations */
  isMobile: boolean;
  /** Sidebar collapse state for mobile */
  isSidebarCollapsed: boolean;
}

/**
 * Dashboard Layout Manager Actions
 * All possible actions for layout state management
 */
export type DashboardLayoutManagerAction =
  | { type: 'TRANSFORM_TO_DASHBOARD'; section: DashboardSection }
  | { type: 'TRANSFORM_TO_HOMEPAGE' }
  | { type: 'NAVIGATE_TO_SECTION'; section: DashboardSection }
  | { type: 'SET_TRANSFORMING'; isTransforming: boolean }
  | { type: 'SET_DASHBOARD_VISIBLE'; isVisible: boolean }
  | { type: 'SET_MOBILE_MODE'; isMobile: boolean }
  | { type: 'TOGGLE_SIDEBAR'; collapsed?: boolean }
  | { type: 'SYNC_URL_STATE'; section: DashboardSection }
  | { type: 'RESTORE_PREVIOUS_LAYOUT' }
  | { type: 'CLEAR_NAVIGATION_HISTORY' };

/**
 * Dashboard Layout Context Interface
 * Context interface for consuming components
 */
export interface DashboardLayoutContextValue {
  /** Current dashboard state */
  state: DashboardLayoutManagerState;
  /** Transform homepage to dashboard with specific section */
  transformToDashboard: (section: DashboardSection) => void;
  /** Transform dashboard back to homepage */
  transformToHomepage: () => void;
  /** Navigate to different section within dashboard */
  navigateToSection: (section: DashboardSection) => void;
  /** Toggle sidebar collapsed state */
  toggleSidebar: (collapsed?: boolean) => void;
  /** Restore previous layout state */
  restorePreviousLayout: () => void;
  /** Check if specific section is active */
  isSectionActive: (section: DashboardSection) => boolean;
  /** Get navigation breadcrumb path */
  getNavigationPath: () => DashboardSection[];
}

/**
 * Initial state for Dashboard Layout Manager
 * Following universal project structure governance for state initialization
 */
const initialState: DashboardLayoutManagerState = {
  currentLayout: 'homepage',
  activeSection: null,
  isTransforming: false,
  isDashboardVisible: false,
  navigationHistory: [],
  previousLayout: null,
  urlSyncEnabled: true,
  isMobile: false,
  isSidebarCollapsed: false,
};

/**
 * Dashboard Layout Reducer
 * Pure function managing all layout state transitions
 * Following backend-integrity-no-direct-modification principles
 */
function dashboardLayoutReducer(
  state: DashboardLayoutManagerState,
  action: DashboardLayoutManagerAction
): DashboardLayoutManagerState {
  switch (action.type) {
    case 'TRANSFORM_TO_DASHBOARD':
      return {
        ...state,
        currentLayout: 'dashboard',
        activeSection: action.section,
        isTransforming: true,
        isDashboardVisible: true,
        previousLayout: state.currentLayout,
        navigationHistory: [...state.navigationHistory, action.section].filter(Boolean) as DashboardSection[],
      };

    case 'TRANSFORM_TO_HOMEPAGE':
      return {
        ...state,
        currentLayout: 'homepage',
        activeSection: null,
        isTransforming: true,
        isDashboardVisible: false,
        previousLayout: state.currentLayout,
      };

    case 'NAVIGATE_TO_SECTION':
      return {
        ...state,
        activeSection: action.section,
        navigationHistory: [...state.navigationHistory, action.section].filter(Boolean) as DashboardSection[],
      };

    case 'SET_TRANSFORMING':
      return {
        ...state,
        isTransforming: action.isTransforming,
      };

    case 'SET_DASHBOARD_VISIBLE':
      return {
        ...state,
        isDashboardVisible: action.isVisible,
      };

    case 'SET_MOBILE_MODE':
      return {
        ...state,
        isMobile: action.isMobile,
        // Auto-collapse sidebar on mobile
        isSidebarCollapsed: action.isMobile ? true : state.isSidebarCollapsed,
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isSidebarCollapsed: action.collapsed !== undefined ? action.collapsed : !state.isSidebarCollapsed,
      };

    case 'SYNC_URL_STATE':
      // URL state sync logic without modifying other state
      return state;

    case 'RESTORE_PREVIOUS_LAYOUT':
      if (state.previousLayout) {
        return {
          ...state,
          currentLayout: state.previousLayout,
          isTransforming: true,
          activeSection: state.previousLayout === 'homepage' ? null : state.activeSection,
        };
      }
      return state;

    case 'CLEAR_NAVIGATION_HISTORY':
      return {
        ...state,
        navigationHistory: [],
      };

    default:
      return state;
  }
}

/**
 * Dashboard Layout Context
 * React Context for dashboard layout state management
 */
const DashboardLayoutContext = React.createContext<DashboardLayoutContextValue | null>(null);

/**
 * Dashboard Layout Manager Props Interface
 * Props for the main layout manager component
 */
export interface DashboardLayoutManagerProps {
  /** Child components (typically the entire app) */
  children: React.ReactNode;
  /** Initial section to load (for URL deep linking) */
  initialSection?: DashboardSection;
  /** Initial layout mode */
  initialLayout?: DashboardLayoutState;
  /** Custom content mapping */
  content?: Partial<AtlasContent>;
}

/**
 * Dashboard Layout Manager Component
 * 
 * Core component managing homepage ↔ dashboard layout transformations.
 * Implements comprehensive state management, URL persistence, mobile adaptation,
 * and Apple-inspired animation coordination.
 * 
 * Architecture follows:
 * - Universal project structure governance
 * - Component composition principles  
 * - TypeScript strict mode compliance
 * - Atlas Design System integration
 * - 60fps performance requirements
 * 
 * @component DashboardLayoutManager
 * @param {DashboardLayoutManagerProps} props - Component props
 * @returns {JSX.Element} Dashboard layout manager with context provider
 */
export default function DashboardLayoutManager({
  children,
  initialSection = null,
  initialLayout = 'homepage',
  content,
}: DashboardLayoutManagerProps): JSX.Element {
  
  // Initialize state with URL parameters if available
  const [state, dispatch] = React.useReducer(dashboardLayoutReducer, {
    ...initialState,
    activeSection: initialSection,
    currentLayout: initialLayout,
    isDashboardVisible: initialLayout === 'dashboard',
  });

  /**
   * Mobile Detection Effect
   * Responsive dashboard adaptation following mobile-first principles
   */
  useEffect(() => {
    const checkMobileMode = () => {
      const isMobileView = window.innerWidth < 768; // Tailwind md breakpoint
      dispatch({ type: 'SET_MOBILE_MODE', isMobile: isMobileView });
    };

    checkMobileMode();
    window.addEventListener('resize', checkMobileMode);
    
    return () => window.removeEventListener('resize', checkMobileMode);
  }, []);

  /**
   * URL State Synchronization Effect
   * Maintains URL state for dashboard sections (SEO and shareability)
   */
  useEffect(() => {
    if (!state.urlSyncEnabled) return;

    const updateURL = () => {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      if (state.currentLayout === 'dashboard' && state.activeSection) {
        searchParams.set('section', state.activeSection);
        searchParams.set('layout', 'dashboard');
      } else {
        searchParams.delete('section');
        searchParams.delete('layout');
      }

      const newURL = `${currentPath}?${searchParams.toString()}`;
      window.history.replaceState({}, '', newURL);
    };

    updateURL();
  }, [state.activeSection, state.currentLayout, state.urlSyncEnabled]);

  /**
   * Transform to Dashboard Handler
   * Initiates homepage → dashboard transformation with specified section
   */
  const transformToDashboard = useCallback((section: DashboardSection) => {
    dispatch({ type: 'TRANSFORM_TO_DASHBOARD', section });
    
    // Animation sequence timing
    setTimeout(() => {
      dispatch({ type: 'SET_TRANSFORMING', isTransforming: false });
    }, 600); // Apple-inspired transition duration
  }, []);

  /**
   * Transform to Homepage Handler  
   * Initiates dashboard → homepage transformation ("Restore Up" functionality)
   */
  const transformToHomepage = useCallback(() => {
    dispatch({ type: 'TRANSFORM_TO_HOMEPAGE' });
    
    // Animation sequence timing
    setTimeout(() => {
      dispatch({ type: 'SET_TRANSFORMING', isTransforming: false });
      dispatch({ type: 'CLEAR_NAVIGATION_HISTORY' });
    }, 600);
  }, []);

  /**
   * Navigate to Section Handler
   * Internal dashboard navigation between sections
   */
  const navigateToSection = useCallback((section: DashboardSection) => {
    dispatch({ type: 'NAVIGATE_TO_SECTION', section });
  }, []);

  /**
   * Toggle Sidebar Handler
   * Mobile sidebar collapse/expand functionality
   */
  const toggleSidebar = useCallback((collapsed?: boolean) => {
    dispatch({ type: 'TOGGLE_SIDEBAR', collapsed });
  }, []);

  /**
   * Restore Previous Layout Handler
   * Restores previous layout state (advanced navigation)
   */
  const restorePreviousLayout = useCallback(() => {
    dispatch({ type: 'RESTORE_PREVIOUS_LAYOUT' });
  }, []);

  /**
   * Section Active Check Utility
   * Determines if specific section is currently active
   */
  const isSectionActive = useCallback((section: DashboardSection): boolean => {
    return state.activeSection === section;
  }, [state.activeSection]);

  /**
   * Navigation Path Utility
   * Returns current navigation breadcrumb path
   */
  const getNavigationPath = useCallback((): DashboardSection[] => {
    return state.navigationHistory;
  }, [state.navigationHistory]);

  /**
   * Context Value Assembly
   * Assembled context value for consuming components
   */
  const contextValue: DashboardLayoutContextValue = {
    state,
    transformToDashboard,
    transformToHomepage,
    navigateToSection,
    toggleSidebar,
    restorePreviousLayout,
    isSectionActive,
    getNavigationPath,
  };

  /**
   * Layout Animation Variants
   * Apple-inspired animation configurations for layout transformations
   */
  const layoutVariants = {
    homepage: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1], // Apple easing curve
      },
    },
    dashboard: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    transforming: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  return (
    <DashboardLayoutContext.Provider value={contextValue}>
      <LayoutGroup>
        <motion.div
          className="min-h-screen bg-paper-white"
          initial="homepage"
          animate={
            state.isTransforming 
              ? 'transforming' 
              : state.currentLayout
          }
          variants={layoutVariants}
          style={{
            willChange: 'transform, opacity',
          }}
        >
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </DashboardLayoutContext.Provider>
  );
}

/**
 * Dashboard Layout Hook
 * 
 * Custom hook for consuming dashboard layout context.
 * Provides type-safe access to dashboard state and actions.
 * 
 * @returns {DashboardLayoutContextValue} Dashboard layout context value
 * @throws {Error} When used outside of DashboardLayoutManager provider
 */
export function useDashboardLayout(): DashboardLayoutContextValue {
  const context = React.useContext(DashboardLayoutContext);
  
  if (!context) {
    throw new Error(
      'useDashboardLayout must be used within a DashboardLayoutManager provider. ' +
      'Ensure your component is wrapped with <DashboardLayoutManager>.'
    );
  }
  
  return context;
}

/**
 * Dashboard Layout Context Export
 * Named export for context (for testing and advanced usage)
 */
export { DashboardLayoutContext }; 