'use client';

import React, { createContext, useContext } from 'react';
import { useCardExpansion, type CardExpansionState, type CardExpansionActions } from '@/hooks/useCardExpansion';

/**
 * Card Expansion Context Type
 * Combines state and actions from useCardExpansion hook
 */
type CardExpansionContextType = CardExpansionState & CardExpansionActions;

/**
 * Card Expansion Context
 * React context for sharing card expansion state across components
 */
const CardExpansionContext = createContext<CardExpansionContextType | undefined>(undefined);

/**
 * Card Expansion Provider Props Interface
 * Following @code_quality_typehints_python.mdc for type safety
 */
export interface CardExpansionProviderProps {
  /** Child components that can access card expansion context */
  children: React.ReactNode;
}

/**
 * Card Expansion Provider Component
 * 
 * Provides card expansion state and actions to child components
 * through React Context API for centralized state management
 * 
 * Features:
 * - Centralized card expansion state
 * - Type-safe context access
 * - Performance optimized with single provider
 * - Error handling for missing provider
 * 
 * @component CardExpansionProvider
 * @param {CardExpansionProviderProps} props - Provider props
 * @returns {JSX.Element} Provider wrapper component
 */
export function CardExpansionProvider({ children }: CardExpansionProviderProps): JSX.Element {
  const cardExpansionState = useCardExpansion();

  return (
    <CardExpansionContext.Provider value={cardExpansionState}>
      {children}
    </CardExpansionContext.Provider>
  );
}

/**
 * useCardExpansionContext Hook
 * 
 * Custom hook for accessing card expansion context with error handling
 * Ensures components are wrapped in CardExpansionProvider
 * 
 * @returns {CardExpansionContextType} Card expansion state and actions
 * @throws {Error} When used outside of CardExpansionProvider
 */
export function useCardExpansionContext(): CardExpansionContextType {
  const context = useContext(CardExpansionContext);
  
  if (context === undefined) {
    throw new Error(
      'useCardExpansionContext must be used within a CardExpansionProvider. ' +
      'Ensure your component is wrapped in <CardExpansionProvider>.'
    );
  }
  
  return context;
} 