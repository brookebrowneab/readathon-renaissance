# MIGRATION MAP

Generated: 2026-02-03

## 0) App Overview (factual)

- **App name:** Read-a-thon / Readathon Renaissance
- **Primary user types (roles/personas actually present in the app):**
  - **Parent**: Enrolls children, logs reading, invites sponsors, views dashboard
  - **Sponsor**: Pledges money per-minute or flat amounts to support children, pays pledges
  - **Student**: Logs their own reading via PIN-based login
  - **Teacher**: Views students in their class, optionally logs reading for younger grades
  - **Admin**: Manages events, users, emails, payments, settings

- **High-level flows:**
  1. Parent Registration → Add Child → Set Pledge (self-sponsor) → Dashboard
  2. Sponsor receives link → Auth → Select children → Pledge → Payment
  3. Student PIN login → Log reading → View progress
  4. Teacher login → View students → (optional) Log reading for class
  5. Admin: Manage event settings, view metrics, send reminders, process payments

- **Global navigation structure:**
  - Public pages: Home, About, How It Works, FAQ, Privacy
  - Auth: Login, Register, Forgot Password, Student Login, Teacher Login, Admin Login
  - Parent Dashboard: Dashboard, Log Reading, My Children, Invite Sponsors, My Pledges, Account
  - Sponsor Dashboard: Dashboard, Payment
  - Student Dashboard: Dashboard, Log Reading, My Books
  - Teacher Dashboard: Dashboard, Log Reading
  - Admin Dashboard: Overview, Reading Logs, Outstanding, Checks, Emails, Content, Settings

- **Global state/data assumptions:**
  - Active event context (from `events` table, `is_active = true`)
  - User authentication via Supabase Auth
  - Student session via sessionStorage (not Supabase Auth)
  - Teacher session via Supabase Auth with `teachers` table profile

## 1) Route / Page Inventory

| Route / URL | Page Name | Auth Required | Role Required | Layout Shell | Primary Purpose |
|---|---|---|---|---|---|
| `/` | HomePage | N | - | PublicLayout | Landing page with countdown, stats, CTAs |
| `/about` | AboutPage | N | - | PublicLayout | About the program |
| `/how-it-works` | HowItWorksPage | N | - | PublicLayout | Explanation of process |
| `/faq` | FAQPage | N | - | PublicLayout | Frequently asked questions |
| `/privacy` | PrivacyPage | N | - | PublicLayout | Privacy policy |
| `/login` | LoginPage | N | - | PublicLayout | Parent/Sponsor email login |
| `/register` | RegisterPage | N | - | PublicLayout | Parent account registration |
| `/forgot-password` | ForgotPasswordPage | N | - | PublicLayout | Password reset request |
| `/admin/login` | AdminLoginPage | N | - | PublicLayout | Admin login |
| `/student/login` | StudentPinLoginPage | N | - | PublicLayout | Student PIN-based login |
| `/teacher/login` | TeacherLoginPage | N | - | PublicLayout | Teacher email login |
| `/teacher/register` | TeacherRegisterPage | N | - | PublicLayout | Teacher registration |
| `/teacher/set-password` | TeacherSetPasswordPage | N | - | PublicLayout | Set teacher password after invite |
| `/onboarding/add-child` | OnboardingAddChild | Y | Parent | PublicLayout | Add first/additional child |
| `/onboarding/pledge` | OnboardingPledge | Y | Parent | PublicLayout | Parent self-pledge setup |
| `/onboarding/complete` | OnboardingComplete | Y | Parent | PublicLayout | Onboarding success screen |
| `/onboarding/re-enroll` | ReEnrollmentPage | Y | Parent | PublicLayout | Re-enroll from previous event |
| `/dashboard` | DashboardPage | Y | Parent/Sponsor | MainNav+Footer | Main parent/family dashboard |
| `/children` | ManageChildrenPage | Y | Parent | MainNav+Footer | Manage enrolled children |
| `/children/:id` | ChildDetailsPage | Y | Parent | MainNav+Footer | Individual child settings |
| `/children/:id/invite` | InviteSponsorsPage | Y | Parent | MainNav+Footer | Invite sponsors for child |
| `/log-reading` | LogReadingPage | Y | Parent | MainNav+Footer | Log reading for children |
| `/my-pledges` | MyPledgesPage | Y | Parent | MainNav+Footer | View pledges for children |
| `/account` | AccountSettingsPage | Y | Parent | MainNav+Footer | Account settings |
| `/reading-logs/approve` | VerifyLogsPage | Y | Parent | MainNav+Footer | Approve/verify reading logs |
| `/family/sponsor-requests` | SponsorRequestsPage | Y | Parent | MainNav+Footer | Manage sponsor requests |
| `/family/sponsor-my-child` | SponsorMyChildPage | Y | Parent | MainNav+Footer | Self-sponsor a child |
| `/sponsor` | SponsorGatewayPage | N | - | PublicLayout | Entry point for sponsors |
| `/sponsor/:childId` | SponsorLandingPage | N | - | PublicLayout | Legacy direct child sponsor link |
| `/f/:userId` | FamilySponsorPage | Y | Sponsor | PublicLayout | Family-wide sponsor page |
| `/sponsor/auth` | SponsorAuthPage | N | - | PublicLayout | Sponsor authentication |
| `/sponsor/login` | SponsorLoginPage | N | - | PublicLayout | Sponsor password login |
| `/sponsor/check-email` | SponsorCheckEmailPage | N | - | PublicLayout | Check email for magic link |
| `/sponsor/dashboard` | SponsorDashboardPage | Y | Sponsor | MainNav+Footer | Sponsor dashboard |
| `/sponsor/pay` | SponsorPaymentPage | Y | Sponsor | MainNav+Footer | Pay pledges |
| `/sponsor/class` | SponsorClassPage | Y | Sponsor | PublicLayout | Sponsor a whole class |
| `/sponsor/guest-pay` | GuestPaymentPage | N | - | PublicLayout | Guest payment by token |
| `/sponsor/thank-you` | SponsorThankYouPage | N | - | PublicLayout | Thank you after payment |
| `/sponsor/pledged` | SponsorPledgedPage | N | - | PublicLayout | Confirmation after pledging |
| `/sponsor/check-instructions` | SponsorCheckInstructionsPage | N | - | PublicLayout | Check payment instructions |
| `/invite/:token` | ChildToFamilyRedirect | N | - | - | Redirect legacy invite to family page |
| `/s/:code` | ChildToFamilyRedirect | N | - | - | Short code redirect |
| `/returning/:code` | ReturningSponsorPage | N | - | PublicLayout | Returning sponsor re-entry |
| `/student/dashboard` | StudentPinDashboardPage | Y* | Student | MainNav+Footer | Student reading dashboard |
| `/student/books` | StudentBooksPage | Y* | Student | MainNav+Footer | Student's book list |
| `/student/log` | StudentLogReadingPage | Y* | Student | MainNav+Footer | Student log reading |
| `/student` | StudentDashboard | Y* | Student | MainNav+Footer | Alternative student dashboard |
| `/teacher` | TeacherDashboard | Y | Teacher | MainNav+Footer | Teacher class dashboard |
| `/teacher/log` | TeacherLogReading | Y | Teacher | MainNav+Footer | Teacher bulk log reading |
| `/admin` | AdminDashboard | Y | Admin | AdminLayout | Admin overview |
| `/admin/reading` | AdminReadingLogsPage | Y | Admin | AdminLayout | View all reading logs |
| `/admin/outstanding` | AdminOutstandingPage | Y | Admin | AdminLayout | Outstanding payments |
| `/admin/checks` | AdminChecksPage | Y | Admin | AdminLayout | Check payment tracking |
| `/admin/emails` | AdminEmailPage | Y | Admin | AdminLayout | Email templates/logs |
| `/admin/content` | AdminSiteContentPage | Y | Admin | AdminLayout | Manage site content |
| `/admin/settings` | AdminSettingsPage | Y | Admin | AdminLayout | Event settings |
| `/admin-users` | AdminUsersPage | Y | Admin | AdminLayout | User management |
| `/admin-finance` | AdminFinancePage | Y | Admin | AdminLayout | Financial reports |
| `/debug/progress-ring` | DebugRingPage | N | - | - | Debug utility |
| `*` | NotFound | N | - | - | 404 page |

