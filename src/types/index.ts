// Component Props Types
import React from 'react';
import type { ModalOptions, ActiveModal } from '../hooks/useModal';

export interface BaseComponentProps {
  children?: React.ReactNode
  className?: string
}

// Button Component Types
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

// Card Component Types
export interface CardProps extends BaseComponentProps {
  title?: string
  onClick?: () => void
  hoverable?: boolean
  children: React.ReactNode
}

// Modal System Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

/**
 * Modal Context Type
 * Provides complete modal functionality through React Context
 */
export interface ModalContextType {
  openModal: (modalId: string, content: React.ReactNode, options?: ModalOptions) => void
  closeModal: (modalId?: string) => void
  closeAllModals: () => void
  isModalOpen: (modalId: string) => boolean
  activeModals: ActiveModal[]
  // Legacy compatibility
  isOpen: boolean
  currentModal: string | null
}

// Re-export modal types for convenience
export type { ModalOptions, ActiveModal } from '../hooks/useModal';

// Navigation Types
export interface NavigationItem {
  id: string
  label: string
  action: () => void
  icon?: React.ReactNode
}

// Homepage Component Types
export interface HeroSectionProps extends BaseComponentProps {
  title: string
  subtitle: string
  description?: string
}

export interface NavigationCardProps extends BaseComponentProps {
  title: string
  description: string
  onClick: () => void
  className?: string
  delay?: number
}

// Content Types
export interface AtlasContent {
  homepage: {
    hero: {
      title: string
      subtitle: string
    }
    navigationCards: NavigationCardProps[]
    footer: string
  }
  modals: {
    [key: string]: {
      title: string
      content: string | React.ReactNode
    }
  }
} 