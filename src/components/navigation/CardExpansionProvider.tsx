'use client';

import React from 'react';

/**
 * Card Expansion State Interface
 * Defines the shape of card expansion state
 */
export interface CardExpansionState {
  expandedCard: string | null;
  isExpanding: boolean;
  isCollapsing: boolean;
}

/**
 * Card Expansion Actions Interface
 * Defines available actions for card expansion
 */
export interface CardExpansionActions {
  expandCard: (cardId: string) => void;
  collapseCard: () => void;
  toggleCard: (cardId: string) => void;
}

/**
 * Combined Card Expansion Context Type
 */
export type CardExpansionContextType = CardExpansionState & CardExpansionActions;

/**
 * Card Expansion Provider Props Interface
 * Using render props pattern to avoid React Context import issues
 */
export interface CardExpansionProviderProps {
  /** Render prop function that receives card expansion state and actions */
  children: (cardExpansionContext: CardExpansionContextType) => React.ReactNode;
}

/**
 * Card Expansion Provider Component
 * 
 * Provides card expansion state and actions to child components
 * through render props pattern for centralized state management
 * 
 * Features:
 * - Centralized card expansion state
 * - Type-safe context access
 * - Performance optimized state management
 * - Render props pattern avoids Context import issues
 * 
 * @component CardExpansionProvider
 * @param {CardExpansionProviderProps} props - Provider props
 * @returns {JSX.Element} Provider wrapper component
 */
export function CardExpansionProvider({ children }: CardExpansionProviderProps): JSX.Element {
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);
  const [isExpanding, setIsExpanding] = React.useState<boolean>(false);
  const [isCollapsing, setIsCollapsing] = React.useState<boolean>(false);

  const expandCard = React.useCallback((cardId: string): void => {
    if (expandedCard === cardId) return;
    
    setIsExpanding(true);
    setExpandedCard(cardId);
    
    // Reset expansion state after animation
    setTimeout(() => {
      setIsExpanding(false);
    }, 300);
  }, [expandedCard]);

  const collapseCard = React.useCallback((): void => {
    if (!expandedCard) return;
    
    setIsCollapsing(true);
    
    setTimeout(() => {
      setExpandedCard(null);
      setIsCollapsing(false);
    }, 300);
  }, [expandedCard]);

  const toggleCard = React.useCallback((cardId: string): void => {
    if (expandedCard === cardId) {
      collapseCard();
    } else {
      expandCard(cardId);
    }
  }, [expandedCard, expandCard, collapseCard]);

  const cardExpansionContext: CardExpansionContextType = {
    // State
    expandedCard,
    isExpanding,
    isCollapsing,
    // Actions
    expandCard,
    collapseCard,
    toggleCard,
  };

  return <>{children(cardExpansionContext)}</>;
} 