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
 * Reusable button component following Atlas Design System
 * with multiple variants, sizes, and interaction states
 * 
 * Features:
 * - Atlas color palette integration
 * - Multiple size and variant options
 * - Accessibility support with focus states
 * - Smooth animations and transitions
 * - TypeScript interface for props
 * 
 * @component Button
 * @param {ButtonProps} props - Component props
 * @returns {JSX.Element} Enhanced button component
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
  
  // Base classes for all buttons
  const baseClasses = 'font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2';
  
  // Variant-specific styling
  const variantClasses = {
    primary: 'bg-[#7A8B73] border-[#7A8B73] text-[#FEFEFE] hover:bg-[#6A7A63] hover:border-[#6A7A63] focus:ring-[#7A8B73]',
    secondary: 'bg-[#E67E22] border-[#E67E22] text-[#FEFEFE] hover:bg-[#D35400] hover:border-[#D35400] focus:ring-[#E67E22]',
    outline: 'bg-transparent border-[#7A8B73] text-[#7A8B73] hover:bg-[#7A8B73] hover:text-[#FEFEFE] focus:ring-[#7A8B73]',
  };
  
  // Size-specific styling
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
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
      style={{
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {children}
    </button>
  );
} 