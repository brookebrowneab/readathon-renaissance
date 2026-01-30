
# Refined Plan: Unified Pledge System with Class Fundraising Milestone

## Overview

This refined plan combines multi-target sponsorship (My Children, Another Child, Entire Class) with a **simplified class fundraising milestone system**:

- Each class has a **single $1,000 fundraising goal** (configurable by admin)
- When reached, the class earns a **reward determined by admins** (Extra Recess, Ice Cream Party, Principal Story Time, etc.)
- A **vertical book stack progress indicator** shows fundraising progress on parent and child dashboards
  - Grayscale for the unfunded portion
  - Full color for the funded portion

---

## Part 1: Simplified Class Milestone System

### How It Works

1. **Admin sets the class milestone goal** (default: $1,000) and the **reward description** at the event level
2. All pledges for children in a class contribute to that class's fundraising total
3. Parents and children see a visual "book stack" indicator showing their class's progress toward the goal
4. When a class reaches $1,000, they earn the reward

### Database Changes

#### Option A: Event-Level Settings (Simplest)
Add columns to the `events` table:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| class_milestone_goal | numeric | 1000.00 | Fundraising goal per class |
| class_milestone_reward | text | null | Description of reward (e.g., "Ice Cream Party") |
| class_milestone_enabled | boolean | true | Whether milestone tracking is active |

#### Option B: Per-Class Overrides (More Flexible)
Create a `class_milestones` table for classes that want different goals:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| event_id | uuid (FK) | Active event |
| class_name | text | Class identifier |
| teacher_id | uuid (FK, nullable) | Optional teacher link |
| goal_amount | numeric | Override goal (null = use event default) |
| reward_description | text | Override reward (null = use event default) |
| created_at | timestamp | Creation time |

**Recommendation: Start with Option A** - simpler, covers most use cases. Can add Option B later if needed.

### New Database Function

```text
get_class_fundraising_total(p_class_name text, p_event_id uuid) -> numeric
  
  Returns the total pledged amount for all children in a class.
  Calculates:
  - Flat pledges: Sum of amounts
  - Per-minute pledges: amount × child's total_minutes
  
  This is used for the book stack progress indicator.
```

---

## Part 2: Book Stack Progress Component

### Visual Design

A vertical stack of books (5-6 books) that fills with color as the class progresses toward $1,000:

```text
At 0%:               At 40%:              At 100%:
┌──────────┐         ┌──────────┐         ┌──────────┐
│ [gray]   │         │ [gray]   │         │ [color]  │ ← Book 5
├──────────┤         ├──────────┤         ├──────────┤
│ [gray]   │         │ [gray]   │         │ [color]  │ ← Book 4
├──────────┤         ├──────────┤         ├──────────┤
│ [gray]   │         │ [gray]   │         │ [color]  │ ← Book 3
├──────────┤         ├──────────┤         ├──────────┤
│ [gray]   │         │ [color]  │         │ [color]  │ ← Book 2
├──────────┤         ├──────────┤         ├──────────┤
│ [gray]   │         │ [color]  │         │ [color]  │ ← Book 1
└──────────┘         └──────────┘         └──────────┘
   $0                   $400                 $1,000
```

### Component: `ClassFundraisingStack`

**Props:**
- `fundedAmount: number` - Current class total ($)
- `goalAmount: number` - Target goal (default $1,000)
- `className?: string` - Class name for label
- `size?: 'sm' | 'md' | 'lg'` - Size variants
- `showLabel?: boolean` - Whether to show amount label

**Implementation Notes:**
- Use existing `book-stack.png` or `book-stack-accent.png` asset as base
- Apply CSS filter `grayscale(1)` to unfunded portion
- Use clip-path or layered images to show progress
- Alternative: Build with SVG for precise control and animation

---

## Part 3: Multi-Target Sponsorship Flow

### Step 0: Choose Sponsorship Type

Three cards:

| My Children | Another Child | Entire Class |
|-------------|---------------|--------------|
| Sponsor your own child's reading | Support a child in the program | Pool your pledge for an entire class |

### Path A: My Children (Existing)
- Show parent's children cards
- Proceed to pledge amount

### Path B: Another Child (COPPA-Compliant)
- Show only children with:
  - `share_public_link = true`, OR
  - An invitation sent to this user via `sponsor_invitations` table
- Display: First Name + Last Initial, Grade, Teacher
- Proceed to pledge amount

### Path C: Entire Class
1. Select a class from list showing:
   - Teacher name and grade
   - Current fundraising total vs $1,000 goal
   - Book stack progress indicator (mini version)
   - Number of students
2. Choose pledge type (per-minute or flat)
3. Pledge contributes to class total

---

## Part 4: Dashboard Integration

### Parent Dashboard (ChildProgressCard)

Add book stack indicator to each child's card:

```text
┌─────────────────────────────────────────────┐
│  Emma's Reading                             │
│  ┌───────────┐                              │
│  │ Reading   │    ┌─────┐                   │
│  │ Goal Ring │    │Books│ ← Class Goal      │
│  │  (120px)  │    │Stack│   $420 / $1,000   │
│  └───────────┘    └─────┘                   │
│                                              │
│  [Personal Stats]  [Class Stats]            │
│  [Actions: Details | Log]                   │
└─────────────────────────────────────────────┘
```

### Student Dashboard

Add book stack indicator next to or below the main ReadingGoalRing:

```text
┌─────────────────────────────────────────────┐
│  Hi, Emma! 📚                               │
│                                              │
│  ┌──────────────────┐    ┌─────────────────┐│
│  │  Reading Ring    │    │  Class Goal     ││
│  │  247 minutes!    │    │  [Book Stack]   ││
│  │  So close! ✨    │    │  $650 / $1,000  ││
│  └──────────────────┘    │  Ice Cream! 🍦  ││
│                          └─────────────────┘│
│  5 people cheering you on!                  │
│  [I Read Today! button]                     │
└─────────────────────────────────────────────┘
```

---

## Part 5: Admin Configuration

### Admin Settings Page - New Section

Add "Class Milestone" section:

```text
┌─────────────────────────────────────────────┐
│  Class Milestone                            │
│                                              │
│  Enable Class Milestones: [Toggle ON/OFF]   │
│                                              │
│  Fundraising Goal: [$1,000]                 │
│  (Amount each class needs to raise)         │
│                                              │
│  Milestone Reward:                          │
│  [Ice Cream Party in the Spring 🍦]         │
│  (What classes earn when they reach goal)   │
└─────────────────────────────────────────────┘
```

---

## Part 6: Required Database Tables

### 1. `sponsor_invitations` (for "Another Child" discovery)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| child_id | uuid (FK) | Child being sponsored |
| inviter_user_id | uuid | Parent who sent invitation |
| invitee_email | text | Email of invited sponsor |
| invitee_user_id | uuid (nullable) | Linked after signup |
| status | text | 'pending', 'accepted', 'declined' |
| created_at | timestamp | When sent |

### 2. `class_pledges` (for "Entire Class" pooled pledges)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| sponsor_user_id | uuid (FK) | Who pledged |
| class_name | text | Class identifier |
| teacher_id | uuid (FK, nullable) | Optional teacher link |
| event_id | uuid (FK) | Active event |
| pledge_type | text | 'flat' or 'per_minute' |
| amount | numeric | Pledge amount |
| max_cap | numeric (nullable) | Optional max |
| is_paid | boolean | Payment status |
| payment_status | text | 'pending', 'paid', 'cancelled' |
| created_at | timestamp | Creation time |

### 3. Events table additions

Add to existing `events` table:
- `class_milestone_goal` (numeric, default 1000.00)
- `class_milestone_reward` (text, nullable)
- `class_milestone_enabled` (boolean, default true)

---

## Part 7: New Files Summary

### Hooks
| File | Purpose |
|------|---------|
| `src/hooks/useSponsorInvitations.ts` | Track sponsor invitations |
| `src/hooks/useSponsorableChildren.ts` | Fetch COPPA-compliant child list |
| `src/hooks/useClassPledges.ts` | Class-level pledges |
| `src/hooks/useClassFundraising.ts` | Get class fundraising totals |

### Components
| File | Purpose |
|------|---------|
| `src/components/ui/class-fundraising-stack.tsx` | Book stack progress indicator |
| `src/components/pledge/SponsorTypeSelector.tsx` | Step 0 type selection |
| `src/components/pledge/ChildSelector.tsx` | Child selection for Paths A & B |
| `src/components/pledge/ClassSelector.tsx` | Class selection for Path C |

### Modified Files
| File | Changes |
|------|---------|
| `src/pages/family/SponsorMyChildPage.tsx` | Complete rewrite with 3-path flow |
| `src/pages/DashboardPage.tsx` | Add book stack to ChildProgressCard |
| `src/pages/student/StudentDashboardPage.tsx` | Add book stack indicator |
| `src/pages/admin/AdminSettingsPage.tsx` | Add Class Milestone settings section |

---

## Part 8: Implementation Phases

### Phase 1: Database Foundation
1. Add milestone columns to `events` table
2. Create `sponsor_invitations` table with RLS
3. Create `class_pledges` table with RLS
4. Create `get_class_fundraising_total` RPC function

### Phase 2: Book Stack Component
5. Create `ClassFundraisingStack` component
6. Add to parent dashboard (ChildProgressCard)
7. Add to student dashboard

### Phase 3: Admin Configuration
8. Add Class Milestone section to Admin Settings
9. Create `useClassFundraising` hook

### Phase 4: Multi-Target Pledge Flow
10. Create sponsor hooks (invitations, sponsorable children, class pledges)
11. Build pledge flow components
12. Rewrite SponsorMyChildPage with 3-path flow
13. Add navigation state for "Back to Dashboard" link

### Phase 5: Polish
14. Add celebration animation when class reaches goal
15. Test all paths end-to-end

---

## Technical Notes

### Calculating Class Fundraising Total

The RPC function `get_class_fundraising_total` calculates:

```sql
SELECT COALESCE(
  SUM(
    CASE 
      WHEN p.pledge_type = 'flat' THEN p.amount
      WHEN p.pledge_type = 'per_minute' THEN 
        p.amount * COALESCE(c.total_minutes, 0)
      ELSE 0
    END
  ), 0
) AS total
FROM pledges p
JOIN children c ON p.child_id = c.id
WHERE c.class_name = p_class_name
  AND (p.event_id = p_event_id OR p.event_id IS NULL);
```

Plus any direct class pledges from `class_pledges` table.

### Book Stack Progress Calculation

```typescript
const percentage = (fundedAmount / goalAmount) * 100;
const filledBooks = Math.ceil((percentage / 100) * totalBooks);
```

### COPPA Compliance

- Other children displayed as "First Name + Last Initial" only
- Discovery limited to public opt-in or direct invitation
- No direct sponsor-to-child communication
