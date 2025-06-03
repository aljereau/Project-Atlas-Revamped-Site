import { useState, useCallback } from 'react';

/**
 * Card Expansion State Interface
 * Following @code_quality_typehints_python.mdc adapted for TypeScript
 */
export interface CardExpansionState {
  /** Currently expanded card ID */
  expandedCardId: string | null;
  /** Whether expansion animation is in progress */
  isExpanding: boolean;
  /** Whether card is fully expanded */
  isExpanded: boolean;
  /** Original card position for animation reference */
  cardPosition: DOMRect | null;
}

/**
 * Card Expansion Actions Interface
 * Type-safe action definitions for state management
 */
export interface CardExpansionActions {
  /** Expand a specific card with position tracking */
  expandCard: (cardId: string, cardElement: HTMLElement) => void;
  /** Collapse the currently expanded card */
  collapseCard: () => void;
  /** Set expansion animation state */
  setIsExpanding: (expanding: boolean) => void;
  /** Set fully expanded state */
  setIsExpanded: (expanded: boolean) => void;
}

/**
 * useCardExpansion Hook
 * Manages card expansion state and animations for Apple-inspired transforms
 * 
 * Features:
 * - Position tracking for seamless morphing
 * - Animation state management
 * - Type-safe state transitions
 * - Performance optimized with useCallback
 * 
 * @returns {CardExpansionState & CardExpansionActions} Card expansion state and actions
 */
export function useCardExpansion(): CardExpansionState & CardExpansionActions {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [cardPosition, setCardPosition] = useState<DOMRect | null>(null);

  /**
   * Expand card with position tracking
   * Captures card position for seamless animation morphing
   */
  const expandCard = useCallback((cardId: string, cardElement: HTMLElement): void => {
    // Capture card position before expansion
    const rect = cardElement.getBoundingClientRect();
    setCardPosition(rect);
    
    // Set expansion state
    setExpandedCardId(cardId);
    setIsExpanding(true);
    setIsExpanded(false);
    
    // Complete expansion after animation
    setTimeout(() => {
      setIsExpanding(false);
      setIsExpanded(true);
    }, 600); // Match Framer Motion duration
  }, []);

  /**
   * Collapse the currently expanded card
   * Reverses the expansion animation
   */
  const collapseCard = useCallback((): void => {
    setIsExpanding(true);
    setIsExpanded(false);
    
    // Complete collapse after animation
    setTimeout(() => {
      setExpandedCardId(null);
      setIsExpanding(false);
      setCardPosition(null);
    }, 600); // Match Framer Motion duration
  }, []);

  return {
    // State
    expandedCardId,
    isExpanding,
    isExpanded,
    cardPosition,
    // Actions
    expandCard,
    collapseCard,
    setIsExpanding,
    setIsExpanded,
  };
} 