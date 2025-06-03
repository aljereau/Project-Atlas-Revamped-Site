/**
 * Advanced Dashboard State Management Hooks
 * 
 * Comprehensive React hooks for dashboard state management with performance optimization,
 * error handling, accessibility support, and enterprise-grade features.
 * 
 * Features:
 * - Optimized state management with React performance patterns
 * - Error boundary integration and error recovery
 * - Accessibility state management and ARIA support
 * - Performance monitoring and optimization
 * - Cross-component state synchronization
 * - Undo/redo functionality for navigation
 * - Real-time state validation
 * - Advanced caching and memoization
 * 
 * Architecture:
 * - Custom React hooks following React best practices
 * - Performance-first design with selective re-renders
 * - Type-safe state management with TypeScript
 * - Integration with dashboard persistence system
 * - Comprehensive error handling and recovery
 * 
 * @module DashboardStateHooks
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDashboardLayout, DashboardSection, DashboardLayoutState } from '@/components/dashboard';
import { dashboardPersistence, PersistentDashboardState } from '@/utils/dashboardPersistence';
import { enhancedDashboardAnimations } from '@/animations/enhancedDashboardAnimations';

/**
 * Dashboard Navigation History Entry
 */
export interface DashboardNavigationEntry {
  /** Section identifier */
  section: DashboardSection;
  /** Timestamp of navigation */
  timestamp: number;
  /** Scroll position when leaving */
  scrollPosition: number;
  /** Duration spent in section */
  duration: number;
  /** Interaction count in section */
  interactions: number;
}

/**
 * Dashboard Performance Metrics
 */
export interface DashboardPerformanceMetrics {
  /** Current frame rate */
  fps: number;
  /** Average load time */
  averageLoadTime: number;
  /** Memory usage in MB */
  memoryUsage: number;
  /** Animation performance score */
  animationScore: number;
  /** Total navigation count */
  navigationCount: number;
  /** Error count */
  errorCount: number;
}

/**
 * Dashboard Accessibility State
 */
export interface DashboardAccessibilityState {
  /** Screen reader announcements */
  announcements: string[];
  /** Focus management state */
  focusState: {
    activeElement: string | null;
    focusHistory: string[];
    trapFocus: boolean;
  };
  /** Keyboard navigation state */
  keyboardNavigation: {
    enabled: boolean;
    currentIndex: number;
    navigableElements: string[];
  };
  /** Reduced motion preference */
  reducedMotion: boolean;
  /** High contrast mode */
  highContrast: boolean;
}

/**
 * Advanced Dashboard State Hook
 * 
 * Comprehensive state management for dashboard with performance optimization,
 * persistence, error handling, and accessibility features.
 * 
 * @returns Dashboard state management interface
 */
