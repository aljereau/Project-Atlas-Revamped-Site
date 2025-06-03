'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import DashboardLayoutManager, { DashboardLayoutContextValue } from './DashboardLayoutManager';
import { enhancedDashboardAnimations } from '@/animations/enhancedDashboardAnimations';

/**
 * Dashboard Provider Configuration Interface
 * Advanced configuration for dashboard provider behavior
 */
export interface DashboardProviderConfig {
  /** Enable state persistence across sessions */
  enableStatePersistence: boolean;
  /** Enable performance monitoring */
  enablePerformanceMonitoring: boolean;
  /** Enable error boundary */
  enableErrorBoundary: boolean;
  /** Storage key for state persistence */
  storageKey: string;
  /** Performance monitoring configuration */
  performanceConfig: {
    enableFPSMonitoring: boolean;
    targetFPS: number;
    enableMemoryMonitoring: boolean;
    reportingInterval: number;
  };
  /** Error handling configuration */
  errorConfig: {
    enableErrorReporting: boolean;
    maxRetries: number;
    fallbackComponent?: React.ComponentType;
  };
  /** Animation configuration */
  animationConfig: {
    enabled: boolean;
    qualityLevel: 'minimal' | 'standard' | 'premium';
    respectReducedMotion: boolean;
  };
}

/**
 * Dashboard Provider Props Interface
 */
export interface DashboardProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Provider configuration */
  config?: Partial<DashboardProviderConfig>;
  /** Error callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Performance callback */
  onPerformanceUpdate?: (metrics: any) => void;
  /** State change callback */
  onStateChange?: (state: any) => void;
}

/**
 * Default Dashboard Provider Configuration
 */
const defaultProviderConfig: DashboardProviderConfig = {
  enableStatePersistence: true,
  enablePerformanceMonitoring: true,
  enableErrorBoundary: true,
  storageKey: 'atlas-dashboard-state',
  performanceConfig: {
    enableFPSMonitoring: true,
    targetFPS: 60,
    enableMemoryMonitoring: true,
    reportingInterval: 5000,
  },
  errorConfig: {
    enableErrorReporting: true,
    maxRetries: 3,
  },
  animationConfig: {
    enabled: true,
    qualityLevel: 'standard',
    respectReducedMotion: true,
  },
};

/**
 * Dashboard Error Boundary Component
 * Catches and handles dashboard errors gracefully
 */
class DashboardErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ComponentType;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Boundary caught error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultDashboardErrorFallback;
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}

/**
 * Default Dashboard Error Fallback Component
 */
const DefaultDashboardErrorFallback: React.FC = () => (
  <div className="min-h-screen bg-paper-white flex items-center justify-center">
    <div className="max-w-md mx-auto text-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-charcoal-dark mb-2">Dashboard Error</h2>
      <p className="text-charcoal-light mb-4">
        Something went wrong with the dashboard system. Please refresh the page to try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-sage-green text-white px-6 py-2 rounded-lg hover:bg-sage-green/90 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

/**
 * Performance Monitor Hook
 * Monitors dashboard performance metrics
 */
function usePerformanceMonitor(
  config: DashboardProviderConfig['performanceConfig'],
  onUpdate?: (metrics: any) => void
) {
  const metricsRef = useRef<any>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!config.enableFPSMonitoring && !config.enableMemoryMonitoring) return;

    const collectMetrics = () => {
      const metrics: any = {
        timestamp: Date.now(),
      };

      // FPS Monitoring
      if (config.enableFPSMonitoring) {
        metrics.fps = enhancedDashboardAnimations.getPerformanceMetrics().currentFPS;
      }

      // Memory Monitoring
      if (config.enableMemoryMonitoring && 'memory' in performance) {
        const memory = (performance as any).memory;
        metrics.memory = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
        };
      }

      metricsRef.current = metrics;
      
      if (onUpdate) {
        onUpdate(metrics);
      }
    };

    // Initial collection
    collectMetrics();

    // Periodic collection
    intervalRef.current = setInterval(collectMetrics, config.reportingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [config, onUpdate]);

  return metricsRef.current;
}

