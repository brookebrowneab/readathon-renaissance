# Read-a-thon Platform Design System

## Design Philosophy

A **mature, nonprofit aesthetic** combining muted navy/indigo tones with warm paper-like neutrals. The design evokes a sense of trust, education, and approachability while maintaining professional polish.

### Core Principles
- **Warm & Approachable**: Paper-like backgrounds create a welcoming, educational feel
- **Muted Professionalism**: Navy and indigo palette conveys trust without being corporate
- **Subtle Accents**: Soft teal used sparingly for highlights and interactions
- **Hand-drawn Touches**: Organic border styles add warmth and personality

---

## Color System

All colors use HSL format for consistency and are defined in `src/index.css`.

### Brand Colors

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--brand-navy` | 225 45% 28% | Primary brand color |
| `--brand-indigo` | 235 35% 45% | Secondary brand |
| `--brand-slate` | 220 25% 55% | Tertiary accents |
| `--brand-teal` | 185 35% 50% | Accent highlights |

### Background Colors

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | 40 20% 98% | Main page background |
| `--background-warm` | 38 35% 93% | Cards, sections |
| `--background-warmer` | 36 40% 90% | Emphasized areas |

### Semantic Colors

| Token | Light Mode | Usage |
|-------|------------|-------|
| `--primary` | 225 45% 28% | Buttons, links, emphasis |
| `--primary-foreground` | 40 20% 98% | Text on primary |
| `--secondary` | 35 25% 96% | Secondary backgrounds |
| `--muted` | 220 15% 92% | Disabled states |
| `--accent` | 185 35% 50% | Highlights, badges |
| `--destructive` | 0 55% 50% | Errors, delete actions |
| `--success` | 160 45% 40% | Success states |
| `--warning` | 38 70% 50% | Warnings |
| `--info` | 225 45% 28% | Informational |

### Text Colors

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--text-primary` | 225 35% 18% | Main body text |
| `--text-secondary` | 220 20% 40% | Supporting text |
| `--text-tertiary` | 220 15% 55% | Muted text |
| `--text-inverse` | 40 20% 98% | Text on dark backgrounds |

---

## Typography

### Font Stack

```css
/* Headings - Serif */
font-family: 'Source Serif 4', 'Instrument Serif', Georgia, serif;

/* Body - Sans-serif */
font-family: 'Inter', system-ui, sans-serif;

/* Handwritten accents */
font-family: 'Caveat', cursive;

/* Logo/Branding */
font-family: 'Cooper Black', serif;
```

### Font Loading
Fonts are loaded via:
- Google Fonts (index.html)
- @fontsource packages (main.tsx)
- Local files (public/fonts/)

### Heading Styles
```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Source Serif 4', serif;
  font-weight: normal;
  letter-spacing: -0.025em; /* tracking-tight */
}
```

### Special Text Classes

| Class | Usage |
|-------|-------|
| `.font-handwritten` | Caveat font for playful annotations |
| `.font-serif` | Explicit serif for body text sections |

---

## Spacing & Layout

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 0.375rem | Default (6px) |
| `--radius-book` | 8vw | Book container curve |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | 0 1px 2px | Subtle elevation |
| `--shadow-sm` | 0 2px 4px | Cards, buttons |
| `--shadow-md` | 0 4px 8px | Dropdowns, popovers |
| `--shadow-lg` | 0 8px 16px | Modals, dialogs |
| `--shadow-xl` | 0 12px 24px | Major overlays |
| `--shadow-book` | 3px 3px 6px 3px | Book container |
| `--shadow-progress` | inset -2px 1px 0px | Progress ring |

### Mobile Touch Targets
```css
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

---

## Component Patterns

### Hand-drawn Borders

Signature organic border style used throughout admin interfaces:

```typescript
// src/lib/admin-styles.ts
export const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

export const handDrawnBorderSubtle = {
  // Same shape, lighter color
  border: 'solid 1px hsl(220 15% 88%)',
  ...
};
```

### Book Container (Legacy Motif)

```css
.book-container {
  background-color: hsl(var(--card));
  border-radius: 0 var(--radius-book) 0 0;
  box-shadow: var(--shadow-book);
  padding: 6% 5% 2% 8%;
}

.book-container-warm {
  background-color: hsl(var(--background-warm));
}
```

### Progress Ring

```css
.progress-ring-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: absolute;
  background-color: hsl(var(--progress-bg));
  box-shadow: var(--shadow-progress);
  border: 1px solid hsl(0 0% 44%);
}
```

### Cards

```tsx
// Standard card
<Card className="bg-card">

// Warm background card  
<Card className="bg-background-warm">

// Admin styled card
<div style={handDrawnBorder} className="bg-background p-6">
```

---

## Button Variants

Using shadcn/ui Button with custom variants:

| Variant | Description |
|---------|-------------|
| `default` | Primary navy background |
| `destructive` | Red for delete actions |
| `outline` | Border only, transparent bg |
| `secondary` | Warm paper background |
| `ghost` | Hover-only background |
| `link` | Underline text style |

### Button States
```css
--primary-hover: 225 45% 22%;
--primary-active: 225 45% 18%;
--destructive-hover: 0 55% 45%;
--accent-hover: 185 35% 45%;
```

---

## Animation System

### Keyframe Animations

```css
/* Fade up entrance */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale in */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* SVG line drawing */
@keyframes draw {
  from { stroke-dashoffset: 31.4; }
  to { stroke-dashoffset: 0; }
}

