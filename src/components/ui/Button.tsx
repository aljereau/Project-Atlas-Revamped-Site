'use client';

import React from 'react';

/**
 * Button Props Interface
 * Following @code_quality_typehints_python.mdc for comprehensive type definitions
 */
export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Size variant of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Button type for form submission */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Enhanced Button Component
 * 
 * Reusable button component following Atlas Design System with pure design tokens
 * Organic styling matching the Atlas aesthetic
 * 
 * Features:
 * - Pure design token system (no inline styles)
 * - Atlas color palette integration with design tokens
 * - Multiple size and variant options
 * - Accessibility support with focus states
 * - Smooth animations and transitions matching Atlas aesthetic
 * - TypeScript interface preservation for transferability
 * 
 * @component Button
 * @param {ButtonProps} props - Component props
 * @returns {JSX.Element} Enhanced button component with design tokens
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps): JSX.Element {
  
  // Base classes using Atlas design tokens
  const baseClasses = 'font-editorial-sans font-medium rounded-organic transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-border-organic';
  
  // Variant-specific styling using design tokens
  const variantClasses = {
    primary: 'bg-atlas-green-500 border-atlas-green-500 text-paper-white hover:bg-atlas-green-600 hover:border-atlas-green-600 focus:ring-atlas-green-500',
    secondary: 'bg-bright-orange-500 border-bright-orange-500 text-paper-white hover:bg-bright-orange-600 hover:border-bright-orange-600 focus:ring-bright-orange-500',
    outline: 'bg-transparent border-atlas-green-500 text-atlas-green-500 hover:bg-atlas-green-500 hover:text-paper-white focus:ring-atlas-green-500',
  };
  
  // Size-specific styling using design tokens
  const sizeClasses = {
    sm: 'px-cozy py-compact text-small',
    md: 'px-comfortable py-cozy text-body',
    lg: 'px-spacious py-comfortable text-large',
  };
  
  // Disabled state styling
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed hover:transform-none hover:bg-current hover:border-current' 
    : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
} 