/**
 * Get Involved Modal Component - Atlas Lab
 * Subscription, contact, and collaboration options
 * Multiple ways for users to engage with Atlas
 * 
 * @component GetInvolvedModal
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} Get involved modal
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface GetInvolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  tags: string[];
}

export default function GetInvolvedModal({ 
  isOpen, 
  onClose 
}: GetInvolvedModalProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    tags: []
  });

  const contactTags = [
    { id: 'investor', label: 'Investor' },
    { id: 'collaboration', label: 'Collaboration' },
    { id: 'feedback', label: 'Product Feedback' },
    { id: 'legal', label: 'Legal Help' }
  ];

  const handleTagToggle = (tagId: string) => {
    setContactForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) 
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId]
    }));
  };

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
              Get Involved
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
          <div className="max-w-4xl space-y-8">
            
            {/* Subscribe for Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#2C2C2C'
                  }}
                >
                  Subscribe for Updates
                </h2>
                
                <p 
                  className="mb-6"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}
                >
                  Want to follow our builds, insights, and drops?
                  <br />
                  Subscribe to get sharp, occasional updates from the lab.
                </p>

                <div className="flex items-center space-x-3 mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-lg border"
                    style={{
                      borderColor: '#E0DDD6',
                      backgroundColor: '#FFFFFF',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem'
                    }}
                  />
                  <Button variant="primary">
                    Subscribe
                  </Button>
                </div>

                <Button variant="outline" size="sm">
                  See an example →
                </Button>
              </Card>
            </motion.div>

            {/* Talk to the Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="p-8">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#2C2C2C'
                  }}
                >
                  Talk to the Team
                </h2>
                
                <p 
                  className="mb-6"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}
                >
                  Have a question, idea, or use case we should hear about?
                  <br />
                  Drop us a line — we read every message.
                </p>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="px-4 py-3 rounded-lg border"
                      style={{
                        borderColor: '#E0DDD6',
                        backgroundColor: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.95rem'
                      }}
                    />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="px-4 py-3 rounded-lg border"
                      style={{
                        borderColor: '#E0DDD6',
                        backgroundColor: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="What's on your mind?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border resize-none"
                    style={{
                      borderColor: '#E0DDD6',
                      backgroundColor: '#FFFFFF',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem'
                    }}
                  />

                  <div>
                    <p 
                      className="mb-3"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#6B6B6B',
                        fontWeight: 500
                      }}
                    >
                      Tags (optional):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {contactTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => handleTagToggle(tag.id)}
                          className="px-3 py-1 rounded-full text-sm transition-all duration-200"
                          style={{
                            backgroundColor: contactForm.tags.includes(tag.id) ? '#7A8B73' : '#E0DDD6',
                            color: contactForm.tags.includes(tag.id) ? '#FFFFFF' : '#6B6B6B',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500
                          }}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button variant="primary">
                    Send Message
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Submit a Use Case */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-8">
                <h2 
                  className="mb-4"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#2C2C2C'
                  }}
                >
                  Submit a Use Case
                </h2>
                
                <p 
                  className="mb-6"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}
                >
                  Got a real estate challenge that needs smarter tools?
                  <br />
                  Tell us about it — your case could shape our roadmap.
                </p>

                <Button variant="primary">
                  Suggest a use case →
                </Button>
              </Card>
            </motion.div>

            {/* Optional Extras */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <h3 
                    className="mb-3"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#2C2C2C'
                    }}
                  >
                    🧠 Feature Request?
                  </h3>
                  <p 
                    className="mb-4"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#6B6B6B',
                      lineHeight: 1.5
                    }}
                  >
                    Something you wish our tools could do?
                  </p>
                  <Button variant="outline" size="sm">
                    Submit a feature request →
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 
                    className="mb-3"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#2C2C2C'
                    }}
                  >
                    🤝 Partner With Us?
                  </h3>
                  <p 
                    className="mb-4"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#6B6B6B',
                      lineHeight: 1.5
                    }}
                  >
                    Think your tech or data can plug into Atlas?
                  </p>
                  <Button variant="outline" size="sm">
                    Explore partnerships →
                  </Button>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 