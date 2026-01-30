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
| `teacher_logging_grades` | text[] | Grades where teachers can log |
| `logo_url` | text | Generated event logo URL |
| `logo_date_x_offset` | numeric | Logo date text position |

#### `children`
Student records, linked to parent accounts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Parent's auth user ID |
| `name` | text | Student name |
| `class_name` | text | Class/section name |
| `grade_info` | text | Grade level (e.g., "3rd Grade") |
| `homeroom_teacher_id` | uuid | FK to teachers |
| `goal_minutes` | integer | Personal reading goal |
| `total_minutes` | integer | Calculated sum of reading logs |
| `total_verified` | boolean | Parent verified final total |
| `verified_at` | timestamp | When verified |
| `verified_by` | uuid | Who verified |
| `share_public_link` | boolean | Allow sponsors to view progress |
| `student_login_enabled` | boolean | Allow student self-login |
| `student_username` | text | Student login username |
| `student_password_hash` | text | Hashed password |

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
Extended user profile information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth.users |
| `display_name` | text | User's display name |
| `avatar_url` | text | Profile image URL |

#### `user_roles`
Role assignments for authorization.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth.users |
| `role` | app_role | 'admin', 'user', 'teacher' |

**Enum: `app_role`**: `admin`, `user`, `teacher`

#### `teachers`
Teacher records with class assignments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK to auth.users (nullable until linked) |
| `name` | text | Teacher name |
| `email` | text | Contact email |
| `grade_level` | text | Assigned grade |
| `teacher_type` | teacher_type | Role classification |
| `has_full_access` | boolean | Access to all classes |
| `is_active` | boolean | Active status |

**Enum: `teacher_type`**: `homeroom`, `partner`, `specials`, `staff`

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
| `status` | email_template_status | Draft/scheduled/sent |
| `scheduled_for` | timestamp | When to send |
| `created_by` | uuid | Admin who created |

**Enum: `email_template_status`**: `draft`, `scheduled`, `sent`

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
| `status` | email_log_status | Delivery status |
| `sent_at` | timestamp | When sent |
| `error_message` | text | Error details if failed |

**Enum: `email_log_status`**: `pending`, `sent`, `failed`

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

## Database Functions

### `has_role(user_id, role)`
Checks if user has specified role in `user_roles`.

### `can_teacher_view_child(teacher_user_id, child_id)`
Determines if teacher can access child based on:
- Homeroom assignment
- Class assignments via `teacher_class_assignments`
- `has_full_access` flag

### `get_class_total_minutes(class_name)`
Returns sum of `total_minutes` for all children in class.

### `get_grade_total_minutes(grade_info)`
Returns sum of `total_minutes` for all children in grade.

### `get_class_reading_stats(class_name)`
Returns student count, total books, and total minutes for class.

### `get_class_fundraising_total(class_name, event_id)`
Calculates total pledge amount for a class.

### `get_class_milestone_status(class_name, event_id)`
Returns milestone progress including next target and unlock status.

---

## Row-Level Security Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| events | Anyone | Admin | Admin | Admin |
| children | Owner/Teacher/Admin/Public* | Owner | Owner | Owner |
| reading_logs | Owner/Teacher/Admin/Public* | Owner | Owner | Owner |
| pledges | Anyone | Owner/Auth | Owner/Sponsor | Owner |
| class_pledges | Anyone | Auth | Sponsor/Admin | Sponsor/Admin |
| teachers | Anyone (active) | Admin | Admin | Admin |
| sponsors | Owner | Owner | Owner | - |
| sponsor_invitations | Owner/Invitee/Admin | Owner/Approved | Owner/Admin | Owner/Admin |
| profiles | Owner/Admin | Owner | Owner | - |
| user_roles | Owner/Admin | Admin | Admin | Admin |

*Public access requires `share_public_link = true`

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

// Enums
type AppRole = 'admin' | 'user' | 'teacher'
type TeacherType = 'homeroom' | 'partner' | 'specials' | 'staff'
type EmailLogStatus = 'pending' | 'sent' | 'failed'
type EmailTemplateStatus = 'draft' | 'scheduled' | 'sent'
```

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
  ├── homeroom_teacher_id → teachers
  ├── reading_logs (child_id)
  ├── pledges (child_id)
  └── sponsor_invitations (child_id)

teachers
  ├── user_id → auth.users
  ├── children (homeroom_teacher_id)
  ├── class_pledges (teacher_id)
  └── teacher_class_assignments

sponsors
  ├── user_id → auth.users
  └── pledges (sponsor_id)

books
  └── reading_logs (book_id)
```
