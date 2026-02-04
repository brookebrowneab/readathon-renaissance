# Design Tokens

This document describes the design tokens used by this application. All values are extracted from the actual codebase.

---

## Font Families

| Token | Value | Defined In | Usage |
|-------|-------|------------|-------|
| `font-sans` | `'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'` | `tailwind.config.ts` | Body text, UI elements |
| `font-serif` | `'Source Serif 4', 'Georgia', 'serif'` | `tailwind.config.ts` | Headings (h1-h6) |
| `font-display` | `'Source Serif 4', 'Georgia', 'serif'` | `tailwind.config.ts` | Display text |
| `font-handwritten` | `'Shadows Into Light', 'Caveat', 'cursive'` | `tailwind.config.ts` | Decorative handwritten accents |
| `Cooper Black` | Custom font loaded from `/fonts/cooper-black.woff2` | `src/index.css` | Logo generator only |

### Font Loading

- **Google Fonts**: Loaded in `index.html` (Instrument Serif, Shadows Into Light, Source Serif 4)
- **@fontsource packages**: Loaded in `src/main.tsx` (Inter, Caveat)
- **Self-hosted**: `src/styles/serif-fonts.css` (Instrument Serif, Source Serif 4 woff2 files)

---

## Font Sizes / Scale

Uses Tailwind CSS default type scale. No custom font-size tokens defined.

| Class | Size |
|-------|------|
| `text-xs` | 0.75rem (12px) |
| `text-sm` | 0.875rem (14px) |
| `text-base` | 1rem (16px) |
| `text-lg` | 1.125rem (18px) |
| `text-xl` | 1.25rem (20px) |
| `text-2xl` | 1.5rem (24px) |
| `text-3xl` | 1.875rem (30px) |
| `text-4xl` | 2.25rem (36px) |
| `text-5xl` | 3rem (48px) |
| `text-6xl` | 3.75rem (60px) |

---

## Font Weights

| Token | Value | Defined In |
|-------|-------|------------|
| `font-normal` | 400 | Tailwind default |
| `font-medium` | 500 | Tailwind default |
| `font-semibold` | 600 | Tailwind default |
| `font-bold` | 700 | Tailwind default |

Headings use `font-normal` (weight 400) by default per `src/index.css`:
```css
h1, h2, h3, h4, h5, h6 {
  @apply font-serif font-normal tracking-tight;
}
```

---

## Line Heights

Uses Tailwind CSS default line-height scale. No custom tokens defined.

| Class | Value |
|-------|-------|
| `leading-none` | 1 |
| `leading-tight` | 1.25 |
| `leading-snug` | 1.375 |
| `leading-normal` | 1.5 |
| `leading-relaxed` | 1.625 |
| `leading-loose` | 2 |

---

## Color Palette

All colors defined as HSL values in `src/index.css` and mapped in `tailwind.config.ts`.

### Brand Colors

| Token | HSL Value | Hex (approx) | Usage |
|-------|-----------|--------------|-------|
| `--brand-navy` | `225 45% 28%` | #273b66 | Deep muted navy |
| `--brand-indigo` | `235 35% 45%` | #4b4d94 | Muted indigo |
| `--brand-slate` | `220 25% 55%` | #6e7fa3 | Slate blue |
| `--brand-teal` | `185 35% 50%` | #53a3a8 | Soft teal accent |

### Background Colors

| Token | HSL Value (Light) | HSL Value (Dark) | Usage |
|-------|-------------------|------------------|-------|
| `--background` | `40 20% 98%` | `225 30% 10%` | Main background |
| `--background-warm` | `38 35% 93%` | `225 25% 12%` | Warm paper tone |
| `--background-warmer` | `36 40% 90%` | — | Warmer paper tone |
| `--foreground` | `225 35% 18%` | `40 15% 95%` | Primary text |

### Primary Colors

| Token | HSL Value (Light) | HSL Value (Dark) |
|-------|-------------------|------------------|
| `--primary` | `225 45% 28%` | `220 40% 55%` |
| `--primary-foreground` | `40 20% 98%` | `40 20% 98%` |
| `--primary-hover` | `225 45% 22%` | — |
| `--primary-active` | `225 45% 18%` | — |

