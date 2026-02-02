
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

---

## Event Lifecycle Overview

The platform operates on a 5-phase event lifecycle with timezone-aware transitions:

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

#### Route: `/register`
- **Purpose**: Account creation for new parents
- **Data displayed**: Registration form with name, email, password
- **Actions**: Submit registration form, link to existing account login
- **Navigation**: On success → `/onboarding/add-child`
- **Empty state**: N/A
- **Errors**: "Email already registered", "Password must be at least 6 characters"

#### Route: `/login`
- **Purpose**: Parent authentication
- **Data displayed**: Email and password fields, forgot password link, student login shortcut
- **Actions**: Submit login, navigate to register, navigate to student login
- **Navigation**: On success → `/dashboard`
- **Errors**: "Invalid email or password", "Account not found"

#### Route: `/onboarding/add-child`
- **Purpose**: Add first child during onboarding
- **Data displayed**: 
  - Progress indicator (Step 1 of 3)
  - Form fields: First name, Last name, Grade (Pre-K through 5th), Homeroom teacher (dropdown or manual entry), Reading goal (presets: 300, 500, 750, 1000 or custom), Public link toggle
  - "I have more than one child" checkbox
- **Actions**: 
  - Select grade → filters available teachers
  - Submit → Creates child record → stores `childId` in sessionStorage
- **Navigation**: On success → `/onboarding/pledge`
- **Validation**: All fields required except public link toggle
- **Empty state**: Loading spinner while fetching teachers

#### Route: `/onboarding/pledge`
- **Purpose**: Optional self-pledge during onboarding
- **Data displayed**: Child's name and goal, pledge type toggle (flat vs per-minute), amount presets
- **Actions**: Make pledge, skip step
- **Navigation**: On success → `/onboarding/complete`
- **Empty state**: N/A

#### Route: `/onboarding/complete`
- **Purpose**: Onboarding completion confirmation
- **Data displayed**: Success message, next steps summary
- **Actions**: Go to dashboard, add another child
- **Navigation**: → `/dashboard` or → `/onboarding/add-child`

#### Route: `/dashboard`
- **Purpose**: Main parent hub showing all children's progress
- **Data displayed per child**:
  - Name, avatar initials, grade, class name
  - Reading goal ring (minutes read / goal minutes)
  - Minutes today, longest session, class total, grade total
  - Class fundraising progress (toward milestone goal)
- **Stats shown**:
  - Total minutes across all children
  - Total pledged amount
  - Sponsor count
- **Recent activity**: Last 5 reading logs across all children
- **Quick actions sidebar**:
  - Log Reading → `/log-reading`
  - Invite Sponsors → `/invite`
  - Make a Pledge → `/family/sponsor-my-child`
  - My Pledges → `/my-pledges`
- **Actions**: Log out, click child card → `/children/:id`, manage children link → `/account#children`
- **Empty states**:
  - No children: "No children added yet" + "Add Your First Reader" button
  - No recent activity: "No reading logged yet"

#### Route: `/log-reading`
- **Purpose**: Log reading minutes for children
- **Data displayed**:
  - Child selector (if multiple children)
  - Selected child's current progress and stats
  - Date picker, minutes stepper, book selector, notes field
- **Actions**:
  - Adjust minutes (+/- buttons, presets: 15, 30, 45, 60)
  - Select/search book (barcode scanner available)
  - Submit reading log
- **Navigation**: On success → shows inline celebration, stays on page
- **Business rules**:
  - Only available during `active` and `grace_period` phases
  - Grace period: date picker restricted to valid range
- **Phase-blocked states**:
  - Pre-event: "Reading Starts Soon" with start date
  - Closed: "Read-a-thon Complete"
- **Empty state**: No children: "Add a child to start logging"

#### Route: `/invite` or `/children/:id/invite`
- **Purpose**: Send sponsor invitations via email
- **Data displayed**: Child selector, email input, permission toggles
- **Actions**: 
  - Enter sponsor email(s)
  - Toggle "Can invite others" permission
  - Send invitation → triggers email via edge function
- **API call**: Creates `sponsor_invitations` record with status `pending`
- **Empty state**: N/A

#### Route: `/my-pledges`
- **Purpose**: View and manage pledges for user's children
- **Data displayed per child**:
  - List of pledges with: status badge (Paid/Pending), type (flat/per-minute), amount, date, payment method icon
  - For per-minute pledges: estimated total based on current minutes
