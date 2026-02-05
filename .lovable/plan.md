

# Schema Plan & Migration Status

## ✅ Phase 1: Enum-to-Text Migration (COMPLETED)

All Postgres enums have been replaced with plain `text` columns:
- `app_role` → `user_roles.role` is now `text` (values: admin, user, teacher)
- `teacher_type` → `teachers.teacher_type` is now `text` (values: homeroom, partner, specials, staff)
- `email_log_status` → `email_logs.status` is now `text` (values: pending, sent, failed)
- `email_template_status` → `email_templates.status` is now `text` (values: draft, scheduled, sent)
- `events.teacher_logging_grades` changed from `text[]` to comma-separated `text`
- `events.log_verification_thresholds` changed from `jsonb` to `text` (JSON string)
- All RLS policies updated to remove `::app_role` casts
- `has_role()` function updated to accept `text` parameter
- `get_verification_threshold()` updated to parse text as JSON

## ✅ Phase 2: Profiles Table Expansion (COMPLETED)

Added columns to `profiles` for legacy import and richer user data:
- `username` (text, unique partial index) — login identifier
- `email` (text, indexed) — denormalized email for lookups
- `first_name`, `last_name` (text) — split name fields
- `user_type` (text) — 'parent', 'sponsor', 'teacher', 'admin'
- `is_active` (boolean, default true) — soft delete flag
- `legacy_user_id` (integer, indexed) — old system PK
- `handle_new_user()` trigger updated to populate `email` from `auth.users` on signup

## Updated Schema Plan: Legacy Teacher Data Compatibility

## What Changed

The previous plan described the teacher assignment system incorrectly. Here is how the **legacy teacher table** actually works and how it maps to the current system.

## Legacy Teacher Structure

The legacy `teachers` table has four columns that matter:

| Legacy Column | Type | Meaning |
|---|---|---|
| `teacherUserName` | text | Login username for the teacher |
| `grade` | text | The grade they teach: Pre-K, Kindergarten, First, Second, Third, Fourth, Fifth |
| `defaultVal` | text | Determines which students the teacher sees (see below) |
| `homeroom` | int/null | 1 = homeroom teacher, NULL = not homeroom |

### The `defaultVal` Logic

This single column encodes the teacher's assignment scope:

| `defaultVal` value | Meaning | Maps to current system |
|---|---|---|
| A homeroom teacher's name (e.g. "Mrs. Smith") | This teacher works only with Mrs. Smith's homeroom students | `teacher_class_assignments` row linking to that homeroom teacher |
| `0.5` | Works with all Pre-K students | `teachers.grade_level = 'Pre-K'` |
| `0.75` | Works with all Kindergarten students | `teachers.grade_level = 'Kindergarten'` |
| `1` | Works with all 1st grade students | `teachers.grade_level = '1st'` |
| `2` | Works with all 2nd grade students | `teachers.grade_level = '2nd'` |
| `3` | Works with all 3rd grade students | `teachers.grade_level = '3rd'` |
| `4` | Works with all 4th grade students | `teachers.grade_level = '4th'` |
| `5` | Works with all 5th grade students | `teachers.grade_level = '5th'` |
| `10` | Works with all grades (full school access) | `teachers.has_full_access = true` |

## Changes to the Teachers Table

Add these legacy columns to the existing `teachers` table:

| New Column | Type | Notes |
|---|---|---|
| `legacy_teacher_id` | integer | Old auto-increment PK (if one existed) |
| `legacy_username` | text | Old `teacherUserName` -- used for import mapping and legacy login |
| `legacy_default_val` | text | Raw `defaultVal` from legacy -- preserved for audit/debugging |

The existing columns already cover the functional mapping:

| Legacy concept | Current column | How it maps |
|---|---|---|
| `homeroom = 1` | `teacher_type = 'homeroom'` | Direct mapping |
| `homeroom = NULL` + `defaultVal` is a name | `teacher_type = 'partner'` + row in `teacher_class_assignments` | The named teacher is looked up by name to get the homeroom_teacher_id |
| `homeroom = NULL` + `defaultVal` is a grade number | `teacher_type = 'partner'` + `grade_level` set to the grade text | Numeric value converted to grade text during import |
| `homeroom = NULL` + `defaultVal = 10` | `teacher_type = 'staff'` + `has_full_access = true` | Direct mapping |
| `grade` | `grade_level` (for homeroom teachers) | The grade the teacher teaches in |

## Legacy Grade Number to Text Mapping

This mapping is needed during import and should be defined as a constant in the import logic:

```text
0.5  -> "Pre-K"
0.75 -> "Kindergarten"
1    -> "1st"
2    -> "2nd"
3    -> "3rd"
4    -> "4th"
5    -> "5th"
10   -> (full access flag, not a grade)
```

## Import Logic for Teachers

During legacy data import, each teacher record is processed as follows:

1. Create a row in `teachers` with `name`, `email` (from legacy username lookup), `legacy_username`, `legacy_default_val`
2. Set `grade_level` to the teacher's `grade` column value (mapped to current format)
3. Determine `teacher_type` and access:
   - If `homeroom = 1`: set `teacher_type = 'homeroom'`
   - If `defaultVal = 10`: set `teacher_type = 'staff'`, `has_full_access = true`
   - If `defaultVal` is a numeric grade value: set `teacher_type = 'partner'`, `grade_level` = mapped grade text
   - If `defaultVal` is a teacher name: set `teacher_type = 'partner'`, then after all teachers are imported, create a `teacher_class_assignments` row linking this teacher to the homeroom teacher whose name matches `defaultVal`

## Impact on the `can_teacher_view_child()` Function

No changes needed. The existing function already handles all four access patterns:
- `has_full_access = true` (staff with defaultVal 10)
- `homeroom_teacher_id = t.id` (homeroom teachers)
- `teacher_class_assignments` lookup (partner assigned to specific homeroom)
- `grade_level` match on `children.grade_info` (partner assigned to whole grade)

## Impact on the Rest of the Schema Plan

The rest of the previously approved schema plan remains unchanged. This update only affects:

1. **Teachers table**: Three new legacy columns (`legacy_teacher_id`, `legacy_username`, `legacy_default_val`) instead of just two
2. **Import logic**: A `defaultVal` decoder that converts the legacy encoding into the correct combination of `teacher_type`, `grade_level`, `has_full_access`, and `teacher_class_assignments` rows
3. **`teacher_type` column**: Still changed from enum to text (for MySQL compatibility), no new values needed -- the four existing values (homeroom, partner, specials, staff) cover all legacy cases

## Technical Note: Homeroom Teacher Grade

For homeroom teachers, the legacy `grade` column tells us what grade they teach. This should be stored in `teachers.grade_level` for homeroom teachers too (not just partners), since it is useful for filtering and display. The current system already supports this -- `grade_level` is nullable on all teacher types.