*Note: Student auth uses sessionStorage, not Supabase Auth

## 2) Shared Components Inventory

| Component Name | Where Used | Props / Inputs | Key Behaviors | Notes |
|---|---|---|---|---|
| `PublicLayout` | All public pages | `children` | Header (MainNav), Footer, consistent padding | Wraps public-facing pages |
| `MainNav` | All authenticated pages | - | Role-aware links, user detection, logout | Detects student/teacher/parent |
| `Footer` | All pages | - | Copyright, links | Static footer |
| `AdminLayout` | Admin pages | `children` | Sidebar navigation, admin check | Wraps admin section |
| `AdminSidebar` | AdminLayout | - | Navigation links for admin sections | Collapsible |
| `BottomTabBar` | Mobile dashboard pages | `role` | Mobile navigation tabs | Shows different tabs per role |
| `ReadingGoalRing` | Dashboards, cards | `progress`, `goal`, `size`, `mobileSize` | SVG circular progress | Legacy component |
| `BookContainer` | Legacy components | `variant`, `className`, `children` | Hand-drawn border container | Deprecated in favor of inline styles |
| `handDrawnBorder` style | Most pages | CSS object | Organic, sketchy border effect | Used as inline style |
| `Button` | Everywhere | Standard shadcn props | Primary/secondary/ghost variants | shadcn/ui |
| `Input` | Forms | Standard props | Text input | shadcn/ui |
| `FormField` | Forms | `label`, `htmlFor`, `error`, `helperText`, `required` | Label + input wrapper | Custom component |
| `Select` | Forms | shadcn props | Dropdown select | shadcn/ui |
| `Dialog` | Modals | shadcn props | Modal overlay | shadcn/ui |
| `Toast/Sonner` | Global | - | Toast notifications | Uses sonner |
| `Skeleton` | Loading states | `className` | Placeholder shimmer | shadcn/ui |
| `Badge` | Status indicators | `variant` | Status labels | Custom variants: success, warning, info |
| `BookSelector` | Reading log forms | `onSelect`, `selectedBook` | Book search/barcode scan | Custom component |
| `ClassFundraisingShelf` | Dashboards | `funded`, `goal` | Visual progress bar with bookshelf | Custom component |
| `PledgeCard` | Pledge lists | Pledge data | Display pledge info with actions | Custom component |
| `StudentCard` | Teacher dashboard | Student data | Student progress card | Custom component |
| `TablePagination` | Admin tables | Pagination props | Page size selector, page navigation | Custom component |

## 3) Data Entities Observed (UI-level)

### Child
- **Fields shown/edited:** name, grade_info, class_name, goal_minutes, total_minutes, share_public_link, homeroom_teacher_id, student_username, student_login_enabled
- **Where it appears:** Dashboard, ManageChildren, ChildDetails, OnboardingAddChild, sponsor pages

### Reading Log
- **Fields shown/edited:** id, minutes, book_title, logged_at, child_id, student_name
- **Where it appears:** LogReading, ReadingLogsTable, ChildReadingLogsSection, AdminReadingLogsPage

### Pledge
- **Fields shown/edited:** id, child_id, sponsor_id, student_name, pledge_type (flat/per_minute), amount, is_paid, payment_status, expected_payment_method
- **Where it appears:** Dashboard, MyPledges, SponsorDashboard, AdminOutstanding

### Class Pledge
- **Fields shown/edited:** id, class_name, teacher_id, sponsor_user_id, pledge_type, amount, milestone_minutes_target
- **Where it appears:** SponsorClassPage, AdminDashboard

### Sponsor
- **Fields shown/edited:** id, user_id, name, email, phone
- **Where it appears:** SponsorDashboard, FamilySponsorPage

### Teacher
- **Fields shown/edited:** id, user_id, name, email, teacher_type, grade_level, is_active, has_full_access
- **Where it appears:** TeacherDashboard, AdminSettings

### Event
- **Fields shown/edited:** id, name, start_date, end_date, last_log_date, is_active, goal_minutes, class_milestone_enabled, class_milestone_goal, class_milestone_reward, log_verification_enabled, log_verification_thresholds, teacher_logging_grades
- **Where it appears:** AdminSettings, affects all dashboards