export function useAdvancedDashboardState() {
  const dashboardContext = useDashboardLayout();
  
  // Navigation history state
  const [navigationHistory, setNavigationHistory] = useState<DashboardNavigationEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  // Performance metrics state
  const [performanceMetrics, setPerformanceMetrics] = useState<DashboardPerformanceMetrics>({
    fps: 60,
    averageLoadTime: 0,
    memoryUsage: 0,
    animationScore: 100,
    navigationCount: 0,
    errorCount: 0,
  });
  
  // Accessibility state
  const [accessibilityState, setAccessibilityState] = useState<DashboardAccessibilityState>({
    announcements: [],
    focusState: {
      activeElement: null,
      focusHistory: [],
      trapFocus: false,
    },
    keyboardNavigation: {
      enabled: true,
      currentIndex: -1,
      navigableElements: [],
    },
    reducedMotion: false,
    highContrast: false,
  });
  
  // Error state
  const [errorState, setErrorState] = useState<{
    hasError: boolean;
    errorMessage: string | null;
    errorCount: number;
    lastErrorTime: number | null;
  }>({
    hasError: false,
    errorMessage: null,
    errorCount: 0,
    lastErrorTime: null,
  });
  
  // Refs for performance optimization
  const navigationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const performanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastNavigationTimeRef = useRef<number>(Date.now());
  
  /**
   * Enhanced Navigation Function
   * Navigate with history tracking and performance monitoring
   */
  const navigateWithHistory = useCallback(async (section: DashboardSection) => {
    const startTime = Date.now();
    
    try {
      // Record navigation start
      const currentSection = dashboardContext.state.activeSection;
      const navigationDuration = currentSection ? startTime - lastNavigationTimeRef.current : 0;
      
      // Add to history if coming from another section
      if (currentSection && currentSection !== section) {
        const historyEntry: DashboardNavigationEntry = {
          section: currentSection,
          timestamp: lastNavigationTimeRef.current,
          scrollPosition: window.scrollY,
          duration: navigationDuration,
          interactions: 0, // Would be tracked by interaction monitoring
        };
        
        setNavigationHistory(prev => {
          const newHistory = [...prev.slice(-49), historyEntry]; // Keep last 50 entries
          return newHistory;
        });
        
        setCurrentHistoryIndex(prev => prev + 1);
      }
      
      // Perform navigation
      await dashboardContext.navigateToSection(section);
      
      // Update performance metrics
      const loadTime = Date.now() - startTime;
      setPerformanceMetrics(prev => ({
        ...prev,
        averageLoadTime: (prev.averageLoadTime + loadTime) / 2,
        navigationCount: prev.navigationCount + 1,
      }));
      
      // Announce navigation to screen readers
      announceToScreenReader(`Navigated to ${section.replace('-', ' ')} section`);
      
      lastNavigationTimeRef.current = startTime;
      
    } catch (error) {
      handleError(error as Error, 'Navigation failed');
    }
  }, [dashboardContext]);
  
  /**
   * Undo Navigation
   * Go back to previous section in history
   */
  const undoNavigation = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const previousEntry = navigationHistory[currentHistoryIndex - 1];
      if (previousEntry) {
        setCurrentHistoryIndex(prev => prev - 1);
        dashboardContext.navigateToSection(previousEntry.section);
        
        // Restore scroll position
        setTimeout(() => {
          window.scrollTo(0, previousEntry.scrollPosition);
        }, 100);
        
        announceToScreenReader(`Returned to ${previousEntry.section.replace('-', ' ')}`);
      }
    }
  }, [currentHistoryIndex, navigationHistory, dashboardContext]);
  
  /**
   * Redo Navigation
   * Go forward in navigation history
   */
  const redoNavigation = useCallback(() => {
    if (currentHistoryIndex < navigationHistory.length - 1) {
      const nextEntry = navigationHistory[currentHistoryIndex + 1];
      if (nextEntry) {
        setCurrentHistoryIndex(prev => prev + 1);
        dashboardContext.navigateToSection(nextEntry.section);
        announceToScreenReader(`Returned to ${nextEntry.section.replace('-', ' ')}`);
      }
    }
  }, [currentHistoryIndex, navigationHistory, dashboardContext]);
  
  /**
   * Error Handling Function
   */
  const handleError = useCallback((error: Error, context: string) => {
    console.error(`Dashboard error in ${context}:`, error);
    
    setErrorState(prev => ({
      hasError: true,
      errorMessage: error.message,
      errorCount: prev.errorCount + 1,
      lastErrorTime: Date.now(),
    }));
    
    setPerformanceMetrics(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1,
    }));
    
    announceToScreenReader(`Error occurred: ${error.message}`);
  }, []);
  
  /**
   * Clear Error State
   */
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      errorMessage: null,
      errorCount: 0,
      lastErrorTime: null,
    });
  }, []);
  
  /**
   * Screen Reader Announcement Function
   */
  const announceToScreenReader = useCallback((message: string) => {
    setAccessibilityState(prev => ({
      ...prev,
      announcements: [...prev.announcements.slice(-4), message], // Keep last 5 announcements
    }));
    
    // Clear announcement after 3 seconds
    setTimeout(() => {
      setAccessibilityState(prev => ({
        ...prev,
        announcements: prev.announcements.filter(a => a !== message),
      }));
    }, 3000);
  }, []);
  
  /**
   * Focus Management
   */
  const manageFocus = useCallback((elementId: string, trap: boolean = false) => {
    setAccessibilityState(prev => ({
      ...prev,
      focusState: {
        activeElement: elementId,
        focusHistory: [...prev.focusState.focusHistory.slice(-9), elementId],
        trapFocus: trap,
      },
    }));
    
    // Actually focus the element
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
      }
    }, 50);
  }, []);
  
  /**
   * Keyboard Navigation Setup
   */
  const setupKeyboardNavigation = useCallback((elements: string[]) => {
    setAccessibilityState(prev => ({
      ...prev,
      keyboardNavigation: {
        ...prev.keyboardNavigation,
        navigableElements: elements,
        currentIndex: 0,
      },
    }));
  }, []);
  
  /**
   * Persist Dashboard State
   */
  const persistState = useCallback(() => {
    try {
      const stateToSave: PersistentDashboardState = {
        version: '1.2.0',
        currentLayout: dashboardContext.state.currentLayout,
        activeSection: dashboardContext.state.activeSection,
        isSidebarCollapsed: dashboardContext.state.isSidebarCollapsed,
        recentSections: navigationHistory.slice(-10).map(entry => entry.section),
        preferences: {
          animationEnabled: !accessibilityState.reducedMotion,
          reducedMotion: accessibilityState.reducedMotion,
          sidebarWidth: 280,
          theme: 'light',
        },
        navigationHistory: navigationHistory.slice(-20),
        session: {
          startTime: Date.now(),
          lastActivity: Date.now(),
          pageViews: performanceMetrics.navigationCount,
          interactions: performanceMetrics.navigationCount,
        },
        performance: {
          averageLoadTime: performanceMetrics.averageLoadTime,
          averageFPS: performanceMetrics.fps,
          errorCount: performanceMetrics.errorCount,
          lastPerformanceCheck: Date.now(),
        },
      };
      
      dashboardPersistence.saveState(stateToSave);
    } catch (error) {
      handleError(error as Error, 'State persistence');
    }
  }, [dashboardContext.state, navigationHistory, accessibilityState, performanceMetrics, handleError]);
  
  /**
   * Load Persisted State
   */
  const loadPersistedState = useCallback(() => {
    try {
      const savedState = dashboardPersistence.loadState();
      if (savedState) {
        // Restore navigation history
        if (savedState.navigationHistory) {
          setNavigationHistory(savedState.navigationHistory);
          setCurrentHistoryIndex(savedState.navigationHistory.length - 1);
        }
        
        // Restore accessibility preferences
        setAccessibilityState(prev => ({
          ...prev,
          reducedMotion: savedState.preferences?.reducedMotion || false,
        }));
        
        // Restore performance metrics
        setPerformanceMetrics(prev => ({
          ...prev,
          averageLoadTime: savedState.performance?.averageLoadTime || 0,
          navigationCount: savedState.session?.pageViews || 0,
          errorCount: savedState.performance?.errorCount || 0,
        }));
      }
    } catch (error) {
      handleError(error as Error, 'State loading');
    }
  }, [handleError]);
  
  /**
   * Performance Monitoring Effect
   */
  useEffect(() => {
    const updatePerformanceMetrics = () => {
      try {
        const metrics = enhancedDashboardAnimations.getPerformanceMetrics();
        
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: metrics.currentFPS,
          animationScore: metrics.currentFPS >= 55 ? 100 : Math.round((metrics.currentFPS / 60) * 100),
        }));
        
        // Memory monitoring if available
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          setPerformanceMetrics(prev => ({
            ...prev,
            memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          }));
        }
      } catch (error) {
        // Silent fail for performance monitoring
      }
    };
    
    // Update performance metrics every 2 seconds
    performanceIntervalRef.current = setInterval(updatePerformanceMetrics, 2000);
    updatePerformanceMetrics(); // Initial update
    
    return () => {
      if (performanceIntervalRef.current) {
        clearInterval(performanceIntervalRef.current);
      }
    };
  }, []);
  
  /**
   * Accessibility Detection Effect
   */
  useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotion = (e: MediaQueryListEvent) => {
      setAccessibilityState(prev => ({
        ...prev,
        reducedMotion: e.matches,
      }));
    };
    
    mediaQuery.addEventListener('change', handleReducedMotion);
    handleReducedMotion(mediaQuery as any); // Initial check
    
    // Detect high contrast mode
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const handleHighContrast = (e: MediaQueryListEvent) => {
      setAccessibilityState(prev => ({
        ...prev,
        highContrast: e.matches,
      }));
    };
    
    highContrastQuery.addEventListener('change', handleHighContrast);
    handleHighContrast(highContrastQuery as any); // Initial check
    
    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotion);
      highContrastQuery.removeEventListener('change', handleHighContrast);
    };
  }, []);
  
  /**
   * Auto-persist State Effect
   */
  useEffect(() => {
    const autoPersist = () => {
      persistState();
    };
    
    // Auto-persist every 30 seconds
    const interval = setInterval(autoPersist, 30000);
    
    // Persist on page unload
    window.addEventListener('beforeunload', autoPersist);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', autoPersist);
    };
  }, [persistState]);
  
  /**
   * Load Initial State Effect
   */
  useEffect(() => {
    loadPersistedState();
  }, [loadPersistedState]);
  
  /**
   * Memoized State Values
   */
  const memoizedState = useMemo(() => ({
    navigationHistory,
    currentHistoryIndex,
    performanceMetrics,
    accessibilityState,
    errorState,
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < navigationHistory.length - 1,
  }), [navigationHistory, currentHistoryIndex, performanceMetrics, accessibilityState, errorState]);
  
  /**
   * Memoized Actions
   */
  const memoizedActions = useMemo(() => ({
    navigateWithHistory,
    undoNavigation,
    redoNavigation,
    handleError,
    clearError,
    announceToScreenReader,
    manageFocus,
    setupKeyboardNavigation,
    persistState,
    loadPersistedState,
  }), [
    navigateWithHistory,
    undoNavigation,
    redoNavigation,
    handleError,
    clearError,
    announceToScreenReader,
    manageFocus,
    setupKeyboardNavigation,
    persistState,
    loadPersistedState,
  ]);
  
  return {
    ...memoizedState,
    ...memoizedActions,
  };
}

