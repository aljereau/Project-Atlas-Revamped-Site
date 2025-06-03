'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardLayout, DashboardSection } from '@/components/dashboard';

/**
 * Content Panel State Interface
 * Manages content panel state and loading conditions
 */
export interface ContentPanelState {
  /** Currently active section */
  activeSection: DashboardSection;
  /** Previous section for transition reference */
  previousSection: DashboardSection | null;
  /** Content loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Transition state */
  isTransitioning: boolean;
  /** Last update timestamp */
  lastUpdated: number;
}

/**
 * Content Panel Configuration Interface
 * Configuration options for content panel behavior
 */
export interface ContentPanelConfig {
  /** Enable smooth transitions between sections */
  enableTransitions: boolean;
  /** Transition duration in milliseconds */
  transitionDuration: number;
  /** Enable loading states */
  enableLoadingStates: boolean;
  /** Enable error boundaries */
  enableErrorBoundary: boolean;
  /** Prefetch adjacent content */
  enablePrefetching: boolean;
  /** Animation presets */
  animationPreset: 'minimal' | 'standard' | 'enhanced';
}

/**
 * Content Component Props Interface
 * Props passed to individual content components
 */
export interface ContentComponentProps {
  /** Current section identifier */
  section: DashboardSection;
  /** Whether component is active */
  isActive: boolean;
  /** Whether component is transitioning */
  isTransitioning: boolean;
  /** Content update callback */
  onContentUpdate?: (section: DashboardSection) => void;
}

/**
 * Content Panel Props Interface
 * Props for the main content panel component
 */
export interface DashboardContentPanelProps {
  /** Content panel configuration */
  config?: Partial<ContentPanelConfig>;
  /** Custom content components mapping */
  contentComponents?: Partial<Record<NonNullable<DashboardSection>, React.ComponentType<ContentComponentProps>>>;
  /** Custom loading component */
  loadingComponent?: React.ComponentType;
  /** Custom error component */
  errorComponent?: React.ComponentType<{ error: string; onRetry: () => void }>;
  /** Custom CSS classes */
  className?: string;
  /** Content area padding */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Scroll behavior */
  scrollBehavior?: 'auto' | 'smooth';
  /** Accessibility options */
  accessibility?: {
    enableFocusManagement: boolean;
    enableContentAnnouncements: boolean;
    skipToContentId?: string;
  };
}

/**
 * Default Content Panel Configuration
 * Optimized for performance and user experience
 */
const defaultContentConfig: ContentPanelConfig = {
  enableTransitions: true,
  transitionDuration: 300,
  enableLoadingStates: true,
  enableErrorBoundary: true,
  enablePrefetching: false,
  animationPreset: 'standard',
};

/**
 * Default Content Components
 * Placeholder components for each dashboard section
 */
const DefaultWhatWeBuildContent: React.FC<ContentComponentProps> = ({ section, isActive }) => (
  <div className="space-y-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-charcoal-dark mb-4">What We Build</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Real Estate Intelligence Tools */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-sage-green/20">
          <h3 className="text-xl font-semibold text-sage-green mb-3">Intelligence Tools</h3>
          <p className="text-charcoal-light">Advanced analytics and insights for real estate professionals.</p>
        </div>
        
        {/* Market Analysis Platform */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-sage-green/20">
          <h3 className="text-xl font-semibold text-sage-green mb-3">Market Analysis</h3>
          <p className="text-charcoal-light">Comprehensive market data and trend analysis platform.</p>
        </div>
        
        {/* Investment Calculator */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-sage-green/20">
          <h3 className="text-xl font-semibold text-sage-green mb-3">Investment Tools</h3>
          <p className="text-charcoal-light">Sophisticated calculators for investment analysis and planning.</p>
        </div>
      </div>
    </motion.div>
  </div>
);

const DefaultWhyWeExistContent: React.FC<ContentComponentProps> = ({ section, isActive }) => (
  <div className="space-y-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-charcoal-dark mb-4">Why We Exist</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-charcoal-light leading-relaxed mb-6">
          Atlas exists to democratize access to real estate intelligence, empowering professionals
          and investors with the tools and insights they need to make informed decisions.
        </p>
        
        <div className="bg-gradient-to-r from-sage-green/10 to-orange-warm/10 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-sage-green mb-4">Our Mission</h2>
          <p className="text-charcoal-dark">
            To transform the real estate industry through innovative technology, providing
            unprecedented access to market intelligence and analytical tools.
          </p>
        </div>
      </div>
    </motion.div>
  </div>
);

const DefaultWhoWeAreContent: React.FC<ContentComponentProps> = ({ section, isActive }) => (
  <div className="space-y-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-charcoal-dark mb-4">Who We Are</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-sage-green mb-4">Our Team</h2>
          <p className="text-charcoal-light mb-4">
            A diverse group of real estate professionals, data scientists, and technology experts
            united by a passion for innovation and excellence.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-sage-green mb-4">Our Values</h2>
          <ul className="space-y-2 text-charcoal-light">
            <li>• Innovation in everything we do</li>
            <li>• Transparency and integrity</li>
            <li>• User-centric design</li>
            <li>• Data-driven decisions</li>
          </ul>
        </div>
      </div>
    </motion.div>
  </div>
);

/**
 * Default Content Components Map
 * Maps dashboard sections to their default content components
 */
const defaultContentComponents: Partial<Record<NonNullable<DashboardSection>, React.ComponentType<ContentComponentProps>>> = {
  'what-we-build': DefaultWhatWeBuildContent,
  'why-we-exist': DefaultWhyWeExistContent,
  'who-we-are': DefaultWhoWeAreContent,
  // Additional default components would be added here
};

/**
 * Default Loading Component
 * Displays loading state with skeleton animation
 */
const DefaultLoadingComponent = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 bg-sage-green/20 rounded w-1/3"></div>
    <div className="space-y-4">
      <div className="h-4 bg-sage-green/10 rounded w-full"></div>
      <div className="h-4 bg-sage-green/10 rounded w-3/4"></div>
      <div className="h-4 bg-sage-green/10 rounded w-1/2"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-sage-green/10 rounded"></div>
      ))}
    </div>
  </div>
);

