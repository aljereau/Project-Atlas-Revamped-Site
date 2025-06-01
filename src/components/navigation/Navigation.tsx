'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useModalContext } from '@/components/modals/ModalProvider';
import { AboutAtlasModal, AtlasToolsModal, ProjectLogModal, GetInvolvedModal } from '@/components/modals';

/**
 * Navigation Props Interface
 * @interface NavigationProps
 */
export interface NavigationProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Navigation Component
 * Main navigation menu with modal trigger functionality
 * Following Atlas Design System and modal-first navigation approach
 * 
 * @component Navigation
 * @param {NavigationProps} props - Component props
 * @returns {JSX.Element} Rendered navigation menu
 */
export default function Navigation({ className = '' }: NavigationProps) {
  const { openModal } = useModalContext();

  // Navigation menu items with comprehensive modal targets
  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      action: () => {
        // Close all modals to return to homepage
        window.location.hash = '';
      }
    },
    {
      id: 'about',
      label: 'About',
      action: () => openModal('about-atlas', <AboutAtlasModal />, { size: 'xl' })
    },
    {
      id: 'tools',
      label: 'Tools',
      action: () => openModal('atlas-tools', <AtlasToolsModal />, { size: 'xl' })
    },
    {
      id: 'project-log',
      label: 'Project Log',
      action: () => openModal('project-log', <ProjectLogModal />, { size: 'xl' })
    },
    {
      id: 'get-involved',
      label: 'Get Involved',
      action: () => openModal('get-involved', <GetInvolvedModal />, { size: 'xl' })
    }
  ];

  return (
    <nav className={`bg-paper-white border-b border-soft-beige/20 ${className}`}>
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Atlas Logo/Brand */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-8 h-8 bg-atlas-green rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">A</span>
            </div>
            <span className="font-serif text-xl font-semibold text-slate-900">Atlas</span>
          </motion.div>

          {/* Navigation Menu */}
          <motion.div
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={item.action}
                className="font-sans text-slate-600 hover:text-atlas-green transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-paper-cream"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.3 + (index * 0.1), 
                  ease: "easeOut" 
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-slate-600 hover:text-atlas-green transition-colors duration-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            onClick={() => openModal('mobile-menu', 
              <div className="p-4">
                <h3 className="font-serif text-xl font-semibold text-slate-900 mb-6">Navigation</h3>
                <div className="space-y-4">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="block w-full text-left font-sans text-slate-600 hover:text-atlas-green transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-paper-cream"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>, 
              { size: 'sm' }
            )}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </nav>
  );
} 