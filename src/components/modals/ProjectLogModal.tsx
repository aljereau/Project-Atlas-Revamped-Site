/**
 * Project Log Modal Component - Atlas Lab
 * Open lab notebook showing project journey and updates
 * Displays development progress, decisions, and learnings
 * 
 * @component ProjectLogModal
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} Project log modal
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ProjectLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  category: string;
}

const sampleEntries: LogEntry[] = [
  {
    id: '1',
    title: 'Why we paused fractionalization (for now)',
    excerpt: 'We set out to tokenize property ownership, but legal friction + lack of capital shifted our attention to something more urgent: trust and data. This post explains our pivot.',
    date: 'May 2025',
    tags: ['Legal', 'Strategy'],
    category: '📚'
  },
  {
    id: '2',
    title: 'Building our first AI property analyzer',
    excerpt: 'From scraped listings to structured insights — how we built our property intelligence engine and what we learned about European real estate data.',
    date: 'April 2025',
    tags: ['Product', 'AI'],
    category: '📦'
  },
  {
    id: '3',
    title: 'Designing for trust in proptech',
    excerpt: 'Real estate decisions involve life savings. Here\'s how we\'re building transparency into every tool we ship.',
    date: 'March 2025',
    tags: ['UX & Design', 'Product'],
    category: '🎨'
  }
];

const filterCategories = [
  { id: 'all', label: 'All Updates', icon: '📋' },
  { id: 'product', label: 'Product', icon: '📦' },
  { id: 'legal', label: 'Legal', icon: '🔐' },
  { id: 'fundraising', label: 'Fundraising', icon: '💰' },
  { id: 'design', label: 'UX & Design', icon: '🎨' },
  { id: 'learnings', label: 'Learnings', icon: '📚' },
  { id: 'team', label: 'Team', icon: '🧑‍🤝‍🧑' }
];

export default function ProjectLogModal({ 
  isOpen, 
  onClose 
}: ProjectLogModalProps): JSX.Element {
  const [activeFilter, setActiveFilter] = React.useState('all');

  if (!isOpen) return <></>;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Content */}
      <motion.div
        className="relative ml-auto h-full overflow-hidden"
        style={{ 
          width: '75%',
          backgroundColor: '#FAF8F5',
          borderLeft: '1px solid #E0DDD6'
        }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-8 border-b"
          style={{ borderColor: '#E0DDD6' }}
        >
          <div>
            <h1 
              className="mb-2"
              style={{ 
                fontFamily: 'DM Serif Display, serif',
                fontSize: '2rem',
                fontWeight: 400,
                color: '#2C2C2C'
              }}
            >
              Project Log
            </h1>
            <p 
              className="mb-1"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.125rem',
                color: '#6B6B6B',
                fontWeight: 500
              }}
            >
              Follow our journey as we build tools for real estate intelligence.
            </p>
            <p 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#9B9B9B'
              }}
            >
              From data bugs to product wins — everything's here.
            </p>
          </div>

          <div className="min-w-[80px]">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div 
          className="flex items-center space-x-1 p-6 border-b overflow-x-auto"
          style={{ borderColor: '#E0DDD6' }}
        >
          {filterCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 whitespace-nowrap
              `}
              style={{
                backgroundColor: activeFilter === category.id ? '#7A8B73' : 'transparent',
                color: activeFilter === category.id ? '#FFFFFF' : '#6B6B6B',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl space-y-6">
            {sampleEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card hoverable className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{entry.category}</span>
                      <div>
                        <h3 
                          className="mb-1"
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#2C2C2C'
                          }}
                        >
                          {entry.title}
                        </h3>
                        <p 
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.875rem',
                            color: '#9B9B9B'
                          }}
                        >
                          {entry.date}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p 
                    className="mb-4"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      color: '#6B6B6B',
                      lineHeight: 1.6
                    }}
                  >
                    {entry.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: '#E0DDD6',
                            color: '#6B6B6B',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State Message */}
          <div className="text-center py-12">
            <p 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#9B9B9B'
              }}
            >
              More updates coming soon. We build in public — every decision, every pivot, every win.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 