### Payment
- **Fields shown/edited:** id, pledge_id, class_pledge_id, amount, payer_email, payer_name, payment_method, square_payment_id
- **Where it appears:** AdminChecks, AdminOutstanding, SponsorPayment

### Profile
- **Fields shown/edited:** id, user_id, display_name, phone
- **Where it appears:** AccountSettings

## 4) Page-by-Page Specs

---

### HomePage (Route: `/`)

#### 4.1 Purpose
Marketing landing page showcasing the read-a-thon with countdown, stats, and CTAs.

#### 4.2 Layout & Components
- **Layout shell:** PublicLayout
- **Major sections:** Countdown timer, Hero with headline, Stats section (3 stats), How It Works (4 steps), Making a Difference, CTA section
- **Components:** Button, custom handDrawnBorder styling, booksShelfBannerV2 background images

#### 4.3 Visible Data
- **Data displayed:** School-wide stats (minutes logged, books completed, funds raised), event countdown, dynamic content from `site_content` table
- **Default values:** Fallback content if site_content not configured
- **Sorting/filtering:** N/A

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| HP-1 | "Get Started" button | Link | None | None | Navigate to /register | Page navigation | - | - |
| HP-2 | "Learn More" button | Link | None | None | Navigate to /how-it-works | Page navigation | - | - |
| HP-3 | "Register Now" button | Link | None | None | Navigate to /register | Page navigation | - | - |
| HP-4 | "Sign In" button | Link | None | None | Navigate to /login | Page navigation | - | - |
| HP-5 | "Student Login" link | Link | None | None | Navigate to /student/login | Page navigation | - | - |

#### 4.5 Modals / Dialogs / Toasts
- None

#### 4.6 Navigation & Deep Links
- Links go to: /register, /how-it-works, /login, /student/login
- No redirect behavior
- Standard back button

#### 4.7 Permissions & Role Gating
- Public access, no restrictions

#### 4.8 API ACTIONS

| ID | Action Name | Method | Endpoint | Request | Response | Errors |
|---|---|---|---|---|---|---|
| HP-1 | getActiveEvent | GET | /events?is_active=true | - | `{id, name, start_date, end_date}` | 404 if none |
| HP-2 | getSiteContent | GET | /site_content | - | `{key, value}[]` | - |

#### 4.9 Edge / Empty / Error States
- No event: Shows "0 days 0 hours until reading starts"
- Content missing: Falls back to DEFAULT_CONTENT

---

### LoginPage (Route: `/login`)

#### 4.1 Purpose
Authenticate parents and sponsors to access their dashboards.

#### 4.2 Layout & Components
- **Layout shell:** PublicLayout
- **Major sections:** Login form card with hand-drawn border
- **Components:** FormField, Input, Button, Checkbox, Links

#### 4.3 Visible Data
- Form fields: email, password, remember me checkbox
- Demo mode buttons (Parent, Student, Teacher, Sponsor, Admin)

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| LG-1 | Email input | Input | - | Email format | Collect email | - | - | - |
| LG-2 | Password input | Input | - | Required | Collect password | - | - | - |
| LG-3 | Show/hide password | Button | - | - | Toggle visibility | Eye icon changes | - | - |
| LG-4 | "Sign In" button | Submit | Email+password filled | Supabase auth | Authenticate user | Navigate to /dashboard, toast "Signed in successfully!" | Toast with error message | "Signing in..." |
| LG-5 | "Forgot password?" link | Link | - | - | Navigate to /forgot-password | - | - | - |
| LG-6 | "Create an account" link | Link | - | - | Navigate to /register | - | - | - |
| LG-7 | Demo buttons | Button | - | - | Direct navigation | Navigate to demo page | - | - |

#### 4.5 Modals / Dialogs / Toasts
- **Success toast:** "Signed in successfully!"
- **Error toast:** Displays Supabase error message

#### 4.6 Navigation & Deep Links
- Success redirects to /dashboard
- Links: /forgot-password, /register, /student/login, /teacher/login, /sponsor/dashboard, /admin

#### 4.7 Permissions & Role Gating
- Public access

#### 4.8 API ACTIONS

| ID | Action Name | Method | Endpoint | Request | Response | Errors |
|---|---|---|---|---|---|---|
| LG-1 | signIn | POST | Supabase Auth | `{email, password}` | Session | "Invalid login credentials" |

#### 4.9 Edge / Empty / Error States
- Invalid credentials: Toast error message
- Network error: Toast "Something went wrong"

---

### RegisterPage (Route: `/register`)

#### 4.1 Purpose
Create new parent/sponsor accounts.

#### 4.2 Layout & Components
- **Layout shell:** PublicLayout
- **Major sections:** Registration form with password strength indicator
- **Components:** FormField, Input, Button, Checkbox, PasswordCheck indicators

#### 4.3 Visible Data
- Form fields: firstName, lastName, email, phone (optional), password, confirmPassword, terms checkbox
- Password strength meter with checks: 8+ chars, uppercase, number

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| RG-1 | First Name | Input | - | Required, trimmed | Collect name | - | "Required" error | - |
| RG-2 | Last Name | Input | - | Required | Collect name | - | "Required" error | - |
| RG-3 | Email | Input | - | Email regex | Collect email | "✓ Valid email" | Error text | - |
| RG-4 | Phone | Input | - | Optional, phone regex | Collect phone | - | Format error | - |
| RG-5 | Password | Input | - | 8+ chars, uppercase, number | Collect password | Strength indicator | Requirements list | - |
| RG-6 | Confirm Password | Input | - | Must match password | Verify password | "✓ Passwords match" | "Passwords don't match" | - |
| RG-7 | Terms checkbox | Checkbox | - | Required | Accept terms | - | - | - |
| RG-8 | "Create Account" | Submit | All valid + terms | - | Create account | Navigate to /onboarding/add-child, toast "Account created!" | Toast error | "Creating Account..." |

#### 4.5 Modals / Dialogs / Toasts
- **Success:** "Account created! Let's add your child."
- **Error:** Supabase error message

#### 4.6 Navigation & Deep Links
- Success redirects to /onboarding/add-child
- Parent data stored in sessionStorage for onboarding

#### 4.7 Permissions & Role Gating
- Public access

#### 4.8 API ACTIONS

