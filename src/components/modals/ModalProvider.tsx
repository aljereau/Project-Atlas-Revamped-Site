'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modal Options Interface
 */
export interface ModalOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  overlay?: boolean;
}

/**
 * Active Modal Interface  
 */
export interface ActiveModal {
  id: string;
  content: React.ReactNode;
  options: ModalOptions;
}

/**
 * Modal Functions Interface
 */
export interface ModalFunctions {
  openModal: (modalId: string, content: React.ReactNode, options?: ModalOptions) => void;
  closeModal: (modalId?: string) => void;
  closeAllModals: () => void;
  isModalOpen: (modalId: string) => boolean;
  activeModals: ActiveModal[];
  isOpen: boolean;
  currentModal: string | null;
}

/**
 * ModalProvider Props Interface
 */
interface ModalProviderProps {
  children: (modalFunctions: ModalFunctions) => React.ReactNode;
}

/**
 * ModalProvider Component
 * Render props pattern to avoid React Context import issues
 */
export function ModalProvider({ children }: ModalProviderProps) {
  const [activeModals, setActiveModals] = React.useState<ActiveModal[]>([]);

  const openModal = React.useCallback((
    modalId: string, 
    content: React.ReactNode, 
    options: ModalOptions = {}
  ): void => {
    const defaultOptions: ModalOptions = {
      size: 'md',
      closable: true,
      overlay: true,
      ...options
    };

    const newModal: ActiveModal = {
      id: modalId,
      content,
      options: defaultOptions
    };

    setActiveModals(prev => {
      const filtered = prev.filter(modal => modal.id !== modalId);
      return [...filtered, newModal];
    });
  }, []);

  const closeModal = React.useCallback((modalId?: string): void => {
    if (modalId) {
      setActiveModals(prev => prev.filter(modal => modal.id !== modalId));
    } else {
      setActiveModals(prev => prev.slice(0, -1));
    }
  }, []);

  const closeAllModals = React.useCallback((): void => {
    setActiveModals([]);
  }, []);

  const isModalOpen = React.useCallback((modalId: string): boolean => {
    return activeModals.some(modal => modal.id === modalId);
  }, [activeModals]);

  const modalFunctions: ModalFunctions = {
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    activeModals,
    isOpen: activeModals.length > 0,
    currentModal: activeModals.length > 0 ? activeModals[activeModals.length - 1].id : null,
  };

  return (
    <>
      {children(modalFunctions)}
      
      {/* Modal Overlay Container */}
      {activeModals.map((modal, index) => (
        <motion.div
          key={modal.id}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ zIndex: 50 + index }}
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
            transition={{ duration: 0.2 }}
            onClick={() => modal.options.closable !== false && closeModal(modal.id)}
          />
          
          {/* Modal Content */}
          <motion.div
            className={`relative bg-paper-white rounded-lg shadow-xl border border-soft-beige/20 w-full max-h-[90vh] overflow-hidden ${getSizeClasses(modal.options.size)}`}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
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
                  onClick={() => closeModal(modal.id)}
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
    </>
  );
}

/**
 * Helper function to get size classes for modals
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