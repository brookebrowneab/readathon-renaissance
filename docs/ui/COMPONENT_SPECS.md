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
   - [PublicLayout](#publiclayout)
   - [AdminLayout](#adminlayout)
   - [AdminSidebar](#adminsidebar)
   - [AppBreadcrumbs](#appbreadcrumbs)
   - [MobileHeader](#mobileheader)
   - [TopHeader](#topheader)
5. [Legacy Components](#legacy-components)
   - [BookContainer](#bookcontainer)
   - [ReadingGoalRing](#readinggoalring)
   - [Logo](#logo)
6. [Mobile-Specific Components](#mobile-specific-components)
   - [MobileMinutesStepper](#mobileminutesstepper)
   - [MobileProgressDisplay](#mobileprogressdisplay)
   - [MobileDataCard](#mobiledatacard)
   - [MobileFormStepper](#mobileformstepper)
7. [Feedback Components](#feedback-components)
   - [EmptyState](#emptystate)
   - [ErrorState](#errorstate)
   - [LoadingSpinner](#loadingspinner)
   - [ConfirmDialog](#confirmdialog)
8. [Data Display Components](#data-display-components)
   - [TablePagination](#tablepagination)
   - [ClassFundraisingShelf](#classfundraisingshelf)
   - [ClassFundraisingStack](#classfundraisingstack)
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
13. [Skeleton Components](#skeleton-components)
    - [CardSkeleton](#cardskeleton)
    - [TableSkeleton](#tableskeleton)
    - [ProgressCircleSkeleton](#progresscircleskeleton)
    - [TextSkeleton](#textskeleton)
    - [StudentCardSkeleton](#studentcardskeleton)
    - [DashboardSkeleton](#dashboardskeleton)
14. [Pledge Components](#pledge-components)
    - [EditPledgeDialog](#editpledgedialog)
    - [ChildSelector](#childselector)
    - [ClassSelector](#classselector)
    - [SponsorTypeSelector](#sponsortypeselector)
    - [ClassroomPledgeForm](#classroompledgeform)
15. [Family Components](#family-components)
    - [ChildReadingLogsSection](#childreadinglogssection)
    - [EditChildDialog](#editchilddialog)
    - [ReadingLogsTable](#readingslogstable)
16. [Classroom Components](#classroom-components)
    - [ClassProgressCard](#classprogresscard)
17. [Decorative Components](#decorative-components)
    - [DecorativeBlob](#decorativeblob)
    - [DecorativeBackground](#decorativebackground)

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

**Used On:** ⚠️ *Component defined but not currently imported anywhere* (available for future use)

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

**Used On:** ⚠️ *Component defined but not currently imported anywhere* (available for future use)

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

**Used On:** ⚠️ *Component defined but not currently imported anywhere* (available for future use)

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

**Used On:** ⚠️ *Component defined but not currently imported anywhere* (available for future use)

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

**Used On:** ManageChildrenPage (mobile view)

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

**Used On:** LogReadingPage (mobile view)

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

**Used On:** DashboardPage (mobile view)

---

## Feedback Components

### EmptyState

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Display when no data is available.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Optional icon |
| `title` | `string` | — | Title text |
| `description` | `string` | — | Description text |
| `action` | `{ label, onClick?, href? }` | — | Primary action |
| `secondaryAction` | `{ label, onClick?, href? }` | — | Secondary action |
| `className` | `string` | — | Additional CSS classes |

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

### EmptyChildren

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Empty state when no children have been added to a family account.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onAddChild` | `() => void` | — | Handler for "Add Child" action |

**Visual Configuration:**
- Icon: `Users` (lucide-react)
- Title: "No children added yet"
- Description: "Add your children to start tracking their reading progress and collecting pledges."
- Primary action: "Add Your First Child"

**Used On:** ManageChildrenPage, DashboardPage

---

### EmptyReadingLogs

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Empty state when a child has no reading logs.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `childName` | `string` | — | Name of the child for personalized message |
| `onLogReading` | `() => void` | — | Handler for "Log Reading" action |

**Visual Configuration:**
- Icon: `BookOpen` (lucide-react)
- Title: "No reading sessions yet"
- Description: "Start logging reading time for {childName} to track their progress."
- Primary action: "Log First Reading Session"

**Used On:** ChildDetailsPage, ChildReadingLogsSection

---

### EmptyPledges

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Empty state when no sponsors have pledged yet.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onInviteSponsors` | `() => void` | — | Handler for invite action |

**Visual Configuration:**
- Icon: `Heart` (lucide-react)
- Title: "No sponsors yet"
- Description: "Invite family and friends to sponsor your child's reading journey."
- Primary action: "Invite Sponsors"

**Used On:** PledgesSection, SponsorRequestsPage

---

### EmptySearchResults

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Empty state when search returns no results.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchQuery` | `string` | — | The search term that returned no results |
| `onClearSearch` | `() => void` | — | Handler to clear search |

**Visual Configuration:**
- Icon: `Search` (lucide-react)
- Title: "No results found"
- Description: "No results match '{searchQuery}'. Try a different search term."
- Primary action: "Clear Search"

**Used On:** Admin tables, search interfaces

---

### EmptyStudents

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Empty state for teacher dashboards with no students.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes |

**Visual Configuration:**
- Icon: `Users` (lucide-react)
- Title: "No students in your class"
- Description: "Students will appear here once parents register their children and assign them to your class."

**Used On:** TeacherDashboard

---

### EmptyData

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Generic empty state for any data listing.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"No data available"` | Custom title |
| `description` | `string` | `"There's nothing to show here yet."` | Custom description |

**Visual Configuration:**
- Icon: `Inbox` (lucide-react)
- Customizable title and description

**Used On:** Generic data tables, admin pages

---

### EmptyFolder

**File Path:** `src/components/ui/empty-states.tsx`

**Purpose:** Empty state for empty folders or collections.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `folderName` | `string` | — | Name of the empty folder |

**Visual Configuration:**
- Icon: `FolderOpen` (lucide-react)
- Title: "This folder is empty"
- Description: "No items in {folderName} yet."

**Used On:** File/folder interfaces

---

### ErrorState

**File Path:** `src/components/ui/error-states.tsx`

**Purpose:** Display error conditions with recovery actions.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | Error icon |
| `title` | `string` | — | Error title |
| `description` | `string` | — | Error description |
| `action` | `{ label, onClick?, href? }` | — | Primary recovery action |
| `secondaryAction` | `{ label, onClick?, href? }` | — | Secondary action |
| `className` | `string` | — | Additional CSS classes |

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
- Title: `font-serif text-xl font-medium`
- Description: `text-muted-foreground`

**Color Usage:**
- Icon circle: `bg-destructive/10`
- Icon: `text-destructive` (h-10 w-10)

**Used On:** Error boundaries, failed API calls

---

### ConnectionError

**File Path:** `src/components/ui/error-states.tsx`

**Purpose:** Error state for network connectivity issues.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRetry` | `() => void` | — | Handler for retry action |

**Visual Configuration:**
- Icon: `WifiOff` (lucide-react)
- Title: "Connection lost"
- Description: "Unable to connect to the server. Please check your internet connection and try again."
- Primary action: "Retry"

**Used On:** API failure states, offline detection

---

### NotFoundError

**File Path:** `src/components/ui/error-states.tsx`

**Purpose:** 404 error state for missing pages or resources.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `resourceType` | `string` | `"page"` | Type of resource not found |

**Visual Configuration:**
- Icon: `FileQuestion` (lucide-react)
- Title: "{resourceType} not found"
- Description: "The {resourceType} you're looking for doesn't exist or has been removed."
- Primary action: "Go Home" (links to `/`)

**Used On:** NotFound page, missing resource states

---

### PermissionDenied

**File Path:** `src/components/ui/error-states.tsx`

**Purpose:** Error state for access denied situations.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onGoBack` | `() => void` | — | Handler for navigation back |

**Visual Configuration:**
- Icon: `ShieldAlert` (lucide-react)
- Title: "Access denied"
- Description: "You don't have permission to view this content."
- Primary action: "Go Back"

**Used On:** RequireAdmin, RequireTeacher wrappers

---

### GenericError

**File Path:** `src/components/ui/error-states.tsx`

**Purpose:** Generic error state for unexpected errors.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRetry` | `() => void` | — | Handler for retry action |
| `errorMessage` | `string` | — | Optional detailed error message |

**Visual Configuration:**
- Icon: `AlertTriangle` (lucide-react)
- Title: "Something went wrong"
- Description: "An unexpected error occurred. Please try again."
- Primary action: "Try Again"

**Used On:** Generic error handling, unexpected failures

---

### FormError

**File Path:** `src/components/ui/error-states.tsx`

**Purpose:** Inline error display for form submission failures.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | — | Error message to display |
| `onDismiss` | `() => void` | — | Optional dismiss handler |

**Visual Structure:**
```
<div (inline alert)>
  <AlertCircle (icon) />
  <span>{message}</span>
  {onDismiss && <Button (X icon) />}
</div>
```

**Color Usage:**
- Container: `bg-destructive/10 border-destructive/30`
- Icon & text: `text-destructive`

**Used On:** Form pages, inline validation

---

### ErrorBoundaryFallback

**File Path:** `src/components/ui/error-states.tsx`

**Purpose:** React Error Boundary fallback UI.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `Error` | — | The caught error object |
| `resetErrorBoundary` | `() => void` | — | Handler to reset the boundary |

**Visual Configuration:**
- Icon: `AlertOctagon` (lucide-react)
- Title: "Application Error"
- Description: "An error occurred in this part of the application."
- Primary action: "Try Again"
- Secondary action: "Reload Page"

**Used On:** App-level error boundary, component error boundaries

---

### LoadingSpinner

**File Path:** `src/components/ui/loading-spinner.tsx`

**Purpose:** Standalone loading spinner in various sizes.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Spinner size |
| `label` | `string` | `"Loading..."` | Accessible label (sr-only for sm/md) |
| `fullScreen` | `boolean` | `false` | Center in full viewport |
| `className` | `string` | — | Additional CSS classes |

**Size Classes:**
| Size | Dimensions | Text Size |
|------|------------|-----------|
| sm | `h-4 w-4` | `text-xs` |
| md | `h-6 w-6` | `text-sm` |
| lg | `h-10 w-10` | `text-base` |
| xl | `h-12 w-12` | `text-lg` |

**Visual Structure:**
```
<div role="status" aria-live="polite">
  <Loader2 (spinning icon) />
  <span (sr-only for sm/md, visible for lg/xl)>{label}</span>
</div>
```

**Color Usage:**
- Spinner: `text-brand-blue`
- Label: `text-muted-foreground`

**Animation:**
- Icon: `animate-spin`

**Used On:** Buttons (size sm), sections (size lg), initial page loads (size xl)

---

### InlineLoading

**File Path:** `src/components/ui/loading-spinner.tsx`

**Purpose:** Inline loading indicator for text contexts.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"Loading"` | Text shown next to spinner |
| `className` | `string` | — | Additional CSS classes |

**Visual Structure:**
```
<span role="status" aria-live="polite">
  <Loader2 (h-4 w-4 spinning) />
  <span>{label}</span>
</span>
```

**Color Usage:**
- Spinner: `text-brand-blue`
- Label: `text-muted-foreground`

**Used On:** Button loading states, inline status updates

---

### PageLoading

**File Path:** `src/components/ui/loading-spinner.tsx`

**Purpose:** Full-page loading overlay with backdrop.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `"Loading..."` | Loading message |
| `className` | `string` | — | Additional CSS classes |

**Visual Structure:**
```
<div (fixed overlay with backdrop)>
  <div (centered card)>
    <div (animated ring spinner, h-16 w-16) />
    <p>{message}</p>
  </div>
</div>
```

**Color Usage:**
- Overlay: `bg-background/80 backdrop-blur-sm`
- Card: `bg-card shadow-lg`
- Ring: `border-4 border-muted` (track), `border-brand-blue border-t-transparent` (spinner)
- Message: `text-lg font-medium text-foreground`

**Animation:**
- Inner ring: `animate-spin`

**Used On:** Route transitions, heavy data loading

---

### SectionLoading

**File Path:** `src/components/ui/loading-spinner.tsx`

**Purpose:** Wrapper component that shows loading state or content.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLoading` | `boolean` | — | Whether to show loading state |
| `children` | `ReactNode` | — | Content to show when not loading |
| `skeleton` | `ReactNode` | — | Custom skeleton (defaults to LoadingSpinner lg) |
| `minHeight` | `string` | `"200px"` | Minimum height for loading container |

**Visual Structure:**
```
{isLoading ? (
  <div style={{ minHeight }}>
    {skeleton || <LoadingSpinner size="lg" />}
  </div>
) : (
  children
)}
```

**Used On:** Data sections, lazy-loaded components

---

### DotsLoader

**File Path:** `src/components/ui/loading-spinner.tsx`

**Purpose:** Pulsing dots animation for subtle loading indication.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes |

**Visual Structure:**
```
<div role="status">
  <span (dot 1, delayed 0s) />
  <span (dot 2, delayed 0.15s) />
  <span (dot 3, delayed 0.3s) />
  <span (sr-only)>Loading...</span>
</div>
```

**Dot Styling:**
- Size: `h-2 w-2`
- Shape: `rounded-full`
- Color: `bg-brand-blue`
- Animation: `animate-pulse` with staggered delays

**Used On:** Chat interfaces, typing indicators, subtle loading states

---

### ConfirmDialog

**File Path:** `src/components/ui/confirm-dialog.tsx`

**Purpose:** Confirmation dialog for destructive or important actions.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Open state |
| `onOpenChange` | `(open: boolean) => void` | — | State change handler |
| `title` | `string` | — | Dialog title |
| `description` | `string` | — | Dialog description |
| `confirmLabel` | `string` | `"Confirm"` | Confirm button text |
| `cancelLabel` | `string` | `"Cancel"` | Cancel button text |
| `variant` | `"default" \| "destructive"` | `"default"` | Visual variant |
| `onConfirm` | `() => void \| Promise<void>` | — | Confirm handler (supports async) |
| `icon` | `ReactNode` | — | Optional icon |
| `loading` | `boolean` | `false` | External loading state |

**Visual Structure:**
```
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      {icon && <div (icon circle)>{icon}</div>}
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
- Title: `text-lg font-semibold text-center`
- Description: `text-sm text-muted-foreground text-center`

**Spacing:**
- Icon circle: `h-12 w-12 mb-4`
- Footer gap: `gap-2`

**Color Usage:**
- Default icon circle: `bg-muted`
- Destructive icon circle: `bg-destructive/10`
- Destructive action button: `bg-destructive text-destructive-foreground hover:bg-destructive/90`

**Used On:** Delete actions, logout, form cancellation

---

### DeleteConfirm

**File Path:** `src/components/ui/confirm-dialog.tsx`

**Purpose:** Pre-configured confirmation dialog for delete operations.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Open state |
| `onOpenChange` | `(open: boolean) => void` | — | State change handler |
| `itemName` | `string` | — | Name of item being deleted |
| `itemType` | `string` | `"item"` | Type label (e.g., "child", "pledge") |
| `onConfirm` | `() => void \| Promise<void>` | — | Confirm handler |

**Visual Configuration:**
- Icon: `Trash2` (lucide-react, `text-destructive`)
- Title: "Delete {itemType}?"
- Description: 'Are you sure you want to delete "{itemName}"? This action cannot be undone.'
- Confirm label: "Delete {itemType}"
- Variant: `destructive`

**Used On:** ManageChildrenPage, AdminUsersPage, pledge management

---

### LogoutConfirm

**File Path:** `src/components/ui/confirm-dialog.tsx`

**Purpose:** Pre-configured confirmation dialog for logout.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Open state |
| `onOpenChange` | `(open: boolean) => void` | — | State change handler |
| `onConfirm` | `() => void` | — | Confirm handler |

**Visual Configuration:**
- Icon: `LogOut` (lucide-react, `text-muted-foreground`)
- Title: "Log out?"
- Description: "You'll need to sign in again to access your account."
- Confirm label: "Log Out"
- Variant: `default`

**Used On:** Header menus, account settings

---

### DiscardChangesConfirm

**File Path:** `src/components/ui/confirm-dialog.tsx`

**Purpose:** Pre-configured confirmation dialog for unsaved changes.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Open state |
| `onOpenChange` | `(open: boolean) => void` | — | State change handler |
| `onConfirm` | `() => void` | — | Confirm handler |

**Visual Configuration:**
- Icon: `AlertTriangle` (lucide-react, `text-amber-500`)
- Title: "Discard changes?"
- Description: "You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
- Confirm label: "Discard Changes"
- Variant: `destructive`

**Used On:** Form pages with unsaved changes detection

---

### CancelPledgeConfirm

**File Path:** `src/components/ui/confirm-dialog.tsx`

**Purpose:** Pre-configured confirmation dialog for canceling pledges.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Open state |
| `onOpenChange` | `(open: boolean) => void` | — | State change handler |
| `pledgeAmount` | `string` | — | Formatted pledge amount (e.g., "$25") |
| `childName` | `string` | — | Name of child the pledge is for |
| `onConfirm` | `() => void` | — | Confirm handler |

**Visual Configuration:**
- Icon: `X` (lucide-react, `text-destructive`)
- Title: "Cancel pledge?"
- Description: "Are you sure you want to cancel your {pledgeAmount} pledge for {childName}? This action cannot be undone."
- Confirm label: "Cancel Pledge"
- Variant: `destructive`

**Used On:** MyPledgesPage, SponsorDashboardPage

---

### useConfirmDialog (Hook)

**File Path:** `src/components/ui/confirm-dialog.tsx`

**Purpose:** Hook for managing confirm dialog state.

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `isOpen` | `boolean` | Current open state |
| `setIsOpen` | `(open: boolean) => void` | Direct state setter |
| `confirm` | `(action: () => void) => void` | Queue action and open dialog |
| `handleConfirm` | `() => void` | Execute pending action and close |
| `handleCancel` | `() => void` | Clear pending action and close |

**Usage Example:**
```tsx
const { isOpen, setIsOpen, confirm, handleConfirm, handleCancel } = useConfirmDialog();

// Trigger confirmation
<Button onClick={() => confirm(() => deleteItem(id))}>Delete</Button>

// Dialog
<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  onConfirm={handleConfirm}
  // ...
/>
```

**Used On:** Pages with multiple confirmable actions

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

**Used On:** LogReadingPage (goal completion, success state)

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

**Used On:** ⚠️ *Component defined but not currently imported anywhere* (available for milestone achievements)

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

**Used On:** LogReadingPage (goal reached celebration)

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

**Purpose:** Pre-built skeleton layouts for common loading state patterns.

---

### CardSkeleton

**Purpose:** Loading placeholder for card-based content with avatar and text.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes |
| `hasAvatar` | `boolean` | `true` | Show circular avatar placeholder |
| `hasActions` | `boolean` | `true` | Show action button placeholders |
| `lines` | `number` | `2` | Number of text line placeholders |

**Visual Structure:**
```
<div (card container)>
  <div (header row)>
    {hasAvatar && <Skeleton (circle) />}
    <div (text lines)>
      <Skeleton (title) />
      <Skeleton (lines...) />
    </div>
  </div>
  {hasActions && <div (action buttons) />}
</div>
```

**Color Usage:**
- Background: `bg-card`
- Skeleton elements: `bg-muted animate-pulse`

**Used On:** PledgesSection, ManageChildrenPage, any card loading state

---

### TableSkeleton

**Purpose:** Loading placeholder for tabular data.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | `5` | Number of row placeholders |
| `columns` | `number` | `4` | Number of column placeholders |
| `className` | `string` | — | Additional CSS classes |

**Visual Structure:**
```
<div>
  <div (header row)>
    <Skeleton />...
  </div>
  {rows.map(() => (
    <div (data row)>
      <Skeleton />...
    </div>
  ))}
</div>
```

**Color Usage:**
- Row borders: `border-b`
- Skeleton elements: `bg-muted animate-pulse`

**Used On:** AdminReadingLogsPage, AdminOutstandingPage, any table loading state

---

### ProgressCircleSkeleton

**Purpose:** Loading placeholder for circular progress indicators.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `160` | Diameter in pixels |
| `className` | `string` | — | Additional CSS classes |

**Visual Structure:**
```
<div (container)>
  <div (circle placeholder)>
    <svg (ring outline) />
  </div>
  <div (text placeholders)>
    <Skeleton (value) />
    <Skeleton (label) />
  </div>
</div>
```

**Color Usage:**
- Circle: `bg-muted animate-pulse`
- Ring: `text-muted-foreground/20`

**Used On:** DashboardPage, StudentDashboardPage, any progress ring loading state

---

### TextSkeleton

**Purpose:** Loading placeholder for text content with realistic varying widths.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `number` | `3` | Number of text line placeholders |
| `className` | `string` | — | Additional CSS classes |
| `variant` | `"heading" \| "paragraph" \| "label"` | `"paragraph"` | Text style variant |

**Width Patterns by Variant:**
- `heading`: [80%, 60%]
- `paragraph`: [100%, 95%, 70%, 85%, 60%]
- `label`: [40%, 30%, 50%]

**Height by Variant:**
- `heading`: `h-8`
- `paragraph`: `h-4`
- `label`: `h-3`

**Used On:** Content loading states, article placeholders

---

### StudentCardSkeleton

**Purpose:** Loading placeholder matching StudentCard layout.

**Visual Structure:**
```
<div (card)>
  <div (header)>
    <Skeleton (avatar circle) />
    <div>
      <Skeleton (name) />
      <Skeleton (grade) />
    </div>
    <Skeleton (progress ring) />
  </div>
  <div (actions)>
    <Skeleton (button) />
    <Skeleton (button) />
  </div>
</div>
```

**Spacing:**
- Avatar: `h-12 w-12 rounded-full`
- Name: `h-5 w-32`
- Grade: `h-4 w-20`
- Progress: `h-12 w-12 rounded-full`

**Used On:** DashboardPage, TeacherDashboard student lists

---

### DashboardSkeleton

**Purpose:** Full-page loading placeholder for dashboard layouts.

**Visual Structure:**
```
<div>
  {/* Header */}
  <Skeleton (title) />
  <Skeleton (subtitle) />
  
  {/* Stats Grid */}
  <div (4-column grid)>
    {4x stat cards}
  </div>
  
  {/* Main Content */}
  <div (3-column grid)>
    <div (2-col span)>
      {4x StudentCardSkeleton}
    </div>
    <div (sidebar)>
      <ProgressCircleSkeleton />
    </div>
  </div>
</div>
```

**Animation:**
- Container: `animate-fade-in`
- All skeletons: `animate-pulse`

**Used On:** DashboardPage, AdminDashboard initial load

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

---

## Layout Components (Extended)

### AdminLayout

**File Path:** `src/components/layout/AdminLayout.tsx`

**Purpose:** Full-page layout wrapper for admin section with horizontal tab navigation.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Page content |

**Visual Structure:**
```
<div className="flex min-h-screen flex-col">
  <MainNav />
  <div (Admin Navigation Bar)>
    {navItems.map(item => (
      <Link className={cn(..., isActive && handDrawnBorder)}>
        <Icon />
        {label}
      </Link>
    ))}
  </div>
  <div (Books Shelf Divider - decorative) />
  <main className="flex-1 bg-background-warm">{children}</main>
  <Footer />
</div>
```

**Typography:**
- Nav items: `text-sm font-medium`

**Spacing:**
- Nav container: `py-2 gap-1`
- Nav items: `px-4 py-2`

**Color Usage:**
- Active: `bg-primary text-primary-foreground`
- Inactive: `text-muted-foreground hover:text-foreground hover:bg-muted`

**Used On:** All admin pages (wrapper)

---

### AdminSidebar

**File Path:** `src/components/layout/AdminSidebar.tsx`

**Purpose:** Collapsible vertical sidebar navigation (alternative to AdminLayout).

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navItems` | `SidebarNavItem[]` | default items | Navigation items |
| `className` | `string` | - | Additional classes |

**Visual Structure:**
```
<aside className={cn("w-60", collapsed && "w-16")}>
  <div (Header with Logo - bg-primary) />
  <nav>
    <ul>
      {navItems.map(item => (
        <NavLink className={cn(isActive && "border-l-4 border-primary")} />
      ))}
    </ul>
  </nav>
  <div (Collapse Toggle) />
</aside>
```

**States:**
- Collapsed: `w-16` with icons only
- Expanded: `w-60` with icons + labels

**Color Usage:**
- Header: `bg-primary`
- Active item: `bg-secondary text-primary border-l-4 border-primary`

**Used On:** Alternative admin layout (not currently active)

---

### AppBreadcrumbs

**File Path:** `src/components/layout/AppBreadcrumbs.tsx`

**Purpose:** Breadcrumb navigation for hierarchical page structure.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `items` | `BreadcrumbItem[]` | `{ label, href? }` array |
| `className` | `string` | Additional classes |

**Visual Structure:**
```
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2 text-sm">
    {items.map((item, index) => (
      <li>
        {index > 0 && <span>/</span>}
        {isLast ? <span>{label}</span> : <Link>{label}</Link>}
      </li>
    ))}
  </ol>
</nav>
```

**Typography:**
- Items: `text-sm`
- Current (last): `font-medium text-foreground`
- Links: `text-primary hover:underline`

**Used On:** ChildDetailsPage, nested admin pages

---

### MobileHeader

**File Path:** `src/components/layout/MobileHeader.tsx`

**Purpose:** Sticky mobile header with logo and hamburger menu trigger.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onMenuClick` | `function` | Menu open handler |

**Visual Structure:**
```
<header className="sticky top-0 z-40 h-14 bg-primary md:hidden">
  <Link to="/">
    <Logo />
    <span>Read-a-thon</span>
  </Link>
  <button onClick={onMenuClick}>
    <Menu />
  </button>
</header>
```

**Color Usage:**
- Background: `bg-primary`
- Text: `text-primary-foreground`
- Button hover: `hover:bg-white/10`

**Used On:** Mobile dashboard views (alternative header)

---

### TopHeader

**File Path:** `src/components/layout/TopHeader.tsx`

**Purpose:** Fixed top header with centered nav, user menu, and mobile sheet.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navItems` | `NavItem[]` | Home/About/How It Works | Navigation links |
| `user` | `object` | - | User data for avatar |
| `onLogout` | `function` | - | Logout handler |

**Visual Structure:**
```
<header className="fixed top-0 z-50 bg-card">
  <Logo />
  <nav (Desktop - centered) />
  <div (Right section)>
    {user ? <DropdownMenu (avatar + menu) /> : <Button (Login/Signup) />}
    <Sheet (Mobile menu) />
  </div>
</header>
```

**States:**
- Scrolled: `shadow-sm` added

**Used On:** Alternative to MainNav (not currently active)

---

## Mobile Components (Extended)

### MobileDataCard

**File Path:** `src/components/mobile/MobileDataCard.tsx`

**Purpose:** Expandable card for displaying tabular data on mobile.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `fields` | `DataField[]` | `{ label, value, isPrimary? }` |
| `status` | `object` | Badge `{ label, variant }` |
| `actions` | `ActionItem[]` | Menu actions |
| `expandedContent` | `ReactNode` | Extra content when expanded |

**Visual Structure:**
```
<div className="rounded-xl bg-card shadow-sm border">
  <div (Main - clickable)>
    <div (Primary fields - max 3)>
      <h3>{first field}</h3>
      <p>{additional fields}</p>
    </div>
    <Badge />
    <DropdownMenu (actions) />
    <ChevronDown/Up />
  </div>
  {isExpanded && (
    <div className="border-t bg-muted/30">
      <dl (Secondary fields grid) />
      {expandedContent}
      <div (Action buttons) />
    </div>
  )}
</div>
```

**Animation:**
- Expanded content: `animate-fade-in`

**Used On:** Mobile admin tables, mobile pledge lists

---

### MobileFormStepper

**File Path:** `src/components/mobile/MobileFormStepper.tsx`

**Purpose:** Multi-step form progress indicator for mobile.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `steps` | `Step[]` | `{ id, label }` array |
| `currentStep` | `number` | Active step index |

**Visual Structure:**
```
<div>
  <div (Progress bar - fills based on completion %) />
  <div className="flex justify-between">
    {steps.map((step, index) => (
      <div>
        <div className={cn("h-8 w-8 rounded-full", 
          isCompleted && "bg-brand-blue",
          isCurrent && "ring-4 ring-brand-blue/20"
        )}>
          {isCompleted ? <Check /> : index + 1}
        </div>
        <span>{label}</span>
      </div>
    ))}
  </div>
</div>
```

**Color Usage:**
- Progress bar: `bg-brand-blue`
- Completed step: `bg-brand-blue text-white`
- Current step: `ring-4 ring-brand-blue/20`
- Future step: `bg-muted text-muted-foreground`

**Used On:** Multi-step mobile forms (onboarding, pledge creation)

---

## Pledge Components (Extended)

### EditPledgeDialog

**File Path:** `src/components/pledge/EditPledgeDialog.tsx`

**Purpose:** Dialog for editing existing pledge type and amount.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Dialog visibility |
| `onOpenChange` | `function` | Open state handler |
| `pledge` | `EditablePledge` | Pledge to edit |
| `onSave` | `function` | Save handler `(id, type, amount)` |
| `isLoading` | `boolean` | Loading state |

**Visual Structure:**
```
<Dialog>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle><Pencil /> Edit Pledge</DialogTitle>
    </DialogHeader>
    <div>
      <RadioGroup (Fixed Amount vs Per Minute)>
        <Label (card style with icon)>
          <DollarSign /> Fixed Amount
        </Label>
        <Label>
          <Clock /> Per Minute
        </Label>
      </RadioGroup>
      <Input (amount with $ prefix) />
    </div>
    <DialogFooter>
      <Button>Cancel</Button>
      <Button>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Used On:** MyPledgesPage, SponsorDashboard

---

## Family Components (Extended)

### ChildReadingLogsSection

**File Path:** `src/components/family/ChildReadingLogsSection.tsx`

**Purpose:** Container that fetches and displays reading logs for a specific child.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `childId` | `string` | Child ID for fetching logs |
| `childName` | `string` | Display name for empty state |

**Visual Structure:**
```
<div className="border-t border-border p-6 bg-muted/20">
  {isLoading ? (
    <Loader2 />
  ) : (
    <>
      <h4 className="font-serif text-lg">Reading Logs</h4>
      <ReadingLogsTable logs={logs} />
    </>
  )}
</div>
```

**Used On:** ManageChildrenPage (collapsible section), ChildDetailsPage

---

### EditChildDialog

**File Path:** `src/components/family/EditChildDialog.tsx`

**Purpose:** Comprehensive dialog for editing child profile, student login, and sharing settings.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `child` | `Child` | Child data to edit |
| `open` | `boolean` | Dialog visibility |
| `onOpenChange` | `function` | Open state handler |
| `onSave` | `function` | Save handler |
| `isSaving` | `boolean` | Loading state |

**Visual Structure:**
```
<Dialog>
  <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle><User /> Edit Child Profile</DialogTitle>
    </DialogHeader>
    <div>
      {/* Profile Section */}
      <div>
        <Input (name) />
        <Select (grade) />
        <Input (goal minutes) />
        <Select (homeroom teacher) />
      </div>
      <Separator />
      {/* Student Login Section */}
      <div>
        <Switch (enable login) />
        {enabled && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <Input (username) />
            <Input (password) />
          </div>
        )}
      </div>
      <Separator />
      {/* Sharing Section */}
      <div>
        <Switch (public signups) />
        {enabled && <Input (copy link) />}
      </div>
    </div>
    <DialogFooter />
  </DialogContent>
</Dialog>
```

**Used On:** ManageChildrenPage, ChildDetailsPage, AccountSettingsPage

---

### ReadingLogsTable

**File Path:** `src/components/family/ReadingLogsTable.tsx`

**Purpose:** Editable table of reading log entries with inline editing.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `logs` | `ReadingLog[]` | Log entries |
| `childName` | `string` | For empty state message |
| `onEdit` | `function` | Edit handler `(id, minutes, title)` |
| `onDelete` | `function` | Delete handler `(id)` |

**Visual Structure:**
```
<div className="rounded-lg border bg-background">
  <Table>
    <TableHeader>
      <TableRow className="bg-muted/50">
        <TableHead>Date</TableHead>
        <TableHead>Minutes</TableHead>
        <TableHead>Book Title</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {logs.map(log => (
        <TableRow>
          {editingId === log.id ? (
            <>
              <Input (minutes) />
              <Input (book title) />
              <Button><Save /></Button>
            </>
          ) : (
            <>
              <Badge>{minutes} min</Badge>
              <span>{book_title}</span>
              <Button><Pencil /></Button>
              <Button><Trash2 /></Button>
            </>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
<AlertDialog (delete confirmation) />
```

**Empty State:**
- BookOpen icon, centered message

**Used On:** ChildDetailsPage, VerifyLogsPage, ChildReadingLogsSection

---

## Dashboard Section Components

### ChildBooksSection

**File Path:** `src/components/dashboard/ChildBooksSection.tsx`

**Purpose:** Horizontal scrolling book cover gallery for a child's logged books.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `childId` | `string` | Child ID for fetching books |

**Visual Structure:**
```
<div className="w-full pt-2 border-t border-border">
  <p className="text-xs text-muted-foreground">
    <BookOpen /> My Books ({count})
  </p>
  <ScrollArea className="w-full whitespace-nowrap">
    <div className="flex gap-2 pb-2">
      {books.map(book => (
        <div className="h-16 w-12">
          {book.cover_url ? (
            <img />
          ) : (
            <div className="bg-gradient-to-b from-primary/20">
              <BookOpen />
              <span>{title}</span>
            </div>
          )}
        </div>
      ))}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</div>
```

**Loading State:** 3 skeleton book placeholders

**Empty State:** "No books logged yet" message

**Used On:** DashboardPage, ChildDetailsPage

---

### PledgesSection

**File Path:** `src/components/dashboard/PledgesSection.tsx`

**Purpose:** Dashboard section showing pledge summary and recent pledges.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `pledgesByChild` | `PledgesByChild[]` | Grouped pledges |
| `totalPledges` | `number` | Total pledged amount |
| `isLoading` | `boolean` | Loading state |
| `onDeletePledge` | `function` | Delete handler |

**Visual Structure:**
```
<section>
  <div (Header with View All link)>
    <h2 className="font-serif">Pledges & Sponsors</h2>
    <Button>View all pledges →</Button>
  </div>
  
  {/* Summary Stats Card */}
  <div className="bg-background" style={handDrawnBorder}>
    <div className="grid grid-cols-3">
      <div>Total: ${total}</div>
      <div>Child1: ${amount}</div>
      <div>Child2: ${amount}</div>
    </div>
  </div>
  
  {/* Recent Pledges List */}
  <div className="bg-background" style={handDrawnBorder}>
    {pledges.map(pledge => <PledgeItem />)}
  </div>
  
  <Button>Invite More Sponsors</Button>
</section>
```

**Empty State:** DollarSign icon with "No pledges yet" + Invite button

**Used On:** DashboardPage

---

### ClassFundraisingStack

**File Path:** `src/components/ui/class-fundraising-stack.tsx`

**Purpose:** Vertical book stack progress indicator for class fundraising milestones.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fundedAmount` | `number` | - | Current funded $ |
| `goalAmount` | `number` | - | Target $ |
| `classLabel` | `string` | - | Class name label |
| `rewardLabel` | `string` | - | Milestone reward |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Stack size |
| `showLabel` | `boolean` | `true` | Show amount label |

**Visual Structure:**
```
<div className="flex flex-col items-center gap-2">
  {classLabel && <span>{classLabel}</span>}
  <div (Book Stack Container)>
    <img (grayscale - unfunded) />
    <div style={{ clipPath: `inset(${100-percent}% 0 0 0)` }}>
      <img (colored - funded portion) />
    </div>
    {isComplete && <span>🎉</span>}
  </div>
  {showLabel && <span>${funded} / ${goal}</span>}
  {rewardLabel && <span>{rewardLabel}</span>}
</div>
```

**Sizes:**
- sm: `h-16 w-12`
- md: `h-24 w-16`
- lg: `h-32 w-24`

**Used On:** TeacherDashboard

---

## Admin Components

### EditEventDialog

**File Path:** `src/components/admin/EditEventDialog.tsx`

**Purpose:** Dialog for creating/editing read-a-thon events with date pickers.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Dialog visibility |
| `onOpenChange` | `function` | Open state handler |
| `event` | `EventData` | Event to edit (null for new) |
| `onSave` | `function` | Save callback |

**Visual Structure:**
```
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{isNew ? "Create Event" : "Edit Event"}</DialogTitle>
    </DialogHeader>
    <div>
      <Input (event name) />
      <Popover><Calendar (start date) /></Popover>
      <Popover><Calendar (end date) /></Popover>
      <Popover><Calendar (last log date) /></Popover>
    </div>
    <DialogFooter>
      <Button (Archive - conditional)>Archive</Button>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
<AlertDialog (archive confirmation) />
```

**Used On:** AdminSettingsPage

---

### LogVerificationSettings

**File Path:** `src/components/admin/LogVerificationSettings.tsx`

**Purpose:** Settings panel for configuring log verification thresholds by grade.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onUnsavedChange` | `function` | Dirty state callback |

**Visual Structure:**
```
<div className="bg-background" style={handDrawnBorder}>
  <h3><ClipboardCheck /> Log Verification</h3>
  <Switch (enable verification) />
  {enabled && (
    <div>
      <Input (default threshold) />
      {grades.map(grade => (
        <Input (grade-specific threshold) />
      ))}
    </div>
  )}
  <Button><Save /> Save Settings</Button>
</div>
```

**Used On:** AdminSettingsPage

---

### LogoGenerator

**File Path:** `src/components/admin/LogoGenerator.tsx`

**Purpose:** Canvas-based logo generator with date overlay for event branding.

**Key Features:**
- Renders event logo with dynamic date text
- Adjustable date position via slider
- Download as PNG
- Upload to Supabase storage

**Visual Structure:**
```
<div className="bg-background" style={handDrawnBorder}>
  <h3><Image /> Event Logo</h3>
  <canvas (logo preview) />
  <Slider (date X offset) />
  <div>
    <Button><Download /> Download PNG</Button>
    <Button><Upload /> Upload as Official Logo</Button>
  </div>
</div>
```

**Used On:** AdminSettingsPage

---

### SiteContentEditor

**File Path:** `src/components/admin/SiteContentEditor.tsx`

**Purpose:** Collapsible content management for all site copy organized by page.

**Visual Structure:**
```
<div className="bg-background" style={handDrawnBorder}>
  <h2><FileText /> Site Content</h2>
  {CONTENT_GROUPS.map(group => (
    <Collapsible>
      <CollapsibleTrigger>
        <ChevronRight/Down /> {group.title}
      </CollapsibleTrigger>
      <CollapsibleContent>
        {group.keys.map(key => (
          <FormField>
            <Label>{key}</Label>
            {isJSON ? <Textarea /> : <Input />}
          </FormField>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ))}
  <Button><Save /> Save All Changes</Button>
</div>
```

**Content Groups:** Home, About, How It Works, FAQ

**Used On:** AdminSiteContentPage

---

### TeacherManagement

**File Path:** `src/components/admin/TeacherManagement.tsx`

**Purpose:** Complete teacher CRUD with CSV import, email invites, and class assignments.

**Key Features:**
- Add/Edit/Delete teachers
- Bulk CSV import
- Send email invitations
- Link/unlink Supabase auth accounts
- Assign partner teachers to homerooms

**Visual Structure:**
```
<div className="space-y-6">
  {/* Header with actions */}
  <div>
    <h2>Teacher Management</h2>
    <Button><Plus /> Add Teacher</Button>
    <Button><Upload /> Import CSV</Button>
  </div>
  
  {/* Teacher list by type */}
  {TEACHER_TYPES.map(type => (
    <Collapsible>
      <CollapsibleTrigger>{type.label} ({count})</CollapsibleTrigger>
      <CollapsibleContent>
        {teachers.filter(t => t.type === type.value).map(teacher => (
          <TeacherCard>
            <Badge (linked status) />
            <DropdownMenu (edit, delete, send invite) />
          </TeacherCard>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ))}
</div>

<Dialog (Add/Edit Teacher) />
<Dialog (Assign Classes) />
<AlertDialog (Delete Confirmation) />
```

**Used On:** AdminUsersPage

---

## Additional Layout Components

### PublicLayout

**File Path:** `src/components/layout/PublicLayout.tsx`

**Purpose:** Wrapper layout for public-facing pages with consistent navigation and footer.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Page content |

**Visual Structure:**
```
<div className="flex min-h-screen flex-col">
  <MainNav />
  <LogoBanner />
  <main className="flex-1">{children}</main>
  <Footer />
</div>
```

**Used On:** HomePage, AboutPage, HowItWorksPage, FAQPage, PrivacyPage, LoginPage, RegisterPage, SponsorAuthPage, NotFound, and all public pages

---

## Decorative Components

### DecorativeBlob

**File Path:** `src/components/ui/decorative-blobs.tsx`

**Purpose:** Decorative blob shape for subtle background accents at section edges.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right"` | - | Corner position |
| `className` | `string` | - | Additional classes |
| `opacity` | `number` | `5` | Opacity from 0-100 |
| `size` | `number \| string` | `400` | Size in pixels or tailwind class |
| `colorClass` | `string` | `"text-primary"` | Color class for the blob |

**Visual Structure:**
```
<div className="absolute pointer-events-none select-none {positionClasses}">
  <img src={decorativeShape} style={{ filter: "blur(1px)" }} />
</div>
```

**Used On:** ⚠️ *Component defined but not currently imported anywhere (available for future use)*

---

### DecorativeBackground

**File Path:** `src/components/ui/decorative-blobs.tsx`

**Purpose:** Wrapper that adds decorative blob shapes to section backgrounds.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Section content |
| `className` | `string` | - | Additional classes |
| `blobs` | `Array<position>` | `["top-right", "bottom-left"]` | Which corners to show blobs |
| `opacity` | `number` | `5` | Opacity for all blobs |
| `size` | `number` | `400` | Size for all blobs |
| `colorClass` | `string` | - | Color class for blobs |

**Visual Structure:**
```
<div className="relative overflow-hidden">
  {blobs.map(position => <DecorativeBlob key={position} ... />)}
  <div className="relative z-10">{children}</div>
</div>
```

**Used On:** HomePage (hero section)

---

## Pledge Selection Components

### ChildSelector

**File Path:** `src/components/pledge/ChildSelector.tsx`

**Purpose:** Grid selector for choosing which child to sponsor with progress indicators.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `Array<ChildData>` | - | Array of sponsorable children |
| `selectedChildId` | `string \| null` | - | Currently selected child ID |
| `onSelect` | `(childId: string) => void` | - | Selection callback |
| `title` | `string` | `"Select a Child"` | Section title |
| `subtitle` | `string` | - | Optional subtitle |
| `showSource` | `boolean` | `false` | Show invited badge |

**Visual Structure:**
```
<div className="space-y-6">
  <div (header)>
    <h2>{title}</h2>
    <p>{subtitle}</p>
  </div>
  <div className="grid gap-4 md:grid-cols-2">
    {children.map(child => (
      <Card className={cn(selectedChildId === child.id && "ring-2 ring-primary")}>
        <ReadingGoalRing size={64} />
        <h3>{displayName}</h3>
        <Badge (Invited - conditional) />
        <p>{grade_info}</p>
        <p>{progress}% of goal</p>
      </Card>
    ))}
  </div>
</div>
```

**Empty State:** Displays User icon with "No children available" message

**Used On:** SponsorMyChildPage, FamilySponsorPage

---

### ClassSelector

**File Path:** `src/components/pledge/ClassSelector.tsx`

**Purpose:** Grid selector for choosing which class to sponsor with fundraising progress.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `classes` | `Array<ClassInfo>` | - | Array of classes |
| `selectedClassName` | `string \| null` | - | Currently selected class |
| `onSelect` | `(className: string, teacherId: string \| null) => void` | - | Selection callback |
| `fundraisingTotals` | `Record<string, number>` | - | Fundraising by class name |
| `milestoneGoal` | `number` | - | Class milestone target |
| `milestoneReward` | `string \| null` | - | Reward description |
| `isLoading` | `boolean` | `false` | Loading state |

**Visual Structure:**
```
<div className="space-y-6">
  <div (header)>
    <h2>Select a Class</h2>
    <p>Classes reaching ${goal} earn: {reward}</p>
  </div>
  <div className="grid gap-4 md:grid-cols-2">
    {classes.map(classInfo => (
      <Card className={cn(selectedClassName === className && "ring-2 ring-primary")}>
        <ClassFundraisingStack size="sm" showLabel={false} />
        <h3>{teacherName}'s Class</h3>
        <p>{gradeInfo}</p>
        <span><Users /> {studentCount} students</span>
        <span>${funded} / ${goal}</span>
      </Card>
    ))}
  </div>
</div>
```

**Loading State:** 4 skeleton cards
**Empty State:** School icon with "No classes available" message

**Used On:** SponsorMyChildPage, SponsorClassPage

---

### SponsorTypeSelector

**File Path:** `src/components/pledge/SponsorTypeSelector.tsx`

**Purpose:** Card selector for choosing between sponsoring own children vs supporting a classroom.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedType` | `SponsorType \| null` | - | Selected type |
| `onSelect` | `(type: SponsorType) => void` | - | Selection callback |
| `hasChildren` | `boolean` | - | Whether user has children registered |

**Types:** `SponsorType = "my-children" | "support-classroom"`

**Visual Structure:**
```
<div className="space-y-6">
  <div (header)>
    <h2>Who would you like to sponsor?</h2>
    <p>Choose how you'd like to support reading</p>
  </div>
  <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
    {/* My Children - hidden if !hasChildren */}
    <Card className={cn(selectedType === "my-children" && "ring-2 ring-primary")}>
      <User className="h-8 w-8" />
      <h3>My Children</h3>
      <p>Sponsor your own child's reading journey</p>
    </Card>
    
    {/* Support a Classroom */}
    <Card className={cn(selectedType === "support-classroom" && "ring-2 ring-primary")}>
      <School className="h-8 w-8" />
      <h3>Support a Classroom</h3>
      <p>Make a general donation to support a class</p>
    </Card>
  </div>
</div>
```

**Used On:** SponsorMyChildPage

---

### ClassroomPledgeForm

**File Path:** `src/components/pledge/ClassroomPledgeForm.tsx`

**Purpose:** Multi-step form for creating classroom pledges with flat or milestone-based options.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pledgeType` | `ClassroomPledgeType` | - | "flat" or "milestone" |
| `onPledgeTypeChange` | `(type) => void` | - | Type change callback |
| `flatAmount` | `string` | - | Flat donation amount |
| `onFlatAmountChange` | `(amount) => void` | - | Amount change callback |
| `milestoneTiers` | `MilestoneTier[]` | - | Array of milestone tiers |
| `onMilestoneTiersChange` | `(tiers) => void` | - | Tiers change callback |
| `className` | `string` | - | Class name |
| `teacherName` | `string \| null` | - | Teacher name |

**Types:**
- `ClassroomPledgeType = "flat" | "milestone"`
- `MilestoneTier = { id: string; amount: string; minutesTarget: string }`

**Visual Structure:**
```
<div style={handDrawnBorder}>
  <h2>Support {className}</h2>
  
  {/* Step 1: Pledge Type */}
  <RadioGroup>
    <Label (Fixed Donation with DollarSign icon) />
    <Label (Reading Milestone with Target icon) />
  </RadioGroup>
  
  {/* Step 2: Amount */}
  {pledgeType === "flat" ? (
    <div>
      {[25, 50, 100, 250].map(amount => <button />)}
      <FormField (custom amount) />
    </div>
  ) : (
    <div>
      {milestoneTiers.map(tier => (
        <div>
          <Input (minutes target) />
          <Input (amount) />
          {/* Quick set buttons */}
        </div>
      ))}
      <Button>Add Another Milestone</Button>
    </div>
  )}
  
  {/* Summary */}
  <div className="bg-primary/5">
    <CheckCircle />
    <p>You're pledging ${amount}...</p>
  </div>
</div>
```

**Used On:** SponsorMyChildPage, SponsorClassPage

---

## Classroom Components

### ClassProgressCard

**File Path:** `src/components/classroom/ClassProgressCard.tsx`

**Purpose:** Summary card showing class reading stats and fundraising progress.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Class identifier |
| `teacherName` | `string \| null` | - | Teacher name |
| `eventId` | `string \| null` | - | Event ID for milestone data |
| `showFundraising` | `boolean` | `true` | Show fundraising progress |
| `milestoneGoal` | `number` | `1000` | Class party target |
| `compact` | `boolean` | `false` | Compact display mode |

**Visual Structure:**
```
<Card>
  <CardHeader>
    <CardTitle>{className} • {teacherName}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Stats Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4">
      <Clock /> {totalMinutes} Minutes Read
      <BookOpen /> {totalBooks} Books Read
      <Users /> {studentCount} Readers
      <DollarSign /> ${totalUnlocked} Earned
    </div>
    
    {/* Fundraising Progress */}
    <Progress value={fundraisingProgress} />
    <p>${remaining} more to unlock class party</p>
    
    {/* Next Reading Milestone */}
    <div className="bg-muted/50">
      <Target /> Next Milestone
      <Progress />
      <p>{minutesToNext} more minutes to unlock ${nextAmount}</p>
    </div>
  </CardContent>
</Card>
```

**Loading State:** Skeleton with card structure
**Uses Hooks:** `useClassReadingStats`, `useClassMilestoneStatus`

**Used On:** TeacherDashboard, StudentPinDashboardPage (compact mode)