| ID | Action Name | Method | Endpoint | Request | Response | Errors |
|---|---|---|---|---|---|---|
| RG-1 | signUp | POST | Supabase Auth | `{email, password, displayName}` | Session | "User already registered" |

---

### DashboardPage (Route: `/dashboard`)

#### 4.1 Purpose
Main parent dashboard showing children's reading progress, pledges, and actions.

#### 4.2 Layout & Components
- **Layout shell:** MainNav + Footer + BottomTabBar (mobile)
- **Major sections:** Header with greeting, "Your Readers" grid, Pledges section, Recent Activity, Quick Actions sidebar
- **Components:** ChildProgressCard, PledgesSection, ChildBooksSection, ReadingGoalRing, ClassFundraisingShelf, Skeleton

#### 4.3 Visible Data
- User greeting, children cards with: name, avatar, minutes read, goal, percentage, class/grade stats, fundraising progress
- Pledges by child with sponsor names and amounts
- Recent reading activity list
- Notification badges (log approvals, sponsor requests)

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| DB-1 | "Log Out" button | Button | Logged in | - | Sign out | Navigate to /login, toast | - | - |
| DB-2 | "Manage Children" link | Link | - | - | Navigate to /account#children | - | - | - |
| DB-3 | "Add Your First Reader" | Button | No children | - | Navigate to /onboarding/add-child | - | - | - |
| DB-4 | "Log Reading" button | Button | Has children | - | Navigate to /log-reading | - | - | - |
| DB-5 | "Invite Sponsors" button | Button | Has children | - | Navigate to /invite | - | - | - |
| DB-6 | "Edit" pledge button | Button | Pledge exists | - | Open edit dialog | Dialog opens | - | - |
| DB-7 | "Delete" pledge button | Button | Pledge exists | Confirmation | Delete pledge | Toast, list updates | Toast error | - |
| DB-8 | Notification badge links | Link | Badge count > 0 | - | Navigate to action page | - | - | - |
| DB-9 | Child card → details | Link | - | - | Navigate to /children/:id | - | - | - |

#### 4.5 Modals / Dialogs / Toasts
- **EditPledgeDialog:** Trigger: Edit button; Fields: amount, pledge_type; Actions: Save, Cancel
- **Delete confirmation:** Confirm before deleting pledge

#### 4.6 Navigation & Deep Links
- Links to: /log-reading, /invite, /children/:id, /reading-logs/approve, /family/sponsor-requests, /account
- Sponsor-only users redirect to /sponsor/dashboard

#### 4.7 Permissions & Role Gating
- Requires authentication
- Shows different UI for sponsor-only vs parent users

#### 4.8 API ACTIONS

| ID | Action Name | Method | Endpoint | Request | Response | Errors |
|---|---|---|---|---|---|---|
| DB-1 | listChildren | GET | /children | - | `Child[]` | - |
| DB-2 | listPledgesByChild | GET | /pledges | - | Grouped pledges | - |
| DB-3 | listReadingLogs | GET | /reading_logs | - | `ReadingLog[]` | - |
| DB-4 | getClassTotals | RPC | get_class_total_minutes | `{class_name}` | number | - |
| DB-5 | getGradeTotals | RPC | get_grade_total_minutes | `{grade_info}` | number | - |
| DB-6 | deletePledge | DELETE | /pledges/:id | - | - | - |

#### 4.9 Edge / Empty / Error States
- No children: "No children added yet" with CTA
- No pledges: "No pledges yet" message
- Loading: Skeleton cards

---

### StudentPinLoginPage (Route: `/student/login`)

#### 4.1 Purpose
Allow students to log in with username/password (not Supabase Auth).

#### 4.2 Layout & Components
- **Layout shell:** PublicLayout
- **Major sections:** Login form with student-friendly messaging
- **Components:** FormField, Input, Button, Dialog (forgot password)

#### 4.3 Visible Data
- Username input, password input with show/hide
- "Forgot password?" link, help text

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| SL-1 | Username input | Input | - | 3+ chars, lowercase, no spaces | Collect username | - | Error text | - |
| SL-2 | Password input | Input | - | 4+ chars | Collect password | - | Error text | - |
| SL-3 | "Start Reading!" button | Submit | Valid inputs | Edge function call | Authenticate student | Navigate to /student/dashboard, toast | Error message | "Logging in..." |
| SL-4 | "Forgot password?" | Button | - | - | Open forgot password dialog | Dialog opens | - | - |
| SL-5 | "Notify Parent" in dialog | Submit | Username entered | - | Send email to parent | Success screen | Toast error | "Sending..." |

#### 4.5 Modals / Dialogs / Toasts
- **Forgot Password Dialog:**
  - Title: "Forgot Password?"
  - Input: Username
  - Actions: "Notify Parent", "Cancel"
  - Success: Shows confirmation with checkmark

#### 4.6 Navigation & Deep Links
- Success: /student/dashboard
- Links: /login (parent login)

#### 4.7 Permissions & Role Gating
- Public access
- Creates sessionStorage session, not Supabase Auth

#### 4.8 API ACTIONS

| ID | Action Name | Method | Endpoint | Request | Response | Errors |
|---|---|---|---|---|---|---|
| SL-1 | studentLogin | POST | Edge: student-login | `{username, password}` | `{success, child}` | "Login failed" |
| SL-2 | studentForgotPassword | POST | Edge: student-forgot-password | `{username}` | `{}` | - |

---

### StudentPinDashboardPage (Route: `/student/dashboard`)

#### 4.1 Purpose
Student-facing dashboard showing their reading progress and allowing log entry.

#### 4.2 Layout & Components
- **Layout shell:** MainNav + Footer
- **Major sections:** Hero headline (school total), Welcome header, Progress card with ring, Class/Grade stats, Favorite books, Reading history, Log modal
- **Components:** ReadingGoalRing, BookSelector, Dialog, Badge

