'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

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
  /** Optional modal functions for section navigation */
  modalFunctions?: {
    openModal: (modalId: string, content: React.ReactNode, options?: any) => void;
  };
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
  onSectionChange,
  modalFunctions
}: DashboardLayoutProps): JSX.Element {
  
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
      
      // Open modal for section content if modal functions available
      if (modalFunctions?.openModal) {
        console.log(`Opening ${section} dashboard section`);
        modalFunctions.openModal(
          `dashboard-${section}`,
          <div className="text-slate-700">
            <h3 className="text-lg font-semibold mb-4">{section} Dashboard</h3>
            <p>Content for {section} section will be implemented here.</p>
          </div>,
          { size: 'lg' }
        );
      }
      
      // Call section change handler if provided
      if (onSectionChange) {
        onSectionChange(section);
      }
    }
  }, [navigationSections, modalFunctions, onSectionChange]);

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
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{section.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">
                          {section.description}
                        </div>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </motion.aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Content Header */}
        <header className="bg-white border-b border-sage-green/20 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-semibold text-slate-900 mb-1">
                Atlas Dashboard
              </h1>
              <p className="text-sm text-slate-600">
                Real estate intelligence platform
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-sage-green-600 font-medium px-2 py-1 bg-sage-green/10 rounded-full">
                {activeSection.toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {children || (
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <h2 className="text-xl font-serif font-medium text-slate-800 mb-4">
                  Welcome to Atlas Dashboard
                </h2>
                <p className="text-slate-600 mb-6">
                  Select a section from the sidebar to get started, or integrate this layout with your content.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {navigationSections.slice(0, 6).map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className="p-4 border border-sage-green/20 rounded-lg hover:shadow-md transition-shadow text-left"
                    >
                      <span className="text-2xl mb-2 block">{section.icon}</span>
                      <h3 className="font-medium text-slate-800 mb-1">{section.label}</h3>
                      <p className="text-sm text-slate-600">{section.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Types are already exported with the interface declarations above 