'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  navigationCardVariants,
  cardContentVariants, 
  cardIconVariants,
  cardBorderVariants,
  transformationSequences 
} from '../../animations/cardTransitions';

/**
 * NavigationCard Props Interface
 * @interface NavigationCardProps
 */
export interface NavigationCardProps {
  /** Card title */
  title: string;
  /** Card description content */
  description: string;
  /** Click handler for modal expansion */
  onClick: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Animation delay for staggered entrance */
  delay?: number;
  /** Card type for specific animation variants */
  cardType?: 'whatWeBuild' | 'whyWeExist' | 'whoWeAre' | 'ourTimeline';
  /** Whether this card is currently expanding to modal */
  isExpanding?: boolean;
  /** Whether modal is currently open for this card */
  isModalOpen?: boolean;
}

/**
 * Enhanced NavigationCard Component with Apple Notch-Inspired Animations
 * Seamless panel expansion animations for Atlas homepage navigation
 * Features sophisticated hover states, fluid transformations, and Apple-inspired easing
 * 
 * @component NavigationCard
 * @param {NavigationCardProps} props - Component props
 * @returns {JSX.Element} Rendered navigation card with fluid animations
 */
export default function NavigationCard({ 
  title, 
  description, 
  onClick, 
  className = '', 
  delay = 0,
  cardType = 'whoWeAre',
  isExpanding = false,
  isModalOpen = false
}: NavigationCardProps) {
  
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Determine current animation state based on card status
  const getAnimationState = () => {
    if (isModalOpen) return 'modal';
    if (isExpanding) return 'expanding';
    if (isPressed) return 'pressed';
    if (isHovered) return 'hover';
    return 'idle';
  };
  
  const currentState = getAnimationState();
  const transformationSequence = transformationSequences[currentState];
  
  // Handle card click with smooth transition sequence
  const handleCardClick = () => {
    setIsPressed(true);
    // Brief delay to show pressed state before expansion
    setTimeout(() => {
      setIsPressed(false);
      onClick();
    }, 100);
  };

  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      initial="idle"
      animate={transformationSequence.card}
      variants={navigationCardVariants}
      transition={{
        duration: 0.6, 
        delay: delay, 
        ease: [0.4, 0.0, 0.2, 1] // Apple easing
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTapCancel={() => setIsPressed(false)}
      onClick={handleCardClick}
      style={{ 
        transformOrigin: 'center top',
        willChange: 'transform, opacity, border-radius'
      }}
    >
      {/* Card Container with Dynamic Border Animation */}
      <motion.div 
        className="h-48 bg-paper-cream rounded-lg p-6 relative overflow-hidden"
        animate={transformationSequence.border}
        variants={cardBorderVariants}
        style={{
          background: 'linear-gradient(135deg, var(--paper-cream) 0%, var(--paper-white) 100%)',
          willChange: 'border-width, border-color, box-shadow'
        }}
      >
        
        {/* Card Content with Coordinated Animation */}
        <motion.div 
          className="h-full flex flex-col justify-between relative z-10"
          animate={transformationSequence.content}
          variants={cardContentVariants}
        >
          
          {/* Header Section */}
          <div>
            <motion.h3 
              className="font-serif text-xl font-semibold text-slate-900 mb-3 transition-colors duration-300"
              style={{
                color: isHovered ? 'var(--atlas-green)' : 'var(--text-primary)'
              }}
            >
              {title}
            </motion.h3>
            
            <motion.p 
              className="font-sans text-sm text-slate-600 leading-relaxed line-clamp-4"
              animate={{
                opacity: isExpanding ? 0.5 : 1,
                scale: isExpanding ? 0.98 : 1
              }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {description}
            </motion.p>
          </div>
          
          {/* Action Indicator with Sophisticated Animation */}
          <div className="flex items-center justify-between mt-4">
            {/* Progress Bar with Smooth Fill Animation */}
            <motion.div 
              className="w-8 h-0.5 bg-soft-beige/40 rounded-full overflow-hidden"
              animate={{
                width: isHovered ? 12 : 8,
                backgroundColor: isHovered ? 'var(--atlas-green)' : 'rgba(245, 242, 237, 0.4)'
              }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            >
              <motion.div
                className="h-full bg-atlas-green"
                initial={{ width: '0%' }}
                animate={{ 
                  width: isHovered ? '100%' : '0%',
                  opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
              />
            </motion.div>
            
            {/* Expand Icon with Apple-Inspired Animation */}
            <motion.div 
              className="text-slate-400 transition-colors duration-300"
              animate={transformationSequence.icon}
              variants={cardIconVariants}
              style={{
                color: isHovered ? 'var(--atlas-green)' : 'var(--text-muted)'
              }}
            >
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{
                  rotate: isExpanding ? 180 : 0,
                  scale: isPressed ? 0.9 : 1
                }}
                transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
              >
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  animate={{
                    pathLength: isHovered ? 1 : 0.8,
                    opacity: isHovered ? 1 : 0.7
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                />
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 11v6m-3-3h6"
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    opacity: isExpanding ? 0 : 1
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                />
              </motion.svg>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Subtle Background Gradient Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-atlas-green/5 to-transparent rounded-lg opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.95
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
        
        {/* Expanding State Overlay */}
        <AnimatePresence>
          {isExpanding && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-atlas-green/10 to-atlas-green/5 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            />
          )}
        </AnimatePresence>
        
        {/* Micro-interaction Ripple Effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 bg-atlas-green/20 rounded-lg"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 