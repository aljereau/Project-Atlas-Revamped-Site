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
 * Reusable card component following Atlas Design System with pure design tokens
 * Organic paper aesthetic matching Home page quality
 * 
 * Features:
 * - Pure design token system (no inline styles)
 * - Organic paper-like aesthetic with Atlas design language
 * - Multiple variants (default, elevated, outlined)
 * - Sophisticated hover effects matching Home page
 * - Accessible interaction states
 * - TypeScript interface preservation for transferability
 * 
 * @component Card
 * @param {CardProps} props - Component props
 * @returns {JSX.Element} Enhanced card component with design tokens
 */
export default function Card({
  children,
  title,
  className = '',
  onClick,
  hoverable = false,
  variant = 'default'
}: CardProps): JSX.Element {
  
  // Base classes using Atlas design tokens
  const baseClasses = 'rounded-organic transition-all duration-200';
  
  // Variant-specific styling using design tokens
  const variantClasses = {
    default: 'bg-paper-white border border-border-organic',
    elevated: 'bg-paper-white border border-border-organic shadow-organic-md',
    outlined: 'bg-transparent border border-atlas-green-500'
  };
  
  // Interactive styling using design tokens matching Home page quality
  const interactiveClasses = (hoverable || onClick)
    ? 'cursor-pointer hover:border-atlas-green-500 hover:shadow-organic-lg hover:scale-[1.02] active:scale-[0.98] group'
    : '';
  
  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
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
        <h3 className="mb-cozy font-editorial-serif font-medium text-large text-editorial-ink leading-tight">
          {title}
        </h3>
      )}
      <div className="font-editorial-sans text-body text-editorial-slate leading-reading">
        {children}
      </div>
    </div>
  );
} 