- **Summary stats**: Total pledged, paid count, pending count
- **Actions**:
  - Edit pledge (opens EditPledgeDialog to change type/amount)
  - Delete pledge (confirmation dialog)
  - Pay Now (for flat pledges or per-minute after event closes)
- **Business rules**:
  - Parents cannot mark pledges as paid (admin only)
  - Per-minute pledges show "Payment available after read-a-thon ends" until closed phase
- **Empty states**:
  - Has children: "No pledges yet. Invite sponsors to support your children."
  - No children (sponsor view): "Sponsor a student or invite others."

#### Route: `/account`
- **Purpose**: Account settings and child management
- **Sections**:
  1. **My Pledges** - Quick link card to `/my-pledges`
  2. **Children's Accounts** (collapsible per child):
     - Quick badges: Login enabled/disabled, Public/Private link, Pending requests count
     - Expand to see: Username, login status, public link toggle
     - Pending sponsor requests with Approve/Decline buttons
     - Edit Profile button → opens EditChildDialog
     - View Details → `/family/children/:id`
     - Delete child (type name to confirm)
  3. **Profile** - Display name edit
  4. **Security** - Password change
  5. **Danger Zone** - Account deletion (type DELETE to confirm)
- **Actions**: Save profile, change password, toggle public links, approve/decline sponsors

#### Route: `/children/:id` or `/family/children/:id`
- **Purpose**: Detailed view of single child's progress and data
- **Data displayed**:
  - Reading progress ring
  - Class and grade community totals
  - Sponsors list
  - Reading logs table with inline edit/delete
- **Actions**: Edit reading logs, verify logs via checkboxes

### 1.2 Parent User Journeys

**First-time Parent Flow**:
```text
1. /register → Create account (email, password, name)
2. /onboarding/add-child → Add first child
3. /onboarding/pledge → Optional self-pledge (Skip or pledge)
4. /onboarding/complete → See confirmation
5. /dashboard → Main hub (can now log reading, invite sponsors)
```

**Returning Parent Flow**:
```text
1. /login → Enter credentials
2. /dashboard → See all children's progress
   → If active phase: Log reading button available
   → If grace period: Log reading with date restriction
   → If closed: "Read-a-thon Complete" message, payment prompts
```

**Adding Another Child**:
```text
/dashboard → Manage Children → /account#children → Add Child button
   → /onboarding/add-child (with "from dashboard" state)
```

### 1.3 Parent Business Rules

| Rule | Description |
|------|-------------|
| Data visibility | Can see all data for their own children |
| Log editing | Can edit/delete reading logs until parent verifies totals |
| Pledge management | Can edit pledge amounts/types; CANNOT mark as paid |
| Sponsor approval | Must approve sponsor requests from unknown sponsors |
| Public link | Controls whether child is discoverable via public sponsor link |
| Phase restrictions | Can only log during `active` or `grace_period` phases |

---

## 2. Sponsor Role

### 2.1 Complete Page Inventory

#### Route: `/sponsor` (SponsorGatewayPage)
- **Purpose**: Entry point for all sponsors
- **Data displayed**: "Have you sponsored before?" question with two options
- **Actions**:
  - "Yes, I'm returning" → `/sponsor/login`
  - "I'm new here" → Enter code/link → `/s/:code`
- **Auto-redirect**: If already authenticated → `/sponsor/dashboard`

#### Route: `/sponsor/login`
- **Purpose**: Returning sponsor authentication
- **Data displayed**: Email input for magic link authentication
- **Actions**: Submit email → sends magic link
- **Navigation**: → `/sponsor/check-email`

#### Route: `/sponsor/check-email`
- **Purpose**: Confirmation that magic link was sent
- **Data displayed**: Instructions to check email
- **Actions**: Resend link, try different email

#### Route: `/sponsor/auth`
- **Purpose**: Authentication page for new sponsors (from invitation link)
- **Data displayed**: Login or register form
- **Navigation**: On success → returns to invitation flow → sponsor landing page

#### Route: `/s/:code` or `/invite/:token` (SponsorLandingPage)
- **Purpose**: Make pledge for specific child
- **Requires**: Authentication (redirects to `/sponsor/auth` if not logged in)
- **Data displayed**:
  - Child's first name, grade (NOT last name - COPPA compliance)
  - Reading goal ring showing current progress
  - Stats: Minute goal, Days left, Sponsor count
  - Recent reading activity (last 3 logs with book titles)
