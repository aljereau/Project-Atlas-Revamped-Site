'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { atlasContent } from '@/content/atlas-content';
import NavigationCard from './NavigationCard';
import { useModalContext } from '@/components/modals/ModalProvider';
import { WhatWeBuildContent, WhyWeExistContent, WhoWeAreContent, OurTimelineContent, AtlasToolsModal, ProjectLogModal } from '@/components/modals';

/**
 * Main homepage component for Atlas Site Revamp
 * Features dashboard-style layout with modal-first navigation
 * 
 * @component HomePage
 * @description Creates the main landing page with hero section and navigation cards
 */
export default function HomePage() {
  const { openModal } = useModalContext();

  // Modal content mapping for navigation cards
  const getModalContent = (cardTitle: string) => {
    switch (cardTitle) {
      case "What we build":
        return <WhatWeBuildContent />;
      case "Why we exist":
        return <WhyWeExistContent />;
      case "Who we are":
        return <WhoWeAreContent />;
      case "Our timeline":
        return <OurTimelineContent />;
      default:
        return <div>Content not found</div>;
    }
  };

  // Handle navigation card clicks to open modals
  const handleCardClick = (cardTitle: string) => {
    const modalId = cardTitle.toLowerCase().replace(/\s+/g, '-');
    const content = getModalContent(cardTitle);
    openModal(modalId, content, { size: 'lg' });
  };

  return (
    <main className="min-h-screen bg-paper-white">
      {/* Main Container */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Main Title */}
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-slate-900 mb-6 tracking-tight">
            {atlasContent.homepage.hero.title}
          </h1>
          
          {/* Tagline/Subtitle */}
          <p className="font-sans text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            {atlasContent.homepage.hero.subtitle}
          </p>
          
          {/* Description placeholder - exact content will be added from specifications */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="font-sans text-lg text-slate-700 leading-relaxed">
              A growing lab of tools for real estate intelligence. Built by a team that prefers outputs over promises.
            </p>
          </div>
        </motion.section>

        {/* Navigation Cards Container */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {atlasContent.homepage.navigationCards.map((card, index) => (
              <NavigationCard
                key={card.title}
                title={card.title}
                description={card.description}
                onClick={() => handleCardClick(card.title)}
                delay={0.3 + (index * 0.1)} // Staggered animation
              />
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          {/* Primary CTA - Enhanced with comprehensive Atlas Tools modal */}
          <button 
            className="bg-atlas-green hover:bg-atlas-green-dark text-white font-sans font-medium px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            onClick={() => openModal('atlas-tools', <AtlasToolsModal />, { size: 'xl' })}
          >
            Explore our tools
          </button>
        </motion.section>

        {/* Footer CTA */}
        <motion.footer 
          className="text-center border-t border-soft-beige/20 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          {/* Project Log Link - Enhanced with comprehensive Project Log modal */}
          <button 
            className="text-atlas-green hover:text-atlas-green-dark font-sans text-lg transition-colors duration-200 group"
            onClick={() => openModal('project-log', <ProjectLogModal />, { size: 'xl' })}
          >
            {atlasContent.homepage.footer}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 ml-1">→</span>
          </button>
        </motion.footer>
      </div>
    </main>
  );
} 