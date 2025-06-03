/**
 * Main Navigation Component - Atlas Lab
 * Provides navigation to all main sections of the Atlas site
 * Styled as modern pill navigation with enhanced visibility
 * 
 * @component MainNavigation
 * @param {Object} props - Component props
 * @param {string} props.activeSection - Currently active section
 * @param {Function} props.onSectionChange - Callback when section changes
 * @returns {JSX.Element} Main navigation pills
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

interface MainNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'project-log', label: 'Project Log', icon: '🧪' },
  { id: 'atlas-tools', label: 'Atlas Tools', icon: '🧰' },
  { id: 'about-atlas', label: 'About Atlas', icon: '🌐' },
  { id: 'get-involved', label: 'Get Involved', icon: '📬' }
];

export default function MainNavigation({ 
  activeSection, 
  onSectionChange
}: MainNavigationProps): JSX.Element {
  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId);
  };

  return (
    <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div 
        className="flex items-center rounded-full p-3 shadow-lg backdrop-blur-sm"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '1px solid #E0DDD6',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}
      >
        {navigationItems.map((item) => {
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`
                relative px-4 py-3 rounded-full text-sm font-medium transition-all duration-200
                flex items-center space-x-2 min-w-0 z-10
              `}
              style={{
                color: isActive ? '#FFFFFF' : '#2C2C2C',
                backgroundColor: isActive ? '#7A8B73' : 'transparent',
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: isActive ? '#6B7A63' : '#F5F5F5'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {/* Enhanced active background with better contrast */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full z-[-1]"
                  style={{ 
                    backgroundColor: '#7A8B73',
                    boxShadow: '0 2px 8px rgba(122, 139, 115, 0.3)'
                  }}
                  layoutId="activeBackground"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <span className="text-base z-10">{item.icon}</span>
              <span 
                className="hidden md:inline-block whitespace-nowrap z-10"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  textShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
} 