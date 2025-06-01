import { useState, useCallback } from 'react'
import type { ModalOptions, ActiveModal } from '../types'

export function useModal() {
  const [activeModals, setActiveModals] = useState<ActiveModal[]>([])

  const openModal = useCallback((
    modalId: string, 
    content: React.ReactNode, 
    options: ModalOptions = {}
  ) => {
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

  const closeModal = useCallback((modalId?: string) => {
    if (modalId) {
      setActiveModals(prev => prev.filter(modal => modal.id !== modalId))
    } else {
      // Close the most recent modal
      setActiveModals(prev => prev.slice(0, -1))
    }
  }, [])

  const closeAllModals = useCallback(() => {
    setActiveModals([])
  }, [])

  const isModalOpen = useCallback((modalId: string) => {
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