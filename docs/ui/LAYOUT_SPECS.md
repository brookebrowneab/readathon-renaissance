# Layout Specifications

Layout-level design rules and shell definitions for the application.

---

## Table of Contents

1. [Layout Overview](#layout-overview)
2. [PublicLayout](#publiclayout)
3. [Authenticated Dashboard Layout](#authenticated-dashboard-layout)
4. [Admin Layout](#admin-layout)
5. [Student Layout](#student-layout)
6. [Teacher Layout](#teacher-layout)
7. [Sponsor Layout](#sponsor-layout)
8. [Onboarding Layout](#onboarding-layout)
9. [Minimal/Auth Layout](#minimalauth-layout)
10. [Container Rules](#container-rules)
11. [Responsive Breakpoints](#responsive-breakpoints)
12. [Scroll Behavior](#scroll-behavior)

---

## Layout Overview

The application uses several distinct layout shells based on user role and context:

| Layout | Primary Users | Key Characteristics |
|--------|---------------|---------------------|
| PublicLayout | Unauthenticated visitors | MainNav + LogoBanner + Footer |
| Dashboard Layout | Parents | MainNav + warm bg + BottomTabBar (mobile) |
| Admin Layout | Administrators | MainNav + AdminNavBar + Footer + BottomTabBar |
| Student Layout | Students | PageHeader + gradient bg + no footer |
| Teacher Layout | Teachers | MainNav + warm bg |
| Sponsor Layout | Sponsors | MainNav + warm bg + BottomTabBar (mobile) |
| Onboarding Layout | New users | PublicLayout with centered card |
| Auth Layout | Login/Register | PublicLayout with centered form |

---

## PublicLayout

**File Path:** `src/components/layout/PublicLayout.tsx`

**Purpose:** Standard layout for public-facing pages (Home, About, How It Works, FAQ, Privacy).

### Structure

```
<div className="flex min-h-screen flex-col">
  <MainNav />
  <LogoBanner />  {/* Currently returns null - logo in MainNav */}
  <main className="flex-1">{children}</main>
  <Footer />
</div>
```

### Layout Rules

| Property | Value |
|----------|-------|
| Flex direction | Column (`flex-col`) |
| Min height | `min-h-screen` |
| Main grows | `flex-1` |

### Header Behavior

- **Desktop:** Sticky header, `h-20` on home page, `h-22` on other pages
- **Mobile:** Sticky header, `h-14`
- **Background:** `bg-white/90 backdrop-blur-sm`
- **Shadow:** `shadow-[0_4px_6px_-1px_rgba(0,0,0,0.15)]` (desktop)

### Footer Behavior

- Always visible at bottom
- Sticks to bottom when content is short (via `flex-1` on main)
- Not fixed - scrolls with content

### Container Rules

Content uses `container` class with responsive max-width.

### Pages Using This Layout

- `HomePage`
- `AboutPage`
- `HowItWorksPage`
- `FAQPage`
- `PrivacyPage`
- `LoginPage`
- `RegisterPage`
- `OnboardingAddChild`
- `OnboardingPledge`
- `OnboardingComplete`

---

## Authenticated Dashboard Layout

**File Path:** Inline in `src/pages/DashboardPage.tsx`

**Purpose:** Layout for authenticated parent users viewing their dashboard.

### Structure

```
<div className="flex min-h-screen flex-col">
  <MainNav />
  <main className="flex-1 bg-background-warm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">...</div>
        {/* Optional Sidebar (desktop only) */}
        <aside className="hidden lg:block w-80 space-y-6">...</aside>
      </div>
    </div>
    {/* Spacer for BottomTabBar */}
    <div className="h-20 md:hidden" />
  </main>
  <Footer />
  <BottomTabBar role="parent" />
</div>
```

### Layout Rules

| Property | Value |
|----------|-------|
| Flex direction | Column |
| Min height | `min-h-screen` |
| Main background | `bg-background-warm` |
| Main shadow | `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]` (top shadow) |
| Content padding | `py-8` |

### Grid/Flex Usage

- **Desktop (lg+):** Two-column layout with `flex-row`
  - Main content: `flex-1`
  - Sidebar: `w-80`
  - Gap: `gap-8`
- **Mobile:** Single column with `flex-col`

### Mobile Considerations

- Bottom spacer `h-20` added on mobile (`md:hidden`) for BottomTabBar
- BottomTabBar role: `"parent"`
- Sidebar hidden on mobile

### Pages Using This Layout

- `DashboardPage`
- `ManageChildrenPage`
- `ChildDetailsPage`
- `MyPledgesPage`
- `LogReadingPage`
- `AccountSettingsPage`

---

## Admin Layout

**File Path:** `src/components/layout/AdminPageLayout.tsx` (preferred), `src/components/layout/AdminLayout.tsx` (legacy)

**Purpose:** Layout for admin pages with horizontal navigation bar.

### Structure (AdminPageLayout)

```
<div className="flex min-h-screen flex-col">
  <MainNav />
  
  {/* Admin Navigation Bar */}
  <div className="border-b-2 border-foreground/20 bg-background">
    <div className="container">
      <nav className="flex overflow-x-auto gap-1 py-2">
        {adminNavItems.map(item => <NavLink />)}
      </nav>
    </div>
  </div>
  
  <main className="flex-1 bg-background-warm">
    <div className="container py-10 md:py-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="relative inline-block">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal">
            <span className="relative inline-block isolate">
              <span className="relative z-10">{title}</span>
              {/* Highlighter effect */}
              <span className="absolute ... bg-warning/45" />
            </span>
          </h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      
      {children}
    </div>
    
    {/* Spacer for BottomTabBar */}
    <div className="h-20 md:hidden" />
  </main>
  
  <Footer />
  <BottomTabBar role="admin" />
</div>
```

### Layout Rules

| Property | Value |
|----------|-------|
| Admin nav background | `bg-background` |
| Admin nav border | `border-b-2 border-foreground/20` |
| Admin nav padding | `py-2` |
| Main background | `bg-background-warm` |
| Content padding | `py-10 md:py-12` |
| Header margin | `mb-10` |

### Admin Navigation Bar

- Horizontal overflow scrollable: `overflow-x-auto`
- Gap between items: `gap-1`
- Active item style: `bg-primary text-primary-foreground` with hand-drawn border radius
- Inactive item: `text-muted-foreground hover:text-foreground hover:bg-muted`

### Navigation Items

```typescript
const adminNavItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Reading", path: "/admin/reading", icon: BookOpen },
  { label: "Users", path: "/admin-users", icon: Users },
  { label: "Finance", path: "/admin-finance", icon: DollarSign },
  { label: "Emails", path: "/admin/emails", icon: Mail },
  { label: "Content", path: "/admin/content", icon: PenLine },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];
```

### Title Highlighter Effect

The admin page titles feature a yellow highlighter effect:

```css
background-color: hsl(var(--warning) / 0.45);
top: 50%;
bottom: 0;
left: -2%;
right: -2%;
transform: rotate(-0.5deg) skewY(-1deg);
border-radius: 4px 8px 4px 6px;
```

### Pages Using This Layout

- `AdminDashboard`
- `AdminReadingLogsPage`
- `AdminOutstandingPage`
- `AdminChecksPage`
- `AdminEmailPage`
- `AdminSiteContentPage`
- `AdminSettingsPage`
- `AdminUsersPage`
- `AdminFinancePage`

---

## Student Layout

**File Path:** Inline in `src/pages/student/StudentDashboardPage.tsx`

**Purpose:** Child-friendly layout for student dashboard.

### Structure

```
<div className="min-h-screen bg-gradient-to-b from-brand-yellow/20 to-background-warm">
  <PageHeader rightContent={<LogoutButton />} />
  
  <main className="px-4 pb-8 space-y-6 max-w-lg mx-auto md:mt-[15px] lg:mt-0">
    {children}
  </main>
</div>
```

### Layout Rules

| Property | Value |
|----------|-------|
| Min height | `min-h-screen` |
| Background | Gradient: `from-brand-yellow/20 to-background-warm` |
| Max width | `max-w-lg` (512px) |
| Horizontal centering | `mx-auto` |
| Padding | `px-4 pb-8` |
| Content spacing | `space-y-6` |

### Header

Uses `PageHeader` component with:
- Logo on left (links to `/`)
- Right content slot for logout button

### Footer Behavior

- No footer - clean, distraction-free interface for children

### Special Characteristics

- Narrower max-width (`max-w-lg`) for focused experience
- Gradient background for visual appeal
- Large touch targets for children
- Prominent CTA button (`h-[72px]` height)

### Pages Using This Layout

- `StudentDashboardPage`
- `StudentLogReadingPage`
- `StudentBooksPage`
- `StudentPinDashboardPage`

---

## Teacher Layout

**File Path:** Inline in `src/pages/teacher/TeacherDashboard.tsx`

**Purpose:** Layout for teacher dashboard and management pages.

### Structure

```
<div className="flex min-h-screen flex-col">
  <MainNav />
  
  <main className="flex-1 bg-background-warm">
    <div className="container py-8">
      {/* Header with title and sign out */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
            {teacherName}'s Dashboard
          </h1>
          <p className="text-muted-foreground">{teacherType}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut /> Sign Out
        </Button>
      </div>
      
      {children}
    </div>
  </main>
</div>
```

### Layout Rules

| Property | Value |
|----------|-------|
| Main background | `bg-background-warm` |
| Content padding | `py-8` |
| Header margin | `mb-8` |

### Grid/Flex Usage

- Stats row: `grid grid-cols-2 md:grid-cols-4 gap-4`
- Student grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

### Footer Behavior

- No Footer component used
- No BottomTabBar by default

### Pages Using This Layout

- `TeacherDashboard`
- `TeacherLogReading`

---

## Sponsor Layout

**File Path:** Inline in `src/pages/sponsor/SponsorDashboardPage.tsx`

**Purpose:** Layout for sponsor dashboard and payment pages.

### Structure

```
<div className="flex min-h-screen flex-col">
  <MainNav />
  
  <main className="flex-1 bg-background-warm">
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">...</div>
        
        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-72 space-y-6 shrink-0">
          {/* Quick Actions Menu */}
        </aside>
      </div>
    </div>
    
    {/* Spacer for BottomTabBar */}
    <div className="h-24 md:hidden" />
  </main>
  
  <Footer />
  <BottomTabBar role="sponsor" />
</div>
```

### Layout Rules

| Property | Value |
|----------|-------|
| Main background | `bg-background-warm` |
| Content padding | `py-8` |
| Desktop sidebar width | `w-72` |
| Bottom spacer (mobile) | `h-24` |

### Sidebar Menu Items

```typescript
const menuItems = [
  { label: "Dashboard", href: "/sponsor/dashboard", icon: Home },
  { label: "My Pledges", href: "/my-pledges", icon: Heart },
  { label: "Make Payment", href: "/sponsor/pay", icon: CreditCard },
  { label: "Account", href: "/sponsor/dashboard", icon: User },
];
```

### Pages Using This Layout

- `SponsorDashboardPage`
- `SponsorPaymentPage`
- `SponsorClassPage`

---

## Onboarding Layout

**File Path:** Uses `PublicLayout` with centered content

**Purpose:** Step-by-step onboarding flow for new users.

### Structure

```
<PublicLayout>
  <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
    <div className="w-full max-w-lg">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map(step => (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step}
            </div>
            {step < 3 && <div className="w-12 h-0.5 bg-muted" />}
          </div>
        ))}
      </div>
      
      {/* Card Container */}
      <div className="animate-fade-in bg-card p-8 shadow-book" style={handDrawnBorder}>
        {children}
      </div>
    </div>
  </section>
</PublicLayout>
```

### Layout Rules

| Property | Value |
|----------|-------|
| Section min-height | `min-h-[calc(100vh-8rem)]` |
| Content centering | `flex items-center justify-center` |
| Background | `bg-background-warm` |
| Padding | `p-6 lg:p-12` |
| Card max-width | `max-w-lg` (512px) |
| Card padding | `p-8` |

### Progress Indicator

- Step circles: `w-8 h-8 rounded-full`
- Active: `bg-primary text-primary-foreground`
- Inactive: `bg-muted text-muted-foreground`
- Connector: `w-12 h-0.5 bg-muted`

### Card Styling

Uses hand-drawn border style:

```typescript
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};
```

### Pages Using This Layout

- `OnboardingAddChild`
- `OnboardingPledge`
- `OnboardingComplete`
- `ReEnrollmentPage`

---

## Minimal/Auth Layout

**File Path:** Uses `PublicLayout` with centered form

**Purpose:** Clean layout for authentication pages.

### Structure

```
<PublicLayout>
  <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
    <div className="w-full max-w-md">
      <div className="animate-fade-in bg-card p-8 shadow-book" style={handDrawnBorder}>
        {/* Form content */}
      </div>
    </div>
  </section>
</PublicLayout>
```

### Layout Rules

| Property | Value |
|----------|-------|
| Section min-height | `min-h-[calc(100vh-8rem)]` |
| Centering | `flex items-center justify-center` |
| Background | `bg-background-warm` |
| Padding | `p-6 lg:p-12` |
| Card max-width | `max-w-md` (448px) |
| Card padding | `p-8` |

### Pages Using This Layout

- `LoginPage`
- `RegisterPage`
- `ForgotPasswordPage`
- `SponsorLoginPage`
- `SponsorAuthPage`
- `TeacherLoginPage`
- `TeacherRegisterPage`
- `StudentLoginPage`

---

## Container Rules

**File Path:** `tailwind.config.ts`

### Container Configuration

```typescript
container: {
  center: true,
  padding: "2rem",  // 32px
  screens: {
    "2xl": "1440px",
  },
},
```

### Behavior

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Default | `100%` | `2rem` (32px) |
| sm (640px) | `640px` | `2rem` |
| md (768px) | `768px` | `2rem` |
| lg (1024px) | `1024px` | `2rem` |
| xl (1280px) | `1280px` | `2rem` |
| 2xl (1440px) | `1440px` | `2rem` |

### Usage

All main content areas use the `container` class:

```html
<div className="container py-8">
  {/* Content */}
</div>
```

---

## Responsive Breakpoints

**File Path:** `tailwind.config.ts` (using Tailwind defaults + custom)

### Breakpoint Definitions

| Breakpoint | Prefix | Min Width | Usage |
|------------|--------|-----------|-------|
| Mobile | (default) | `0px` | Single column, stacked layouts |
| Small | `sm:` | `640px` | 2-column grids begin |
| Medium | `md:` | `768px` | Tablet layouts, hide mobile elements |
| Large | `lg:` | `1024px` | Desktop layouts, show sidebar |
| Extra Large | `xl:` | `1280px` | Wider grids (4 columns) |
| 2XL | `2xl:` | `1440px` | Max container width |

### Common Responsive Patterns

**Navigation:**
- `md:hidden` - Hide mobile header/menu on desktop
- `hidden md:block` - Show desktop nav on larger screens

**Grids:**
```html
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

**Sidebar:**
```html
<aside className="hidden lg:block w-80">
```

**Flex Direction:**
```html
<div className="flex flex-col lg:flex-row gap-8">
```

**BottomTabBar:**
```html
<nav className="fixed bottom-0 ... md:hidden">
```

---

## Scroll Behavior

### Main Scroll Container

The `<body>` is the primary scroll container. No custom scroll containers are used.

### Sticky Elements

| Element | Position | Z-Index |
|---------|----------|---------|
| MainNav (desktop) | `sticky top-0` | `z-50` |
| MainNav (mobile) | `sticky top-0` | `z-40` |
| Admin nav bar | Static (scrolls) | — |
| BottomTabBar | `fixed bottom-0` | `z-50` |
| Notification popover | Relative to trigger | `z-[60]` |
| Account dropdown | Relative to trigger | `z-[70]` |

### Overflow Handling

**Admin Nav Bar:**
```html
<nav className="flex overflow-x-auto gap-1 py-2">
```

**Stats Section (Mobile - HomePage):**
```html
<div className="overflow-x-auto scrollbar-hide">
  <div className="flex gap-4 min-w-max" style={{ touchAction: 'pan-x' }}>
```

### Mobile Scroll Considerations

- `scrollbar-hide` utility used for horizontal scroll areas
- `touch-action: pan-x` enables horizontal swipe
- Bottom spacers (`h-20 md:hidden`, `h-24 md:hidden`) prevent content from being hidden behind BottomTabBar

### Safe Area Handling

BottomTabBar uses safe area padding for notched devices:
```html
<nav className="... safe-area-inset-bottom">
```

---

## Hand-Drawn Border Style

A consistent hand-drawn border style is used throughout the application:

**File Locations:** Defined inline in multiple files

```typescript
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};
```

Also available as a shared utility in `src/lib/admin-styles.ts`:

```typescript
export const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};
```

### Usage

Applied via `style` prop on containers:

```tsx
<div className="bg-background p-6" style={handDrawnBorder}>
  {/* Content */}
</div>
```

---

## Summary of Layout Files

| File | Purpose |
|------|---------|
| `src/components/layout/PublicLayout.tsx` | Public page wrapper |
| `src/components/layout/AdminPageLayout.tsx` | Admin page wrapper with nav + title |
| `src/components/layout/AdminLayout.tsx` | Legacy admin wrapper |
| `src/components/layout/MainNav.tsx` | Primary navigation header |
| `src/components/layout/Footer.tsx` | Site footer |
| `src/components/layout/BottomTabBar.tsx` | Mobile tab navigation |
| `src/components/layout/PageHeader.tsx` | Simple header with logo |
| `src/components/layout/MobileNavDrawer.tsx` | Mobile navigation drawer |
| `src/components/layout/MobileHeader.tsx` | Mobile header variant |
| `src/components/layout/LogoBanner.tsx` | Deprecated (returns null) |
| `src/components/layout/TopHeader.tsx` | Alternate header (unused) |
| `src/components/layout/index.ts` | Barrel exports |
