# Page Composition

Mapping of pages to layout shells and component usage. This document describes **composition only**—for visual appearance, see `COMPONENT_SPECS.md` and `DESIGN_TOKENS.md`.

---

## Table of Contents

1. [Public Pages](#public-pages)
2. [Authentication Pages](#authentication-pages)
3. [Onboarding Pages](#onboarding-pages)
4. [Parent/Family Pages](#parentfamily-pages)
5. [Admin Pages](#admin-pages)
6. [Teacher Pages](#teacher-pages)
7. [Sponsor Pages](#sponsor-pages)
8. [Student Pages](#student-pages)

---

## Public Pages

### HomePage

| Property | Value |
|----------|-------|
| Route | `/` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/HomePage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. LogoBanner (returns null)
3. Countdown Badge (inline)
4. Hero Section (inline)
   - FontDebugOverlay (conditional: `?debugFonts=1`)
   - Button (Get Started, Learn More)
5. Stats Section (inline grid/scroll)
6. Section Divider (hand-drawn border)
7. How It Works Section (inline grid)
8. Making a Difference Section (inline list)
9. CTA Section (inline)
   - Button (Register Now, Sign In)
10. Footer

**Conditional States:**
- Loading: None (hooks handle content fallbacks)
- Empty: Uses `DEFAULT_CONTENT` fallbacks

---

### AboutPage

| Property | Value |
|----------|-------|
| Route | `/about` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/AboutPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Hero Section (inline with highlighter)
3. Section Divider
4. Mission Section (inline two-column)
5. Statistics Grid (inline)
6. Section Divider
7. Values Section (inline grid)
8. Privacy & Safety Section (inline)
9. Footer

**Conditional States:**
- Uses `DEFAULT_CONTENT` fallbacks for all dynamic content

---

### HowItWorksPage

| Property | Value |
|----------|-------|
| Route | `/how-it-works` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/HowItWorksPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Hero Section
3. Step Cards (inline)
4. CTA Section
5. Footer

---

### FAQPage

| Property | Value |
|----------|-------|
| Route | `/faq` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/FAQPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Hero Section
3. Accordion (FAQ items)
4. CTA Section
5. Footer

---

### PrivacyPage

| Property | Value |
|----------|-------|
| Route | `/privacy` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/PrivacyPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Content Section (inline prose)
3. Footer

---

### NotFound

| Property | Value |
|----------|-------|
| Route | `*` (404) |
| Layout Shell | `PublicLayout` |
| File | `src/pages/NotFound.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Error Content
   - BookIcon
   - Button (Go Home, Go Back)
3. Footer

---

## Authentication Pages

### LoginPage

| Property | Value |
|----------|-------|
| Route | `/login` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/auth/LoginPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - Logo
   - Form Card (hand-drawn border)
     - FormField
     - Input (email)
     - Input (password)
     - Button (Sign In)
     - Link (Forgot Password, Register)
3. Footer

**Conditional States:**
- Loading: Button loading state
- Error: FormField error display

---

### RegisterPage

| Property | Value |
|----------|-------|
| Route | `/register` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/auth/RegisterPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - Logo
   - Form Card (hand-drawn border)
     - FormField
     - Input (name, email, password)
     - Checkbox (terms)
     - Button (Create Account)
     - Link (Login)
3. Footer

**Conditional States:**
- Loading: Button loading state
- Error: FormField error display

---

### ForgotPasswordPage

| Property | Value |
|----------|-------|
| Route | `/forgot-password` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/auth/ForgotPasswordPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - Logo
   - Form Card
     - FormField
     - Input (email)
     - Button (Send Reset Link)
3. Footer

**Conditional States:**
- Success: Shows confirmation message with CheckCircle2 icon

---

### StudentLoginPage (PIN-based)

| Property | Value |
|----------|-------|
| Route | `/student/login` |
| Layout Shell | Custom (gradient background, no footer) |
| File | `src/pages/student/StudentPinLoginPage.tsx` |

**Components Used (top to bottom):**
1. Header with Logo
2. BookContainer
   - BookOpen icon
   - FormField (username)
   - FormField (password with toggle)
   - Button (Let's Read!)
   - Help text
   - Link (Parent/Teacher login)

**Conditional States:**
- Loading: Button loading state

---

### OldStudentLoginPage (Legacy)

| Property | Value |
|----------|-------|
| Route | `/student-login` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/auth/StudentLoginPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Decorative Stars (absolute positioned)
3. BookContainer (variant="warm")
   - BookIcon (in gradient circle)
   - Toggle Buttons (Student Code / Email)
   - FormField (studentCode OR email)
   - Button (Let's Read!)
   - Button (Try Demo Mode)
   - BookIcon decorations
   - Link (Parent/Teacher login)
4. Footer

**Conditional States:**
- Loading: Button loading state

---

### AdminLoginPage

| Property | Value |
|----------|-------|
| Route | `/admin/login` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/auth/AdminLoginPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - Logo
   - Form Card
     - FormField
     - Input (email, password)
     - Button (Sign In)
3. Footer

---

## Onboarding Pages

### OnboardingAddChild

| Property | Value |
|----------|-------|
| Route | `/onboarding/add-child` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/onboarding/OnboardingAddChild.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - Back Link (conditional: from dashboard)
   - Progress Indicator (step 1/3)
   - Form Card (hand-drawn border)
     - FormField (firstName, lastName)
     - Select (grade)
     - Select (teacher) or Input (custom teacher)
     - Goal Presets (Button group)
     - Input (readingGoal)
     - Switch (allowPublicLink)
     - Checkbox (multipleChildren)
     - Button (Continue)
3. Footer

**Conditional States:**
- Loading: Auth loading state
- Redirect: To `/register` if not authenticated

---

### OnboardingPledge

| Property | Value |
|----------|-------|
| Route | `/onboarding/pledge` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/onboarding/OnboardingPledge.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - Progress Indicator (step 2/3)
   - Form Card
     - PledgeAmountForm
     - Button (Continue, Skip)
3. Footer

---

### OnboardingComplete

| Property | Value |
|----------|-------|
| Route | `/onboarding/complete` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/onboarding/OnboardingComplete.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section (`bg-background-warm`, max-w-lg)
   - Progress Indicator (3 steps, all complete with Check icons)
   - Success Card (hand-drawn border)
     - CheckCircle icon (success circle)
     - ReadingGoalRing (showing 0 progress)
     - Child summary (name, goal, pledge amount)
     - **Share Section:**
       - Copy Link (Input + Button)
       - Share Buttons (Email, SMS, Facebook, Print)
     - **Action Buttons:**
       - Button (Add Another Child) — conditional: hasMultipleChildren
       - Button (Add Another Pledge)
       - Button (Go to Dashboard)
3. Footer

**Conditional States:**
- Loading: Shows "Loading..." text
- No child data: Redirects to `/onboarding/add-child`
- Not authenticated: Redirects to `/login`

---

## Parent/Family Pages

### DashboardPage

| Property | Value |
|----------|-------|
| Route | `/dashboard` |
| Layout Shell | Custom (MainNav + Footer + BottomTabBar) |
| File | `src/pages/DashboardPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (`bg-background-warm`)
   - Header Section (welcome message)
   - Button (Log Out)
   - **Your Readers Section:**
     - ChildProgressCard (per child) — inline component
       - ReadingGoalRing
       - ClassFundraisingShelf (conditional: milestone enabled)
     - Empty State (if no children)
       - BookOpen icon
       - Button (Add Your First Reader)
   - **PledgesSection**
     - PledgeCard (per pledge)
     - EditPledgeDialog
   - **ChildBooksSection** (mobile: hidden)
   - **Recent Activity** (inline list)
   - **Sidebar (lg+):**
     - Quick Actions menu
3. Bottom Spacer (mobile)
4. Footer
5. BottomTabBar (role: "parent")

**Conditional States:**
- Loading: Skeleton placeholders
- Empty (children): Add child CTA
- Empty (pledges): Invite sponsors CTA
- Sponsor-only redirect: Navigates to `/sponsor/dashboard`

---

### ManageChildrenPage

| Property | Value |
|----------|-------|
| Route | `/children` |
| Layout Shell | Custom (MainNav + Footer + BottomTabBar) |
| File | `src/pages/family/ManageChildrenPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content
   - Back Link (to Dashboard)
   - Header with Button (Add Child)
   - Children List:
     - Collapsible (per child)
       - Child Header (avatar, name, ReadingGoalRing)
       - Button (Invite Sponsors, Edit Profile)
       - DropdownMenu (actions)
       - CollapsibleContent:
         - ChildReadingLogsSection
           - ReadingLogsTable
   - Empty State (if no children)
3. Bottom Spacer
4. Footer
5. BottomTabBar
6. EditChildDialog
7. AlertDialog (delete confirmation)

**Conditional States:**
- Loading: LoadingSpinner centered
- Empty: EmptyState component

---

### ChildDetailsPage

| Property | Value |
|----------|-------|
| Route | `/children/:id` |
| Layout Shell | Custom (MainNav + Footer + BottomTabBar) |
| File | `src/pages/family/ChildDetailsPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (two-column on lg+)
   - **Left Column:**
     - Back Link
     - Header (avatar, name, grade, class)
     - Button (Edit Profile) — conditional: owner
     - **Reading Progress Card:**
       - ReadingGoalRing
       - Stats Grid (Clock, Flame, Calendar, BookOpen icons)
       - Verification Badge (conditional)
     - **Community Progress Card:**
       - Class Total (School icon)
       - Grade Total (GraduationCap icon)
     - **Reading Log Section:**
       - ReadingLogsTable (with inline editing)
       - Checkbox (bulk selection)
       - Button (Validate)
   - **Right Column (lg+ only):**
     - **Pledges Card:**
       - PledgeCard (per pledge)
     - **Quick Actions Menu**
       - Button (Log Reading, Invite Sponsors)
3. Bottom Spacer
4. Footer
5. BottomTabBar
6. EditChildDialog

**Conditional States:**
- Loading: Skeleton placeholders
- Error (not found): Error message with back button
- Empty (logs): "No reading logged yet" message
- Empty (pledges): Invite sponsors CTA

---

### LogReadingPage

| Property | Value |
|----------|-------|
| Route | `/log` |
| Layout Shell | Custom (MainNav + Footer, no BottomTabBar) |
| File | `src/pages/LogReadingPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (max-w-2xl)
   - Back Link (to Dashboard)
   - Page Header
   - Grace Period Notice (conditional: `phase === 'grace_period'`)
   - Child Selector (toggle buttons, conditional: multiple children)
   - Child Stats Card
     - Avatar, progress percentage
   - **Success State (conditional):**
     - Check/PartyPopper icon
     - Celebration message
   - **Form Card:**
     - FormField (Date with Calendar Popover)
     - Minutes Stepper (presets + custom input)
     - BookSelector
     - FormField (Notes)
     - Preview Card
     - Button (Log Reading)
   - **Reading History:**
     - Collapsible
       - Log entries with edit/delete
3. Footer
4. AlertDialog (delete confirmation)

**Conditional States:**
- Loading: Skeleton placeholders
- Blocked (pre-event): "Reading Starts Soon" message
- Blocked (closed): "Read-a-thon Complete" message
- No children: "No Children Added" message
- Success: Success celebration card
- Empty history: "No reading logged yet" message

---

### MyPledgesPage

| Property | Value |
|----------|-------|
| Route | `/my-pledges` |
| Layout Shell | Custom (MainNav + Footer + BottomTabBar) |
| File | `src/pages/MyPledgesPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content
   - Header
   - PledgesSection
     - PledgeCard (per pledge)
3. Bottom Spacer
4. Footer
5. BottomTabBar

---

### AccountSettingsPage

| Property | Value |
|----------|-------|
| Route | `/account` |
| Layout Shell | Custom (MainNav + Footer + BottomTabBar) |
| File | `src/pages/AccountSettingsPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content
   - Header
   - Profile Section
     - FormField (name, email, phone)
   - Children Section
     - Child cards with edit
   - Notification Settings
   - Button (Save, Log Out)
3. Bottom Spacer
4. Footer
5. BottomTabBar

---

## Admin Pages

### AdminDashboard

| Property | Value |
|----------|-------|
| Route | `/admin` |
| Layout Shell | `AdminLayout` |
| File | `src/pages/admin/AdminDashboard.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Admin Nav Bar
3. Main Content
   - Header with highlighter effect
   - Badge (event status)
   - **Key Metrics Grid:**
     - Stat Cards (Students, Minutes, Pledged, Collected)
   - **Attention Needed Section (conditional):**
     - Alert Cards with Links
   - **Quick Actions:**
     - Button (Send Reminders)
     - DropdownMenu (Download Reports)
     - Button (Manage Event)
   - **Two Column Grid:**
     - Recent Activity List
     - Outstanding Payments Table
       - Checkbox (selection)
       - Table (Sponsor, Student, Amount, Days)
       - Button (View All, Send Reminders)
4. Bottom Spacer
5. Footer
6. BottomTabBar (role: "admin")
7. Dialog (Send Reminders Modal)

**Conditional States:**
- Loading: Skeleton grid
- Empty (activity): "No recent activity" message
- Empty (outstanding): "All payments collected!" message

---

### AdminReadingLogsPage

| Property | Value |
|----------|-------|
| Route | `/admin/reading` |
| Layout Shell | `AdminLayout` |
| File | `src/pages/admin/AdminReadingLogsPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Admin Nav Bar
3. Main Content
   - Header
   - **Stats Summary Grid:**
     - Total Logs, Total Minutes, Unique Students, Avg Minutes
     - Filter Buttons (Over 8 Hours, 10+ Hrs/Day)
   - **Filters Row:**
     - Input (search)
     - Select (grade, class, date)
   - **Table:**
     - TableHeader
     - TableBody (logs)
       - Badge (minutes with AlertTriangle if large)
     - TablePagination
4. Footer

**Conditional States:**
- Loading: LoadingSpinner centered
- Empty: "No reading logs found" message

---

### AdminSettingsPage

| Property | Value |
|----------|-------|
| Route | `/admin/settings` |
| Layout Shell | `AdminPageLayout` |
| File | `src/pages/admin/AdminSettingsPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Admin Nav Bar
3. AdminPageLayout
   - Title with highlighter
   - Actions: Button (Create Event / Save Changes)
4. Main Content (max-w-3xl)
   - **No Event State (conditional):**
     - FileText icon
     - Button (Create New Read-a-thon)
   - **Event Details Card:**
     - FormField (Event Name, School Name)
     - Date Pickers (Start, End, Last Log)
     - Input (Goal Minutes)
     - Select (Timezone)
   - **Payment Settings Card:**
     - Textarea (Check Address)
     - Switch (Accept Cards, Accept Checks)
   - **Email Settings Card:**
     - Switch (Send Reminders)
     - Input (Reminder Days)
   - **Class Milestone Card:**
     - Switch (Enable)
     - Input (Goal, Reward)
   - **Teacher Logging Card:**
     - Checkbox (per grade)
   - **TeacherManagement**
   - **LogVerificationSettings**
   - **LogoGenerator**
   - **Danger Zone Card:**
     - Button (End Event, Delete Event)
5. Bottom Spacer
6. Footer
7. BottomTabBar
8. EditEventDialog
9. Dialog (End Event, Delete confirmation)

**Conditional States:**
- Loading: Skeleton placeholders
- No event: Create event CTA

---

### AdminUsersPage

| Property | Value |
|----------|-------|
| Route | `/admin-users` |
| Layout Shell | `AdminPageLayout` |
| File | `src/pages/AdminUsersPage.tsx` |

**Components Used (top to bottom):**
1. AdminPageLayout (title: "Users")
2. Filters (Input, Select)
3. Table (users with roles)
4. TablePagination

---

### AdminFinancePage

| Property | Value |
|----------|-------|
| Route | `/admin-finance` |
| Layout Shell | `AdminPageLayout` |
| File | `src/pages/AdminFinancePage.tsx` |

**Components Used (top to bottom):**
1. AdminPageLayout (title: "Finance")
2. Stats Cards
3. Tabs (Pledges, Payments)
4. Table

---

### AdminEmailPage

| Property | Value |
|----------|-------|
| Route | `/admin/emails` |
| Layout Shell | `AdminPageLayout` |
| File | `src/pages/admin/AdminEmailPage.tsx` |

**Components Used (top to bottom):**
1. AdminPageLayout (title: "Emails")
2. Tabs (Templates, Logs)
3. Template Editor / Log Table

---

### AdminSiteContentPage

| Property | Value |
|----------|-------|
| Route | `/admin/content` |
| Layout Shell | `AdminPageLayout` |
| File | `src/pages/admin/AdminSiteContentPage.tsx` |

**Components Used (top to bottom):**
1. AdminPageLayout (title: "Site Content")
2. SiteContentEditor

---

## Teacher Pages

### TeacherDashboard

| Property | Value |
|----------|-------|
| Route | `/teacher` |
| Layout Shell | Custom (MainNav + Footer, no BottomTabBar) |
| File | `src/pages/teacher/TeacherDashboard.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (`bg-background-warm`)
   - Header (teacher name, teacher type label)
   - Button (Sign Out)
   - **Event Status Banner (conditional: activeEvent):**
     - Calendar icon
     - Event name, days remaining, participation stats
     - Badge (Active)
   - **Stats Row:**
     - Stat Cards (Students, Participating, Total Minutes, Avg per Student)
       - Each with icon in colored circle
   - **Filters Row:**
     - Input (search with Search icon)
     - Select (sortBy: name/progress/last-active)
     - Select (filterBy: all/needs-attention/goal-reached)
     - Select (grade) — conditional: staff/full access
     - Select (class) — conditional: staff or partner with multiple classes
     - Button (Log Reading) with Tooltip if disabled
     - Button (Export)
   - **Student Grid:**
     - Student Cards (handDrawnBorder)
       - ReadingGoalRing (size=50)
       - Name, grade/class info
       - Badge (status: Goal Reached/On Track/Needs Encouragement/Not Started)
       - "Last active" text
       - Books Tooltip (conditional: has books)
3. Footer

**Conditional States:**
- Auth Loading: Centered Loader2 spinner
- Loading: Skeleton grid (8 cards)
- Redirect: To `/login` if not authenticated or not a teacher
- Empty (filtered): No results message

---

### TeacherLogReading

| Property | Value |
|----------|-------|
| Route | `/teacher/log` |
| Layout Shell | Custom (MainNav, no Footer) |
| File | `src/pages/teacher/TeacherLogReading.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content
   - Header
   - Student Selector
   - Log Form

---

### TeacherLoginPage

| Property | Value |
|----------|-------|
| Route | `/teacher/login` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/teacher/TeacherLoginPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Card
   - FormField (email, password)
   - Button (Sign In)
3. Footer

---

## Sponsor Pages

### SponsorDashboardPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/dashboard` |
| Layout Shell | Custom (MainNav + Footer + BottomTabBar) |
| File | `src/pages/sponsor/SponsorDashboardPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (two-column on lg+)
   - **Left Column:**
     - Header (welcome message)
     - Sponsored Children/Classes Cards
       - ReadingGoalRing
       - Book List
     - Pledges Section
       - PledgeCard
   - **Right Column (lg+ only):**
     - Quick Actions Menu
3. Bottom Spacer
4. Footer
5. BottomTabBar (role: "sponsor")

**Conditional States:**
- Loading: Skeleton placeholders
- Empty: "No sponsorships" message

---

### SponsorPaymentPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/pay` |
| Layout Shell | Custom (MainNav + Footer) |
| File | `src/pages/sponsor/SponsorPaymentPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content
   - Payment Summary Card
   - SquareCardForm
   - Button (Pay Now)
3. Footer

---

### SponsorCheckEmailPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/check-email` |
| Layout Shell | Custom (MainNav + Footer) |
| File | `src/pages/sponsor/SponsorCheckEmailPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Content
   - BookContainer
     - Mail icon with CheckCircle
     - Email confirmation message
     - Button (Resend email)
     - Link (Try different email)
3. Footer

**Conditional States:**
- Redirect: To `/sponsor/login` if no email in state
- Cooldown: Button disabled with countdown

---

### SponsorPledgedPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/pledged` |
| Layout Shell | Minimal (header only) |
| File | `src/pages/sponsor/SponsorPledgedPage.tsx` |

**Components Used (top to bottom):**
1. Header (logo + close)
2. Centered Content
   - BookContainer
     - CheckCircle icon
     - Confirmation message
     - ReadingGoalRing
     - Pledge details
     - Mail notification
     - Button (Pay Now, Sponsor Another)

---

### SponsorThankYouPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/thank-you` |
| Layout Shell | Minimal |
| File | `src/pages/sponsor/SponsorThankYouPage.tsx` |

**Components Used:**
1. Celebration Card
   - Confetti
   - Thank you message

---

## Student Pages

### StudentDashboardPage (Demo/Legacy)

| Property | Value |
|----------|-------|
| Route | `/student` |
| Layout Shell | Custom (PageHeader, gradient bg, no footer) |
| File | `src/pages/student/StudentDashboardPage.tsx` |

**Components Used (top to bottom):**
1. PageHeader (with Exit button)
2. Main Content (max-w-lg, centered, `bg-gradient-to-b from-brand-yellow/20 to-background-warm`)
   - Welcome Header (`font-handwritten`, "Hi, {name}! 📚")
   - **Hero Progress BookContainer:**
     - ReadingGoalRing (size=200, mobileSize=180)
     - Minutes count (font-serif text-5xl)
     - Milestone message (dynamic color based on progress)
   - **Class Progress BookContainer (conditional: has class + milestoneStatus):**
     - Target icon + heading
     - Class earnings display
     - Class total minutes
     - Next milestone card OR "All milestones reached" card
   - **Sponsors Cheering Section:**
     - Heart icons (animated pulse)
   - **Big CTA Button:**
     - "I Read Today!" (h-[72px], bg-brand-yellow)
   - **Recent Reading BookContainer (variant="warm"):**
     - Log entries with BookOpen icons

**Conditional States:**
- No student data: Returns null (guards render)

---

### StudentPinDashboardPage (Authenticated)

| Property | Value |
|----------|-------|
| Route | `/student/dashboard` |
| Layout Shell | Custom (MainNav + Footer) |
| File | `src/pages/student/StudentPinDashboardPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. **Hero Section:**
   - Editorial headline ("Janney students have read X minutes")
   - Highlighter effect on number
3. Blue Divider Line
4. Main Content (`bg-background-warm`, two-column on lg+)
   - **Left Column:**
     - Header (Welcome, {name}!)
     - Button (Log Out)
     - **Progress Card (handDrawnBorder):**
       - ReadingGoalRing (size=120, mobileSize=100)
       - Stats Grid (Goal, Today, This Week, Sessions)
       - Class Fundraising Shelf (conditional)
       - Button (Log Reading) — opens dialog
     - **Reading History Card:**
       - Recent logs with edit/delete buttons
       - Badge (verification status)
       - Edit Dialog
   - **Right Column (lg+ only):**
     - **Class Summary Card**
     - **Grade Summary Card**
     - **Favorite Books Card** (class + grade favorites)
5. Footer
6. Dialog (Log Reading modal with MobileMinutesStepper, BookSelector)

**Conditional States:**
- Session Loading: Skeleton placeholders
- Not authenticated: Redirects via requireAuth()
- Goal reached: Celebratory message
- Logs verified: Edit/delete buttons hidden

---

### StudentLogReadingPage

| Property | Value |
|----------|-------|
| Route | `/student/log` |
| Layout Shell | Custom (PageHeader, gradient bg) |
| File | `src/pages/student/StudentLogReadingPage.tsx` |

**Components Used (top to bottom):**
1. PageHeader
2. Main Content (max-w-lg)
   - MobileMinutesStepper
   - BookSelector
   - Button (Log Reading)

---

### StudentBooksPage

| Property | Value |
|----------|-------|
| Route | `/student/books` |
| Layout Shell | Custom (PageHeader, gradient bg) |
| File | `src/pages/student/StudentBooksPage.tsx` |

**Components Used (top to bottom):**
1. PageHeader
2. Main Content
   - Book Grid
   - BarcodeScanner

---

## Component Index

Quick reference of components used across pages:

| Component | Used In |
|-----------|---------|
| MainNav | All public/authenticated pages (except StudentDashboardPage legacy) |
| Footer | Most pages (except legacy student pages using PageHeader) |
| BottomTabBar | Dashboard, Children, Sponsor, Admin pages (mobile) |
| PublicLayout | Home, About, FAQ, Auth, Privacy pages |
| AdminLayout | Admin Dashboard, Admin Reading Logs |
| AdminPageLayout | Admin Settings, Admin Email, Admin Content, Admin Users, Admin Finance |
| PageHeader | StudentDashboardPage (legacy), StudentLogReadingPage, StudentBooksPage |
| BookContainer | Student pages, OnboardingComplete, Sponsor confirmation pages |
| ReadingGoalRing | Dashboard, ChildDetails, Teacher, Student, OnboardingComplete |
| ClassFundraisingShelf | Dashboard, StudentPinDashboard, Sponsor Dashboard |
| PledgeCard | Dashboard, ChildDetails, MyPledges |
| FormField | All forms |
| Button | All pages |
| Input | All forms |
| Select | Filters, forms, onboarding |
| Table | Admin pages, outstanding payments |
| Dialog | Confirmations, modals, log editing |
| Skeleton | Loading states |
| Badge | Status indicators (payment, verification, student status) |
| Collapsible | Expandable sections (ManageChildren, LogReading history) |
| Tooltip | Teacher dashboard (disabled buttons), student books |
| handDrawnBorder | Cards across all authenticated pages (defined inline) |