- **Pledge form**:
  - Sponsor name (pre-filled if logged in)
  - Pledge type toggle: Per-minute / Flat amount
  - Amount: Per-minute rates (0.05, 0.10, 0.25, 0.50+) or flat presets (25, 50, 100+)
  - Payment method: Card / Pay Later / Check
  - Card form fields (if card selected)
- **Actions**: Submit pledge
- **Navigation**: On success → `/sponsor/pledged`
- **Error states**: "Reader Not Found" if invalid code or child.share_public_link=false

#### Route: `/sponsor/pledged`
- **Purpose**: Pledge confirmation
- **Data displayed**: Thank you message, pledge amount, child's name
- **Actions**: Return to dashboard, sponsor another child

#### Route: `/sponsor/dashboard`
- **Purpose**: Main sponsor hub
- **Data displayed (returning sponsors)**:
  - Stats grid: Total pledged, Children/Classes supported, Total pledges
  - **Children supported**: Cards showing child name (First + Last Initial only), grade, teacher, pledge list, total pledged, minutes read, goal progress
  - **Classes supported**: Cards showing class name, teacher, milestone progress, class pledge goal
  - Individual pledge rows with status badges
- **Data displayed (first-time sponsors)**:
  - Welcome card: "Ready to Make a Difference?"
  - Prompt to use sponsor link or enter code
- **Sidebar/Quick Actions**: Dashboard, My Pledges, Make Payment, Account
- **Actions**: Log out, sponsor again, make payment

