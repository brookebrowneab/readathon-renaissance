# Read-a-thon Platform Workflows

## Event Lifecycle

The platform operates on a 5-phase event lifecycle, governed by timezone-aware transitions (default: `America/New_York`):

### Phase 1: Setup
- **Who**: Admin only
- **Activities**: Configure event dates, school info, payment options, class milestone settings
- **Transitions**: Begins when event is created, ends at `start_date`

### Phase 2: Pre-Event
- **Who**: Parents, Sponsors, Teachers
- **Activities**: 
  - Parents register and add children
  - Sponsors can create pledges
  - Teachers can be invited and set up
- **Restrictions**: No reading logs allowed
- **Transitions**: Ends when `start_date` is reached

### Phase 3: Active
- **Who**: All users
- **Activities**:
  - All registration and pledge activities continue
  - Students, parents, and teachers can log reading minutes
  - Progress tracking and milestone monitoring
- **Transitions**: Ends when `end_date` is reached

### Phase 4: Grace Period
- **Who**: Parents, Admins
- **Activities**:
  - Parent-only logging for validation and catch-up
  - Final verification of reading totals
- **Restrictions**: New sign-ups closed, student/teacher logging disabled
- **Transitions**: Ends when `last_log_date` is reached

### Phase 5: Closed
- **Who**: Admins
- **Activities**:
  - Per-minute pledges finalized with `final_amount`
  - Winners announced
  - Payment collection
- **Restrictions**: All participation closed

---

## User Journeys

### Parent Journey

```
Register Account
     ↓
Add Child(ren) → Select Teacher/Class → Set Reading Goal
     ↓
Onboarding Pledge (optional self-pledge)
     ↓
Invite Sponsors (email invitations)
     ↓
Log Reading (during active/grace phases)
     ↓
View Dashboard (progress, pledges, sponsors)
     ↓
Verify Totals (grace period)
```

**Key Pages**:
- `/register` - Account creation
- `/onboarding/add-child` - Add children
- `/onboarding/pledge` - Self-pledge
- `/dashboard` - Main parent dashboard
- `/log-reading` - Log reading minutes
- `/family/children` - Manage children
- `/invite-sponsors` - Send sponsor invitations

### Sponsor Journey

```
Receive Invitation Email
     ↓
Landing Page → Create Account or Login
     ↓
View Child Progress
     ↓
Make Pledge (flat or per-minute)
     ↓
Sponsor Dashboard (track progress)
     ↓
Payment (check or card, after event)
```

**Key Pages**:
- `/sponsor/gateway` - Entry point from invitation
- `/sponsor/auth` - Authentication
- `/sponsor/pledge` - Make pledge
- `/sponsor/dashboard` - View pledges and progress
- `/sponsor/payment` - Payment instructions

### Teacher Journey

```
Receive Invitation Email
     ↓
Set Password → Login
     ↓
View Class Dashboard (students, progress)
     ↓
Log Reading (for enabled grades)
     ↓
Track Class Milestones
```

**Key Pages**:
- `/teacher/login` - Authentication
- `/teacher/set-password` - Initial password setup
- `/teacher/dashboard` - Class overview
- `/teacher/log-reading` - Bulk reading entry

### Student Journey

```
Parent Enables Student Login
     ↓
Student Login (username/password or PIN)
     ↓
View Personal Dashboard
     ↓
Log Reading Minutes
     ↓
Track Books Read
```

**Key Pages**:
- `/student/login` - Standard login
- `/student/pin-login` - PIN-based login
- `/student/dashboard` - Personal progress
- `/student/log-reading` - Log minutes
- `/student/books` - Book tracking

### Admin Journey

```
Login (admin role required)
     ↓
Dashboard → Overview Stats
     ↓
Manage Event Settings
     ↓
Manage Teachers
     ↓
Finance (pledges, payments, outstanding)
     ↓
Email Communications
     ↓
End Event → Archive Data
```

