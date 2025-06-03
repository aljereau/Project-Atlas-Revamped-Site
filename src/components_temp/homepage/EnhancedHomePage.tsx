/**
 * Enhanced Homepage Component  
 * Task 4.3.2 - Homepage with integrated advanced animation systems
 * Comprehensive animation integration with orchestrated entrance sequences
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { atlasContent } from '@/content/atlas-content';
import { useModalContext } from '@/components/modals/ModalProvider';
import EnhancedNavigationCard from './EnhancedNavigationCard';
import { modalAnimations, appleEasing, timing } from '@/animations/modalAnimations';
import { modalContentStagger, globalContentStaggerOrchestrator } from '@/animations/modalContentStagger';
import { microInteractionSystem, globalMicroInteractionManager } from '@/animations/microInteractionSystem';
import { modalPerformanceValidation, globalPerformanceMonitor } from '@/animations/modalPerformanceValidation';
import { advancedGestureRecognition, globalAdvancedGestureManager } from '@/animations/advancedGestureRecognition';

/**
 * Enhanced Homepage Props
 */
export interface EnhancedHomePageProps {
  /** Animation profile for the entire page */
  animationProfile?: 'smooth' | 'dramatic' | 'subtle' | 'performance';
  /** Enable performance monitoring */
  enablePerformanceMonitoring?: boolean;
  /** Enable advanced gestures */
  enableGestures?: boolean;
  /** Enable content stagger orchestration */
  enableContentStagger?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Enhanced Homepage Component
 * Orchestrated animations with advanced features
 */
export default function EnhancedHomePage({
  animationProfile = 'smooth',
  enablePerformanceMonitoring = true,
  enableGestures = true,
  enableContentStagger = true,
  className = '',
}: EnhancedHomePageProps) {
  const { openModal } = useModalContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const [pageLoaded, setPageLoaded] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [gestureStats, setGestureStats] = useState<any>(null);
  
  // Scroll-based animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  const cardsY = useTransform(scrollY, [0, 400], [0, -20]);
  
  // Spring animations for smooth interactions
  const heroScale = useSpring(1, { stiffness: 300, damping: 30 });
  const cardsSpacing = useSpring(24, { stiffness: 400, damping: 40 });
  
  // Homepage content data with enhanced structure
  const homepageCards = [
    {
      id: 'what-we-build',
      title: "What we build",
      description: "Real estate intelligence tools designed to democratize access to comprehensive market data and analysis.",
      priority: 'high' as const,
      modalContent: 'WhatWeBuildContent',
    },
    {
      id: 'why-we-exist',
      title: "Why we exist",
      description: "Building transparency in real estate by creating tools that bridge information asymmetries in the market.",
      priority: 'high' as const,
      modalContent: 'WhyWeExistContent',
    },
    {
      id: 'who-we-are',
      title: "Who we are",
      description: "A growing team of real estate professionals and developers building the future of property intelligence.",
      priority: 'medium' as const,
      modalContent: 'WhoWeAreContent',
    },
    {
      id: 'our-timeline',
      title: "Our timeline",
      description: "From concept to reality - follow our journey building Atlas tools and expanding our capabilities.",
      priority: 'medium' as const,
      modalContent: 'OurTimelineContent',
    },
  ];
  
  // Initialize page-level animation systems
  useEffect(() => {
    initializePageAnimations();
    
    // Mark page as loaded after initial render
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Initialize animation systems
  const initializePageAnimations = useCallback(async () => {
    const pageId = 'homepage-enhanced';
    
    try {
      // Initialize performance monitoring
      if (enablePerformanceMonitoring) {
        await initializePerformanceMonitoring(pageId);
      }
      
      // Initialize content stagger orchestration
      if (enableContentStagger) {
        await initializeContentStaggerOrchestration(pageId);
      }
      
      // Initialize gesture recognition
      if (enableGestures) {
        await initializeGestureRecognition(pageId);
      }
      
      // Initialize micro-interactions for page elements
      await initializeMicroInteractions();
      
    } catch (error) {
      console.error('Failed to initialize page animations:', error);
    }
  }, [enablePerformanceMonitoring, enableContentStagger, enableGestures]);
  
  // Initialize performance monitoring
  const initializePerformanceMonitoring = useCallback(async (pageId: string) => {
    globalPerformanceMonitor.startMonitoring(pageId);
    
    // Monitor for page load performance
    setTimeout(async () => {
      const metrics = globalPerformanceMonitor.stopMonitoring();
      setPerformanceData(metrics);
      
      if (metrics && metrics.frameRate.average < 55) {
        console.warn('Homepage performance below 60fps:', metrics);
      }
    }, 3000);
  }, []);
  
  // Initialize content stagger orchestration
  const initializeContentStaggerOrchestration = useCallback(async (pageId: string) => {
    if (!containerRef.current) return;
    
    // Register page sections for staggered reveal
    const sections = ['hero', 'navigation-cards', 'cta'];
    
    sections.forEach((section, index) => {
      const element = containerRef.current?.querySelector(`[data-section="${section}"]`) as HTMLElement;
      if (element) {
        globalContentStaggerOrchestrator.registerContent(`${pageId}-${section}`, element, {
          type: section === 'navigation-cards' ? 'card' : 'text',
          section: section,
          length: element.textContent?.length || 100,
          priority: index === 0 ? 'high' : 'medium',
        });
      }
    });
    
    // Execute staggered reveal
    setTimeout(() => {
      globalContentStaggerOrchestrator.executeStaggeredReveal(pageId);
    }, 200);
  }, []);
  
  // Initialize gesture recognition
  const initializeGestureRecognition = useCallback(async (pageId: string) => {
    if (!containerRef.current) return;
    
    // Enable page-level gestures
    globalAdvancedGestureManager.onGestureRecognized('circularSwipe', (data) => {
      console.log('Circular swipe on homepage - triggering animation');
      heroScale.set(1.05);
      setTimeout(() => heroScale.set(1), 300);
    });
    
    globalAdvancedGestureManager.onGestureRecognized('triangleGesture', (data) => {
      console.log('Triangle gesture on homepage - opening Easter egg');
      // Could trigger special animations or features
    });
    
    // Update gesture stats periodically
    const statsInterval = setInterval(() => {
      const stats = globalAdvancedGestureManager.getRecognitionStatistics();
      setGestureStats(stats);
    }, 5000);
    
    return () => clearInterval(statsInterval);
  }, [heroScale]);
  
  // Initialize micro-interactions
  const initializeMicroInteractions = useCallback(async () => {
    if (!containerRef.current) return;
    
    // Apply micro-interactions to interactive elements
    const buttons = containerRef.current.querySelectorAll('button');
    buttons.forEach(button => {
      globalMicroInteractionManager.applyButtonMicroInteraction(button as HTMLElement, 'default', {
        enableHaptic: false,
        enableVisualFeedback: true,
        enableAnalytics: enablePerformanceMonitoring,
      });
    });
  }, [enablePerformanceMonitoring]);
  
  // Handle modal opening with enhanced animation
  const handleCardClick = useCallback((cardId: string, modalContent: string) => {
    const modalId = cardId;
    // This would be connected to the actual modal content components
    console.log(`Opening modal: ${modalId} with content: ${modalContent}`);
    
    // Trigger modal opening with integrated animation system
    // openModal(modalId, getModalContent(modalContent), { 
    //   size: 'lg',
    //   animationProfile: animationProfile,
    // });
  }, [animationProfile]);
  
  // Handle primary CTA clicks
  const handleExploreToolsClick = useCallback(() => {
    console.log('Opening Atlas Tools modal with dramatic animation');
    // openModal('atlas-tools', <AtlasToolsModal />, { 
    //   size: 'xl',
    //   animationProfile: 'dramatic',
    // });
  }, []);
  
  const handleProjectLogClick = useCallback(() => {
    console.log('Opening Project Log modal');
    // openModal('project-log', <ProjectLogModal />, { 
    //   size: 'xl',
    //   animationProfile: animationProfile,
    // });
  }, [animationProfile]);
  
  // Animation variants based on profile
  const getPageAnimationVariants = useCallback(() => {
    const profiles = {
      smooth: {
        container: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.slow,
              staggerChildren: 0.2,
              delayChildren: 0.1,
            },
          },
        },
        hero: {
          initial: { opacity: 0, y: 30, scale: 0.95 },
          visible: {
            opacity: 1, y: 0, scale: 1,
            transition: {
              duration: timing.verySlow,
              ease: appleEasing.primary,
            },
          },
        },
        cards: {
          initial: { opacity: 0, y: 40 },
          visible: {
            opacity: 1, y: 0,
            transition: {
              duration: timing.slow,
              ease: appleEasing.gentle,
              staggerChildren: 0.15,
              delayChildren: 0.3,
            },
          },
        },
        cta: {
          initial: { opacity: 0, y: 20 },
          visible: {
            opacity: 1, y: 0,
            transition: {
              duration: timing.normal,
              ease: appleEasing.primary,
              delay: 0.8,
            },
          },
        },
      },
      dramatic: {
        container: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.verySlow,
              staggerChildren: 0.3,
              delayChildren: 0.2,
            },
          },
        },
        hero: {
          initial: { opacity: 0, y: 60, scale: 0.8, rotateX: 15 },
          visible: {
            opacity: 1, y: 0, scale: 1, rotateX: 0,
            transition: {
              duration: timing.verySlow * 1.5,
              ease: appleEasing.bounce,
            },
          },
        },
        cards: {
          initial: { opacity: 0, y: 80, scale: 0.9 },
          visible: {
            opacity: 1, y: 0, scale: 1,
            transition: {
              duration: timing.verySlow,
              ease: appleEasing.primary,
              staggerChildren: 0.2,
              delayChildren: 0.5,
            },
          },
        },
        cta: {
          initial: { opacity: 0, y: 40, scale: 0.9 },
          visible: {
            opacity: 1, y: 0, scale: 1,
            transition: {
              duration: timing.slow,
              ease: appleEasing.bounce,
              delay: 1.2,
            },
          },
        },
      },
      subtle: {
        container: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.normal,
              staggerChildren: 0.1,
            },
          },
        },
        hero: {
          initial: { opacity: 0, y: 10 },
          visible: {
            opacity: 1, y: 0,
            transition: {
              duration: timing.normal,
              ease: appleEasing.gentle,
            },
          },
        },
        cards: {
          initial: { opacity: 0, y: 15 },
          visible: {
            opacity: 1, y: 0,
            transition: {
              duration: timing.normal,
              ease: appleEasing.gentle,
              staggerChildren: 0.05,
              delayChildren: 0.1,
            },
          },
        },
        cta: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.fast,
              delay: 0.3,
            },
          },
        },
      },
      performance: {
        container: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.fast,
              staggerChildren: 0.02,
            },
          },
        },
        hero: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: timing.fast },
          },
        },
        cards: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: timing.fast,
              staggerChildren: 0.01,
            },
          },
        },
        cta: {
          initial: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: timing.fast },
          },
        },
      },
    };
    
    return profiles[animationProfile];
  }, [animationProfile]);
  
  const variants = getPageAnimationVariants();
  
  return (
    <motion.div
      ref={containerRef}
      className={`min-h-screen bg-warm-white ${className}`}
      variants={variants.container}
      initial="initial"
      animate={pageLoaded ? "visible" : "initial"}
    >
      {/* Performance debug panel (development only) */}
      {performanceData && process.env.NODE_ENV === 'development' && (
        <motion.div
          className="fixed top-4 right-4 bg-slate-900 text-white p-3 rounded-lg text-xs z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3 }}
        >
          <div>FPS: {performanceData.frameRate.average.toFixed(1)}</div>
          <div>Dropped: {performanceData.frameRate.droppedFrames}</div>
          {gestureStats && <div>Gestures: {gestureStats.totalGestures}</div>}
        </motion.div>
      )}
      
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative overflow-hidden"
        data-section="hero"
        variants={variants.hero}
        style={{
          y: heroY,
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Hero content with staggered animations */}
          <motion.div
            className="text-center space-y-8"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {/* Main heading */}
            <motion.h1
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-slate-900 max-w-4xl mx-auto leading-tight"
              variants={{
                initial: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1, y: 0, scale: 1,
                  transition: { 
                    duration: timing.verySlow, 
                    ease: appleEasing.primary,
                  },
                },
              }}
            >
              {atlasContent.homepage.hero.title}
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              className="font-sans text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
              variants={{
                initial: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1, y: 0,
                  transition: { 
                    duration: timing.slow, 
                    ease: appleEasing.gentle,
                  },
                },
              }}
            >
              {atlasContent.homepage.hero.subtitle}
            </motion.p>
            
            {/* Description */}
            <motion.p
              className="font-sans text-slate-600 max-w-2xl mx-auto leading-relaxed"
              variants={{
                initial: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1, y: 0,
                  transition: { 
                    duration: timing.slow, 
                    ease: appleEasing.gentle,
                  },
                },
              }}
            >
              {atlasContent.homepage.hero.description}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Navigation Cards Section */}
      <motion.div
        ref={cardsRef}
        className="max-w-7xl mx-auto px-6 py-12"
        data-section="navigation-cards"
        variants={variants.cards}
        style={{ y: cardsY }}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
              },
            },
          }}
          style={{ gap: cardsSpacing }}
        >
          {homepageCards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={{
                initial: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1, y: 0, scale: 1,
                  transition: {
                    duration: timing.slow,
                    ease: appleEasing.primary,
                    delay: index * 0.1,
                  },
                },
              }}
            >
              <EnhancedNavigationCard
                title={card.title}
                description={card.description}
                onClick={() => handleCardClick(card.id, card.modalContent)}
                animationProfile={animationProfile}
                enableGestures={enableGestures}
                enablePerformanceMonitoring={enablePerformanceMonitoring}
                enableMicroInteractions={true}
                priority={card.priority}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Primary CTA Section */}
      <motion.div
        className="max-w-7xl mx-auto px-6 py-16"
        data-section="cta"
        variants={variants.cta}
      >
        <motion.div
          className="text-center space-y-8"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={{
              initial: { opacity: 0, y: 20 },
              visible: {
                opacity: 1, y: 0,
                transition: { 
                  duration: timing.normal, 
                  ease: appleEasing.primary,
                },
              },
            }}
          >
            <motion.button
              className="bg-atlas-green hover:bg-atlas-green-dark text-white font-sans font-medium px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              onClick={handleExploreToolsClick}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: timing.fast, ease: appleEasing.primary }}
            >
              Explore our tools
            </motion.button>
            
            <motion.button
              className="border-2 border-bright-orange text-bright-orange hover:bg-bright-orange hover:text-white font-sans font-medium px-8 py-4 rounded-xl transition-colors duration-200"
              onClick={handleProjectLogClick}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: timing.fast, ease: appleEasing.primary }}
            >
              Built in public - Read the project log →
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 