import type { AtlasContent } from '../types'

export const atlasContent: AtlasContent = {
  homepage: {
    hero: {
      title: "Welcome to Atlas",
      subtitle: "A growing lab of tools for real estate intelligence. Built by a team that prefers outputs over promises."
    },
    navigationCards: [
      {
        title: "What we build",
        description: "Real estate intelligence tools and analytics platforms designed to democratize access to market data and insights.",
        onClick: () => console.log('Open What we build modal'),
        className: ""
      },
      {
        title: "Why we exist", 
        description: "To bridge the gap between complex real estate data and actionable insights for professionals and investors.",
        onClick: () => console.log('Open Why we exist modal'),
        className: ""
      },
      {
        title: "Who we are",
        description: "A team of developers, analysts, and real estate professionals building tools we wish existed.",
        onClick: () => console.log('Open Who we are modal'),
        className: ""
      },
      {
        title: "Our timeline",
        description: "Building in public since 2024, sharing our progress and learnings along the way.",
        onClick: () => console.log('Open Our timeline modal'),
        className: ""
      }
    ],
    footer: "Built in public - Read the project log →"
  },
  modals: {
    "project-log": {
      title: "Project Log",
      content: "Build-in-public feed showing our development progress, decisions, and learnings as we create Atlas tools."
    },
    "atlas-tools": {
      title: "Atlas Tools", 
      content: "Real Estate Analyzer (coming soon) - Comprehensive property analysis and market intelligence platform. Additional tools in development."
    },
    "about-atlas": {
      title: "About Atlas",
      content: "Atlas is a growing lab of real estate intelligence tools. We're building the infrastructure and analytics platforms that we believe the industry needs."
    },
    "get-involved": {
      title: "Get Involved",
      content: "Whether you're an investor, company, user, or have feature requests - we'd love to hear from you. Join our community of real estate professionals and developers."
    }
  }
} 