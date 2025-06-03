/**
 * Atlas Tools Modal Component - Atlas Lab
 * Smart utilities for real estate intelligence
 * Displays current tools and upcoming features
 * 
 * @component AtlasToolsModal
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} Atlas tools modal
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface AtlasToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Tool {
  id: string;
  title: string;
  description: string;
  forWho: string;
  status: 'live' | 'coming-soon' | 'future';
  icon: string;
  actions: string[];
}

const tools: Tool[] = [
  {
    id: 'real-estate-analyzer',
    title: '🔍 Real Estate Analyzer',
    description: 'Input a property link, get a clean AI-generated investment report.',
    forWho: 'Buyers, investors, advisors',
    status: 'live',
    icon: '🔍',
    actions: ['Launch Tool', 'How it works']
  },
  {
    id: 'comparison-tool',
    title: '🆕 Comparison Tool',
    description: 'Side-by-side AI breakdown of 3 properties.',
    forWho: 'Buyers choosing between listings',
    status: 'coming-soon',
    icon: '🆕',
    actions: ['Join Waitlist']
  }
];

const futureTools = [
  {
    id: 'neighborhood-risk',
    title: '🧾 Neighborhood Risk Report',
    description: 'Pollution, crime, air quality, and environmental risk analysis.',
    status: 'future'
  },
  {
    id: 'ai-chat',
    title: '💬 AI Chat Assistant',
    description: 'Ask context-aware questions about any listing.',
    status: 'future'
  },
  {
    id: 'roi-planner',
    title: '📈 Dynamic ROI Planner',
    description: 'Customize mortgage, taxes, rent to model returns.',
    status: 'future'
  }
];

export default function AtlasToolsModal({ 
  isOpen, 
  onClose 
}: AtlasToolsModalProps): JSX.Element {
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
              Atlas Tools
            </h1>
            <p 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.125rem',
                color: '#6B6B6B',
                fontWeight: 500
              }}
            >
              Smart utilities for real estate thinking — built in-house, shared with the world.
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl space-y-8">
            
            {/* Current Tools */}
            <div>
              <h2 
                className="mb-6"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#2C2C2C'
                }}
              >
                Current Tools
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{tool.icon}</span>
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
                              {tool.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: tool.status === 'live' ? '#7A8B73' : '#E67E22',
                                  color: '#FFFFFF',
                                  fontFamily: 'Inter, sans-serif'
                                }}
                              >
                                {tool.status === 'live' ? '✅ Live' : '🔜 Coming soon'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p 
                        className="mb-3"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.95rem',
                          color: '#6B6B6B',
                          lineHeight: 1.6
                        }}
                      >
                        {tool.description}
                      </p>

                      <p 
                        className="mb-4"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem',
                          color: '#9B9B9B',
                          fontWeight: 500
                        }}
                      >
                        <strong>For:</strong> {tool.forWho}
                      </p>

                      <div className="flex items-center space-x-3">
                        {tool.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={actionIndex === 0 ? 'primary' : 'outline'}
                            size="sm"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Future Tools */}
            <div>
              <h2 
                className="mb-6"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#2C2C2C'
                }}
              >
                Coming Next
              </h2>
              
              <div className="space-y-4">
                {futureTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 
                            className="mb-1"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: '#2C2C2C'
                            }}
                          >
                            {tool.title}
                          </h3>
                          <p 
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.875rem',
                              color: '#6B6B6B'
                            }}
                          >
                            {tool.description}
                          </p>
                        </div>
                        <span
                          className="px-3 py-1 rounded text-xs font-medium whitespace-nowrap ml-4"
                          style={{
                            backgroundColor: '#E0DDD6',
                            color: '#6B6B6B',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          In Pipeline
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center py-8">
              <Card className="p-8">
                <h3 
                  className="mb-3"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#2C2C2C'
                  }}
                >
                  Need something specific?
                </h3>
                <p 
                  className="mb-6"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}
                >
                  Got a real estate challenge that needs smarter tools? Tell us about it — your case could shape our roadmap.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="primary">
                    Suggest a Tool
                  </Button>
                  <Button variant="outline">
                    Request Feature
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 