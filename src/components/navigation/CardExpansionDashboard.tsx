'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card Expansion Dashboard Props Interface
 * Following @code_quality_typehints_python.mdc for comprehensive type definitions
 */
export interface CardExpansionDashboardProps {
  /** Card title that triggered the expansion */
  cardTitle: string;
  /** Whether the dashboard is currently visible */
  isVisible: boolean;
  /** Original card position for morphing animation */
  cardPosition: DOMRect | null;
  /** Handler for closing the dashboard */
  onClose: () => void;
  /** Whether expansion animation is in progress */
  isExpanding: boolean;
  /** Whether dashboard is fully expanded */
  isExpanded: boolean;
}

/**
 * Card Content Data Interface
 * Type-safe content structure using exact Atlas content requirements
 */
interface CardContentData {
  title: string;
  content: React.ReactNode;
}

/**
 * Card Expansion Dashboard Component
 * 
 * Renders a full-screen dashboard using Atlas Design System
 * with exact content from Atlas-Content-Requirements.mdc
 * 
 * Features:
 * - Atlas paper-first design aesthetic
 * - Exact content from requirements
 * - Seamless morphing from card position
 * - Staggered sidebar and content animations
 * - Tab navigation within dashboard
 * 
 * @component CardExpansionDashboard
 * @param {CardExpansionDashboardProps} props - Component props
 * @returns {JSX.Element} Animated Atlas dashboard interface
 */
