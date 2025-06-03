'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayoutManager, { useDashboardLayout, DashboardSection } from './DashboardLayoutManager';
import DashboardSidebar from './DashboardSidebar';
import DashboardContentPanel from './DashboardContentPanel';
import DashboardTransition from './DashboardTransition';

/**
 * Dashboard Layout Configuration Interface
 * Main configuration for the complete dashboard layout
 */
export interface DashboardLayoutConfig {
  /** Enable sidebar navigation */
  enableSidebar: boolean;
  /** Default sidebar collapsed state */
  defaultSidebarCollapsed: boolean;
  /** Enable smooth transitions */
  enableTransitions: boolean;
  /** Initial section to display */
  initialSection?: DashboardSection;
  /** Custom sidebar configuration */
  sidebarConfig?: {
    width: number;
    collapsedWidth: number;
    enableSearch: boolean;
    enableKeyboardNav: boolean;
  };
  /** Content panel configuration */
  contentConfig?: {
    enableLoadingStates: boolean;
    animationPreset: 'minimal' | 'standard' | 'enhanced';
    padding: 'none' | 'small' | 'medium' | 'large';
  };
  /** Layout theme configuration */
  theme?: {
    sidebarBackground: string;
    contentBackground: string;
    borderColor: string;
  };
}

/**
 * Dashboard Layout Props Interface
 * Props for the main dashboard layout component
 */
export interface DashboardLayoutProps {
  /** Dashboard layout configuration */
  config?: Partial<DashboardLayoutConfig>;
  /** Homepage component for transformation */
  homepageComponent?: React.ComponentType<{}>;
  /** Custom content components for sections */
  contentComponents?: Record<string, React.ComponentType<any>>;
  /** Custom sidebar header content */
  sidebarHeader?: React.ReactNode;
  /** Custom sidebar footer content */
  sidebarFooter?: React.ReactNode;
  /** Child components (for layout wrapper usage) */
  children?: React.ReactNode;
  /** Custom CSS classes */
  className?: string;
  /** Layout accessibility options */
  accessibility?: {
    enableFocusManagement: boolean;
    enableContentAnnouncements: boolean;
    skipToContentId?: string;
  };
}

/**
 * Default Dashboard Layout Configuration
 * Optimized settings for Atlas dashboard experience
 */
const defaultLayoutConfig: DashboardLayoutConfig = {
  enableSidebar: true,
  defaultSidebarCollapsed: false,
  enableTransitions: true,
  sidebarConfig: {
    width: 280,
    collapsedWidth: 72,
    enableSearch: true,
    enableKeyboardNav: true,
  },
  contentConfig: {
    enableLoadingStates: true,
    animationPreset: 'standard',
    padding: 'large',
  },
  theme: {
    sidebarBackground: 'bg-white',
    contentBackground: 'bg-paper-white',
    borderColor: 'border-sage-green/20',
  },
};

/**
 * Dashboard Layout Internal Component
 * Internal component that uses the dashboard context
 */
