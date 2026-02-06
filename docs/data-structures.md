# Read-a-thon Platform Data Structures

## Database Schema

### Core Entities

#### `events`
The central configuration for a read-a-thon event.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Event name (e.g., "Spring 2026 Read-a-thon") |
| `start_date` | date | When reading period begins |
| `end_date` | date | When reading period ends |
| `last_log_date` | date | Final date for logging (grace period end) |
| `is_active` | boolean | Only one active event at a time |
| `school_name` | text | School name for branding |
| `goal_minutes` | integer | Default reading goal per student |
| `timezone` | text | Event timezone (default: America/New_York) |
| `accept_checks` | boolean | Allow check payments |
| `accept_cards` | boolean | Allow card payments |
| `payment_address` | text | Mailing address for checks |
| `send_reminders` | boolean | Enable payment reminders |
| `reminder_days` | integer | Days after event to send reminders |
| `class_milestone_enabled` | boolean | Enable class milestone feature |
| `class_milestone_goal` | numeric | Default class fundraising goal |
| `class_milestone_reward` | text | Reward description |
| `teacher_logging_grades` | text | Comma-separated grades where teachers can log |
| `log_verification_enabled` | boolean | Enable log verification |
| `log_verification_thresholds` | text | JSON string of grade→minute thresholds |
| `logo_url` | text | Generated event logo URL |
| `logo_date_x_offset` | numeric | Logo date text position |

#### `children`
Student records, linked to parent accounts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Parent's auth user ID |
| `name` | text | Student full name |
| `first_name` | text | First name (split) |
| `last_name` | text | Last name (split) |
| `class_name` | text | Class/section name |
| `grade_info` | text | Grade level (e.g., "3rd Grade") |
| `homeroom_teacher_id` | uuid | FK to teachers |
| `goal_minutes` | integer | Personal reading goal |
| `total_minutes` | integer | Calculated sum of reading logs |
| `total_verified` | boolean | Parent verified final total |
| `verified_at` | timestamp | When verified |
| `verified_by` | uuid | Who verified |
| `share_public_link` | boolean | Allow sponsors to view progress |
| `student_user_id` | uuid | Links to student's real auth.users account |
| `sponsor_id_code` | text | Short shareable code for sponsors |
| `legacy_child_id` | integer | Old system PK |
| `legacy_class_name` | text | Old class name for audit |

**Note:** Student authentication uses real `auth.users` accounts linked via `student_user_id`. The `student_auth` table retains metadata (username, login_enabled) and legacy password hashes for unmigrated students.

#### `reading_logs`
Individual reading session records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `child_id` | uuid | FK to children |
| `event_id` | uuid | FK to events |
| `student_name` | text | Denormalized for display |
| `minutes` | integer | Minutes read |
| `logged_at` | date | Date of reading |
| `book_id` | uuid | FK to books (optional) |
| `book_title` | text | Denormalized title |

#### `pledges`
Individual student pledges from sponsors/parents.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `child_id` | uuid | FK to children |
| `event_id` | uuid | FK to events |
| `sponsor_id` | uuid | FK to sponsors (optional) |
| `student_name` | text | Denormalized name |
| `pledge_type` | text | 'flat' or 'per_minute' |
| `amount` | numeric | Dollar amount (or rate for per_minute) |
| `expected_payment_method` | text | 'check' or 'card' |
| `is_paid` | boolean | Payment received |
| `payment_status` | text | 'pending', 'paid', 'cancelled' |
| `final_amount` | numeric | Calculated at event close |
| `finalized_at` | timestamp | When finalized |

#### `class_pledges`
Class-level pledges with milestone support.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `class_name` | text | Target class |
| `teacher_id` | uuid | FK to teachers |
| `event_id` | uuid | FK to events |
| `sponsor_user_id` | uuid | Sponsor's auth user ID |
| `pledge_type` | text | 'flat' or 'milestone' |
| `amount` | numeric | Pledge amount |
| `max_cap` | numeric | Maximum for per-minute |
| `milestone_minutes_target` | integer | Minutes to unlock |
| `is_unlocked` | boolean | Milestone reached |
| `is_paid` | boolean | Payment received |
| `payment_status` | text | Payment state |

