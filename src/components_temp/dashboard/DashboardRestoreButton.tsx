'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardLayout } from '@/components/dashboard';

/**
 * Restore Button State Interface
 * Manages internal restore button component state
 */
export interface RestoreButtonState {
  /** Whether button is visible */
  isVisible: boolean;
  /** Whether button is in hover state */
  isHovered: boolean;
  /** Whether button is in pressed state */
  isPressed: boolean;
  /** Animation state */
  animationState: 'idle' | 'restoring' | 'completed';
  /** Time since last dashboard navigation */
  timeSinceNavigation: number;
}

/**
 * Restore Button Configuration Interface
 * Configuration options for restore button behavior
 */
export interface RestoreButtonConfig {
  /** Auto-show delay after navigation (milliseconds) */
  autoShowDelay: number;
  /** Auto-hide timeout (0 = never hide) */
  autoHideTimeout: number;
  /** Position of the button */
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  /** Button size variant */
  size: 'small' | 'medium' | 'large';
  /** Show text label with icon */
  showLabel: boolean;
  /** Custom label text */
  labelText: string;
  /** Enable hover animations */
  enableHoverAnimations: boolean;
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts: boolean;
  /** Keyboard shortcut key combination */
  keyboardShortcut: string;
}

/**
 * Restore Button Props Interface
 * Props for the main restore button component
 */
export interface DashboardRestoreButtonProps {
  /** Restore button configuration */
  config?: Partial<RestoreButtonConfig>;
  /** Custom CSS classes */
  className?: string;
  /** Custom icon component */
  iconComponent?: React.ReactNode;
  /** Custom button content */
  children?: React.ReactNode;
  /** Restore callback */
  onRestore?: () => void;
  /** Visibility callback */
  onVisibilityChange?: (visible: boolean) => void;
}

/**
 * Default Restore Button Configuration
 * Optimized settings for Atlas restore functionality
 */
const defaultRestoreConfig: RestoreButtonConfig = {
  autoShowDelay: 1000,
  autoHideTimeout: 0,
  position: 'top-left',
  size: 'medium',
  showLabel: true,
  labelText: 'Restore Up',
  enableHoverAnimations: true,
  enableKeyboardShortcuts: true,
  keyboardShortcut: 'Escape',
};

/**
 * Dashboard Restore Button Component
 * 
 * Provides "Restore Up" functionality to return users to homepage from any dashboard state.
 * Features smooth animations, keyboard shortcuts, and accessibility compliance.
 * 
 * Key Features:
 * - Auto-show after dashboard navigation
 * - Smooth restore animations with state management
 * - Keyboard shortcut support (Escape key default)
 * - Multiple positioning options
 * - Hover and press animations
 * - Accessibility compliance (ARIA, focus management)
 * - Integration with dashboard layout system
 * - Auto-hide functionality with configurable timeout
 * 
 * Architecture:
 * - Component composition with configurable behavior
 * - State management following React best practices
 * - Performance optimized with proper memoization
 * - TypeScript strict mode compliance
 * - Atlas Design System integration
 * 
 * @component DashboardRestoreButton
 * @param {DashboardRestoreButtonProps} props - Component props
 * @returns {JSX.Element} Restore button component
 */
