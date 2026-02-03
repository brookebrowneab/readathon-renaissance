# MIGRATION MAP

Generated: 2026-02-03

**Related Documentation:** [Edge Functions API Reference](./EDGE_FUNCTIONS_API.md)

---

## Table of Contents

- [Edge Functions API Reference](./EDGE_FUNCTIONS_API.md)
- [0) App Overview](#0-app-overview-factual)
- [1) Route / Page Inventory](#1-route--page-inventory)
- [2) Shared Components Inventory](#2-shared-components-inventory)
- [3) Data Entities Observed (UI-level)](#3-data-entities-observed-ui-level)
- [4) Page-by-Page Specs](#4-page-by-page-specs)
  - [HomePage](#homepage-route-)
  - [LoginPage](#loginpage-route-login)
  - [RegisterPage](#registerpage-route-register)
  - [DashboardPage](#dashboardpage-route-dashboard)
  - [StudentPinLoginPage](#studentpinloginpage-route-studentlogin)
  - [StudentPinDashboardPage](#studentpindashboardpage-route-studentdashboard)
  - [TeacherDashboard](#teacherdashboard-route-teacher)
  - [AdminDashboard](#admindashboard-route-admin)
  - [OnboardingAddChild](#onboardingaddchild-route-onboardingadd-child)
  - [LogReadingPage](#logreadingpage-route-log-reading)
  - [FamilySponsorPage](#familysponsorpage-route-fuserid)
  - [ManageChildrenPage](#managechildrenpage-route-children-or-familymanage)
- [5) Cross-Page Flows](#5-cross-page-flows-end-to-end)
  - [Flow 1: Parent Registration & Onboarding](#flow-1-parent-registration--onboarding)
  - [Flow 2: Sponsor Pledge Flow](#flow-2-sponsor-pledge-flow)
  - [Flow 3: Student Reading Log](#flow-3-student-reading-log)
  - [Flow 4: Parent Reading Log](#flow-4-parent-reading-log)
  - [Flow 5: Admin Payment Collection](#flow-5-admin-payment-collection)
- [6) Open Questions / Unknowns (RESOLVED)](#6-open-questions--unknowns-resolved)
  - [Payment Processing](#payment-processing-confirmed)
  - [SponsorPaymentPage](#sponsorpaymentpage-confirmed)
  - [GuestPaymentPage](#guestpaymentpage-confirmed)
  - [AdminEmailPage](#adminemailpage-confirmed)
  - [AdminSettingsPage](#adminsettingspage-confirmed)
  - [VerifyLogsPage](#verifylogspage-confirmed)
  - [TeacherLogReading](#teacherlogreading-confirmed)
  - [BottomTabBar](#bottomtabbar-confirmed)
  - [ReEnrollmentPage](#reenrollmentpage-confirmed)
  - [ForgotPasswordPage](#forgotpasswordpage-needs-implementation)
  - [Demo Mode](#demo-mode-to-be-removed)
  - [Event End Behavior](#event-end-behavior-needs-enhancement)
  - [Outstanding Admin Pages](#outstanding-admin-pages-confirmed)

---

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| HP-LOAD-001 | getActiveEvent | GET | /events?is_active=true | N | - | - | `{"id":"uuid","name":"Spring Read-a-thon","start_date":"2024-01-15","end_date":"2024-02-28","goal_minutes":500}` | NOT_FOUND |
| HP-LOAD-002 | getSiteContent | GET | /site_content | N | - | - | `[{"key":"hero_headline","value":"Read-a-thon Time!"},{"key":"stats_minutes","value":"45000"}]` | - |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| LG-4 | signIn | POST | /auth/token | N | - | `{"email":"user@example.com","password":"secret123"}` | `{"access_token":"jwt","refresh_token":"jwt","user":{"id":"uuid","email":"user@example.com"}}` | UNAUTHORIZED ("Invalid login credentials") |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| RG-8 | signUp | POST | /auth/signup | N | - | `{"email":"user@example.com","password":"Secret123!","data":{"display_name":"Jane Doe","phone":"555-1234"}}` | `{"access_token":"jwt","user":{"id":"uuid","email":"user@example.com"}}` | CONFLICT ("User already registered"), VALIDATION_ERROR |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| DB-LOAD-001 | getProfile | GET | /profiles?user_id=eq.{user_id} | Y | Parent | - | `{"id":"uuid","display_name":"Jane Doe"}` | NOT_FOUND |
| DB-LOAD-002 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"class_name":"Mrs. Smith","grade_info":"3rd"}]` | - |
| DB-LOAD-003 | listPledgesByChild | GET | /pledges?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","child_id":"uuid","amount":50,"pledge_type":"flat","is_paid":false,"sponsor":{"name":"Uncle Bob"}}]` | - |
| DB-LOAD-004 | listReadingLogsByChild | GET | /reading_logs?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}]` | - |
| DB-LOAD-005 | getClassTotalMinutes | GET | /rpc/get_class_total_minutes?p_class_name={class} | Y | Parent | - | `5240` | - |
| DB-LOAD-006 | getGradeTotalMinutes | GET | /rpc/get_grade_total_minutes?p_grade_info={grade} | Y | Parent | - | `12450` | - |
| DB-LOAD-007 | getActiveEvent | GET | /events?is_active=true | Y | Parent | - | `{"id":"uuid","class_milestone_enabled":true,"class_milestone_goal":1000,"class_milestone_reward":"Pizza party"}` | - |
| DB-LOAD-008 | getClassFundraisingTotals | GET | /rpc/get_class_fundraising_total?p_class_name={class} | Y | Parent | - | `750.00` | - |
| DB-1 | signOut | POST | /auth/logout | Y | Parent | - | - | - |
| DB-6 | updatePledge | PATCH | /pledges/:id | Y | Parent | `{"amount":75,"pledge_type":"flat"}` | `{"id":"uuid","amount":75}` | NOT_FOUND, FORBIDDEN |
| DB-7 | deletePledge | DELETE | /pledges/:id | Y | Parent | - | - | NOT_FOUND, FORBIDDEN |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SL-3 | studentLogin | POST | /functions/student-login | N | - | `{"username":"emma_s","password":"read123"}` | `{"success":true,"child":{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"grade_info":"3rd","class_name":"Mrs. Smith"}}` | UNAUTHORIZED ("Login failed"), VALIDATION_ERROR |
| SL-5 | studentForgotPassword | POST | /functions/student-forgot-password | N | - | `{"username":"emma_s"}` | `{"success":true}` | NOT_FOUND, RATE_LIMITED |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SD-LOAD-001 | getStudentData | GET | /me/student | Y* | Student | - | `{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500}` | UNAUTHORIZED |
| SD-LOAD-002 | getStudentReadingLogs | GET | /me/student/reading-logs | Y* | Student | - | `[{"id":"uuid","minutes":30,"book_title":"Charlotte's Web","logged_at":"2024-02-01"}]` | - |
| SD-LOAD-003 | getClassReadingStats | GET | /rpc/get_class_reading_stats?p_class_name=Mrs.+Smith | Y* | Student | - | `{"total_minutes":5240,"total_books":45,"student_count":22}` | - |
| SD-LOAD-004 | getGradeTotalMinutes | GET | /rpc/get_grade_total_minutes?p_grade_info=3rd | Y* | Student | - | `12450` | - |
| SD-LOAD-005 | getClassFavoriteBooks | GET | /rpc/get_class_favorite_books?p_class_name=Mrs.+Smith | Y* | Student | - | `[{"book_title":"Dog Man","read_count":12}]` | - |
| SD-LOAD-006 | getGradeFavoriteBooks | GET | /rpc/get_grade_favorite_books?p_grade_info=3rd | Y* | Student | - | `[{"book_title":"Diary of a Wimpy Kid","read_count":28}]` | - |
| SD-6 | createReadingLog | POST | /reading_logs | Y* | Student | `{"child_id":"uuid","student_name":"Emma S","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}` | `{"id":"uuid","minutes":30,...}` | VALIDATION_ERROR, FORBIDDEN |
| SD-7 | updateReadingLog | PATCH | /reading_logs/:id | Y* | Student | `{"minutes":45,"book_title":"Updated Title"}` | `{"id":"uuid","minutes":45,...}` | NOT_FOUND, FORBIDDEN |
| SD-8 | deleteReadingLog | DELETE | /reading_logs/:id | Y* | Student | - | - | NOT_FOUND, FORBIDDEN |

*Note: Student auth uses sessionStorage, not Supabase Auth

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TD-LOAD-001 | getTeacherProfile | GET | /teachers?user_id=eq.{user_id}&is_active=eq.true | Y | Teacher | - | `{"id":"uuid","name":"Mrs. Smith","teacher_type":"homeroom","grade_level":"3rd","has_full_access":false}` | NOT_FOUND |
| TD-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Teacher | - | `{"id":"uuid","name":"Spring Read-a-thon","teacher_logging_grades":["K","1st","2nd"]}` | - |
| TD-LOAD-003 | listTeacherStudents | GET | /children?homeroom_teacher_id=eq.{teacher_id} | Y | Teacher | - | `[{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"grade_info":"3rd","class_name":"Mrs. Smith"}]` | - |
| TD-LOAD-004 | getStudentReadingLogs | GET | /reading_logs?child_id=in.(...) | Y | Teacher | - | `[{"id":"uuid","child_id":"uuid","logged_at":"2024-02-01"}]` | - |
| TD-1 | signOut | POST | /auth/logout | Y | Teacher | - | - | - |
| TD-8 | exportStudentReport | GET | /reports/students?format=csv | Y | Teacher | - | CSV file | INTERNAL |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AD-LOAD-001 | getActiveEvent | GET | /events?is_active=true | Y | Admin | - | `{"id":"uuid","name":"Spring Read-a-thon","start_date":"...","end_date":"..."}` | - |
| AD-LOAD-002 | getAdminMetrics | GET | /admin/metrics | Y | Admin | - | `{"studentsEnrolled":150,"totalMinutes":45000,"totalPledged":5000,"totalCollected":3500}` | - |
| AD-LOAD-003 | listOutstandingPledges | GET | /pledges?is_paid=eq.false&limit=5 | Y | Admin | - | `[{"id":"uuid","sponsor":{"name":"Uncle Bob"},"amount":50,"created_at":"..."}]` | - |
| AD-LOAD-004 | listRecentActivity | GET | /admin/activity?limit=10 | Y | Admin | - | `[{"type":"pledge","message":"Uncle Bob pledged $50","time":"2 hours ago"}]` | - |
| AD-LOAD-005 | getAlerts | GET | /admin/alerts | Y | Admin | - | `[{"id":"outstanding","count":12,"label":"Outstanding payments","link":"/admin/outstanding"}]` | - |
| AD-1 | sendBulkReminders | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeIds":["uuid1","uuid2"]}` | `{"sent":2,"failed":0}` | INTERNAL |
| AD-2 | exportStudentsReport | GET | /admin/reports/students?format=csv | Y | Admin | - | CSV file | INTERNAL |
| AD-3 | exportPledgesReport | GET | /admin/reports/pledges?format=csv | Y | Admin | - | CSV file | INTERNAL |
| AD-4 | exportPaymentsReport | GET | /admin/reports/payments?format=csv | Y | Admin | - | CSV file | INTERNAL |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| OA-LOAD-001 | listTeachers | GET | /teachers?is_active=eq.true&teacher_type=eq.homeroom | Y | Parent | - | `[{"id":"uuid","name":"Mrs. Smith","grade_level":"3rd"}]` | - |
| OA-LOAD-002 | listAvailableGrades | GET | /children?select=grade_info | Y | Parent | - | `["K","1st","2nd","3rd","4th","5th"]` | - |
| OA-10 | createChild | POST | /children | Y | Parent | `{"name":"Emma Smith","grade_info":"3rd","class_name":"Mrs. Smith","goal_minutes":500,"homeroom_teacher_id":"uuid","share_public_link":true}` | `{"id":"uuid",...}` | VALIDATION_ERROR, CONFLICT |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| LR-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500}]` | - |
| LR-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Parent | - | `{"id":"uuid","start_date":"...","end_date":"...","last_log_date":"..."}` | - |
| LR-LOAD-003 | listChildReadingLogs | GET | /reading_logs?child_id=eq.{id}&order=logged_at.desc | Y | Parent | - | `[{"id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}]` | - |
| LR-7 | createReadingLog | POST | /reading_logs | Y | Parent | `{"child_id":"uuid","student_name":"Emma S","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01","event_id":"uuid"}` | `{"id":"uuid",...}` | VALIDATION_ERROR, FORBIDDEN |
| LR-9 | updateReadingLog | PATCH | /reading_logs/:id | Y | Parent | `{"minutes":45,"book_title":"Updated Book"}` | `{"id":"uuid",...}` | NOT_FOUND, FORBIDDEN |
| LR-10 | deleteReadingLog | DELETE | /reading_logs/:id | Y | Parent | - | - | NOT_FOUND, FORBIDDEN |

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

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| FS-LOAD-001 | listFamilyChildren | GET | /children_public_safe?user_id=eq.{userId}&share_public_link=eq.true | N | - | - | `[{"id":"uuid","display_name":"Emma S.","grade_info":"3rd","total_minutes":247}]` | - |
| FS-LOAD-002 | getActiveEvent | GET | /events?is_active=true | N | - | - | `{"id":"uuid","name":"Spring Read-a-thon","end_date":"2024-02-28"}` | - |
| FS-LOAD-003 | getSponsorProfile | GET | /sponsors?user_id=eq.{user_id} | Y | Sponsor | - | `{"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}` | - |
| FS-12 | createPledges | POST | /pledges | Y | Sponsor | `[{"child_id":"uuid1","amount":50,"pledge_type":"flat"},{"child_id":"uuid2","amount":50,"pledge_type":"flat"}]` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR |
| FS-13 | signOut | POST | /auth/logout | Y | Sponsor | - | - | - |

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

#### 4.7 Permissions & Role Gating
- Requires parent authentication
- Can only view/edit own children

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| MC-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","grade_info":"3rd","class_name":"Mrs. Smith","goal_minutes":500,"total_minutes":247}]` | - |
| MC-LOAD-002 | listReadingLogsByChild | GET | /reading_logs?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","minutes":30,"logged_at":"2024-02-01"}]` | - |
| MC-4 | updateChild | PATCH | /children/:id | Y | Parent | `{"name":"Emma Smith","grade_info":"4th","goal_minutes":600}` | `{"id":"uuid",...}` | NOT_FOUND, VALIDATION_ERROR |
| MC-5 | deleteChild | DELETE | /children/:id | Y | Parent | - | - | NOT_FOUND, CONFLICT |

---

### Additional Page API Actions (Appendix)

The following pages are listed in the Route Inventory but do not have full 4.x specs. Their API actions are documented here for completeness.

---

#### AboutPage (Route: `/about`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AB-LOAD-001 | getSiteContent | GET | /site_content | N | - | - | `[{"key":"about_text","value":"..."}]` | - |

---

#### HowItWorksPage (Route: `/how-it-works`) - 4.8 API ACTIONS

No API actions (static page).

---

#### FAQPage (Route: `/faq`) - 4.8 API ACTIONS

No API actions (static page).

---

#### PrivacyPage (Route: `/privacy`) - 4.8 API ACTIONS

No API actions (static page).

---

#### ForgotPasswordPage (Route: `/forgot-password`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| FP-1 | sendPasswordReset | POST | /auth/recovery | N | - | `{"email":"user@example.com"}` | `{"message":"Password reset email sent"}` | NOT_FOUND, RATE_LIMITED |

---

#### AdminLoginPage (Route: `/admin/login`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AL-1 | signIn | POST | /auth/token | N | - | `{"email":"admin@example.com","password":"secret123"}` | `{"access_token":"jwt","user":{...}}` | UNAUTHORIZED |
| AL-2 | checkAdminRole | GET | /me/roles | Y | - | - | `{"roles":["admin"]}` | FORBIDDEN |

---

#### StudentBooksPage (Route: `/student/books`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SB-LOAD-001 | getStudentBooks | GET | /me/student/books | Y* | Student | - | `[{"id":"uuid","title":"Dog Man","author":"Dav Pilkey","cover_url":"..."}]` | UNAUTHORIZED |

---

#### StudentLogReadingPage (Route: `/student/log`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SLR-LOAD-001 | getActiveEvent | GET | /events?is_active=true | Y* | Student | - | `{"id":"uuid","start_date":"...","end_date":"...","last_log_date":"..."}` | - |
| SLR-1 | createReadingLog | POST | /reading_logs | Y* | Student | `{"child_id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |

---

#### TeacherLoginPage (Route: `/teacher/login`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TL-1 | signIn | POST | /auth/token | N | - | `{"email":"teacher@school.edu","password":"secret123"}` | `{"access_token":"jwt",...}` | UNAUTHORIZED |
| TL-2 | linkTeacherAccount | POST | /functions/link-teacher-account | Y | - | - | `{"teacher":{"id":"uuid","name":"Mrs. Smith"},"linked":true}` | FORBIDDEN |

---

#### TeacherRegisterPage (Route: `/teacher/register`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TR-1 | signUp | POST | /auth/signup | N | - | `{"email":"teacher@school.edu","password":"Secret123!"}` | `{"access_token":"jwt",...}` | CONFLICT |
| TR-2 | linkTeacherAccount | POST | /functions/link-teacher-account | Y | - | - | `{"teacher":{"id":"uuid"},"linked":true}` | NOT_FOUND |

---

#### TeacherSetPasswordPage (Route: `/teacher/set-password`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TSP-1 | setPassword | POST | /functions/student-set-password | N | - | `{"token":"abc123","password":"NewPass123!"}` | `{"success":true}` | VALIDATION_ERROR, NOT_FOUND |

---

#### TeacherLogReading (Route: `/teacher/log`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TLR-LOAD-001 | listTeacherStudents | GET | /children?homeroom_teacher_id=eq.{teacher_id} | Y | Teacher | - | `[{"id":"uuid","name":"Emma S","total_minutes":247}]` | - |
| TLR-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Teacher | - | `{"id":"uuid","teacher_logging_grades":["K","1st"]}` | - |
| TLR-1 | createBulkReadingLogs | POST | /reading_logs | Y | Teacher | `[{"child_id":"uuid1","minutes":30},{"child_id":"uuid2","minutes":30}]` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR, FORBIDDEN |

---

#### ChildDetailsPage (Route: `/children/:id`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| CD-LOAD-001 | getChild | GET | /children/:id | Y | Parent | - | `{"id":"uuid","name":"Emma S","grade_info":"3rd","student_username":"emma_s","student_login_enabled":true}` | NOT_FOUND, FORBIDDEN |
| CD-LOAD-002 | listTeachers | GET | /teachers?is_active=eq.true | Y | Parent | - | `[{"id":"uuid","name":"Mrs. Smith","grade_level":"3rd"}]` | - |
| CD-LOAD-003 | getChildReadingLogs | GET | /reading_logs?child_id=eq.{id} | Y | Parent | - | `[{"id":"uuid","minutes":30,"logged_at":"2024-02-01"}]` | - |
| CD-1 | updateChild | PATCH | /children/:id | Y | Parent | `{"grade_info":"4th","homeroom_teacher_id":"uuid","goal_minutes":600,"share_public_link":false}` | `{"id":"uuid",...}` | NOT_FOUND, VALIDATION_ERROR |
| CD-2 | updateStudentCredentials | PATCH | /children/:id | Y | Parent | `{"student_username":"emma_smith","student_login_enabled":true}` | `{"id":"uuid",...}` | CONFLICT ("Username taken") |
| CD-3 | setStudentPassword | POST | /functions/student-set-password | Y | Parent | `{"child_id":"uuid","password":"read123"}` | `{"success":true}` | VALIDATION_ERROR |

---

#### InviteSponsorsPage (Route: `/children/:id/invite`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| IS-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S"}]` | - |
| IS-LOAD-002 | listSponsorInvitations | GET | /sponsor_invitations?child_id=eq.{id} | Y | Parent | - | `[{"id":"uuid","invitee_email":"grandma@email.com","status":"pending"}]` | - |
| IS-1 | createSponsorInvitation | POST | /sponsor_invitations | Y | Parent | `{"child_id":"uuid","invitee_email":"uncle@email.com","can_invite_others":false}` | `{"id":"uuid",...}` | CONFLICT, VALIDATION_ERROR |
| IS-2 | deleteSponsorInvitation | DELETE | /sponsor_invitations/:id | Y | Parent | - | - | NOT_FOUND |
| IS-3 | resendInvitation | POST | /functions/send-pledge-notification | Y | Parent | `{"invitation_id":"uuid"}` | `{"success":true}` | NOT_FOUND, RATE_LIMITED |

---

#### MyPledgesPage (Route: `/my-pledges`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| MP-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","total_minutes":247}]` | - |
| MP-LOAD-002 | listPledges | GET | /pledges?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","amount":50,"pledge_type":"flat","is_paid":false,"sponsor":{"name":"Uncle Bob"}}]` | - |
| MP-LOAD-003 | listPayments | GET | /payments?payer_user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","amount":50,"pledge_id":"uuid","square_receipt_url":"https://..."}]` | - |
| MP-1 | updatePledge | PATCH | /pledges/:id | Y | Parent | `{"amount":75,"pledge_type":"per_minute"}` | `{"id":"uuid",...}` | NOT_FOUND, FORBIDDEN |
| MP-2 | deletePledge | DELETE | /pledges/:id | Y | Parent | - | - | NOT_FOUND, FORBIDDEN |

---

#### VerifyLogsPage (Route: `/reading-logs/approve`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| VL-LOAD-001 | listVerificationRequests | GET | /log_verification_requests?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","reading_log_id":"uuid","minutes":120,"status":"pending","child":{"name":"Emma S"}}]` | - |
| VL-1 | approveLog | PATCH | /log_verification_requests/:id | Y | Parent | `{"status":"approved","reviewed_by":"{user_id}","reviewed_at":"2024-02-01T12:00:00Z"}` | `{"id":"uuid","status":"approved"}` | NOT_FOUND, FORBIDDEN |
| VL-2 | rejectLog | PATCH | /log_verification_requests/:id | Y | Parent | `{"status":"rejected","reviewed_by":"{user_id}","reviewed_at":"2024-02-01T12:00:00Z"}` | `{"id":"uuid","status":"rejected"}` | NOT_FOUND, FORBIDDEN |
| VL-3 | bulkApprove | PATCH | /log_verification_requests | Y | Parent | `{"ids":["uuid1","uuid2"],"status":"approved"}` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR |
| VL-4 | bulkReject | PATCH | /log_verification_requests | Y | Parent | `{"ids":["uuid1","uuid2"],"status":"rejected"}` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR |

---

#### AccountSettingsPage (Route: `/account`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AS-LOAD-001 | getProfile | GET | /profiles?user_id=eq.{user_id} | Y | Parent | - | `{"id":"uuid","display_name":"Jane Doe","phone":"555-1234"}` | NOT_FOUND |
| AS-LOAD-002 | getUser | GET | /me | Y | Parent | - | `{"id":"uuid","email":"jane@example.com"}` | UNAUTHORIZED |
| AS-1 | updateProfile | PATCH | /profiles/:id | Y | Parent | `{"display_name":"Jane Smith","phone":"555-5678"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| AS-2 | updatePassword | POST | /auth/user | Y | Parent | `{"password":"NewPassword123!"}` | `{"success":true}` | VALIDATION_ERROR |
| AS-3 | signOut | POST | /auth/logout | Y | Parent | - | - | - |

---

#### SponsorRequestsPage (Route: `/family/sponsor-requests`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SR-LOAD-001 | listSponsorInvitations | GET | /sponsor_invitations?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","invitee_email":"sponsor@email.com","status":"pending","child":{"name":"Emma S"}}]` | - |
| SR-1 | approveInvitation | PATCH | /sponsor_invitations/:id | Y | Parent | `{"status":"approved"}` | `{"id":"uuid","status":"approved"}` | NOT_FOUND |
| SR-2 | rejectInvitation | PATCH | /sponsor_invitations/:id | Y | Parent | `{"status":"rejected"}` | `{"id":"uuid","status":"rejected"}` | NOT_FOUND |

---

#### SponsorMyChildPage (Route: `/family/sponsor-my-child`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SMC-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S"}]` | - |
| SMC-1 | createPledge | POST | /pledges | Y | Parent | `{"child_id":"uuid","student_name":"Emma S","amount":50,"pledge_type":"flat","expected_payment_method":"card"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |

---

#### OnboardingPledge (Route: `/onboarding/pledge`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| OP-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S"}]` | - |
| OP-1 | createPledge | POST | /pledges | Y | Parent | `{"child_id":"uuid","student_name":"Emma S","amount":50,"pledge_type":"flat","expected_payment_method":"card"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |

---

#### OnboardingComplete (Route: `/onboarding/complete`) - 4.8 API ACTIONS

No API actions (static success page).

---

#### ReEnrollmentPage (Route: `/onboarding/re-enroll`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| RE-LOAD-001 | getProfile | GET | /profiles?user_id=eq.{user_id} | Y | Parent | - | `{"display_name":"Jane Doe"}` | - |
| RE-LOAD-002 | listPreviousChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","grade_info":"3rd"}]` | - |
| RE-LOAD-003 | listTeachers | GET | /teachers?is_active=eq.true | Y | Parent | - | `[{"id":"uuid","name":"Mrs. Smith","grade_level":"4th"}]` | - |
| RE-LOAD-004 | listPreviousSponsors | GET | /pledges?child_id=in.(...)&select=sponsor(*) | Y | Parent | - | `[{"sponsor":{"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}}]` | - |
| RE-1 | updateChildren | PATCH | /children | Y | Parent | `[{"id":"uuid","grade_info":"4th","homeroom_teacher_id":"uuid","goal_minutes":500}]` | `[{"id":"uuid",...}]` | VALIDATION_ERROR |
| RE-2 | sendSponsorReInvites | POST | /functions/send-pledge-notification | Y | Parent | `{"sponsor_ids":["uuid1","uuid2"],"child_ids":["uuid"]}` | `{"sent":2}` | RATE_LIMITED |

---

#### SponsorGatewayPage (Route: `/sponsor`) - 4.8 API ACTIONS

No API actions (static gateway page with navigation links).

---

#### SponsorLandingPage (Route: `/sponsor/:childId`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SLP-LOAD-001 | getPublicChild | GET | /children_public_safe?id=eq.{childId} | N | - | - | `{"id":"uuid","display_name":"Emma S.","grade_info":"3rd","total_minutes":247,"goal_minutes":500}` | NOT_FOUND |

---

#### SponsorAuthPage (Route: `/sponsor/auth`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SA-1 | sendMagicLink | POST | /auth/magiclink | N | - | `{"email":"sponsor@email.com"}` | `{"message":"Magic link sent"}` | RATE_LIMITED |
| SA-2 | checkExistingUser | GET | /auth/user?email={email} | N | - | - | `{"exists":true}` | - |

---

#### SponsorLoginPage (Route: `/sponsor/login`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SLG-1 | signIn | POST | /auth/token | N | - | `{"email":"sponsor@email.com","password":"secret123"}` | `{"access_token":"jwt",...}` | UNAUTHORIZED |

---

#### SponsorCheckEmailPage (Route: `/sponsor/check-email`) - 4.8 API ACTIONS

No API actions (static instruction page).

---

#### SponsorDashboardPage (Route: `/sponsor/dashboard`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SPD-LOAD-001 | getSponsorProfile | GET | /sponsors?user_id=eq.{user_id} | Y | Sponsor | - | `{"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}` | NOT_FOUND |
| SPD-LOAD-002 | listSponsorPledges | GET | /pledges?sponsor_id=eq.{sponsor_id} | Y | Sponsor | - | `[{"id":"uuid","child":{"name":"Emma S","total_minutes":247},"amount":50,"is_paid":false}]` | - |
| SPD-LOAD-003 | listSponsorClassPledges | GET | /class_pledges?sponsor_user_id=eq.{user_id} | Y | Sponsor | - | `[{"id":"uuid","class_name":"Mrs. Smith","amount":100,"is_paid":false,"teacher":{"name":"Mrs. Smith"}}]` | - |
| SPD-LOAD-004 | getActiveEvent | GET | /events?is_active=true | Y | Sponsor | - | `{"id":"uuid","class_milestone_goal":1000,"class_milestone_reward":"Pizza party"}` | - |
| SPD-LOAD-005 | getClassFundraisingTotal | GET | /rpc/get_class_fundraising_total?p_class_name={class} | Y | Sponsor | - | `750.00` | - |
| SPD-1 | updateSponsorProfile | PATCH | /sponsors/:id | Y | Sponsor | `{"name":"Robert Smith","phone":"555-1234"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| SPD-2 | signOut | POST | /auth/logout | Y | Sponsor | - | - | - |

---

#### SponsorPaymentPage (Route: `/sponsor/pay`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SPP-LOAD-001 | listUnpaidPledges | GET | /pledges?sponsor_id=eq.{sponsor_id}&is_paid=eq.false | Y | Sponsor | - | `[{"id":"uuid","child":{"name":"Emma S"},"amount":50}]` | - |
| SPP-LOAD-002 | getSponsorProfile | GET | /sponsors?user_id=eq.{user_id} | Y | Sponsor | - | `{"name":"Uncle Bob","email":"bob@email.com"}` | - |
| SPP-LOAD-003 | getActiveEvent | GET | /events?is_active=true | Y | Sponsor | - | `{"payment_address":"123 School St...","school_name":"Lincoln Elementary"}` | - |
| SPP-1 | processCardPayment | POST | /functions/process-square-payment | Y | Sponsor | `{"amount":50.00,"pledgeIds":["uuid1"],"sourceId":"cnon:card-nonce-ok","payerName":"Uncle Bob","payerEmail":"bob@email.com"}` | `{"success":true,"receiptUrl":"https://squareup.com/receipt/..."}` | VALIDATION_ERROR, INTERNAL ("Payment failed") |
| SPP-2 | markCheckPayment | POST | /functions/notify-check-payment | Y | Sponsor | `{"pledgeIds":["uuid1"],"payerName":"Uncle Bob","amount":50}` | `{"success":true}` | VALIDATION_ERROR |

---

#### SponsorClassPage (Route: `/sponsor/class`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SCP-LOAD-001 | listTeachers | GET | /teachers?is_active=eq.true&teacher_type=eq.homeroom | Y | Sponsor | - | `[{"id":"uuid","name":"Mrs. Smith","grade_level":"3rd"}]` | - |
| SCP-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Sponsor | - | `{"id":"uuid","class_milestone_goal":1000}` | - |
| SCP-1 | createClassPledge | POST | /class_pledges | Y | Sponsor | `{"class_name":"Mrs. Smith","teacher_id":"uuid","amount":100,"pledge_type":"flat","sponsor_user_id":"{user_id}"}` | `{"id":"uuid","payment_token":"uuid"}` | VALIDATION_ERROR |

---

#### GuestPaymentPage (Route: `/sponsor/guest-pay`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| GP-LOAD-001 | getClassPledgeByToken | GET | /class_pledges?payment_token=eq.{token} | N | - | - | `{"id":"uuid","class_name":"Mrs. Smith","amount":100,"is_paid":false,"teacher":{"name":"Mrs. Smith"}}` | NOT_FOUND |
| GP-LOAD-002 | getActiveEvent | GET | /events?is_active=true | N | - | - | `{"payment_address":"...","school_name":"Lincoln Elementary"}` | - |
| GP-1 | processGuestCardPayment | POST | /functions/process-square-payment | N | - | `{"amount":100.00,"classPledgeId":"uuid","sourceId":"cnon:card-nonce-ok","payerName":"Guest","payerEmail":"guest@email.com"}` | `{"success":true,"receiptUrl":"https://..."}` | VALIDATION_ERROR, INTERNAL |
| GP-2 | markGuestCheckPayment | PATCH | /payments | N | - | `{"class_pledge_id":"uuid","payment_method":"check","notes":"Check pending"}` | `{"id":"uuid"}` | NOT_FOUND |

---

#### SponsorThankYouPage (Route: `/sponsor/thank-you`) - 4.8 API ACTIONS

No API actions (static thank you page with mock data).

---

#### SponsorPledgedPage (Route: `/sponsor/pledged`) - 4.8 API ACTIONS

No API actions (static confirmation page with mock data).

---

#### SponsorCheckInstructionsPage (Route: `/sponsor/check-instructions`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SCI-LOAD-001 | getActiveEvent | GET | /events?is_active=true | N | - | - | `{"payment_address":"...","school_name":"Lincoln Elementary"}` | - |

---

#### ChildToFamilyRedirect (Route: `/invite/:token` and `/s/:code`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| CFR-LOAD-001 | resolveChildToFamily | GET | /children/:id?select=user_id | N | - | - | `{"user_id":"uuid"}` | NOT_FOUND |

---

#### ReturningSponsorPage (Route: `/returning/:code`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| RSP-LOAD-001 | getSponsorByCode | GET | /sponsors?id=eq.{code} | N | - | - | `{"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}` | NOT_FOUND |

---

#### AdminReadingLogsPage (Route: `/admin/reading`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| ARL-LOAD-001 | listAllReadingLogs | GET | /reading_logs?order=logged_at.desc | Y | Admin | - | `[{"id":"uuid","student_name":"Emma S","minutes":30,"logged_at":"2024-02-01"}]` | - |
| ARL-LOAD-002 | listChildren | GET | /children | Y | Admin | - | `[{"id":"uuid","name":"Emma S","class_name":"Mrs. Smith"}]` | - |
| ARL-1 | deleteReadingLog | DELETE | /reading_logs/:id | Y | Admin | - | - | NOT_FOUND |
| ARL-2 | updateReadingLog | PATCH | /reading_logs/:id | Y | Admin | `{"minutes":45}` | `{"id":"uuid","minutes":45}` | NOT_FOUND, VALIDATION_ERROR |

---

#### AdminOutstandingPage (Route: `/admin/outstanding`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AO-LOAD-001 | listOutstandingPledges | GET | /pledges?is_paid=eq.false&select=*,child(*),sponsor(*) | Y | Admin | - | `[{"id":"uuid","amount":50,"sponsor":{"name":"Uncle Bob","email":"bob@email.com"},"child":{"name":"Emma S","total_minutes":247}}]` | - |
| AO-1 | sendPaymentReminder | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeIds":["uuid"],"recipientEmail":"bob@email.com","recipientName":"Uncle Bob"}` | `{"success":true}` | INTERNAL |
| AO-2 | sendBulkReminders | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeIds":["uuid1","uuid2"]}` | `{"sent":2,"failed":0}` | INTERNAL |
| AO-3 | exportOutstanding | GET | /admin/reports/outstanding?format=csv | Y | Admin | - | CSV file | INTERNAL |

---

#### AdminChecksPage (Route: `/admin/checks`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AC-LOAD-001 | listCheckPayments | GET | /payments?payment_method=eq.check | Y | Admin | - | `[{"id":"uuid","amount":50,"payer_name":"Martha Johnson","status":"pending"}]` | - |
| AC-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Admin | - | `{"payment_address":"..."}` | - |
| AC-1 | markCheckReceived | PATCH | /payments/:id | Y | Admin | `{"status":"completed","notes":"Check #1234 received 12/20"}` | `{"id":"uuid","status":"completed"}` | NOT_FOUND |
| AC-2 | markCheckBounced | PATCH | /payments/:id | Y | Admin | `{"status":"failed","notes":"NSF - bank returned"}` | `{"id":"uuid","status":"failed"}` | NOT_FOUND |
| AC-3 | sendBouncedReminder | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeId":"uuid","type":"bounced"}` | `{"success":true}` | INTERNAL |
| AC-4 | exportCheckReport | GET | /admin/reports/checks?format=csv | Y | Admin | - | CSV file | INTERNAL |

---

#### AdminEmailPage (Route: `/admin/emails`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AE-LOAD-001 | listEmailTemplates | GET | /email_templates?order=created_at.desc | Y | Admin | - | `[{"id":"uuid","name":"Payment Reminder","subject":"...","status":"draft"}]` | - |
| AE-LOAD-002 | listEmailLogs | GET | /email_logs?order=created_at.desc&limit=50 | Y | Admin | - | `[{"id":"uuid","recipient_email":"bob@email.com","subject":"...","status":"sent"}]` | - |
| AE-LOAD-003 | getRecipientCounts | GET | /admin/email-recipient-counts | Y | Admin | - | `{"all_sponsors":50,"unpaid_sponsors":25,"overdue_sponsors":10}` | - |
| AE-LOAD-004 | listEmailRecipients | GET | /admin/email-recipients | Y | Admin | - | `[{"id":"uuid","name":"Uncle Bob","email":"bob@email.com","type":"sponsor"}]` | - |
| AE-1 | createEmailTemplate | POST | /email_templates | Y | Admin | `{"name":"New Template","subject":"Hello","body":"...","recipient_filter":"all_sponsors"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| AE-2 | updateEmailTemplate | PATCH | /email_templates/:id | Y | Admin | `{"subject":"Updated Subject","body":"..."}` | `{"id":"uuid",...}` | NOT_FOUND |
| AE-3 | deleteEmailTemplate | DELETE | /email_templates/:id | Y | Admin | - | - | NOT_FOUND |
| AE-4 | duplicateEmailTemplate | POST | /email_templates | Y | Admin | `{"name":"Template (Copy)","subject":"...","body":"..."}` | `{"id":"uuid",...}` | - |
| AE-5 | sendTemplateEmail | POST | /functions/send-template-email | Y | Admin | `{"templateId":"uuid","subject":"...","body":"...","recipients":[{"email":"bob@email.com","name":"Uncle Bob"}]}` | `{"sent":25,"failed":0}` | INTERNAL, RATE_LIMITED |
| AE-6 | scheduleEmailTemplate | PATCH | /email_templates/:id | Y | Admin | `{"status":"scheduled","scheduled_for":"2024-02-15T09:00:00Z"}` | `{"id":"uuid","status":"scheduled"}` | VALIDATION_ERROR |

---

#### AdminSiteContentPage (Route: `/admin/content`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| ASC-LOAD-001 | listSiteContent | GET | /site_content | Y | Admin | - | `[{"id":"uuid","key":"hero_headline","value":"Read-a-thon Time!","description":"Main headline"}]` | - |
| ASC-1 | updateSiteContent | PATCH | /site_content/:id | Y | Admin | `{"value":"New headline text"}` | `{"id":"uuid","value":"New headline text"}` | NOT_FOUND, VALIDATION_ERROR |
| ASC-2 | createSiteContent | POST | /site_content | Y | Admin | `{"key":"new_key","value":"New content","content_type":"text"}` | `{"id":"uuid",...}` | CONFLICT |

---

#### AdminSettingsPage (Route: `/admin/settings`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| ASet-LOAD-001 | getActiveEvent | GET | /events?is_active=true | Y | Admin | - | `{"id":"uuid","name":"Spring Read-a-thon","start_date":"...","end_date":"...","payment_address":"...","teacher_logging_grades":["K","1st"]}` | - |
| ASet-LOAD-002 | listAvailableGrades | GET | /children?select=grade_info | Y | Admin | - | `["K","1st","2nd","3rd","4th","5th"]` | - |
| ASet-LOAD-003 | listTeachers | GET | /teachers | Y | Admin | - | `[{"id":"uuid","name":"Mrs. Smith","is_active":true}]` | - |
| ASet-1 | updateEvent | PATCH | /events/:id | Y | Admin | `{"name":"Updated Name","start_date":"2024-01-15","end_date":"2024-02-28","payment_address":"...","class_milestone_goal":1000}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| ASet-2 | endEvent | PATCH | /events/:id | Y | Admin | `{"is_active":false}` | `{"id":"uuid","is_active":false}` | FORBIDDEN |
| ASet-3 | createEvent | POST | /events | Y | Admin | `{"name":"New Read-a-thon","start_date":"2024-09-01","end_date":"2024-10-31","last_log_date":"2024-11-05"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| ASet-4 | createTeacher | POST | /teachers | Y | Admin | `{"name":"Mr. Johnson","email":"johnson@school.edu","teacher_type":"homeroom","grade_level":"4th"}` | `{"id":"uuid",...}` | CONFLICT |
| ASet-5 | updateTeacher | PATCH | /teachers/:id | Y | Admin | `{"name":"Updated Name","is_active":false}` | `{"id":"uuid",...}` | NOT_FOUND |
| ASet-6 | deleteTeacher | DELETE | /teachers/:id | Y | Admin | - | - | NOT_FOUND, CONFLICT |
| ASet-7 | sendTeacherInvite | POST | /functions/send-teacher-invite | Y | Admin | `{"teacherId":"uuid","email":"teacher@school.edu"}` | `{"success":true}` | NOT_FOUND, RATE_LIMITED |
| ASet-8 | updateLogVerificationThresholds | PATCH | /events/:id | Y | Admin | `{"log_verification_enabled":true,"log_verification_thresholds":{"K":60,"1st":60,"default":90}}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| ASet-9 | generateEventLogo | POST | /admin/generate-logo | Y | Admin | `{"eventName":"Spring Read-a-thon","dateText":"Jan 15 - Feb 28"}` | `{"logoUrl":"https://..."}` | INTERNAL |
| ASet-10 | uploadEventLogo | PUT | /storage/event-logos/:filename | Y | Admin | (binary file) | `{"url":"https://..."}` | VALIDATION_ERROR |

---

#### AdminUsersPage (Route: `/admin-users`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AU-LOAD-001 | listProfiles | GET | /profiles | Y | Admin | - | `[{"id":"uuid","user_id":"uuid","display_name":"Jane Doe"}]` | - |
| AU-LOAD-002 | listUserRoles | GET | /user_roles | Y | Admin | - | `[{"id":"uuid","user_id":"uuid","role":"admin"}]` | - |
| AU-LOAD-003 | listChildren | GET | /children | Y | Admin | - | `[{"id":"uuid","name":"Emma S","user_id":"uuid"}]` | - |
| AU-1 | assignRole | POST | /user_roles | Y | Admin | `{"user_id":"uuid","role":"teacher"}` | `{"id":"uuid",...}` | CONFLICT |
| AU-2 | removeRole | DELETE | /user_roles/:id | Y | Admin | - | - | NOT_FOUND |
| AU-3 | resetUserPassword | POST | /functions/admin-reset-password | Y | Admin | `{"userId":"uuid"}` | `{"success":true}` | NOT_FOUND |

---

#### AdminFinancePage (Route: `/admin-finance`) - 4.8 API ACTIONS

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AF-LOAD-001 | listAllPledges | GET | /pledges?select=*,child(*),sponsor(*) | Y | Admin | - | `[{"id":"uuid","amount":50,"is_paid":true,"child":{"name":"Emma S"},"sponsor":{"name":"Uncle Bob"}}]` | - |
| AF-LOAD-002 | listPayments | GET | /payments?order=created_at.desc | Y | Admin | - | `[{"id":"uuid","amount":50,"payer_name":"Uncle Bob","square_payment_id":"...","square_receipt_url":"..."}]` | - |
| AF-LOAD-003 | listClassPledges | GET | /class_pledges?sponsor_user_id=eq.00000000-0000-0000-0000-000000000000 | Y | Admin | - | `[{"id":"uuid","class_name":"Mrs. Smith","amount":100,"is_paid":false}]` | - |
| AF-LOAD-004 | getFinanceSummary | GET | /admin/finance/summary | Y | Admin | - | `{"totalPledged":5000,"totalCollected":3500,"outstanding":1500,"collectionRate":70,"largePledgeCount":5}` | - |
| AF-1 | markPledgeAsPaid | PATCH | /pledges/:id | Y | Admin | `{"is_paid":true,"payment_status":"paid"}` | `{"id":"uuid","is_paid":true}` | NOT_FOUND |
| AF-2 | markPledgeAsUnpaid | PATCH | /pledges/:id | Y | Admin | `{"is_paid":false,"payment_status":"pending"}` | `{"id":"uuid","is_paid":false}` | NOT_FOUND |
| AF-3 | bulkMarkAsPaid | PATCH | /pledges | Y | Admin | `{"ids":["uuid1","uuid2"],"is_paid":true}` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR |
| AF-4 | sendPaymentReminders | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeIds":["uuid1","uuid2"]}` | `{"sent":2,"failed":0}` | INTERNAL |
| AF-5 | createManualPayment | POST | /payments | Y | Admin | `{"pledge_id":"uuid","amount":50,"payer_name":"Cash Payer","payment_method":"cash","notes":"Cash payment"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| AF-6 | exportFinanceReport | GET | /admin/reports/finance?format=csv&from={date}&to={date} | Y | Admin | - | CSV file | INTERNAL |
| AF-7 | markGuestPledgeAsPaid | PATCH | /class_pledges/:id | Y | Admin | `{"is_paid":true}` | `{"id":"uuid","is_paid":true}` | NOT_FOUND |
| AF-8 | sendGuestPaymentEmails | POST | /functions/send-guest-payment-email | Y | Admin | `{"classPledgeIds":["uuid1","uuid2"]}` | `{"sent":2,"failed":0}` | INTERNAL |
| AF-9 | copyPaymentLink | GET | /class_pledges/:id?select=payment_token | Y | Admin | - | `{"payment_token":"uuid"}` | NOT_FOUND |

---

#### DebugRingPage (Route: `/debug/progress-ring`) - 4.8 API ACTIONS

No API actions (debug utility page).

---

#### NotFound (Route: `*`) - 4.8 API ACTIONS

No API actions (static 404 page).

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
| Check payments | **PARTIAL** | SponsorPaymentPage uses hardcoded address ("Lincoln Elementary PTA..."). GuestPaymentPage correctly uses `activeEvent?.payment_address` with fallback. **ACTION:** Update SponsorPaymentPage to use dynamic `payment_address` from events table. |

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
7. **Filter options:** "all" (All Logs), "flagged" (Flagged Only), "student" (By Student), "parent" (By Parent)
8. **Success:** Logs removed from list, toast notification
9. **Note:** Currently uses mock data (`initialMockPendingLogs`). **ACTION:** Connect to actual `log_verification_requests` table via hook.

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

**Note:** Currently uses mock data (`mockStudents`). **ACTION:** Connect student list to actual `useTeacherStudents()` hook data instead of mocks.

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

**Note:** Currently uses mock data (`MOCK_PARENT`, `MOCK_PREVIOUS_CHILDREN`, `MOCK_PREVIOUS_SPONSORS`). **ACTION:** Connect to actual database to fetch returning parent's children from previous events and their past sponsors.

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
