# Component Specifications

Visual specification for all reusable UI components in the application.

---

## Table of Contents

1. [Core UI Components](#core-ui-components)
   - [Button](#button)
   - [Input](#input)
   - [Label](#label)
   - [Textarea](#textarea)
   - [Select](#select)
   - [Checkbox](#checkbox)
   - [Badge](#badge)
   - [Progress](#progress)
   - [Skeleton](#skeleton)
2. [Form Components](#form-components)
   - [FormField](#formfield)
   - [PledgeAmountForm](#pledgeamountform)
3. [Card Components](#card-components)
   - [Card](#card)
   - [DataCard](#datacard)
   - [StatCard](#statcard)
   - [StudentCard](#studentcard)
   - [PledgeCard](#pledgecard)
   - [MobileStudentCard](#mobilestudentcard)
4. [Layout Components](#layout-components)
   - [MainNav](#mainnav)
   - [Footer](#footer)
   - [BottomTabBar](#bottomtabbar)
   - [AdminPageLayout](#adminpagelayout)
   - [PageHeader](#pageheader)
   - [MobileNavDrawer](#mobilenavdrawer)
   - [LogoBanner](#logobanner)
5. [Legacy Components](#legacy-components)
   - [BookContainer](#bookcontainer)
   - [ReadingGoalRing](#readinggoalring)
   - [Logo](#logo)
6. [Mobile-Specific Components](#mobile-specific-components)
   - [MobileMinutesStepper](#mobileminutesstepper)
   - [MobileProgressDisplay](#mobileprogressdisplay)
7. [Feedback Components](#feedback-components)
   - [EmptyState](#emptystate)
   - [ErrorState](#errorstate)
   - [LoadingSpinner](#loadingspinner)
   - [ConfirmDialog](#confirmdialog)
8. [Data Display Components](#data-display-components)
   - [TablePagination](#tablepagination)
   - [ClassFundraisingShelf](#classfundraisingshelf)
9. [Celebration Components](#celebration-components)
   - [Confetti](#confetti)
   - [StarBurst](#starburst)
   - [ParticleBurst](#particleburst)
10. [Modal Components](#modal-components)
    - [Dialog](#dialog)
    - [Sheet](#sheet)
    - [Popover](#popover)
    - [HoverCard](#hovercard)
11. [Additional Core Components](#additional-core-components)
    - [Avatar](#avatar)
    - [Accordion](#accordion)
    - [Switch](#switch)
    - [DropdownMenu](#dropdownmenu)
    - [AlertDialog](#alertdialog)
    - [Tabs](#tabs)
    - [Tooltip](#tooltip)
    - [Collapsible](#collapsible)
    - [RadioGroup](#radiogroup)
12. [Book Components](#book-components)
    - [BookSelector](#bookselector)
    - [BarcodeScanner](#barcodescanner)

---

## Core UI Components

### Button

**File Path:** `src/components/ui/button.tsx`

**Purpose:** Primary interactive element for user actions.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "accent" \| "destructive" \| "outline" \| "ghost" \| "link"` | `"default"` | Visual style variant |
| `size` | `"sm" \| "default" \| "lg" \| "icon"` | `"default"` | Size variant |
| `asChild` | `boolean` | `false` | Render as child element (Slot) |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable interactions |

**Visual Structure:**
```
<button>
  {loading && <Loader2 (spinning) />}
  {children}
</button>
```

**Typography:**
- Font: `font-medium` (500)
- Size: `text-sm` (default, sm), `text-base` (lg)

**Spacing:**
- sm: `h-8 px-3`
- default: `h-10 px-6 py-3`
- lg: `h-12 px-8`
- icon: `h-10 w-10`

**Color Usage:**
| Variant | Background | Text | Border |
|---------|------------|------|--------|
| default | `bg-primary` | `text-primary-foreground` | none |
| secondary | `bg-transparent` | `text-primary` | `border-2 border-primary` |
| accent | `bg-accent` | `text-accent-foreground` | none |
| destructive | `bg-destructive` | `text-destructive-foreground` | none |
| outline | `bg-background` | inherits | `border border-input` |
| ghost | `transparent` | inherits | none |
| link | `transparent` | `text-primary` | none (underline on hover) |

**Visual States:**
- **Default:** Shadow-sm, rounded-lg
- **Hover:** `scale-[1.02]`, shadow-md, darker background
- **Active:** `scale-[0.98]`, darker background, shadow-sm
- **Disabled:** `opacity-50`, `cursor-not-allowed`
- **Loading:** Loader2 icon spinning, children with `animate-pulse-subtle`
- **Focus:** `ring-2 ring-ring ring-offset-2`

**Used On:** All pages (universal component)

---

### Input

**File Path:** `src/components/ui/input.tsx`

**Purpose:** Text input field for forms.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "error" \| "success"` | `"default"` | Visual variant |
| `inputSize` | `"sm" \| "default" \| "lg"` | `"default"` | Size variant |
| `error` | `boolean` | `false` | Error state (overrides variant) |
| `success` | `boolean` | `false` | Success state (overrides variant) |

**Visual Structure:**
```
<input />
```

**Typography:**
- Font: System default
- Size: `text-base` (mobile), `text-sm` (md+)

**Spacing:**
- sm: `h-9 px-3 py-2`
- default: `h-11 px-4 py-3`
- lg: `h-12 px-4 py-3`

**Color Usage:**
- Background: `bg-background`
- Border (default): `border-text-tertiary`
- Border (focus): `border-primary`
- Border (error): `border-destructive` (2px)
- Border (success): `border-success`
- Placeholder: `text-muted-foreground`

**Visual States:**
- **Default:** Border 1px, rounded-md
- **Focus:** Border primary, `ring-2 ring-primary/20`, `scale-[1.01]`
- **Error:** Border destructive 2px, `animate-shake`, ring destructive/20
- **Success:** Border success, padding-right for icon
- **Disabled:** `opacity-50`, `cursor-not-allowed`

**Used On:** LoginPage, RegisterPage, all form pages

---

### Label

**File Path:** `src/components/ui/label.tsx`

**Purpose:** Form field label.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "error"` | `"default"` | Visual variant |

**Typography:**
- Font: `font-medium` (500)
- Size: `text-sm`
- Line height: `leading-none`

**Color Usage:**
- Default: `text-muted-foreground`
- Error: `text-destructive`

**Visual States:**
- **Default:** Muted foreground
- **Error:** Destructive color
- **Disabled (peer):** `opacity-70`, `cursor-not-allowed`

**Used On:** All form pages

---

### Textarea

**File Path:** `src/components/ui/textarea.tsx`

**Purpose:** Multi-line text input.

**Props:** Standard textarea HTML attributes.

**Typography:**
- Size: `text-sm`

**Spacing:**
- Padding: `px-3 py-2`
- Min height: `min-h-[80px]`

**Color Usage:**
- Background: `bg-background`
- Border: `border-input`
- Placeholder: `text-muted-foreground`

**Visual States:**
- **Default:** Rounded-md, border
- **Focus:** `ring-2 ring-ring ring-offset-2`
- **Disabled:** `opacity-50`, `cursor-not-allowed`

**Used On:** AdminEmailPage, feedback forms

---

### Select

**File Path:** `src/components/ui/select.tsx`

**Purpose:** Dropdown selection component.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Error state on trigger |

**Visual Structure:**
```
<SelectTrigger>
  <SelectValue />
  <ChevronDown />
</SelectTrigger>
<SelectContent>
  <SelectItem>...</SelectItem>
</SelectContent>
```

**Typography:**
- Trigger: `text-sm`
- Items: `text-sm`

**Spacing:**
- Trigger: `h-11 px-4 py-3`
- Items: `py-2 pl-8 pr-2`
- Content: `p-1`

**Color Usage:**
- Background: `bg-background` (trigger), `bg-popover` (content)
- Border: `border-text-tertiary` (default), `border-primary` (focus)
- Item hover: `bg-primary/10`, `text-primary`
- Check icon: `text-primary`

**Visual States:**
- **Default:** Border 1px, rounded-md
- **Focus:** Border primary, ring primary/20
- **Error:** Border destructive 2px
- **Disabled:** `opacity-50`
- **Item Selected:** Check icon visible

**Used On:** TablePagination, filter forms, pledge forms

---

### Badge

**File Path:** `src/components/ui/badge.tsx`

**Purpose:** Status indicator or tag.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "success" \| "warning" \| "pending" \| "info"` | `"default"` | Visual variant |

**Visual Structure:**
```
<div>{children}</div>
```

**Typography:**
- Font: `font-semibold` (600)
- Size: `text-xs`

**Spacing:**
- Padding: `px-2.5 py-0.5`
- Border radius: `rounded-full`

**Color Usage:**
| Variant | Background | Text |
|---------|------------|------|
| default | `bg-primary` | `text-primary-foreground` |
| secondary | `bg-secondary` | `text-secondary-foreground` |
| destructive | `bg-destructive` | `text-destructive-foreground` |
| outline | transparent | `text-foreground` |
| success | `bg-accent-green/20` | `text-accent-green` |
| warning | `bg-warning/20` | `text-warning` |
| pending | `bg-accent-gold/20` | `text-accent-gold` |
| info | `bg-primary/20` | `text-primary` |

**Visual States:**
- **Hover:** 80% opacity on background
- **Focus:** `ring-2 ring-ring ring-offset-2`

**Used On:** PledgeCard, AdminDashboard, status indicators

---

### Progress

**File Path:** `src/components/ui/progress.tsx`

**Purpose:** Linear progress indicator.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress percentage (0-100) |

**Visual Structure:**
```
<div (track)>
  <div (indicator) />
</div>
```

**Spacing:**
- Height: `h-4`
- Width: `w-full`

**Color Usage:**
- Track: `bg-secondary`
- Indicator: `bg-primary`

**Visual States:**
- **Default:** Rounded-full, overflow hidden
- **Animated:** Indicator transitions with `transition-all`

**Used On:** StudentCard, MobileStudentCard, ClassFundraisingShelf

---

### Skeleton

**File Path:** `src/components/ui/skeleton.tsx`

**Purpose:** Loading placeholder.

**Props:** Standard div HTML attributes.

**Visual Structure:**
```
<div (pulsing placeholder) />
```

**Color Usage:**
- Background: `bg-muted`

**Animation:**
- `animate-pulse`

**Used On:** All pages during loading states

---

### Checkbox

**File Path:** `src/components/ui/checkbox.tsx`

**Purpose:** Binary selection input.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state |
| `onCheckedChange` | `function` | — | Change handler |
| `disabled` | `boolean` | `false` | Disable interactions |

**Visual Structure:**
```
<CheckboxPrimitive.Root>
  <CheckboxPrimitive.Indicator>
    <Check (icon) />
  </CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
```

**Spacing:**
- Size: `h-5 w-5`
- Icon: `h-3.5 w-3.5` with `stroke-[3]`

**Color Usage:**
- Background (unchecked): `bg-background`
- Border (unchecked): `border-text-tertiary`
- Background (checked): `bg-primary`
- Border (checked): `border-primary`
- Icon: `text-primary-foreground`

**Visual States:**
- **Default:** Rounded-[4px], border 1px
- **Checked:** Primary background, Check icon visible
- **Focus:** `ring-2 ring-primary ring-offset-2`
- **Disabled:** `opacity-50`, `cursor-not-allowed`

**Used On:** VerifyLogsPage, AdminOutstandingPage, SponsorRequestsPage, FamilySponsorPage

---

## Form Components

### FormField

**File Path:** `src/components/ui/form-field.tsx`

**Purpose:** Wrapper for form inputs with label, helper text, and error display.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Field label |
| `htmlFor` | `string` | — | Associated input ID |
| `helperText` | `string` | — | Helper text below input |
| `error` | `string` | — | Error message |
| `required` | `boolean` | `false` | Show required asterisk |
| `children` | `ReactNode` | — | Input element |

**Visual Structure:**
```
<div>
  <Label>{label} {required && *}</Label>
  {children}
  {helperText && <p (helper) />}
  {error && <p (error) />}
</div>
```

**Typography:**
- Label: `text-sm font-medium`
- Helper/Error: `text-xs`

**Spacing:**
- Gap: `space-y-2`

**Color Usage:**
- Label: `text-muted-foreground` (default), `text-destructive` (error)
- Helper: `text-muted-foreground`
- Error: `text-destructive`
- Required asterisk: `text-destructive`

**Used On:** All form pages

---

### PledgeAmountForm

**File Path:** `src/components/pledge/PledgeAmountForm.tsx`

**Purpose:** Multi-step form for setting pledge type and amount.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `pledgeType` | `"per_minute" \| "flat"` | Current pledge type |
| `perMinuteAmount` | `string` | Per-minute rate |
| `flatAmount` | `string` | Flat amount |
| `maxPledgeCap` | `string` | Max cap for per-minute |
| `projectedMinutes` | `number` | Goal minutes for projection |
| `onPledgeTypeChange` | `function` | Handler |
| `onPerMinuteChange` | `function` | Handler |
| `onFlatAmountChange` | `function` | Handler |
| `onMaxCapChange` | `function` | Handler |
| `recipientName` | `string` | Display name for recipient |

**Visual Structure:**
```
<div (hand-drawn border container)>
  <h2>Set Your Pledge</h2>
  <Step 1: Pledge Type Radio Group>
    <RadioCard: Per Minute>
    <RadioCard: Flat Amount>
  </Step 1>
  <Step 2: Amount Selection>
    <Preset Buttons Grid (4 columns)>
    <Custom Input>
    {perMinute && <Max Cap Input>}
  </Step 2>
  <Summary Box (projected amount)>
</div>
```

**Typography:**
- Heading: `font-serif text-2xl`
- Step numbers: `text-sm font-bold`
- Preset buttons: `text-lg font-medium`

**Spacing:**
- Container: `p-6 md:p-8`
- Steps: `space-y-6`
- Preset grid: `gap-3`

**Color Usage:**
- Container: `bg-background`
- Border: Hand-drawn style (`#41403E`)
- Selected preset: `border-primary bg-primary/10 text-primary`
- Summary: `bg-primary/5 border-primary/20`

**Visual States:**
- **Radio selected:** `border-primary bg-primary/5`
- **Preset selected:** `border-primary bg-primary/10`
- **Has projected amount:** Summary box visible with CheckCircle icon

**Used On:** SponsorPledgePage, FamilySponsorPage, OnboardingPledge

---

## Card Components

### Card

**File Path:** `src/components/ui/card.tsx`

**Purpose:** Basic content container.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `interactive` | `boolean` | `false` | Enable hover effects |

**Sub-components:**
- `CardHeader`: Header section
- `CardTitle`: Title element (h3)
- `CardDescription`: Description paragraph
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Visual Structure:**
```
<Card>
  <CardHeader>
    <CardTitle />
    <CardDescription />
  </CardHeader>
  <CardContent />
  <CardFooter />
</Card>
```

**Typography:**
- CardTitle: `text-2xl font-semibold`
- CardDescription: `text-sm text-muted-foreground`

**Spacing:**
- CardHeader: `p-6`, `space-y-1.5`
- CardContent: `p-6 pt-0`
- CardFooter: `p-6 pt-0`

**Color Usage:**
- Background: `bg-card`
- Text: `text-card-foreground`
- Border: `border`

**Visual States:**
- **Default:** `rounded-lg shadow-sm`
- **Interactive hover:** `translate-y-[-0.5]`, `shadow-lg`
- **Interactive active:** `animate-flash`

**Used On:** DashboardPage, admin pages, settings

---

### DataCard

**File Path:** `src/components/ui/data-card.tsx`

**Purpose:** Card with optional header and action.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `header` | `ReactNode` | Header content |
| `headerAction` | `ReactNode` | Action element in header |
| `children` | `ReactNode` | Card content |

**Visual Structure:**
```
<div>
  {header && (
    <div (header row)>
      <div (header) />
      {headerAction}
    </div>
  )}
  {children}
</div>
```

**Typography:**
- Header: `font-medium text-foreground`

**Spacing:**
- Container: `p-4`
- Header: `pb-4 mb-4`
- Header border: `border-b border-border`

**Color Usage:**
- Background: `bg-card`
- Shadow: `shadow-sm`

**Visual States:**
- **Hover:** `shadow-md`

**Used On:** DashboardPage, data displays

---

### StatCard

**File Path:** `src/components/ui/stat-card.tsx`

**Purpose:** Display a single statistic with icon and optional trend.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `value` | `string \| number` | Stat value |
| `label` | `string` | Stat label |
| `icon` | `LucideIcon` | Optional icon |
| `trend` | `{ value: number, isPositive: boolean }` | Optional trend indicator |

**Visual Structure:**
```
<div>
  <div (row)>
    {icon && <div (icon container)><Icon /></div>}
    <div (column)>
      <span (value)>{value}</span>
      <span (label)>{label}</span>
      {trend && <span (trend)>↑/↓ {value}%</span>}
    </div>
  </div>
</div>
```

**Typography:**
- Value: `text-4xl font-semibold`
- Label: `text-sm`
- Trend: `text-xs`

**Spacing:**
- Container: `p-4`
- Icon container: `h-10 w-10`
- Gap: `gap-3`

**Color Usage:**
- Background: `bg-secondary`
- Icon container: `bg-primary/10`
- Icon: `text-primary`
- Value: `text-primary`
- Label: `text-muted-foreground`
- Trend positive: `text-accent-green`
- Trend negative: `text-destructive`

**Visual States:**
- **Hover:** `shadow-sm`

**Used On:** AdminDashboard, TeacherDashboard, finance pages

---

### StudentCard

**File Path:** `src/components/ui/student-card.tsx`

**Purpose:** Display student info with avatar, progress, and actions.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Student name |
| `gradeInfo` | `string` | Grade/class info |
| `avatarUrl` | `string` | Optional avatar URL |
| `avatarInitials` | `string` | Fallback initials |
| `progress` | `{ current: number, goal: number }` | Optional progress |
| `onViewDetails` | `function` | View details handler |
| `onLogReading` | `function` | Log reading handler |

**Visual Structure:**
```
<div>
  <div (row)>
    <Avatar />
    <div (info)>
      <h3>{name}</h3>
      <p>{gradeInfo}</p>
    </div>
    {progress && <ProgressCircle />}
  </div>
  {actions && (
    <div (actions row)>
      <Button>View Details</Button>
      <Button>Log Reading</Button>
    </div>
  )}
</div>
```

**Typography:**
- Name: `text-lg font-medium`
- Grade: `text-sm text-muted-foreground`
- Progress: `text-xs font-medium`

**Spacing:**
- Container: `p-4`
- Avatar: `h-12 w-12`
- Progress circle: `h-12 w-12`
- Actions: `gap-2 mt-4 pt-4`
- Actions border: `border-t border-border`

**Color Usage:**
- Background: `bg-card`
- Avatar fallback: `bg-muted text-muted-foreground`
- Progress track: `stroke-muted`
- Progress indicator: `stroke-primary`
- Progress text: `text-primary`

**Visual States:**
- **Hover:** `shadow-md`

**Used On:** DashboardPage, TeacherDashboard, ManageChildrenPage

---

### PledgeCard

**File Path:** `src/components/ui/pledge-card.tsx`

**Purpose:** Display pledge information with status and payment action.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `sponsorName` | `string` | Sponsor name |
| `relationship` | `string` | Relationship to student |
| `pledgeType` | `"per-minute" \| "flat"` | Pledge type |
| `pledgeAmount` | `number` | Pledge amount/rate |
| `status` | `"pending" \| "paid" \| "cancelled"` | Status |
| `calculatedAmount` | `number` | Total calculated amount |
| `minutesRead` | `number` | Minutes for per-minute pledges |
| `onPaymentAction` | `function` | Payment action handler |

**Visual Structure:**
```
<div>
  <div (header)>
    <div>
      <h3>{sponsorName}</h3>
      <p>{relationship}</p>
    </div>
    <Badge>{status}</Badge>
  </div>
  <div (details)>
    <Row: Pledge Type />
    <Row: Rate/Amount />
    {perMinute && <Row: Minutes Read />}
  </div>
  {calculatedAmount && <Row: Total Pledge />}
  {pending && <Button>Record Payment</Button>}
</div>
```

**Typography:**
- Sponsor name: `text-lg font-medium`
- Relationship: `text-sm text-muted-foreground`
- Details: `text-sm`
- Total: `text-xl font-semibold`

**Spacing:**
- Container: `p-4`
- Details section: `py-3`
- Details border: `border-t border-b border-border`

**Color Usage:**
- Background: `bg-card`
- Total amount: `text-primary`
- Badge variants per status

**Visual States:**
- **Hover:** `shadow-md`
- **Pending:** Payment button visible

**Used On:** MyPledgesPage, SponsorDashboardPage, ChildDetailsPage

---

### MobileStudentCard

**File Path:** `src/components/mobile/MobileStudentCard.tsx`

**Purpose:** Mobile-optimized student card with swipe actions and expandable details.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Student name |
| `gradeInfo` | `string` | Grade info |
| `avatarUrl` | `string` | Avatar URL |
| `avatarInitials` | `string` | Fallback initials |
| `progress` | `{ current, goal }` | Progress data |
| `lastActive` | `string` | Last activity |
| `status` | `"exceeding" \| "on-track" \| "needs-attention"` | Status indicator |
| `onViewDetails` | `function` | Handler |
| `onLogReading` | `function` | Handler |
| `onEdit` | `function` | Handler |
| `onDelete` | `function` | Handler |

**Visual Structure:**
```
<div>
  <div (swipe actions background)>
    <EditButton />
    <DeleteButton />
  </div>
  <div (main card, translates on swipe)>
    <Avatar />
    <Info + Status Dot />
    <Progress Bar />
    <ChevronDown/Up />
    <OverflowMenu />
  </div>
  {expanded && (
    <div (details)>
      <StatGrid: Current/Goal />
      <LastActive />
      <ActionButtons />
    </div>
  )}
</div>
```

**Typography:**
- Name: `text-base font-medium`
- Grade: `text-sm text-muted-foreground`
- Progress: `text-xs font-medium`
- Stat values: `font-handwritten text-xl`

**Spacing:**
- Container: `p-4`
- Avatar: `h-12 w-12`
- Expanded details: `p-4`
- Action buttons: `h-11`

**Color Usage:**
- Background: `bg-card`
- Swipe edit: `bg-brand-blue text-white`
- Swipe delete: `bg-destructive text-destructive-foreground`
- Status dot exceeding: `bg-brand-green`
- Status dot on-track: `bg-brand-blue`
- Status dot needs-attention: `bg-amber-500`

**Visual States:**
- **Default:** Collapsed
- **Expanded:** Details section visible with `animate-fade-in`
- **Swiping:** Card translates horizontally
- **Swiped:** Shows edit/delete buttons

**Used On:** Mobile dashboard views, ManageChildrenPage (mobile)

---

## Layout Components

### MainNav

**File Path:** `src/components/layout/MainNav.tsx`

**Purpose:** Primary navigation header for all pages.

**Props:** None (uses hooks for auth state)

**Visual Structure:**
```
<header (desktop)>
  <Logo />
  <nav>
    {authenticated ? (
      <Dashboard Link />
      <Account Dropdown />
    ) : (
      <How It Works Link />
      <Login Button />
      <SignUp Dropdown />
    )}
  </nav>
  {notifications && <NotificationBadge />}
</header>
<header (mobile)>
  <Logo />
  <MenuButton />
  {notifications && <NotificationBadge />}
</header>
<MobileNavDrawer />
```

**Typography:**
- Nav links: `text-xs font-semibold tracking-widest`

**Spacing:**
- Desktop: `h-20` (home), `h-22` (other pages)
- Mobile: `h-14`
- Desktop padding: container with margins
- Mobile padding: `px-4`

**Color Usage:**
- Background: `bg-white/90 backdrop-blur-sm`
- Border: `border-b border-slate-100`
- Links: `text-muted-foreground`, `hover:text-foreground`
- Notification badge: `bg-destructive text-destructive-foreground`

**Visual States:**
- **Sticky:** Fixed at top, z-50
- **Home page:** Larger logo, different header height
- **Authenticated:** Dashboard + Account links
- **Unauthenticated:** How It Works + Login/SignUp

**Used On:** All pages (universal component)

---

### Footer

**File Path:** `src/components/layout/Footer.tsx`

**Purpose:** Site footer with links and social icons.

**Visual Structure:**
```
<footer>
  <div (mobile: stacked)>
    <Links: FAQ | Contact | Privacy />
    <SocialIcons />
  </div>
  <div (desktop: horizontal)>
    <Links: About | FAQ | Contact | Privacy />
    <SocialIcons />
  </div>
  <Copyright />
</footer>
```

**Typography:**
- Links: `text-sm`
- Copyright: `text-xs`

**Spacing:**
- Container: `py-6 md:py-8`
- Links gap: `gap-4` (mobile), `gap-6` (desktop)

**Color Usage:**
- Background: `bg-white/80 backdrop-blur-sm`
- Border: `border-t border-slate-200`
- Links: `text-slate-600`, `hover:text-slate-900`
- Social icons: `text-slate-400`, `hover:text-slate-600`
- Copyright: `text-slate-400`

**Used On:** All public pages

---

### BottomTabBar

**File Path:** `src/components/layout/BottomTabBar.tsx`

**Purpose:** Mobile navigation tab bar at bottom of screen.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `role` | `"parent" \| "student" \| "teacher" \| "sponsor" \| "admin" \| null` | User role for tab configuration |

**Visual Structure:**
```
<nav (fixed bottom)>
  {tabs.map(tab => (
    <Link>
      <Icon />
      <span>{label}</span>
    </Link>
  ))}
</nav>
```

**Typography:**
- Labels: `text-xs font-medium`

**Spacing:**
- Height: `h-16`
- Safe area: `safe-area-inset-bottom`

**Color Usage:**
- Background: `bg-card`
- Border: `border-t`
- Active tab: `text-primary`
- Inactive tab: `text-muted-foreground`

**Visual States:**
- **Active:** Primary color for icon and label
- **Inactive:** Muted foreground
- **Hidden:** On desktop (md+)

**Used On:** All authenticated pages (mobile only)

---

### AdminPageLayout

**File Path:** `src/components/layout/AdminPageLayout.tsx`

**Purpose:** Standard layout wrapper for admin pages.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title |
| `subtitle` | `ReactNode` | Optional subtitle |
| `actions` | `ReactNode` | Action buttons |
| `children` | `ReactNode` | Page content |

**Visual Structure:**
```
<div>
  <MainNav />
  <AdminNavBar>
    {adminNavItems.map(item => <NavLink />)}
  </AdminNavBar>
  <main>
    <PageHeader>
      <Title with highlighter effect />
      {subtitle}
      {actions}
    </PageHeader>
    {children}
    <BottomTabSpacer />
  </main>
  <Footer />
  <BottomTabBar role="admin" />
</div>
```

**Typography:**
- Title: `font-serif text-4xl md:text-5xl lg:text-6xl font-normal`
- Active nav item: `text-sm font-medium`

**Spacing:**
- Admin nav: `py-2`
- Main content: `py-10 md:py-12`
- Header margin: `mb-10`

**Color Usage:**
- Main background: `bg-background-warm`
- Active nav: `bg-primary text-primary-foreground`
- Title highlighter: `bg-warning/45`
- Hand-drawn border on active nav item

**Used On:** All admin pages

---

### PageHeader

**File Path:** `src/components/layout/PageHeader.tsx`

**Purpose:** Simple header with logo for pages without hero section.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `rightContent` | `ReactNode` | Optional right-side content |

**Visual Structure:**
```
<header>
  <Link to="/">
    <Logo size="hero" />
  </Link>
  {rightContent}
</header>
```

**Spacing:**
- Container: `py-4`
- Logo max-width: `w-[405px] max-w-[60vw]`

**Color Usage:**
- Background: `bg-card`
- Border: `border-b`

**Used On:** Sponsor flows, onboarding, standalone pages

---

### MobileNavDrawer

**File Path:** `src/components/layout/MobileNavDrawer.tsx`

**Purpose:** Slide-out navigation menu for mobile.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Open state |
| `onOpenChange` | `function` | State handler |

**Visual Structure:**
```
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="right">
    <nav>
      {links.map(link => <NavLink />)}
    </nav>
    {authenticated && (
      <div>
        <Button>Dashboard</Button>
        <Button>Log Out</Button>
      </div>
    )}
  </SheetContent>
</Sheet>
```

**Used On:** MainNav (mobile view)

---

### LogoBanner

**File Path:** `src/components/layout/LogoBanner.tsx`

**Purpose:** Large logo banner for public pages. Currently returns null (disabled).

**Visual Structure:**
```
// Currently returns null
// Previously displayed large centered logo below MainNav
```

**Used On:** PublicLayout (but renders nothing)

---

## Legacy Components

### BookContainer

**File Path:** `src/components/legacy/BookContainer.tsx`

**Purpose:** Book-shaped container with curved corner (legacy motif).

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "warm" \| "accent"` | `"default"` | Background variant |
| `shadowLevel` | `"subtle" \| "normal" \| "prominent"` | `"normal"` | Shadow intensity |

**Visual Structure:**
```
<div class="book-container">
  <div class="book-container-content">
    {children}
  </div>
</div>
```

**Spacing:**
- Padding: `6% 5% 2% 8%`
- Content padding-top: `max(2rem, 3vw)`

**Color Usage:**
- default: `bg-card`
- warm: `bg-background-warm`
- accent: `bg-background-warmer`

**Border Radius:**
- `0 8vw 0 0` (curved top-right corner)

**Shadow:**
- `var(--shadow-book)`: `3px 3px 6px 3px rgba(0,0,0,0.3)`

**Used On:** SponsorCheckEmailPage, SponsorPledgedPage, onboarding

---

### ReadingGoalRing

**File Path:** `src/components/legacy/ReadingGoalRing.tsx`

**Purpose:** Circular progress indicator with pencil pattern fill and overflow behavior.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | — | Current minutes read |
| `goal` | `number` | — | Goal minutes |
| `size` | `number` | `220` | Ring size in pixels |
| `mobileSize` | `number` | — | Optional smaller size for mobile |
| `showLabel` | `boolean` | `true` | Show percentage label below |

**Visual Structure:**
```
<div (container)>
  {circles.map(circle => (
    <div class="progress-ring-container">
      <svg>
        <defs><pattern (pencil pattern) /></defs>
        <circle (background) />
        <circle (progress arc with pattern fill) />
      </svg>
    </div>
  ))}
  {showLabel && (
    <div (label)>
      <span>{percentage}%</span>
      <span>{progress}/{goal} min</span>
    </div>
  )}
</div>
```

**Typography:**
- Percentage: `font-serif text-3xl/text-4xl text-brand-blue`
- Label: `text-sm text-muted-foreground`

**Spacing:**
- Container height: `size + 70`
- Circles overlap: `20px` offset

**Color Usage:**
- Ring background: `#E6EAF1`
- Progress fill: Pencil pattern image (`pencil-pattern-blue.png`)
- Border: `0.5px solid #41403E`

**Visual States:**
- **Under 100%:** Single circle
- **Over 100%:** Multiple overlapping circles (one per 100%)
- **Animated:** `transition-all duration-500 ease-out`

**Used On:** DashboardPage, MobileProgressDisplay, SponsorPledgedPage

---

### Logo

**File Path:** `src/components/legacy/Logo.tsx`

**Purpose:** Application logo.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"default" \| "hero"` | `"default"` | Size variant |

**Used On:** MainNav, PageHeader, Footer

---

## Mobile-Specific Components

### MobileMinutesStepper

**File Path:** `src/components/mobile/MobileMinutesStepper.tsx`

**Purpose:** Touch-friendly minutes input with presets and custom entry.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current value |
| `onChange` | `function` | — | Change handler |
| `min` | `number` | `1` | Minimum value |
| `max` | `number` | `180` | Maximum value |

**Visual Structure:**
```
<div>
  <div (stepper buttons)>
    <Button (minus 5)>-</Button>
    <div (value display)>
      <span>{value}</span>
      <span>minutes</span>
    </div>
    <Button (plus 5)>+</Button>
  </div>
  <div (2x2 preset grid)>
    {[15, 30, 45, 60].map(preset => (
      <button>
        <BookOpen />
        <span>{preset} min</span>
      </button>
    ))}
  </div>
  {customInput ? <Input /> : <Button>Enter exact minutes</Button>}
</div>
```

**Typography:**
- Value: `font-serif text-6xl text-brand-blue`
- Units: `text-lg text-muted-foreground`
- Presets: `font-handwritten text-xl text-brand-blue`

**Spacing:**
- Stepper buttons: `h-14 w-14`
- Preset grid: `gap-3`
- Preset buttons: `p-4`

**Color Usage:**
- Stepper hover: `bg-brand-blue text-white border-brand-blue`
- Selected preset: `border-brand-blue bg-brand-blue/10`

**Visual States:**
- **Default:** Stepper with increment/decrement
- **Preset selected:** Blue border, light blue background
- **Custom input mode:** Shows input field with Set/Cancel buttons

**Used On:** LogReadingPage, StudentLogReadingPage, TeacherLogReading

---

### MobileProgressDisplay

**File Path:** `src/components/mobile/MobileProgressDisplay.tsx`

**Purpose:** Swipeable progress display for multiple children.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `children` | `ChildProgress[]` | Array of child progress data |

**Visual Structure:**
```
<div>
  {multipleChildren ? (
    <>
      <div (horizontal scroll snap)>
        {children.map(child => (
          <div (snap item)>
            <p>{name}</p>
            <ReadingGoalRing />
          </div>
        ))}
      </div>
      <PaginationDots />
    </>
  ) : (
    <SingleChildDisplay />
  )}
  <div (horizontal scroll stats)>
    {children.map(child => <StatCard />)}
  </div>
</div>
```

**Typography:**
- Name: `font-handwritten text-xl text-brand-blue`
- Stat card name: `text-xs text-muted-foreground`
- Stat value: `font-handwritten text-lg text-brand-blue`

**Spacing:**
- Horizontal padding: `-mx-4 px-4`
- Stats gap: `gap-3`
- Stat cards: `min-w-[120px] p-3`

**Color Usage:**
- Active stat card: `bg-brand-blue/10 border-brand-blue/30`
- Inactive stat card: `bg-muted/50`
- Active pagination dot: `w-6 bg-brand-blue`
- Inactive dot: `w-2 bg-muted-foreground/30`

**Visual States:**
- **Single child:** Centered display
- **Multiple children:** Swipeable with dots
- **Selected stat:** Blue background tint

**Used On:** DashboardPage (mobile)

---

## Feedback Components

### EmptyState

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Display when no data is available.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `icon` | `ReactNode` | Optional icon |
| `title` | `string` | Title text |
| `description` | `string` | Description text |
| `action` | `{ label, onClick?, href? }` | Primary action |
| `secondaryAction` | `{ label, onClick?, href? }` | Secondary action |

**Pre-built variants:**
- `EmptyChildren` - No children added
- `EmptyReadingLogs` - No reading sessions
- `EmptyPledges` - No sponsors yet
- `EmptySearchResults` - No search results
- `EmptyStudents` - No students in class
- `EmptyData` - Generic no data
- `EmptyFolder` - Empty folder

**Visual Structure:**
```
<div (centered flex column)>
  {icon && <div (icon circle)>{icon}</div>}
  <h3>{title}</h3>
  <p>{description}</p>
  <div (actions)>
    {action && <Button>+ {label}</Button>}
    {secondaryAction && <Button variant="outline">{label}</Button>}
  </div>
</div>
```

**Typography:**
- Title: `font-serif text-xl font-medium`
- Description: `text-muted-foreground`

**Spacing:**
- Container: `py-12 px-4`
- Icon circle: `h-24 w-24 mb-6`
- Description max-width: `max-w-sm`
- Actions margin: `mb-6`
- Actions gap: `gap-3`

**Color Usage:**
- Icon circle: `bg-muted/50`
- Icon: `text-muted-foreground` (h-12 w-12)

**Used On:** All data listing pages when empty

---

### ErrorState

**File Path:** `src/components/ui/error-states.tsx`

**Purpose:** Display error conditions.

**Props:** Same as EmptyState

**Pre-built variants:**
- `ConnectionError` - Network issues
- `NotFoundError` - 404 page
- `PermissionDenied` - Access denied
- `GenericError` - Unexpected error
- `FormError` - Form submission error (inline)
- `ErrorBoundaryFallback` - React error boundary

**Visual Structure:**
```
<div role="alert">
  {icon && <div (error icon circle)>{icon}</div>}
  <h3>{title}</h3>
  <p>{description}</p>
  <Actions />
</div>
```

**Typography:**
- Same as EmptyState

**Color Usage:**
- Icon circle: `bg-destructive/10`
- Icon: `text-destructive` (h-10 w-10)
- FormError container: `bg-destructive/10 border-destructive/30`

**Used On:** Error boundaries, failed API calls, 404 page

---

### LoadingSpinner

**File Path:** `src/components/ui/loading-spinner.tsx`

**Purpose:** Loading indicators in various sizes and contexts.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Spinner size |
| `label` | `string` | `"Loading..."` | Accessible label |
| `fullScreen` | `boolean` | `false` | Full screen mode |

**Variants:**
- `LoadingSpinner` - Standalone spinner
- `InlineLoading` - Inline with text
- `PageLoading` - Full page overlay
- `SectionLoading` - Wrapper with fallback
- `DotsLoader` - Pulsing dots

**Size Classes:**
- sm: `h-4 w-4`
- md: `h-6 w-6`
- lg: `h-10 w-10`
- xl: `h-12 w-12`

**Color Usage:**
- Spinner: `text-brand-blue`
- Label: `text-muted-foreground`
- PageLoading overlay: `bg-background/80 backdrop-blur-sm`

**Used On:** All pages during loading

---

### ConfirmDialog

**File Path:** `src/components/ui/confirm-dialog.tsx`

**Purpose:** Confirmation dialog for destructive or important actions.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Open state |
| `onOpenChange` | `function` | — | State handler |
| `title` | `string` | — | Dialog title |
| `description` | `string` | — | Dialog description |
| `confirmLabel` | `string` | `"Confirm"` | Confirm button text |
| `cancelLabel` | `string` | `"Cancel"` | Cancel button text |
| `variant` | `"default" \| "destructive"` | `"default"` | Visual variant |
| `onConfirm` | `function` | — | Confirm handler |
| `icon` | `ReactNode` | — | Optional icon |
| `loading` | `boolean` | `false` | Loading state |

**Pre-built variants:**
- `DeleteConfirm` - Delete item confirmation
- `LogoutConfirm` - Logout confirmation
- `DiscardChangesConfirm` - Unsaved changes warning
- `CancelPledgeConfirm` - Cancel pledge confirmation

**Hook:**
- `useConfirmDialog()` - Returns `{ isOpen, setIsOpen, confirm, handleConfirm, handleCancel }`

**Visual Structure:**
```
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      {icon && <IconCircle />}
      <AlertDialogTitle (centered)>{title}</AlertDialogTitle>
      <AlertDialogDescription (centered)>{description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter (centered)>
      <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
      <AlertDialogAction>{confirmLabel}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Typography:**
- Title: `text-lg font-semibold`
- Description: `text-sm text-muted-foreground`

**Color Usage:**
- Default icon circle: `bg-muted`
- Destructive icon circle: `bg-destructive/10`
- Destructive action: `bg-destructive text-destructive-foreground`

**Used On:** Delete actions, logout, form cancellation

---

## Data Display Components

### TablePagination

**File Path:** `src/components/ui/table-pagination.tsx`

**Purpose:** Pagination controls for tables.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | — | Current page |
| `totalPages` | `number` | — | Total pages |
| `pageSize` | `number` | — | Items per page |
| `totalItems` | `number` | — | Total item count |
| `onPageChange` | `function` | — | Page change handler |
| `onPageSizeChange` | `function` | — | Page size handler |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Size options |

**Hook:**
- `usePagination(totalItems, initialPageSize)` - Returns pagination state and handlers

**Visual Structure:**
```
<div>
  <div (info)>
    <span>Showing {start}-{end} of {total}</span>
    {onPageSizeChange && <Select>Rows: {pageSize}</Select>}
  </div>
  <div (navigation)>
    <Button (first page) />
    <Button (prev) />
    <span>Page {current} of {total}</span>
    <Button (next) />
    <Button (last page) />
  </div>
</div>
```

**Typography:**
- Info text: `text-sm text-muted-foreground`
- Page text: `text-sm`

**Spacing:**
- Container: `px-2 py-4`
- Nav buttons: `h-8 w-8`
- Page text padding: `px-3`

**Color Usage:**
- Button variant: `outline`
- Disabled buttons: `opacity-50`

**Used On:** AdminReadingLogsPage, AdminOutstandingPage, admin tables

---

### ClassFundraisingShelf

**File Path:** `src/components/ui/class-fundraising-shelf.tsx`

**Purpose:** Bookshelf progress visualization for class fundraising goals.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `fundedAmount` | `number` | Current amount raised |
| `goalAmount` | `number` | Goal amount |
| `rewardLabel` | `string` | Optional reward text |

**Visual Structure:**
```
<div>
  <div (shelf container, 65px height)>
    <div (grayscale base layer - tiled background) />
    <div (saturated overlay - clipped by percentage) />
    {complete && <span>🎉</span>}
  </div>
  <div (thin progress bar) />
  <div (labels)>
    <span>${funded} / ${goal}</span>
    <span>{percentage}% {rewardLabel}</span>
  </div>
  <span (sr-only)>Progress description</span>
</div>
```

**Spacing:**
- Shelf height: `65px`
- Progress bar: `h-1.5 mt-1`
- Labels: `mt-1 text-xs`

**Color Usage:**
- Grayscale layer: `filter: saturate(0)`
- Progress bar: gradient `from-primary via-accent to-success`
- Funded amount: `font-semibold text-foreground`
- Goal: default text
- Percentage: `text-muted-foreground`
- Reward: `font-medium text-success`

**Visual States:**
- **Under 100%:** Grayscale portion visible
- **Complete:** 🎉 emoji with `animate-bounce`

**Used On:** TeacherDashboard, DashboardPage (class milestone section)

---

## Celebration Components

### Confetti

**File Path:** `src/components/ui/celebrations.tsx`

**Purpose:** Confetti particle animation for celebrations.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | — | Trigger animation |
| `particleCount` | `number` | `30` | Number of particles |
| `duration` | `number` | `2500` | Animation duration (ms) |
| `colors` | `string[]` | Brand colors | Particle colors |

**Visual Structure:**
```
<div (fixed overlay)>
  {pieces.map(piece => (
    <div (particle with random position, color, delay) />
  ))}
</div>
```

**Color Usage:**
Default colors:
- `hsl(var(--brand-yellow))`
- `hsl(var(--brand-blue))`
- `#FF6B6B`
- `#4ECDC4`
- `#45B7D1`
- `#96CEB4`
- `#A855F7`

**Animation:**
- `animate-confetti` (falls from top)
- Respects `prefers-reduced-motion`

**Used On:** Goal completion, milestone achievement

---

### StarBurst

**File Path:** `src/components/ui/celebrations.tsx`

**Purpose:** Radiating star animation for achievements.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | — | Trigger animation |
| `x` | `number` | `50` | X position (%) |
| `y` | `number` | `50` | Y position (%) |
| `starCount` | `number` | `8` | Number of stars |

**Animation:**
- `animate-star-burst`
- 600ms duration
- Respects `prefers-reduced-motion`

**Color Usage:**
- Star fill: `hsl(var(--brand-yellow))`

**Used On:** Milestone achievements

---

### ParticleBurst

**File Path:** `src/components/ui/celebrations.tsx`

**Purpose:** Particle explosion from center.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | — | Trigger |
| `particleCount` | `number` | `12` | Particles |
| `colors` | `string[]` | Default colors | Particle colors |

**Animation:**
- `animate-particle-burst`
- 800ms duration

**Used On:** Goal reached celebrations

---

## Modal Components

### Dialog

**File Path:** `src/components/ui/dialog.tsx`

**Purpose:** Modal dialog container.

**Sub-components:**
- `Dialog` - Root
- `DialogTrigger` - Trigger element
- `DialogContent` - Content container
- `DialogHeader` - Header section
- `DialogTitle` - Title
- `DialogDescription` - Description
- `DialogFooter` - Footer with actions
- `DialogClose` - Close button

**Visual Structure:**
```
<Dialog>
  <DialogTrigger />
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogHeader>
        <DialogTitle />
        <DialogDescription />
      </DialogHeader>
      {content}
      <DialogFooter />
      <DialogClose />
    </DialogContent>
  </DialogPortal>
</Dialog>
```

**Typography:**
- Title: `text-lg font-semibold`
- Description: `text-sm text-muted-foreground`

**Spacing:**
- Content: `p-6 gap-4`
- Header: `space-y-1.5`
- Max width: `max-w-lg`

**Color Usage:**
- Overlay: `bg-black/80`
- Content: `bg-background border shadow-lg`

**Animation:**
- Open: `animate-in fade-in-0 zoom-in-95`
- Close: `animate-out fade-out-0 zoom-out-95`

**Used On:** EditChildDialog, EditPledgeDialog, all modal forms

---

### Sheet

**File Path:** `src/components/ui/sheet.tsx`

**Purpose:** Slide-out panel from screen edge for navigation, forms, or detailed content.

**Sub-components:**
- `Sheet` - Root (uses @radix-ui/react-dialog)
- `SheetTrigger` - Element that opens sheet
- `SheetContent` - The sliding panel
- `SheetHeader` - Header container
- `SheetTitle` - Title text
- `SheetDescription` - Description text
- `SheetFooter` - Footer with actions
- `SheetClose` - Close button
- `SheetOverlay` - Background overlay
- `SheetPortal` - Portal wrapper

**Props (SheetContent):**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"right"` | Edge from which sheet slides |
| `className` | `string` | - | Additional classes |

**Visual Structure:**
```
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Open Menu</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
      <SheetDescription>Browse sections</SheetDescription>
    </SheetHeader>
    <nav className="flex flex-col gap-2">
      {links.map(link => <NavLink />)}
    </nav>
    <SheetFooter>
      <Button>Close</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

**Typography:**
- Title: `text-lg font-semibold`
- Description: `text-sm text-muted-foreground`

**Spacing:**
- Content: `p-6 gap-4`
- Header: `flex flex-col space-y-2`
- Close button: `absolute right-4 top-4`
- Side widths: `w-3/4 sm:max-w-sm` (left/right), `inset-x-0` (top/bottom)

**Color Usage:**
- Background: `bg-background`
- Overlay: `bg-black/80`
- Border: `border-l` (right), `border-r` (left), `border-t` (bottom), `border-b` (top)

**Animation:**
- Open: `animate-in slide-in-from-[side] duration-500`
- Close: `animate-out slide-out-to-[side] duration-300`
- Overlay: `fade-in-0 / fade-out-0`

**Used On:** TopHeader (mobile nav), AdminUsersPage, AdminFinancePage, Sidebar (mobile), MobileNavDrawer

---

### Popover

**File Path:** `src/components/ui/popover.tsx`

**Purpose:** Floating content panel triggered by click, for date pickers, dropdowns, or contextual info.

**Sub-components:**
- `Popover` - Root (uses @radix-ui/react-popover)
- `PopoverTrigger` - Element that opens popover
- `PopoverContent` - The floating panel

**Props (PopoverContent):**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start" \| "center" \| "end"` | `"center"` | Horizontal alignment |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `className` | `string` | - | Additional classes |

**Visual Structure:**
```
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon />
      Pick a date
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>
```

**Typography:**
- Content inherits from popover foreground

**Spacing:**
- Content: `w-72 p-4 rounded-md`
- Side offset: `4px` default

**Color Usage:**
- Background: `bg-popover`
- Text: `text-popover-foreground`
- Border: `border`
- Shadow: `shadow-md`

**Animation:**
- Open: `animate-in fade-in-0 zoom-in-95`
- Close: `animate-out fade-out-0 zoom-out-95`
- Directional slide: `slide-in-from-[side]-2`

**Used On:** AdminSettingsPage (date picker), AdminEmailPage, MainNav (user menu), LogReadingPage (date picker)

---

### HoverCard

**File Path:** `src/components/ui/hover-card.tsx`

**Purpose:** Content panel that appears on hover for previews or additional info.

**Sub-components:**
- `HoverCard` - Root (uses @radix-ui/react-hover-card)
- `HoverCardTrigger` - Element that triggers on hover
- `HoverCardContent` - The floating content

**Props (HoverCardContent):**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start" \| "center" \| "end"` | `"center"` | Horizontal alignment |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `className` | `string` | - | Additional classes |

**Visual Structure:**
```
<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@username</Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-80">
    <div className="flex gap-4">
      <Avatar />
      <div>
        <h4 className="text-sm font-semibold">User Name</h4>
        <p className="text-sm text-muted-foreground">Bio text...</p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

**Typography:**
- Content inherits from popover foreground

**Spacing:**
- Content: `w-64 p-4 rounded-md`
- Side offset: `4px` default

**Color Usage:**
- Background: `bg-popover`
- Text: `text-popover-foreground`
- Border: `border`
- Shadow: `shadow-md`

**Animation:**
- Open: `animate-in fade-in-0 zoom-in-95`
- Close: `animate-out fade-out-0 zoom-out-95`
- Directional slide: `slide-in-from-[side]-2`

**Used On:** Available for user previews, link previews, contextual help

---

## Skeleton Components

**File Path:** `src/components/ui/skeletons.tsx`

**Purpose:** Pre-built skeleton layouts for common patterns.

**Variants:**
- `CardSkeleton` - Card with avatar and text
- `TableSkeleton` - Table rows
- `ProgressCircleSkeleton` - Circular progress
- `TextSkeleton` - Text paragraphs (heading/paragraph/label variants)
- `StudentCardSkeleton` - Student card layout
- `DashboardSkeleton` - Full dashboard layout

**Props (CardSkeleton):**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hasAvatar` | `boolean` | `true` | Show avatar placeholder |
| `hasActions` | `boolean` | `true` | Show action buttons |
| `lines` | `number` | `2` | Number of text lines |

**Color Usage:**
- Skeleton: `bg-muted animate-pulse`

**Used On:** All data loading states

---

## Additional Core Components

### Avatar

**File Path:** `src/components/ui/avatar.tsx`

**Purpose:** User or entity profile image with fallback.

**Sub-components:**
- `Avatar` - Container
- `AvatarImage` - Image element
- `AvatarFallback` - Fallback content (initials)

**Visual Structure:**
```
<Avatar>
  <AvatarImage src={url} alt={name} />
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>
```

**Spacing:**
- Default: `h-10 w-10`
- Custom sizes via className

**Color Usage:**
- Fallback background: `bg-muted`
- Fallback text: `text-muted-foreground`

**Used On:** MainNav, StudentCard, ManageChildrenPage, ChildDetailsPage

---

### Accordion

**File Path:** `src/components/ui/accordion.tsx`

**Purpose:** Collapsible content sections.

**Sub-components:**
- `Accordion` - Root container
- `AccordionItem` - Individual item
- `AccordionTrigger` - Clickable header
- `AccordionContent` - Collapsible content

**Visual Structure:**
```
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Typography:**
- Trigger: `font-medium`

**Spacing:**
- Item: `border-b`
- Content: `pb-4 pt-0`

**Visual States:**
- **Closed:** Chevron pointing right
- **Open:** Chevron rotates 180°, content animated in

**Used On:** FAQPage

---

### Switch

**File Path:** `src/components/ui/switch.tsx`

**Purpose:** Toggle switch for boolean settings.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `checked` | `boolean` | Current state |
| `onCheckedChange` | `function` | Change handler |
| `disabled` | `boolean` | Disable interaction |

**Visual Structure:**
```
<Switch checked={value} onCheckedChange={onChange} />
```

**Spacing:**
- Track: `h-6 w-11`
- Thumb: `h-5 w-5`

**Color Usage:**
- Track unchecked: `bg-input`
- Track checked: `bg-primary`
- Thumb: `bg-background`

**Visual States:**
- **Unchecked:** Thumb left, gray track
- **Checked:** Thumb right, primary track
- **Disabled:** `opacity-50 cursor-not-allowed`

**Used On:** OnboardingAddChild (allowPublicLink), AdminSettingsPage

---

### DropdownMenu

**File Path:** `src/components/ui/dropdown-menu.tsx`

**Purpose:** Contextual menu with actions.

**Sub-components:**
- `DropdownMenu` - Root
- `DropdownMenuTrigger` - Trigger element
- `DropdownMenuContent` - Menu container
- `DropdownMenuItem` - Menu item
- `DropdownMenuSeparator` - Divider
- `DropdownMenuLabel` - Section label

**Visual Structure:**
```
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Action</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Spacing:**
- Content: `min-w-[8rem] p-1`
- Item: `px-2 py-1.5`

**Color Usage:**
- Content: `bg-popover text-popover-foreground`
- Item hover: `bg-accent text-accent-foreground`
- Destructive item: `text-destructive`

**Used On:** ManageChildrenPage, AdminDashboard, account menus

---

### AlertDialog

**File Path:** `src/components/ui/alert-dialog.tsx`

**Purpose:** Confirmation dialog for destructive actions.

**Sub-components:**
- `AlertDialog` - Root
- `AlertDialogTrigger` - Trigger
- `AlertDialogContent` - Content container
- `AlertDialogHeader` - Header
- `AlertDialogTitle` - Title
- `AlertDialogDescription` - Description
- `AlertDialogFooter` - Actions
- `AlertDialogCancel` - Cancel button
- `AlertDialogAction` - Confirm button

**Visual Structure:**
```
<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Color Usage:**
- Overlay: `bg-black/80`
- Cancel: `bg-secondary`
- Action (destructive): `bg-destructive text-destructive-foreground`

**Used On:** ManageChildrenPage (delete), AdminSettingsPage (end/delete event)

---

### Tabs

**File Path:** `src/components/ui/tabs.tsx`

**Purpose:** Tabbed content navigation.

**Sub-components:**
- `Tabs` - Root container
- `TabsList` - Tab buttons container
- `TabsTrigger` - Tab button
- `TabsContent` - Tab panel

**Visual Structure:**
```
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

**Typography:**
- Trigger: `text-sm font-medium`

**Spacing:**
- List: `h-10 p-1`
- Trigger: `px-3 py-1.5`

**Color Usage:**
- List: `bg-muted`
- Active trigger: `bg-background text-foreground shadow-sm`
- Inactive trigger: `text-muted-foreground`

**Used On:** AdminFinancePage, AdminEmailPage

---

### Tooltip

**File Path:** `src/components/ui/tooltip.tsx`

**Purpose:** Contextual information on hover.

**Sub-components:**
- `TooltipProvider` - Context provider (wrap app)
- `Tooltip` - Root
- `TooltipTrigger` - Trigger element
- `TooltipContent` - Tooltip content

**Visual Structure:**
```
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button disabled>Action</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Explanation text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Typography:**
- Content: `text-sm`

**Spacing:**
- Content: `px-3 py-1.5`
- Side offset: `4px`

**Color Usage:**
- Background: `bg-popover`
- Text: `text-popover-foreground`
- Border: `border`

**Animation:**
- `animate-in fade-in-0 zoom-in-95`

**Used On:** TeacherDashboard (disabled buttons), StudentBooksPage

---

### Collapsible

**File Path:** `src/components/ui/collapsible.tsx`

**Purpose:** Expandable/collapsible section.

**Sub-components:**
- `Collapsible` - Root
- `CollapsibleTrigger` - Toggle trigger
- `CollapsibleContent` - Hidden content

**Visual Structure:**
```
<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">
      Toggle <ChevronDown />
    </Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    Hidden content
  </CollapsibleContent>
</Collapsible>
```

**Animation:**
- Content animates in/out with height transition

**Used On:** ManageChildrenPage (child details), LogReadingPage (history)

---

### RadioGroup

**File Path:** `src/components/ui/radio-group.tsx`

**Purpose:** Single selection from options.

**Sub-components:**
- `RadioGroup` - Container
- `RadioGroupItem` - Radio button

**Visual Structure:**
```
<RadioGroup value={value} onValueChange={onChange}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="r1" />
    <Label htmlFor="r1">Option 1</Label>
  </div>
</RadioGroup>
```

**Spacing:**
- Item: `h-4 w-4`

**Color Usage:**
- Border: `border-primary`
- Checked indicator: `bg-primary`

**Used On:** PledgeAmountForm (pledge type selection)

---

## Book Components

### BookSelector

**File Path:** `src/components/books/BookSelector.tsx`

**Purpose:** Select or create a book for reading log.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Selected book ID or title |
| `onChange` | `function` | Change handler |
| `books` | `Book[]` | Available books |

**Visual Structure:**
```
<div>
  <Input (search) />
  <div (book list)>
    {books.map(book => (
      <button>{book.title}</button>
    ))}
  </div>
  <Button>Add New Book</Button>
</div>
```

**Used On:** LogReadingPage, StudentLogReadingPage, StudentPinDashboardPage

---

### BarcodeScanner

**File Path:** `src/components/books/BarcodeScanner.tsx`

**Purpose:** Scan book ISBN via camera.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onScan` | `function` | ISBN scan handler |
| `onError` | `function` | Error handler |

**Visual Structure:**
```
<div>
  <video (camera preview) />
  <div (scan overlay) />
</div>
```

**Used On:** StudentBooksPage

