'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Atlas Tools Modal Props Interface
 * @interface AtlasToolsModalProps
 */
export interface AtlasToolsModalProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Atlas Tools Modal Component
 * Comprehensive modal displaying Real Estate Analyzer and future tool architecture
 * Following Atlas Design System with modular structure for easy future tool integration
 * 
 * @component AtlasToolsModal
 * @param {AtlasToolsModalProps} props - Component props
 * @returns {JSX.Element} Rendered Atlas Tools modal content
 */
export default function AtlasToolsModal({ className = '' }: AtlasToolsModalProps) {
  
  // Real Estate Analyzer tool data
  const realEstateAnalyzer = {
    id: 'real-estate-analyzer',
    name: 'Real Estate Analyzer',
    tagline: 'Comprehensive Property Analysis Platform',
    status: 'launching-q1-2025',
    description: 'Professional-grade property analysis and market intelligence platform designed to democratize access to comprehensive real estate data and insights.',
    features: [
      {
        category: 'Property Analysis',
        items: [
          'Comparative Market Analysis (CMA)',
          'Property valuation modeling',
          'Investment return calculations',
          'Risk assessment metrics'
        ]
      },
      {
        category: 'Market Intelligence',
        items: [
          'Local market trends and patterns',
          'Neighborhood demographic analysis',
          'Price appreciation forecasting',
          'Market cycle indicators'
        ]
      },
      {
        category: 'Financial Modeling',
        items: [
          'Cash flow projections',
          'ROI and IRR calculations',
          'Scenario planning tools',
          'Tax impact analysis'
        ]
      },
      {
        category: 'Data Integration',
        items: [
          'MLS data aggregation',
          'Public records integration',
          'Market data feeds',
          'Custom data imports'
        ]
      }
    ],
    launchTimeline: [
      {
        phase: 'Alpha Release',
        timeframe: 'Q1 2025',
        description: 'Core property analysis features with limited beta user access',
        status: 'in-progress'
      },
      {
        phase: 'Beta Launch',
        timeframe: 'Q2 2025',
        description: 'Expanded feature set with community feedback integration',
        status: 'planned'
      },
      {
        phase: 'Public Release',
        timeframe: 'Q3 2025',
        description: 'Full platform launch with comprehensive tool suite',
        status: 'planned'
      }
    ]
  };

  // Future tools in development
  const futureTools = [
    {
      id: 'market-scanner',
      name: 'Market Scanner',
      description: 'Automated market opportunity detection and alert system for emerging investment opportunities.',
      status: 'concept',
      expectedLaunch: 'Q4 2025',
      category: 'Market Intelligence'
    },
    {
      id: 'portfolio-tracker',
      name: 'Portfolio Tracker',
      description: 'Comprehensive real estate portfolio management and performance tracking platform.',
      status: 'research',
      expectedLaunch: 'Q1 2026',
      category: 'Portfolio Management'
    },
    {
      id: 'deal-evaluator',
      name: 'Deal Evaluator',
      description: 'Rapid deal analysis and comparison tool for investment decision support.',
      status: 'concept',
      expectedLaunch: 'Q2 2026',
      category: 'Investment Analysis'
    }
  ];

  // Tool categories for organization
  const toolCategories = [
    {
      name: 'Analysis & Valuation',
      description: 'Property analysis, valuation, and investment calculation tools',
      tools: ['Real Estate Analyzer', 'Deal Evaluator'],
      color: 'atlas-green'
    },
    {
      name: 'Market Intelligence', 
      description: 'Market research, trend analysis, and opportunity detection',
      tools: ['Market Scanner'],
      color: 'bright-orange'
    },
    {
      name: 'Portfolio Management',
      description: 'Portfolio tracking, performance monitoring, and optimization',
      tools: ['Portfolio Tracker'],
      color: 'atlas-green'
    }
  ];

  return (
    <motion.div 
      className={`max-w-6xl mx-auto p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900 mb-4">
          Atlas Tools
        </h1>
        <p className="font-sans text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Professional-grade real estate intelligence tools designed to democratize access to market data and insights.
        </p>
      </motion.div>

      {/* Real Estate Analyzer - Featured Tool */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="bg-gradient-to-br from-atlas-green/5 to-atlas-green/10 rounded-3xl p-8 border-2 border-atlas-green/20">
          <div className="grid gap-8 lg:gap-12">
            
            {/* Tool Header */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-atlas-green text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                🚀 Launching Q1 2025
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                {realEstateAnalyzer.name}
              </h2>
              <p className="font-sans text-xl text-atlas-green-dark font-medium mb-4">
                {realEstateAnalyzer.tagline}
              </p>
              <p className="font-sans text-lg text-slate-700 leading-relaxed max-w-3xl">
                {realEstateAnalyzer.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {realEstateAnalyzer.features.map((featureGroup, index) => (
                <motion.div
                  key={featureGroup.category}
                  className="bg-paper-white rounded-xl p-6 border border-soft-beige/30 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
                >
                  <h3 className="font-sans text-lg font-semibold text-slate-900 mb-4">
                    {featureGroup.category}
                  </h3>
                  <ul className="space-y-2">
                    {featureGroup.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="font-sans text-sm text-slate-600 flex items-start">
                        <span className="text-atlas-green mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Launch Timeline */}
            <div className="bg-paper-white rounded-xl p-6 border border-soft-beige/30">
              <h3 className="font-sans text-xl font-semibold text-slate-900 mb-6 text-center">
                Launch Timeline
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {realEstateAnalyzer.launchTimeline.map((phase, index) => (
                  <div key={phase.phase} className="text-center space-y-3">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                      phase.status === 'in-progress' ? 'bg-atlas-green text-white' : 
                      phase.status === 'planned' ? 'bg-soft-beige text-slate-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-slate-900">
                        {phase.phase}
                      </h4>
                      <p className="font-sans text-sm font-medium text-atlas-green">
                        {phase.timeframe}
                      </p>
                      <p className="font-sans text-xs text-slate-600 mt-2">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <button className="bg-atlas-green hover:bg-atlas-green-dark text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md mr-4">
                Join Beta Waitlist
              </button>
              <button className="border-2 border-atlas-green text-atlas-green hover:bg-atlas-green hover:text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tool Categories Overview */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <h2 className="font-serif text-3xl font-semibold text-slate-900 mb-8 text-center">
          Tool Categories
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {toolCategories.map((category, index) => (
            <motion.div
              key={category.name}
              className="bg-paper-white rounded-xl p-6 border border-soft-beige/20 shadow-sm hover:shadow-md transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + (index * 0.1), ease: "easeOut" }}
            >
              <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                {category.name}
              </h3>
              <p className="font-sans text-sm text-slate-600 mb-4 leading-relaxed">
                {category.description}
              </p>
              <div className="space-y-2">
                {category.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="flex items-center">
                    <span className="text-atlas-green text-sm mr-2">▸</span>
                    <span className="font-sans text-sm text-slate-700">{tool}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Future Tools Pipeline */}
      <motion.section 
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <h2 className="font-serif text-3xl font-semibold text-slate-900 mb-8 text-center">
          Coming Soon
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          {futureTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="bg-paper-white rounded-xl p-6 border border-soft-beige/20 shadow-sm hover:shadow-md transition-all duration-200 opacity-75 hover:opacity-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-lg font-semibold text-slate-900">
                      {tool.name}
                    </h3>
                    <span className="text-xs font-medium text-slate-500 bg-soft-beige px-2 py-1 rounded-full">
                      {tool.status}
                    </span>
                  </div>
                  <p className="font-sans text-sm font-medium text-atlas-green">
                    {tool.category}
                  </p>
                </div>
                
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {tool.description}
                </p>
                
                <div className="pt-2 border-t border-soft-beige/50">
                  <p className="font-sans text-xs text-slate-500">
                    Expected Launch: <span className="font-medium">{tool.expectedLaunch}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Get Updates CTA */}
      <motion.div 
        className="text-center bg-bright-orange/5 rounded-2xl p-8 border border-bright-orange/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        <h3 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
          Stay Updated
        </h3>
        <p className="font-sans text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
          Be the first to know when new tools launch and get early access to beta features. 
          Join our community of real estate professionals building the future together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-bright-orange hover:bg-orange-hover text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
            Join Updates List
          </button>
          <button className="border-2 border-atlas-green text-atlas-green hover:bg-atlas-green hover:text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200">
            View Project Log
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 