---

### User Management

#### `profiles`
Extended user profile information. Auto-populated by `handle_new_user` trigger on signup.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth.users |
| `display_name` | text | User's display name |
| `first_name` | text | First name |
| `last_name` | text | Last name |
| `email` | text | Denormalized email for lookups |
| `phone` | text | Phone number |
| `avatar_url` | text | Profile image URL |
| `username` | text | Login identifier (unique) |
| `user_type` | text | 'parent', 'sponsor', 'teacher', 'admin' |
| `is_active` | boolean | Soft delete flag |
| `legacy_user_id` | integer | Old system PK |

#### `user_roles`
Role assignments for authorization. All role values are plain `text`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth.users |
| `role` | text | 'admin', 'user', 'teacher', 'student' |

#### `teachers`
Teacher records with class assignments. All type values are plain `text`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth.users (nullable until linked) |
| `name` | text | Teacher name |
| `email` | text | Contact email |
| `grade_level` | text | Assigned grade |
| `teacher_type` | text | 'homeroom', 'partner', 'specials', 'staff' |
| `has_full_access` | boolean | Access to all classes |
| `is_active` | boolean | Active status |
| `legacy_teacher_id` | integer | Old system PK |
| `legacy_username` | text | Old login username |
| `legacy_default_val` | text | Old defaultVal for audit |

#### `teacher_class_assignments`
Links non-homeroom teachers to classes.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `teacher_id` | uuid | FK to teachers |
| `homeroom_teacher_id` | uuid | FK to teachers (the homeroom) |

---

### Sponsor System

#### `sponsors`
Sponsor profile records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth.users |
| `name` | text | Sponsor name |
| `email` | text | Contact email |

#### `sponsor_invitations`
Invitation tracking for sponsor access.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `child_id` | uuid | FK to children |
| `inviter_user_id` | uuid | Who sent invitation |
| `invitee_email` | text | Recipient email |
| `invitee_user_id` | uuid | Set when accepted |
| `status` | text | 'pending', 'approved', 'declined' |
| `invited_by_parent` | boolean | Parent vs sponsor invite |
| `can_invite_others` | boolean | Chain invitation permission |

---

### Authentication & Security

#### `student_auth`
Student login metadata (RLS-protected, separate from children table).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `child_id` | uuid | FK to children (unique) |
| `username` | text | Student login username |
| `password_hash` | text | Legacy: bcrypt hash for unmigrated students |
| `login_enabled` | boolean | Whether login is active |
| `created_at` | timestamp | Record creation |
| `updated_at` | timestamp | Last update |

**Authentication Architecture (Phase 3):**
- New students get real `auth.users` accounts via `student-set-password` edge function
- Student email format: `{username}@student.readathon.local` (synthetic, not real)
- Login uses standard `supabase.auth.signInWithPassword()` for full RLS-protected sessions
- `student_auth` table retains metadata (username, login_enabled) for parent management
- Legacy `password_hash` preserved for backward compatibility with unmigrated students
- Passwords require 8-character minimum

---

### Supporting Entities

#### `books`
Book catalog for reading log enrichment.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Book title |
| `author` | text | Author name |
| `isbn` | text | ISBN identifier |
| `cover_url` | text | Cover image URL |

#### `email_templates`
Admin-created email campaigns.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Template name |
| `subject` | text | Email subject |
| `body` | text | Email body (supports variables) |
| `recipient_filter` | text | Target audience filter |
| `status` | text | 'draft', 'scheduled', 'sent' |
| `scheduled_for` | timestamp | When to send |
| `created_by` | uuid | Admin who created |

#### `email_logs`
Sent email tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `template_id` | uuid | FK to email_templates |
| `recipient_email` | text | Recipient address |
| `recipient_name` | text | Recipient name |
| `recipient_type` | text | User type classification |
| `subject` | text | Rendered subject |
| `body` | text | Rendered body |
| `status` | text | 'pending', 'sent', 'failed' |
| `sent_at` | timestamp | When sent |
| `error_message` | text | Error details if failed |