#### 4.3 Visible Data
- School-wide total minutes (hero)
- Student name, total minutes, goal, percentage
- Today's minutes, week's minutes, unique books count
- Class total, grade total
- Recent reading logs list with verification status
- Class/grade favorite books

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| SD-1 | "Log Out" button | Button | Session exists | - | Clear session, navigate | Navigate to /student/login | - | - |
| SD-2 | "Log My Reading!" button | Button | - | - | Open log reading modal | Modal opens | - | - |
| SD-3 | Minutes +/- buttons | Button | Modal open | - | Adjust minutes | Number updates | - | - |
| SD-4 | Minute presets | Button | Modal open | - | Set exact minutes | Number updates | - | - |
| SD-5 | Book selector | Component | Modal open | - | Search/select book | Book selected | - | - |
| SD-6 | "Log Reading" submit | Submit | Minutes > 0 | - | Create reading log | Toast "Great job!", modal closes, list updates | Toast error | Spinner |
| SD-7 | Edit log button | Button | Log exists, not verified | - | Open edit modal | Modal opens | - | - |
| SD-8 | Delete log button | Button | Log exists, not verified | Confirmation | Delete log | Toast, list updates | Toast error | - |
| SD-9 | "View My Books" link | Link | - | - | Navigate to /student/books | - | - | - |

#### 4.5 Modals / Dialogs / Toasts
- **Log Reading Modal:** Minutes stepper, book selector, submit button
- **Edit Log Modal:** Same as log modal, pre-filled
- **Success toast:** "Great job! You logged X minutes! 🎉"

#### 4.6 Navigation & Deep Links
- /student/books, /student/log, /student/login (logout)

#### 4.7 Permissions & Role Gating
- Requires student sessionStorage session
- Redirects to /student/login if no session
- Edit/delete only if parent hasn't verified

---

### TeacherDashboard (Route: `/teacher`)

#### 4.1 Purpose
Teacher view of students in their class(es) with progress tracking.

#### 4.2 Layout & Components
- **Layout shell:** MainNav + Footer
- **Major sections:** Header with teacher name, Event status banner, Stats row (4 cards), Filters, Student grid
- **Components:** StudentCard, Badge, Select, Input, Button, Skeleton

#### 4.3 Visible Data
- Teacher name, type, event info
- Stats: Total students, participating, total minutes, avg per student
- Student cards: name, avatar, minutes, goal percentage, status badge, last active, books read

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| TD-1 | "Sign Out" button | Button | Logged in | - | Sign out | Navigate to /login | - | - |
| TD-2 | Search input | Input | - | - | Filter students by name | List filters | - | - |
| TD-3 | Sort dropdown | Select | - | - | Change sort (name/progress/last-active) | List reorders | - | - |
| TD-4 | Status filter | Select | - | - | Filter by status | List filters | - | - |
| TD-5 | Grade filter | Select | Has full access | - | Filter by grade | List filters | - | - |
| TD-6 | Class filter | Select | Has access | - | Filter by class | List filters | - | - |
| TD-7 | "Log Reading" button | Link | Enabled for grade | - | Navigate to /teacher/log | - | Tooltip "not enabled" | - |
| TD-8 | "Export" button | Button | - | - | Download report | Toast "Downloading..." | - | - |

#### 4.5 Modals / Dialogs / Toasts
- Export toast notification

#### 4.6 Navigation & Deep Links
- /teacher/log, /login

#### 4.7 Permissions & Role Gating
- Requires teacher auth (Supabase + teachers table)
- Grade filter only for has_full_access
- Log Reading disabled if grade not in teacher_logging_grades

---

### AdminDashboard (Route: `/admin`)

#### 4.1 Purpose
Admin overview with key metrics, alerts, and quick actions.

#### 4.2 Layout & Components
- **Layout shell:** AdminLayout (sidebar + content)
- **Major sections:** Header with event name, Metrics cards (4), Attention Needed alerts, Quick Actions, Recent Activity, Outstanding Payments table
- **Components:** AdminLayout, Table, Checkbox, Badge, Button, Dialog, DropdownMenu

#### 4.3 Visible Data
- Event name, status badge, days remaining
- Metrics: Students enrolled, minutes read, pledged, collected
- Alerts: Outstanding payments, pending approvals
- Recent activity: Pledges, payments, enrollments
- Outstanding payments table: Sponsor, student, amount, days outstanding

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| AD-1 | "Send Payment Reminders" | Button | - | - | Open reminder modal | Modal opens | - | - |
| AD-2 | Download Report dropdown | Dropdown | - | - | Download selected report | Toast "Downloading..." | - | - |
| AD-3 | "Manage Event" button | Link | - | - | Navigate to /admin/settings | - | - | - |
| AD-4 | Attention alert cards | Link | Count > 0 | - | Navigate to relevant page | - | - | - |
| AD-5 | Select all checkbox | Checkbox | - | - | Toggle all selections | All checked/unchecked | - | - |
| AD-6 | Individual checkboxes | Checkbox | - | - | Toggle selection | Checked/unchecked | - | - |
| AD-7 | "Send Reminders (n)" | Button | n > 0 | - | Send to selected | Toast "Reminders sent" | - | - |
| AD-8 | "View All" outstanding | Link | - | - | Navigate to /admin/outstanding | - | - | - |

#### 4.5 Modals / Dialogs / Toasts
- **Send Reminders Modal:**
  - Title: "Send Payment Reminders"
  - Description: Count of recipients
  - Actions: "Send Reminders", "Cancel"

#### 4.6 Navigation & Deep Links
- /admin/settings, /admin/outstanding, /admin/checks

#### 4.7 Permissions & Role Gating
- Wrapped in RequireAdmin component
- Checks has_role(user_id, 'admin')

---

### OnboardingAddChild (Route: `/onboarding/add-child`)

#### 4.1 Purpose
Add a child to the parent's account during onboarding or later.

#### 4.2 Layout & Components
- **Layout shell:** PublicLayout
- **Major sections:** Progress indicator (3 steps), Form card
- **Components:** FormField, Input, Select, Button, Switch, Checkbox

#### 4.3 Visible Data
- Form fields: firstName, lastName, grade, homeroom teacher, reading goal (presets + custom), allow public link toggle, "more children" checkbox
- Progress: Step 1 of 3

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| OA-1 | First Name | Input | - | Required | Collect name | - | Error | - |
| OA-2 | Last Name | Input | - | Required | Collect name | - | Error | - |
| OA-3 | Grade select | Select | - | Required | Select grade | - | - | - |
| OA-4 | Teacher select | Select | Grade selected | Required | Select teacher | - | - | - |
| OA-5 | "Teacher not listed?" | Button | - | - | Switch to manual input | Input appears | - | - |
| OA-6 | Goal preset buttons | Button | - | - | Set goal | Button selected | - | - |
| OA-7 | Goal custom input | Input | - | Min 1 | Custom goal | - | - | - |
| OA-8 | Public link switch | Switch | - | - | Toggle visibility | Switch state | - | - |
| OA-9 | Multiple children checkbox | Checkbox | - | - | Set flag for flow | - | - | - |
| OA-10 | "Continue" button | Submit | Form valid | All required | Create child | Navigate to /onboarding/pledge | Toast error | "Saving..." |

