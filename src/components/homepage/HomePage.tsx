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
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Main Navigation */}
      <MainNavigation 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Dashboard Grid - Fixed Viewport */}
      <div className="h-screen flex">
        
        {/* Conditional Layout Based on Navigation State */}
        {activeSection === 'home' || isInDrillDown ? (
          <>
            {/* Left Home Panel - Visible on home or during drill-down */}
            <motion.div 
              className="flex-shrink-0 p-8 border-r"
              style={{ 
                width: activePanel ? '40%' : '100%',
                backgroundColor: '#FAF8F5',
                borderColor: '#E0DDD6'
              }}
              animate={{ width: activePanel ? '40%' : '100%' }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="h-full flex flex-col justify-between">
                
                {/* Atlas Header */}
                <div>
                  <motion.div 
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <h1 
                      className="mb-4"
                      style={{ 
                        fontFamily: 'DM Serif Display, serif',
                        fontSize: activePanel ? '2.5rem' : '4rem',
                        fontWeight: 400,
                        color: '#2C2C2C',
                        lineHeight: 1.1,
                        transition: 'font-size 0.25s ease-out'
                      }}
                    >
                      Atlas
                    </h1>
                    
                    <p 
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontSize: activePanel ? '1rem' : '1.25rem',
                        color: '#6B6B6B',
                        lineHeight: 1.5,
                        transition: 'font-size 0.25s ease-out'
                      }}
                    >
                      A growing lab of tools for real estate intelligence.
                      <br />
                      Built by a team that prefers outputs over promises.
                    </p>
                  </motion.div>

                  {/* Status Indicators */}
                  <div className="mb-8 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: '#7A8B73' }}
                      ></div>
                      <span 
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem',
                          color: '#6B6B6B',
                          fontWeight: 500
                        }}
                      >
                        MVP Phase • EU Markets
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: '#E67E22' }}
                      ></div>
                      <span 
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem',
                          color: '#6B6B6B',
                          fontWeight: 500
                        }}
                      >
                        3 Tools Live • 2 In Development
                      </span>
                    </div>
                  </div>

                  {/* Enhanced CTA Cards Grid */}
                  <div className={`grid gap-3 ${activePanel ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + (index * 0.05) }}
                      >
                        <Card
                          hoverable
                          onClick={() => handlePanelOpen(card.id)}
                          className="h-full"
                        >
                          <div className="flex items-start space-x-2 p-3">
                            <span className="text-base">{card.icon}</span>
                            <div>
                              <h3 
                                className="mb-1"
                                style={{ 
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: '#2C2C2C'
                                }}
                              >
                                {card.title}
                              </h3>
                              <p 
                                style={{ 
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '0.7rem',
                                  color: '#6B6B6B',
                                  lineHeight: 1.4
                                }}
                              >
                                {card.subtitle}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer - Build in Public */}
                <div className="mt-8">
                  <p 
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#9B9B9B'
                    }}
                  >
                    Built in public • Progress tracked weekly
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          // Full-screen navigation section baseline view
          <div className="w-full p-8" style={{ backgroundColor: '#FAF8F5' }}>
            <NavigationSectionContent 
              section={activeSection} 
              onDrillDown={handleDrillDown}
            />
          </div>
        )}

        {/* Right Content Panel - Conditional */}
        {activePanel && (
          <motion.div
            className="flex-1 border-l"
            style={{ 
              backgroundColor: '#FAF8F5',
              borderColor: '#E0DDD6'
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="h-full flex flex-col">
              {/* Panel Header */}
              <div 
                className="flex items-center justify-between p-8 border-b"
                style={{ borderColor: '#E0DDD6' }}
              >
                <div className="flex-1">
                  <PanelContent activePanel={activePanel} />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePanelClose}
                >
                  Close
                </Button>
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
  const contentStyle = {
    fontFamily: 'Inter, sans-serif',
    color: '#6B6B6B',
    lineHeight: 1.6
  };

  const sectionStyle = {
    ...contentStyle,
    fontSize: '0.95rem',
    color: '#2C2C2C'
  };

  switch (activePanel) {
    case 'what-we-build':
      return (
        <div className="p-8 space-y-8">
          <div>
            <p className="text-lg mb-6" style={{ ...contentStyle, color: '#2C2C2C' }}>
              We build software that helps people and companies make better real estate decisions — starting with AI that can actually interpret properties, neighborhoods, and market context.
            </p>
            <blockquote className="border-l-4 pl-6 py-4 mb-6" style={{ borderColor: '#E67E22', backgroundColor: 'rgba(230, 126, 34, 0.1)' }}>
              <p style={{ ...contentStyle, fontStyle: 'italic', color: '#E67E22' }}>
                "Atlas is building a layer of intelligence on top of Europe's real estate markets. We gather, analyze, and simplify property data so you can make smarter decisions."
              </p>
            </blockquote>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={contentStyle}>Current Tools</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🧠</span>
                  <div>
                    <h4 className="font-medium" style={contentStyle}>Real Estate Analyzer</h4>
                    <p className="text-sm mt-1" style={sectionStyle}>AI-generated property reports from public data</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <h4 className="font-medium" style={contentStyle}>Comparison Dashboard</h4>
                    <p className="text-sm mt-1" style={sectionStyle}>Compare properties side-by-side (Coming soon)</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">💸</span>
                  <div>
                    <h4 className="font-medium" style={contentStyle}>Fractional Toolkit</h4>
                    <p className="text-sm mt-1" style={sectionStyle}>Infrastructure for shared real estate ownership (Later)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p style={{ ...sectionStyle, fontStyle: 'italic' }}>
              Future product path: insights → comparison → action → ownership.
            </p>
          </div>
        </div>
      );

    case 'why-we-exist':
      return (
        <div className="p-8 space-y-8">
          <div>
            <p className="text-lg mb-6" style={{ ...contentStyle, color: '#2C2C2C' }}>
              We believe that good property decisions shouldn't depend on insider access, expensive advisors, or guesswork. That's why we're building smarter tools — to help regular people and smart teams see more clearly.
            </p>
            <blockquote className="border-l-4 pl-6 py-4 mb-6" style={{ borderColor: '#7A8B73', backgroundColor: 'rgba(122, 139, 115, 0.1)' }}>
              <p style={{ ...contentStyle, fontStyle: 'italic', color: '#7A8B73' }}>
                "We started by trying to fractionalize properties. Then we hit legal walls and shifted focus — now we build tools to understand markets before we transform them."
              </p>
            </blockquote>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={contentStyle}>The Problems We're Solving</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#ef4444' }}></div>
                <p style={sectionStyle}>Data is fragmented and hard to use</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#ef4444' }}></div>
                <p style={sectionStyle}>Market analysis is often opinion-driven or paywalled</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#ef4444' }}></div>
                <p style={sectionStyle}>Fractionalization has huge potential but lacks trusted infrastructure</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(122, 139, 115, 0.1)', border: '1px solid rgba(122, 139, 115, 0.2)' }}>
            <p className="text-center font-medium" style={{ ...contentStyle, color: '#7A8B73' }}>
              Our belief: Transparency + Intelligence = Better Outcomes
            </p>
          </div>
        </div>
      );

    case 'who-we-are':
      return (
        <div className="p-8 space-y-8">
          <div>
            <p className="text-lg mb-6" style={{ ...contentStyle, color: '#2C2C2C' }}>
              We're a multidisciplinary team of builders — combining finance, AI, product, and design — on a mission to make real estate smarter, more accessible, and more honest.
            </p>
            <blockquote className="border-l-4 pl-6 py-4 mb-6" style={{ borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              <p style={{ ...contentStyle, fontStyle: 'italic', color: '#8b5cf6' }}>
                "We're a small European team — data freaks, product nerds, and frustrated investors — trying to make real estate less murky."
              </p>
            </blockquote>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={contentStyle}>The Team</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <h4 className="font-medium mb-2" style={contentStyle}>Structure & Strategy</h4>
                <p style={{ ...sectionStyle, fontSize: '0.875rem' }}>Building the framework for sustainable real estate intelligence</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <h4 className="font-medium mb-2" style={contentStyle}>Engineering</h4>
                <p style={{ ...sectionStyle, fontSize: '0.875rem' }}>No buzzwords, just working code</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <h4 className="font-medium mb-2" style={contentStyle}>Product</h4>
                <p style={{ ...sectionStyle, fontSize: '0.875rem' }}>Turning complex data into simple decisions</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p style={{ ...sectionStyle, fontStyle: 'italic' }}>
              Built from the Netherlands & Spain
            </p>
          </div>
        </div>
      );

    case 'our-timeline':
      return (
        <div className="p-8 space-y-8">
          <div>
            <p className="text-lg mb-8" style={{ ...contentStyle, color: '#2C2C2C' }}>
              We build in phases. This is what we've done, what we're doing now, and what's next.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7A8B73' }}>
                <span className="text-black font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={contentStyle}>2024: Formation</h3>
                <p style={sectionStyle}>Formed team, explored fractionalization, hit legal roadblocks</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E67E22' }}>
                <span className="text-black font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={contentStyle}>2025: Intelligence Layer</h3>
                <p style={sectionStyle}>Pivoted to building tools & trust. MVP phase with EU market focus</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2" style={{ borderColor: '#2C2C2C', color: '#2C2C2C' }}>
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={{ ...contentStyle, color: '#2C2C2C' }}>2026+: Investment Products</h3>
                <p style={{ ...sectionStyle, color: '#2C2C2C' }}>Launching smarter investment products and fractionalization infrastructure</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(230, 126, 34, 0.1)', border: '1px solid rgba(230, 126, 34, 0.2)' }}>
            <p className="text-center font-medium" style={{ ...contentStyle, color: '#E67E22' }}>
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
    default:
      return (
        <div className="p-8">
          <p style={contentStyle}>Content loading...</p>
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
        <h1 
          className="mb-2"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#2C2C2C'
          }}
        >
          🧪 Project Log
        </h1>
        <p 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: '#6B6B6B'
          }}
        >
          Follow our journey building real estate intelligence tools
        </p>
      </div>
      
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id}>
            {/* Article Card */}
            <div 
              onClick={() => handleArticleClick(article.id)}
              className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: activeArticle === article.id ? 'rgba(122, 139, 115, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${activeArticle === article.id ? '#7A8B73' : '#E0DDD6'}`
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 
                  className="font-medium pr-4"
                  style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    color: '#2C2C2C',
                    fontSize: '0.95rem'
                  }}
                >
                  {article.title}
                </h3>
                <span 
                  className="text-xs flex-shrink-0"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: '#9B9B9B'
                  }}
                >
                  {article.date}
                </span>
              </div>
              <p 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontSize: '0.8rem', 
                  color: '#6B6B6B',
                  lineHeight: 1.4
                }}
              >
                {article.preview}
              </p>
              {activeArticle === article.id && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E0DDD6' }}>
                  <div 
                    className="prose prose-sm max-w-none"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: '#2C2C2C'
                    }}
                  >
                    {article.content.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h3 
                            key={index}
                            className="font-semibold mt-4 mb-2"
                            style={{ color: '#2C2C2C' }}
                          >
                            {paragraph.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <div key={index} className="flex items-start space-x-2 mb-1">
                            <span style={{ color: '#7A8B73' }}>•</span>
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
      details: `
        Our flagship tool that transforms property addresses into comprehensive intelligence reports.

        ## What It Analyzes
        - **Market Context**: Neighborhood trends, demographics, and growth patterns
        - **Property Assessment**: Condition, features, investment potential
        - **Financial Metrics**: ROI calculations, rental yield estimates
        - **Risk Factors**: Market volatility, regulatory changes, environmental concerns

        ## Data Sources
        - **Public Records**: Property registries, tax assessments, planning permits
        - **Market Data**: Recent sales, price trends, inventory levels
        - **Location Intel**: Transport links, amenities, development plans

        ## Key Features
        - ⚡ **Real-time Analysis**: Results in under 30 seconds
        - 🎯 **94% Accuracy**: Validated against expert assessments
        - 📊 **Visual Reports**: Charts, maps, and executive summaries
        - 🔄 **Regular Updates**: Market data refreshed weekly

        Ready to analyze your next property investment?
      `,
      link: '#property-analyzer',
      linkText: 'Try Property Analyzer'
    },
    {
      id: 'comparison-dashboard',
      name: '📊 Comparison Dashboard',
      status: 'Coming Soon',
      description: 'Compare properties side-by-side with detailed metrics',
      details: `
        Advanced property comparison tool for making data-driven investment decisions.

        ## Comparison Features
        - **Side-by-Side Analysis**: Up to 4 properties simultaneously
        - **Custom Metrics**: Weight factors that matter to your strategy
        - **Market Positioning**: See how properties rank in their markets
        - **Investment Scenarios**: Model different financing and timeline options

        ## Smart Recommendations
        - **Best Value**: Properties with highest potential vs. cost
        - **Lowest Risk**: Conservative options with stable returns
        - **Growth Potential**: Properties in emerging high-growth areas
        - **Cash Flow**: Best rental income opportunities

        ## Visual Tools
        - 🗺️ **Interactive Maps**: Location comparison with amenity overlays
        - 📈 **Trend Analysis**: Historical and projected value charts
        - 🎨 **Custom Reports**: Export professional investment summaries

        Expected launch: Q1 2025
      `,
      link: '#comparison-dashboard',
      linkText: 'Join Waitlist'
    },
    {
      id: 'fractional-toolkit',
      name: '💸 Fractional Toolkit',
      status: 'In Development',
      description: 'Infrastructure for shared real estate ownership',
      details: `
        Legal and technical infrastructure to enable fractional property investment at scale.

        ## Core Components
        - **Legal Framework**: Compliant ownership structures across EU markets
        - **Smart Contracts**: Automated dividend distribution and governance
        - **Secondary Market**: Platform for trading ownership fractions
        - **Property Management**: Integrated maintenance and tenant services

        ## Investment Options
        - **Residential**: Apartments and houses in major EU cities
        - **Commercial**: Office buildings, retail spaces, warehouses
        - **Mixed-Use**: Developments combining residential and commercial
        - **REITs++**: Enhanced REIT structures with direct ownership benefits

        ## Risk Management
        - 🔒 **Legal Protection**: Full regulatory compliance and insurance
        - 🏛️ **Governance**: Democratic decision-making for major property decisions
        - 💰 **Liquidity**: Secondary market for early exit options
        - 📊 **Transparency**: Real-time property performance and financials

        This represents the future of accessible real estate investment.
      `,
      link: '#fractional-toolkit',
      linkText: 'Learn More'
    },
    {
      id: 'market-intelligence',
      name: '🎯 Market Intelligence',
      status: 'Planned',
      description: 'Macro market analysis and trend prediction',
      details: `
        Advanced market intelligence platform for institutional and sophisticated investors.

        ## Intelligence Features
        - **Macro Trends**: Economic indicators impact on real estate markets
        - **Micro Analysis**: Neighborhood-level demand and supply dynamics
        - **Predictive Models**: ML-powered forecasting for market movements
        - **Risk Assessment**: Comprehensive risk scoring for markets and assets

        ## Data Integration
        - **Economic Data**: GDP, employment, inflation, interest rates
        - **Demographic Data**: Population growth, age distribution, income levels
        - **Policy Data**: Zoning changes, tax policies, development approvals
        - **Social Data**: Lifestyle trends, remote work patterns, mobility shifts

        ## Institutional Tools
        - 📈 **Portfolio Optimization**: Suggest rebalancing based on market conditions
        - ⚠️ **Early Warning System**: Alerts for market shifts and opportunities
        - 🎯 **Opportunity Scanner**: Identify undervalued markets before they peak
        - 📋 **Due Diligence**: Automated research packages for investment decisions

        Launching in 2026 for qualified institutional investors.
      `,
      link: '#market-intelligence',
      linkText: 'Request Early Access'
    }
  ];

  const handleToolClick = (toolId: string) => {
    setActiveTool(activeTool === toolId ? null : toolId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="mb-2"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#2C2C2C'
          }}
        >
          🧰 Atlas Tools
        </h1>
        <p 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: '#6B6B6B'
          }}
        >
          Real estate intelligence tools for better decisions
        </p>
      </div>
      
      <div className="space-y-3">
        {tools.map((tool) => (
          <div key={tool.id}>
            {/* Tool Card */}
            <div 
              onClick={() => handleToolClick(tool.id)}
              className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: activeTool === tool.id ? 'rgba(122, 139, 115, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${activeTool === tool.id ? '#7A8B73' : '#E0DDD6'}`
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 
                  className="font-medium pr-4"
                  style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    color: '#2C2C2C',
                    fontSize: '0.95rem'
                  }}
                >
                  {tool.name}
                </h3>
                <span 
                  className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: tool.status === 'Live' ? '#7A8B73' : 
                                    tool.status === 'Coming Soon' ? '#E67E22' : 
                                    tool.status === 'In Development' ? '#3498db' : '#9B9B9B',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}
                >
                  {tool.status}
                </span>
              </div>
              <p 
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontSize: '0.8rem', 
                  color: '#6B6B6B',
                  lineHeight: 1.4
                }}
              >
                {tool.description}
              </p>
              
              {activeTool === tool.id && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E0DDD6' }}>
                  <div 
                    className="prose prose-sm max-w-none mb-4"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: '#2C2C2C'
                    }}
                  >
                    {tool.details.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h3 
                            key={index}
                            className="font-semibold mt-4 mb-2"
                            style={{ color: '#2C2C2C' }}
                          >
                            {paragraph.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <div key={index} className="flex items-start space-x-2 mb-1">
                            <span style={{ color: '#7A8B73' }}>•</span>
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
                  
                  {/* Action Button */}
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: '#7A8B73',
                      color: '#FFFFFF',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle link click - in a real app this would navigate or open modal
                      console.log(`Clicked: ${tool.linkText} for ${tool.name}`);
                    }}
                  >
                    {tool.linkText} →
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutAtlasContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="mb-2"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#2C2C2C'
          }}
        >
          🌐 About Atlas
        </h1>
        <p 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: '#6B6B6B'
          }}
        >
          Our mission to make real estate intelligence accessible
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
          <h3 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2C' }}>
            Our Vision
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#6B6B6B' }}>
            Building a layer of intelligence on top of Europe's real estate markets to enable better decision-making for everyone.
          </p>
        </div>
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(122, 139, 115, 0.1)' }}>
          <h3 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2C' }}>
            Team & Values
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#6B6B6B' }}>
            Small European team building with transparency, data-driven insights, and user-focused design.
          </p>
        </div>
      </div>
    </div>
  );
}

function GetInvolvedContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="mb-2"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#2C2C2C'
          }}
        >
          📬 Get Involved
        </h1>
        <p 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: '#6B6B6B'
          }}
        >
          Join our journey or collaborate with us
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(230, 126, 34, 0.1)' }}>
          <h3 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2C' }}>
            Early Access
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#6B6B6B' }}>
            Get early access to new tools and provide feedback on our products.
          </p>
        </div>
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(122, 139, 115, 0.1)' }}>
          <h3 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2C' }}>
            Partnership
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#6B6B6B' }}>
            Collaborate with us on data, research, or technology initiatives.
          </p>
        </div>
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
 * Baseline Content Components - Full Screen Views
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
      <div className="mb-12">
        <h1 
          className="mb-4"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '3rem',
            fontWeight: 400,
            color: '#2C2C2C'
          }}
        >
          🧪 Project Log
        </h1>
        <p 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.125rem',
            color: '#6B6B6B',
            lineHeight: 1.6
          }}
        >
          Follow our journey building real estate intelligence tools. Weekly updates on progress, challenges, and insights from our transparent development process.
        </p>
      </div>
      
      <div className="grid gap-6">
        {articles.map((article) => (
          <Card
            key={article.id}
            hoverable
            onClick={() => onDrillDown(article.id)}
            className="p-6"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 
                className="font-semibold pr-4"
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  color: '#2C2C2C',
                  fontSize: '1.25rem'
                }}
              >
                {article.title}
              </h2>
              <span 
                className="text-sm flex-shrink-0"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#9B9B9B'
                }}
              >
                {article.date}
              </span>
            </div>
            <p 
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontSize: '1rem', 
                color: '#6B6B6B',
                lineHeight: 1.5
              }}
            >
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
      <div className="mb-12">
        <h1 
          className="mb-4"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '3rem',
            fontWeight: 400,
            color: '#2C2C2C'
          }}
        >
          🛠️ Atlas Tools
        </h1>
        <p 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.125rem',
            color: '#6B6B6B',
            lineHeight: 1.6
          }}
        >
          Our growing collection of real estate intelligence tools. From AI-powered analysis to market insights, each tool is designed to make real estate more accessible and transparent.
        </p>
      </div>
      
      <div className="grid gap-6">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            hoverable
            onClick={() => onDrillDown(tool.id)}
            className="p-6"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 
                className="font-semibold pr-4"
                style={{ 
                  fontFamily: 'Inter, sans-serif', 
                  color: '#2C2C2C',
                  fontSize: '1.25rem'
                }}
              >
                {tool.name}
              </h2>
              <span 
                className={`px-3 py-1 text-xs rounded-full font-medium`}
                style={{ 
                  backgroundColor: tool.status === 'Live' ? 'rgba(122, 139, 115, 0.2)' : 
                                   tool.status === 'Development' ? 'rgba(230, 126, 34, 0.2)' : 
                                   'rgba(155, 155, 155, 0.2)',
                  color: tool.status === 'Live' ? '#7A8B73' : 
                         tool.status === 'Development' ? '#E67E22' : '#9B9B9B'
                }}
              >
                {tool.status}
              </span>
            </div>
            <p 
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontSize: '1rem', 
                color: '#6B6B6B',
                lineHeight: 1.5
              }}
            >
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
      <div className="mb-12">
        <h1 
          className="mb-4"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '3rem',
            fontWeight: 400,
            color: '#2C2C2C'
          }}
        >
          ℹ️ About Atlas
        </h1>
        <p 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.125rem',
            color: '#6B6B6B',
            lineHeight: 1.6
          }}
        >
          Learn about our mission, team, and approach to building real estate intelligence tools that prioritize transparency and user empowerment.
        </p>
      </div>
      
      <div className="grid gap-6">
        {sections.map((section) => (
          <Card
            key={section.id}
            hoverable
            onClick={() => onDrillDown(section.id)}
            className="p-6"
          >
            <h2 
              className="font-semibold mb-3"
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                color: '#2C2C2C',
                fontSize: '1.25rem'
              }}
            >
              {section.title}
            </h2>
            <p 
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontSize: '1rem', 
                color: '#6B6B6B',
                lineHeight: 1.5
              }}
            >
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
      <div className="mb-12">
        <h1 
          className="mb-4"
          style={{ 
            fontFamily: 'DM Serif Display, serif',
            fontSize: '3rem',
            fontWeight: 400,
            color: '#2C2C2C'
          }}
        >
          🤝 Get Involved
        </h1>
        <p 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.125rem',
            color: '#6B6B6B',
            lineHeight: 1.6
          }}
        >
          Join our mission to make real estate more accessible. Whether you're a user, developer, investor, or potential partner, there's a place for you in the Atlas community.
        </p>
      </div>
      
      <div className="grid gap-6">
        {options.map((option) => (
          <Card
            key={option.id}
            hoverable
            onClick={() => onDrillDown(option.id)}
            className="p-6"
          >
            <h2 
              className="font-semibold mb-3"
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                color: '#2C2C2C',
                fontSize: '1.25rem'
              }}
            >
              {option.title}
            </h2>
            <p 
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontSize: '1rem', 
                color: '#6B6B6B',
                lineHeight: 1.5
              }}
            >
              {option.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
} 