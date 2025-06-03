/**
 * Dashboard Components Index
 * 
 * Centralized exports for all dashboard-related components and types.
 * Following universal project structure governance and component composition principles.
 * 
 * @module DashboardComponents
 */

// Core Dashboard Layout Manager
export { default as DashboardLayoutManager } from './DashboardLayoutManager';

// Custom Hooks
export { useDashboardLayout } from './DashboardLayoutManager';

// Context (for advanced usage and testing)
export { DashboardLayoutContext } from './DashboardLayoutManager';

// TypeScript Types and Interfaces
export type {
  DashboardLayoutState,
  DashboardSection,
  DashboardLayoutManagerState,
  DashboardLayoutManagerAction,
  DashboardLayoutContextValue,
  DashboardLayoutManagerProps,
} from './DashboardLayoutManager';

// Dashboard Layout Components
export { default as DashboardLayout } from './DashboardLayout';
export { default as DashboardSidebar } from './DashboardSidebar';
export { default as DashboardContentPanel } from './DashboardContentPanel';

// Dashboard Navigation Components
export { default as DashboardBottomNavigation } from './DashboardBottomNavigation';
export { default as DashboardRestoreButton } from './DashboardRestoreButton';

// Dashboard Transition System
export { default as DashboardTransition } from './DashboardTransition';

// Layout Component Types
export type {
  DashboardLayoutProps,
} from './DashboardLayout';

// Sidebar Component Types
export type {
  SidebarNavigationItem,
  SidebarState,
  SidebarConfig,
  DashboardSidebarProps,
} from './DashboardSidebar';

// Content Panel Component Types
export type {
  ContentPanelState,
  ContentPanelConfig,
  ContentComponentProps,
  DashboardContentPanelProps,
} from './DashboardContentPanel';

// Bottom Navigation Component Types
export type {
  BottomNavigationTab,
  BottomNavigationState,
  BottomNavigationConfig,
  DashboardBottomNavigationProps,
} from './DashboardBottomNavigation';

// Restore Button Component Types
export type {
  RestoreButtonState,
  RestoreButtonConfig,
  DashboardRestoreButtonProps,
} from './DashboardRestoreButton';

// Transition Component Types
export type {
  TransformationState,
  TransformationConfig,
  DashboardTransitionProps,
} from './DashboardTransition';

/**
 * Complete Dashboard System Exports Summary:
 * 
 * Core Components:
 * - DashboardLayoutManager: Main layout management system with Context
 * - DashboardLayout: Complete dashboard layout wrapper
 * - DashboardSidebar: Collapsible sidebar navigation with search
 * - DashboardContentPanel: Dynamic content loading system
 * - DashboardBottomNavigation: Secondary navigation tabs
 * - DashboardRestoreButton: "Restore Up" functionality
 * - DashboardTransition: Apple-inspired transition animations
 * 
 * Hooks:
 * - useDashboardLayout: Type-safe dashboard state management
 * 
 * Context:
 * - DashboardLayoutContext: React Context for dashboard state
 * 
 * Features:
 * - Complete homepage ↔ dashboard transformation
 * - Advanced sidebar with search and keyboard shortcuts
 * - Dynamic content loading with error handling
 * - Secondary navigation with haptic feedback
 * - Restore functionality with auto-show
 * - Apple-inspired animations with performance monitoring
 * - WCAG 2.1 AA+ accessibility compliance
 * - Mobile-responsive design with auto-adaptation
 * - Enterprise-grade state persistence
 * - Performance optimization (60fps targeting)
 */ 