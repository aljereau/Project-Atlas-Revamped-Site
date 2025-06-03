'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Project Log Modal Props Interface
 * @interface ProjectLogModalProps
 */
export interface ProjectLogModalProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Project Log Modal Component
 * Comprehensive build-in-public feed with filtering system and milestone content
 * Following Atlas Design System with interactive content organization
 * 
 * @component ProjectLogModal
 * @param {ProjectLogModalProps} props - Component props
 * @returns {JSX.Element} Rendered Project Log modal content
 */
export default function ProjectLogModal({ className = '' }: ProjectLogModalProps) {
  
  // Filter state management
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter categories
  const filterCategories = [
    { id: 'all', name: 'All Updates', count: 15, color: 'slate' },
    { id: 'product', name: 'Product', count: 6, color: 'atlas-green' },
    { id: 'legal', name: 'Legal', count: 2, color: 'bright-orange' },
    { id: 'fundraising', name: 'Fundraising', count: 1, color: 'atlas-green' },
    { id: 'ux-design', name: 'UX & Design', count: 3, color: 'bright-orange' },
    { id: 'learnings', name: 'Learnings', count: 2, color: 'atlas-green' },
    { id: 'team', name: 'Team', count: 1, color: 'slate' }
  ];

  // Project log entries with comprehensive build-in-public content
  const logEntries = [
    {
      id: 'entry-15',
      title: 'Phase 2 Complete: Homepage & Navigation System',
      category: 'product',
      date: '2025-01-06',
      author: 'Atlas Team',
      type: 'milestone',
      content: 'Completed comprehensive homepage with modal-first navigation system. All four navigation cards now trigger detailed modal content with smooth Framer Motion animations. Modal state management working perfectly with multiple overlapping instances.',
      tags: ['milestone', 'frontend', 'modal-system', 'navigation'],
      impact: 'high'
    },
    {
      id: 'entry-14',
      title: 'Design System Implementation Complete',
      category: 'ux-design',
      date: '2025-01-05',
      author: 'Technical Lead',
      type: 'update',
      content: 'Finalized Atlas Design System with muted beiges, sage green accents, and paper-like aesthetic. Typography system combines Crimson Text serif for headlines with Inter sans-serif for UI elements. All components now follow consistent styling patterns.',
      tags: ['design-system', 'typography', 'colors', 'components'],
      impact: 'medium'
    },
    {
      id: 'entry-13',
      title: 'Real Estate Analyzer Alpha Development Started',
      category: 'product',
      date: '2025-01-03',
      author: 'Product Team',
      type: 'announcement',
      content: 'Beginning development of our flagship Real Estate Analyzer tool. Alpha version will focus on core property analysis features including CMA, valuation modeling, and investment calculations. Target Q1 2025 for limited beta access.',
      tags: ['real-estate-analyzer', 'alpha', 'development', 'beta'],
      impact: 'high'
    },
    {
      id: 'entry-12',
      title: 'Component Architecture Decisions',
      category: 'ux-design',
      date: '2025-01-02',
      author: 'Technical Lead',
      type: 'technical',
      content: 'Established modular component architecture prioritizing transferability to existing codebase. All components built with clean props interfaces, TypeScript definitions, and clear separation of concerns. Modal system designed for maximum reusability.',
      tags: ['architecture', 'components', 'typescript', 'modularity'],
      impact: 'medium'
    },
    {
      id: 'entry-11',
      title: 'Build-in-Public Strategy Defined',
      category: 'learnings',
      date: '2025-01-01',
      author: 'Atlas Founder',
      type: 'reflection',
      content: 'Committed to full transparency in our development process. Sharing decisions, challenges, and learnings openly to build trust with our community and help other builders. Progress tracking documents and technical decisions will be public.',
      tags: ['transparency', 'community', 'strategy', 'build-in-public'],
      impact: 'medium'
    },
    {
      id: 'entry-10',
      title: 'Atlas Team Formation Complete',
      category: 'team',
      date: '2024-12-28',
      author: 'Atlas Founder',
      type: 'announcement',
      content: 'Core Atlas team now complete with expertise across real estate, software development, and market analysis. Team structure optimized for rapid, quality development while maintaining focus on user needs and market validation.',
      tags: ['team', 'hiring', 'expertise', 'structure'],
      impact: 'high'
    },
    {
      id: 'entry-09',
      title: 'Technology Stack Finalized',
      category: 'product',
      date: '2024-12-25',
      author: 'Technical Lead',
      type: 'technical',
      content: 'Selected Next.js 14+ with React 18+ and TypeScript for maximum performance and developer experience. Tailwind CSS for styling consistency. Framer Motion for fluid animations. Architecture designed for scalability and maintainability.',
      tags: ['technology', 'nextjs', 'react', 'typescript', 'tailwind'],
      impact: 'medium'
    },
    {
      id: 'entry-08',
      title: 'Initial Legal Structure Established',
      category: 'legal',
      date: '2024-12-20',
      author: 'Legal Counsel',
      type: 'update',
      content: 'Completed initial legal framework for Atlas operations. Entity structure optimized for tool development and potential future investment. Intellectual property strategy established for platform and tool suite.',
      tags: ['legal', 'entity', 'ip-strategy', 'framework'],
      impact: 'medium'
    },
    {
      id: 'entry-07',
      title: 'Market Research Phase Complete',
      category: 'learnings',
      date: '2024-12-15',
      author: 'Market Analyst',
      type: 'research',
      content: 'Comprehensive market analysis confirms significant gaps in accessible real estate intelligence tools. Professional-grade platforms often too expensive for smaller investors. Clear opportunity for democratized access to market data and analytics.',
      tags: ['market-research', 'opportunity', 'validation', 'analysis'],
      impact: 'high'
    },
    {
      id: 'entry-06',
      title: 'Atlas Vision Refined',
      category: 'product',
      date: '2024-12-10',
      author: 'Atlas Founder',
      type: 'reflection',
      content: 'Refined Atlas vision to focus on real estate intelligence democratization. Clear mission: bridge gap between complex market data and actionable insights. Building tools we wish existed as real estate professionals.',
      tags: ['vision', 'mission', 'focus', 'real-estate'],
      impact: 'high'
    }
  ];

  // Filter entries based on active filter and search term
  const filteredEntries = logEntries.filter(entry => {
    const matchesFilter = activeFilter === 'all' || entry.category === activeFilter;
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Entry type styles
  const getEntryTypeStyle = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-atlas-green text-white';
      case 'announcement':
        return 'bg-bright-orange text-white';
      case 'technical':
        return 'bg-soft-beige text-slate-700';
      case 'reflection':
        return 'bg-atlas-green/10 text-atlas-green-dark border border-atlas-green/30';
      case 'research':
        return 'bg-bright-orange/10 text-orange-hover border border-bright-orange/30';
      default:
        return 'bg-paper-cream text-slate-600';
    }
  };

  // Impact level styling
  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-atlas-green font-medium';
      case 'medium':
        return 'text-bright-orange font-medium';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <motion.div 
      className={`max-w-5xl mx-auto p-6 ${className}`}
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
          Project Log
        </h1>
        <p className="font-sans text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Follow our build-in-public journey. Transparent updates on development progress, decisions, and learnings as we create Atlas tools.
        </p>
      </motion.div>

      {/* Filters & Search */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className="bg-paper-white rounded-xl p-6 border border-soft-beige/20 shadow-sm">
          
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search updates, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-soft-beige rounded-lg font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-atlas-green focus:ring-2 focus:ring-atlas-green/20"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-3">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 ${
                  activeFilter === category.id
                    ? 'bg-atlas-green text-white shadow-md'
                    : 'bg-soft-beige text-slate-600 hover:bg-atlas-green/10 hover:text-atlas-green'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Project Timeline */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {filteredEntries.map((entry, index) => (
              <motion.article
                key={entry.id}
                className="bg-paper-white rounded-xl p-6 border border-soft-beige/20 shadow-sm hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                layout
              >
                <div className="space-y-4">
                  
                  {/* Entry Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-semibold text-slate-900">
                        {entry.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-500">{entry.date}</span>
                        <span className="text-slate-500">by {entry.author}</span>
                        <span className={getImpactStyle(entry.impact)}>
                          {entry.impact} impact
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEntryTypeStyle(entry.type)}`}>
                        {entry.type}
                      </span>
                    </div>
                  </div>

                  {/* Entry Content */}
                  <p className="font-sans text-slate-700 leading-relaxed">
                    {entry.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-soft-beige/50">
                    {entry.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-atlas-green/10 text-atlas-green text-xs font-medium rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {/* No Results State */}
          {filteredEntries.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-sans text-slate-500 text-lg">
                No updates found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchTerm('');
                }}
                className="mt-4 text-atlas-green hover:text-atlas-green-dark font-sans font-medium"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Subscribe to Updates CTA */}
      <motion.div 
        className="text-center bg-atlas-green/5 rounded-2xl p-8 border border-atlas-green/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        <h3 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
          Stay in the Loop
        </h3>
        <p className="font-sans text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
          Get notified when we publish new updates, milestones, and learnings. 
          Join our community of builders and real estate professionals following our journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-atlas-green hover:bg-atlas-green-dark text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
            Subscribe to Updates
          </button>
          <button className="border-2 border-bright-orange text-bright-orange hover:bg-bright-orange hover:text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200">
            Join Community
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 