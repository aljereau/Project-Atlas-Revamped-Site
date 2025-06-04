'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import MainNavigation from '../navigation/MainNavigation';

/**
 * Fixed Viewport Dashboard - Atlas Lab
 * Panel-driven "public lab dashboard" with no scrolling
 * All navigation sections use the same expandable panel system
 * 
 * @component HomePage
 * @returns {JSX.Element} Fixed viewport dashboard with unified panel system
 */
export default function HomePage(): JSX.Element {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isInDrillDown, setIsInDrillDown] = useState<boolean>(false);

  const handlePanelOpen = useCallback((panelId: string): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActivePanel(panelId);
    setTimeout(() => setIsTransitioning(false), 250);
  }, [isTransitioning]);

  const handlePanelClose = useCallback((): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActivePanel(null);
    setActiveSection('home');
    setTimeout(() => setIsTransitioning(false), 250);
  }, [isTransitioning]);

  const handleSectionChange = useCallback((sectionId: string): void => {
    if (sectionId === 'home') {
      // Close any panel and return to home
      setActivePanel(null);
      setActiveSection('home');
      setIsInDrillDown(false);
      return;
    }

    // For navigation sections, show full-screen baseline view first
    setActiveSection(sectionId);
    setActivePanel(null); // No panel initially - full screen
    setIsInDrillDown(false); // Start in baseline view
  }, []);

  // New: Handle drill-down from baseline to detail view
  const handleDrillDown = useCallback((itemId: string): void => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActivePanel(itemId);
    setIsInDrillDown(true);
    setTimeout(() => setIsTransitioning(false), 250);
  }, [isTransitioning]);

  // Check if we're showing a navigation section as a panel
  const isNavigationPanel = activePanel && ['project-log', 'atlas-tools', 'about-atlas', 'get-involved'].includes(activePanel);

  return (
    <div className="fixed inset-0 overflow-hidden bg-paper-warm">
      {/* Main Navigation */}
      <MainNavigation 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Dashboard Grid - Fixed Viewport */}
      <div className="h-screen flex">
        
        {/* Conditional Layout Based on Navigation State */}
        {activeSection === 'home' ? (
          <>
            {/* Left Home Panel - Only visible when actually on home */}
            <motion.div 
              className={`flex-shrink-0 p-4 sm:p-6 md:p-8 border-r border-border-organic overflow-y-auto bg-paper-warm max-h-screen ${
                activePanel ? 'w-2/5' : 'w-full'
              }`}
              animate={{ width: activePanel ? '40%' : '100%' }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="h-full flex flex-col justify-between min-h-0">
                
                {/* Atlas Header */}
                <div className="flex-1 min-h-0">
                  <motion.div 
                    className="mb-generous md:mb-vast"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <h1 className={`mb-comfortable md:mb-spacious font-editorial-serif font-medium tracking-tight leading-tight text-editorial-ink transition-all duration-300 ${
                        activePanel ? 'text-title' : 'text-hero'
                      }`}>
                      Atlas
                    </h1>
                    
                    <p className={`font-editorial-sans leading-reading tracking-wide text-editorial-slate transition-all duration-300 ${
                        activePanel ? 'text-small' : 'text-body'
                      }`}>
                      A growing lab of tools for real estate intelligence.
                      <br />
                      Built by a team that prefers outputs over promises.
                    </p>
                  </motion.div>

                  {/* Status Indicators */}
                  <div className="mb-spacious md:mb-airy space-y-compact md:space-y-cozy">
                    <div className="flex items-center space-x-cozy">
                      <div className="w-2 h-2 rounded-full bg-atlas-green-500"></div>
                      <span className="font-editorial-sans font-medium text-caption text-editorial-stone tracking-wide">
                        MVP Phase • EU Markets
                      </span>
                    </div>
                    <div className="flex items-center space-x-cozy">
                      <div className="w-2 h-2 rounded-full bg-bright-orange-500"></div>
                      <span className="font-editorial-sans font-medium text-caption text-editorial-stone tracking-wide">
                        3 Tools Live • 2 In Development
                      </span>
                    </div>
                  </div>

                  {/* Bullet-Style Navigation Items */}
                  <div className="space-y-compact">
                    {[
                      {
                        id: 'what-we-build',
                        title: 'What we build',
                        subtitle: 'Tools for real estate intelligence',
                        icon: '🧠'
                      },
                      {
                        id: 'why-we-exist', 
                        title: 'Why we exist',
                        subtitle: 'Making real estate accessible',
                        icon: '🎯'
                      },
                      {
                        id: 'who-we-are',
                        title: 'Who we are',
                        subtitle: 'Small team, clear mission',
                        icon: '👥'
                      },
                      {
                        id: 'our-timeline',
                        title: 'Our timeline',
                        subtitle: 'From concept to ecosystem',
                        icon: '📈'
                      }
                    ].map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                      >
                        <button
                          onClick={() => handlePanelOpen(card.id)}
                          className="w-full text-left p-nav-pad rounded-organic transition-all duration-200 hover:scale-[1.02] hover:shadow-paper-md group bg-paper-white/40 border border-border-organic/60"
                        >
                          <div className="flex items-center space-x-3">
                            <span 
                              className="text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                            >
                              {card.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h3 
                                className="font-editorial-sans font-medium text-small leading-tight transition-colors duration-200 text-editorial-ink"
                              >
                                {card.title}
                              </h3>
                              <p 
                                className="font-editorial-sans text-micro leading-snug transition-colors duration-200 group-hover:text-opacity-80 text-editorial-mist"
                              >
                                {card.subtitle}
                              </p>
                            </div>
                            <svg 
                              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 opacity-60 group-hover:opacity-100 text-atlas-green-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer - Build in Public */}
                <div className="mt-spacious md:mt-airy pt-comfortable border-t border-border-organic">
                  <p 
                    className="font-editorial-sans font-normal text-caption text-editorial-whisper tracking-wider"
                  >
                    Built in public • Progress tracked weekly
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          // Navigation section view - show baseline content in left panel, drilldown in right panel if active
          <>
            {/* Left Section Baseline Panel - Shows section content with drilldown options */}
            <motion.div 
              className={`flex-shrink-0 p-4 sm:p-6 md:p-8 border-r border-border-organic overflow-y-auto bg-paper-warm max-h-screen ${
                activePanel ? 'w-2/5' : 'w-full'
              }`}
              animate={{ width: activePanel ? '40%' : '100%' }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="h-full min-h-0">
                <NavigationSectionContent 
                  section={activeSection} 
                  onDrillDown={handleDrillDown}
                />
              </div>
            </motion.div>
          </>
        )}

        {/* Right Content Panel - Conditional */}
        {activePanel && (
          <motion.div
            className="flex-1 border-l border-border-organic relative bg-paper-warm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Enhanced Close Button - Upper Right Corner */}
            <button
              onClick={handlePanelClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-organic-sm bg-paper-white/95 text-editorial-stone border border-border-organic backdrop-blur-sm"
              aria-label="Close panel"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 hover:rotate-90"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="h-full flex flex-col">
              {/* Panel Header - Enhanced Responsive */}
              <div 
                className="p-4 sm:p-6 md:p-8 border-b border-border-organic pr-16"
              >
                <div className="w-full max-w-none">
                  <PanelContent activePanel={activePanel} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * Panel Content Component
 * Renders different content based on active panel
 */
function PanelContent({ activePanel }: { activePanel: string }) {
  switch (activePanel) {
    case 'what-we-build':
      return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div>
            <p className="font-editorial-sans text-body md:text-large mb-4 md:mb-6 leading-reading text-editorial-ink">
              We build software that helps people and companies make better real estate decisions — starting with AI that can actually interpret properties, neighborhoods, and market context.
            </p>
            <blockquote className="border-l-4 border-bright-orange-500 bg-bright-orange-50 pl-4 md:pl-6 py-3 md:py-4 mb-4 md:mb-6 rounded-r-organic">
              <p className="font-editorial-sans italic text-bright-orange-600 text-small leading-reading">
                "Atlas is building a layer of intelligence on top of Europe's real estate markets. We gather, analyze, and simplify property data so you can make smarter decisions."
              </p>
            </blockquote>
          </div>

          <div>
            <h3 className="font-editorial-sans font-semibold text-body md:text-large mb-3 md:mb-4 text-editorial-ink">Current Tools</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="p-3 md:p-4 rounded-organic hover:shadow-organic-sm transition-shadow bg-paper-white/50">
                <div className="flex items-start space-x-3">
                  <span className="text-lg md:text-xl flex-shrink-0">🧠</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-editorial-sans font-medium text-small md:text-body text-editorial-ink">Real Estate Analyzer</h4>
                    <p className="font-editorial-sans text-micro md:text-small mt-1 leading-reading text-editorial-slate">AI-generated property reports from public data</p>
                  </div>
                </div>
              </div>
              <div className="p-3 md:p-4 rounded-organic hover:shadow-organic-sm transition-shadow bg-paper-white/50">
                <div className="flex items-start space-x-3">
                  <span className="text-lg md:text-xl flex-shrink-0">📊</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-editorial-sans font-medium text-small md:text-body text-editorial-ink">Comparison Dashboard</h4>
                    <p className="font-editorial-sans text-micro md:text-small mt-1 leading-reading text-editorial-slate">Compare properties side-by-side (Coming soon)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 md:p-4 rounded-organic hover:shadow-organic-sm transition-shadow bg-paper-white/50">
                <div className="flex items-start space-x-3">
                  <span className="text-lg md:text-xl flex-shrink-0">💸</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-editorial-sans font-medium text-small md:text-body text-editorial-ink">Fractional Toolkit</h4>
                    <p className="font-editorial-sans text-micro md:text-small mt-1 leading-reading text-editorial-slate">Infrastructure for shared real estate ownership (Later)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="font-editorial-sans text-small md:text-body italic text-center text-editorial-slate">
              Future product path: insights → comparison → action → ownership.
            </p>
          </div>
        </div>
      );

    case 'why-we-exist':
      return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div>
            <p className="font-editorial-sans text-body md:text-large mb-4 md:mb-6 leading-reading text-editorial-ink">
              We believe that good property decisions shouldn't depend on insider access, expensive advisors, or guesswork. That's why we're building smarter tools — to help regular people and smart teams see more clearly.
            </p>
            <blockquote className="border-l-4 border-atlas-green-500 bg-atlas-green-50 pl-4 md:pl-6 py-3 md:py-4 mb-4 md:mb-6 rounded-r-organic">
              <p className="font-editorial-sans italic text-atlas-green-600 text-small leading-reading">
                "We started by trying to fractionalize properties. Then we hit legal walls and shifted focus — now we build tools to understand markets before we transform them."
              </p>
            </blockquote>
          </div>

          <div>
            <h3 className="font-editorial-sans font-semibold text-body md:text-large mb-3 md:mb-4 text-editorial-ink">The Problems We're Solving</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500"></div>
                <p className="font-editorial-sans text-small md:text-body leading-reading text-editorial-slate">Data is fragmented and hard to use</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500"></div>
                <p className="font-editorial-sans text-small md:text-body leading-reading text-editorial-slate">Market analysis is often opinion-driven or paywalled</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500"></div>
                <p className="font-editorial-sans text-small md:text-body leading-reading text-editorial-slate">Fractionalization has huge potential but lacks trusted infrastructure</p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 rounded-organic bg-atlas-green-50 border border-atlas-green-200">
            <p className="text-center font-editorial-sans font-medium text-small md:text-body text-atlas-green-600">
              Our belief: Transparency + Intelligence = Better Outcomes
            </p>
          </div>
        </div>
      );

    case 'who-we-are':
      return (
        <div className="p-8 space-y-8">
          <div>
            <p className="font-editorial-sans text-large mb-6 text-editorial-ink leading-reading">
              We're a multidisciplinary team of builders — combining finance, AI, product, and design — on a mission to make real estate smarter, more accessible, and more honest.
            </p>
            <blockquote className="border-l-4 border-purple-500 bg-purple-50 pl-6 py-4 mb-6">
              <p className="font-editorial-sans italic text-purple-600 leading-reading">
                "We're a small European team — data freaks, product nerds, and frustrated investors — trying to make real estate less murky."
              </p>
            </blockquote>
          </div>

          <div>
            <h3 className="font-editorial-sans font-semibold text-large mb-4 text-editorial-ink">The Team</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-organic bg-paper-white/20">
                <h4 className="font-editorial-sans font-medium mb-2 text-editorial-ink">Structure & Strategy</h4>
                <p className="font-editorial-sans text-small text-editorial-slate">Building the framework for sustainable real estate intelligence</p>
              </div>
              <div className="p-4 rounded-organic bg-paper-white/20">
                <h4 className="font-editorial-sans font-medium mb-2 text-editorial-ink">Engineering</h4>
                <p className="font-editorial-sans text-small text-editorial-slate">No buzzwords, just working code</p>
              </div>
              <div className="p-4 rounded-organic bg-paper-white/20">
                <h4 className="font-editorial-sans font-medium mb-2 text-editorial-ink">Product</h4>
                <p className="font-editorial-sans text-small text-editorial-slate">Turning complex data into simple decisions</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="font-editorial-sans italic text-editorial-slate">
              Built from the Netherlands & Spain
            </p>
          </div>
        </div>
      );

    case 'our-timeline':
      return (
        <div className="p-8 space-y-8">
          <div>
            <p className="font-editorial-sans text-large mb-8 text-editorial-ink leading-reading">
              We build in phases. This is what we've done, what we're doing now, and what's next.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-atlas-green-500">
                <span className="text-black font-bold">1</span>
              </div>
              <div>
                <h3 className="font-editorial-sans font-semibold mb-2 text-editorial-ink">2024: Formation</h3>
                <p className="font-editorial-sans text-editorial-slate">Formed team, explored fractionalization, hit legal roadblocks</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-bright-orange-500">
                <span className="text-black font-bold">2</span>
              </div>
              <div>
                <h3 className="font-editorial-sans font-semibold mb-2 text-editorial-ink">2025: Intelligence Layer</h3>
                <p className="font-editorial-sans text-editorial-slate">Pivoted to building tools & trust. MVP phase with EU market focus</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 border-editorial-ink text-editorial-ink">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-editorial-sans font-semibold mb-2 text-editorial-ink">2026+: Investment Products</h3>
                <p className="font-editorial-sans text-editorial-slate">Launching smarter investment products and fractionalization infrastructure</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-organic bg-bright-orange-50 border border-bright-orange-200">
            <p className="text-center font-editorial-sans font-medium text-bright-orange-600">
              "We build in public because we believe trust is earned through clarity."
            </p>
          </div>
        </div>
      );

    case 'project-log':
      return <ProjectLogContent />;
    case 'atlas-tools':
      return <AtlasToolsContent />;
    case 'about-atlas':
      return <AboutAtlasContent />;
    case 'get-involved':
      return <GetInvolvedContent />;
    case 'for-users':
      return <ForUsersContent />;
    case 'for-developers':
      return <ForDevelopersContent />;
    case 'for-investors':
      return <ForInvestorsContent />;
    case 'for-partners':
      return <ForPartnersContent />;
    case 'our-mission':
      return <OurMissionContent />;
    case 'the-team':
      return <TheTeamContent />;
    case 'our-approach':
      return <OurApproachContent />;
    case 'company-values':
      return <CompanyValuesContent />;
    case 'week-52-2024':
      return <WeeklyUpdateContent articleId="week-52-2024" />;
    case 'ai-property-analyzer-launch':
      return <WeeklyUpdateContent articleId="ai-property-analyzer-launch" />;
    case 'building-in-public-manifesto':
      return <WeeklyUpdateContent articleId="building-in-public-manifesto" />;
    case 'property-analyzer':
      return <ToolDetailContent toolId="property-analyzer" />;
    case 'comparison-dashboard':
      return <ToolDetailContent toolId="comparison-dashboard" />;
    case 'market-tracker':
      return <ToolDetailContent toolId="market-tracker" />;
    case 'roi-calculator':
      return <ToolDetailContent toolId="roi-calculator" />;
    default:
      return (
        <div className="p-8">
          <p className="font-editorial-sans text-editorial-slate">Content loading...</p>
        </div>
      );
  }
}

/**
 * Individual content components for each section
 */
function ProjectLogContent() {
  const [activeArticle, setActiveArticle] = useState<string | null>(null);

  const articles = [
    {
      id: 'week-52-2024',
      title: 'Week 52, 2024: Year-end Reflection',
      date: '2024-12-30',
      preview: 'Looking back at 2024 and setting the foundation for 2025...',
      content: `
        As we close out 2024, it's time to reflect on what we've built and where we're heading.

        ## Key Achievements This Year
        - **Foundation Set**: Established our core team and vision
        - **Technical Stack**: Chose Next.js, TypeScript, and modern tooling
        - **Design System**: Created our signature Atlas design language
        - **Real Estate Analyzer**: Our first AI-powered tool is live

        ## Lessons Learned
        The biggest lesson? Building in public creates accountability. Every week of documentation has forced us to be clearer about our goals and honest about our progress.

        ## Looking Ahead to 2025
        - **Q1**: Complete comparison dashboard tool
        - **Q2**: Expand to 3 EU markets
        - **Q3**: Launch fractional ownership infrastructure
        - **Q4**: Full ecosystem integration

        The real estate industry needs more transparency and better tools. We're here to build them.
      `
    },
    {
      id: 'ai-property-analyzer-launch',
      title: 'AI Property Analyzer: Now Live',
      date: '2024-12-15',
      preview: 'Our first tool is live - AI-generated property insights from public data...',
      content: `
        Today marks a milestone: our AI Property Analyzer is officially live.

        ## What It Does
        The analyzer takes any property address and generates comprehensive insights:
        - **Market Context**: Neighborhood analysis and trends
        - **Property Assessment**: Condition, features, and potential
        - **Investment Metrics**: ROI calculations and market positioning

        ## The Technology
        Built on a foundation of:
        - **Public Data Integration**: Multiple EU property databases
        - **AI Processing**: GPT-4 for natural language insights
        - **Real-time Analysis**: Results in under 30 seconds

        ## Early Results
        - **50+ Properties Analyzed** in beta testing
        - **94% Accuracy** on market value estimates
        - **Positive Feedback** from early users

        This is just the beginning. Next up: comparative analysis tools.
      `
    },
    {
      id: 'building-in-public-manifesto',
      title: 'Our Building in Public Manifesto',
      date: '2024-11-20',
      preview: 'Why we chose transparency over stealth mode...',
      content: `
        Most startups operate in stealth mode. We chose the opposite.

        ## Why Build in Public?
        **Accountability**: Public progress creates pressure to deliver
        **Feedback**: Early input prevents building the wrong thing
        **Trust**: Transparency builds credibility in real estate
        **Community**: Shared journey creates stronger connections

        ## What We Share
        - Weekly progress updates
        - Technical decisions and rationale
        - Challenges and how we solve them
        - Financial metrics (when appropriate)

        ## What We Don't Share
        - Proprietary algorithms
        - User data (obviously)
        - Internal team conflicts
        - Competitive intelligence

        Building in public isn't just marketing—it's philosophy. Real estate needs more honest players.
      `
    }
  ];

  const handleArticleClick = (articleId: string) => {
    setActiveArticle(activeArticle === articleId ? null : articleId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-editorial-serif text-title font-normal mb-2 text-editorial-ink">
          🧪 Project Log
        </h1>
        <p className="font-editorial-sans text-small text-editorial-slate">
          Follow our journey building real estate intelligence tools
        </p>
      </div>
      
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id}>
            {/* Article Card */}
            <div 
              onClick={() => handleArticleClick(article.id)}
              className={`p-4 rounded-organic cursor-pointer transition-all duration-200 hover:shadow-organic-md ${
                activeArticle === article.id 
                  ? 'bg-atlas-green-50 border border-atlas-green-200' 
                  : 'bg-paper-white/50 border border-border-organic'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-editorial-sans font-medium pr-4 text-editorial-ink text-small">
                  {article.title}
                </h3>
                <span className="font-editorial-sans text-micro flex-shrink-0 text-editorial-whisper">
                  {article.date}
                </span>
              </div>
              <p className="font-editorial-sans text-micro text-editorial-slate leading-reading">
                {article.preview}
              </p>
              {activeArticle === article.id && (
                <div className="mt-4 pt-4 border-t border-border-organic">
                  <div className="prose prose-sm max-w-none font-editorial-sans text-small leading-reading text-editorial-ink">
                    {article.content.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h3 key={index} className="font-editorial-sans font-semibold mt-4 mb-2 text-editorial-ink">
                            {paragraph.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <div key={index} className="flex items-start space-x-2 mb-1">
                            <span className="text-atlas-green-600">•</span>
                            <span>{paragraph.replace('- ', '')}</span>
                          </div>
                        );
                      }
                      if (paragraph.trim() === '') {
                        return <br key={index} />;
                      }
                      return (
                        <p key={index} className="mb-3">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AtlasToolsContent() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  const tools = [
    {
      id: 'property-analyzer',
      name: '🧠 Real Estate Analyzer',
      status: 'Live',
      description: 'AI-generated property reports from public data',
      details: `## What it does
- Analyzes property listings using public data sources
- Generates AI-powered insights about location, market trends, and value drivers
- Provides comparative analysis with similar properties in the area

## How it works
- Input: Property URL or address
- Processing: AI analysis of location data, market trends, public records
- Output: Comprehensive property intelligence report

## Current capabilities
- Location scoring and neighborhood analysis
- Market trend identification
- Property feature analysis
- Comparative market analysis (CMA) insights

## Future enhancements
- Deeper integration with local market databases
- Predictive pricing models
- Investment ROI calculations`
    },
    {
      id: 'comparison-dashboard',
      name: '📊 Comparison Dashboard',
      status: 'In Development',
      description: 'Side-by-side property analysis and market insights',
      details: `## What it will do
- Compare multiple properties side-by-side
- Market analysis across different neighborhoods
- Investment return calculations and projections

## Development status
- Core comparison engine: 85% complete
- UI/UX design: 70% complete
- Data integration: 60% complete

## Expected launch
Q2 2025`
    },
    {
      id: 'market-tracker',
      name: '📈 Market Tracker',
      status: 'Coming Soon',
      description: 'Real-time monitoring of EU real estate markets',
      details: `## Planned features
- Real-time market data tracking across EU markets
- Price trend analysis and forecasting
- Market opportunity identification
- Automated alerts for significant market changes

## Development roadmap
Q3 2025: Initial launch with 5 major EU markets
Q4 2025: Expansion to 15 markets
2026: Full EU coverage with advanced analytics`
    },
    {
      id: 'roi-calculator',
      name: '💰 ROI Calculator',
      status: 'Coming Soon',
      description: 'Investment return calculations for real estate opportunities',
      details: `## Planned capabilities
- Comprehensive ROI modeling for rental and flip investments
- Tax implications calculator for different EU jurisdictions
- Financing scenario analysis
- Risk assessment and sensitivity analysis

## Development timeline
Q4 2025: Initial calculator launch
2026: Advanced scenario modeling and risk analysis`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          🛠 Atlas Tools
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Our growing collection of real estate intelligence tools. From AI-powered analysis to market insights, each tool is designed to make real estate more accessible and transparent.
        </p>
      </div>
      
      <div className="space-y-spacious">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            hoverable
            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            className="p-spacious bg-paper-white border-border-organic hover:shadow-organic-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-cozy">
              <h3 className="font-editorial-sans font-semibold text-body text-editorial-ink pr-comfortable">
                {tool.name}
              </h3>
              <span className={`font-editorial-sans text-caption px-cozy py-compact rounded-organic flex-shrink-0 font-medium tracking-wide ${
                tool.status === 'Live' 
                  ? 'bg-atlas-green-100 text-atlas-green-700' 
                  : tool.status === 'In Development'
                  ? 'bg-bright-orange-100 text-bright-orange-700'
                  : 'bg-editorial-mist/20 text-editorial-stone'
              }`}>
                {tool.status}
              </span>
            </div>
            
            <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
              {tool.description}
            </p>
            
            {activeTool === tool.id && (
              <div className="mt-spacious pt-spacious border-t border-border-organic">
                <div className="prose prose-editorial max-w-none mb-comfortable">
                  {tool.details.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h3 
                          key={index}
                          className="font-editorial-sans font-semibold text-large mt-comfortable mb-cozy text-editorial-ink"
                        >
                          {paragraph.replace('## ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <div key={index} className="flex items-start space-x-cozy mb-compact">
                          <span className="text-atlas-green-500 mt-1">•</span>
                          <span className="font-editorial-sans text-body text-editorial-slate">
                            {paragraph.replace('- ', '')}
                          </span>
                        </div>
                      );
                    }
                    if (paragraph.trim() === '') {
                      return <br key={index} />;
                    }
                    return (
                      <p key={index} className="font-editorial-sans text-body text-editorial-slate leading-reading mb-cozy">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
                
                {tool.status === 'Live' && (
                  <Card className="p-comfortable bg-atlas-green-50 border-atlas-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-editorial-sans font-medium text-body text-atlas-green-700 mb-compact">
                          🚀 Ready to try?
                        </p>
                        <p className="font-editorial-sans text-small text-atlas-green-600">
                          Start analyzing properties with our AI-powered tool
                        </p>
                      </div>
                      <button className="bg-atlas-green-500 hover:bg-atlas-green-600 text-paper-white font-editorial-sans font-medium px-spacious py-cozy rounded-organic transition-colors">
                        Try Now →
                      </button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function AboutAtlasContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          ℹ️ About Atlas
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Learn about our mission, team, and approach to building real estate intelligence tools that prioritize transparency and user empowerment.
        </p>
      </div>
      
      <div className="space-y-spacious">
        <Card className="p-spacious bg-paper-white/80 border-border-organic">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-editorial-ink">
            Our Vision
          </h3>
          <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
            Building a layer of intelligence on top of Europe's real estate markets to enable better decision-making for everyone.
          </p>
        </Card>
        
        <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-atlas-green-700">
            Team & Values
          </h3>
          <p className="font-editorial-sans text-body text-atlas-green-600 leading-reading">
            Small European team building with transparency, data-driven insights, and user-focused design.
          </p>
        </Card>
      </div>
    </div>
  );
}

function GetInvolvedContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          🤝 Get Involved
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Join our mission to make real estate more accessible. Whether you're a user, developer, investor, or potential partner, there's a place for you in the Atlas community.
        </p>
      </div>
      
      <div className="space-y-spacious">
        <Card className="p-spacious bg-bright-orange-50 border-bright-orange-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-bright-orange-700">
            Early Access
          </h3>
          <p className="font-editorial-sans text-body text-bright-orange-600 leading-reading">
            Get early access to new tools and provide feedback on our products.
          </p>
        </Card>
        
        <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-atlas-green-700">
            Partnership
          </h3>
          <p className="font-editorial-sans text-body text-atlas-green-600 leading-reading">
            Collaborate with us on data, research, or technology initiatives.
          </p>
        </Card>
      </div>
    </div>
  );
}

/**
 * DRILLDOWN CONTENT COMPONENTS - Design Token Conversion
 * Get Involved Drilldown Content Components
 * Following One-Shot Debugging - Phase 4: Implementation with design token consistency
 */
function ForUsersContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          👥 For Users
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Try our tools, share feedback, and help shape real estate tech
        </p>
      </div>
      
      <div className="space-y-spacious">
        <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-atlas-green-700">
            🔍 Try Our Tools
          </h3>
          <p className="font-editorial-sans text-body mb-comfortable text-atlas-green-600 leading-reading">
            Get early access to our Real Estate Analyzer and upcoming comparison tools.
          </p>
          <button className="bg-atlas-green-500 hover:bg-atlas-green-600 text-paper-white font-editorial-sans font-medium px-spacious py-cozy rounded-organic transition-colors">
            Start Analyzing Properties →
          </button>
        </Card>
        
        <Card className="p-spacious bg-bright-orange-50 border-bright-orange-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-bright-orange-700">
            💬 Share Feedback
          </h3>
          <p className="font-editorial-sans text-body mb-comfortable text-bright-orange-600 leading-reading">
            Help us improve by sharing your real estate challenges and tool suggestions.
          </p>
          <button className="bg-bright-orange-500 hover:bg-bright-orange-600 text-paper-white font-editorial-sans font-medium px-spacious py-cozy rounded-organic transition-colors">
            Submit Feedback →
          </button>
        </Card>
      </div>
    </div>
  );
}

function ForDevelopersContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          💻 For Developers
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Contribute to our open-source tools and join our technical community
        </p>
      </div>
      
      <div className="space-y-spacious">
        <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-atlas-green-700">
            🔧 Open Source
          </h3>
          <p className="font-editorial-sans text-body text-atlas-green-600 leading-reading">
            Contribute to our real estate data processing and AI tools on GitHub.
          </p>
        </Card>
        
        <Card className="p-spacious bg-bright-orange-50 border-bright-orange-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-bright-orange-700">
            🚀 API Access
          </h3>
          <p className="font-editorial-sans text-body text-bright-orange-600 leading-reading">
            Get early access to our property intelligence APIs and data feeds.
          </p>
        </Card>
      </div>
    </div>
  );
}

function ForInvestorsContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          💰 For Investors
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Support our mission to democratize real estate intelligence
        </p>
      </div>
      
      <div className="space-y-spacious">
        <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-atlas-green-700">
            📊 Market Opportunity
          </h3>
          <p className="font-editorial-sans text-body text-atlas-green-600 leading-reading">
            EU real estate market worth €11.7T with massive data transparency gap.
          </p>
        </Card>
        
        <Card className="p-spacious bg-bright-orange-50 border-bright-orange-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-bright-orange-700">
            🎯 Investment Deck
          </h3>
          <p className="font-editorial-sans text-body text-bright-orange-600 leading-reading">
            Request access to our detailed investment presentation and financials.
          </p>
        </Card>
      </div>
    </div>
  );
}

function ForPartnersContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          🤝 For Partners
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Integrate our tools or collaborate on real estate innovation
        </p>
      </div>
      
      <div className="space-y-spacious">
        <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-atlas-green-700">
            🔗 Integration
          </h3>
          <p className="font-editorial-sans text-body text-atlas-green-600 leading-reading">
            Embed our property intelligence into your platform or application.
          </p>
        </Card>
        
        <Card className="p-spacious bg-bright-orange-50 border-bright-orange-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-bright-orange-700">
            📊 Data Partnership
          </h3>
          <p className="font-editorial-sans text-body text-bright-orange-600 leading-reading">
            Share data or collaborate on market intelligence initiatives.
          </p>
        </Card>
      </div>
    </div>
  );
}

/**
 * About Atlas Drilldown Content Components
 */
function OurMissionContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          🎯 Our Mission
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Making real estate accessible through transparency and intelligence
        </p>
      </div>
      
      <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
        <p className="font-editorial-sans text-body text-atlas-green-700 leading-reading">
          We believe real estate decisions shouldn't depend on insider access or expensive advisors. 
          By building intelligent tools that democratize property insights, we're creating a more 
          transparent and accessible real estate market for everyone.
        </p>
      </Card>
    </div>
  );
}

function TheTeamContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          👥 The Team
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Small team of builders focused on outputs over promises
        </p>
      </div>
      
      <div className="space-y-spacious">
        <Card className="p-spacious bg-paper-white/80 border-border-organic">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-editorial-ink">
            Structure & Strategy
          </h3>
          <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
            Building the framework for sustainable real estate intelligence
          </p>
        </Card>
        <Card className="p-spacious bg-paper-white/80 border-border-organic">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-editorial-ink">
            Engineering
          </h3>
          <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
            No buzzwords, just working code
          </p>
        </Card>
        <Card className="p-spacious bg-paper-white/80 border-border-organic">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-editorial-ink">
            Product
          </h3>
          <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
            Turning complex data into simple decisions
          </p>
        </Card>
      </div>
    </div>
  );
}

function OurApproachContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          🛠️ Our Approach
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Building in public with clear goals and measurable progress
        </p>
      </div>
      
      <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
        <p className="font-editorial-sans text-body text-atlas-green-700 leading-reading">
          We build in phases, document everything, and measure what matters. Our transparent 
          development process creates accountability and builds trust with users and partners.
        </p>
      </Card>
    </div>
  );
}

function CompanyValuesContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          ⭐ Company Values
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Transparency, simplicity, and user-focused design principles
        </p>
      </div>
      
      <div className="space-y-spacious">
        <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-atlas-green-700">
            🔍 Transparency
          </h3>
          <p className="font-editorial-sans text-body text-atlas-green-600 leading-reading">
            Build in public, share our process, admit mistakes
          </p>
        </Card>
        <Card className="p-spacious bg-bright-orange-50 border-bright-orange-200">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-bright-orange-700">
            ⚡ Simplicity
          </h3>
          <p className="font-editorial-sans text-body text-bright-orange-600 leading-reading">
            Make complex data simple to understand and use
          </p>
        </Card>
        <Card className="p-spacious bg-paper-white/80 border-border-organic">
          <h3 className="font-editorial-sans font-semibold text-body mb-cozy text-editorial-ink">
            👥 User Focus
          </h3>
          <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
            Solve real problems for real people
          </p>
        </Card>
      </div>
    </div>
  );
}

/**
 * Weekly Update Detail Content Component
 */
function WeeklyUpdateContent({ articleId }: { articleId: string }) {
  const articles = {
    'week-52-2024': {
      title: 'Week 52, 2024: Year-end Reflection',
      date: '2024-12-30',
      content: `Looking back at 2024 and setting the foundation for 2025.

## Key Achievements This Year
- Foundation Set: Established our core team and vision
- Technical Stack: Chose Next.js, TypeScript, and modern tooling
- Design System: Created our signature Atlas design language
- Real Estate Analyzer: Our first AI-powered tool is live

## Lessons Learned
The biggest lesson? Building in public creates accountability. Every week of documentation has forced us to be clearer about our goals and honest about our progress.

## Looking Ahead to 2025
- Q1: Complete comparison dashboard tool
- Q2: Expand to 3 EU markets
- Q3: Launch fractional ownership infrastructure
- Q4: Full ecosystem integration

The real estate industry needs more transparency and better tools. We're here to build them.`
    },
    'ai-property-analyzer-launch': {
      title: 'AI Property Analyzer: Now Live',
      date: '2024-12-15',
      content: `Today marks a milestone: our AI Property Analyzer is officially live.

## What It Does
The analyzer takes any property address and generates comprehensive insights:
- Market Context: Neighborhood analysis and trends
- Property Assessment: Condition, features, and potential
- Investment Metrics: ROI calculations and market positioning

## The Technology
Built on a foundation of:
- Public Data Integration: Multiple EU property databases
- AI Processing: GPT-4 for natural language insights
- Real-time Analysis: Results in under 30 seconds

## Early Results
- 50+ Properties Analyzed in beta testing
- 94% Accuracy on market value estimates
- Positive Feedback from early users

This is just the beginning. Next up: comparative analysis tools.`
    },
    'building-in-public-manifesto': {
      title: 'Our Building in Public Manifesto',
      date: '2024-11-20',
      content: `Most startups operate in stealth mode. We chose the opposite.

## Why Build in Public?
Accountability: Public progress creates pressure to deliver
Feedback: Early input prevents building the wrong thing
Trust: Transparency builds credibility in real estate
Community: Shared journey creates stronger connections

## What We Share
- Weekly progress updates
- Technical decisions and rationale
- Challenges and how we solve them
- Financial metrics (when appropriate)

## What We Don't Share
- Proprietary algorithms
- User data (obviously)
- Internal team conflicts
- Competitive intelligence

Building in public isn't just marketing—it's philosophy. Real estate needs more honest players.`
    }
  };

  const article = articles[articleId as keyof typeof articles];
  if (!article) return <div>Article not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          {article.title}
        </h1>
        <p className="font-editorial-sans text-small text-editorial-whisper">
          {article.date}
        </p>
      </div>
      
      <div className="prose prose-editorial max-w-none">
        {article.content.split('\n').map((paragraph, index) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h3 key={index} className="font-editorial-sans font-semibold text-large mt-comfortable mb-cozy text-editorial-ink">
                {paragraph.replace('## ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            return (
              <div key={index} className="flex items-start space-x-cozy mb-compact">
                <span className="text-atlas-green-500 mt-1">•</span>
                <span className="font-editorial-sans text-body text-editorial-slate">
                  {paragraph.replace('- ', '')}
                </span>
              </div>
            );
          }
          if (paragraph.trim() === '') {
            return <br key={index} />;
          }
          return (
            <p key={index} className="font-editorial-sans text-body text-editorial-slate leading-reading mb-cozy">
              {paragraph}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Tool Detail Content Component
 */
function ToolDetailContent({ toolId }: { toolId: string }) {
  const tools = {
    'property-analyzer': {
      name: '🧠 Real Estate Analyzer',
      status: 'Live',
      description: 'AI-generated property reports from public data',
      details: 'Our flagship tool that transforms property addresses into comprehensive intelligence reports. Built with public data integration, AI processing, and real-time analysis capabilities.'
    },
    'comparison-dashboard': {
      name: '📊 Comparison Dashboard',
      status: 'Development',
      description: 'Side-by-side property analysis and market insights',
      details: 'Advanced property comparison tool for making data-driven investment decisions. Features side-by-side analysis, custom metrics, and smart recommendations.'
    },
    'market-tracker': {
      name: '📈 Market Tracker',
      status: 'Development',
      description: 'Real-time monitoring of EU real estate markets',
      details: 'Comprehensive market intelligence platform tracking trends, opportunities, and risks across European real estate markets.'
    },
    'roi-calculator': {
      name: '💰 ROI Calculator',
      status: 'Planning',
      description: 'Investment return calculations for properties',
      details: 'Dynamic ROI planning tool with customizable mortgage, tax, and rental scenarios to model investment returns accurately.'
    }
  };

  const tool = tools[toolId as keyof typeof tools];
  if (!tool) return <div>Tool not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          {tool.name}
        </h1>
        <span className={`font-editorial-sans text-caption px-cozy py-compact rounded-organic font-medium tracking-wide ${
          tool.status === 'Live' 
            ? 'bg-atlas-green-100 text-atlas-green-700' 
            : tool.status === 'Development'
            ? 'bg-bright-orange-100 text-bright-orange-700'
            : 'bg-editorial-mist/20 text-editorial-stone'
        }`}>
          {tool.status}
        </span>
      </div>
      
      <div className="space-y-spacious">
        <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
          {tool.description}
        </p>
        
        <Card className="p-spacious bg-atlas-green-50 border-atlas-green-200">
          <p className="font-editorial-sans text-body text-atlas-green-700 leading-reading">
            {tool.details}
          </p>
        </Card>
        
        {tool.status === 'Live' && (
          <button className="bg-atlas-green-500 hover:bg-atlas-green-600 text-paper-white font-editorial-sans font-medium px-spacious py-cozy rounded-organic transition-colors">
            Try {tool.name} →
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Navigation Section Baseline Content Component
 * Shows full-screen baseline views for navigation sections
 */
function NavigationSectionContent({ 
  section, 
  onDrillDown 
}: { 
  section: string; 
  onDrillDown: (itemId: string) => void; 
}): JSX.Element {
  switch (section) {
    case 'project-log':
      return <ProjectLogBaselineContent onDrillDown={onDrillDown} />;
    case 'atlas-tools':
      return <AtlasToolsBaselineContent onDrillDown={onDrillDown} />;
    case 'about-atlas':
      return <AboutAtlasBaselineContent onDrillDown={onDrillDown} />;
    case 'get-involved':
      return <GetInvolvedBaselineContent onDrillDown={onDrillDown} />;
    default:
      return <div>Section not found</div>;
  }
}

/**
 * Baseline Content Components - Full Screen Views with Design Tokens
 */
function ProjectLogBaselineContent({ onDrillDown }: { onDrillDown: (itemId: string) => void }) {
  const articles = [
    {
      id: 'week-52-2024',
      title: 'Week 52, 2024: Year-end Reflection',
      date: '2024-12-30',
      preview: 'Looking back at 2024 and setting the foundation for 2025...'
    },
    {
      id: 'ai-property-analyzer-launch',
      title: 'AI Property Analyzer: Now Live',
      date: '2024-12-15',
      preview: 'Our first tool is live - AI-generated property insights from public data...'
    },
    {
      id: 'building-in-public-manifesto',
      title: 'Our Building in Public Manifesto',
      date: '2024-11-20',
      preview: 'Why we chose transparency over stealth mode...'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          🧪 Project Log
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Follow our journey building real estate intelligence tools. Weekly updates on progress, challenges, and insights from our transparent development process.
        </p>
      </div>
      
      <div className="grid gap-spacious">
        {articles.map((article) => (
          <Card
            key={article.id}
            hoverable
            onClick={() => onDrillDown(article.id)}
            className="p-spacious bg-paper-white border-border-organic hover:shadow-organic-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-cozy">
              <h2 className="font-editorial-sans font-semibold text-body text-editorial-ink pr-comfortable">
                {article.title}
              </h2>
              <span className="font-editorial-sans text-small text-editorial-whisper flex-shrink-0">
                {article.date}
              </span>
            </div>
            <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
              {article.preview}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AtlasToolsBaselineContent({ onDrillDown }: { onDrillDown: (itemId: string) => void }) {
  const tools = [
    {
      id: 'property-analyzer',
      name: '🧠 Real Estate Analyzer',
      status: 'Live',
      description: 'AI-generated property reports from public data'
    },
    {
      id: 'comparison-dashboard',
      name: '📊 Comparison Dashboard',
      status: 'Development',
      description: 'Side-by-side property analysis and market insights'
    },
    {
      id: 'market-tracker',
      name: '📈 Market Tracker',
      status: 'Development',
      description: 'Real-time monitoring of EU real estate markets'
    },
    {
      id: 'roi-calculator',
      name: '💰 ROI Calculator',
      status: 'Planning',
      description: 'Investment return calculations for properties'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          🛠️ Atlas Tools
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Our growing collection of real estate intelligence tools. From AI-powered analysis to market insights, each tool is designed to make real estate more accessible and transparent.
        </p>
      </div>
      
      <div className="grid gap-spacious">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            hoverable
            onClick={() => onDrillDown(tool.id)}
            className="p-spacious bg-paper-white border-border-organic hover:shadow-organic-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-cozy">
              <h2 className="font-editorial-sans font-semibold text-body text-editorial-ink pr-comfortable">
                {tool.name}
              </h2>
              <span className={`font-editorial-sans text-caption px-cozy py-compact rounded-organic flex-shrink-0 font-medium tracking-wide ${
                tool.status === 'Live' 
                  ? 'bg-atlas-green-100 text-atlas-green-700' 
                  : tool.status === 'Development' 
                  ? 'bg-bright-orange-100 text-bright-orange-700' 
                  : 'bg-editorial-mist/20 text-editorial-stone'
              }`}>
                {tool.status}
              </span>
            </div>
            <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
              {tool.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AboutAtlasBaselineContent({ onDrillDown }: { onDrillDown: (itemId: string) => void }) {
  const sections = [
    {
      id: 'our-mission',
      title: 'Our Mission',
      description: 'Making real estate accessible through transparency and intelligence'
    },
    {
      id: 'the-team',
      title: 'The Team',
      description: 'Small team of builders focused on outputs over promises'
    },
    {
      id: 'our-approach',
      title: 'Our Approach',
      description: 'Building in public with clear goals and measurable progress'
    },
    {
      id: 'company-values',
      title: 'Company Values',
      description: 'Transparency, simplicity, and user-focused design principles'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          ℹ️ About Atlas
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Learn about our mission, team, and approach to building real estate intelligence tools that prioritize transparency and user empowerment.
        </p>
      </div>
      
      <div className="grid gap-spacious">
        {sections.map((section) => (
          <Card
            key={section.id}
            hoverable
            onClick={() => onDrillDown(section.id)}
            className="p-spacious bg-paper-white border-border-organic hover:shadow-organic-md transition-all duration-200"
          >
            <h2 className="font-editorial-sans font-semibold text-body mb-cozy text-editorial-ink">
              {section.title}
            </h2>
            <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
              {section.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GetInvolvedBaselineContent({ onDrillDown }: { onDrillDown: (itemId: string) => void }) {
  const options = [
    {
      id: 'for-users',
      title: 'For Users',
      description: 'Try our tools, share feedback, and help shape the future of real estate tech'
    },
    {
      id: 'for-developers',
      title: 'For Developers', 
      description: 'Contribute to our open-source tools and join our technical community'
    },
    {
      id: 'for-investors',
      title: 'For Investors',
      description: 'Support our mission to democratize real estate intelligence'
    },
    {
      id: 'for-partners',
      title: 'For Partners',
      description: 'Integrate our tools or collaborate on real estate innovation'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-generous">
        <h1 className="mb-comfortable font-editorial-serif font-normal text-hero leading-tight text-editorial-ink">
          🤝 Get Involved
        </h1>
        <p className="font-editorial-sans text-large leading-reading text-editorial-slate">
          Join our mission to make real estate more accessible. Whether you're a user, developer, investor, or potential partner, there's a place for you in the Atlas community.
        </p>
      </div>
      
      <div className="grid gap-spacious">
        {options.map((option) => (
          <Card
            key={option.id}
            hoverable
            onClick={() => onDrillDown(option.id)}
            className="p-spacious bg-paper-white border-border-organic hover:shadow-organic-md transition-all duration-200"
          >
            <h2 className="font-editorial-sans font-semibold text-body mb-cozy text-editorial-ink">
              {option.title}
            </h2>
            <p className="font-editorial-sans text-body text-editorial-slate leading-reading">
              {option.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
} 