'use client';

import React from 'react';

/**
 * Card Props Interface
 * Following @code_quality_typehints_python.mdc for comprehensive type definitions
 */
export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional card title */
  title?: string;
  /** Additional CSS class names */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether card should have hover effects */
  hoverable?: boolean;
  /** Card variant for different styling */
  variant?: 'default' | 'elevated' | 'outlined';
}

/**
 * Enhanced Card Component
 * 
 * Reusable card component following Atlas Design System
 * with paper-first aesthetic and smooth interactions
 * 
 * Features:
 * - Atlas paper-like design aesthetic
 * - Multiple variants (default, elevated, outlined)
 * - Hover effects and click handling
 * - Accessible interaction states
 * - TypeScript interface for props
 * 
 * @component Card
 * @param {CardProps} props - Component props
 * @returns {JSX.Element} Enhanced card component
 */
export default function Card({
  children,
  title,
  className = '',
  onClick,
  hoverable = false,
  variant = 'default'
}: CardProps): JSX.Element {
  
  // Base classes for all cards
  const baseClasses = 'rounded-xl p-6 transition-all duration-200';
  
  // Variant-specific styling
  const variantClasses = {
    default: 'bg-[#FEFEFE] border-2 border-[#D0CCC3]',
    elevated: 'bg-[#FEFEFE] border-2 border-[#D0CCC3] shadow-md',
    outlined: 'bg-transparent border-2 border-[#7A8B73]'
  };
  
  // Interactive styling
  const interactiveClasses = (hoverable || onClick)
    ? 'cursor-pointer hover:border-[#7A8B73] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
    : '';
  
  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      style={{
        backgroundColor: variant === 'outlined' ? 'transparent' : '#FEFEFE'
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {title && (
        <h3 
          className="mb-3"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#2C2C2C',
            lineHeight: 1.3
          }}
        >
          {title}
        </h3>
      )}
      <div 
        style={{ 
          fontFamily: 'Inter, sans-serif',
          color: '#6B6B6B',
          lineHeight: 1.5
        }}
      >
        {children}
      </div>
    </div>
  );
} 