export default function DashboardRestoreButton({
  config = {},
  className = '',
  iconComponent,
  children,
  onRestore,
  onVisibilityChange,
}: DashboardRestoreButtonProps): JSX.Element {

  // Merge configuration with defaults
  const restoreConfig = React.useMemo(() => ({
    ...defaultRestoreConfig,
    ...config,
  }), [config]);

  // Dashboard layout context
  const dashboardContext = useDashboardLayout();

  // Restore button internal state
  const [buttonState, setButtonState] = useState<RestoreButtonState>({
    isVisible: false,
    isHovered: false,
    isPressed: false,
    animationState: 'idle',
    timeSinceNavigation: 0,
  });

  // Refs for DOM manipulation and timers
  const buttonRef = useRef<HTMLButtonElement>(null);
  const autoShowTimer = useRef<NodeJS.Timeout | null>(null);
  const autoHideTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle Restore Action
   * Processes restore to homepage with animations
   */
  const handleRestore = useCallback(async () => {
    if (buttonState.animationState === 'restoring') return;

    // Update animation state
    setButtonState(prev => ({
      ...prev,
      animationState: 'restoring',
      isPressed: true,
    }));

    try {
      // Execute restore via dashboard context
      await dashboardContext.transformToHomepage();

      // Notify parent component
      if (onRestore) {
        onRestore();
      }

      // Mark as completed
      setButtonState(prev => ({
        ...prev,
        animationState: 'completed',
        isPressed: false,
      }));

      // Reset state after animation
      setTimeout(() => {
        setButtonState(prev => ({
          ...prev,
          isVisible: false,
          animationState: 'idle',
        }));
      }, 300);

    } catch (error) {
      console.error('Restore failed:', error);
      setButtonState(prev => ({
        ...prev,
        animationState: 'idle',
        isPressed: false,
      }));
    }
  }, [dashboardContext, onRestore, buttonState.animationState]);

  /**
   * Handle Button Hover
   * Manages hover state and animations
   */
  const handleHover = useCallback((hovered: boolean) => {
    setButtonState(prev => ({ ...prev, isHovered: hovered }));
  }, []);

  /**
   * Keyboard Shortcut Handler
   * Implements keyboard shortcuts for restore
   */
  const handleKeyboardShortcut = useCallback((event: KeyboardEvent) => {
    if (!restoreConfig.enableKeyboardShortcuts) return;
    if (!buttonState.isVisible) return;

    // Handle escape key (default shortcut)
    if (event.key === restoreConfig.keyboardShortcut) {
      event.preventDefault();
      handleRestore();
    }
  }, [restoreConfig, buttonState.isVisible, handleRestore]);

  /**
   * Auto-Show Logic Effect
   * Handles auto-show behavior after dashboard navigation
   */
  useEffect(() => {
    // Only show in dashboard mode
    if (dashboardContext.state.currentLayout !== 'dashboard') {
      setButtonState(prev => ({ ...prev, isVisible: false }));
      return;
    }

    // Clear existing timer
    if (autoShowTimer.current) {
      clearTimeout(autoShowTimer.current);
    }

    // Set auto-show timer
    autoShowTimer.current = setTimeout(() => {
      setButtonState(prev => ({
        ...prev,
        isVisible: true,
        timeSinceNavigation: 0,
      }));

      // Notify visibility change
      if (onVisibilityChange) {
        onVisibilityChange(true);
      }

      // Set auto-hide timer if configured
      if (restoreConfig.autoHideTimeout > 0) {
        autoHideTimer.current = setTimeout(() => {
          setButtonState(prev => ({ ...prev, isVisible: false }));
          if (onVisibilityChange) {
            onVisibilityChange(false);
          }
        }, restoreConfig.autoHideTimeout);
      }
    }, restoreConfig.autoShowDelay);

    return () => {
      if (autoShowTimer.current) {
        clearTimeout(autoShowTimer.current);
      }
      if (autoHideTimer.current) {
        clearTimeout(autoHideTimer.current);
      }
    };
  }, [dashboardContext.state.currentLayout, restoreConfig, onVisibilityChange]);

  /**
   * Keyboard Event Listener Effect
   * Sets up global keyboard event listeners
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);

  /**
   * Position Classes Map
   * Maps position prop to Tailwind CSS classes
   */
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  /**
   * Size Classes Map
   * Maps size prop to Tailwind CSS classes
   */
  const sizeClasses = {
    small: 'w-10 h-10 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-14 h-14 text-lg',
  };

  /**
   * Animation Variants
   * Framer Motion animation configurations
   */
  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
        type: 'spring',
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    pressed: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const labelVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.2,
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  /**
   * Default Icon Component
   * Default restore icon with arrows pointing up/out
   */
  const DefaultIcon = () => (
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );

  return (
    <AnimatePresence mode="wait">
      {buttonState.isVisible && (
        <motion.div
          className={`
            fixed z-50 ${positionClasses[restoreConfig.position]}
            ${className}
          `}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={buttonVariants}
        >
          <motion.button
            ref={buttonRef}
            onClick={handleRestore}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            disabled={buttonState.animationState === 'restoring'}
            className={`
              ${sizeClasses[restoreConfig.size]}
              bg-sage-green text-white rounded-full
              shadow-lg hover:shadow-xl transition-shadow duration-200
              flex items-center justify-center
              focus:outline-none focus:ring-4 focus:ring-sage-green/30
              disabled:opacity-50 disabled:cursor-not-allowed
              group relative overflow-hidden
            `}
            whileHover={restoreConfig.enableHoverAnimations ? 'hover' : undefined}
            whileTap="pressed"
            variants={buttonVariants}
            aria-label={restoreConfig.labelText}
            title={`${restoreConfig.labelText} (${restoreConfig.keyboardShortcut})`}
          >
            {/* Background Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sage-green to-orange-warm rounded-full opacity-0 group-hover:opacity-20"
              animate={{
                opacity: buttonState.isHovered ? 0.2 : 0,
                scale: buttonState.isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon */}
            <div className={`
              relative z-10 transition-transform duration-200
              ${buttonState.animationState === 'restoring' ? 'animate-spin' : ''}
              ${buttonState.isHovered ? 'scale-110' : ''}
            `}>
              {iconComponent || <DefaultIcon />}
            </div>

            {/* Loading Spinner Overlay */}
            {buttonState.animationState === 'restoring' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </motion.div>
            )}

            {/* Custom Children */}
            {children}
          </motion.button>

          {/* Label */}
          {restoreConfig.showLabel && (
            <motion.div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2"
              initial="hidden"
              animate="visible"
              variants={labelVariants}
            >
              <div className="bg-charcoal-dark text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                {restoreConfig.labelText}
                {restoreConfig.enableKeyboardShortcuts && (
                  <span className="ml-1 opacity-75">({restoreConfig.keyboardShortcut})</span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Dashboard Restore Button Exports
 * Named exports for component and related types
 */
export {
  type RestoreButtonState,
  type RestoreButtonConfig,
  type DashboardRestoreButtonProps,
}; 