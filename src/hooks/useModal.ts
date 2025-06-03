import { useState, useCallback } from 'react'

/**
 * Modal Options Interface
 * Following @code_quality_typehints_python.mdc adapted for TypeScript
 */
export interface ModalOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  overlay?: boolean
}

/**
 * Active Modal Interface
 */
export interface ActiveModal {
  id: string
  content: React.ReactNode
  options: ModalOptions
}

/**
 * useModal Hook
 * Manages modal state and provides modal control functions
 * 
 * @returns Modal state and control functions
 */
export function useModal() {
  const [activeModals, setActiveModals] = useState<ActiveModal[]>([])

  /**
   * Open a modal with specified content and options
   */
  const openModal = useCallback((
    modalId: string, 
    content: React.ReactNode, 
    options: ModalOptions = {}
  ): void => {
    const defaultOptions: ModalOptions = {
      size: 'md',
      closable: true,
      overlay: true,
      ...options
    }

    const newModal: ActiveModal = {
      id: modalId,
      content,
      options: defaultOptions
    }

    setActiveModals(prev => {
      // Remove existing modal with same ID if it exists
      const filtered = prev.filter(modal => modal.id !== modalId)
      return [...filtered, newModal]
    })
  }, [])

  /**
   * Close a specific modal or the most recent one
   */
  const closeModal = useCallback((modalId?: string): void => {
    if (modalId) {
      setActiveModals(prev => prev.filter(modal => modal.id !== modalId))
    } else {
      // Close the most recent modal
      setActiveModals(prev => prev.slice(0, -1))
    }
  }, [])

  /**
   * Close all open modals
   */
  const closeAllModals = useCallback((): void => {
    setActiveModals([])
  }, [])

  /**
   * Check if a specific modal is open
   */
  const isModalOpen = useCallback((modalId: string): boolean => {
    return activeModals.some(modal => modal.id === modalId)
  }, [activeModals])

  return {
    activeModals,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen
  }
} 