**Key Pages**:
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Overview statistics
- `/admin/settings` - Event configuration
- `/admin/users` - Teacher management
- `/admin/finance` - Payment tracking
- `/admin/outstanding` - Outstanding pledges
- `/admin/email` - Email templates and logs

---

## Core Workflows

### Reading Log Flow

```
User selects child (if multiple)
     ↓
Enter minutes read
     ↓
(Optional) Select book or enter title
     ↓
Submit → Validate against event phase
     ↓
Update child.total_minutes
     ↓
Check class milestones
     ↓
Show celebration (if goal reached)
```

**Validation Rules**:
- Must be within event active or grace period
- Grace period: parent-only logging
- Teacher logging: only for configured grades (`teacher_logging_grades`)

### Pledge Flow

```
Sponsor/Parent initiates pledge
     ↓
Select pledge type:
  - Flat: Fixed dollar amount
  - Per-minute: Rate × total minutes (calculated at close)
     ↓
Enter amount (and cap for per-minute)
     ↓
Select payment method preference (check/card)
     ↓
Create pledge record
     ↓
(Event closes) → Finalize per-minute pledges
     ↓
Payment collection
     ↓
Mark as paid
```

### Class Pledge Flow

```
Sponsor creates class pledge
     ↓
Select class/teacher
     ↓
Choose type:
  - Flat: Unlocked immediately
  - Milestone: Unlocked when class reaches target minutes
     ↓
Track class progress
     ↓
Auto-unlock when milestone reached
     ↓
Payment collection
```

### Sponsor Invitation Flow

```
Parent clicks "Invite Sponsors"
     ↓
Enter sponsor email(s)
     ↓
Set permissions (can_invite_others)
     ↓
Create invitation record (status: pending)
     ↓
Send email via edge function
     ↓
Sponsor clicks link → Gateway page
     ↓
Register/Login → Invitation accepted
     ↓
Update invitation (status: approved, invitee_user_id)
```

### Teacher Invitation Flow

```
Admin creates teacher record
     ↓
Set teacher type (homeroom, partner, specials, staff)
     ↓
Send invitation email
     ↓
Teacher clicks link → Set password
     ↓
Link teacher.user_id to auth account
     ↓
Teacher can now access dashboard
```

---

## Authentication Flows

### Standard Auth (Parents/Sponsors)
- Email/password registration
- Auto-confirm enabled (no email verification)
- Password reset via email

### Teacher Auth
- Admin-initiated account creation
- Invitation email with set-password link
- Edge function handles password setup

### Student Auth
- Credentials stored in dedicated `student_auth` table (not on `children`)
- Parent enables `login_enabled`, sets `username` and password
- Password hashed with bcrypt (cost 12); legacy SHA-256 hashes auto-upgrade
- Optional PIN-based login
- Edge function validates credentials, returns session token

### Admin Auth
- Same as standard auth
- Requires `admin` role in `user_roles` table

---

## Data Sync Workflows

### Reading Minutes Sync
```sql
-- Trigger: update_child_total_minutes
-- On INSERT/UPDATE/DELETE of reading_logs
-- Recalculates child.total_minutes as SUM(minutes)
```

### Class Milestone Check
```sql
-- Function: get_class_milestone_status
-- Compares class total minutes to milestone_minutes_target
-- Updates class_pledges.is_unlocked when reached
```

### Pledge Finalization (Event Close)
```sql
-- For per-minute pledges:
-- final_amount = amount × child.total_minutes
-- finalized_at = now()
```

---

## Email Workflows

### Automated Emails
- **Pledge notification**: When sponsor creates pledge
- **Payment reminder**: Configurable days after event (`reminder_days`)
- **Teacher invite**: When admin creates teacher
- **Teacher welcome**: After teacher sets password

### Admin Campaigns
- Create email template with recipient filter
- Preview recipient count
- Schedule or send immediately
- Track delivery status in `email_logs`

**Recipient Filters**:
- `all_parents` - All registered parents
- `parents_no_pledges` - Parents without pledges
- `sponsors_unpaid` - Sponsors with pending payments
- `teachers` - All active teachers

---

*Last updated: 2026-02-05*