#### 4.5 Modals / Dialogs / Toasts
- Error toasts on failure

#### 4.6 Navigation & Deep Links
- Success: /onboarding/pledge
- Back to Dashboard link (if from dashboard)
- Stores child data in sessionStorage

#### 4.7 Permissions & Role Gating
- Requires authentication
- Redirects to /register if not logged in

---

### LogReadingPage (Route: `/log-reading`)

#### 4.1 Purpose
Parent logs reading sessions for their children.

#### 4.2 Layout & Components
- **Layout shell:** MainNav + Footer
- **Major sections:** Child selector (if multiple), Child stats card, Log form, Reading history collapsible
- **Components:** FormField, Input, Button, Calendar/Popover, BookSelector, Collapsible

#### 4.3 Visible Data
- Child selector tabs with avatars
- Selected child: name, total minutes, goal, percentage
- Form: date, minutes (stepper + presets), book selector, notes
- History: Previous logs with edit/delete

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| LR-1 | Child selector tabs | Button | Multiple children | - | Select child | Stats update | - | - |
| LR-2 | Date picker | Calendar | - | Within valid range | Select date | Date updates | - | - |
| LR-3 | Minutes +/- | Button | - | 0-480 | Adjust minutes | Number updates | - | - |
| LR-4 | Minute presets | Button | - | - | Set exact | Number updates | - | - |
| LR-5 | Book selector | Component | - | Max 200 chars | Select/type book | Title fills | - | - |
| LR-6 | Notes textarea | Textarea | - | Max 500 chars | Optional notes | - | - | - |
| LR-7 | "Log Reading" submit | Submit | Minutes > 0 | Zod validation | Create log | Success card, toast, form resets | Toast error | Spinner |
| LR-8 | History toggle | Collapsible | - | - | Show/hide history | Content expands | - | - |
| LR-9 | Edit log button | Button | Log exists | - | Pre-fill form | Form fills | - | - |
| LR-10 | Delete log button | Button | Log exists | Confirmation | Delete log | Toast, list updates | Toast error | - |

#### 4.5 Modals / Dialogs / Toasts
- **Delete confirmation:** AlertDialog
- **Success state:** Inline card showing goal progress

#### 4.6 Navigation & Deep Links
- /dashboard (back)
- Query param: ?child=:id to pre-select child

#### 4.7 Permissions & Role Gating
- Requires parent auth
- Blocked if event phase is pre_event or closed
- Grace period allows logging within valid date range only

---

### FamilySponsorPage (Route: `/f/:userId`)

#### 4.1 Purpose
Allow sponsors to pledge to a family's children.

#### 4.2 Layout & Components
- **Layout shell:** PublicLayout with user header bar
- **Major sections:** Hero, Children selection cards, Amount selection (flat/per-minute), Payment method, Card form, Submit
- **Components:** FormField, Input, Button, Checkbox, Radio-like buttons

#### 4.3 Visible Data
- Family name, event dates
- Children: names, grades, avatars (selectable)
- Amount options: $25/$50/$100 or custom, per-minute toggle
- Payment methods: Card, Check, Pay Later

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| FS-1 | Child selection cards | Button | - | At least 1 | Toggle selection | Card highlights | - | - |
| FS-2 | "Select All" / "Deselect All" | Button | Multiple children | - | Toggle all | All selected/none | - | - |
| FS-3 | Amount preset buttons | Button | - | - | Set amount | Button selected | - | - |
| FS-4 | Custom amount input | Input | - | > 0 | Custom amount | - | - | - |
| FS-5 | Per-minute toggle | Switch | - | - | Toggle pledge type | Rate input appears | - | - |
| FS-6 | Per-minute rate | Input | Toggle on | > 0 | Set rate | - | - | - |
| FS-7 | Payment method | Radio | - | Required | Select method | Section highlights | - | - |
| FS-8 | Card number input | Input | Card selected | 15+ digits | Collect card | - | - | - |
| FS-9 | Expiry input | Input | Card selected | MM/YY format | Collect expiry | - | - | - |
| FS-10 | CVV input | Input | Card selected | 3+ digits | Collect CVV | - | - | - |
| FS-11 | ZIP input | Input | Card selected | 5+ digits | Collect ZIP | - | - | - |
| FS-12 | "Pledge" submit | Submit | Valid form | All fields | Create pledges | Navigate to /sponsor/pledged | Toast error | Spinner |
| FS-13 | "Sign Out" | Button | Logged in | - | Sign out | Navigate to / | - | - |

#### 4.5 Modals / Dialogs / Toasts
- **Profile completion screen:** For returning magic link users (name, phone, optional password)
- Error toasts

#### 4.6 Navigation & Deep Links
- Success: /sponsor/pledged
- Query param: ?child=:id to pre-select
- Requires sponsor auth, redirects to /sponsor/auth if not

#### 4.7 Permissions & Role Gating
- Requires sponsor authentication
- Profile completion required for magic link users

---

### ManageChildrenPage (Route: `/children` or `/family/manage`)

#### 4.1 Purpose
View and manage all enrolled children with reading logs.

#### 4.2 Layout & Components
- **Layout shell:** MainNav + Footer + BottomTabBar
- **Major sections:** Header with "Add Child" button, Child cards (collapsible with logs)
- **Components:** Collapsible, DropdownMenu, ReadingGoalRing, EditChildDialog, AlertDialog, ReadingLogsTable

#### 4.3 Visible Data
- Children: name, avatar, grade, class, minutes, goal ring
- Expandable: Reading logs table per child

#### 4.4 Interactions

