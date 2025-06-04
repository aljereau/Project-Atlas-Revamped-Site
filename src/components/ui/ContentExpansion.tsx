/**
 * Content Sandbox Component - Atlas Lab
 * Simple content panel that appears above navigation
 * Shows different content based on selected navigation item
 * 
 * @component ContentSandbox
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether content panel is shown
 * @param {Function} props.onClose - Callback when panel is closed
 * @param {ReactNode} props.children - Content to display in panel
 * @returns {JSX.Element} Content sandbox panel
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ContentSandboxProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ContentSandbox({
  isOpen,
  onClose,
  children
}: ContentSandboxProps): JSX.Element {
  if (!isOpen) return <></>;

  // Add keyboard escape handling
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-editorial-ink/20"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Content Sandbox Panel - appears above navigation */}
      <motion.div
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 rounded-organic shadow-organic-xl overflow-hidden bg-paper-warm border border-border-organic"
        style={{
          width: 'min(90vw, 800px)',
          maxHeight: '70vh'
        }}
        initial={{
          opacity: 0,
          y: 100,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }}
        exit={{
          opacity: 0,
          y: 100,
          scale: 0.95
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Content area */}
        <div className="h-full flex flex-col relative">
          {/* Close button */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 bg-paper-white/90 text-editorial-stone border border-border-organic backdrop-blur-sm"
              aria-label="Close content"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 pr-14">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Hook for managing sandbox state
 */
export function useContentSandbox() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openSandbox = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSandbox = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openSandbox,
    closeSandbox
  };
} 