#### Route: `/sponsor/pay`
- **Purpose**: Payment collection page
- **Data displayed**:
  - List of unpaid pledges with checkboxes
  - For per-minute pledges: calculated total (rate × child's total minutes)
  - Payment method selector: Card / Check
  - Card form OR check mailing instructions
- **Actions**: Select pledges, submit payment
- **Navigation**: On success → Thank you confirmation
- **Empty state**: "No unpaid pledges found"

### 2.2 Sponsor User Journeys

**Guest Sponsor Flow (via invitation link)**:
```text
1. Receive email with invitation link
2. Click link → /s/:code
3. Redirected to /sponsor/auth (not logged in)
4. Register or login
5. Redirected back to /s/:code (now authenticated)
6. See child's progress (First Name only + grade + teacher)
7. Fill pledge form → Select type, amount, payment method
8. Submit → /sponsor/pledged (confirmation)
9. Later: /sponsor/dashboard to track or /sponsor/pay to complete payment
```

**Returning Sponsor Flow**:
```text
1. /sponsor → "Yes, I'm returning"
2. /sponsor/login → Enter email
3. Check email for magic link → click
4. /sponsor/dashboard → See past sponsorships
5. Click "Sponsor Again" → Enter new code or use saved child links
6. /s/:code → Make new pledge
```

**Payment Flow (after event closes)**:
```text
1. /sponsor/dashboard → See "Pending" badges on pledges
2. Click "Make Payment" → /sponsor/pay
3. Select pledges to pay
4. Choose card or check:
   - Card: Enter card details → Submit → Confirmation
   - Check: See mailing address and instructions
```

### 2.3 Sponsor Business Rules

| Rule | Description |
|------|-------------|
| Child visibility | First name + last initial only (COPPA compliance) |
| Child discovery | Only children with `share_public_link=true` or direct invitation |
| Pledge timing | Can create pledges during `pre_event`, `active`, `grace_period` |
| Per-minute calculation | Final amount = rate × child.total_minutes (calculated at close) |
| Payment timing | Flat pledges: payable anytime; Per-minute: payable only after `closed` phase |
| Class pledges | Can support entire classrooms with flat or milestone-based pledges |

### 2.4 Sponsor View of Child Data

| Data Point | Visible to Sponsor |
|------------|-------------------|
| First name | Yes |
| Last name | No (only initial) |
| Grade | Yes |
| Class/Teacher | Yes |
| Reading goal | Yes |
| Minutes read | Yes |
| Books read | Yes (titles only) |
| Other sponsors | No |
| Parent info | No |

---

## 3. Student Role

### 3.1 Complete Page Inventory

#### Route: `/student/login` (StudentPinLoginPage)
- **Purpose**: Student authentication using parent-set credentials
- **Data displayed**: Username and password fields
- **Actions**: Submit login
- **Authentication**: Edge function validates SHA-256 hashed password
- **Session**: Stored in sessionStorage (cleared on browser close)
- **Navigation**: On success → `/student/dashboard`
- **Errors**: "Invalid username or password", "Student login not enabled"

#### Route: `/student/dashboard` (StudentPinDashboardPage)
- **Purpose**: Student's personal reading dashboard
- **Data displayed**:
  - School-wide total minutes (hero section)
  - Personal welcome message: "Welcome, [Name]!"
  - Goal progress message: "[X] minutes to reach your goal"
  - **Progress card**: Reading goal ring, minutes read, goal minutes, percent complete
  - **Stats row**: This week's minutes, Class total, Grade total, Longest session
  - **Class fundraising**: Shelf visualization showing progress to class pledge goal
  - **Class favorite books**: Top 5 books read by classmates
  - **Grade favorite books**: Top 5 books read by grade
  - **Reading history**: List of reading logs with edit/delete capabilities
- **Actions**:
  - Log Reading button → opens modal/dialog
  - Edit log (if not verified)
  - Delete log (if not verified)
  - Log out
- **Business rules**: Can only log during `active` phase
- **Phase-blocked states**: Same as parent log reading page

#### Route: `/student/books`
- **Purpose**: Book tracking and discovery
- **Data displayed**: Books student has read, book search/barcode scanner
- **Actions**: Search books, scan barcode, view book details

### 3.2 Student User Journey

**Student Login Flow**:
```text
1. Parent enables student_login_enabled on child record
2. Parent sets student_username and student_password
3. Student goes to /student/login
4. Enters username and password
5. Edge function validates credentials
6. Session stored in sessionStorage
7. → /student/dashboard
```

**Logging Reading as Student**:
```text
1. /student/dashboard → Click "Log Reading" button
2. Modal opens with: Minutes stepper, Book selector (optional)
3. Submit → Toast success with celebration
4. Dashboard updates with new total
5. Log appears in reading history
```

### 3.3 Student Business Rules

| Rule | Description |
|------|-------------|
| Authentication | Parent-managed username/password, SHA-256 hashed |
| Session | sessionStorage only (no persistent login) |
| Log creation | Only during `active` phase |
| Log editing | Can edit/delete own logs until parent verifies totals |
| Data visibility | Sees own progress, class totals, grade totals (no individual classmates) |
| Cannot see | Sponsor info, pledge amounts, payment status |

### 3.4 What Students CAN vs CANNOT Do

| Action | Allowed |
|--------|---------|
| Log reading minutes | Yes (active phase only) |
| Select/search books | Yes |
| Edit own reading logs | Yes (until verified) |
| Delete own reading logs | Yes (until verified) |
| View own progress | Yes |
| View class/grade totals | Yes |
| View individual classmates | No |
| View sponsors | No |
| View pledge amounts | No |
| Invite sponsors | No |
| Change account settings | No (parent managed) |

---

## 4. Teacher Role

### 4.1 Complete Page Inventory

#### Route: `/teacher/login`
- **Purpose**: Teacher authentication
- **Data displayed**: Email and password fields
- **Navigation**: On success → `/teacher` (dashboard)

#### Route: `/teacher/set-password`
- **Purpose**: Initial password setup from invitation email
- **Data displayed**: New password form
- **Process**: Edge function links user_id to teacher record
- **Navigation**: On success → `/teacher/login`

#### Route: `/teacher` (TeacherDashboard)
- **Purpose**: Class overview and student management
- **Data displayed**:
  - Teacher name and type (Homeroom/Partner/Staff)
  - Event status banner: Event name, days remaining, participation rate
  - **Stats grid**: Total students, Participating, Total minutes, Avg per student
  - **Filters**: Search by name, Sort (name/progress/last-active), Status filter (all/needs-attention/goal-reached)
  - For Staff: Grade filter, Class filter
  - For Grade-level Partners: Class filter
  - **Student cards**: Name, avatar, progress ring, status badge, last logged date, books read
- **Actions**:
  - Search/filter students
  - Log Reading button → `/teacher/log` (if grade-enabled)
  - Export button (downloads report)
  - Sign out
- **Business rules**: Students shown based on teacher type and assignments

#### Route: `/teacher/log` (TeacherLogReading)
- **Purpose**: Bulk reading entry for students
- **Data displayed**:
  - Mode toggle: Single student / Bulk mode
  - **Single mode**: Student dropdown, progress ring for selected student
  - **Bulk mode**: Checkbox grid of all students, select all/none buttons
  - Date selector: Today / Yesterday
  - Minutes stepper with quick buttons (15, 20, 30, 45)
  - Activity note (optional)
- **Actions**: Select students, set minutes, submit
- **Navigation**: On success → confirmation, "Log More" button
- **Business rules**: Only available if teacher's grade is in `events.teacher_logging_grades`

### 4.2 Teacher User Journey

**Teacher Onboarding Flow**:
```text
1. Admin creates teacher record in /admin/settings
2. Admin sends invitation email (triggers edge function)
3. Teacher receives email with set-password link
4. /teacher/set-password → Set permanent password
5. Edge function links auth user_id to teacher record
6. /teacher/login → Enter credentials
7. /teacher → Dashboard with assigned students
```

**Teacher Logging Reading**:
```text
1. /teacher → Check "Log Reading" button status
   - Enabled: Grade is in teacher_logging_grades
   - Disabled: Shows tooltip "Not enabled for your grade"
2. Click → /teacher/log
3. Choose mode:
   - Single: Select student, set minutes, submit
   - Bulk: Check multiple students, set minutes, submit for all
4. Success toast → "Log More" or return to dashboard
```

### 4.3 Teacher Role Hierarchy

| Teacher Type | Student Access | Filters Available |
|--------------|---------------|-------------------|
| Homeroom | Only assigned students | None needed |
| Partner (Specific) | Students in linked homeroom classes | None needed |
| Partner (Grade-level) | All students in assigned grade | Class filter |
| Specials | No access unless assigned | N/A |
| Staff (has_full_access) | All students school-wide | Grade + Class filters |

### 4.4 Teacher Business Rules

| Rule | Description |
|------|-------------|
| Authentication | Admin-created account with magic link password setup |
| Student visibility | Controlled by `can_teacher_view_child()` RLS function |
| Log permission | Only if their students' grade is in `teacher_logging_grades` |
| Log timing | Only during `active` phase |
| Cannot see | Sponsor info, pledge amounts, payment data |
| Dual role | Can have both teacher and parent records on same email |

---

## 5. Admin Role

### 5.1 Complete Page Inventory

#### Route: `/admin/login`
- **Purpose**: Admin authentication
- **Requirements**: User must have `admin` role in `user_roles` table
- **Navigation**: On success → `/admin`

#### Route: `/admin` (AdminDashboard)
- **Purpose**: Event overview and quick actions
- **Data displayed**:
  - Event name with status badge (Active/Upcoming/Ended) and days remaining
  - **Key metrics**: Students enrolled, Total minutes, Total pledged, Total collected
  - **Attention needed**: Cards linking to outstanding payments, unverified logs, etc.
  - **Quick actions**: Send payment reminders, Download reports, Manage event
  - **Recent activity**: Last 8 activities (pledges, payments, enrollments)
  - **Outstanding payments**: Table with sponsor, student, amount, days outstanding
- **Actions**:
  - Send reminders (individual or bulk)
  - Download reports (students, pledges, payments)
  - Navigate to settings

#### Route: `/admin/settings` (AdminSettingsPage)
- **Purpose**: Event configuration
- **Sections**:
  1. **Event Details**: Name, school name, dates (start, end, last log), goal minutes, timezone
  2. **Payment Settings**: Check mailing address, accept cards toggle, accept checks toggle
  3. **Email Settings**: Send reminders toggle, reminder days
  4. **Class Milestones**: Enable toggle, goal amount, reward description
  5. **Teacher Logging**: Grade checkboxes for which grades teachers can log
  6. **Teachers & Staff**: Full teacher management UI (add, edit, invite, assign)
  7. **Log Verification**: Threshold settings for flagging suspicious logs
  8. **Event Logo**: Logo generator with Cooper Black font vectorization
  9. **Danger Zone**: End event button (archives data, sends payment emails)
- **Actions**: Save changes, end event (confirmation required)

#### Route: `/admin/reading` (AdminReadingLogsPage)
- **Purpose**: View and manage all reading logs
- **Data displayed**: Filterable/sortable table of all reading logs
- **Actions**: View details, flag logs, export

#### Route: `/admin/outstanding` (AdminOutstandingPage)
- **Purpose**: Manage unpaid pledges
- **Data displayed**: Table of all unpaid pledges with sponsor info, amounts, days outstanding
- **Actions**: Send individual reminders, bulk reminders, mark as paid

#### Route: `/admin/checks` (AdminChecksPage)
- **Purpose**: Track check payments
- **Data displayed**: Expected checks, received checks, matching status
- **Actions**: Record check receipt, match to pledge

#### Route: `/admin/emails` (AdminEmailPage)
- **Purpose**: Email campaign management
- **Data displayed**:
  - Email templates list
  - Recipient filter options (all_parents, parents_no_pledges, sponsors_unpaid, teachers)
  - Recipient count preview
  - Email logs with status
- **Actions**: Create template, preview recipients, send/schedule, view logs

#### Route: `/admin/content` (AdminSiteContentPage)
- **Purpose**: Edit public-facing text content
- **Data displayed**: Key-value editor for site_content table
- **Actions**: Edit values, save

#### Route: `/admin-users` (AdminUsersPage)
- **Purpose**: User management (legacy route)
- **Functionality**: Similar to teacher management

#### Route: `/admin-finance` (AdminFinancePage)
- **Purpose**: Financial overview
- **Data displayed**: Pledge totals, payment totals, outstanding amounts

### 5.2 Admin User Journey

**Admin Setup Flow**:
```text
1. First admin created via bootstrap-admin edge function (requires ADMIN_SETUP_KEY)
2. /admin/login → Enter credentials
3. /admin → Dashboard overview
4. /admin/settings → Create event if none exists
5. Configure dates, goals, payment options, teacher logging permissions
6. Add teachers and send invitations
7. Monitor dashboard as event progresses
```

**Managing Event Flow**:
```text
Active Phase:
1. Monitor /admin → See enrollments, minutes, pledges
2. /admin/emails → Send encouragement emails
3. /admin/reading → Verify suspicious logs

Grace Period:
1. /admin → See outstanding payments
2. /admin/emails → Send payment reminder campaign

Closed Phase:
1. /admin/settings → End event (archives data)
2. /admin/checks → Record check payments
3. /admin/outstanding → Follow up on unpaid pledges
```

### 5.3 Admin Business Rules

| Rule | Description |
|------|-------------|
| Authentication | Standard auth + `admin` role in `user_roles` table |
| Data access | Full read/write on all tables |
| Protected routes | All `/admin/*` routes wrapped in `<RequireAdmin>` |
| Event management | Only admins can create, update, or end events |
| Teacher management | Only admins can add teachers and send invitations |
| Payment management | Only admins can mark pledges as paid |
| Email campaigns | Only admins can send bulk emails |

---

## Cross-Role Summary: Time-Based Restrictions

| Action | Pre-Event | Active | Grace Period | Closed |
|--------|-----------|--------|--------------|--------|
| Parent: Log reading | No | Yes | Yes | No |
| Student: Log reading | No | Yes | No | No |
| Teacher: Log reading | No | Yes (grade-restricted) | No | No |
| Create pledges | Yes | Yes | Yes | No |
| Pay flat pledges | Yes | Yes | Yes | Yes |
| Pay per-minute pledges | No | No | No | Yes |
| Register new account | Yes | Yes | No | No |
| Add children | Yes | Yes | No | No |
| Finalize pledges | No | No | No | Yes (auto) |

---

## Technical Implementation Notes

### Session Storage Keys
- `onboardingChildId` - Child ID during onboarding flow
- `childData` - Child details for onboarding
- `hasMultipleChildren` - Boolean for onboarding branching
- `parentData` - Parent phone from registration

### Key RLS Functions
- `has_role(user_id, role)` - Check if user has specific role
- `can_teacher_view_child(user_id, child_id)` - Teacher-student access control

### Edge Functions
- `student-login` - Validate student credentials
- `student-set-password` - Set student password with hashing
- `send-teacher-invite` - Send teacher invitation email
- `link-teacher-account` - Connect auth user to teacher record
- `send-pledge-notification` - Notify parent of new pledge
- `send-payment-reminder` - Send payment reminder emails
