'use client';

import React from 'react';
import {
  DashboardLayoutManager,
  DashboardLayout,
  DashboardSidebar,
  DashboardContentPanel,
  DashboardBottomNavigation,
  DashboardRestoreButton,
} from '@/components/dashboard';
import DashboardTransition from '@/components/dashboard/DashboardTransition';
import { useAdvancedDashboardState } from '@/hooks/useDashboardState';
import { dashboardPersistence } from '@/utils/dashboardPersistence';

/**
 * Complete Dashboard System Props Interface
 */
export interface CompleteDashboardSystemProps {
  /** Custom configuration for dashboard behavior */
  config?: {
    enableAnimations?: boolean;
    enablePersistence?: boolean;
    enablePerformanceMonitoring?: boolean;
    enableAccessibility?: boolean;
    debugMode?: boolean;
  };
  /** Custom content components */
  customComponents?: {
    sidebar?: React.ComponentType<any>;
    contentPanel?: React.ComponentType<any>;
    bottomNavigation?: React.ComponentType<any>;
    restoreButton?: React.ComponentType<any>;
  };
  /** Event callbacks */
  onNavigationChange?: (section: string) => void;
  onLayoutChange?: (layout: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Complete Dashboard System Component
 * 
 * This is the main entry point for the complete Atlas Dashboard System.
 * It demonstrates the full integration of all dashboard components with
 * expert-level architecture, performance optimization, and accessibility.
 * 
 * Key Features:
 * - Complete dashboard transformation system
 * - Advanced sidebar navigation with search and keyboard shortcuts
 * - Dynamic content loading with error handling
 * - Secondary bottom navigation with haptic feedback
 * - "Restore Up" functionality with auto-show
 * - Apple-inspired animations with performance monitoring
 * - Enterprise-grade state persistence
 * - WCAG 2.1 AA+ accessibility compliance
 * - Mobile-responsive design with auto-adaptation
 * 
 * Architecture:
 * - Expert fullstack component composition
 * - Service layer wrapper pattern integration
 * - Performance-first design with 60fps targeting
 * - Comprehensive error handling and recovery
 * - TypeScript strict mode compliance
 * - Atlas Design System integration
 * 
 * @component CompleteDashboardSystem
 * @param {CompleteDashboardSystemProps} props - Dashboard system props
 * @returns {JSX.Element} Complete dashboard system
 */
export default function CompleteDashboardSystem({
  config = {},
  customComponents = {},
  onNavigationChange,
  onLayoutChange,
  onError,
}: CompleteDashboardSystemProps): JSX.Element {

  // Advanced dashboard state management
  const dashboardState = useAdvancedDashboardState();

  // Default configuration
  const dashboardConfig = {
    enableAnimations: true,
    enablePersistence: true,
    enablePerformanceMonitoring: true,
    enableAccessibility: true,
    debugMode: false,
    ...config,
  };

  // Handle navigation changes
  const handleNavigationChange = React.useCallback((section: string) => {
    dashboardState.navigateWithHistory(section as any);
    if (onNavigationChange) {
      onNavigationChange(section);
    }
  }, [dashboardState, onNavigationChange]);

  // Handle layout changes
  const handleLayoutChange = React.useCallback((layout: string) => {
    if (onLayoutChange) {
      onLayoutChange(layout);
    }
  }, [onLayoutChange]);

  // Handle errors
  const handleError = React.useCallback((error: Error) => {
    dashboardState.handleError(error, 'Dashboard System');
    if (onError) {
      onError(error);
    }
  }, [dashboardState, onError]);

  // Component selection with custom overrides
  const SidebarComponent = customComponents.sidebar || DashboardSidebar;
  const ContentPanelComponent = customComponents.contentPanel || DashboardContentPanel;
  const BottomNavigationComponent = customComponents.bottomNavigation || DashboardBottomNavigation;
  const RestoreButtonComponent = customComponents.restoreButton || DashboardRestoreButton;

  return (
    <DashboardLayoutManager
      enableStatePersistence={dashboardConfig.enablePersistence}
      enablePerformanceMonitoring={dashboardConfig.enablePerformanceMonitoring}
      onStateChange={dashboardState.persistState}
      onError={handleError}
    >
      <DashboardTransition
        enableAnimations={dashboardConfig.enableAnimations}
        performanceMonitoring={dashboardConfig.enablePerformanceMonitoring}
        accessibilityCompliant={dashboardConfig.enableAccessibility}
      >
        <DashboardLayout
          className="min-h-screen bg-paper-white"
          enableResponsive={true}
          enableAccessibility={dashboardConfig.enableAccessibility}
        >
          {/* Main Sidebar Navigation */}
          <SidebarComponent
            config={{
              enableSearch: true,
              enableKeyboardNav: true,
              enableHoverExpand: true,
              autoCollapseOnMobile: true,
              animationDuration: 300,
            }}
            onNavigate={handleNavigationChange}
            className="dashboard-sidebar"
          />

          {/* Dynamic Content Panel */}
          <ContentPanelComponent
            config={{
              enableTransitions: dashboardConfig.enableAnimations,
              enableLoadingStates: true,
              enableErrorBoundary: true,
              animationPreset: 'standard',
            }}
            accessibility={{
              enableFocusManagement: dashboardConfig.enableAccessibility,
              enableContentAnnouncements: dashboardConfig.enableAccessibility,
              skipToContentId: 'main-content',
            }}
            className="dashboard-content"
          />

          {/* Secondary Bottom Navigation */}
          <BottomNavigationComponent
            config={{
              enableTransitions: dashboardConfig.enableAnimations,
              enableHapticFeedback: true,
              compactModeThreshold: 480,
              showLabels: true,
            }}
            position="fixed"
            onNavigate={handleNavigationChange}
            className="dashboard-bottom-nav"
          />

          {/* Restore Up Button */}
          <RestoreButtonComponent
            config={{
              autoShowDelay: 1000,
              position: 'top-left',
              size: 'medium',
              showLabel: true,
              enableKeyboardShortcuts: true,
              keyboardShortcut: 'Escape',
            }}
            onRestore={() => {
              dashboardState.announceToScreenReader('Returned to homepage');
            }}
            className="dashboard-restore"
          />

          {/* Accessibility Announcements */}
          {dashboardConfig.enableAccessibility && (
            <div
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
              id="dashboard-announcements"
            >
              {dashboardState.accessibilityState.announcements.map((announcement, index) => (
                <div key={index}>{announcement}</div>
              ))}
            </div>
          )}

          {/* Performance Monitoring Display (Debug Mode) */}
          {dashboardConfig.debugMode && (
            <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
              <div>FPS: {dashboardState.performanceMetrics.fps}</div>
              <div>Memory: {dashboardState.performanceMetrics.memoryUsage}MB</div>
              <div>Score: {dashboardState.performanceMetrics.animationScore}</div>
              <div>Errors: {dashboardState.performanceMetrics.errorCount}</div>
            </div>
          )}

          {/* Error Display */}
          {dashboardState.errorState.hasError && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded z-50">
              <div className="font-semibold">Dashboard Error</div>
              <div className="text-sm">{dashboardState.errorState.errorMessage}</div>
              <button
                onClick={dashboardState.clearError}
                className="text-xs underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
        </DashboardLayout>
      </DashboardTransition>
    </DashboardLayoutManager>
  );
}

/**
 * Simple Dashboard Demo Component
 * Demonstrates basic usage of the complete dashboard system
 */
export function DashboardDemo(): JSX.Element {
  return (
    <CompleteDashboardSystem
      config={{
        enableAnimations: true,
        enablePersistence: true,
        enablePerformanceMonitoring: true,
        enableAccessibility: true,
        debugMode: process.env.NODE_ENV === 'development',
      }}
      onNavigationChange={(section) => {
        console.log('Navigation changed to:', section);
      }}
      onLayoutChange={(layout) => {
        console.log('Layout changed to:', layout);
      }}
      onError={(error) => {
        console.error('Dashboard error:', error);
      }}
    />
  );
}

/**
 * Enterprise Dashboard Component
 * Production-ready configuration for enterprise environments
 */
export function EnterpriseDashboard(): JSX.Element {
  return (
    <CompleteDashboardSystem
      config={{
        enableAnimations: true,
        enablePersistence: true,
        enablePerformanceMonitoring: true,
        enableAccessibility: true,
        debugMode: false,
      }}
      onNavigationChange={(section) => {
        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'navigation', {
            section,
            timestamp: Date.now(),
          });
        }
      }}
      onError={(error) => {
        // Error reporting service
        if (typeof window !== 'undefined' && (window as any).Sentry) {
          (window as any).Sentry.captureException(error);
        }
      }}
    />
  );
}

/**
 * Accessible Dashboard Component
 * Optimized configuration for accessibility-first environments
 */
export function AccessibleDashboard(): JSX.Element {
  return (
    <CompleteDashboardSystem
      config={{
        enableAnimations: false, // Reduced motion by default
        enablePersistence: true,
        enablePerformanceMonitoring: false,
        enableAccessibility: true,
        debugMode: false,
      }}
    />
  );
}

/**
 * Dashboard System Exports
 */
export {
  type CompleteDashboardSystemProps,
}; 