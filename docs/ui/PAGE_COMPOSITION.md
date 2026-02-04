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
9. [Debug Pages](#debug-pages)

---

## Route Validation Cross-Reference

This section validates all routes in `src/App.tsx` against documented pages.

| Route | Documented | Page Component | Notes |
|-------|------------|----------------|-------|
| `/` | ✅ | HomePage | Public |
| `/about` | ✅ | AboutPage | Public |
| `/how-it-works` | ✅ | HowItWorksPage | Public |
| `/faq` | ✅ | FAQPage | Public |
| `/privacy` | ✅ | PrivacyPage | Public |
| `/debug/progress-ring` | ✅ | DebugRingPage | Debug |
| `/sponsor` | ✅ | SponsorGatewayPage | Sponsor |
| `/sponsor/:childId` | ✅ | SponsorLandingPage | Sponsor |
| `/f/:userId` | ✅ | FamilySponsorPage | Sponsor |
| `/invite/:token` | ✅ | ChildToFamilyRedirect | Redirect |
| `/s/:code` | ✅ | ChildToFamilyRedirect | Redirect |
| `/returning/:code` | ✅ | ReturningSponsorPage | Sponsor |
| `/sponsor/thank-you` | ✅ | SponsorThankYouPage | Sponsor |
| `/sponsor/pledged` | ✅ | SponsorPledgedPage | Sponsor |
| `/sponsor/check-instructions` | ✅ | SponsorCheckInstructionsPage | Sponsor |
| `/login` | ✅ | LoginPage | Auth |
| `/register` | ✅ | RegisterPage | Auth |
| `/student-login` | ✅ | OldStudentLoginPage | Auth (legacy) |
| `/forgot-password` | ✅ | ForgotPasswordPage | Auth |
| `/sponsor/auth` | ✅ | SponsorAuthPage | Auth |
| `/admin/login` | ✅ | AdminLoginPage | Auth |
| `/onboarding/add-child` | ✅ | OnboardingAddChild | Onboarding |
| `/onboarding/pledge` | ✅ | OnboardingPledge | Onboarding |
| `/onboarding/complete` | ✅ | OnboardingComplete | Onboarding |
| `/onboarding/re-enroll` | ✅ | ReEnrollmentPage | Onboarding |
| `/dashboard` | ✅ | DashboardPage | Parent/Family |
| `/children` | ✅ | ManageChildrenPage | Parent/Family |
| `/children/:id` | ✅ | ChildDetailsPage | Parent/Family |
| `/family/manage` | ✅ | ManageChildrenPage | Alias |
| `/family/sponsor-requests` | ✅ | SponsorRequestsPage | Parent/Family |
| `/family/children/:id/settings` | ✅ | ChildDetailsPage | Alias |
| `/family/sponsor-my-child` | ✅ | SponsorMyChildPage | Parent/Family |
| `/reading-logs/approve` | ✅ | VerifyLogsPage | Parent/Family |
| `/children/:id/invite` | ✅ | InviteSponsorsPage | Parent/Family |
| `/invite` | ✅ | InviteSponsorsPage | Parent/Family |
| `/children/:id/add-sponsor` | ✅ | AddSponsorPage | Parent/Family |
| `/log-reading` | ✅ | LogReadingPage | Parent/Family |
| `/my-pledges` | ✅ | MyPledgesPage | Parent/Family |
| `/account` | ✅ | AccountSettingsPage | Parent/Family |
| `/sponsor/login` | ✅ | SponsorLoginPage | Sponsor |
| `/sponsor/check-email` | ✅ | SponsorCheckEmailPage | Sponsor |
| `/sponsor/dashboard` | ✅ | SponsorDashboardPage | Sponsor |
| `/sponsor/pay` | ✅ | SponsorPaymentPage | Sponsor |
| `/sponsor/class` | ✅ | SponsorClassPage | Sponsor |
| `/sponsor/guest-pay` | ✅ | GuestPaymentPage | Sponsor |
| `/student/login` | ✅ | StudentPinLoginPage | Student |
| `/student/dashboard` | ✅ | StudentPinDashboardPage | Student |
| `/student/books` | ✅ | StudentBooksPage | Student |
| `/student` | ✅ | StudentDashboardPage | Student (legacy) |
| `/student/log` | ✅ | StudentLogReadingPage | Student |
| `/teacher/login` | ✅ | TeacherLoginPage | Teacher |
| `/teacher/register` | ✅ | TeacherRegisterPage | Teacher |
| `/teacher/set-password` | ✅ | TeacherSetPasswordPage | Teacher |
| `/teacher` | ✅ | TeacherDashboard | Teacher |
| `/teacher/log` | ✅ | TeacherLogReading | Teacher |
| `/admin` | ✅ | AdminDashboard | Admin |
| `/admin/reading` | ✅ | AdminReadingLogsPage | Admin |
| `/admin/outstanding` | ✅ | AdminOutstandingPage | Admin |
| `/admin/checks` | ✅ | AdminChecksPage | Admin |
| `/admin/emails` | ✅ | AdminEmailPage | Admin |
| `/admin/content` | ✅ | AdminSiteContentPage | Admin |
| `/admin/settings` | ✅ | AdminSettingsPage | Admin |
| `/admin-users` | ✅ | AdminUsersPage | Admin |
| `/admin-finance` | ✅ | AdminFinancePage | Admin |
| `*` | ✅ | NotFound | 404 |

**Last validated:** 2026-02-04 against `src/App.tsx`

---

## Route Aliases

Some pages are accessible via multiple routes for backward compatibility or semantic clarity. The canonical route is listed first.

| Canonical Route | Alias Route(s) | Page Component | Notes |
|-----------------|----------------|----------------|-------|
| `/children` | `/family/manage` | ManageChildrenPage | Legacy family management path |
| `/children/:id` | `/family/children/:id/settings` | ChildDetailsPage | Settings-focused alias for child details |
| `/invite` | `/children/:id/invite` | InviteSponsorsPage | Child-specific invite path; both valid entry points |
| `/s/:code` | `/invite/:token` | ChildToFamilyRedirect | Legacy child-specific links; both redirect to `/f/:userId` |

**Behavior:** 
- **Static aliases** (ManageChildrenPage, ChildDetailsPage, InviteSponsorsPage): Both routes render the same component with identical functionality. No redirects occur—both routes are valid entry points.
- **Redirect aliases** (ChildToFamilyRedirect): Legacy child-specific sponsor links that redirect to the family-based sponsor page (`/f/:userId`) with the child pre-selected via query param.

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

### ReEnrollmentPage

| Property | Value |
|----------|-------|
| Route | `/onboarding/re-enroll` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/onboarding/ReEnrollmentPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - BookContainer
     - Logo
     - Welcome Message (personalized)
     - **Children List:**
       - Card (per child)
         - Checkbox
         - Child name/previous info
         - Badge (Ready status)
         - Select (grade)
         - Select (teacher)
     - **Reading Goal Selection:**
       - Button group (preset goals)
       - Input (custom goal)
     - Link (Add New Child)
     - Button (Enroll)
3. Dialog (Re-invite Sponsors)
   - Previous sponsor list with Checkbox
   - Button (Send Invitations, Skip)
4. Footer

**Conditional States:**
- Loading: None (mock data)
- Enrollment Complete: Shows sponsor re-invite dialog

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
| Route Alias | `/family/manage` |
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
| Route Alias | `/family/children/:id/settings` |
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
| Route | `/log-reading` |
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

### SponsorRequestsPage

| Property | Value |
|----------|-------|
| Route | `/family/sponsor-requests` |
| Layout Shell | Custom (MainNav + Footer) |
| File | `src/pages/family/SponsorRequestsPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (max-w-3xl)
   - Header
   - **Privacy Notice Card (hand-drawn border):**
     - Shield icon
     - Privacy explanation text
   - **Pending Requests Section:**
     - Cards per request (hand-drawn border)
       - User icon + name/email
       - Badge (Returning)
       - Stats grid (Last sponsored, Times sponsored, Total given)
       - Button (Approve, Decline)
   - **Recently Processed Section (conditional):**
     - Cards with Badge (Approved/Declined)
   - Help text footer
3. Footer
4. AlertDialog (approve/deny confirmation with sharing permission checkbox)

**Conditional States:**
- Empty pending: "No pending requests right now" message

---

### SponsorMyChildPage

| Property | Value |
|----------|-------|
| Route | `/family/sponsor-my-child` |
| Layout Shell | Custom (MainNav + Footer) |
| File | `src/pages/family/SponsorMyChildPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (max-w-2xl)
   - Step Navigation (4 steps: Type, Select, Amount, Confirmation)
   - **Step 0 - Type Selection:**
     - SponsorTypeSelector
     - Buttons (Back, Continue)
   - **Step 1 - Selection:**
     - ChildSelector (my-children) or ClassSelector (classroom)
     - Buttons (Back, Continue)
   - **Step 2 - Amount:**
     - PledgeAmountForm or ClassroomPledgeForm
     - Buttons (Back, Create Pledge)
   - **Step 3 - Confirmation:**
     - CheckCircle success icon
     - Pledge summary card
     - Buttons (Dashboard, Another Pledge)
3. Footer

---

### VerifyLogsPage

| Property | Value |
|----------|-------|
| Route | `/reading-logs/approve` |
| Layout Shell | Custom (MainNav + Footer) |
| File | `src/pages/reading-logs/VerifyLogsPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (max-w-5xl)
   - Back Link (to Dashboard)
   - Header with Badge (flagged count)
   - **Stats Summary (hand-drawn border):**
     - Pending Logs, Total Minutes, Needs Review
   - **Filters Row:**
     - Select (filter by: all, flagged, student, parent)
     - Buttons (Approve, Reject) - conditional on selection
   - **Table (hand-drawn border):**
     - Checkbox (select all)
     - TableHeader
     - TableBody
       - Checkbox per row
       - Student with AlertTriangle (if flagged)
       - Book title
       - Minutes
       - Date
       - Badge (source)
       - Action buttons (CheckCircle, XCircle)
   - Help text (flagged explanation)
3. Footer
4. AlertDialog (approve/reject confirmation)

**Conditional States:**
- Empty: "All caught up!" message with CheckCircle

---

### InviteSponsorsPage

| Property | Value |
|----------|-------|
| Route | `/invite`, `/children/:id/invite` |
| Layout Shell | Custom (MainNav + Footer + BottomTabBar) |
| File | `src/pages/InviteSponsorsPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (max-w-3xl)
   - Back Link (to Dashboard)
   - Header
   - **Previous Sponsors Section (conditional, hand-drawn border):**
     - Card per previous sponsor
       - UserCheck icon
       - Name/email
       - Last pledge info (DollarSign, Calendar)
       - Button (Invite) or Badge (Invited)
     - Button (Invite All)
   - **Email Invitation Form (hand-drawn border):**
     - FormField (email, name, relationship, message)
     - Button (Send Invitation)
   - **Share Link Section (hand-drawn border):**
     - Copy Link (Input + Button)
     - Share Buttons (SMS, WhatsApp, Print)
   - **Sent Invitations List:**
     - Cards per invitation
       - Badge (status: Sent, Opened, Pledged)
       - Buttons (Resend, Cancel)
3. Footer
4. BottomTabBar

---

### AddSponsorPage

| Property | Value |
|----------|-------|
| Route | `/children/:id/add-sponsor` |
| Layout Shell | Custom (MainNav + Footer + BottomTabBar) |
| File | `src/pages/AddSponsorPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Main Content (max-w-2xl)
   - Back Link (to Invite Sponsors)
   - Header
   - **Form Card (hand-drawn border):**
     - **Step 1 - Sponsor Information:**
       - FormField (name, email, phone)
       - Returning sponsor detection card (conditional)
         - Switch (use last year amount)
     - **Step 2 - Pledge Details:**
       - RadioGroup (fixed, per-minute)
       - Input (amount or rate)
       - Projected amount display
     - **Step 3 - Payment Method:**
       - Radio buttons (Email, Text, Check, Cash, Direct)
       - FormField (notes)
     - **Summary Card:**
       - Pledge breakdown
     - Button (Record Pledge)
3. Footer
4. BottomTabBar

**Conditional States:**
- Success: Confirmation card with next steps based on payment method

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

### AdminOutstandingPage

| Property | Value |
|----------|-------|
| Route | `/admin/outstanding` |
| Layout Shell | `AdminLayout` |
| File | `src/pages/admin/AdminOutstandingPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Admin Nav Bar
3. Main Content
   - Header with highlighter effect
   - **Actions:**
     - Button (Export)
     - Button (Send Reminders)
   - **Filters (hand-drawn border):**
     - Input (search)
     - Select (filter: all, overdue, no-reminder, large)
   - **Table (hand-drawn border):**
     - Select All/None buttons
     - TableHeader
     - TableBody
       - Checkbox (selection)
       - Sponsor/Student info
       - Badge (pledge type)
       - Days outstanding with AlertTriangle
       - Button (send reminder per row)
     - TablePagination
4. Footer

**Conditional States:**
- Loading: Skeleton rows
- Empty: "No outstanding payments" message

---

### AdminChecksPage

| Property | Value |
|----------|-------|
| Route | `/admin/checks` |
| Layout Shell | `AdminLayout` |
| File | `src/pages/admin/AdminChecksPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Admin Nav Bar
3. Main Content
   - Header with highlighter effect
   - Button (Export Report)
   - **Summary Cards Grid (3 cols):**
     - Pending (FileText icon)
     - Received (CheckCircle icon)
     - Bounced (XCircle icon)
   - **Search:**
     - Input (search sponsors/students)
   - **Table (hand-drawn border):**
     - TableHeader
     - TableBody
       - Sponsor/Student info
       - Amount
       - Pledge date
       - Badge (status: pending/received/bounced)
       - Notes
       - Action buttons (CheckCircle, XCircle, Mail)
   - **Mailing Instructions Card:**
     - Address information
4. Footer
5. Dialog (mark received/bounced with notes)

**Conditional States:**
- Empty: "No checks match your search"

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

**Conditional States:**
- Blocked (pre-event): "Reading Starts Soon" message with Calendar icon
- Blocked (grace period): "Reading Period Ended" message
- Blocked (closed): "Read-a-thon Complete" message
- Blocked (no grade permission): Redirects to `/teacher` with error toast
- Success: Celebration card with stats

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

### TeacherRegisterPage

| Property | Value |
|----------|-------|
| Route | `/teacher/register` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/teacher/TeacherRegisterPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - Card (hand-drawn border)
     - Badge (Teacher Registration)
     - FormField (email)
     - Button (Send Magic Link)
     - Info Box (how it works)
     - Link (Sign in with password)
     - Link (Parent/Sponsor login)
3. Footer

**Conditional States:**
- Email sent: Shows "Check Your Email" confirmation card
- Error: Toast for no teacher record found

---

### TeacherSetPasswordPage

| Property | Value |
|----------|-------|
| Route | `/teacher/set-password` |
| Layout Shell | `PublicLayout` (centered card) |
| File | `src/pages/teacher/TeacherSetPasswordPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section
   - Card (hand-drawn border)
     - CheckCircle icon
     - Badge (Almost Done!)
     - Welcome message (personalized)
     - FormField (password, confirmPassword)
     - Button (Set Password & Continue)
     - Link (Skip for now)
3. Footer

**Conditional States:**
- Checking auth: Shows loading spinner
- No auth: Redirects to `/teacher/register`
- Error: Redirects with error toast

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

### SponsorCheckInstructionsPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/check-instructions` |
| Layout Shell | Custom (PageHeader, no footer) |
| File | `src/pages/sponsor/SponsorCheckInstructionsPage.tsx` |

**Components Used (top to bottom):**
1. PageHeader (with X close button)
2. Centered Content (max-w-lg, `bg-background-warm`)
   - BookContainer (variant="default")
     - CheckCircle icon (success circle)
     - Confirmation headline
     - **Check Instructions Card (dashed border):**
       - Make check payable to (school PTA)
       - Memo line format
       - Mailing address
       - Amount display
     - Notification info (parent notified when check arrives)
     - **Action Buttons (print:hidden):**
       - Button (Print Instructions) with Printer icon
       - Button (Email Me These Instructions) with Mail icon
       - Button (Sponsor Another Student) with Users icon

**Conditional States:**
- Print: Action buttons hidden via `print:hidden`

---

### SponsorGatewayPage

| Property | Value |
|----------|-------|
| Route | `/sponsor` |
| Layout Shell | Custom (MainNav + Footer) |
| File | `src/pages/sponsor/SponsorGatewayPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Content (max-w-2xl)
   - Header with Heart icon
   - **BookContainer (variant="warm"):**
     - **Support a Classroom Card (primary):**
       - Users icon
       - Description
       - Button (Get Started)
     - **Returning Sponsor Card:**
       - Sparkles icon
       - Button (Sign In)
     - **Have a Link Section:**
       - Link icon
       - Input (sponsor code)
       - Button (Continue)
   - Help text footer
3. Footer

**Conditional States:**
- Checking auth: Loading spinner
- Authenticated: Redirects to `/sponsor/dashboard`

---

### SponsorLoginPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/login` |
| Layout Shell | Custom (MainNav + Footer) |
| File | `src/pages/sponsor/SponsorLoginPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Content (max-w-md)
   - **Email View (viewMode="email"):**
     - BookContainer
       - Mail icon
       - FormField (email)
       - Button (Send login link)
       - Link (Find my account)
   - **Find Account View (viewMode="find-account"):**
     - BookContainer
       - Search icon
       - FormField (childName, school)
       - Button (Find Account)
   - **Account Found View:**
     - BookContainer
       - CheckCircle icon
       - Masked email display
       - Button (Send login link)
   - **Not Found View:**
     - BookContainer
       - AlertCircle icon
       - Button (Try Again)
3. Footer

---

### SponsorAuthPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/auth` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/sponsor/SponsorAuthPage.tsx` |

**Components Used (top to bottom):**
1. MainNav
2. Centered Section (max-w-md)
   - Header with BookOpen icon
   - **Auth Form Card (hand-drawn border):**
     - FormField (name, phone) — signup only
     - FormField (email, password)
     - Button (Sign In / Create Account)
     - Toggle mode link
   - Back link
3. Footer

**Conditional States:**
- Loading: "Loading..." text
- Authenticated: Redirects to `from` location

---

### SponsorLandingPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/:childId` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/SponsorLandingPage.tsx` |

**Components Used (top to bottom):**
1. MainNav (via PublicLayout)
2. User Header Bar (signed in status + Sign Out)
3. **Hero Section:**
   - Bookshelf background
   - Headline with highlighter
   - Stats Row (hand-drawn border)
4. Section Divider
5. **Progress & Pledge Section:**
   - Two-column layout
   - **Left Column:**
     - ReadingGoalRing
     - Recent Reading Card (hand-drawn border)
   - **Right Column:**
     - Pledge Form Card (hand-drawn border)
       - FormField (sponsorName)
       - Pledge type selector (per-minute, flat)
       - Amount inputs
       - Payment method selector
       - SquareCardForm (conditional: card selected)
       - Button (Submit Pledge)
6. Footer

**Conditional States:**
- Loading: "Loading..." text
- Not authenticated: Redirects to `/sponsor/auth`
- Child not found: Error message with Button (Return to Gateway)

---

### FamilySponsorPage

| Property | Value |
|----------|-------|
| Route | `/f/:userId` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/sponsor/FamilySponsorPage.tsx` |

**Components Used (top to bottom):**
1. MainNav (via PublicLayout)
2. User Header Bar
3. **Profile Completion Screen (conditional: needsProfileCompletion):**
   - FormField (name, phone, password)
   - Button (Continue)
4. **Hero Section:**
   - Bookshelf background
   - Family headline
   - Stats Row
5. **Main Content:**
   - **Children Selection Card:**
     - Checkbox per child
     - Select All/Deselect buttons
   - **Pledge Form:**
     - Pledge type selector
     - Amount inputs
     - Payment method
   - Button (Create Pledges)
6. Footer

**Conditional States:**
- Loading: "Loading..." text
- Not authenticated: Redirects to `/sponsor/auth`
- No children: Error message

---

### SponsorClassPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/class` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/sponsor/SponsorClassPage.tsx` |

**Components Used (top to bottom):**
1. MainNav (via PublicLayout)
2. **Hero Section:**
   - Bookshelf background
   - Users icon
   - Headline
3. **Form Card (hand-drawn border):**
   - **Step 1 - Choose Classroom:**
     - Select (teacher's class)
   - **Step 2 - Your Information:**
     - FormField (name, email, phone)
   - **Step 3 - Your Pledge:**
     - Amount buttons
     - Input (custom amount)
   - Summary Card (conditional)
   - Button (Complete Pledge)
4. Back link
5. Footer

---

### ReturningSponsorPage

| Property | Value |
|----------|-------|
| Route | `/returning/:code` |
| Layout Shell | Minimal (PageHeader) |
| File | `src/pages/sponsor/ReturningSponsorPage.tsx` |

**Components Used (top to bottom):**
1. PageHeader with Badge (Returning Sponsor)
2. Main Content (max-w-2xl)
   - **Hero Section:**
     - Welcome message (personalized)
     - ReadingGoalRing
   - **Last Year Stats Card (BookContainer variant="warm"):**
     - TrendingUp icon
     - Stats grid (pledged, minutes read)
   - **One-Click Pledge Card (BookContainer):**
     - Big Button (Pledge $X Again)
     - Link (Choose different amount)
   - **Full Form (conditional: showFullForm):**
     - Amount buttons with "Last year" badge
     - Custom amount input
     - Per-minute option (Collapsible)
     - Payment method
     - Card form
     - Button (Complete Pledge)

---

### ChildToFamilyRedirect

| Property | Value |
|----------|-------|
| Route | `/invite/:token`, `/s/:code` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/sponsor/ChildToFamilyRedirect.tsx` |

**Components Used:**
1. PublicLayout (during loading)
   - Loading text

**Conditional States:**
- Loading: Shows "Loading..." text
- Success: Redirects to `/f/:parentUserId?child=:childId`
- Error: Redirects to `/sponsor`

---

### GuestPaymentPage

| Property | Value |
|----------|-------|
| Route | `/sponsor/guest-pay` |
| Layout Shell | `PublicLayout` |
| File | `src/pages/sponsor/GuestPaymentPage.tsx` |

**Components Used (top to bottom):**
1. MainNav (via PublicLayout)
2. **Hero Section:**
   - DollarSign icon
   - Headline
3. **Pledge Summary Card (hand-drawn border):**
   - Class/teacher info
   - Amount
4. **Payment Form Card (hand-drawn border):**
   - Payment method selector (Card, Check)
   - **Card View:**
     - SquareCardForm
     - Error display (conditional)
     - Button (Pay $X)
   - **Check View:**
     - Mailing instructions
     - Button (I'll Send a Check)
5. Footer

**Conditional States:**
- Loading: Skeleton
- Error (invalid token): Error message with Button (Return to Home)
- Already paid: "Already paid" message
- Success: Thank you card with CheckCircle

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

### Layout Components
| Component | Used In |
|-----------|---------|
| MainNav | All public/authenticated pages (except StudentDashboardPage legacy) |
| Footer | Most pages (except legacy student pages using PageHeader) |
| BottomTabBar | Dashboard, Children, Sponsor, Admin pages (mobile) |
| PublicLayout | Home, About, FAQ, Auth, Privacy pages |
| AdminLayout | Admin Dashboard, Admin Reading Logs |
| AdminPageLayout | Admin Settings, Admin Email, Admin Content, Admin Users, Admin Finance |
| AdminLayout | Admin pages wrapper with sidebar |
| AdminSidebar | AdminLayout (navigation menu) |
| PageHeader | StudentDashboardPage (legacy), StudentLogReadingPage, StudentBooksPage |
| MobileNavDrawer | MainNav (mobile slide-out menu) |
| MobileHeader | Mobile page headers |
| TopHeader | Public pages top banner |
| LogoBanner | PublicLayout (currently disabled/returns null) |
| AppBreadcrumbs | Admin pages, nested routes |

### Legacy/Brand Components
| Component | Used In |
|-----------|---------|
| BookContainer | Student pages, OnboardingComplete, Sponsor confirmation pages |
| ReadingGoalRing | Dashboard, ChildDetails, Teacher, Student, OnboardingComplete, SponsorPledged |
| ClassFundraisingShelf | Dashboard, StudentPinDashboard, Sponsor Dashboard |
| Logo | MainNav, PageHeader, Footer, auth pages |
| handDrawnBorder | Cards across all authenticated pages (defined as inline style constant) |

### Card Components
| Component | Used In |
|-----------|---------|
| Card | DashboardPage, admin pages, settings |
| DataCard | DashboardPage, data displays |
| StatCard | AdminDashboard, TeacherDashboard, finance pages |
| StudentCard | DashboardPage, TeacherDashboard, ManageChildrenPage |
| PledgeCard | Dashboard, ChildDetails, MyPledges, SponsorDashboard |
| MobileStudentCard | Mobile dashboard views, ManageChildrenPage (mobile) |

### Form Components
| Component | Used In |
|-----------|---------|
| FormField | All forms |
| Input | All forms |
| Select | Filters, forms, onboarding |
| Checkbox | RegisterPage, AdminSettingsPage (teacher grades) |
| Switch | OnboardingAddChild, AdminSettingsPage |
| RadioGroup | PledgeAmountForm |
| Textarea | AdminEmailPage, feedback forms |
| Label | All forms |
| PledgeAmountForm | SponsorPledgePage, FamilySponsorPage, OnboardingPledge |

### Interactive Components
| Component | Used In |
|-----------|---------|
| Button | All pages |
| Avatar | MainNav, StudentCard, ManageChildrenPage, ChildDetailsPage |
| Badge | Status indicators (payment, verification, student status) |
| Accordion | FAQPage |
| Tabs | AdminFinancePage, AdminEmailPage |
| Collapsible | ManageChildren (child details), LogReading (history) |
| Tooltip | TeacherDashboard (disabled buttons), StudentBooksPage |
| DropdownMenu | ManageChildrenPage, AdminDashboard, account menus |

### Modal Components
| Component | Used In |
|-----------|---------|
| Dialog | EditChildDialog, EditPledgeDialog, log reading modals |
| AlertDialog | ManageChildrenPage (delete), AdminSettingsPage (end/delete event) |
| ConfirmDialog | Delete actions, logout, form cancellation |

### Data Display Components
| Component | Used In |
|-----------|---------|
| Table | Admin pages, outstanding payments |
| TablePagination | AdminReadingLogsPage, AdminOutstandingPage |
| Progress | StudentCard, MobileStudentCard, ClassFundraisingShelf |
| Skeleton | All loading states |

### Book Components
| Component | Used In |
|-----------|---------|
| BookSelector | LogReadingPage, StudentLogReadingPage, StudentPinDashboardPage |
| BarcodeScanner | StudentBooksPage |

### Feedback Components
| Component | Used In |
|-----------|---------|
| EmptyState | All data listing pages when empty |
| ErrorState | Error boundaries, failed API calls, 404 page |
| LoadingSpinner | All pages during loading |

### Celebration Components
| Component | Used In |
|-----------|---------|
| Confetti | Goal completion, milestone achievement |
| StarBurst | Milestone achievements |
| ParticleBurst | Goal reached celebrations |

### Mobile Components
| Component | Used In |
|-----------|---------|
| MobileMinutesStepper | LogReadingPage, StudentLogReadingPage, StudentPinDashboard |
| MobileProgressDisplay | DashboardPage (mobile) |
| MobileStudentCard | Mobile dashboard views |
| MobileDataCard | Mobile data displays |
| MobileFormStepper | Multi-step mobile forms |

### Payment Components
| Component | Used In |
|-----------|---------|
| SquareCardForm | SponsorPaymentPage, SponsorLandingPage, FamilySponsorPage, GuestPaymentPage |

### Pledge Components
| Component | Used In |
|-----------|---------|
| SponsorTypeSelector | SponsorMyChildPage |
| ChildSelector | SponsorMyChildPage |
| ClassSelector | SponsorMyChildPage |
| ClassroomPledgeForm | SponsorMyChildPage |
| EditPledgeDialog | MyPledgesPage, SponsorDashboard |

### Family Components
| Component | Used In |
|-----------|---------|
| ChildReadingLogsSection | ChildDetailsPage |
| EditChildDialog | ManageChildrenPage, ChildDetailsPage |
| ReadingLogsTable | ChildDetailsPage, VerifyLogsPage |

### Dashboard Section Components
| Component | Used In |
|-----------|---------|
| ChildBooksSection | DashboardPage, ChildDetailsPage |
| PledgesSection | DashboardPage |
| ClassFundraisingStack | TeacherDashboard (alternative to shelf) |

### Admin Components
| Component | Used In |
|-----------|---------|
| EditEventDialog | AdminSettingsPage |
| LogVerificationSettings | AdminSettingsPage |
| LogoGenerator | AdminSettingsPage |
| SiteContentEditor | AdminSiteContentPage |
| TeacherManagement | AdminUsersPage |

---

## Debug Pages

### DebugRingPage

| Property | Value |
|----------|-------|
| Route | `/debug/progress-ring` |
| Layout Shell | None (bare page) |
| File | `src/pages/DebugRingPage.tsx` |

**Components Used:**
1. Multiple test sections (inline)
   - RotationTest
   - FullCircleTest
   - PatternUnitsTest
   - LargePatternTest
   - ResponsiveSizeTest
   - ReadingGoalRing (actual component)
2. Interactive controls (sliders, toggles)

**Purpose:** Development-only page for debugging SVG pattern rendering issues with the ReadingGoalRing component.
