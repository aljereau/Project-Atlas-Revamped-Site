'use client';

import React from 'react';
import { atlasContent } from '@/content/atlas-content';

/**
 * Modal Content Components
 * Provides content for each navigation card modal
 * Following Atlas Design System and content specifications
 */

/**
 * What We Build Modal Content
 * @component WhatWeBuildContent
 */
export function WhatWeBuildContent() {
  return (
    <div className="space-y-6">
      <div className="prose prose-slate max-w-none">
        <p className="font-sans text-lg text-slate-700 leading-relaxed mb-6">
          {atlasContent.homepage.navigationCards.find(card => card.title === "What we build")?.description}
        </p>
        
        <h3 className="font-serif text-xl font-semibold text-slate-900 mb-4">Our Tools & Platforms</h3>
        
        <div className="grid gap-4">
          <div className="bg-paper-cream rounded-lg p-4 border border-soft-beige/20">
            <h4 className="font-sans font-medium text-slate-900 mb-2">Real Estate Analyzer</h4>
            <p className="font-sans text-sm text-slate-600">
              Comprehensive property analysis and market intelligence platform. Coming soon.
            </p>
          </div>
          
          <div className="bg-paper-cream rounded-lg p-4 border border-soft-beige/20">
            <h4 className="font-sans font-medium text-slate-900 mb-2">Market Intelligence Suite</h4>
            <p className="font-sans text-sm text-slate-600">
              Advanced analytics tools for real estate professionals and investors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Why We Exist Modal Content
 * @component WhyWeExistContent
 */
export function WhyWeExistContent() {
  return (
    <div className="space-y-6">
      <div className="prose prose-slate max-w-none">
        <p className="font-sans text-lg text-slate-700 leading-relaxed mb-6">
          {atlasContent.homepage.navigationCards.find(card => card.title === "Why we exist")?.description}
        </p>
        
        <h3 className="font-serif text-xl font-semibold text-slate-900 mb-4">Our Mission</h3>
        
        <div className="space-y-4">
          <p className="font-sans text-slate-600 leading-relaxed">
            Real estate data is complex, fragmented, and often inaccessible to those who need it most. 
            We're building tools that democratize access to market intelligence and make data-driven 
            decisions possible for everyone.
          </p>
          
          <p className="font-sans text-slate-600 leading-relaxed">
            Our focus is on creating practical, reliable tools that bridge the gap between raw data 
            and actionable insights for professionals, investors, and anyone involved in real estate decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Who We Are Modal Content
 * @component WhoWeAreContent  
 */
export function WhoWeAreContent() {
  return (
    <div className="space-y-6">
      <div className="prose prose-slate max-w-none">
        <p className="font-sans text-lg text-slate-700 leading-relaxed mb-6">
          {atlasContent.homepage.navigationCards.find(card => card.title === "Who we are")?.description}
        </p>
        
        <h3 className="font-serif text-xl font-semibold text-slate-900 mb-4">Our Team</h3>
        
        <div className="space-y-4">
          <p className="font-sans text-slate-600 leading-relaxed">
            We are developers, analysts, and real estate professionals who have experienced 
            firsthand the challenges of accessing reliable market data and insights.
          </p>
          
          <p className="font-sans text-slate-600 leading-relaxed">
            Our diverse backgrounds span software development, data science, real estate investment, 
            and market analysis. We build tools we wish existed because we understand the problems 
            from multiple perspectives.
          </p>
          
          <div className="bg-atlas-green/5 rounded-lg p-4 border border-atlas-green/20">
            <p className="font-sans text-sm text-slate-700 italic">
              "We prefer outputs over promises. Everything we build is tested by our own team 
              and released when it's ready to solve real problems."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Our Timeline Modal Content
 * @component OurTimelineContent
 */
export function OurTimelineContent() {
  return (
    <div className="space-y-6">
      <div className="prose prose-slate max-w-none">
        <p className="font-sans text-lg text-slate-700 leading-relaxed mb-6">
          {atlasContent.homepage.navigationCards.find(card => card.title === "Our timeline")?.description}
        </p>
        
        <h3 className="font-serif text-xl font-semibold text-slate-900 mb-4">Building in Public</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-atlas-green pl-4">
            <h4 className="font-sans font-medium text-slate-900 mb-1">2024 - Foundation</h4>
            <p className="font-sans text-sm text-slate-600">
              Started Atlas as a real estate intelligence lab. Began developing our first tools 
              and establishing our build-in-public approach.
            </p>
          </div>
          
          <div className="border-l-4 border-soft-beige pl-4">
            <h4 className="font-sans font-medium text-slate-900 mb-1">Q1 2025 - Real Estate Analyzer</h4>
            <p className="font-sans text-sm text-slate-600">
              Launching our comprehensive property analysis platform with market intelligence features.
            </p>
          </div>
          
          <div className="border-l-4 border-soft-beige pl-4">
            <h4 className="font-sans font-medium text-slate-900 mb-1">Ongoing - Community Feedback</h4>
            <p className="font-sans text-sm text-slate-600">
              Continuously improving our tools based on user feedback and market needs. 
              All development progress shared transparently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 