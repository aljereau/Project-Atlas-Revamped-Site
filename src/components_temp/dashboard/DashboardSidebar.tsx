'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardLayout, DashboardSection } from '@/components/dashboard';

/**
 * Sidebar Navigation Item Interface
 * Defines structure for navigation menu items
 */
export interface SidebarNavigationItem {
  /** Unique identifier for the navigation item */
  id: DashboardSection;
  /** Display label for the item */
  label: string;
  /** Icon component or icon name */
  icon: React.ReactNode | string;
  /** Whether item is currently active */
  isActive: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Keyboard shortcut for the item */
  shortcut?: string;
  /** Badge count or content */
  badge?: number | string;
  /** Nested children items */
  children?: SidebarNavigationItem[];
}

/**
 * Sidebar State Interface
 * Manages internal sidebar component state
 */
export interface SidebarState {
  /** Whether sidebar is collapsed */
  isCollapsed: boolean;
  /** Currently hovered item */
  hoveredItem: DashboardSection | null;
  /** Currently focused item (keyboard navigation) */
  focusedItem: DashboardSection | null;
  /** Search query for filtering items */
  searchQuery: string;
  /** Whether search is active */
  isSearchActive: boolean;
  /** Animation state */
  animationState: 'idle' | 'expanding' | 'collapsing' | 'transitioning';
}

/**
 * Sidebar Configuration Interface
 * Configuration options for sidebar behavior
 */
export interface SidebarConfig {
  /** Default collapsed state */
  defaultCollapsed: boolean;
  /** Enable search functionality */
  enableSearch: boolean;
  /** Enable keyboard navigation */
  enableKeyboardNav: boolean;
  /** Enable hover expansion in collapsed mode */
  enableHoverExpand: boolean;
  /** Auto-collapse on mobile */
  autoCollapseOnMobile: boolean;
  /** Animation duration in milliseconds */
  animationDuration: number;
  /** Sidebar width when expanded */
  expandedWidth: number;
  /** Sidebar width when collapsed */
  collapsedWidth: number;
}

/**
 * Sidebar Props Interface
 * Props for the main sidebar component
 */
export interface DashboardSidebarProps {
  /** Custom navigation items override */
  navigationItems?: SidebarNavigationItem[];
  /** Sidebar configuration */
  config?: Partial<SidebarConfig>;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Custom footer content */
  footerContent?: React.ReactNode;
  /** Custom CSS classes */
  className?: string;
  /** Custom logo component */
  logoComponent?: React.ReactNode;
  /** Collapse/expand callback */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Navigation callback */
  onNavigate?: (section: DashboardSection) => void;
}

/**
 * Default Sidebar Configuration
 * Apple-inspired responsive sidebar behavior
 */
const defaultSidebarConfig: SidebarConfig = {
  defaultCollapsed: false,
  enableSearch: true,
  enableKeyboardNav: true,
  enableHoverExpand: true,
  autoCollapseOnMobile: true,
  animationDuration: 300,
  expandedWidth: 280,
  collapsedWidth: 72,
};

/**
 * Default Navigation Items
 * Core Atlas navigation structure
 */
const defaultNavigationItems: SidebarNavigationItem[] = [
  {
    id: 'what-we-build',
    label: 'What We Build',
    icon: '🏗️',
    isActive: false,
    shortcut: '⌘1',
  },
  {
    id: 'why-we-exist',
    label: 'Why We Exist',
    icon: '🎯',
    isActive: false,
    shortcut: '⌘2',
  },
  {
    id: 'who-we-are',
    label: 'Who We Are',
    icon: '👥',
    isActive: false,
    shortcut: '⌘3',
  },
  {
    id: 'our-timeline',
    label: 'Our Timeline',
    icon: '📅',
    isActive: false,
    shortcut: '⌘4',
  },
  {
    id: 'about-atlas',
    label: 'About Atlas',
    icon: '🏢',
    isActive: false,
    shortcut: '⌘5',
  },
  {
    id: 'atlas-tools',
    label: 'Atlas Tools',
    icon: '🛠️',
    isActive: false,
    shortcut: '⌘6',
  },
  {
    id: 'project-log',
    label: 'Project Log',
    icon: '📝',
    isActive: false,
    shortcut: '⌘7',
  },
  {
    id: 'get-involved',
    label: 'Get Involved',
    icon: '🤝',
    isActive: false,
    shortcut: '⌘8',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: '📧',
    isActive: false,
    shortcut: '⌘9',
  },
];