#### `payments`
Payment transaction records (integrates with Square).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `pledge_id` | uuid | FK to pledges (optional) |
| `class_pledge_id` | uuid | FK to class_pledges (optional) |
| `pledge_type` | text | 'flat' or 'per_minute' |
| `amount` | numeric | Payment amount |
| `payment_method` | text | 'card' or 'check' |
| `payer_user_id` | uuid | Payer's auth user ID |
| `payer_name` | text | Payer display name |
| `payer_email` | text | Payer email |
| `student_name` | text | Student name |
| `square_payment_id` | text | Square transaction ID |
| `square_receipt_url` | text | Square receipt URL |
| `notes` | text | Admin notes |
| `created_at` | timestamp | Payment timestamp |
| `updated_at` | timestamp | Last update |

#### `log_verification_requests`
Flagged reading logs requiring parent verification.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `reading_log_id` | uuid | FK to reading_logs (unique) |
| `child_id` | uuid | FK to children |
| `minutes` | integer | Minutes that triggered flag |
| `threshold_at_time` | integer | Threshold when flagged |
| `status` | text | 'pending', 'approved', 'rejected' |
| `reviewed_by` | uuid | Who reviewed |
| `reviewed_at` | timestamp | When reviewed |
| `created_at` | timestamp | When flagged |

#### `site_content`
Admin-editable site content (FAQ, about text, etc.).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `key` | text | Content key (unique) |
| `value` | text | Content value |
| `content_type` | text | Type of content |
| `description` | text | Admin description |
| `updated_by` | uuid | Last editor |
| `updated_at` | timestamp | Last update |

#### `event_winners`
Competition results storage.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `event_id` | uuid | FK to events |
| `child_id` | uuid | FK to children |
| `class_name` | text | Winning class |
| `grade_info` | text | Grade level |
| `winner_type` | text | Category (individual/class/grade) |
| `total_minutes` | integer | Winning total |

---

### Archive Tables

#### `archived_reading_logs`
Historical reading logs after event close.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `original_id` | uuid | Original reading_logs.id |
| `event_id` | uuid | Source event |
| `event_name` | text | Denormalized event name |
| `student_name` | text | Student name |
| `minutes` | integer | Minutes read |
| `logged_at` | date | Original date |
| `book_title` | text | Book read |
| `archived_at` | timestamp | When archived |

#### `archived_pledges`
Historical pledges after event close.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `original_id` | uuid | Original pledges.id |
| `event_id` | uuid | Source event |
| `event_name` | text | Denormalized event name |
| `student_name` | text | Student name |
| `sponsor_name` | text | Sponsor name |
| `pledge_type` | text | Flat or per_minute |
| `amount` | numeric | Final amount |
| `is_paid` | boolean | Payment status |
| `archived_at` | timestamp | When archived |

---

## Database Triggers

### `handle_new_user` (on `auth.users` INSERT)
Creates a `profiles` row with `display_name`, `email`, `first_name`, `last_name`, and `phone` from user metadata.

### `update_child_total_minutes` (on `reading_logs` INSERT/UPDATE/DELETE)
Keeps `children.total_minutes` in sync with the sum of their reading logs.

### `manage_log_verification` (on `reading_logs` INSERT/UPDATE/DELETE)
Creates/updates/deletes `log_verification_requests` when log minutes exceed grade thresholds.

### `update_updated_at_column` (on various tables UPDATE)
Automatically sets `updated_at` to `now()` on row updates.

---

## Database Functions

### `has_role(user_id, role)`
Checks if user has specified role in `user_roles`. `SECURITY DEFINER` to avoid RLS recursion.

### `can_teacher_view_child(teacher_user_id, child_id)`
Determines if teacher can access child based on:
- Homeroom assignment
- Class assignments via `teacher_class_assignments`
- Grade-level match for partner teachers
- `has_full_access` flag

### `safe_display_name(full_name)`
Returns privacy-safe name (first name + last initial).

### `get_class_total_minutes(class_name)`
Returns sum of `total_minutes` for all children in class.

