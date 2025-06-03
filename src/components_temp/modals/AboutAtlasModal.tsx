'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * About Atlas Modal Props Interface
 * @interface AboutAtlasModalProps
 */
export interface AboutAtlasModalProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * About Atlas Modal Component
 * Comprehensive modal displaying team information, company mission, thesis, and operating principles
 * Following Atlas Design System with rich content presentation
 * 
 * @component AboutAtlasModal
 * @param {AboutAtlasModalProps} props - Component props
 * @returns {JSX.Element} Rendered About Atlas modal content
 */
export default function AboutAtlasModal({ className = '' }: AboutAtlasModalProps) {
  
  // Team member data with comprehensive information
  const teamMembers = [
    {
      id: 'founder-1',
      name: 'Atlas Founder',
      role: 'Chief Executive Officer',
      bio: 'Real estate professional with 10+ years building tools for market analysis and investment decision-making. Believes in transparent, data-driven approaches to real estate intelligence.',
      focus: 'Product Strategy & Market Intelligence',
      background: 'Real Estate Technology'
    },
    {
      id: 'founder-2', 
      name: 'Technical Lead',
      role: 'Chief Technology Officer',
      bio: 'Full-stack developer specializing in data analytics platforms and scalable web applications. Passionate about building tools that democratize access to complex data.',
      focus: 'Platform Architecture & Development',
      background: 'Software Engineering & Data Systems'
    },
    {
      id: 'analyst-1',
      name: 'Market Analyst',
      role: 'Senior Real Estate Analyst',
      bio: 'Market research specialist with expertise in real estate trends, property valuation, and investment analysis. Focuses on translating complex market data into actionable insights.',
      focus: 'Market Research & Data Analysis',
      background: 'Real Estate Finance & Analytics'
    }
  ];

  // Company mission and thesis content
  const missionContent = {
    mission: "To democratize access to real estate intelligence by building transparent, powerful tools that bridge the gap between complex market data and actionable insights for professionals and investors.",
    thesis: "The real estate industry operates with significant information asymmetries. Professional-grade market intelligence tools are often expensive, complex, or inaccessible to smaller investors and emerging professionals. We believe that transparent, well-designed tools can level the playing field and improve decision-making across the entire real estate ecosystem.",
    vision: "A future where every real estate professional, from individual investors to large firms, has access to the same quality of market intelligence and analytical tools that drive informed decision-making."
  };

  // Operating principles
  const operatingPrinciples = [
    {
      title: "Build in Public",
      description: "We share our development process, decisions, and learnings openly. Transparency builds trust and helps our community understand how we create value.",
      icon: "🌟"
    },
    {
      title: "Outputs Over Promises", 
      description: "We focus on shipping functional tools rather than making grand announcements. Our work speaks for itself through real, usable products.",
      icon: "🛠️"
    },
    {
      title: "Data-Driven Decisions",
      description: "Every feature, strategy, and business decision is backed by data and user feedback. We measure what matters and iterate based on evidence.",
      icon: "📊"
    },
    {
      title: "Accessible Intelligence",
      description: "Complex data should be presented in clear, actionable formats. We design for accessibility and usability, not just functionality.",
      icon: "🎯"
    },
    {
      title: "Community-Centered",
      description: "Our tools are built for and with our community of real estate professionals. User needs drive our development priorities.",
      icon: "🤝"
    },
    {
      title: "Sustainable Growth",
      description: "We prioritize long-term value creation over rapid scaling. Sustainable business practices ensure we can serve our community for years to come.",
      icon: "🌱"
    }
  ];

  return (
    <motion.div 
      className={`max-w-4xl mx-auto p-6 ${className}`}
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
          About Atlas
        </h1>
        <p className="font-sans text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          A growing lab of real estate intelligence tools, built by a team that prefers outputs over promises.
        </p>
      </motion.div>

      {/* Mission & Thesis Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div className="bg-paper-white rounded-2xl p-8 border border-soft-beige/20 shadow-sm">
          <h2 className="font-serif text-3xl font-semibold text-slate-900 mb-8 text-center">
            Our Mission & Vision
          </h2>
          
          <div className="grid gap-8 md:gap-12">
            {/* Mission */}
            <div className="space-y-4">
              <h3 className="font-sans text-xl font-medium text-atlas-green mb-4">Mission</h3>
              <p className="font-sans text-lg text-slate-700 leading-relaxed">
                {missionContent.mission}
              </p>
            </div>

            {/* Thesis */}
            <div className="space-y-4">
              <h3 className="font-sans text-xl font-medium text-atlas-green mb-4">Our Thesis</h3>
              <p className="font-sans text-lg text-slate-700 leading-relaxed mb-4">
                {missionContent.thesis}
              </p>
            </div>

            {/* Vision */}
            <div className="space-y-4">
              <h3 className="font-sans text-xl font-medium text-atlas-green mb-4">Vision</h3>
              <p className="font-sans text-lg text-slate-700 leading-relaxed">
                {missionContent.vision}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <h2 className="font-serif text-3xl font-semibold text-slate-900 mb-8 text-center">
          Our Team
        </h2>
        
        <div className="grid gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="bg-paper-white rounded-xl p-6 border border-soft-beige/20 shadow-sm hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + (index * 0.1), ease: "easeOut" }}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="font-sans text-sm font-medium text-atlas-green uppercase tracking-wide">
                    {member.role}
                  </p>
                </div>
                
                <p className="font-sans text-slate-700 leading-relaxed">
                  {member.bio}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="font-sans text-sm font-medium text-slate-900 mb-1">Focus</p>
                    <p className="font-sans text-sm text-slate-600">{member.focus}</p>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-slate-900 mb-1">Background</p>
                    <p className="font-sans text-sm text-slate-600">{member.background}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Operating Principles Section */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <h2 className="font-serif text-3xl font-semibold text-slate-900 mb-8 text-center">
          How We Work
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {operatingPrinciples.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="bg-paper-white rounded-xl p-6 border border-soft-beige/20 shadow-sm hover:shadow-md transition-all duration-200 hover:border-atlas-green/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="text-center space-y-4">
                <div className="text-3xl mb-4">{principle.icon}</div>
                <h3 className="font-sans text-lg font-semibold text-slate-900">
                  {principle.title}
                </h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact/Get Involved CTA */}
      <motion.div 
        className="text-center bg-atlas-green/5 rounded-2xl p-8 border border-atlas-green/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        <h3 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
          Join Our Community
        </h3>
        <p className="font-sans text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
          Whether you're an investor, real estate professional, or developer interested in our tools, 
          we'd love to connect and learn from your experience.
        </p>
        <button className="bg-atlas-green hover:bg-atlas-green-dark text-white font-sans font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
          Get Involved
        </button>
      </motion.div>
    </motion.div>
  );
} 