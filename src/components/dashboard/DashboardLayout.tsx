'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useModalContext } from '../modals/ModalProvider';

/**
 * Dashboard Section Type
 * Following @code_quality_typehints_python.mdc adapted for TypeScript
 */
export type DashboardSection = 
  | 'overview'
  | 'tools'
  | 'analytics'
  | 'reports'
  | 'settings'
  | 'timeline'
  | 'team'
  | 'projects';

/**
 * Dashboard Layout Configuration Interface
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
}

/**
 * Dashboard Layout Props Interface
 */
export interface DashboardLayoutProps {
  /** Dashboard layout configuration */
  config?: Partial<DashboardLayoutConfig>;
  /** Child components */
  children?: React.ReactNode;
  /** Custom CSS classes */
  className?: string;
  /** Current active section */
  activeSection?: DashboardSection;
  /** Section change handler */
  onSectionChange?: (section: DashboardSection) => void;
}

/**
 * Default Dashboard Layout Configuration
 */
const defaultLayoutConfig: DashboardLayoutConfig = {
  enableSidebar: true,
  defaultSidebarCollapsed: false,
  enableTransitions: true,
  initialSection: 'overview',
};

/**
 * Dashboard Layout Component
 * Simplified dashboard layout with modal-first navigation
 * Features responsive sidebar and content area management
 * 
 * @component DashboardLayout
 * @param {DashboardLayoutProps} props - Component props
 * @returns {JSX.Element} Rendered dashboard layout
 */
export default function DashboardLayout({
  config = {},
  children,
  className = '',
  activeSection = 'overview',
  onSectionChange
}: DashboardLayoutProps): JSX.Element {
  const { openModal } = useModalContext();
  
  // Merge configuration with defaults
  const layoutConfig: DashboardLayoutConfig = {
    ...defaultLayoutConfig,
    ...config,
  };

  // Sidebar state management
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(
    layoutConfig.defaultSidebarCollapsed
  );

  // Navigation sections data
  const navigationSections: Array<{
    id: DashboardSection;
    label: string;
    description: string;
    icon: string;
  }> = [
    { id: 'overview', label: 'Overview', description: 'Dashboard overview and key metrics', icon: '📊' },
    { id: 'tools', label: 'Tools', description: 'Real estate intelligence tools suite', icon: '🛠️' },
    { id: 'analytics', label: 'Analytics', description: 'Market analysis and insights', icon: '📈' },
    { id: 'reports', label: 'Reports', description: 'Generated reports and documentation', icon: '📋' },
    { id: 'timeline', label: 'Timeline', description: 'Project timeline and milestones', icon: '⏱️' },
    { id: 'team', label: 'Team', description: 'Team members and roles', icon: '👥' },
    { id: 'projects', label: 'Projects', description: 'Active projects and initiatives', icon: '🚀' },
    { id: 'settings', label: 'Settings', description: 'Dashboard configuration', icon: '⚙️' },
  ];

  // Handle sidebar toggle
  const handleSidebarToggle = useCallback((): void => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // Handle section navigation via modals
  const handleSectionClick = useCallback((section: DashboardSection): void => {
    const sectionData = navigationSections.find(s => s.id === section);
    if (sectionData) {
      // Create modal content for the section
      const content = (
        <div className="p-6">
          <h2 className="text-2xl font-serif font-semibold mb-4 text-slate-900">
            {sectionData.icon} {sectionData.label}
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              {sectionData.description}
            </p>
            <p className="text-slate-600">
              Detailed {sectionData.label.toLowerCase()} content will be populated here with 
              interactive elements, data visualizations, and enhanced functionality.
            </p>
          </div>
        </div>
      );
      
      // Open modal for section content
      console.log(`Opening ${section} dashboard section`);
      openModal(
        `dashboard-${section}`,
        <div className="text-slate-700">
          <h3 className="text-lg font-semibold mb-4">{section} Dashboard</h3>
          <p>Content for {section} section will be implemented here.</p>
        </div>,
        { size: 'lg' }
      );
      
      // Call section change handler if provided
      if (onSectionChange) {
        onSectionChange(section);
      }
    }
  }, [navigationSections, openModal, onSectionChange]);

  return (
    <div className={`min-h-screen bg-paper-white flex ${className}`}>
      {/* Sidebar Navigation */}
      {layoutConfig.enableSidebar && (
        <motion.aside
          className={`bg-white border-r border-sage-green/20 flex flex-col shadow-sm`}
          initial={{ width: layoutConfig.defaultSidebarCollapsed ? 72 : 280 }}
          animate={{ width: isSidebarCollapsed ? 72 : 280 }}
          transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-sage-green/10">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <h2 className="font-serif text-lg font-semibold text-slate-900">
                  Atlas Dashboard
                </h2>
              )}
              <button
                onClick={handleSidebarToggle}
                className="p-2 rounded-lg hover:bg-sage-green/10 transition-colors"
                type="button"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <span className="text-slate-600">
                  {isSidebarCollapsed ? '→' : '←'}
                </span>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {navigationSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-colors duration-200
                      hover:bg-sage-green/10 focus:bg-sage-green/10
                      ${activeSection === section.id ? 'bg-sage-green/15 text-sage-green-dark' : 'text-slate-700'}
                      ${isSidebarCollapsed ? 'flex items-center justify-center' : 'flex items-center space-x-3'}
                    `}
                    type="button"
                    title={isSidebarCollapsed ? section.label : undefined}
                  >
                    <span className="text-lg">{section.icon}</span>
                    {!isSidebarCollapsed && (
                      <span className="font-medium">{section.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sage-green/10">
            <div className={`${isSidebarCollapsed ? 'text-center' : ''}`}>
              {!isSidebarCollapsed && (
                <p className="text-xs text-slate-500">
                  Atlas Real Estate Intelligence
                </p>
              )}
            </div>
          </div>
        </motion.aside>
      )}

      {/* Main Content Area */}
      <motion.main
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </div>
  );
}

// Types are already exported with the interface declarations above 