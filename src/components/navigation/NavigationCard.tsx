'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Navigation Card Props Interface
 * Following @code_quality_typehints_python.mdc for comprehensive type definitions
 */
export interface NavigationCardProps {
  /** Card title displayed */
  title: string;
  /** Card description */
  description: string;
  /** Click handler with card element reference for position tracking */
  onClick: (cardElement: HTMLElement) => void;
  /** Additional CSS class names */
  className?: string;
  /** Whether this card is currently expanded */
  isExpanded?: boolean;
}

/**
 * NavigationCard Component
 * 
 * Interactive card component following Atlas Design System
 * with paper-first aesthetic and smooth expansion transforms
 * 
 * Features:
 * - Atlas paper-first design aesthetic
 * - Position tracking for expansion animation
 * - Accessible click handling
 * - Type-safe prop interfaces
 * - Performance optimized animations
 * 
 * @component NavigationCard
 * @param {NavigationCardProps} props - Component props
 * @returns {JSX.Element} Interactive navigation card
 */
export function NavigationCard({
  title,
  description,
  onClick,
  className = '',
  isExpanded = false
}: NavigationCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);

  /**
   * Handle card click with position tracking
   * Captures card element position before triggering expansion
   */
  const handleClick = (): void => {
    if (cardRef.current && !isExpanded) {
      onClick(cardRef.current);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 ${className}`}
      style={{
        backgroundColor: '#FEFEFE',
        borderColor: '#D0CCC3'
      }}
      onClick={handleClick}
      layoutId={`card-${title}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -1,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      onMouseEnter={(e: MouseEvent) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#7A8B73';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#7A8B73';
      }}
      onMouseLeave={(e: MouseEvent) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#D0CCC3';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#FEFEFE';
      }}
    >
      {/* Card Content */}
      <div>
        <h3 
          className="mb-3 group-hover:text-white transition-colors duration-200"
          style={{ 
            fontFamily: 'Inter, Helvetica Neue, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#2C2C2C',
            lineHeight: 1.3
          }}
        >
          {title}
        </h3>
        
        <p 
          className="group-hover:text-white transition-colors duration-200"
          style={{ 
            fontFamily: 'Inter, Helvetica Neue, sans-serif',
            fontSize: '0.875rem',
            color: '#6B6B6B',
            lineHeight: 1.5
          }}
        >
          {description}
        </p>

        {/* View Dashboard indicator */}
        <div 
          className="mt-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <span 
            className="text-white mr-2"
            style={{ 
              fontFamily: 'Inter, Helvetica Neue, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            View Dashboard
          </span>
          <svg 
            className="w-4 h-4 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
} 