/* Celebration confetti */
@keyframes confetti {
  0% { opacity: 1; transform: translateY(0) rotate(0deg); }
  100% { opacity: 0; transform: translateY(120px) rotate(720deg); }
}
```

### Utility Classes

| Class | Usage |
|-------|-------|
| `.animate-fade-up` | Entry animation |
| `.animate-scale-in` | Pop-in effect |
| `.animate-draw` | SVG path reveal |
| `.animate-confetti` | Celebration particles |
| `.animate-pulse-subtle` | Loading state |
| `.hover-scale` | Scale on hover |

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Mobile Patterns

### Container Utilities

```css
.mobile-container {
  padding: 1rem; /* px-4 */
}
@media (min-width: 768px) {
  .mobile-container { padding: 1.5rem; } /* md:px-6 */
}
@media (min-width: 1024px) {
  .mobile-container { padding: 2rem; } /* lg:px-8 */
}
```

### Mobile-Specific Components

| Class | Usage |
|-------|-------|
| `.mobile-card` | Full-width on mobile |
| `.mobile-input` | 48px height, 16px font |
| `.mobile-form` | Single column layout |
| `.mobile-sticky-submit` | Fixed bottom button |
| `.bottom-tab-spacer` | 80px spacer for tab bar |
| `.safe-area-inset-bottom` | iOS notch padding |

### Bottom Tab Bar
```tsx
<BottomTabBar role="parent" />
// Renders fixed navigation at bottom on mobile
```

---

## Dark Mode

Dark mode tokens are defined in `.dark` class:

| Token | Dark Value |
|-------|------------|
| `--background` | 225 30% 10% |
| `--card` | 225 25% 14% |
| `--foreground` | 40 15% 95% |
| `--primary` | 220 40% 55% |
| `--border` | 225 20% 22% |

---

## Interactive Elements

### Link Styles

```css
/* Story link with animated underline */
.story-link::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: hsl(var(--primary));
  transform-origin: bottom-right;
  transform: scaleX(0);
  transition: transform 0.3s;
}

.story-link:hover::after {
  transform-origin: bottom-left;
  transform: scaleX(1);
}
```

### Highlight Stripe
```css
.highlight-stripe::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 4px;
  background-color: hsl(var(--accent));
  z-index: -1;
}
```

---

## Form Elements

### Input Styling
- Height: 48px on mobile (`mobile-input`)
- Font size: 16px minimum (prevents iOS zoom)
- Focus ring: `ring-2 ring-ring`

### Form Feedback States
```tsx
<FormSuccess message="Saved successfully!" />
<FormError message="Please fix the errors above." />
<FormLoading message="Saving..." />
```

---

## Icon System

Using **Lucide React** for all icons:

```tsx
import { BookOpen, Users, DollarSign } from "lucide-react";

<BookOpen className="h-5 w-5 text-primary" />
```

Common icons:
- `BookOpen` - Reading, books
- `Users` - Classes, students
- `DollarSign` - Pledges, payments
- `Trophy` - Milestones, achievements
- `Calendar` - Dates, events
- `Mail` - Communications
- `Settings` - Configuration

---

## Layout Components

### Public Layout
```tsx
<PublicLayout>
  <MainNav />
  {children}
  <Footer />
</PublicLayout>
```

### Admin Layout
```tsx
<AdminLayout>
  <AdminSidebar />
  <main>{children}</main>
</AdminLayout>
```

### Page Header
```tsx
<PageHeader
  title="Dashboard"
  subtitle="Welcome back!"
  actions={<Button>Action</Button>}
/>
```

---

## Asset Guidelines

### Images
- Location: `src/assets/`
- Import as ES6 modules
- Prefer SVG for icons/illustrations
- Use lazy loading for large images

### Logo Assets
| File | Usage |
|------|-------|
| `logo.svg` | Main logo |
| `books-shelf-hero.png` | Hero decorations |
| `book-stack-accent.png` | Visual accents |
| `pencil-pattern-blue.png` | Backgrounds |

### Brand Colors (Legacy)
Original brand colors preserved for specific legacy elements:
- Blue: #3760AC / `--brand-blue`
- Yellow: #C8C42D / `--brand-yellow`

---

## Tailwind Configuration

Key extensions in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // ... all semantic tokens
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Source Serif 4', 'Georgia', 'serif'],
    },
    borderRadius: {
      DEFAULT: "var(--radius)",
    },
  },
}
```

---

## Best Practices

### Do
- Use semantic color tokens (`text-primary`, `bg-background`)
- Apply hand-drawn borders to admin sections
- Use Caveat font sparingly for accents
- Maintain 44px minimum touch targets on mobile
- Test with reduced motion preference

### Don't
- Use raw color values in components
- Override shadow values inline
- Mix serif/sans-serif inconsistently
- Ignore dark mode compatibility
- Skip mobile-first responsive design