/**
 * State Persistence Hook
 * Handles dashboard state persistence across sessions
 */
function useStatePersistence(
  storageKey: string,
  enabled: boolean,
  onStateChange?: (state: any) => void
) {
  const saveState = useCallback((state: any) => {
    if (!enabled) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      if (onStateChange) {
        onStateChange(state);
      }
    } catch (error) {
      console.warn('Failed to save dashboard state:', error);
    }
  }, [storageKey, enabled, onStateChange]);

  const loadState = useCallback(() => {
    if (!enabled) return null;

    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load dashboard state:', error);
      return null;
    }
  }, [storageKey, enabled]);

  return { saveState, loadState };
}

/**
 * Dashboard Provider Component
 * 
 * Comprehensive provider component that wraps the entire dashboard system
 * with advanced features including state persistence, error boundaries,
 * performance monitoring, and configuration management.
 * 
 * Key Features:
 * - Error boundary with graceful fallbacks
 * - State persistence across browser sessions
 * - Performance monitoring with FPS and memory tracking
 * - Animation configuration and optimization
 * - Reduced motion accessibility support
 * - Comprehensive error handling and reporting
 * 
 * Architecture:
 * - Higher-order component wrapping pattern
 * - Custom hooks for advanced functionality
 * - React Error Boundary implementation
 * - Performance optimization with monitoring
 * - TypeScript strict mode compliance
 * 
 * @component DashboardProvider
 * @param {DashboardProviderProps} props - Provider props
 * @returns {JSX.Element} Dashboard provider component
 */
export default function DashboardProvider({
  children,
  config = {},
  onError,
  onPerformanceUpdate,
  onStateChange,
}: DashboardProviderProps): JSX.Element {

  // Merge configuration with defaults
  const providerConfig = React.useMemo(() => ({
    ...defaultProviderConfig,
    ...config,
    performanceConfig: {
      ...defaultProviderConfig.performanceConfig,
      ...config.performanceConfig,
    },
    errorConfig: {
      ...defaultProviderConfig.errorConfig,
      ...config.errorConfig,
    },
    animationConfig: {
      ...defaultProviderConfig.animationConfig,
      ...config.animationConfig,
    },
  }), [config]);

  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor(
    providerConfig.performanceConfig,
    onPerformanceUpdate
  );

  // State persistence
  const { saveState, loadState } = useStatePersistence(
    providerConfig.storageKey,
    providerConfig.enableStatePersistence,
    onStateChange
  );

  // Animation configuration effect
  useEffect(() => {
    enhancedDashboardAnimations.updateConfiguration({
      enabled: providerConfig.animationConfig.enabled,
      qualityLevel: providerConfig.animationConfig.qualityLevel,
      respectReducedMotion: providerConfig.animationConfig.respectReducedMotion,
      enablePerformanceMonitoring: providerConfig.enablePerformanceMonitoring,
    });
  }, [providerConfig]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      enhancedDashboardAnimations.cleanup();
    };
  }, []);

  const content = (
    <DashboardLayoutManager
      enableStatePersistence={providerConfig.enableStatePersistence}
      storageKey={providerConfig.storageKey}
      animationConfig={providerConfig.animationConfig}
      onStateChange={saveState}
      initialState={loadState()}
    >
      {children}
    </DashboardLayoutManager>
  );

  // Error boundary wrapper
  if (providerConfig.enableErrorBoundary) {
    return (
      <DashboardErrorBoundary
        fallback={providerConfig.errorConfig.fallbackComponent}
        onError={onError}
      >
        {content}
      </DashboardErrorBoundary>
    );
  }

  return content;
}

/**
 * Dashboard Provider Exports
 * Named exports for provider and related types
 */
export type {
  DashboardProviderConfig,
  DashboardProviderProps,
}; 