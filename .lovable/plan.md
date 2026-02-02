
# Comprehensive Workflow Specification for Read-a-thon Platform

This document provides detailed workflow specifications for all user roles in the Read-a-thon platform, including complete page inventories, user journeys, and business rules.

---

## Table of Contents
1. [Event Lifecycle Overview](#event-lifecycle)
2. [Parent Role](#parent-role)
3. [Sponsor Role](#sponsor-role)
4. [Student Role](#student-role)
5. [Teacher Role](#teacher-role)
6. [Admin Role](#admin-role)
7. [Cross-Role Summary](#cross-role-summary)

---

## Event Lifecycle Overview

The platform operates on a 5-phase event lifecycle with timezone-aware transitions (default: `America/New_York`):

| Phase | Who Can Act | Sign-ups | Pledges | Student Log | Parent Log | Teacher Log | Payments |
|-------|-------------|----------|---------|-------------|------------|-------------|----------|
| Setup | Admin only | No | No | No | No | No | No |
| Pre-Event | All | Yes | Yes | No | No | No | No |
| Active | All | Yes | Yes | Yes | Yes | Yes (grade-restricted) | Flat only |
| Grace Period | Parents, Admins | No | Yes | No | Yes | No | Flat only |
| Closed | Admins | No | No | No | No | No | All |

---

## 1. Parent Role

### 1.1 Complete Page Inventory

---

#### Route: `/register`
- **Purpose**: Account creation for new parents
- **Page title**: "Create your account"
- **Data displayed**: 
  - Badge: "Parent / Sponsor Registration" with Users icon
  - Clarification text: "This account is for adults (parents or sponsors) supporting young readers"
  - Form fields: Display name, Email, Password, Confirm password
  - Link to login page
- **Layout**: Centered single-column, warm background (`bg-background-warm`), no sidebar
- **Actions**: 
  - Submit registration form → API: `supabase.auth.signUp()` + creates profile record
  - "Already have an account?" link → `/login`
- **Navigation on success**: → `/onboarding/add-child`
- **Empty state**: N/A
- **Validation errors**: 
  - "Email already registered"
  - "Password must be at least 6 characters"
  - "Passwords do not match"

---

#### Route: `/login`
- **Purpose**: Parent/Sponsor authentication
- **Page title**: "Welcome back"
- **Data displayed**: 
  - Email field
  - Password field
  - "Forgot password?" link
  - Student login shortcut link
  - Register link
- **Actions**: 
  - Submit login → API: `supabase.auth.signInWithPassword()`
  - Forgot password → `/forgot-password`
  - Student login → `/student/login`
  - Register → `/register`
- **Navigation on success**: → `/dashboard`
- **Error states**: 
  - "Invalid email or password"
  - "Account not found"
  - Rate limiting message after multiple failures

---

#### Route: `/forgot-password`
- **Purpose**: Password reset request
- **Data displayed**: Email input field, instructions
- **Actions**: Submit email → API: `supabase.auth.resetPasswordForEmail()`
- **Navigation on success**: Shows confirmation message, link to `/login`
- **Errors**: "Email not found"

---

#### Route: `/onboarding/add-child`
- **Purpose**: Add first child during onboarding
- **Page title**: "Add Your Reader"
- **Data displayed**: 
  - Progress indicator: Step 1 of 3
  - Form fields:
    - First name (required, text input)
    - Last name (required, text input)
    - Grade dropdown (Pre-K, Kindergarten, 1st through 5th)
    - Homeroom teacher dropdown (filtered by selected grade) OR manual entry option
    - Reading goal: Preset buttons (300, 500, 750, 1000 minutes) + custom input
    - Public link toggle with description: "Allow sponsors to find [Name] via a public link"
  - Checkbox: "I have more than one child"
- **Actions**: 
  - Select grade → Filters teacher dropdown by `grade_level`
  - Submit → API: Creates `children` record → stores `childId` in sessionStorage
- **Navigation on success**: → `/onboarding/pledge`
- **Validation**: 
  - First name required
  - Last name required
  - Grade required
  - Teacher optional but recommended
- **Empty state**: Loading spinner while fetching teachers list

---

#### Route: `/onboarding/pledge`
- **Purpose**: Optional self-pledge during onboarding
- **Page title**: "Make a Pledge"
- **Data displayed**: 
  - Progress indicator: Step 2 of 3
  - Child's name and reading goal
  - Pledge form with hand-drawn border styling:
    - Step 1: Choose pledge type (radio cards)
      - Per Minute: "Pledge per minute read — grows with their progress!"
      - Flat Amount: "A set donation amount regardless of reading time"
    - Step 2: Set amount
      - Per-minute: Rate presets ($0.03, $0.05, $0.10, $0.25) + custom + optional max cap
      - Flat: Amount presets ($10, $25, $50, $100) + custom
    - Summary box showing projected total
- **Actions**: 
  - Make pledge → API: Creates `pledges` record
  - "Skip this step" button → skips to complete
- **Navigation on success**: → `/onboarding/complete`
- **Empty state**: N/A

---

#### Route: `/onboarding/complete`
- **Purpose**: Onboarding completion confirmation
- **Page title**: "You're All Set!"
- **Data displayed**: 
  - Success checkmark icon
  - Confirmation message
  - Next steps summary:
    - "Log reading time daily"
    - "Share your sponsor link to get supporters"
  - Quick action buttons
- **Actions**: 
  - "Go to Dashboard" → `/dashboard`
  - "Add Another Child" → `/onboarding/add-child`
- **Side effects on mount**: Triggers `sendParentWelcome` edge function (once per session)

---

#### Route: `/onboarding/re-enroll`
- **Purpose**: Re-enrollment for returning families in new event
- **Data displayed**: List of previous children with update options
- **Actions**: Update child info, add new children, proceed to dashboard

---

#### Route: `/dashboard`
- **Purpose**: Main parent hub showing all children's progress
- **Page title**: "Family Dashboard"
- **Data displayed**:
  - **Per child card**:
    - Name with avatar initials
    - Grade and class name
    - Reading goal ring (animated progress indicator)
    - Minutes read / Goal minutes with percentage
    - Stats row: Minutes today, Longest session, Class total, Grade total
    - Class fundraising progress bar (toward class milestone goal)
  - **Summary stats** (top of page):
    - Total minutes across all children
    - Total pledged amount (combined)
    - Number of sponsors
  - **Recent activity section**: Last 5 reading logs across all children
    - Each log shows: child name, minutes, book title (if any), date
  - **Quick actions sidebar** (desktop) / **Bottom tab bar** (mobile):
    - Log Reading → `/log-reading`
    - Invite Sponsors → `/invite`
    - Make a Pledge → `/family/sponsor-my-child`
    - My Pledges → `/my-pledges`
- **Actions**: 
  - Click child card → `/children/:id`
  - "Manage Children" link in sidebar → `/account#children`
  - Log out button → clears session, redirects to `/`
- **Empty states**:
  - No children: "No children added yet" card with "Add Your First Reader" button → `/onboarding/add-child`
  - No recent activity: "No reading logged yet. Time to start reading!"
  - No sponsors: "Invite friends and family to support your readers"

---

#### Route: `/log-reading`
- **Purpose**: Log reading minutes for children
- **Page title**: "Log Reading"
- **Data displayed**:
  - Child selector (dropdown if multiple children, single display if one)
  - Selected child's current progress:
    - Progress ring with minutes/goal
    - Class total, Grade total
  - Form:
    - Date picker (default: today)
    - Minutes stepper with +/- buttons
    - Quick minute buttons: 15, 30, 45, 60
    - Book selector:
      - Search input
      - Barcode scanner button (opens camera)
      - Recent books list
    - Optional notes field
- **Actions**:
  - Adjust minutes (+/- 5 per click, or use presets)
  - Select/search book → API: queries `books` table
  - Scan barcode → Opens camera, looks up ISBN
  - Submit → API: Creates `reading_logs` record, triggers `update_child_total_minutes` trigger
- **Navigation on success**: Shows inline celebration toast with confetti, stays on page
- **Business rules**:
  - Only available during `active` and `grace_period` phases
  - Grace period: Date picker restricted to event's valid range
- **Phase-blocked states**:
  - Pre-event: "Reading Starts Soon" message with event start date
  - Closed: "Read-a-thon Complete" message
- **Empty state**: No children: "Add a child to start logging" with link to add child

---

#### Route: `/invite` or `/children/:id/invite`
- **Purpose**: Invite sponsors via email and manage existing invitations
- **Page title**: "Invite Sponsors for [Child Name]"
- **Data displayed**:
  - Child selector (if accessed via `/invite`)
  - Selected child's:
    - Progress summary
    - Public share link (copyable)
    - QR code for share link
  - Existing invitations table:
    - Invitee email
    - Status badge (Pending, Approved, Declined)
    - Date sent
  - Invite form:
    - Email input (accepts multiple comma-separated)
    - "Can invite others" toggle (allows chain invitations)
    - Personal message (optional)
- **Actions**: 
  - Copy share link → copies to clipboard
  - Send invitation → API: Creates `sponsor_invitations` record, triggers `send-pledge-notification` edge function
  - Resend invitation → Triggers email again
  - Delete invitation → Removes record
- **Navigation**: Stays on page with success toast
- **Empty state**: "No invitations sent yet. Share your link or send an email invitation!"

---

#### Route: `/children/:id/add-sponsor`
- **Purpose**: Manually record a pledge for someone who can't use the website
- **Page title**: "Record a Pledge for [Child Name]"
- **Data displayed**:
  - Hand-drawn border form with numbered steps:
  - **Step 1: Sponsor Information**
    - Sponsor's name (required)
    - Sponsor's email (optional, enables email payment link)
    - Sponsor's phone (optional, enables text payment link)
    - Returning sponsor detection: If email matches previous sponsor, shows toggle to use last year's amount
  - **Step 2: Pledge Details**
    - Pledge type (radio cards): Fixed Amount / Per Minute
    - Amount input (fixed) or rate input (per-minute with projected calculation)
  - **Step 3: How Will They Pay?**
    - Radio options:
      - Send payment link by email (requires email above)
      - Send payment link by text (requires phone above)
      - They are mailing a check (shows check instructions)
      - They gave you cash (records as received)
      - They will pay you directly (Venmo/Zelle)
  - Optional notes field
  - Summary box showing pledge amount
- **Actions**: 
  - Submit → API: Creates `pledges` record with `expected_payment_method`
  - For email/text: Triggers payment notification
- **Navigation on success**: Success screen with options:
  - "Record Another Pledge" → Clears form
  - "Back to [Child]'s Sponsors" → `/children/:id/invite`

---

#### Route: `/my-pledges`
- **Purpose**: View and manage all pledges for user's children
- **Page title**: "My Pledges"
- **Data displayed**:
  - **Summary stats**: Total pledged, Paid count, Pending count
  - **Per-child sections**:
    - Child name header
    - List of pledges with:
      - Status badge (Paid - green, Pending - yellow)
      - Type icon (per-minute or flat)
      - Sponsor name (if available)
      - Amount (for per-minute: shows rate and projected total based on current minutes)
      - Date created
      - Payment method indicator
  - **Edit pledge button** on each pledge row
  - **Delete pledge button** on each pledge row
- **Actions**:
  - Edit pledge → Opens `EditPledgeDialog`:
    - Can change pledge type (flat ↔ per-minute)
    - Can change amount
    - Cannot mark as paid (admin only)
  - Delete pledge → Confirmation dialog → API: Deletes `pledges` record
  - Pay Now button (for flat pledges or per-minute after event closes) → payment flow
- **Business rules**:
  - Parents cannot mark pledges as paid (admin only)
  - Per-minute pledges show "Payment available after read-a-thon ends" until closed phase
- **Empty states**:
  - Has children: "No pledges yet. Invite sponsors to support your children!" with link to `/invite`
  - Sponsor-only view: "Sponsor a student or invite others" with note about parent approval

---

#### Route: `/account`
- **Purpose**: Account settings and child management hub
- **Page title**: "Account Settings"
- **Sections (collapsible)**:
  1. **My Pledges** - Quick link card to `/my-pledges` showing pledge count
  2. **Children's Accounts** (one collapsible card per child):
     - **Quick badges visible when collapsed**:
       - Login: Enabled/Disabled status
       - Visibility: Public/Private link status
       - Requests: Pending sponsor request count (if any)
     - **Expanded content**:
       - Student login section:
         - Username display/edit
         - Enable/disable toggle
         - Set/change password button
       - Public link toggle with explanation
       - Pending sponsor requests list:
         - Each shows: invitee email, date
         - Approve button → Updates `sponsor_invitations.status` to "approved"
         - Decline button → Updates to "declined"
       - Action buttons:
         - "Edit Profile" → Opens `EditChildDialog` (name, grade, teacher, goal)
         - "View Details" → `/children/:id`
         - "Delete Child" → Confirmation dialog (type child's name to confirm)
  3. **Profile section**:
     - Display name input with save button
  4. **Security section**:
     - Current password input
     - New password input
     - Confirm password input
     - Change password button
  5. **Danger Zone**:
     - Delete account button
     - Requires typing "DELETE" to confirm
     - Warns about data loss
- **Actions**: Save profile, change password, toggle settings, approve/decline sponsors, delete child/account

---

#### Route: `/children/:id` or `/family/children/:id`
- **Purpose**: Detailed view of single child's progress, sponsors, and reading logs
- **Page title**: "[Child Name]'s Reading Progress"
- **Data displayed**:
  - **Hero section**:
    - Large progress ring
    - Name, grade, class
    - Minutes read / Goal with percentage
  - **Community stats**:
    - Class total minutes
    - Grade total minutes
  - **Sponsors section**:
    - List of sponsors with pledge amounts
    - Status badges
  - **Reading logs table**:
    - Columns: Date, Minutes, Book, Actions
    - Inline edit button (opens row edit mode)
    - Delete button with confirmation
    - Verification checkboxes (for parent to verify accuracy)
- **Actions**:
  - Edit reading log → Inline save
  - Delete reading log → API: Deletes `reading_logs` record, triggers minute recalculation
  - Verify totals → Sets `total_verified` flag

---

#### Route: `/family/sponsor-my-child`
- **Purpose**: Unified "Make a Pledge" flow for parents
- **Page title**: "Make a Pledge"
- **Multi-step wizard with 4 steps**:
  - **Step 0: Choose Sponsor Type** (3 cards):
    - "My Children" - Sponsor your own child
    - "Another Child" - Find another student to sponsor
    - "Support a Classroom" - Pledge to entire class
  - **Step 1: Selection** (depends on type):
    - My Children: Child selector cards
    - Another Child: COPPA-compliant search (First + Last Initial only, filtered by `share_public_link=true` OR direct `sponsor_invitations`)
    - Classroom: Class selector with teacher name, grade, fundraising progress
  - **Step 2: Amount** (type-specific forms):
    - Individual child: `PledgeAmountForm` component (per-minute or flat)
    - Classroom: `ClassroomPledgeForm` component (flat or milestone-based)
  - **Step 3: Confirmation**:
    - Summary of pledge
    - Edit buttons to go back
    - Submit button
- **Actions**:
  - Submit individual pledge → API: Creates `pledges` record
  - Submit class pledge → API: Creates `class_pledges` record(s)
- **Navigation on success**: Shows confirmation screen with dashboard link
- **Data displayed in class selector**:
  - Teacher name
  - Grade level
  - Student count
  - Current fundraising total
  - Progress bar toward class goal

---

#### Route: `/reading-logs/approve`
- **Purpose**: Verify and approve reading logs that exceed thresholds
- **Page title**: "Verify Reading Logs"
- **Data displayed**:
  - List of `log_verification_requests` with status "pending"
  - Each shows: Child name, Date, Minutes, Book, Threshold at time
- **Actions**:
  - Approve → Updates status to "approved"
  - Reject → Updates status to "rejected"
- **Business rules**: Only shows for children belonging to authenticated parent

---

### 1.2 Parent User Journeys

#### First-time Parent Flow
```
1. /register → Create account (email, password, name)
2. Email verification (if not auto-confirmed)
3. /onboarding/add-child → Add first child
   → Select grade, teacher, set reading goal
   → Toggle public link if desired
4. /onboarding/pledge → Optional self-pledge (or skip)
   → Choose per-minute or flat
   → Set amount
5. /onboarding/complete → See confirmation + next steps
   → Triggers welcome email with sponsor link
6. /dashboard → Main hub
   → Can now log reading, invite sponsors
```

#### Returning Parent Flow
```
1. /login → Enter credentials
2. /dashboard → See all children's progress
   → If active phase: Log reading button available
   → If grace period: Log reading with date restriction
   → If closed: "Read-a-thon Complete" message, payment prompts
```

#### Adding Another Child
```
/dashboard → Manage Children → /account#children → Add Child button
   → /onboarding/add-child (with "from dashboard" state)
   → Completes → Returns to /account
```

#### Inviting Sponsors Flow
```
/dashboard → Invite Sponsors → /invite
   → Select child (if multiple)
   → Option 1: Copy public share link
   → Option 2: Enter sponsor email(s), send invitation
   → Email sent with personalized link
```

#### Recording Manual Pledge Flow
```
/invite → "Record a pledge manually" link → /children/:id/add-sponsor
   → Enter sponsor details
   → Choose pledge type and amount
   → Select payment method
   → Submit → Success screen
```

### 1.3 Parent Business Rules

| Rule | Description |
|------|-------------|
| Data visibility | Can see all data for their own children only |
| Child data for others | Cannot see other families' children (unless `share_public_link=true`) |
| Log editing | Can edit/delete reading logs until parent verifies totals |
| Pledge management | Can edit pledge amounts/types; CANNOT mark as paid |
| Sponsor approval | Must approve sponsor requests from unknown sponsors |
| Public link | Controls whether child is discoverable via public sponsor link |
| Phase restrictions | Can only log during `active` or `grace_period` phases |
| Grace period dates | Can backdate logs to event date range only |

---

## 2. Sponsor Role

### 2.1 Complete Page Inventory

---

#### Route: `/sponsor` (SponsorGatewayPage)
- **Purpose**: Entry point for all sponsors
- **Page title**: "Support a Reader"
- **Data displayed**: 
  - "Have you sponsored before?" question
  - Two option cards:
    - "Yes, I'm returning" with history icon
    - "I'm new here" with sparkle icon
  - Code entry field for direct links
- **Actions**:
  - "Yes, I'm returning" → `/sponsor/login`
  - "I'm new here" → Prompts for code/link → `/s/:code` or `/f/:userId`
  - Enter code in field → Navigates to sponsor link
- **Auto-redirect**: If already authenticated → `/sponsor/dashboard`

---

#### Route: `/sponsor/login`
- **Purpose**: Returning sponsor authentication via magic link
- **Page title**: "Welcome Back, Sponsor"
- **Data displayed**: 
  - Email input field
  - Explanation: "We'll send you a secure login link"
- **Actions**: Submit email → API: `supabase.auth.signInWithOtp()` (magic link)
- **Navigation on success**: → `/sponsor/check-email`
- **Errors**: "Please enter a valid email address"

---

#### Route: `/sponsor/check-email`
- **Purpose**: Confirmation that magic link was sent
- **Page title**: "Check Your Email"
- **Data displayed**: 
  - Email icon
  - Instructions: "We sent a login link to [email]"
  - "Didn't receive it?" section with resend option
- **Actions**: 
  - "Resend link" → Triggers another magic link
  - "Try different email" → Back to `/sponsor/login`

---

#### Route: `/sponsor/auth`
- **Purpose**: Authentication page for new sponsors arriving via invitation link
- **Page title**: "Create Your Sponsor Account" or "Sign In"
- **Data displayed**: 
  - Tab toggle: Register / Login
  - Register form: Name, email, password
  - Login form: Email, password
  - Child preview (from URL params): Shows child's first name + grade
- **Actions**: 
  - Register → Creates account, creates `sponsors` record
  - Login → Authenticates
- **Navigation on success**: Returns to original sponsor link (stored in sessionStorage)

---

#### Route: `/s/:code` or `/invite/:token` (redirects to SponsorLandingPage)
- **Purpose**: Legacy child-specific sponsor link - redirects to family page
- **Behavior**: Extracts child info, redirects to `/f/:userId` (family sponsor page)

---

#### Route: `/f/:userId` (FamilySponsorPage)
- **Purpose**: Family-level sponsor landing page showing all public children
- **Requires**: Authentication (redirects to `/sponsor/auth` if not logged in)
- **Page title**: "Support the [Last Name] Family"
- **Data displayed**:
  - Family name header
  - **Per child** (where `share_public_link=true`):
    - First name + Last initial (COPPA compliance)
    - Grade level
    - Teacher name
    - Reading goal ring with current progress
    - Stats: Minutes read, Goal, Books read
    - Recent reading activity (last 3 logs with book titles)
  - Event countdown: Days remaining
- **Pledge form** (per child):
  - Pledge type toggle: Per-minute / Flat amount
  - Amount selector:
    - Per-minute: Rate presets (0.05, 0.10, 0.25, 0.50) + custom + max cap
    - Flat: Amount presets (25, 50, 100, 250) + custom
  - Submit button
- **Actions**: 
  - Submit pledge → API: Creates `pledges` record, triggers `sendSponsorThankYou` email
- **Navigation on success**: → `/sponsor/pledged`
- **Error states**: 
  - "Reader Not Found" if invalid code
  - "This reader's profile is private" if `share_public_link=false`
  - "This event has ended" if past closed phase

---

#### Route: `/sponsor/class` (SponsorClassPage)
- **Purpose**: Guest classroom sponsorship (no account required)
- **Page title**: "Support a Classroom"
- **Data displayed**:
  - Bookshelf background decoration
  - Event countdown
  - **Form with numbered steps**:
    - **Step 1: Choose a Classroom**
      - Teacher/class dropdown (shows grade level)
    - **Step 2: Your Information**
      - Name input with icon
      - Email input with icon
      - Phone input with icon
    - **Step 3: Your Pledge**
      - Amount presets ($25, $50, $100, $250)
      - Custom amount input
  - Summary box: "You're pledging $X to [Teacher]'s Class"
- **Actions**: 
  - Submit → API: Creates `class_pledges` record with `sponsor_user_id` = guest UUID
  - Triggers `sendSponsorThankYou` email
- **Navigation on success**: → `/sponsor/thank-you`
- **Validation errors**: 
  - "Please select a classroom"
  - "Name must be at least 2 characters"
  - "Please enter a valid email"
  - "Please enter a valid phone number"
  - "Please select or enter an amount"

---

#### Route: `/sponsor/thank-you` (SponsorThankYouPage)
- **Purpose**: Generic thank you confirmation (for guest pledges)
- **Page title**: "Thank You!"
- **Data displayed**: 
  - Heart icon
  - Thank you message
  - "Payment instructions will be sent to your email"
  - Link to sponsor gateway

---

#### Route: `/sponsor/pledged` (SponsorPledgedPage)
- **Purpose**: Authenticated pledge confirmation
- **Page title**: "Pledge Received!"
- **Data displayed**: 
  - Checkmark icon
  - Pledge amount and child name
  - "What's next" section:
    - Payment timeline explanation
    - Link to sponsor dashboard
- **Actions**: 
  - "Go to Dashboard" → `/sponsor/dashboard`
  - "Sponsor Another Child" → `/sponsor`

---

#### Route: `/sponsor/check-instructions` (SponsorCheckInstructionsPage)
- **Purpose**: Check payment mailing instructions
- **Page title**: "Mailing Your Check"
- **Data displayed**:
  - School/organization name
  - Complete mailing address (from event settings)
  - Memo line instructions
  - Pledge reference information
- **Actions**: Print button

---

#### Route: `/sponsor/dashboard` (SponsorDashboardPage)
- **Purpose**: Main sponsor hub
- **Page title**: "Sponsor Dashboard"
- **Data displayed for returning sponsors**:
  - **Stats grid**:
    - Total pledged (sum of all pledges)
    - Children/Classes supported (count)
    - Total pledges (count)
  - **Children supported section**:
    - Card per child showing:
      - Name: First + Last Initial only
      - Grade and Teacher
      - Progress ring
      - List of pledges with status badges
      - Minutes read vs Goal
  - **Classes supported section**:
    - Card per class showing:
      - Teacher name, Grade
      - Milestone progress bar
      - Pledge amount and status
  - **Pending payments alert** (if any)
  - **Payment history** (completed payments)
- **Data displayed for first-time sponsors**:
  - Welcome card: "Ready to Make a Difference?"
  - Prompt: "Enter a sponsor code or use a link from a family"
  - Code entry field
- **Sidebar (desktop) / Quick actions**:
  - Dashboard (current)
  - My Pledges
  - Make Payment → `/sponsor/pay`
  - Account Settings
- **Actions**: 
  - "Sponsor Again" button → `/sponsor`
  - "Make Payment" → `/sponsor/pay`
  - Log out

---

#### Route: `/sponsor/pay` (SponsorPaymentPage)
- **Purpose**: Payment collection for unpaid pledges
- **Page title**: "Complete Your Payment"
- **Data displayed**:
  - **Unpaid pledges list** with checkboxes:
    - Per child/class: Name, pledge type, calculated amount
    - For per-minute: Shows calculation (rate × total_minutes)
  - **Selected total** (updates as checkboxes change)
  - **Payment method selector**:
    - Card (shows card form)
    - Check (shows mailing instructions)
  - **Card form fields** (if card selected):
    - Name on card
    - Card number
    - Expiry date
    - CVC
    - Zip code
- **Actions**: 
  - Toggle pledge checkboxes
  - Select payment method
  - Submit payment → API: Creates `payments` records, updates pledge status
- **Navigation on success**: Thank you confirmation
- **Business rules**:
  - Per-minute pledges: Only payable after event `closed` phase
  - Flat pledges: Payable anytime
- **Empty state**: "No unpaid pledges found. Thank you for your generosity!"

---

#### Route: `/sponsor/guest-pay` (GuestPaymentPage)
- **Purpose**: Payment page for guest class pledges via token link
- **Page title**: "Complete Your Payment"
- **URL format**: `/sponsor/guest-pay?token=<payment_token>`
- **Data displayed**:
  - Pledge details (fetched by token):
    - Class name, Teacher
    - Amount
  - Already paid check → Shows "Already Paid" confirmation
  - Payment form (if not paid):
    - Payment method toggle (Card/Check)
    - Card form or check instructions
- **Actions**: 
  - Submit payment → API: Creates `payments` record, marks pledge as paid
- **Error states**:
  - "Invalid payment link"
  - "Pledge not found"
  - "This pledge has already been paid"

---

### 2.2 Sponsor User Journeys

#### Guest Sponsor Flow (No Account - Class Pledge)
```
1. Navigate to /sponsor
2. Click "I'm new here" 
3. Option: Click "Support a Classroom" → /sponsor/class
4. Fill form:
   → Select teacher/class from dropdown
   → Enter name, email, phone
   → Select pledge amount
5. Submit → Creates class_pledges record (guest sponsor)
6. → /sponsor/thank-you confirmation
7. Email received with:
   → Thank you message
   → Payment link (/sponsor/guest-pay?token=xxx)
8. Click payment link → Complete payment
```

#### Guest Sponsor Flow (Via Invitation Link)
```
1. Receive email with invitation link
2. Click link → /s/:code or /f/:userId
3. Redirected to /sponsor/auth (not logged in)
4. Choose: Register new account OR Login existing
5. After auth → Redirected back to family sponsor page
6. See child's progress (First Name + Last Initial only)
7. Fill pledge form:
   → Select type (per-minute or flat)
   → Enter amount
8. Submit → Creates pledges record
9. → /sponsor/pledged confirmation
10. Email received with thank you
11. Later: /sponsor/dashboard to track progress
12. After event closes: /sponsor/pay to complete per-minute payments
```

#### Returning Sponsor Flow
```
1. Navigate to /sponsor
2. Click "Yes, I'm returning"
3. → /sponsor/login
4. Enter email → Magic link sent
5. Check email → Click link
6. → /sponsor/dashboard (authenticated)
7. See past sponsorships and children's progress
8. Options:
   → "Sponsor Again" → Enter new code
   → "Make Payment" → Complete pending payments
   → Track children's reading progress
```

#### Payment Flow (After Event Closes)
```
1. Receive email reminder about pending payment
2. Click link → /sponsor/pay (or /sponsor/guest-pay for class pledges)
3. See list of unpaid pledges with calculated amounts
4. Select pledges to pay (checkboxes)
5. Choose payment method:
   → Card: Enter card details → Submit → Confirmation
   → Check: See mailing address and memo instructions
6. If card: Creates payments record, updates pledge status
7. If check: Records expected payment, admin matches later
```

### 2.3 Sponsor Business Rules

| Rule | Description |
|------|-------------|
| Child visibility | First name + last initial only (COPPA compliance) |
| Child discovery | Only children with `share_public_link=true` OR direct `sponsor_invitations` |
| Pledge timing | Can create pledges during `pre_event`, `active`, `grace_period` phases |
| Pledge modification | Can edit own unpaid pledges |
| Per-minute calculation | Final amount = rate × `child.total_minutes` (locked at event close) |
| Payment timing - Flat | Payable anytime after pledge created |
| Payment timing - Per-minute | Payable only after `closed` phase when minutes are finalized |
| Class pledges | Can support entire classrooms with flat or milestone-based pledges |
| Guest pledges | Class pledges allow guest sponsors (no account required) |

### 2.4 Sponsor View of Child Data

| Data Point | Visible to Sponsor |
|------------|-------------------|
| First name | ✅ Yes |
| Last name | ❌ No (only initial shown) |
| Grade level | ✅ Yes |
| Class/Teacher name | ✅ Yes |
| Reading goal | ✅ Yes |
| Minutes read | ✅ Yes |
| Books read (titles) | ✅ Yes |
| Progress percentage | ✅ Yes |
| Other sponsors | ❌ No |
| Parent contact info | ❌ No |
| Full address | ❌ No |

---

## 3. Student Role

### 3.1 Complete Page Inventory

---

#### Route: `/student/login` (StudentPinLoginPage)
- **Purpose**: Student authentication using parent-set credentials
- **Page title**: "Student Login"
- **Data displayed**: 
  - School/event logo
  - Username input field
  - Password input field
  - "Forgot password?" text (directs to ask parent)
- **Actions**: 
  - Submit login → API: `student-login` edge function validates SHA-256 hashed password
- **Session storage**: `studentSession` stored in sessionStorage (cleared on browser close)
- **Navigation on success**: → `/student/dashboard`
- **Error states**: 
  - "Invalid username or password"
  - "Student login not enabled for this account"
  - "Ask your parent to enable student login"

---

#### Route: `/student/dashboard` (StudentPinDashboardPage)
- **Purpose**: Student's personal reading dashboard
- **Page title**: "My Reading Dashboard"
- **Data displayed**:
  - **School-wide hero section**:
    - Total minutes read by entire school
    - Event countdown
  - **Personal greeting**: "Welcome, [First Name]!"
  - **Goal progress message**: "[X] more minutes to reach your goal!" or "Goal reached! 🎉"
  - **Progress card**:
    - Large animated reading goal ring
    - Minutes read / Goal minutes
    - Percentage complete
  - **Stats row**:
    - This week's minutes
    - Class total minutes
    - Grade total minutes
    - Longest single session
  - **Class fundraising section**:
    - Bookshelf visualization
    - Progress toward class pledge goal
    - Milestone reward description
  - **Class favorite books**:
    - Top 5 most-read books by classmates
    - Book titles with read counts
  - **Grade favorite books**:
    - Top 5 most-read books by grade
  - **My reading history**:
    - Chronological list of logs
    - Each shows: Date, Minutes, Book title
    - Edit button (if not verified)
    - Delete button (if not verified)
- **Quick action buttons**:
  - "Log Reading" (primary) → Opens log reading modal
  - "My Books" → `/student/books`
- **Actions**:
  - Log Reading → Modal/inline form:
    - Minutes stepper (5-minute increments)
    - Book selector with search
    - Submit → Creates reading_logs record
  - Edit log → Inline edit mode
  - Delete log → Confirmation → Deletes record
  - Log out → Clears sessionStorage, redirects to `/student/login`
- **Phase-blocked states**:
  - Pre-event: "Reading starts on [date]!" - Log button disabled
  - Grace period: "The read-a-thon has ended. Ask a parent to log any remaining reading."
  - Closed: "The read-a-thon is complete! Great job reading!"
- **Business rules**: Can only log during `active` phase

---

#### Route: `/student/books` (StudentBooksPage)
- **Purpose**: Book tracking and discovery
- **Page title**: "My Books"
- **Data displayed**:
  - Search input for books
  - Barcode scanner button (camera access)
  - **Books I've read** section:
    - List of unique books from reading logs
    - Each shows: Cover image (if available), Title, Author, Times read
  - **Suggested books** section (if available):
    - Popular books in class/grade
- **Actions**:
  - Search books → Queries `books` table
  - Scan barcode → Opens camera, looks up ISBN
  - Click book → View book details
- **Empty state**: "Start reading and tracking your books!"

---

### 3.2 Student User Journeys

#### Student Login Setup (Parent Action)
```
1. Parent goes to /account
2. Expands child's card in "Children's Accounts" section
3. Toggles "Enable Student Login" ON
4. Sets username (auto-suggested or custom)
5. Sets password → API: student-set-password edge function (SHA-256 hash)
6. Gives credentials to child
```

#### Student Login Flow
```
1. Navigate to /student/login
2. Enter username
3. Enter password
4. Submit → API: student-login edge function validates
5. On success:
   → Session stored in sessionStorage
   → → /student/dashboard
6. On failure:
   → Error message displayed
   → Can retry
```

#### Logging Reading as Student
```
1. /student/dashboard → Click "Log Reading" button
2. Modal opens with:
   → Date (today, not editable by students)
   → Minutes stepper: +/- buttons, quick presets (15, 20, 30, 45)
   → Book selector (optional):
      - Search by title
      - Scan barcode
      - Select from recent books
3. Click "Log Reading" to submit
4. → Toast success with celebration animation
5. Dashboard updates:
   → Progress ring animates
   → New log appears in history
```

#### Editing a Reading Log
```
1. /student/dashboard → Reading history section
2. Click edit icon on log row
3. Inline edit mode:
   → Minutes input
   → Book selector
4. Save or Cancel
5. → Updates reading_logs record
6. → Dashboard totals recalculate
```

### 3.3 Student Business Rules

| Rule | Description |
|------|-------------|
| Authentication | Parent-managed username/password |
| Password storage | SHA-256 hashed in `student_password_hash` column |
| Session type | sessionStorage only (no persistent login across browser sessions) |
| Session scope | Cleared when browser tab/window closes |
| Log creation | Only during `active` event phase |
| Log editing | Can edit own logs until parent verifies totals (`total_verified` flag) |
| Log deletion | Can delete own logs until verification |
| Data visibility | Own progress, class totals, grade totals, book lists |
| Cannot see | Individual classmate data, sponsor info, pledge amounts |

### 3.4 What Students CAN vs CANNOT Do

| Action | Allowed | Notes |
|--------|---------|-------|
| Log reading minutes | ✅ Yes | Active phase only |
| Select/search books | ✅ Yes | Any time |
| Scan book barcodes | ✅ Yes | Uses device camera |
| Edit own reading logs | ✅ Yes | Until parent verifies |
| Delete own reading logs | ✅ Yes | Until parent verifies |
| View own progress | ✅ Yes | Always |
| View class totals | ✅ Yes | Aggregated only |
| View grade totals | ✅ Yes | Aggregated only |
| View class favorite books | ✅ Yes | Titles only |
| View individual classmates | ❌ No | Privacy protected |
| View sponsors | ❌ No | Not relevant to student |
| View pledge amounts | ❌ No | Not relevant to student |
| View payment info | ❌ No | Not relevant to student |
| Invite sponsors | ❌ No | Parent function |
| Change account settings | ❌ No | Parent managed |
| Change password | ❌ No | Parent sets via /account |
| Log reading (pre-event) | ❌ No | Event not started |
| Log reading (grace period) | ❌ No | Only parents can backdate |
| Log reading (closed) | ❌ No | Event ended |

---

## 4. Teacher Role

### 4.1 Complete Page Inventory

---

#### Route: `/teacher/login`
- **Purpose**: Teacher authentication
- **Page title**: "Teacher Login"
- **Data displayed**: 
  - Email input
  - Password input
  - Forgot password link
  - Link to teacher registration (if enabled)
- **Actions**: 
  - Submit login → API: `supabase.auth.signInWithPassword()`
- **Navigation on success**: → `/teacher`
- **Errors**: "Invalid email or password", "Teacher account not found"

---

#### Route: `/teacher/register`
- **Purpose**: Self-registration for teachers (if enabled)
- **Page title**: "Teacher Registration"
- **Data displayed**: Registration form
- **Actions**: Submit → Creates auth user + teacher record (pending admin approval)

---

#### Route: `/teacher/set-password`
- **Purpose**: Initial password setup from invitation email
- **Page title**: "Set Your Password"
- **URL format**: `/teacher/set-password?token=xxx`
- **Data displayed**: 
  - New password input
  - Confirm password input
  - Password requirements
- **Process**: 
  1. User enters password
  2. API: `link-teacher-account` edge function:
     - Validates token
     - Creates auth user
     - Links `user_id` to existing teacher record
- **Navigation on success**: → `/teacher/login` with success message
- **Errors**: "Invalid or expired link", "Password too weak"

---

#### Route: `/teacher` (TeacherDashboard)
- **Purpose**: Class overview and student monitoring
- **Page title**: "Teacher Dashboard"
- **Data displayed**:
  - **Header section**:
    - Teacher name and type badge (Homeroom, Partner, Staff)
    - Event status banner: Event name, Days remaining, Phase indicator
  - **Stats grid**:
    - Total students (in teacher's view)
    - Participating (students with any reading logged)
    - Total minutes (sum)
    - Average per student
  - **Filters bar**:
    - Search input (by student name)
    - Sort dropdown: Name A-Z, Progress, Last Active
    - Status filter: All, Needs Attention (no recent activity), Goal Reached
    - **For Staff (full access)**:
      - Grade filter dropdown
      - Class filter dropdown
    - **For Grade-level Partners**:
      - Class filter dropdown
  - **Student grid**:
    - Card per student showing:
      - Avatar with initials
      - Name (First + Last Initial)
      - Progress ring
      - Status badge: "On Track", "Needs Attention", "Goal Reached!"
      - Minutes read / Goal
      - Last logged date
      - Books read count
      - "Recent books" preview (unique titles)
  - **Quick actions**:
    - "Log Reading" button (if grade-enabled)
    - "Export" button (CSV download)
    - "Sign Out"
- **Actions**:
  - Search/filter students
  - Click student card → Expands detailed view
  - Log Reading → `/teacher/log`
  - Export → Downloads class report
- **Business rules**: 
  - Students shown based on teacher type and assignments
  - Log Reading disabled with tooltip if grade not in `teacher_logging_grades`
- **Empty states**:
  - No students assigned: "No students assigned to your class yet"
  - All filtered out: "No students match your filters"

---

#### Route: `/teacher/log` (TeacherLogReading)
- **Purpose**: Bulk reading entry for students
- **Page title**: "Log Reading"
- **Requires**: Teacher's grade must be in `events.teacher_logging_grades`
- **Data displayed**:
  - **Mode toggle**:
    - Single Student mode
    - Bulk mode
  - **Single Student mode**:
    - Student dropdown (searchable)
    - Selected student's progress ring and stats
  - **Bulk mode**:
    - Checkbox grid of all students
    - "Select All" / "Select None" buttons
    - Selected count indicator
  - **Log form** (shared):
    - Date selector: Today / Yesterday buttons
    - Minutes stepper with +/- buttons
    - Quick minute buttons: 15, 20, 30, 45
    - Activity note input (optional)
  - **Submit button** with count (Bulk: "Log for X students")
- **Actions**: 
  - Select student(s)
  - Set minutes
  - Submit → API: Creates `reading_logs` records for each selected student
- **Navigation on success**: 
  - Success toast
  - "Log More" button (clears form)
  - "Back to Dashboard" button
- **Errors**: "Please select at least one student", "Please enter minutes"

---

### 4.2 Teacher User Journeys

#### Teacher Onboarding Flow (Admin-Initiated)
```
1. Admin creates teacher record in /admin/settings:
   → Enters name, email, grade level, teacher type
   → Sets access level (homeroom, partner, staff)
2. Admin clicks "Send Invite" → API: send-teacher-invite edge function
3. Teacher receives email with:
   → Welcome message
   → Set password link (/teacher/set-password?token=xxx)
4. Teacher clicks link → /teacher/set-password
5. Enters and confirms password
6. → API: link-teacher-account creates auth user, links to teacher record
7. → /teacher/login with success message
8. Logs in with email and new password
9. → /teacher dashboard with assigned students
```

#### Teacher Logging Reading Flow
```
1. /teacher → Check "Log Reading" button:
   → Enabled: Teacher's grade is in teacher_logging_grades
   → Disabled: Shows tooltip "Not enabled for your grade"
2. Click enabled button → /teacher/log
3. Choose mode:
   A. Single Student:
      → Search/select student
      → See their current progress
      → Set date (Today/Yesterday)
      → Set minutes
      → Submit
   B. Bulk Mode:
      → Check multiple students
      → Or "Select All"
      → Set date
      → Set minutes (applies to all)
      → Submit → Creates log for each student
4. Success:
   → Toast: "Logged X minutes for Y student(s)"
   → Options: "Log More" or "Back to Dashboard"
```

#### Teacher Filtering Students Flow
```
1. /teacher → Dashboard loaded with students
2. Use search: Type partial name → Filters instantly
3. Use sort dropdown:
   → Name A-Z / Z-A
   → Progress (highest to lowest)
   → Last Active (most recent first)
4. Use status filter:
   → All: Shows everyone
   → Needs Attention: No activity in 3+ days
   → Goal Reached: Progress >= 100%
5. [Staff only] Use grade filter → Shows only that grade
6. [Staff/Grade Partner] Use class filter → Shows only that class
```

### 4.3 Teacher Role Hierarchy

| Teacher Type | Student Access | Filters Available | Log Reading |
|--------------|---------------|-------------------|-------------|
| Homeroom | Only assigned students (via `homeroom_teacher_id`) | None needed | If grade enabled |
| Partner (Specific) | Students in linked homeroom classes (via `teacher_class_assignments`) | None needed | If grade enabled |
| Partner (Grade-level) | All students in assigned `grade_level` | Class filter | If grade enabled |
| Specials | No access unless assigned | N/A | N/A |
| Staff (`has_full_access`) | All students school-wide | Grade + Class filters | If grade enabled |

### 4.4 Teacher Business Rules

| Rule | Description |
|------|-------------|
| Authentication | Admin-created account with magic link password setup |
| Student visibility | Controlled by `can_teacher_view_child(user_id, child_id)` RLS function |
| Log permission | Only if students' grade is in `events.teacher_logging_grades` array |
| Log timing | Only during `active` event phase |
| Log dates | Can only log for Today or Yesterday |
| Cannot see | Sponsor info, pledge amounts, payment data, parent contact info |
| Dual role support | Same email can have both teacher record and parent account |
| Account linking | First login links auth `user_id` to teacher record |

### 4.5 What Teachers CAN vs CANNOT Do

| Action | Allowed | Notes |
|--------|---------|-------|
| View assigned students | ✅ Yes | Based on role hierarchy |
| View student progress | ✅ Yes | Minutes, goals, books |
| View class/grade totals | ✅ Yes | Aggregated stats |
| Log reading for students | ✅ Yes | If grade enabled, active phase |
| Bulk log reading | ✅ Yes | Multiple students at once |
| Edit reading logs | ❌ No | Parents/admins only |
| Delete reading logs | ❌ No | Parents/admins only |
| View sponsors | ❌ No | Not relevant to role |
| View pledge amounts | ❌ No | Financial data protected |
| View parent info | ❌ No | Contact info protected |
| Manage student accounts | ❌ No | Parent function |
| Export class data | ✅ Yes | CSV download |

### 4.6 Teacher Data Visibility

| Data Point | Visible |
|------------|---------|
| Student first name | ✅ Yes |
| Student last name (initial) | ✅ Yes |
| Student grade | ✅ Yes |
| Student reading minutes | ✅ Yes |
| Student reading goal | ✅ Yes |
| Student books read | ✅ Yes |
| Student last active date | ✅ Yes |
| Class totals | ✅ Yes |
| Grade totals | ✅ Yes |
| Parent name | ❌ No |
| Parent email/phone | ❌ No |
| Sponsor names | ❌ No |
| Pledge amounts | ❌ No |
| Payment status | ❌ No |

---

## 5. Admin Role

### 5.1 Complete Page Inventory

---

#### Route: `/admin/login`
- **Purpose**: Admin authentication
- **Page title**: "Admin Login"
- **Requirements**: User must have `admin` role in `user_roles` table
- **Data displayed**: Email/password form
- **Actions**: Submit login
- **Navigation on success**: → `/admin`
- **Errors**: "Invalid credentials", "Access denied - admin role required"

---

#### Route: `/admin` (AdminDashboard)
- **Purpose**: Event overview and quick actions hub
- **Page title**: "Admin Dashboard"
- **Protected by**: `<RequireAdmin>` wrapper (checks `has_role(user_id, 'admin')`)
- **Data displayed**:
  - **Event header**:
    - Event name
    - Status badge: Active (green), Upcoming (blue), Ended (gray)
    - Days remaining countdown
    - Event dates
  - **Key metrics grid**:
    - Students enrolled (count of `children` records)
    - Total minutes (sum of `total_minutes`)
    - Total pledged (sum of all pledge amounts)
    - Total collected (sum of paid pledges)
  - **Attention needed cards**:
    - Outstanding payments count → links to `/admin/outstanding`
    - Unverified logs count → links to `/admin/reading`
    - Pending teacher invites → links to `/admin/settings`
  - **Quick action buttons**:
    - Send Payment Reminders → triggers bulk email
    - Download Reports → dropdown with report types
    - Manage Event → `/admin/settings`
  - **Recent activity feed**:
    - Last 8 activities (pledges, payments, enrollments)
    - Each shows: type icon, description, timestamp
  - **Outstanding payments table**:
    - Columns: Sponsor, Student/Class, Amount, Days Outstanding
    - Actions: Send reminder (individual)
- **Actions**:
  - Send individual reminders
  - Send bulk reminders
  - Download reports (Students, Pledges, Payments CSV)
  - Navigate to settings

---

#### Route: `/admin/settings` (AdminSettingsPage)
- **Purpose**: Comprehensive event configuration
- **Page title**: "Event Settings"
- **Sections (accordion)**:
  1. **Event Details**:
     - Event name (text)
     - School name (text)
     - Start date (date picker)
     - End date (date picker)
     - Last log date (date picker) - defines grace period end
     - Default reading goal (number, minutes)
     - Timezone (dropdown)
  2. **Payment Settings**:
     - Accept credit cards (toggle)
     - Accept checks (toggle)
     - Check mailing address (textarea)
  3. **Email Settings**:
     - Send automatic reminders (toggle)
     - Reminder interval (days before deadline)
  4. **Class Milestones**:
     - Enable class milestones (toggle)
     - Goal amount per class (currency)
     - Milestone reward description (text)
  5. **Teacher Logging Permissions**:
     - Checkboxes per grade level (Pre-K, K, 1-5)
     - Controls which grades' students teachers can log for
  6. **Teachers & Staff Management**:
     - Table of all teachers:
       - Name, Email, Type, Grade, Status, Actions
     - Add Teacher button → Dialog:
       - Name, Email, Grade, Type (homeroom/partner/specials/staff)
       - Full access toggle (for staff)
     - Edit Teacher → Same dialog
     - Send Invite button → Triggers invitation email
     - For Partner teachers:
       - Mode toggle: "Grade-wide" or "Specific Homerooms"
       - Assignments dialog for specific homerooms
     - Delete Teacher (with confirmation)
  7. **Log Verification**:
     - Enable verification (toggle)
     - Threshold settings per grade (JSON editor)
  8. **Event Logo**:
     - Logo generator using Cooper Black font
     - Date position offset slider
     - Preview and download
  9. **Danger Zone**:
     - End Event button:
       - Confirmation dialog (type event name)
       - Archives reading logs and pledges
       - Finalizes per-minute pledges
       - Sends payment collection emails
       - Sets event to closed phase
- **Actions**: Save changes (per section), End event

---

#### Route: `/admin/reading` (AdminReadingLogsPage)
- **Purpose**: View and manage all reading logs
- **Page title**: "Reading Logs"
- **Data displayed**:
  - **Filters bar**:
    - Date range picker
    - Grade filter
    - Class filter
    - Status filter (All, Flagged, Verified)
  - **Table**:
    - Columns: Date, Student, Class, Minutes, Book, Status, Actions
    - Status badges: Normal, Flagged (exceeds threshold), Verified
- **Actions**:
  - View log details
  - Flag log for review
  - Unflag log
  - Export logs (CSV)

---

#### Route: `/admin/outstanding` (AdminOutstandingPage)
- **Purpose**: Manage unpaid pledges
- **Page title**: "Outstanding Payments"
- **Data displayed**:
  - **Summary stats**: Total outstanding, Count of sponsors
  - **Filters**: Days outstanding range, Amount range
  - **Table**:
    - Columns: Sponsor, Student/Class, Type, Amount, Days Outstanding, Last Reminder, Actions
- **Actions**:
  - Send reminder (individual) → Triggers email
  - Send bulk reminders → Dialog to select recipients
  - Mark as paid → Updates `is_paid` flag
  - Mark as uncollectable → Archives pledge

---

#### Route: `/admin/checks` (AdminChecksPage)
- **Purpose**: Track check payments
- **Page title**: "Check Management"
- **Data displayed**:
  - **Expected checks** tab:
    - Pledges with `expected_payment_method = 'check'`
    - Columns: Sponsor, Student/Class, Amount, Date Pledged
  - **Received checks** tab:
    - Recorded payments with `payment_method = 'check'`
    - Columns: Sponsor, Amount, Date Received, Notes, Matched Pledge
  - **Unmatched** tab:
    - Checks not yet matched to pledges
- **Actions**:
  - Record check receipt:
    - Payer name
    - Amount
    - Date received
    - Notes
  - Match check to pledge
  - Mark pledge as paid

---

#### Route: `/admin/emails` (AdminEmailPage)
- **Purpose**: Email campaign management
- **Page title**: "Email Communications"
- **Data displayed**:
  - **Templates tab**:
    - List of saved templates
    - Name, Subject, Recipient filter, Status, Last sent
  - **Compose tab**:
    - Template selector or blank
    - Recipient filter dropdown:
      - All parents
      - Parents without pledges
      - Sponsors with unpaid pledges
      - Teachers
      - Custom filter
    - Recipient count preview (live updates)
    - Subject line input
    - Body editor (rich text)
    - Variable helper: {{sponsor_name}}, {{child_name}}, {{amount}}, etc.
  - **Logs tab**:
    - Sent email history
    - Columns: Recipient, Subject, Status, Sent at, Error (if any)
- **Actions**:
  - Create/edit template
  - Preview recipients
  - Send now
  - Schedule for later
  - View email logs

---

#### Route: `/admin/content` (AdminSiteContentPage)
- **Purpose**: Edit public-facing text content
- **Page title**: "Site Content"
- **Data displayed**:
  - Key-value table of `site_content` records
  - Each row: Key, Description, Current value, Edit button
- **Actions**:
  - Edit value → Inline text editor or modal
  - Save → Updates `site_content` record

---

#### Route: `/admin-users` (AdminUsersPage)
- **Purpose**: User and role management
- **Page title**: "User Management"
- **Data displayed**:
  - **Users table**:
    - Email, Display name, Roles, Created at, Actions
  - **Filters**: Role filter, Search by email
- **Actions**:
  - Add role to user
  - Remove role from user
  - Reset password → Triggers password reset email

---

#### Route: `/admin-finance` (AdminFinancePage)
- **Purpose**: Financial overview and reporting
- **Page title**: "Financial Overview"
- **Data displayed**:
  - **Summary cards**:
    - Total pledged (all pledges)
    - Total collected (paid pledges)
    - Outstanding balance
    - Average pledge amount
  - **Breakdown by type**:
    - Per-minute pledges total
    - Flat pledges total
    - Class pledges total
  - **Charts**:
    - Pledges over time
    - Payments over time
    - Payment methods pie chart
- **Actions**:
  - Export financial report (CSV/PDF)
  - Download pledge details
  - Download payment details

---

### 5.2 Admin User Journeys

#### Initial Admin Setup Flow
```
1. Deploy application with ADMIN_SETUP_KEY environment variable
2. Call bootstrap-admin edge function with:
   → email, password, setup_key
3. Function creates:
   → Auth user
   → Profile record
   → user_roles record with 'admin' role
4. Admin logs in at /admin/login
5. → /admin dashboard (empty state)
6. → /admin/settings to configure first event:
   → Set event name, dates, school name
   → Configure payment options
   → Add teachers
```

#### Creating and Managing Event Flow
```
1. /admin/settings → Create new event
2. Configure all sections:
   → Event details (dates, goals)
   → Payment settings
   → Email settings
   → Class milestones
   → Teacher logging permissions
3. Add teachers:
   → Enter teacher info
   → Select type and access level
   → Click "Send Invite"
4. Teachers receive invitation emails
5. Monitor /admin as event progresses
```

#### Managing Active Event Flow
```
Active Phase:
1. /admin → Monitor key metrics
2. Check "Attention needed" cards
3. Send encouragement emails if participation low
4. /admin/reading → Review flagged logs if any
5. /admin/emails → Send mid-event update

Grace Period:
1. /admin → See outstanding payments
2. /admin/emails → Send payment reminder campaign
3. /admin/outstanding → Send individual reminders
4. Answer parent questions about deadline

Closed Phase:
1. /admin/settings → Click "End Event"
2. Confirm → System archives data, finalizes pledges
3. /admin/outstanding → Follow up on unpaid
4. /admin/checks → Record check payments
5. /admin-finance → Generate final report
```

#### Teacher Management Flow
```
1. /admin/settings → Teachers & Staff section
2. Click "Add Teacher"
3. Fill form:
   → Name, Email
   → Teacher type: Homeroom, Partner, Specials, Staff
   → Grade level (for partners/homeroom)
   → Full access toggle (for staff)
4. Save → Teacher record created
5. Click "Send Invite" on teacher row
6. → API: send-teacher-invite edge function
7. Teacher receives email with set-password link
8. Track invite status (Pending, Accepted)
9. For Partner teachers:
   → Click "Assign Classes" icon
   → Select which homerooms they can access
```

### 5.3 Admin Business Rules

| Rule | Description |
|------|-------------|
| Authentication | Standard auth + `admin` role in `user_roles` table |
| Role verification | `has_role(user_id, 'admin')` function checked by RLS and `<RequireAdmin>` |
| Data access | Full read/write on all public tables |
| Protected routes | All `/admin/*` routes wrapped in `<RequireAdmin>` component |
| Event management | Only admins can create, update, or end events |
| Teacher management | Only admins can add/edit teachers and send invitations |
| Payment marking | Only admins can mark pledges as paid |
| Email campaigns | Only admins can compose and send bulk emails |
| User roles | Only admins can assign/remove roles |
| Data export | Full access to all exports |
| Archival | End event archives reading logs and pledges |

### 5.4 Admin Actions Summary

| Action | Location | Effect |
|--------|----------|--------|
| End Event | /admin/settings | Archives data, finalizes pledges, triggers payment emails |
| Send Reminders | /admin, /admin/outstanding | Emails sponsors about unpaid pledges |
| Mark as Paid | /admin/outstanding, /admin/checks | Updates pledge `is_paid` flag |
| Add Teacher | /admin/settings | Creates teacher record |
| Send Teacher Invite | /admin/settings | Triggers invitation email |
| Flag Log | /admin/reading | Marks log for review |
| Send Email Campaign | /admin/emails | Bulk email to filtered recipients |
| Edit Site Content | /admin/content | Updates public text |
| Export Data | Various pages | Downloads CSV/PDF reports |

---

## Cross-Role Summary

### Time-Based Action Restrictions by Phase

| Action | Pre-Event | Active | Grace Period | Closed |
|--------|-----------|--------|--------------|--------|
| Register new account | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Add children | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Parent: Log reading | ❌ No | ✅ Yes | ✅ Yes (backdate) | ❌ No |
| Student: Log reading | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Teacher: Log reading | ❌ No | ✅ Yes (grade-restricted) | ❌ No | ❌ No |
| Create pledges | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| Edit pledges | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| Pay flat pledges | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Pay per-minute pledges | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Finalize pledges | N/A | N/A | N/A | ✅ Auto |
| Send invite emails | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |

### Data Access Matrix

| Data | Parent | Sponsor | Student | Teacher | Admin |
|------|--------|---------|---------|---------|-------|
| Own children (full) | ✅ | ❌ | ❌ | ❌ | ✅ |
| Sponsored children (limited) | ❌ | ✅ | ❌ | ❌ | ✅ |
| Own progress | ❌ | ❌ | ✅ | ❌ | ✅ |
| Assigned students | ❌ | ❌ | ❌ | ✅ | ✅ |
| All students | ❌ | ❌ | ❌ | Staff only | ✅ |
| Pledge amounts | Own | Own | ❌ | ❌ | ✅ |
| Payment status | Own | Own | ❌ | ❌ | ✅ |
| Class totals | ✅ | ✅ | ✅ | ✅ | ✅ |
| Grade totals | ✅ | ❌ | ✅ | ✅ | ✅ |
| Parent contact | Self | ❌ | ❌ | ❌ | ✅ |
| Teacher contact | ❌ | ❌ | ❌ | Self | ✅ |

---

## Technical Implementation Notes

### Session Storage Keys
- `onboardingChildId` - Child ID during onboarding flow
- `childData` - Child details for onboarding
- `hasMultipleChildren` - Boolean for onboarding branching
- `parentData` - Parent phone from registration
- `studentSession` - Student authentication data (sessionStorage only)

### Key RLS Functions
- `has_role(user_id, role)` - Check if user has specific role
- `can_teacher_view_child(user_id, child_id)` - Teacher-student access control

### Edge Functions
| Function | Trigger | Purpose |
|----------|---------|---------|
| `student-login` | Login form | Validate student credentials |
| `student-set-password` | Parent account | Set student password with hashing |
| `student-forgot-password` | N/A | Not used (parent resets) |
| `send-teacher-invite` | Admin action | Send teacher invitation email |
| `link-teacher-account` | Set password | Connect auth user to teacher record |
| `send-sponsor-thank-you` | Pledge creation | Thank sponsor for pledging |
| `send-parent-welcome` | Onboarding complete | Welcome email with sponsor links |
| `send-pledge-notification` | New pledge | Notify parent of new pledge |
| `send-payment-reminder` | Admin action | Remind sponsors to pay |
| `notify-check-payment` | Check selection | Confirm check payment method |
| `send-template-email` | Admin email tool | Send custom email campaigns |
| `admin-reset-password` | Admin action | Reset user password |
| `bootstrap-admin` | Initial setup | Create first admin user |