const DashboardLayoutInternal: React.FC<Omit<DashboardLayoutProps, 'children'>> = ({
  config = {},
  homepageComponent,
  contentComponents = {},
  sidebarHeader,
  sidebarFooter,
  className = '',
  accessibility = {
    enableFocusManagement: true,
    enableContentAnnouncements: true,
    skipToContentId: 'skip-to-content',
  },
}) => {
  // Merge configuration with defaults
  const layoutConfig = React.useMemo(() => ({
    ...defaultLayoutConfig,
    ...config,
    sidebarConfig: { ...defaultLayoutConfig.sidebarConfig, ...config.sidebarConfig },
    contentConfig: { ...defaultLayoutConfig.contentConfig, ...config.contentConfig },
    theme: { ...defaultLayoutConfig.theme, ...config.theme },
  }), [config]);

  // Dashboard layout context
  const dashboardContext = useDashboardLayout();

  /**
   * Handle Sidebar Navigation
   * Processes navigation events from sidebar
   */
  const handleSidebarNavigation = React.useCallback((section: DashboardSection) => {
    // Transform to dashboard if not already in dashboard mode
    if (dashboardContext.state.currentLayout === 'homepage') {
      dashboardContext.transformToDashboard(section);
    } else {
      dashboardContext.navigateToSection(section);
    }
  }, [dashboardContext]);

  /**
   * Handle Sidebar Collapse Toggle
   * Manages sidebar collapse state
   */
  const handleSidebarToggle = React.useCallback((collapsed: boolean) => {
    dashboardContext.toggleSidebar(collapsed);
  }, [dashboardContext]);

  /**
   * Layout Animation Variants
   * Framer Motion variants for responsive layout adjustments
   */
  const layoutVariants = React.useMemo(() => ({
    homepage: {
      paddingLeft: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    dashboard: {
      paddingLeft: dashboardContext.state.isSidebarCollapsed 
        ? layoutConfig.sidebarConfig?.collapsedWidth || 72
        : layoutConfig.sidebarConfig?.width || 280,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  }), [
    dashboardContext.state.isSidebarCollapsed,
    layoutConfig.sidebarConfig?.width,
    layoutConfig.sidebarConfig?.collapsedWidth,
  ]);

  return (
    <div className={`min-h-screen ${layoutConfig.theme?.contentBackground} ${className}`}>
      {/* Sidebar Navigation */}
      {layoutConfig.enableSidebar && dashboardContext.state.currentLayout === 'dashboard' && (
        <DashboardSidebar
          config={{
            defaultCollapsed: layoutConfig.defaultSidebarCollapsed,
            enableSearch: layoutConfig.sidebarConfig?.enableSearch,
            enableKeyboardNav: layoutConfig.sidebarConfig?.enableKeyboardNav,
            expandedWidth: layoutConfig.sidebarConfig?.width,
            collapsedWidth: layoutConfig.sidebarConfig?.collapsedWidth,
          }}
          headerContent={sidebarHeader}
          footerContent={sidebarFooter}
          onToggleCollapse={handleSidebarToggle}
          onNavigate={handleSidebarNavigation}
          className={`${layoutConfig.theme?.sidebarBackground} ${layoutConfig.theme?.borderColor}`}
        />
      )}

      {/* Main Content Area */}
      <motion.div
        className="min-h-screen transition-all duration-300"
        initial="homepage"
        animate={dashboardContext.state.currentLayout}
        variants={layoutVariants}
        style={{
          paddingLeft: dashboardContext.state.currentLayout === 'dashboard' && layoutConfig.enableSidebar
            ? dashboardContext.state.isSidebarCollapsed 
              ? layoutConfig.sidebarConfig?.collapsedWidth || 72
              : layoutConfig.sidebarConfig?.width || 280
            : 0,
        }}
      >
        {/* Dashboard Content Panel */}
        {dashboardContext.state.currentLayout === 'dashboard' && (
          <DashboardContentPanel
            config={{
              enableLoadingStates: layoutConfig.contentConfig?.enableLoadingStates,
              animationPreset: layoutConfig.contentConfig?.animationPreset,
            }}
            contentComponents={contentComponents}
            padding={layoutConfig.contentConfig?.padding}
            accessibility={accessibility}
            className={layoutConfig.theme?.contentBackground}
          />
        )}

        {/* Homepage Content (when in homepage layout) */}
        {dashboardContext.state.currentLayout === 'homepage' && homepageComponent && (
          <div className="w-full h-full">
            {React.createElement(homepageComponent, {})}
          </div>
        )}
      </motion.div>

      {/* Skip to Content Link */}
      {accessibility.skipToContentId && (
        <a
          href={`#${accessibility.skipToContentId}`}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-sage-green text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sage-green/30"
        >
          Skip to main content
        </a>
      )}
    </div>
  );
};

/**
 * Dashboard Layout Component
 * 
 * Main dashboard layout component that orchestrates the complete dashboard experience.
 * Integrates sidebar navigation, content panels, and layout transformations.
 * 
 * Key Features:
 * - Complete dashboard layout with sidebar and content areas
 * - Smooth transitions between homepage and dashboard modes
 * - Responsive design with mobile adaptations
 * - Accessibility compliance with skip links and focus management
 * - Configurable sidebar and content panel behaviors
 * - Theme customization support
 * - Performance optimized with proper component composition
 * 
 * Architecture:
 * - Uses DashboardLayoutManager for state management
 * - Composes DashboardSidebar and DashboardContentPanel
 * - Follows universal project structure governance
 * - Implements service layer wrapper patterns
 * - TypeScript strict mode compliance
 * - Atlas Design System integration
 * 
 * Usage:
 * ```tsx
 * <DashboardLayout
 *   config={{
 *     enableSidebar: true,
 *     defaultSidebarCollapsed: false,
 *     initialSection: 'what-we-build'
 *   }}
 *   homepageComponent={HomePage}
 *   contentComponents={{
 *     'what-we-build': WhatWeBuildContent,
 *     'why-we-exist': WhyWeExistContent
 *   }}
 * />
 * ```
 * 
 * @component DashboardLayout
 * @param {DashboardLayoutProps} props - Component props
 * @returns {JSX.Element} Complete dashboard layout
 */
export default function DashboardLayout({
  config = {},
  homepageComponent,
  contentComponents = {},
  sidebarHeader,
  sidebarFooter,
  children,
  className = '',
  accessibility = {
    enableFocusManagement: true,
    enableContentAnnouncements: true,
    skipToContentId: 'skip-to-content',
  },
}: DashboardLayoutProps): JSX.Element {

  // Merge configuration with defaults
  const layoutConfig = React.useMemo(() => ({
    ...defaultLayoutConfig,
    ...config,
  }), [config]);

  return (
    <DashboardLayoutManager
      initialSection={layoutConfig.initialSection}
      initialLayout="homepage"
    >
      {/* Dashboard Transition System */}
      {layoutConfig.enableTransitions ? (
        <DashboardTransition
          homepageComponent={homepageComponent || (() => (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-charcoal-dark mb-4">Atlas</h1>
                <p className="text-charcoal-light">Real Estate Intelligence Platform</p>
              </div>
            </div>
          ))}
          dashboardComponent={({ activeSection }) => (
            <DashboardLayoutInternal
              config={config}
              homepageComponent={homepageComponent}
              contentComponents={contentComponents}
              sidebarHeader={sidebarHeader}
              sidebarFooter={sidebarFooter}
              className={className}
              accessibility={accessibility}
            />
          )}
        />
      ) : (
        <DashboardLayoutInternal
          config={config}
          homepageComponent={homepageComponent}
          contentComponents={contentComponents}
          sidebarHeader={sidebarHeader}
          sidebarFooter={sidebarFooter}
          className={className}
          accessibility={accessibility}
        />
      )}

      {/* Children (for layout wrapper usage) */}
      {children}
    </DashboardLayoutManager>
  );
}

/**
 * Dashboard Layout Hook Export
 * Re-export the dashboard layout hook for external usage
 */
export { useDashboardLayout };

/**
 * Dashboard Layout Types Export
 * Export all TypeScript interfaces for external usage
 */
export type {
  DashboardLayoutConfig,
  DashboardLayoutProps,
  DashboardSection,
};

/**
 * Dashboard Layout Components Export
 * Named exports for individual components
 */
export {
  DashboardLayoutManager,
  DashboardSidebar,
  DashboardContentPanel,
  DashboardTransition,
}; 