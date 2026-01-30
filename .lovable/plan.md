

# Differentiated Teacher Dashboard Views

## Overview

This plan implements role-specific views for different teacher types on the teacher dashboard. Currently, all teachers see students filtered by RLS policies, but the UI doesn't adapt to the different contexts teachers work in.

## Teacher View Requirements

| Teacher Type | Access Scope | UI Behavior |
|-------------|--------------|-------------|
| **Homeroom** | Own students only | Current behavior - see assigned students |
| **Partner (single homeroom)** | Single homeroom's students | Same view as homeroom teacher |
| **Partner (multiple homerooms)** | All students in assigned grades | See all grade students, can filter by class |
| **Staff** | Whole school | See all students, can filter by grade AND class |

## Technical Implementation

### 1. Database Changes

Add a `grade_level` column to the `teachers` table to track which grade a partner teacher is assigned to:

```sql
ALTER TABLE public.teachers 
ADD COLUMN grade_level text;

COMMENT ON COLUMN public.teachers.grade_level IS 
'Grade level for partner teachers assigned to an entire grade (e.g., "1st", "2nd")';
```

### 2. Update RLS Function

Modify `can_teacher_view_child` to support grade-level partner teachers:

```sql
CREATE OR REPLACE FUNCTION public.can_teacher_view_child(teacher_user_id UUID, child_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM teachers t
    JOIN children c ON c.id = child_id
    WHERE t.user_id = teacher_user_id
    AND t.is_active = true
    AND (
      -- Staff/librarian with full access can see everyone
      t.has_full_access = true
      -- Homeroom teacher can see their students
      OR c.homeroom_teacher_id = t.id
      -- Partner teacher assigned to specific homerooms
      OR c.homeroom_teacher_id IN (
        SELECT tca.homeroom_teacher_id 
        FROM teacher_class_assignments tca 
        WHERE tca.teacher_id = t.id
      )
      -- Partner teacher assigned to entire grade (no specific homeroom assignments)
      OR (
        t.teacher_type = 'partner' 
        AND t.grade_level IS NOT NULL
        AND c.grade_info = t.grade_level
        AND NOT EXISTS (
          SELECT 1 FROM teacher_class_assignments tca 
          WHERE tca.teacher_id = t.id
        )
      )
    )
  )
$$;
```

### 3. Update Teacher Auth Hook

Extend `useTeacherAuth` to include the new grade_level field:

```typescript
// src/hooks/useTeacherAuth.ts
export interface TeacherProfile {
  id: string;
  name: string;
  email: string | null;
  teacher_type: "homeroom" | "partner" | "specials" | "staff";
  has_full_access: boolean;
  is_active: boolean;
  grade_level: string | null;  // NEW
}
```

### 4. Update Teacher Students Hook

Add class and grade information to support filtering:

```typescript
// src/hooks/useTeacherStudents.ts
export const useTeacherStudents = () => {
  // ... existing code ...
  
  // Derive unique grades and classes from students
  const uniqueGrades = [...new Set(students.map(s => s.grade_info).filter(Boolean))];
  const uniqueClasses = [...new Set(students.map(s => s.class_name).filter(Boolean))];
  
  return {
    students,
    uniqueGrades,
    uniqueClasses,
    // ... rest
  };
};
```

### 5. Update Teacher Dashboard UI

Add conditional filter controls based on teacher type:

**Header Changes:**
- Show grade context for grade-level partner teachers
- Show "All Students" context for staff

**Filter Bar Changes:**
```text
┌─────────────────────────────────────────────────────────────────────┐
│ [Search...]  [Sort ▼]  [Status ▼]  [Grade ▼]*  [Class ▼]*          │
└─────────────────────────────────────────────────────────────────────┘
* Grade filter: Only shown for staff (has_full_access = true)
* Class filter: Shown for staff AND grade-level partner teachers
```

**Component Logic:**
```typescript
// Determine what filters to show
const showGradeFilter = teacherProfile?.has_full_access;
const showClassFilter = teacherProfile?.has_full_access || 
  (teacherProfile?.teacher_type === 'partner' && uniqueClasses.length > 1);
```

### 6. Admin Teacher Management Updates

Update the admin UI to support grade-level partner teacher configuration:

- Add "Grade Level" dropdown when editing partner teachers
- Show assignment mode choice: "Specific Homerooms" vs "Entire Grade"
- Validate: grade_level should be null if teacher has specific homeroom assignments

## User Experience Flow

```text
Partner Teacher Login Flow:
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  ┌──────────────────┐    ┌──────────────────────────────────┐ │
│  │ Has homeroom     │ NO │ Has grade_level set?             │ │
│  │ assignments?     ├────►│                                  │ │
│  └────────┬─────────┘    └──────────────┬───────────────────┘ │
│           │ YES                         │                     │
│           ▼                             ▼ YES                 │
│  ┌────────────────────┐    ┌──────────────────────────────┐  │
│  │ Show students from │    │ Show ALL students in that    │  │
│  │ assigned homerooms │    │ grade with class filter      │  │
│  └────────────────────┘    └──────────────────────────────┘  │
│                                         │ NO                  │
│                                         ▼                     │
│                            ┌──────────────────────────────┐  │
│                            │ Empty state: No students     │  │
│                            │ (needs admin configuration)  │  │
│                            └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Files to Modify

| File | Changes |
|------|---------|
| Database migration | Add `grade_level` column, update RLS function |
| `src/hooks/useTeacherAuth.ts` | Add grade_level to TeacherProfile interface |
| `src/hooks/useTeachers.ts` | Add grade_level to Teacher interface and mutations |
| `src/hooks/useTeacherStudents.ts` | Return unique grades and classes for filtering |
| `src/pages/teacher/TeacherDashboard.tsx` | Add grade/class filter dropdowns, conditional UI |
| `src/components/admin/TeacherManagement.tsx` | Add grade level selection for partner teachers |

## Edge Cases

1. **Partner teacher with no assignments and no grade_level**: Show empty state with message to contact admin
2. **Staff viewing large school**: Implement pagination or virtual scrolling if needed
3. **Grade names vary**: Use existing `grade_info` values from children table for consistency