### Secondary Colors

| Token | HSL Value (Light) | HSL Value (Dark) |
|-------|-------------------|------------------|
| `--secondary` | `35 25% 96%` | `225 20% 18%` |
| `--secondary-foreground` | `225 35% 18%` | `40 15% 95%` |

### Muted Colors

| Token | HSL Value (Light) | HSL Value (Dark) |
|-------|-------------------|------------------|
| `--muted` | `220 15% 92%` | `225 20% 20%` |
| `--muted-foreground` | `220 20% 45%` | `220 15% 60%` |

### Accent Colors

| Token | HSL Value (Light) | HSL Value (Dark) |
|-------|-------------------|------------------|
| `--accent` | `185 35% 50%` | `185 30% 50%` |
| `--accent-foreground` | `225 35% 18%` | `40 15% 95%` |
| `--accent-hover` | `185 35% 45%` | — |
| `--accent-active` | `185 35% 40%` | — |

### Extended Accent Colors

| Token | HSL Value | Defined In |
|-------|-----------|------------|
| `--accent-orange` | (mapped in tailwind) | `tailwind.config.ts` |
| `--accent-teal` | (mapped in tailwind) | `tailwind.config.ts` |
| `--accent-coral` | (mapped in tailwind) | `tailwind.config.ts` |
| `--accent-gold` | (mapped in tailwind) | `tailwind.config.ts` |
| `--accent-green` | (mapped in tailwind) | `tailwind.config.ts` |

### Semantic Colors

| Token | HSL Value (Light) | Usage |
|-------|-------------------|-------|
| `--destructive` | `0 55% 50%` | Error/delete actions |
| `--destructive-foreground` | `0 0% 100%` | Text on destructive |
| `--destructive-hover` | `0 55% 45%` | Hover state |
| `--destructive-active` | `0 55% 40%` | Active state |
| `--success` | `160 45% 40%` | Success states |
| `--success-foreground` | `0 0% 100%` | Text on success |
| `--warning` | `38 70% 50%` | Warning states |
| `--warning-foreground` | `225 35% 18%` | Text on warning |
| `--info` | `225 45% 28%` | Info states |
| `--info-foreground` | `0 0% 100%` | Text on info |

### Text Colors

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--text-primary` | `225 35% 18%` | Primary text |
| `--text-secondary` | `220 20% 40%` | Secondary text |
| `--text-tertiary` | `220 15% 55%` | Tertiary/muted text |
| `--text-inverse` | `40 20% 98%` | Text on dark backgrounds |

### UI Colors

| Token | HSL Value (Light) | HSL Value (Dark) |
|-------|-------------------|------------------|
| `--card` | `40 15% 99%` | `225 25% 14%` |
| `--card-foreground` | `225 35% 18%` | `40 15% 95%` |
| `--popover` | `40 15% 99%` | `225 25% 14%` |
| `--popover-foreground` | `225 35% 18%` | `40 15% 95%` |
| `--border` | `220 15% 88%` | `225 20% 22%` |
| `--input` | `220 15% 88%` | `225 20% 22%` |
| `--ring` | `225 45% 28%` | `220 40% 55%` |

### Progress Colors

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--progress-bg` | `220 20% 90%` | Progress bar background |
| `--progress-stroke` | `225 45% 28%` | Progress bar fill |

### Sidebar Colors

| Token | HSL Value (Light) | HSL Value (Dark) |
|-------|-------------------|------------------|
| `--sidebar-background` | `35 25% 96%` | `225 30% 10%` |
| `--sidebar-foreground` | `225 35% 18%` | `40 15% 95%` |
| `--sidebar-primary` | `225 45% 28%` | `220 40% 55%` |
| `--sidebar-primary-foreground` | `40 20% 98%` | `40 20% 98%` |
| `--sidebar-accent` | `220 15% 92%` | `225 20% 18%` |
| `--sidebar-accent-foreground` | `225 35% 18%` | `40 15% 95%` |
| `--sidebar-border` | `220 15% 88%` | `225 20% 22%` |
| `--sidebar-ring` | `225 45% 28%` | `220 40% 55%` |