/**
 * Default Error Component
 * Displays error state with retry functionality
 */
const DefaultErrorComponent = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-red-800 mb-2">Content Error</h2>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

/**
 * Dashboard Content Panel Component
 * 
 * Central content management system for dashboard sections.
 * Handles content routing, loading states, transitions, and error boundaries.
 * 
 * Key Features:
 * - Dynamic content loading based on active section
 * - Smooth transitions between content sections
 * - Loading states and error handling
 * - Accessibility compliance with focus management
 * - Performance optimization with lazy loading
 * - Responsive design with mobile optimization
 * - Content prefetching for improved UX
 * 
 * Architecture:
 * - Component composition with pluggable content components
 * - State management following React best practices
 * - Performance optimized with Suspense and lazy loading
 * - TypeScript strict mode compliance
 * - Atlas Design System integration
 * 
 * @component DashboardContentPanel
 * @param {DashboardContentPanelProps} props - Component props
 * @returns {JSX.Element} Content panel component
 */
export default function DashboardContentPanel({
  config = {},
  contentComponents = {},
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  className = '',
  padding = 'large',
  scrollBehavior = 'smooth',
  accessibility = {
    enableFocusManagement: true,
    enableContentAnnouncements: true,
  },
}: DashboardContentPanelProps): JSX.Element {

  // Merge configuration with defaults
  const contentConfig = React.useMemo(() => ({
    ...defaultContentConfig,
    ...config,
  }), [config]);

  // Dashboard layout context
  const dashboardContext = useDashboardLayout();

  // Merge content components with defaults
  const allContentComponents = React.useMemo(() => ({
    ...defaultContentComponents,
    ...contentComponents,
  }), [contentComponents]);

  // Content panel state
  const [panelState, setPanelState] = useState<ContentPanelState>({
    activeSection: dashboardContext.state.activeSection,
    previousSection: null,
    isLoading: false,
    error: null,
    isTransitioning: false,
    lastUpdated: Date.now(),
  });

  // Refs for DOM manipulation and focus management
  const contentRef = useRef<HTMLDivElement>(null);
  const skipToContentRef = useRef<HTMLDivElement>(null);

  /**
   * Handle Content Loading
   * Manages content loading states and error handling
   */
  const handleContentLoad = useCallback(async (section: DashboardSection) => {
    if (!section) return;

    setPanelState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isTransitioning: true,
    }));

    try {
      // Simulate content loading delay for demonstration
      if (contentConfig.enableLoadingStates) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setPanelState(prev => ({
        ...prev,
        previousSection: prev.activeSection,
        activeSection: section,
        isLoading: false,
        isTransitioning: false,
        lastUpdated: Date.now(),
      }));

      // Focus management for accessibility
      if (accessibility.enableFocusManagement && contentRef.current) {
        contentRef.current.focus();
      }

      // Announce content change to screen readers
      if (accessibility.enableContentAnnouncements) {
        const announcement = `Content updated to ${section?.replace('-', ' ')} section`;
        // Implementation would use ARIA live region
        console.log('ARIA Announcement:', announcement);
      }

    } catch (error) {
      setPanelState(prev => ({
        ...prev,
        isLoading: false,
        isTransitioning: false,
        error: error instanceof Error ? error.message : 'Failed to load content',
      }));
    }
  }, [contentConfig.enableLoadingStates, accessibility]);

  /**
   * Handle Content Retry
   * Retry mechanism for failed content loads
   */
  const handleRetry = useCallback(() => {
    if (dashboardContext.state.activeSection) {
      handleContentLoad(dashboardContext.state.activeSection);
    }
  }, [dashboardContext.state.activeSection, handleContentLoad]);

  /**
   * Dashboard Context Sync Effect
   * Syncs content panel with dashboard layout changes
   */
  useEffect(() => {
    const currentSection = dashboardContext.state.activeSection;
    if (currentSection !== panelState.activeSection) {
      handleContentLoad(currentSection);
    }
  }, [dashboardContext.state.activeSection, panelState.activeSection, handleContentLoad]);

  /**
   * Get Current Content Component
   * Retrieves the appropriate content component for the active section
   */
  const getCurrentContentComponent = useCallback(() => {
    const section = panelState.activeSection;
    if (!section) return null;

    const Component = allContentComponents[section];
    if (!Component) {
      // Return a fallback component for unimplemented sections
      return () => (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-charcoal-dark mb-4">
            {section?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Section
          </h2>
          <p className="text-charcoal-light">This section is under development.</p>
        </div>
      );
    }

    return Component;
  }, [panelState.activeSection, allContentComponents]);

  /**
   * Animation Variants
   * Framer Motion animation configurations based on preset
   */
  const animationVariants = React.useMemo(() => {
    const baseVariants = {
      enter: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: -20, scale: 0.98 },
    };

    switch (contentConfig.animationPreset) {
      case 'minimal':
        return {
          enter: { opacity: 1 },
          exit: { opacity: 0 },
        };
      
      case 'enhanced':
        return {
          enter: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            transition: { 
              duration: contentConfig.transitionDuration / 1000,
              ease: [0.4, 0.0, 0.2, 1],
              staggerChildren: 0.1,
            },
          },
          exit: { 
            opacity: 0, 
            x: -30, 
            scale: 0.95,
            transition: { duration: 0.2 },
          },
        };
      
      default: // 'standard'
        return {
          enter: { 
            ...baseVariants.enter,
            transition: { 
              duration: contentConfig.transitionDuration / 1000,
              ease: [0.4, 0.0, 0.2, 1],
            },
          },
          exit: { 
            ...baseVariants.exit,
            transition: { duration: 0.2 },
          },
        };
    }
  }, [contentConfig.animationPreset, contentConfig.transitionDuration]);

  /**
   * Padding Classes Map
   * Maps padding prop to Tailwind CSS classes
   */
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  /**
   * Current Content Component
   */
  const ContentComponent = getCurrentContentComponent();

  return (
    <main
      className={`
        flex-1 bg-paper-white overflow-auto
        ${paddingClasses[padding]}
        ${className}
      `}
      style={{ scrollBehavior }}
    >
      {/* Skip to Content Link */}
      {accessibility.skipToContentId && (
        <div
          ref={skipToContentRef}
          id={accessibility.skipToContentId}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50"
        >
          <a
            href="#main-content"
            className="bg-sage-green text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sage-green/30"
          >
            Skip to main content
          </a>
        </div>
      )}

      {/* Main Content Area */}
      <div
        ref={contentRef}
        id="main-content"
        className="min-h-full focus:outline-none"
        tabIndex={-1}
        role="main"
        aria-live={accessibility.enableContentAnnouncements ? 'polite' : undefined}
        aria-label={`${panelState.activeSection?.replace('-', ' ')} content`}
      >
        {/* Error State */}
        {panelState.error && (
          <ErrorComponent error={panelState.error} onRetry={handleRetry} />
        )}

        {/* Loading State */}
        {panelState.isLoading && contentConfig.enableLoadingStates && (
          <LoadingComponent />
        )}

        {/* Content Rendering */}
        {!panelState.error && !panelState.isLoading && ContentComponent && (
          <AnimatePresence mode="wait">
            <motion.div
              key={panelState.activeSection || 'default'}
              initial="exit"
              animate="enter"
              exit="exit"
              variants={animationVariants}
              className="w-full"
            >
              <Suspense fallback={<LoadingComponent />}>
                <ContentComponent
                  section={panelState.activeSection}
                  isActive={!panelState.isTransitioning}
                  isTransitioning={panelState.isTransitioning}
                  onContentUpdate={() => {
                    // Content update callback
                    setPanelState(prev => ({ ...prev, lastUpdated: Date.now() }));
                  }}
                />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}

/**
 * Dashboard Content Panel Exports
 * Named exports for component and related types
 */
export {
  type ContentPanelState,
  type ContentPanelConfig,
  type ContentComponentProps,
  type DashboardContentPanelProps,
}; 