| ID | UI Element | Type | Preconditions | Validation | What It Does | Success UI | Failure UI | Loading |
|---|---|---|---|---|---|---|---|---|
| MC-1 | "Add Child" button | Link | - | - | Navigate to onboarding | - | - | - |
| MC-2 | "View Logs" toggle | Collapsible | - | - | Expand/collapse logs | Section expands | - | - |
| MC-3 | "Invite Sponsors" | Link | - | - | Navigate to /children/:id/invite | - | - | - |
| MC-4 | "Edit Profile" | Button | - | - | Open edit dialog | Dialog opens | - | - |
| MC-5 | "Remove from Program" | MenuItem | - | Confirmation | Delete child | Toast, card removed | Toast error | Spinner |
| MC-6 | More menu (mobile) | Dropdown | Mobile | - | Show actions | Menu opens | - | - |

#### 4.5 Modals / Dialogs / Toasts
- **EditChildDialog:** Edit name, grade, class, goal, teacher, public link
- **Delete confirmation:** AlertDialog "Remove {name} from the program?"

#### 4.6 Navigation & Deep Links
- /dashboard (back), /onboarding/add-child, /children/:id/invite

---

## 5) Cross-Page Flows (end-to-end)

### Flow 1: Parent Registration & Onboarding

**Preconditions:** User has no account

**Steps:**
1. `/` → HP-1 "Get Started" → `/register`
2. `/register` → RG-8 "Create Account" → `/onboarding/add-child`
3. `/onboarding/add-child` → OA-10 "Continue" → `/onboarding/pledge`
4. `/onboarding/pledge` → Submit pledge → `/onboarding/complete`
5. `/onboarding/complete` → "Go to Dashboard" → `/dashboard`

**Data created:** User account, Profile, Child, Pledge (self-pledge)

**Failure points:** Email already exists (RG), Required fields missing (OA)

---

### Flow 2: Sponsor Pledge Flow

**Preconditions:** Sponsor has invite link

**Steps:**
1. `/f/:userId` → Redirect to `/sponsor/auth` if not authenticated
2. `/sponsor/auth` → Enter email → Magic link or password
3. `/f/:userId` → Select children → Choose amount → Select payment → Submit
4. `/sponsor/pledged` → Confirmation

**Data created:** Sponsor profile (if new), Pledge(s)

**Failure points:** Invalid link (FS), Auth failure

---

### Flow 3: Student Reading Log

**Preconditions:** Student has username/password set up by parent

**Steps:**
1. `/student/login` → SL-3 "Start Reading!" → `/student/dashboard`
2. `/student/dashboard` → SD-2 "Log My Reading!" → Modal opens
3. Modal → Set minutes → Select book (optional) → SD-6 Submit
4. Modal closes, list updates with new entry

**Data created:** Reading log

**Failure points:** Invalid credentials (SL-3), Log creation failure

---

### Flow 4: Parent Reading Log

**Preconditions:** Parent logged in, has children, event active

**Steps:**
1. `/dashboard` → DB-4 "Log Reading" → `/log-reading`
2. `/log-reading` → Select child → Set date/minutes/book → LR-7 Submit
3. Success card shows → Form resets

**Data created:** Reading log, child.total_minutes updated

**Failure points:** Event not active, validation errors

---

### Flow 5: Admin Payment Collection

**Preconditions:** Admin logged in, outstanding pledges exist

**Steps:**
1. `/admin` → AD-4 Alert card or AD-8 "View All" → `/admin/outstanding`
2. `/admin/outstanding` → Select pledges → "Send Reminders"
3. Or: → Click pledge → "Mark as Paid" → Enter payment details
4. Payment recorded, pledge status updated

**Data created:** Payment record, pledge.is_paid = true

---

## 6) Open Questions / Unknowns (RESOLVED)

### Payment Processing (CONFIRMED)

| Item | Status | Details |
|---|---|---|
| Square Integration | **NEEDS IMPLEMENTATION** | Currently mock. **REQUIRED:** Real Square API integration for card processing. Form fields: cardholder name, card number (16 digits), expiry (MM/YY), CVC (3-4 digits), ZIP code (5 digits). |
| Payment form fields | **CONFIRMED** | SponsorPaymentPage and GuestPaymentPage use identical card form: cardName, cardNumber, expiryDate, cvc, zipCode |
| Check payments | **CONFIRMED** | Uses `event.payment_address` from database for mailing instructions |

### SponsorPaymentPage (CONFIRMED)

- **Card form fields:** Cardholder Name, Card Number (formatted 4-4-4-4), Expiry (MM/YY), CVC (3-4 digits), ZIP Code (5 digits)
- **Validation:** 16 digit card, 5 char expiry, 3+ char CVC, non-empty name, 5+ char ZIP
- **Payment method toggle:** Card vs Check (2 buttons)
- **Pledge selection:** Checkbox list of unpaid pledges, shows child name + amount, calculates total
- **Loading state:** "Processing..." on submit button
- **Success state:** Shows "Thank You!" with amount received, "Back to Dashboard" button

### GuestPaymentPage (CONFIRMED)

- **Token-based auth:** Uses `payment_token` UUID from `class_pledges` table (auto-generated on pledge creation)
- **URL format:** `/sponsor/guest-pay?token=<uuid>`
- **Error states:** Invalid token, pledge not found, already paid
- **No authentication required** - public access via token
- **Updates both:** `payments` table and `class_pledges.is_paid` status

### AdminEmailPage (CONFIRMED)

**Available email template variables:**
| Variable | Description |
|---|---|
| `{{sponsor_name}}` | Sponsor's full name |
| `{{sponsor_first_name}}` | Sponsor's first name |
| `{{student_name}}` | Student's name |
| `{{student_first_name}}` | Student's first name |
| `{{pledge_amount}}` | Pledge amount (e.g., $50 or $0.05/min) |
| `{{total_owed}}` | Total amount owed |
| `{{minutes_read}}` | Total minutes read |
| `{{goal_minutes}}` | Reading goal in minutes |
| `{{progress_percent}}` | Progress percentage |
| `{{payment_link}}` | Link to payment page |
| `{{event_name}}` | Event name |
| `{{school_name}}` | School name |
| `{{days_remaining}}` | Days until event ends |

**Recipient filter options:**
- all_sponsors, unpaid_sponsors, overdue_sponsors (7+ days), check_sponsors, all_parents, all_teachers, inactive_students

### AdminSettingsPage (CONFIRMED)