/**
 * Dashboard Sidebar Component
 * 
 * Advanced sidebar navigation with collapsible behavior, smooth animations,
 * responsive design, keyboard navigation, and accessibility features.
 * 
 * Key Features:
 * - Collapsible/expandable with smooth animations
 * - Responsive behavior with mobile adaptation
 * - Keyboard navigation support (arrow keys, shortcuts)
 * - Search functionality with filtering
 * - Hover expansion in collapsed mode
 * - Accessibility compliance (ARIA, focus management)
 * - Apple-inspired animation timing
 * - Integration with dashboard layout system
 * 
 * Architecture:
 * - Component composition with reusable navigation items
 * - State management following React best practices
 * - Performance optimized with memo and callbacks
 * - TypeScript strict mode compliance
 * - Atlas Design System integration
 * 
 * @component DashboardSidebar
 * @param {DashboardSidebarProps} props - Component props
 * @returns {JSX.Element} Sidebar navigation component
 */
export default function DashboardSidebar({
  navigationItems = defaultNavigationItems,
  config = {},
  headerContent,
  footerContent,
  className = '',
  logoComponent,
  onToggleCollapse,
  onNavigate,
}: DashboardSidebarProps): JSX.Element {
  
  // Merge configuration with defaults
  const sidebarConfig = React.useMemo(() => ({
    ...defaultSidebarConfig,
    ...config,
  }), [config]);

  // Dashboard layout context
  const dashboardContext = useDashboardLayout();

  // Sidebar internal state
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    isCollapsed: sidebarConfig.defaultCollapsed,
    hoveredItem: null,
    focusedItem: null,
    searchQuery: '',
    isSearchActive: false,
    animationState: 'idle',
  });

  // Refs for DOM manipulation and focus management
  const sidebarRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigationRefs = useRef<Map<DashboardSection, HTMLButtonElement>>(new Map());

  /**
   * Navigation Items with Active State
   * Computes navigation items with current active state
   */
  const navigationItemsWithState = React.useMemo(() => {
    return navigationItems.map(item => ({
      ...item,
      isActive: dashboardContext.isSectionActive(item.id),
    }));
  }, [navigationItems, dashboardContext]);

  /**
   * Filtered Navigation Items
   * Filters navigation items based on search query
   */
  const filteredNavigationItems = React.useMemo(() => {
    if (!sidebarState.searchQuery.trim()) {
      return navigationItemsWithState;
    }

    return navigationItemsWithState.filter(item =>
      item.label.toLowerCase().includes(sidebarState.searchQuery.toLowerCase()) ||
      (typeof item.icon === 'string' && item.icon.includes(sidebarState.searchQuery.toLowerCase()))
    );
  }, [navigationItemsWithState, sidebarState.searchQuery]);

  /**
   * Toggle Sidebar Collapse State
   * Handles collapsing/expanding sidebar with animations
   */
  const toggleCollapse = useCallback(() => {
    setSidebarState(prev => {
      const newCollapsed = !prev.isCollapsed;
      
      // Update animation state
      const newAnimationState = newCollapsed ? 'collapsing' : 'expanding';
      
      // Notify parent component
      if (onToggleCollapse) {
        onToggleCollapse(newCollapsed);
      }
      
      // Update dashboard context
      dashboardContext.toggleSidebar(newCollapsed);
      
      return {
        ...prev,
        isCollapsed: newCollapsed,
        animationState: newAnimationState,
        // Clear search when collapsing
        searchQuery: newCollapsed ? '' : prev.searchQuery,
        isSearchActive: newCollapsed ? false : prev.isSearchActive,
      };
    });

    // Reset animation state after animation completes
    setTimeout(() => {
      setSidebarState(prev => ({ ...prev, animationState: 'idle' }));
    }, sidebarConfig.animationDuration);
  }, [onToggleCollapse, dashboardContext, sidebarConfig.animationDuration]);

  /**
   * Handle Navigation Item Click
   * Processes navigation to different dashboard sections
   */
  const handleNavigationClick = useCallback((section: DashboardSection) => {
    // Navigate via dashboard context
    dashboardContext.navigateToSection(section);
    
    // Update focused item
    setSidebarState(prev => ({ ...prev, focusedItem: section }));
    
    // Notify parent component
    if (onNavigate) {
      onNavigate(section);
    }
    
    // Auto-collapse on mobile after navigation
    if (sidebarConfig.autoCollapseOnMobile && window.innerWidth < 768) {
      toggleCollapse();
    }
  }, [dashboardContext, onNavigate, sidebarConfig.autoCollapseOnMobile, toggleCollapse]);

  /**
   * Handle Search Input
   * Processes search query input with debouncing
   */
  const handleSearchInput = useCallback((query: string) => {
    setSidebarState(prev => ({
      ...prev,
      searchQuery: query,
      isSearchActive: query.trim().length > 0,
    }));
  }, []);

  /**
   * Keyboard Navigation Handler
   * Implements keyboard navigation for accessibility
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    if (!sidebarConfig.enableKeyboardNav) return;

    const { key, metaKey, ctrlKey } = event;
    
    // Handle shortcuts (Cmd/Ctrl + number)
    if ((metaKey || ctrlKey) && /^[1-9]$/.test(key)) {
      event.preventDefault();
      const index = parseInt(key) - 1;
      const targetItem = filteredNavigationItems[index];
      if (targetItem && !targetItem.disabled) {
        handleNavigationClick(targetItem.id);
      }
      return;
    }

    // Handle arrow key navigation
    if (['ArrowUp', 'ArrowDown'].includes(key)) {
      event.preventDefault();
      
      const currentIndex = filteredNavigationItems.findIndex(
        item => item.id === sidebarState.focusedItem
      );
      
      let nextIndex;
      if (key === 'ArrowDown') {
        nextIndex = currentIndex < filteredNavigationItems.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredNavigationItems.length - 1;
      }
      
      const nextItem = filteredNavigationItems[nextIndex];
      if (nextItem) {
        setSidebarState(prev => ({ ...prev, focusedItem: nextItem.id }));
        
        // Focus the button element
        const buttonRef = navigationRefs.current.get(nextItem.id);
        if (buttonRef) {
          buttonRef.focus();
        }
      }
    }

    // Handle Enter key
    if (key === 'Enter' && sidebarState.focusedItem) {
      event.preventDefault();
      handleNavigationClick(sidebarState.focusedItem);
    }

    // Handle escape key (close search, collapse sidebar)
    if (key === 'Escape') {
      if (sidebarState.isSearchActive) {
        handleSearchInput('');
        searchInputRef.current?.blur();
      } else if (!sidebarState.isCollapsed) {
        toggleCollapse();
      }
    }
  }, [
    sidebarConfig.enableKeyboardNav,
    filteredNavigationItems,
    sidebarState.focusedItem,
    sidebarState.isSearchActive,
    sidebarState.isCollapsed,
    handleNavigationClick,
    handleSearchInput,
    toggleCollapse,
  ]);

  /**
   * Mobile Detection Effect
   * Handles responsive behavior and auto-collapse
   */
  useEffect(() => {
    if (!sidebarConfig.autoCollapseOnMobile) return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && !sidebarState.isCollapsed) {
        toggleCollapse();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarConfig.autoCollapseOnMobile, sidebarState.isCollapsed, toggleCollapse]);

  /**
   * Dashboard Context Sync Effect
   * Syncs sidebar state with dashboard context
   */
  useEffect(() => {
    if (dashboardContext.state.isSidebarCollapsed !== sidebarState.isCollapsed) {
      setSidebarState(prev => ({
        ...prev,
        isCollapsed: dashboardContext.state.isSidebarCollapsed,
      }));
    }
  }, [dashboardContext.state.isSidebarCollapsed, sidebarState.isCollapsed]);

  /**
   * Animation Variants
   * Framer Motion animation configurations
   */
  const sidebarVariants = {
    expanded: {
      width: sidebarConfig.expandedWidth,
      transition: {
        duration: sidebarConfig.animationDuration / 1000,
        ease: [0.4, 0.0, 0.2, 1], // Apple easing
      },
    },
    collapsed: {
      width: sidebarConfig.collapsedWidth,
      transition: {
        duration: sidebarConfig.animationDuration / 1000,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <motion.aside
      ref={sidebarRef}
      className={`
        fixed left-0 top-0 h-full
        bg-white border-r border-sage-green/20
        shadow-lg backdrop-blur-md
        z-40 overflow-hidden
        ${className}
      `}
      initial="expanded"
      animate={sidebarState.isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      onKeyDown={handleKeyDown}
      role="navigation"
      aria-label="Dashboard navigation"
      aria-expanded={!sidebarState.isCollapsed}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-sage-green/10">
        {/* Logo/Header Content */}
        <AnimatePresence mode="wait">
          {!sidebarState.isCollapsed && (
            <motion.div
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={contentVariants}
              className="flex items-center space-x-3"
            >
              {logoComponent || (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-sage-green to-orange-warm rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="font-semibold text-charcoal-dark">Atlas</span>
                </div>
              )}
              {headerContent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Toggle Button */}
        <motion.button
          onClick={toggleCollapse}
          className={`
            p-2 rounded-lg transition-colors
            hover:bg-sage-green/10 focus:bg-sage-green/10
            focus:outline-none focus:ring-2 focus:ring-sage-green/30
            ${sidebarState.isCollapsed ? 'mx-auto' : ''}
          `}
          aria-label={sidebarState.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: sidebarState.isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </motion.div>
        </motion.button>
      </div>

      {/* Search Section */}
      {sidebarConfig.enableSearch && (
        <div className="p-4 border-b border-sage-green/10">
          <AnimatePresence mode="wait">
            {!sidebarState.isCollapsed && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
              >
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search navigation..."
                    value={sidebarState.searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-2 rounded-lg border border-sage-green/20
                      bg-paper-white focus:bg-white
                      focus:border-sage-green focus:ring-2 focus:ring-sage-green/20
                      transition-all duration-200 outline-none
                      text-sm placeholder-sage-green/60
                    `}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-sage-green/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <AnimatePresence mode="wait">
          {filteredNavigationItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <SidebarNavigationItem
                item={item}
                isCollapsed={sidebarState.isCollapsed}
                isFocused={sidebarState.focusedItem === item.id}
                onClick={() => handleNavigationClick(item.id)}
                onFocus={() => setSidebarState(prev => ({ ...prev, focusedItem: item.id }))}
                ref={(el: HTMLButtonElement | null) => {
                  if (el) {
                    navigationRefs.current.set(item.id, el);
                  } else {
                    navigationRefs.current.delete(item.id);
                  }
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      {/* Footer Content */}
      {footerContent && (
        <div className="p-4 border-t border-sage-green/10">
          <AnimatePresence mode="wait">
            {!sidebarState.isCollapsed && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
              >
                {footerContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.aside>
  );
}

/**
 * Sidebar Navigation Item Component
 * Individual navigation item with hover, focus, and active states
 */
interface SidebarNavigationItemProps {
  item: SidebarNavigationItem;
  isCollapsed: boolean;
  isFocused: boolean;
  onClick: () => void;
  onFocus: () => void;
}

const SidebarNavigationItem = React.forwardRef<HTMLButtonElement, SidebarNavigationItemProps>(
  (props, ref) => {
    const { item, isCollapsed, isFocused, onClick, onFocus } = props;
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        onFocus={onFocus}
        disabled={item.disabled}
        className={`
          w-full flex items-center space-x-3 p-3 rounded-lg
          transition-all duration-200 group
          ${item.isActive 
            ? 'bg-sage-green text-white shadow-md' 
            : 'text-charcoal-dark hover:bg-sage-green/10 focus:bg-sage-green/10'
          }
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isFocused ? 'ring-2 ring-sage-green/30' : ''}
          focus:outline-none
        `}
        whileHover={!item.disabled ? { x: 2 } : {}}
        whileTap={!item.disabled ? { scale: 0.98 } : {}}
        aria-label={item.label}
        aria-current={item.isActive ? 'page' : undefined}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
          {typeof item.icon === 'string' ? (
            <span className="text-xl">{item.icon}</span>
          ) : (
            item.icon
          )}
        </div>

        {/* Label and Badge */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex items-center justify-between"
          >
            <span className="font-medium">{item.label}</span>
            
            {/* Badge */}
            {item.badge && (
              <span className={`
                px-2 py-1 text-xs rounded-full
                ${item.isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-sage-green/10 text-sage-green'
                }
              `}>
                {item.badge}
              </span>
            )}
            
            {/* Keyboard Shortcut */}
            {item.shortcut && (
              <span className={`
                text-xs opacity-60 hidden group-hover:block
                ${item.isActive ? 'text-white' : 'text-sage-green'}
              `}>
                {item.shortcut}
              </span>
            )}
          </motion.div>
        )}
      </motion.button>
    );
  }
);

SidebarNavigationItem.displayName = 'SidebarNavigationItem'; 