export function CardExpansionDashboard({
  cardTitle,
  isVisible,
  cardPosition,
  onClose,
  isExpanding,
  isExpanded
}: CardExpansionDashboardProps): JSX.Element | null {

  // Content mapping using exact Atlas content requirements
  const cardContentMap: Record<string, CardContentData> = {
    "What we build": {
      title: "What we build",
      content: (
        <div className="space-y-6">
          <p 
            style={{ 
              fontFamily: 'Inter, Helvetica Neue, sans-serif',
              fontSize: '1.1rem',
              color: '#2C2C2C',
              lineHeight: 1.6
            }}
          >
            We build software that helps people and companies make better real estate decisions — starting with AI that can actually interpret properties, neighborhoods, and market context.
          </p>
          
          <blockquote 
            className="p-6 rounded-2xl border-l-4"
            style={{ 
              backgroundColor: '#FEFEFE',
              borderColor: '#7A8B73',
              fontStyle: 'italic'
            }}
          >
            <p style={{ color: '#2C2C2C', fontSize: '1rem' }}>
              "Atlas is building a layer of intelligence on top of Europe's real estate markets. We gather, analyze, and simplify property data so you can make smarter decisions."
            </p>
          </blockquote>

          <p style={{ color: '#7A8B73', fontWeight: 500, fontSize: '1rem' }}>
            From property data to decision-ready insights.
          </p>
          
          <div className="space-y-4">
            <h4 style={{ color: '#2C2C2C', fontSize: '1.25rem', fontWeight: 600 }}>
              Current Tools:
            </h4>
            
            <div className="space-y-3">
              <div 
                className="p-4 rounded-lg border"
                style={{ backgroundColor: '#FEFEFE', borderColor: '#E0DDD6' }}
              >
                <div className="flex items-center space-x-3">
                  <span style={{ fontSize: '1.5rem' }}>🧠</span>
                  <div>
                    <h5 style={{ color: '#2C2C2C', fontWeight: 600 }}>Real Estate Analyzer</h5>
                    <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                      AI-generated property reports from public data.
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="p-4 rounded-lg border"
                style={{ backgroundColor: '#F5F2ED', borderColor: '#E0DDD6' }}
              >
                <div className="flex items-center space-x-3">
                  <span style={{ fontSize: '1.5rem' }}>📊</span>
                  <div>
                    <h5 style={{ color: '#2C2C2C', fontWeight: 600 }}>Comparison Dashboard</h5>
                    <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                      Compare properties side-by-side. (Coming soon)
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="p-4 rounded-lg border"
                style={{ backgroundColor: '#F5F2ED', borderColor: '#E0DDD6' }}
              >
                <div className="flex items-center space-x-3">
                  <span style={{ fontSize: '1.5rem' }}>💸</span>
                  <div>
                    <h5 style={{ color: '#2C2C2C', fontWeight: 600 }}>Fractional Toolkit</h5>
                    <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                      Infrastructure for shared real estate ownership. (Later)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "Why we exist": {
      title: "Why we exist", 
      content: (
        <div className="space-y-6">
          <p 
            style={{ 
              fontFamily: 'Inter, Helvetica Neue, sans-serif',
              fontSize: '1.1rem',
              color: '#2C2C2C',
              lineHeight: 1.6
            }}
          >
            We believe that good property decisions shouldn't depend on insider access, expensive advisors, or guesswork. That's why we're building smarter tools — to help regular people and smart teams see more clearly.
          </p>
          
          <blockquote 
            className="p-6 rounded-2xl border-l-4"
            style={{ 
              backgroundColor: '#FEFEFE',
              borderColor: '#7A8B73',
              fontStyle: 'italic'
            }}
          >
            <p style={{ color: '#2C2C2C', fontSize: '1rem' }}>
              "We started by trying to fractionalize properties. Then we hit legal walls and shifted focus — now we build tools to understand markets before we transform them."
            </p>
          </blockquote>

          <div className="space-y-4">
            <h4 style={{ color: '#2C2C2C', fontSize: '1.25rem', fontWeight: 600 }}>
              Problems we're solving:
            </h4>
            <ul className="space-y-2">
              <li style={{ color: '#6B6B6B' }}>• Data is fragmented and hard to use.</li>
              <li style={{ color: '#6B6B6B' }}>• Market analysis is often opinion-driven or paywalled.</li>
              <li style={{ color: '#6B6B6B' }}>• Fractionalization has huge potential but lacks trusted infrastructure.</li>
            </ul>
          </div>

          <div 
            className="p-6 rounded-2xl"
            style={{ backgroundColor: '#7A8B73', color: '#FEFEFE' }}
          >
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>
              Our belief: Transparency + Intelligence = Better Outcomes
            </p>
          </div>
        </div>
      )
    },
    "Who we are": {
      title: "Who we are",
      content: (
        <div className="space-y-6">
          <p 
            style={{ 
              fontFamily: 'Inter, Helvetica Neue, sans-serif',
              fontSize: '1.1rem',
              color: '#2C2C2C',
              lineHeight: 1.6
            }}
          >
            We're a multidisciplinary team of builders — combining finance, AI, product, and design — on a mission to make real estate smarter, more accessible, and more honest.
          </p>
          
          <blockquote 
            className="p-6 rounded-2xl border-l-4"
            style={{ 
              backgroundColor: '#FEFEFE',
              borderColor: '#7A8B73',
              fontStyle: 'italic'
            }}
          >
            <p style={{ color: '#2C2C2C', fontSize: '1rem' }}>
              "We're a small European team — data freaks, product nerds, and frustrated investors — trying to make real estate less murky."
            </p>
          </blockquote>

          <div className="space-y-4">
            <h4 style={{ color: '#2C2C2C', fontSize: '1.25rem', fontWeight: 600 }}>
              Our Story:
            </h4>
            <p style={{ color: '#6B6B6B', lineHeight: 1.6 }}>
              Started with the idea of fractional investing → pivoted to building trust through tools.
            </p>
            <p style={{ color: '#6B6B6B', lineHeight: 1.6 }}>
              Built from the Netherlands & Spain
            </p>
          </div>

          <div 
            className="p-6 rounded-2xl"
            style={{ backgroundColor: '#E67E22', color: '#FEFEFE' }}
          >
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>
              Link to our Operating Principles (Codex) →
            </p>
          </div>
        </div>
      )
    },
    "Our timeline": {
      title: "Our timeline",
      content: (
        <div className="space-y-6">
          <p 
            style={{ 
              fontFamily: 'Inter, Helvetica Neue, sans-serif',
              fontSize: '1.1rem',
              color: '#2C2C2C',
              lineHeight: 1.6
            }}
          >
            We build in phases. This is what we've done, what we're doing now, and what's next.
          </p>
          
          <blockquote 
            className="p-6 rounded-2xl border-l-4"
            style={{ 
              backgroundColor: '#FEFEFE',
              borderColor: '#7A8B73',
              fontStyle: 'italic'
            }}
          >
            <p style={{ color: '#2C2C2C', fontSize: '1rem' }}>
              "We build in public because we believe trust is earned through clarity."
            </p>
          </blockquote>

          <div className="space-y-4">
            <div className="space-y-4">
              <div 
                className="p-4 rounded-lg border-l-4"
                style={{ backgroundColor: '#FEFEFE', borderColor: '#7A8B73' }}
              >
                <h5 style={{ color: '#2C2C2C', fontWeight: 600 }}>Current Phase: MVP + Signal</h5>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                  Building core tools and establishing market presence
                </p>
              </div>
              
              <div 
                className="p-4 rounded-lg border-l-4"
                style={{ backgroundColor: '#F5F2ED', borderColor: '#E67E22' }}
              >
                <h5 style={{ color: '#2C2C2C', fontWeight: 600 }}>Upcoming: Validation & Revenue</h5>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                  Product-market fit and sustainable business model
                </p>
              </div>
              
              <div 
                className="p-4 rounded-lg border-l-4"
                style={{ backgroundColor: '#F5F2ED', borderColor: '#9A9A9A' }}
              >
                <h5 style={{ color: '#2C2C2C', fontWeight: 600 }}>Future: Return to Fractionalization</h5>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                  Enabling shared real estate ownership with trusted infrastructure
                </p>
              </div>
            </div>
          </div>

          <div 
            className="p-6 rounded-2xl"
            style={{ backgroundColor: '#7A8B73', color: '#FEFEFE' }}
          >
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>
              Link to full Project Log →
            </p>
          </div>
        </div>
      )
    }
  };

  const currentContent = cardContentMap[cardTitle] || cardContentMap["What we build"];

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50"
      style={{ backgroundColor: '#FAF8F5' }}
      initial={cardPosition ? {
        x: cardPosition.left,
        y: cardPosition.top,
        width: cardPosition.width,
        height: cardPosition.height,
        borderRadius: 16
      } : { opacity: 0 }}
      animate={{
        x: 0,
        y: 0,
        width: "100vw",
        height: "100vh",
        borderRadius: 0
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
      layoutId={`card-${cardTitle}`}
    >
      {/* Dashboard Content Container */}
      <div className="flex h-full">
        {/* Left Sidebar */}
        <motion.div
          className="w-64 border-r flex flex-col"
          style={{ backgroundColor: '#F5F2ED', borderColor: '#E0DDD6' }}
          initial={{ x: -264, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            delay: 0.3, 
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <div 
            className="p-4 border-b"
            style={{ borderColor: '#E0DDD6' }}
          >
            <h3 
              style={{ 
                fontFamily: 'Crimson Text, Times New Roman, serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#2C2C2C'
              }}
            >
              Atlas Dashboard
            </h3>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {[
                { label: 'Home', active: false },
                { label: 'What we build', active: cardTitle === 'What we build' },
                { label: 'Why we exist', active: cardTitle === 'Why we exist' },
                { label: 'Who we are', active: cardTitle === 'Who we are' },
                { label: 'Our timeline', active: cardTitle === 'Our timeline' },
                { label: 'Tools', active: false },
                { label: 'Project Log', active: false }
              ].map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.05), duration: 0.3 }}
                >
                  <button 
                    className="w-full text-left p-2 rounded transition-colors"
                    style={{ 
                      backgroundColor: item.active ? '#7A8B73' : 'transparent',
                      color: item.active ? '#FEFEFE' : '#2C2C2C',
                      fontFamily: 'Inter, Helvetica Neue, sans-serif'
                    }}
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Close Button */}
          <div 
            className="p-4 border-t"
            style={{ borderColor: '#E0DDD6' }}
          >
            <button
              onClick={onClose}
              className="w-full p-2 rounded transition-colors hover:bg-atlas-green hover:text-white"
              style={{ 
                color: '#6B6B6B',
                fontFamily: 'Inter, Helvetica Neue, sans-serif'
              }}
            >
              ← Back to Homepage
            </button>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <motion.div
            className="border-b px-6"
            style={{ borderColor: '#E0DDD6' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex space-x-6">
              <button 
                className="py-3 border-b-2"
                style={{ 
                  borderColor: '#7A8B73',
                  color: '#7A8B73',
                  fontFamily: 'Inter, Helvetica Neue, sans-serif',
                  fontWeight: 500
                }}
              >
                {currentContent.title}
              </button>
              <button 
                className="py-3"
                style={{ 
                  color: '#6B6B6B',
                  fontFamily: 'Inter, Helvetica Neue, sans-serif'
                }}
              >
                Overview
              </button>
              <button 
                className="py-3"
                style={{ 
                  color: '#6B6B6B',
                  fontFamily: 'Inter, Helvetica Neue, sans-serif'
                }}
              >
                Details
              </button>
            </div>
          </motion.div>

          {/* Content Panel */}
          <motion.div
            className="flex-1 p-6 overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="max-w-4xl">
              <h2 
                className="mb-6"
                style={{ 
                  fontFamily: 'Crimson Text, Times New Roman, serif',
                  fontSize: '2.25rem',
                  fontWeight: 600,
                  color: '#2C2C2C'
                }}
              >
                {currentContent.title}
              </h2>
              {currentContent.content}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 