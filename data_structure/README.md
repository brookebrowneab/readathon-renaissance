# Database Schema Documentation

This folder contains the SQL schema definitions for all database tables in the Read-a-thon platform.

## File Structure

### Core Files
- `_enums.sql` - Database enum type definitions (must be created first)
- `_functions.sql` - Database functions and triggers

### Table Definitions
Each `.sql` file contains:
- Table creation statement with all columns
- Row Level Security (RLS) policies
- Comments explaining the table's purpose

### Tables by Category

#### Core Entities
- `events.sql` - Read-a-thon event configuration
- `children.sql` - Student records linked to parents
- `reading_logs.sql` - Individual reading session records
- `pledges.sql` - Individual student pledges
- `class_pledges.sql` - Class-level pledges with milestones

#### User Management
- `profiles.sql` - Extended user profile information
- `user_roles.sql` - Role assignments (admin, user, teacher)
- `teachers.sql` - Teacher records
- `teacher_class_assignments.sql` - Non-homeroom teacher class links

#### Sponsor System
- `sponsors.sql` - Sponsor profile records
- `sponsor_invitations.sql` - Invitation tracking

#### Supporting Entities
- `books.sql` - Book catalog
- `email_templates.sql` - Email campaign templates
- `email_logs.sql` - Sent email tracking
- `event_winners.sql` - Competition results
- `log_verification_requests.sql` - Reading log verification
- `payments.sql` - Payment records
- `site_content.sql` - Admin-editable content

#### Archive Tables
- `archived_pledges.sql` - Historical pledges
- `archived_reading_logs.sql` - Historical reading logs

## Usage

To recreate the schema:

1. Run `_enums.sql` first to create enum types
2. Run table files in dependency order:
   - `teachers.sql`
   - `events.sql`
   - `children.sql`
   - `books.sql`
   - `sponsors.sql`
   - `reading_logs.sql`
   - `pledges.sql`
   - `class_pledges.sql`
   - (remaining tables)
3. Run `_functions.sql` to create database functions

## Notes

- All tables use UUID primary keys with `gen_random_uuid()`
- RLS is enabled on all tables
- Timestamps use `timestamp with time zone`
- The `has_role()` function is used extensively in RLS policies
