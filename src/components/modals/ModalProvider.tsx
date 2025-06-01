'use client';

import React, { createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '@/hooks/useModal';
import Modal from './Modal';
import type { ModalContextType } from '@/types';

/**
 * Modal Context
 * Provides modal management functionality throughout the application
 */
const ModalContext = createContext<ModalContextType | null>(null);

/**
 * ModalProvider Props Interface
 */
interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * ModalProvider Component
 * Manages modal state and provides modal functionality through context
 * Integrates with Atlas Design System and Framer Motion animations
 * 
 * @component ModalProvider
 * @param {ModalProviderProps} props - Component props
 * @returns {JSX.Element} Modal context provider with animated modals
 */
export function ModalProvider({ children }: ModalProviderProps) {
  const modalHook = useModal();

  const contextValue: ModalContextType = {
    ...modalHook,
    // Legacy compatibility for existing modal interfaces
    isOpen: modalHook.activeModals.length > 0,
    currentModal: modalHook.activeModals.length > 0 ? modalHook.activeModals[modalHook.activeModals.length - 1].id : null,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {/* Modal Overlay Container */}
      <AnimatePresence mode="multiple">
        {modalHook.activeModals.map((modal, index) => (
          <motion.div
            key={modal.id}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ zIndex: 50 + index }} // Stack modals on top of each other
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Overlay Background */}
            <motion.div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => modal.options.closable !== false && modalHook.closeModal(modal.id)}
            />
            
            {/* Modal Content */}
            <motion.div
              className={`relative bg-paper-white rounded-lg shadow-xl border border-soft-beige/20 w-full max-h-[90vh] overflow-hidden ${getSizeClasses(modal.options.size)}`}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Modal Header */}
              <div className="border-b border-soft-beige/20 px-6 py-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-slate-900">
                  {modal.id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h2>
                
                {/* Close Button */}
                {modal.options.closable !== false && (
                  <button
                    onClick={() => modalHook.closeModal(modal.id)}
                    className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {modal.content}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}

/**
 * Custom hook to access modal context
 * @returns {ModalContextType} Modal context methods and state
 */
export function useModalContext(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}

/**
 * Helper function to get size classes for modals
 * @param size - Modal size option
 * @returns CSS classes for modal sizing
 */
function getSizeClasses(size?: string): string {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  return sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
} 