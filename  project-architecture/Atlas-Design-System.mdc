 # Atlas Project Lab Dashboard - Design System

## 🎨 Design Philosophy

**Paper-First Interface** - Inspired by remarkable.com, this design system prioritizes content clarity, intentional spacing, and minimal visual noise. Every element should feel deliberate and functional, like a well-designed workspace.

**Core Principles:**
- Content over decoration
- Intentional negative space
- Subtle, meaningful interactions
- Intellectual rather than flashy
- Builder's lab aesthetic

---

## 🌈 Color Palette

### Primary Colors
```css
/* Neutral Foundation */
--paper-white: #FEFEFE
--paper-cream: #FAF8F5
--soft-beige: #F5F2ED
--warm-gray: #E8E5E0

/* Content Colors */
--text-primary: #2C2C2C
--text-secondary: #6B6B6B
--text-muted: #9A9A9A

/* Brand Accents */
--atlas-green: #7A8B73        /* Muted sage green */
--atlas-green-light: #A4B49A  /* Lighter sage for hovers */
--atlas-green-dark: #5C6B54   /* Darker sage for active states */

/* Contrast & Energy */
--bright-orange: #E67E22      /* For CTAs and important highlights */
--orange-hover: #D35400       /* Darker orange for interactions */
--orange-light: #F39C12       /* Lighter orange for backgrounds */

/* Functional Colors */
--border-light: #E0DDD6
--border-medium: #D0CCC3
--shadow-subtle: rgba(44, 44, 44, 0.08)
```

### Usage Guidelines
- **paper-cream**: Main background
- **paper-white**: Card/panel backgrounds
- **atlas-green**: Primary brand elements, nav items
- **bright-orange**: CTAs, "Explore our tools", key actions
- **text-primary**: Headings, important text
- **text-secondary**: Body text, descriptions

---

## 📝 Typography

### Font Families
```css
/* Serif for Headlines - Intellectual, Readable */
--font-serif: 'Crimson Text', 'Times New Roman', serif;

/* Sans-serif for UI - Clean, Modern */
--font-sans: 'Inter', 'Helvetica Neue', sans-serif;

/* Monospace for Code/Data - Technical Elements */
--font-mono: 'JetBrains Mono', 'Consolas', monospace;
```

### Typography Scale
```css
/* Headlines */
--text-xxl: 3.5rem;    /* Welcome to Atlas */
--text-xl: 2.25rem;    /* Section Headers */
--text-lg: 1.5rem;     /* Panel Titles */

/* Body Text */
--text-base: 1rem;     /* Standard paragraph */
--text-sm: 0.875rem;   /* Secondary info */
--text-xs: 0.75rem;    /* Captions, metadata */

/* Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Usage
- **Headlines**: Serif, semibold, atlas-green or text-primary
- **Body text**: Sans-serif, normal weight
- **Buttons**: Sans-serif, medium weight
- **Captions**: Sans-serif, light weight, text-muted

---

## 📐 Layout & Spacing

### Container System
```css
/* Main container following your mockup */
.main-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--paper-cream);
  border: 2px solid var(--border-light);
  border-radius: 24px;
  box-shadow: var(--shadow-subtle);
}

/* Panel containers */
.content-panel {
  background: var(--paper-white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}
```

### Spacing Scale
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-xxl: 3rem;     /* 48px */
--space-xxxl: 4rem;    /* 64px */
```

---

## 🔘 Component Patterns

### Buttons (Based on your mockup)
```css
/* Primary Button (What we build, Why we exist, etc.) */
.btn-primary {
  background: transparent;
  border: 2px solid var(--border-medium);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  border-color: var(--atlas-green);
  background: var(--atlas-green);
  color: var(--paper-white);
}

/* CTA Button (Explore our tools) */
.btn-cta {
  background: var(--bright-orange);
  border: 2px solid var(--bright-orange);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: var(--paper-white);
  font-weight: var(--font-medium);
}

.btn-cta:hover {
  background: var(--orange-hover);
  border-color: var(--orange-hover);
}

/* Menu Button (hamburger style) */
.btn-menu {
  background: transparent;
  border: 2px solid var(--border-medium);
  border-radius: 8px;
  padding: 0.5rem;
  width: 48px;
  height: 48px;
}
```

### Panel Animations
```css
/* Sliding panels for content expansion */
.panel-slide {
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide.active {
  transform: translateX(0);
}

/* Subtle hover effects */
.interactive-element:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-subtle);
}
```

---

## 🎯 Interactive States

### Hover Effects
- **Buttons**: Color fill transition (200ms ease)
- **Cards**: Subtle lift (1px translateY + shadow)
- **Links**: Color shift to atlas-green

### Focus States
- **Accessibility**: 2px solid bright-orange outline
- **Keyboard navigation**: Clear focus indicators

### Loading States
- **Minimal spinners**: atlas-green color
- **Skeleton loading**: soft-beige backgrounds

---

## 📱 Responsive Behavior

### Breakpoints
```css
--mobile: 480px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1200px;
```

### Mobile Adaptations
- Container padding reduces to 1rem
- Button layout stacks vertically
- Typography scales down proportionally
- Panels become full-width overlays

---

## 🎨 Special Effects

### Subtle Micro-interactions
- **Button press**: Scale 0.98 for 100ms
- **Panel open**: Slide in with easing
- **Content load**: Fade in (300ms)
- **Hover states**: Color transitions (200ms)

### Paper Texture (Optional)
- Very subtle paper texture background
- CSS noise filter for authentic feel
- Only applied to main container

---

## 🔧 Implementation Notes

### CSS Custom Properties Setup
All colors and spacing should be defined as CSS custom properties for easy theming and consistency.

### Component Architecture
- Each component should be self-contained
- Use CSS modules or scoped styles
- Maintain consistent naming conventions

### Performance Considerations
- Use CSS transforms for animations
- Minimize paint/layout thrashing
- Optimize for 60fps interactions

---

This design system captures the paper/remarkable aesthetic while providing the flexibility for sophisticated interactions. The muted palette with orange accents will keep focus on content while still feeling engaging and modern.

Ready to start building with this foundation? 