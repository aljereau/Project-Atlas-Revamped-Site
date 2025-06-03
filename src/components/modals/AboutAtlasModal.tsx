/**
 * About Atlas Modal Component - Atlas Lab
 * Company information, team, principles, and thesis
 * 
 * @component AboutAtlasModal
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} About Atlas modal
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface AboutAtlasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Founder {
  name: string;
  role: string;
  philosophy: string;
  askAbout?: string;
}

const founders: Founder[] = [
  {
    name: 'Aljereau Marten',
    role: 'Structure & Strategy',
    philosophy: 'No buzzwords, just working code.',
    askAbout: 'Product strategy & market intelligence'
  },
  {
    name: 'Engineering Lead',
    role: 'Engineering',
    philosophy: 'Build fast, test faster.',
    askAbout: 'AI implementation & data pipelines'
  },
  {
    name: 'Product Lead',
    role: 'Product',
    philosophy: 'User problems first, features second.',
    askAbout: 'UX design & user research'
  }
];

const timelinePhases = [
  {
    year: '2024',
    title: 'Formed, explored fractionalization',
    description: 'Started with tokenized property ownership vision'
  },
  {
    year: '2025',
    title: 'Pivoted to Intelligence Layer',
    description: 'Building tools & trust before transformation'
  },
  {
    year: '2026+',
    title: 'Launching smarter investment products',
    description: 'Return to fractionalization with proven infrastructure'
  }
];

export default function AboutAtlasModal({ 
  isOpen, 
  onClose 
}: AboutAtlasModalProps): JSX.Element {
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
              About Atlas
            </h1>
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
          <div className="max-w-4xl space-y-12">
            
            {/* Who We Are */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 
                className="mb-6"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#2C2C2C'
                }}
              >
                Who We Are
              </h2>
              
              <Card className="p-8">
                <p 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.125rem',
                    color: '#2C2C2C',
                    lineHeight: 1.6,
                    fontWeight: 500
                  }}
                >
                  Atlas is an evolving product lab focused on real estate intelligence.
                </p>
                <p 
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}
                >
                  We're not here to "disrupt" — we're here to build better tools, grounded in data, 
                  for people who actually want to understand property.
                </p>
              </Card>
            </motion.div>

            {/* The Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 
                className="mb-6"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#2C2C2C'
                }}
              >
                The Team
              </h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                {founders.map((founder, index) => (
                  <Card key={founder.name} className="p-6 text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                      style={{ backgroundColor: '#E0DDD6' }}
                    ></div>
                    <h3 
                      className="mb-1"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#2C2C2C'
                      }}
                    >
                      {founder.name}
                    </h3>
                    <p 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#7A8B73',
                        fontWeight: 500
                      }}
                    >
                      {founder.role}
                    </p>
                    <p 
                      className="mb-3"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#6B6B6B',
                        fontStyle: 'italic',
                        lineHeight: 1.4
                      }}
                    >
                      "{founder.philosophy}"
                    </p>
                    {founder.askAbout && (
                      <p 
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          color: '#9B9B9B'
                        }}
                      >
                        Ask me about: {founder.askAbout}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <p 
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#9B9B9B',
                    fontStyle: 'italic'
                  }}
                >
                  Built from the Netherlands & Spain
                </p>
              </div>
            </motion.div>

            {/* Our Principles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 
                className="mb-6"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#2C2C2C'
                }}
              >
                Our Principles
              </h2>
              
              <Card className="p-8">
                <p 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}
                >
                  We believe in fast decisions, no sacred cows, and useful output over fancy ideas.
                </p>
                <Button variant="outline" size="sm">
                  View the Codex →
                </Button>
              </Card>
            </motion.div>

            {/* Our Thesis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h2 
                className="mb-6"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#2C2C2C'
                }}
              >
                Our Thesis
              </h2>
              
              <Card className="p-8">
                <div className="space-y-4">
                  <p 
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem',
                      color: '#6B6B6B',
                      lineHeight: 1.6
                    }}
                  >
                    Real estate has become one of the most opaque and inefficient markets in Europe.
                  </p>
                  <p 
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem',
                      color: '#6B6B6B',
                      lineHeight: 1.6
                    }}
                  >
                    Atlas exists to make it readable — not just by humans, but by AI.
                  </p>
                  <p 
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem',
                      color: '#6B6B6B',
                      lineHeight: 1.6
                    }}
                  >
                    We believe in building tools that lower barriers to insight, not just ownership.
                  </p>
                  <p 
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem',
                      color: '#6B6B6B',
                      lineHeight: 1.6
                    }}
                  >
                    Over time, we'll explore ways to fractionalize and simplify investment access — 
                    but first, we need clarity. That's what we're building now.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Our Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h2 
                className="mb-6"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#2C2C2C'
                }}
              >
                Our Timeline
              </h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                {timelinePhases.map((phase, index) => (
                  <Card key={phase.year} className="p-6 text-center">
                    <h3 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'DM Serif Display, serif',
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: '#7A8B73'
                      }}
                    >
                      {phase.year}
                    </h3>
                    <h4 
                      className="mb-2"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#2C2C2C'
                      }}
                    >
                      {phase.title}
                    </h4>
                    <p 
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#6B6B6B',
                        lineHeight: 1.4
                      }}
                    >
                      {phase.description}
                    </p>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 