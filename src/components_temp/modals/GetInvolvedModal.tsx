'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Get Involved Modal Props Interface
 * @interface GetInvolvedModalProps
 */
export interface GetInvolvedModalProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get Involved Modal Component
 * Multi-persona contact and engagement system for different user types
 * Following Atlas Design System with comprehensive engagement options
 * 
 * @component GetInvolvedModal
 * @param {GetInvolvedModalProps} props - Component props
 * @returns {JSX.Element} Rendered Get Involved modal content
 */
export default function GetInvolvedModal({ className = '' }: GetInvolvedModalProps) {
  
  // Active persona state
  const [activePersona, setActivePersona] = useState<string>('general');

  // Persona types with comprehensive engagement options
  const personaTypes = [
    {
      id: 'general',
      name: 'General Interest',
      description: 'Learn more about Atlas and stay updated',
      icon: '👋',
      color: 'atlas-green'
    },
    {
      id: 'investor',
      name: 'Investors',
      description: 'Investment opportunities and partnership',
      icon: '💼',
      color: 'bright-orange'
    },
    {
      id: 'company',
      name: 'Companies',
      description: 'Enterprise partnerships and collaboration',
      icon: '🏢',
      color: 'atlas-green'
    },
    {
      id: 'user',
      name: 'Users',
      description: 'Tool access, feedback, and support',
      icon: '👤',
      color: 'bright-orange'
    },
    {
      id: 'developer',
      name: 'Developers',
      description: 'API access, integrations, and technical collaboration',
      icon: '⚡',
      color: 'atlas-green'
    },
    {
      id: 'feature',
      name: 'Feature Requests',
      description: 'Suggest new features and improvements',
      icon: '💡',
      color: 'bright-orange'
    }
  ];

  // Persona-specific content
  const personaContent = {
    general: {
      title: 'Welcome to Atlas Community',
      subtitle: 'Join our journey building real estate intelligence tools',
      features: [
        'Stay updated on new tool releases and features',
        'Access to exclusive content and insights',
        'Participate in product feedback sessions',
        'Connect with other real estate professionals'
      ],
      ctaText: 'Join Community',
      ctaSecondary: 'Subscribe to Updates'
    },
    investor: {
      title: 'Investment Opportunities',
      subtitle: 'Partner with us in democratizing real estate intelligence',
      features: [
        'Detailed business model and growth projections',
        'Market analysis and competitive positioning',
        'Product roadmap and development milestones',
        'Direct access to founders and key metrics'
      ],
      ctaText: 'Request Investment Information',
      ctaSecondary: 'Schedule Meeting'
    },
    company: {
      title: 'Enterprise Partnerships',
      subtitle: 'Integrate Atlas tools into your platform or workflow',
      features: [
        'White-label solutions and custom integrations',
        'Bulk licensing and enterprise pricing',
        'API access and technical documentation',
        'Dedicated support and training resources'
      ],
      ctaText: 'Discuss Partnership',
      ctaSecondary: 'View Enterprise Solutions'
    },
    user: {
      title: 'User Community',
      subtitle: 'Get the most out of Atlas tools and share feedback',
      features: [
        'Early access to new tools and features',
        'Direct feedback channel to development team',
        'User training and best practices sharing',
        'Community forum and peer support'
      ],
      ctaText: 'Join Beta Program',
      ctaSecondary: 'Provide Feedback'
    },
    developer: {
      title: 'Developer Resources',
      subtitle: 'Build on Atlas infrastructure and integrate our tools',
      features: [
        'Comprehensive API documentation and SDKs',
        'Technical support and developer community',
        'Early access to new APIs and endpoints',
        'Partnership opportunities for integrations'
      ],
      ctaText: 'Access Developer Portal',
      ctaSecondary: 'View API Documentation'
    },
    feature: {
      title: 'Feature Requests',
      subtitle: 'Help shape the future of Atlas tools',
      features: [
        'Submit detailed feature requests and use cases',
        'Vote on proposed features and enhancements',
        'Participate in feature design and feedback sessions',
        'Get updates on feature development progress'
      ],
      ctaText: 'Submit Feature Request',
      ctaSecondary: 'View Roadmap'
    }
  };

  // Contact methods
  const contactMethods = [
    {
      method: 'Email',
      value: 'hello@atlas.tools',
      description: 'General inquiries and support',
      icon: '📧'
    },
    {
      method: 'LinkedIn',
      value: '/company/atlas-tools',
      description: 'Professional connections and updates',
      icon: '💼'
    },
    {
      method: 'GitHub',
      value: '/atlas-tools',
      description: 'Open source projects and technical discussions',
      icon: '⚡'
    },
    {
      method: 'Community',
      value: 'Join Discord',
      description: 'Real-time chat with team and community',
      icon: '💬'
    }
  ];

  // Get current persona content
  const currentContent = personaContent[activePersona as keyof typeof personaContent];

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
          Get Involved
        </h1>
        <p className="font-sans text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Whether you're an investor, company, user, or developer - we'd love to connect and learn from your experience.
        </p>
      </motion.div>

      {/* Persona Selection */}
      <motion.section 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-6 text-center">
          How would you like to get involved?
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personaTypes.map((persona, index) => (
            <motion.button
              key={persona.id}
              onClick={() => setActivePersona(persona.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                activePersona === persona.id
                  ? 'border-atlas-green bg-atlas-green/5 shadow-md'
                  : 'border-soft-beige bg-paper-white hover:border-atlas-green/30 hover:bg-atlas-green/5'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{persona.icon}</span>
                  <h3 className="font-sans text-lg font-semibold text-slate-900">
                    {persona.name}
                  </h3>
                </div>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {persona.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Selected Persona Content */}
      <motion.section 
        className="mb-12"
        key={activePersona}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="bg-paper-white rounded-2xl p-8 border border-soft-beige/20 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Content Section */}
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-3xl font-semibold text-slate-900 mb-4">
                  {currentContent.title}
                </h3>
                <p className="font-sans text-lg text-slate-600 leading-relaxed">
                  {currentContent.subtitle}
                </p>
              </div>

              {/* Features/Benefits */}
              <div className="space-y-3">
                {currentContent.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-atlas-green text-sm mt-1">✓</span>
                    <p className="font-sans text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-atlas-green hover:bg-atlas-green-dark text-white font-sans font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
                  {currentContent.ctaText}
                </button>
                <button className="border-2 border-atlas-green text-atlas-green hover:bg-atlas-green hover:text-white font-sans font-medium px-6 py-3 rounded-lg transition-colors duration-200">
                  {currentContent.ctaSecondary}
                </button>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-soft-beige/30 rounded-xl p-6">
              <h4 className="font-sans text-lg font-semibold text-slate-900 mb-4">
                Quick Contact
              </h4>
              
              <form className="space-y-4">
                <div>
                  <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-soft-beige rounded-lg font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-atlas-green focus:ring-2 focus:ring-atlas-green/20"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-soft-beige rounded-lg font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-atlas-green focus:ring-2 focus:ring-atlas-green/20"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your interest in Atlas..."
                    className="w-full px-4 py-2 border border-soft-beige rounded-lg font-sans text-slate-700 placeholder-slate-400 focus:outline-none focus:border-atlas-green focus:ring-2 focus:ring-atlas-green/20 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-bright-orange hover:bg-orange-hover text-white font-sans font-medium py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Methods */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <h3 className="font-serif text-2xl font-semibold text-slate-900 mb-6 text-center">
          Other Ways to Connect
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((contact, index) => (
            <motion.div
              key={contact.method}
              className="bg-paper-white rounded-xl p-6 border border-soft-beige/20 shadow-sm hover:shadow-md transition-all duration-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + (index * 0.1), ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="space-y-3">
                <span className="text-3xl">{contact.icon}</span>
                <div>
                  <h4 className="font-sans text-lg font-semibold text-slate-900">
                    {contact.method}
                  </h4>
                  <p className="font-sans text-sm font-medium text-atlas-green">
                    {contact.value}
                  </p>
                  <p className="font-sans text-xs text-slate-600 mt-2">
                    {contact.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Community CTA */}
      <motion.div 
        className="text-center bg-gradient-to-br from-atlas-green/5 to-bright-orange/5 rounded-2xl p-8 border border-atlas-green/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        <h3 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
          Join the Atlas Community
        </h3>
        <p className="font-sans text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
          Be part of a growing community of real estate professionals, developers, and investors 
          working together to build the future of real estate intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-atlas-green hover:bg-atlas-green-dark text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
            Join Discord Community
          </button>
          <button className="border-2 border-bright-orange text-bright-orange hover:bg-bright-orange hover:text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200">
            Follow on LinkedIn
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 