### `get_grade_total_minutes(grade_info)`
Returns sum of `total_minutes` for all children in grade.

### `get_class_reading_stats(class_name)`
Returns student count, total books, and total minutes for class.

### `get_class_favorite_books(class_name, limit)`
Returns most-read book titles in a class.

### `get_grade_favorite_books(grade_info, limit)`
Returns most-read book titles in a grade.

### `get_class_fundraising_total(class_name, event_id)`
Calculates total pledge amount for a class.

### `get_class_milestone_status(class_name, event_id)`
Returns milestone progress including next target and unlock status.

### `get_verification_threshold(child_id)`
Returns the grade-appropriate verification threshold for a child.

---

## Row-Level Security Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| events | Anyone | Admin | Admin | Admin |
| children | Owner/Student/Teacher/Admin/Public* | Owner | Owner | Owner |
| reading_logs | Owner/Student/Teacher/Admin/Public* | Owner/Student | Owner/Student | Owner/Student |
| pledges | Authenticated | Owner/Auth | Owner/Sponsor | Owner |
| class_pledges | Anyone | Auth | Sponsor/Admin | Sponsor/Admin |
| teachers | Anyone (active) | Admin | Admin | Admin |
| sponsors | Owner | Owner | Owner | - |
| sponsor_invitations | Owner/Invitee/Admin | Owner/Approved | Owner/Admin | Owner/Admin |
| profiles | Owner/Admin | Owner | Owner | - |
| user_roles | Owner/Admin | Admin | Admin | Admin |
| student_auth | Parent (owner of child)/Admin | Parent/Admin | Parent/Admin | Parent/Admin |
| payments | Payer/Parent/Admin | Auth/Guest | Admin | Admin |
| log_verification_requests | Owner/Admin | - (trigger) | Owner/Admin | Admin |
| books | Anyone | Authenticated | - | - |
| site_content | Anyone | Admin | Admin | Admin |

*Public access requires `share_public_link = true`
*Student access uses `student_user_id` match via `auth.uid()`

---

## Key Relationships

```
events
  ├── children (via homeroom_teacher → teachers)
  ├── reading_logs (event_id)
  ├── pledges (event_id)
  ├── class_pledges (event_id)
  └── event_winners (event_id)

children
  ├── user_id → auth.users (parent)
  ├── student_user_id → auth.users (student's own account)
  ├── homeroom_teacher_id → teachers
  ├── reading_logs (child_id)
  ├── pledges (child_id)
  ├── sponsor_invitations (child_id)
  ├── student_auth (child_id) [1:1]
  └── log_verification_requests (child_id)

teachers
  ├── user_id → auth.users
  ├── children (homeroom_teacher_id)
  ├── class_pledges (teacher_id)
  └── teacher_class_assignments

sponsors
  ├── user_id → auth.users
  └── pledges (sponsor_id)

pledges
  └── payments (pledge_id)

class_pledges
  └── payments (class_pledge_id)

reading_logs
  ├── book_id → books
  └── log_verification_requests (reading_log_id) [1:1]

books
  └── reading_logs (book_id)
```

---

## Database Views

### `children_public_safe`
Public-safe view of children for sponsor access. Returns `display_name` (first name + last initial) instead of full name.

### `teachers_public_safe`
Public-safe view of teachers. Excludes email column for privacy.

---

## TypeScript Types

Key types are generated in `src/integrations/supabase/types.ts`:

```typescript
// Table row types
type Tables<T> = Database['public']['Tables'][T]['Row']
type Children = Tables<'children'>
type Pledges = Tables<'pledges'>
type ReadingLogs = Tables<'reading_logs'>

// Insert types
type TablesInsert<T> = Database['public']['Tables'][T]['Insert']

// Update types  
type TablesUpdate<T> = Database['public']['Tables'][T]['Update']

// Note: All enums have been replaced with plain text columns (Phase 1)
// Role values: 'admin', 'user', 'teacher', 'student'
// Teacher types: 'homeroom', 'partner', 'specials', 'staff'
// Status values: 'pending', 'sent', 'failed', 'draft', 'scheduled'
```

---

*Last updated: 2026-02-05*
