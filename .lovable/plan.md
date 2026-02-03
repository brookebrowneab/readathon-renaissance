<!-- STATUS: IMPLEMENTED -->

# COPPA-Compliant Sponsor Experience: Privacy-First Display

## Overview

Sponsors will **never** see a child's full name - only First Name + Last Initial, Grade, and Class. This applies both before and after authentication, providing consistent COPPA compliance across all sponsor touchpoints.

## What Sponsors Will See

| Data Point | Visible | Example |
|------------|---------|---------|
| First Name + Last Initial | Yes | "Emma J." |
| Grade | Yes | "3rd Grade" |
| Class/Teacher | Yes | "Mrs. Smith" |
| Reading Progress | Yes | "245 of 300 minutes" |
| Full Name | No | Never exposed |
| Student Username | No | Never exposed |

## Technical Implementation

### Phase 1: Database Function

Create a reusable function to transform names consistently:

```text
safe_display_name("Emma Rose Johnson") → "Emma J."
safe_display_name("Lucas")             → "Lucas"
safe_display_name("Mary Beth Smith")   → "Mary B."
```

The function extracts the first name and the first letter of the last word (if multiple words exist).

### Phase 2: Public-Safe View

Create `children_public_safe` view that:
- Exposes `display_name` (transformed) instead of `name`
- Includes: id, user_id, grade_info, class_name, goal_minutes, total_minutes, homeroom_teacher_id
- Excludes: student_username, student_password_hash

### Phase 3: Frontend Hook Updates

Update data fetching hooks to use safe display names:

| Hook | Current Return | New Return |
|------|----------------|------------|
| `useFamilyChildren` | `name` | `display_name` (safe) |
| `useChildById` | `name` | `display_name` (safe) |

Create new `usePublicChildren` hook that:
- Queries the `children_public_safe` view
- Works for both authenticated and unauthenticated users
- Returns only privacy-safe fields

### Phase 4: Page Updates

Update sponsor-facing pages to use safe display names:

**FamilySponsorPage.tsx changes:**
- Use `display_name` for child cards
- Use first name only for family title ("Support the Johnson Family!" → "Support Emma's Family!")
- When submitting pledges, use safe display name for `student_name` field

**SponsorLandingPage.tsx changes:**
- Use `display_name` in hero section
- Use `display_name` in progress section
- When submitting pledges, use safe display name for `student_name` field

**ChildSelector.tsx changes:**
- Display `display_name` instead of `name`
- Show grade and class info as currently done

### Phase 5: Pledge Storage

When creating pledges, store the safe display name (not full name):

```text
Current:  student_name: "Emma Rose Johnson"
New:      student_name: "Emma J."
```

This ensures even the pledge records maintain privacy.

## Files to Create

| File | Purpose |
|------|---------|
| Database migration | `safe_display_name()` function + `children_public_safe` view |
| `src/hooks/usePublicChildren.ts` | Hook for privacy-safe child data |

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useFamilyChildren.ts` | Query view, return `display_name` |
| `src/hooks/useChildren.ts` | Update `useChildById` for safe names |
| `src/pages/sponsor/FamilySponsorPage.tsx` | Use `display_name` throughout |
| `src/pages/SponsorLandingPage.tsx` | Use `display_name` throughout |
| `src/components/pledge/ChildSelector.tsx` | Display safe name |

## Database Migration SQL

```sql
-- Create safe display name function
CREATE OR REPLACE FUNCTION public.safe_display_name(full_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  parts text[];
  first_name text;
  last_initial text;
BEGIN
  IF full_name IS NULL OR full_name = '' THEN
    RETURN 'Reader';
  END IF;
  
  parts := string_to_array(trim(full_name), ' ');
  first_name := parts[1];
  
  IF array_length(parts, 1) > 1 THEN
    last_initial := left(parts[array_length(parts, 1)], 1) || '.';
    RETURN first_name || ' ' || last_initial;
  ELSE
    RETURN first_name;
  END IF;
END;
$$;

-- Create public-safe view
CREATE VIEW public.children_public_safe AS
SELECT 
  id,
  user_id,
  safe_display_name(name) as display_name,
  grade_info,
  class_name,
  goal_minutes,
  total_minutes,
  share_public_link,
  homeroom_teacher_id
FROM public.children
WHERE share_public_link = true;

-- Grant access
GRANT SELECT ON public.children_public_safe TO anon, authenticated;
```

## User Experience

### Before (Current)
- Sponsors see "Emma Rose Johnson, 3rd Grade"
- Full name stored in pledge records

### After (Privacy-First)
- Sponsors see "Emma J., 3rd Grade"
- Safe name stored in pledge records
- Parents still see full names on their own dashboard (no change to parent views)

## What Stays the Same

- Parents viewing their own children: Full names visible
- Teachers viewing their students: Full names visible  
- Admin dashboard: Full names visible
- Reading logs: Full names visible to parents
- Pledge confirmation emails to parents: Full names (internal)

## Implementation Order

1. Create database function and view
2. Create `usePublicChildren` hook
3. Update `useFamilyChildren` to use safe view for sponsor contexts
4. Update `FamilySponsorPage.tsx` to use safe display names
5. Update `SponsorLandingPage.tsx` to use safe display names
6. Update `ChildSelector.tsx` component
7. Test all sponsor flows end-to-end