**Configurable event fields:**
| Section | Fields |
|---|---|
| Event Details | name, school_name, start_date, end_date, last_log_date, goal_minutes, timezone |
| Payment Settings | payment_address (textarea), accept_cards (switch), accept_checks (switch) |
| Email Settings | send_reminders (switch), reminder_days (number) |
| Class Milestone | class_milestone_enabled (switch), class_milestone_goal (number), class_milestone_reward (text) |
| Teacher Logging | teacher_logging_grades (multi-select checkboxes from available grades) |
| Log Verification | log_verification_enabled, log_verification_thresholds (via LogVerificationSettings component) |
| Logo Generator | LogoGenerator component for generating event logo with date overlay |

**Timezone options:** Eastern, Central, Mountain, Pacific, Alaska, Hawaii (US only)

### VerifyLogsPage (CONFIRMED)

**Approval workflow:**
1. Parent navigates to `/reading-logs/approve`
2. Table shows pending logs with columns: Student, Book, Minutes, Date, Source (Student/Parent/Teacher)
3. Flagged entries (high minutes) highlighted in amber with AlertTriangle icon
4. **Actions per row:** Approve (green checkmark), Reject (red X)
5. **Bulk actions:** Select via checkboxes → "Approve (N)" / "Reject" buttons
6. **Confirmation dialog:** AlertDialog confirms action with log details
7. **Filter options:** All Logs, Flagged Only, By Student, By Parent
8. **Success:** Logs removed from list, toast notification

**Flag criteria:** Logs with unusually high minutes (threshold configured in event settings)

### TeacherLogReading (CONFIRMED)

**UI modes:**
1. **Single Student Mode:** Select dropdown → shows student progress ring → set minutes
2. **Bulk Mode:** Toggle switch → checkbox grid (2 columns) of all students → Select All/None buttons

**Form fields:**
- Student selection (single or multi-select)
- Date: Today / Yesterday toggle buttons
- Minutes: +/- buttons (5 min increments), direct input, quick buttons (15, 20, 30, 45 min)
- Activity Note (optional textarea): e.g., "Classroom read-aloud, Silent reading time"

**Permission checks:**
- Phase-based: Only during active reading period (`canTeachersLog`)
- Grade-based: Only if teacher's grade is in `event.teacher_logging_grades[]`

**Blocking UI states:**
- pre_event: "Reading Starts Soon" with start date
- grace_period: "Reading Period Ended" - teachers blocked, parents can still log
- closed: "Read-a-thon Complete"

### BottomTabBar (CONFIRMED)

| Role | Tab 1 | Tab 2 | Tab 3 | Tab 4 |
|---|---|---|---|---|
| Parent | Home (/dashboard) | Children (/family/manage) | Pledges (/my-pledges) | Profile (/account) |
| Student | Home (/student) | Log Reading (/student/log) | Sponsors (/student) | Profile (/student) |
| Teacher | Home (/teacher) | Students (/teacher) | Log (/teacher/log) | Profile (/teacher) |
| Sponsor | Home (/sponsor/dashboard) | Pledges (/my-pledges) | Payments (/sponsor/pay) | Account (/account) |
| Admin | Dashboard (/admin) | Users (/admin-users) | Finance (/admin-finance) | Settings (/admin/settings) |

### ReEnrollmentPage (CONFIRMED)

**Flow:**
1. Shows returning parent's name, event name
2. Lists previous children with: name, previous grade/teacher, checkbox to enroll
3. For each selected child: grade dropdown (auto-advances one grade), teacher dropdown (filtered by grade)
4. Reading goal input: quick buttons (300, 500, 750, 1000) + custom input
5. "Add a new child" link to /onboarding/add-child
6. Enroll button validates: at least one child selected, all have grade + teacher set
7. **After enrollment:** Dialog offers to re-invite previous sponsors
8. Sponsor list: checkboxes with name, relationship, email, previous pledge amount
9. "Send Invitations" or "Skip for now" → navigates to /dashboard

### ForgotPasswordPage (NEEDS IMPLEMENTATION)

**Current Flow (incomplete):**
1. Email input form with validation
2. Submit triggers: sets `isSubmitted = true` (currently no actual API call)
3. Success state: Shows "Check Your Email" with submitted email, "try again" button
4. Links: "Back to Sign In" (/login)

**ACTION REQUIRED:** Implement Supabase Auth password reset using `supabase.auth.resetPasswordForEmail()`. Should send reset link via email.

### Demo Mode (TO BE REMOVED)

LoginPage currently contains demo buttons:
- "Demo Parent", "Demo Student", "Demo Teacher", "Demo Sponsor", "Demo Admin"
- Each navigates directly to respective dashboard without auth

**ACTION REQUIRED:** Remove demo login functionality entirely from codebase (not just hide).

### Event End Behavior (NEEDS ENHANCEMENT)

**Current behavior:**
1. Confirmation dialog appears
2. `endEvent(id)` sets `is_active = false` on events table
3. Toast: "Event has been ended. Payment collection emails will be sent."
4. Teachers see "Read-a-thon Complete" blocking UI
5. Parents see grace_period or closed state depending on dates
6. Currently no automatic email sending

**ACTION REQUIRED:** Admin should configure auto-send setting with template selection. When event ends:
- If auto-send enabled: Send selected template to configured recipients
- If auto-send disabled: Admin manually sends via AdminEmailPage
- Add event setting: `auto_send_on_end` (boolean) + `end_event_template_id` (FK to email_templates)

### Outstanding Admin Pages (CONFIRMED)

**AdminOutstandingPage:**
- Fetches unpaid pledges with sponsor/child info
- Table columns: Sponsor (name + email), Student (name + grade), Type (badge), Amount, Days Outstanding, Last Reminder, Actions
- Filter options: All Outstanding, Overdue (7+ days), No Reminder Sent, Large Pledges (>$1,500)
- Bulk select → "Send Reminders" calls `sendPaymentReminders()`
- Individual row "Send Reminder" button
- Export button (mock - just toast)

**AdminChecksPage:**
- Uses mock data (not connected to database)
- Summary cards: Pending, Received, Bounced counts
- Table columns: Sponsor, Student, Amount, Pledge Date, Status, Notes, Actions
- Actions for pending: Mark Received (green check), Mark Bounced (red X)
- Actions for bounced: Send Reminder (mail icon)
- Dialog for confirm action with optional notes
- Shows hardcoded mailing address (not from event settings)
