---
description: 
globs: 
alwaysApply: false
---
# Atlas Site Revamp - Project Overview & Roadmap

## 1. Project Vision & Goals

### 1.1. Project Statement
To revamp the existing Atlas website into a clean, dashboard-style showcase that transforms the current marketing site into a dynamic front-end window for the Atlas product lab. This project will create a minimal, organic paper-like interface with fluid Apple-inspired animations using modal overlays and panels (no traditional page navigation) that communicates the company's mission, hosts project tools, and reflects the real-time nature of Atlas's real estate intelligence products.

### 1.2. Key Objectives
1. **Transform Site Architecture**: Convert from marketing site to dashboard-style modal/panel system with no traditional page navigation
2. **Implement Component-Based Design**: Build modular, transferable React components that can be easily integrated into existing Next.js codebase
3. **Create Modal-Based Navigation**: All content accessed through expandable panels and modal overlays maintaining dashboard aesthetic
4. **Establish Design System**: Develop cohesive visual identity with muted beiges, sage green, and orange accent colors
5. **Enable Future Tool Integration**: Build componentized placeholder for Real Estate Analyzer with architecture ready for full UI development

### 1.3. Target Audience/Users
Primary users are prospective customers, investors, and industry professionals seeking real estate intelligence tools. Secondary audiences include potential partners, team members, and anyone following Atlas's build-in-public journey. The interface should appeal to data-driven decision makers who value substance over marketing fluff.

## 2. Core Principles & Guiding Philosophies

1. **Modal-First Design**: All navigation through panels and modal overlays, maintaining dashboard feel throughout
2. **Component Modularity**: Build every element as transferable, reusable components for easy integration and future expansion
3. **Content Fidelity**: Use provided content exactly as written, seeking permission before any modifications or polish
4. **Dashboard Aesthetics**: Prioritize clean, minimal design inspired by remarkable.com, nav.al, Basecamp, and Stripe Press
5. **Performance First**: Implement smooth, fluid animations without compromising load times or user experience
6. **Multi-Persona Support**: Design Get Involved section for different user types (investors, companies, users, feature requests)
7. **Future-Ready Architecture**: Design component structure to accommodate future tools and features seamlessly

## 3. Project Structure & Governance

### 3.1. Standard Documentation & Workflow
All project development will adhere to the following standard templates and workflows:
- **Project Phasing & Planning**: Uses `@Enhanced Project Phase Template` for each defined phase
- **Progress Tracking**: Uses `@AI-Driven Phase Progress Tracking` for each active phase  
- **Development Rules & Standards**: Defined in `@Development Rules & Workflow Standards`
- **Project Structure**: Follows `@universal-project-structure-standard.mdc` with web application extensions

### 3.2. Progress Tracking Links
- `@Phase-1-Foundation-Design-System-Progress` (Foundation & Design System Setup) ✅ COMPLETED
- `@Phase-2-Homepage-Core-Components-Progress` (Homepage & Core Modal Components) ✅ COMPLETED  
- `@Phase-3-Full-Page-Modals-Content-Integration-Progress` (About, Tools, Project Log, Get Involved Modals) ✅ COMPLETED
- `@Phase-4-Animation-Enhancement-Polish-Progress` (Animation & Interaction Enhancement) 🚀 READY TO START

## 4. Complete Component Architecture

### 4.1. Homepage Components
- **Main Welcome Panel**: "Welcome to Atlas" with tagline and description
- **Homepage Navigation Cards** (Expandable):
  - "What we build" → Brief intro with option to expand to Tools modal
  - "Why we exist" → Mission teaser with option to expand to About modal  
  - "Who we are" → Team intro with option to expand to full About modal
  - "Our timeline" → Company evolution with option to expand to Project Log
- **Primary CTA Buttons**:
  - "Explore our tools" → Opens Atlas Tools modal
  - "Built in public - Read the project log →" → Opens Project Log modal

### 4.2. Main Navigation Menu
- **Home** → Returns to main dashboard
- **About** → Opens full About Atlas modal (in-depth team, mission, principles)
- **Tools** → Opens Atlas Tools modal (Real Estate Analyzer + future tools)
- **Project Log** → Opens build-in-public feed modal 
- **Get Involved** → Opens contact/involvement modal (multi-persona)

### 4.3. Full Modal Components
- **About Atlas Modal**: Complete team bios, company mission, thesis, principles (separate from homepage "Who we are" teaser)
- **Atlas Tools Modal**: Grid/panel view of tools with Real Estate Analyzer placeholder + future tools
- **Project Log Modal**: Build-in-public feed with filtering (Product, Legal, Fundraising, UX & Design, Learnings, Team)
- **Get Involved Modal**: Multi-persona contact system (investors, companies, users, feature requests, partnerships)

## 5. Development Phases

### @Phase 1: Foundation & Design System Setup
- Establish Next.js project structure with TypeScript, Tailwind CSS, and Framer Motion
- Define comprehensive color palette based on muted beiges, sage green, and orange accents
- Create typography system combining serif and sans-serif fonts (paper-like organic feel)
- Set up modal/panel component architecture and folder structure for maximum transferability