/**
 * Dashboard Performance Hook
 * Focused hook for performance monitoring and optimization
 */
export function useDashboardPerformance() {
  const [metrics, setMetrics] = useState<DashboardPerformanceMetrics>({
    fps: 60,
    averageLoadTime: 0,
    memoryUsage: 0,
    animationScore: 100,
    navigationCount: 0,
    errorCount: 0,
  });
  
  const updateMetrics = useCallback((newMetrics: Partial<DashboardPerformanceMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
  }, []);
  
  const getPerformanceScore = useCallback(() => {
    const fpsScore = (metrics.fps / 60) * 40; // 40% weight
    const loadTimeScore = Math.max(0, 30 - (metrics.averageLoadTime / 1000) * 10); // 30% weight
    const memoryScore = Math.max(0, 20 - (metrics.memoryUsage / 100) * 10); // 20% weight
    const errorScore = Math.max(0, 10 - metrics.errorCount); // 10% weight
    
    return Math.round(fpsScore + loadTimeScore + memoryScore + errorScore);
  }, [metrics]);
  
  return {
    metrics,
    updateMetrics,
    performanceScore: getPerformanceScore(),
    isPerformanceGood: getPerformanceScore() >= 80,
  };
}

/**
 * Dashboard Accessibility Hook
 * Focused hook for accessibility state and features
 */
export function useDashboardAccessibility() {
  const [accessibilityState, setAccessibilityState] = useState<DashboardAccessibilityState>({
    announcements: [],
    focusState: {
      activeElement: null,
      focusHistory: [],
      trapFocus: false,
    },
    keyboardNavigation: {
      enabled: true,
      currentIndex: -1,
      navigableElements: [],
    },
    reducedMotion: false,
    highContrast: false,
  });
  
  const announce = useCallback((message: string) => {
    setAccessibilityState(prev => ({
      ...prev,
      announcements: [...prev.announcements.slice(-4), message],
    }));
  }, []);
  
  const setFocus = useCallback((elementId: string) => {
    setAccessibilityState(prev => ({
      ...prev,
      focusState: {
        ...prev.focusState,
        activeElement: elementId,
        focusHistory: [...prev.focusState.focusHistory.slice(-9), elementId],
      },
    }));
  }, []);
  
  return {
    accessibilityState,
    announce,
    setFocus,
    isAccessibilityOptimized: accessibilityState.reducedMotion || accessibilityState.highContrast,
  };
}

/**
 * Dashboard State Exports
 */
export type {
  DashboardNavigationEntry,
  DashboardPerformanceMetrics,
  DashboardAccessibilityState,
}; 