### Extended Palette

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--slate-light` | `220 20% 75%` | Design flexibility |
| `--violet-muted` | `250 25% 55%` | Design flexibility |
| `--indigo-soft` | `235 30% 60%` | Design flexibility |

---

## Spacing Scale

Uses Tailwind CSS default spacing scale with two custom additions.

### Custom Spacing Tokens

| Token | Value | Defined In |
|-------|-------|------------|
| `spacing-18` | `4.5rem` (72px) | `tailwind.config.ts` |
| `spacing-22` | `5.5rem` (88px) | `tailwind.config.ts` |

### Container Padding

| Breakpoint | Padding | Defined In |
|------------|---------|------------|
| DEFAULT | `1rem` | `tailwind.config.ts` |
| sm | `1.5rem` | `tailwind.config.ts` |
| md | `2rem` | `tailwind.config.ts` |

---

## Border Radius

| Token | Value | Defined In |
|-------|-------|------------|
| `--radius` | `0.375rem` (6px) | `src/index.css` |
| `--radius-book` | `8vw` | `src/index.css` |
| `rounded-lg` | `var(--radius)` | `tailwind.config.ts` |
| `rounded-md` | `calc(var(--radius) - 2px)` | `tailwind.config.ts` |
| `rounded-sm` | `calc(var(--radius) - 4px)` | `tailwind.config.ts` |
| `rounded-book` | `var(--radius-book)` | `tailwind.config.ts` |

---

## Shadows

| Token | Value | Defined In | Usage |
|-------|-------|------------|-------|
| `--shadow-book` | `3px 3px 6px 3px rgba(0, 0, 0, 0.3)` | `src/index.css` | Book container element |
| `--shadow-progress` | `inset -2px 1px 0px 0px rgba(0, 0, 0, 0.4), -3px 2px 0px 0px rgba(0, 0, 0, 0.35)` | `src/index.css` | Progress ring |
| `--shadow-xs` | `0 1px 2px rgba(34, 42, 72, 0.04)` | `src/index.css` | Extra small shadow |
| `--shadow-sm` | `0 2px 4px rgba(34, 42, 72, 0.06)` | `src/index.css` | Small shadow |
| `--shadow-md` | `0 4px 8px rgba(34, 42, 72, 0.08)` | `src/index.css` | Medium shadow |
| `--shadow-lg` | `0 8px 16px rgba(34, 42, 72, 0.10)` | `src/index.css` | Large shadow |
| `--shadow-xl` | `0 12px 24px rgba(34, 42, 72, 0.12)` | `src/index.css` | Extra large shadow |

Tailwind classes: `shadow-book`, `shadow-progress`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`

---

## Breakpoints / Responsive Rules

### Container Max Width

| Breakpoint | Max Width | Defined In |
|------------|-----------|------------|
| `2xl` | `1440px` | `tailwind.config.ts` |

### Tailwind Default Breakpoints (used)

| Breakpoint | Min Width |
|------------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### Mobile-Specific Rules

| Selector | Rule | Defined In |
|----------|------|------------|
| Toast positioning | `left: 50%; transform: translateX(-50%)` at `max-width: 640px` | `src/index.css` |
| Touch targets | `min-height: 44px; min-width: 44px` | `src/index.css` |

---

## Animations

### Keyframes

Defined in `tailwind.config.ts`:

| Name | Description |
|------|-------------|
| `accordion-down` | Expand accordion content |
| `accordion-up` | Collapse accordion content |
| `fade-in` | Fade in with upward translate |
| `fade-out` | Fade out with downward translate |
| `fade-in-up` | Fade in with larger upward translate |
| `scale-in` | Scale from 0.95 to 1 |
| `slide-in-right` | Slide in from right |
| `slide-out-right` | Slide out to right |
| `slide-in-left` | Slide in from left |
| `draw-progress` | SVG stroke animation |
| `pulse-glow` | Pulsing glow effect |
| `pulse-subtle` | Subtle opacity pulse |
| `shake` | Shake left-right |
| `success-check` | Checkmark animation |
| `ring-expand` | Ring expansion |
| `confetti-fall` | Confetti falling animation |
| `star-burst` | Star burst effect |
| `pulse-ring` | Pulsing ring |
| `particle-burst` | Particle explosion |
| `underline-slide` | Underline slide-in |
| `card-hover` | Card lift on hover |
| `flash` | Background flash |
| `progress-draw` | Progress stroke animation |
| `circle-appear` | Circle pop-in |
| `highlighter-grow` | Highlighter text effect |

### Animation Classes

| Class | Duration | Timing |
|-------|----------|--------|
| `animate-accordion-down` | 0.2s | ease-out |
| `animate-accordion-up` | 0.2s | ease-out |
| `animate-fade-in` | 0.4s | ease-out forwards |
| `animate-fade-out` | 0.3s | ease-out forwards |
| `animate-fade-in-up` | 0.5s | ease-out forwards |
| `animate-scale-in` | 0.3s | ease-out forwards |
| `animate-slide-in-right` | 0.3s | ease-out |
| `animate-slide-out-right` | 0.3s | ease-out |
| `animate-slide-in-left` | 0.3s | ease-out |
| `animate-draw-progress` | 0.8s | ease-out forwards |
| `animate-pulse-glow` | 2s | cubic-bezier infinite |
| `animate-pulse-subtle` | 1.5s | ease-in-out infinite |
| `animate-shake` | 0.4s | ease-in-out |
| `animate-success-check` | 0.3s | ease-out forwards |
| `animate-ring-expand` | 0.2s | ease-out forwards |
| `animate-confetti` | 2.5s | ease-out forwards |
| `animate-star-burst` | 0.6s | ease-out forwards |
| `animate-pulse-ring` | 0.6s | ease-out forwards |
| `animate-particle-burst` | 0.8s | ease-out forwards |
| `animate-underline-slide` | 0.3s | ease-out forwards |
| `animate-flash` | 0.3s | ease-out |
| `animate-progress-draw` | 0.8s | ease-out forwards |
| `animate-circle-appear` | 0.4s | ease-out forwards |
| `animate-highlighter-grow` | 0.6s | ease-out 0.2s forwards |

---

## Component Classes

Defined in `src/index.css` under `@layer components`:

| Class | Description |
|-------|-------------|
| `.book-container` | Legacy book motif container with curved top-right corner |
| `.book-container-warm` | Book container with warm background |
| `.progress-ring-container` | Circular progress ring styling |
| `.font-handwritten` | Caveat cursive font |
| `.highlight-stripe` | Decorative underline stripe |
| `.story-link` | Animated underline link |
| `.hover-scale` | Scale up on hover (1.05) |
| `.mobile-container` | Responsive horizontal padding |
| `.mobile-card` | Full-width on mobile |
| `.mobile-input` | Taller input for mobile |
| `.mobile-form` | Vertical spacing for forms |
| `.mobile-sticky-submit` | Fixed bottom submit button on mobile |
| `.bottom-tab-spacer` | Space for bottom tab bar |
| `.scrollbar-hide` | Hide scrollbar |
| `.touch-action-pan-y` | Touch behavior for vertical scrolling |
| `.safe-area-inset-bottom` | Safe area padding for notched devices |

---

## Accessibility

### Reduced Motion

Defined in `src/index.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Targets

All buttons, links, and interactive elements have minimum dimensions:
- `min-height: 44px`
- `min-width: 44px`

Exception classes: `.inline-link`, `.touch-target-small`

---

## File References

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Tailwind theme extensions, color mappings, animations |
| `src/index.css` | CSS custom properties, component classes, utilities |
| `src/styles/serif-fonts.css` | Self-hosted serif font definitions |
| `src/main.tsx` | @fontsource imports |
| `index.html` | Google Fonts preconnect/link |
| `components.json` | shadcn/ui configuration |
| `src/lib/admin-styles.ts` | Hand-drawn border style objects |