### @Phase 2: Homepage & Core Modal Components  
- Build homepage layout with main welcome panel and expandable navigation cards
- Implement core homepage components: "What we build", "Why we exist", "Who we are", "Our timeline"
- Create base modal system with smooth open/close animations
- Develop main navigation menu with modal trigger functionality

### @Phase 3: Full Page Modals & Content Integration
- Build complete About Atlas modal with in-depth team, mission, and principles content
- Create Atlas Tools modal with Real Estate Analyzer placeholder and future tool architecture
- Implement Project Log modal with filtering system and milestone/blog content structure
- Develop Get Involved modal with multi-persona contact forms and engagement options

### @Phase 4: Animation Enhancement & Polish
- Implement Apple notch-inspired fluid panel animations using Framer Motion
- Add smooth modal transitions and micro-interactions throughout interface
- Optimize for mobile responsiveness while maintaining dashboard aesthetic
- Polish all content integration and ensure seamless component transferability

## 6. Proposed Technical Architecture

### 6.1. Key Technology Stack
- **Frontend**: Next.js 14+ with React 18+, TypeScript for type safety
- **Styling**: Tailwind CSS for utility-first styling with custom color palette
- **Animations**: Framer Motion for fluid, Apple-inspired modal and panel transitions
- **Modal System**: Custom modal management with smooth animations and overlay handling
- **Components**: Modular architecture with clear separation between homepage cards and full modals
- **Development**: ESLint, Prettier for code quality and consistency

### 6.2. Architectural Layers/Pattern Overview
- **UI Layer**: Dashboard-style interface with modal overlays and panel expansions
- **Modal Management Layer**: Centralized modal state management and animation coordination
- **Component Layer**: Modular, reusable components designed for easy transfer to existing codebase
- **Animation Layer**: Framer Motion-powered transitions for modal opens, panel expansions, and micro-interactions
- **Content Layer**: Structured content management with clear separation between teaser and full content
- **Navigation Layer**: Modal-based navigation system maintaining dashboard aesthetic throughout

### 6.3. Integration Strategy
- **Component Transfer**: All components built with clean props interfaces for seamless integration into existing Atlas codebase
- **Modal System**: Reusable modal infrastructure that can accommodate future content and tools
- **API Readiness**: Real Estate Analyzer component structured to easily connect to existing tool APIs
- **Multi-Persona Support**: Get Involved system designed to handle different user types and engagement scenarios

## 7. Content Structure & Organization

### 7.1. Homepage Content (Teaser/Intro Level)
- **"What we build"**: Brief overview of real estate intelligence tools
- **"Why we exist"**: Mission statement and problem solving approach
- **"Who we are"**: Team introduction and company personality
- **"Our timeline"**: Company evolution and current phase

### 7.2. Full Modal Content (In-Depth Level)
- **About Atlas**: Complete team bios, company mission, thesis, operating principles
- **Atlas Tools**: Real Estate Analyzer showcase + comparison tools + future roadmap
- **Project Log**: Milestone updates, blog posts, build-in-public journey documentation
- **Get Involved**: Multi-persona engagement (investors, partners, users, feature requests)

## 8. Project Structure Definition

### 8.1. Universal Core Structure (Following Rule System)
```
/project-planning/          - Phase definitions, milestones, roadmap
/project-requirements/      - Content specifications, design requirements
/project-documentation/     - Component documentation, integration guides
/project-architecture/      - Design system, modal structure, technical decisions
/project-environments/      - Development setup, build configurations
/project-assets/            - Design files, reference images, brand assets
```

### 8.2. Web Application Extensions
```
/project-ux-design/         - Modal wireframes, component designs, user journey maps
/project-content/           - Content strategy, copywriting, messaging hierarchy
/project-analytics/         - User interaction tracking, modal engagement optimization
```

### 8.3. Source Code Organization
```
/src/
├── /components/            
│   ├── /homepage/          - Homepage panels and navigation cards
│   ├── /modals/            - Full page modal components
│   ├── /ui/                - Reusable UI components (buttons, cards, panels)
│   └── /navigation/        - Modal-based navigation system
├── /pages/                 - Next.js page components (single dashboard page)
├── /styles/                - Global styles, Tailwind configuration
├── /animations/            - Framer Motion modal and panel animations
├── /content/               - Static content and data structures
├── /types/                 - TypeScript type definitions
├── /utils/                 - Utility functions and helpers
└── /hooks/                 - Custom React hooks for modal management and animations
```

## 9. Initial Risk Considerations (Project-Level)

1. **Modal Complexity Risk**: Managing multiple overlapping modals and navigation state
   Mitigation: Implement centralized modal state management and clear navigation hierarchy

2. **Content Hierarchy Confusion**: Users getting lost between homepage teasers and full modal content
   Mitigation: Clear visual indicators and smooth transitions between teaser and full content

3. **Mobile Modal Experience**: Ensuring dashboard feel translates to mobile modal interactions
   Mitigation: Progressive enhancement with mobile-optimized modal behaviors

4. **Animation Performance**: Complex modal animations impacting performance
   Mitigation: Performance monitoring and reduced-motion alternatives

---

This Project Overview document serves as the foundational guide for the AI Executor (Cursor) and stakeholders throughout the lifecycle of the Atlas Site Revamp project. It will be referenced and updated as the project evolves through each development phase.
