

# Read-a-thon Lifecycle States and Admin Data Management (Revised)

## Overview

This plan introduces an expanded event lifecycle with four distinct phases, timezone-aware automatic transitions, flexible sign-up windows, end-of-event winner announcements, verified totals tracking, and a comprehensive admin data exploration/correction panel.

---

## Part 1: Event Lifecycle States (Revised)

### Updated Sign-Up Policy

**Sign-ups are open anytime before the end date**, including:
- Before the event starts (pre-registration)
- During the active reading period

This allows families to join the read-a-thon at any point while reading is still happening.

### Revised 4-Phase Lifecycle

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            READ-A-THON TIMELINE                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                      START_DATE       END_DATE        LAST_LOG_DATE             │
│                      (midnight)      (11:59pm)        (11:59pm)                 │
│                          ▼               ▼                ▼                     │
│   ───────────────────────●───────────────●────────────────●────────▶ time       │
│                          │               │                │                     │
│      [PRE-EVENT]     [ACTIVE]      [GRACE_PERIOD]     [CLOSED]                  │
│                                                                                  │
│   • Sign-ups ✓        • Sign-ups ✓     • Sign-ups ✗      • No sign-ups          │
│   • Pledges ✓         • Pledges ✓      • Pledges ✓       • No pledges           │
│   • No logging        • All logging    • Students OFF    • No logging           │
│   • Teacher setup     • Everyone can   • Parents ON      • Winners announced    │
│                         log reading    • Validation ON   • Payments due         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Phase Definitions:**

| Phase | Condition | Sign-ups | Pledges | Logging | Notes |
|-------|-----------|----------|---------|---------|-------|
| `setup` | No active event | - | - | - | Admin configuration only |
| `pre_event` | Before start_date | Yes | Yes | No | Registration, teacher activation |
| `active` | start_date to end_date (11:59pm) | Yes | Yes | Everyone | Full reading period |
| `grace_period` | end_date to last_log_date (11:59pm) | No | Yes | Parents only | Catch-up and validation |
| `closed` | After last_log_date | No | No new | No | Results and payment collection |

### Technical Implementation

#### 1. Database Changes

Add timezone support column to `events` table:
```sql
ALTER TABLE events 
ADD COLUMN timezone TEXT NOT NULL DEFAULT 'America/New_York';
```

#### 2. New Event Status Hook

Create `src/hooks/useEventStatus.ts`:
```typescript
export type EventPhase = 'setup' | 'pre_event' | 'active' | 'grace_period' | 'closed';

export interface EventStatus {
  phase: EventPhase;
  
  // Permissions
  canSignUp: boolean;           // true during pre_event and active
  canMakePledges: boolean;      // true during pre_event, active, grace_period
  canStudentsLog: boolean;      // true only during active
  canParentsLog: boolean;       // true during active and grace_period
  canTeachersLog: boolean;      // true during active (grade-restricted)
  
  // Derived states
  isLoggingOpen: boolean;       // anyone can log
  isPaymentsDue: boolean;       // event is closed
  
  // Countdowns
  daysUntilStart: number;
  daysUntilEnd: number;
  daysUntilClose: number;
  
  // Valid date range for logging
  validLogDates: { start: Date; end: Date } | null;
}
```

The hook will:
- Parse dates with timezone awareness (EST/EDT)
- Apply cutoffs: midnight for start, 11:59:59pm for end/last_log
- Return computed permissions for UI decisions

#### 3. Update Logging Pages

**Parent Log Reading (`LogReadingPage.tsx`):**
- Check `canParentsLog` from `useEventStatus`
- During `grace_period`, restrict date picker to `validLogDates` range only
- Show "Reading period has ended" message when in `pre_event`
- Show "Final logging deadline passed" when in `closed`

**Student Log Reading (`StudentLogReadingPage.tsx`):**
- Check `canStudentsLog`
- Block access during `pre_event`: "Reading starts on [date]!"
- Block access during `grace_period`: "Time's up! Ask your parent to log any remaining minutes."
- Block access during `closed`: "This year's read-a-thon is complete!"

**Teacher Log Reading (`TeacherLogReading.tsx`):**
- Check `canTeachersLog` (combines phase check with grade permissions)
- Same blocking messages as student

#### 4. Update Registration/Sign-up Pages

- Check `canSignUp` before allowing new registrations
- During `grace_period` or `closed`: show message "Registration for this read-a-thon has ended"
- Link to contact admin if someone needs to register late

#### 5. UI Phase Indicators

Update dashboards to show phase-specific messaging:

| Phase | Parent Dashboard | Student Dashboard | Admin Dashboard |
|-------|------------------|-------------------|-----------------|
| `pre_event` | "Starts [date] - Get sponsors now!" | "Reading starts [date]!" | "X families registered" |
| `active` | "X days left to read!" | "Keep reading!" | "X minutes logged today" |
| `grace_period` | "Final chance to log - ends [date]" | "Time's up!" | "Awaiting final logs" |
| `closed` | "Results are in!" | "You read X minutes!" | "Collect payments" |

---

## Part 2: Winner Tracking and Verification

### Database Changes

```sql
-- Track verified totals per child
ALTER TABLE children 
ADD COLUMN total_verified BOOLEAN DEFAULT false,
ADD COLUMN verified_at TIMESTAMPTZ,
ADD COLUMN verified_by UUID REFERENCES auth.users(id);

-- Track event winners
CREATE TABLE event_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  grade_info TEXT NOT NULL,
  winner_type TEXT NOT NULL CHECK (winner_type IN ('student', 'class')),
  child_id UUID REFERENCES children(id),
  class_name TEXT,
  total_minutes INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, grade_info, winner_type)
);
```

### Winner Calculation

When event enters `closed` state:

1. **Per-Grade Student Winners:**
   - Only students with `total_verified = true` are eligible
   - Highest `total_minutes` per grade wins
   - Ties: all tied students listed as co-winners

2. **Per-Grade Class Winners:**
   - Sum of all student minutes per class
   - Highest class total per grade wins

### Verification Flow

**Parent Verification:**
- Checkbox on child profile: "I confirm these reading minutes are accurate"
- Required for winner eligibility

**Admin Verification:**
- Bulk verify from admin panel
- Can verify/unverify any student
- Override capability for edge cases

---

## Part 3: Admin Data Management Panel

### New Route: `/admin/data`

Four-tab interface for data exploration and correction:

### Tab 1: Students & Reading Logs

**Search Interface:**
- Search by student name, parent email, class, or grade
- Filter by: has unverified logs, high-value entries, recent activity

**Student Card View:**
```
┌───────────────────────────────────────────────────────────────┐
│ 🔍 Search students: [________________________]                │
├───────────────────────────────────────────────────────────────┤
│ Emma Johnson                                          [Edit]  │
│ Room 204 • 3rd Grade • Mrs. Smith                            │
│ Total: 1,247 min | Goal: 500 | Verified: ❌                   │
│ Parent: Sarah Johnson (sarah@example.com)                    │
├───────────────────────────────────────────────────────────────┤
│ Reading Logs:                                                 │
│ ┌────────┬─────────┬─────────────────┬──────────┬──────────┐ │
│ │ Date   │ Minutes │ Book            │ Logger   │ Actions  │ │
│ ├────────┼─────────┼─────────────────┼──────────┼──────────┤ │
│ │ Mar 10 │ 480 ⚠️  │ —               │ Student  │ [✏️] [🗑️]│ │
│ │ Mar 9  │ 45      │ Harry Potter    │ Parent   │ [✏️] [🗑️]│ │
│ │ Mar 8  │ 30      │ Harry Potter    │ Parent   │ [✏️] [🗑️]│ │
│ └────────┴─────────┴─────────────────┴──────────┴──────────┘ │
│ ⚠️ = Over 120 minutes (flagged for review)                   │
│                                                               │
│ [Verify Total] [Recalculate Total] [View Parent Account]      │
└───────────────────────────────────────────────────────────────┘
```

**Admin Actions:**
- Edit log entry (minutes, date, book)
- Delete log entry
- Verify/unverify student total
- Recalculate cached `total_minutes` from actual logs

### Tab 2: Pledges

**Search Interface:**
- Search by sponsor name, student name, or email
- Filter by: unpaid, paid, flagged amounts, per-minute, fixed

**Pledge Management:**
```
┌───────────────────────────────────────────────────────────────┐
│ 🔍 Search pledges: [________________________]                 │
├───────────────────────────────────────────────────────────────┤
│ Grandma Smith → Emma Johnson                                  │
│ Type: Per-minute ($0.10/min) | Est. Total: $124.70           │
│ Status: Unpaid ⚠️ Unusually high rate                        │
│ [Edit Amount] [Mark Paid] [Delete]                            │
├───────────────────────────────────────────────────────────────┤
│ Uncle Bob → Emma Johnson                                      │
│ Type: Fixed ($500) ⚠️ Over $100                              │
│ Status: Paid                                                  │
│ [Edit Amount] [Mark Unpaid] [Delete]                          │
└───────────────────────────────────────────────────────────────┘
```

**Flagging Rules:**
- Per-minute rate > $0.50/min
- Fixed pledge > $100
- Any pledge > $500 (likely typo)

### Tab 3: User Accounts

**Search Interface:**
- Search by name, email, or child name
- Filter by: role (parent, sponsor, teacher, admin), has issues

**Account Management:**
```
┌───────────────────────────────────────────────────────────────┐
│ 🔍 Search users: [________________________]                   │
├───────────────────────────────────────────────────────────────┤
│ Sarah Johnson (sarah@example.com)                             │
│ Role: Parent | Children: Emma Johnson, Jack Johnson           │
│ Last login: March 10, 2026                                    │
│ [Send Password Reset] [View Children] [View Pledges]          │
├───────────────────────────────────────────────────────────────┤
│ Bob Smith (bob@example.com)                                   │
│ Role: Sponsor ⚠️ (may need to be Parent)                     │
│ Sponsoring: Emma Johnson                                      │
│ [Send Password Reset] [Convert to Parent] [View Pledges]      │
└───────────────────────────────────────────────────────────────┘
```

**Account Actions:**
- Send password reset email (uses Supabase auth flow)
- Convert sponsor to parent (creates profile, links children)
- Merge duplicate accounts
- View all related data (children, pledges, logs)

### Tab 4: Quick Fixes

Common scenarios with guided workflows:

| Issue | Steps |
|-------|-------|
| "Student logged too many minutes" | Search → Select log → Edit or delete |
| "Sponsor pledged wrong amount" | Search → Select pledge → Edit amount |
| "Can't find my account" | Search by child name → Show parent email |
| "Registered as sponsor, is actually parent" | Find account → Convert role |
| "Forgot password" | Find account → Send reset email |
| "Duplicate accounts" | Find both → Merge into primary |

---

## Part 4: Per-Minute Payment Finalization

### Current Issue
Per-minute pledges can't be paid until the final total is known.

### Solution

Add column to pledges:
```sql
ALTER TABLE pledges 
ADD COLUMN final_amount NUMERIC,
ADD COLUMN finalized_at TIMESTAMPTZ;
```

**When event enters `closed` state:**
1. Calculate final amounts for all per-minute pledges
2. Store in `final_amount` column
3. Set `finalized_at` timestamp
4. Sponsor payment page shows final amount
5. "Pay Now" enabled for all pledges

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/hooks/useEventStatus.ts` | Phase calculation and permissions |
| `src/pages/admin/AdminDataPage.tsx` | Main data management page |
| `src/components/admin/StudentDataExplorer.tsx` | Student/log search and edit |
| `src/components/admin/PledgeDataExplorer.tsx` | Pledge management |
| `src/components/admin/UserAccountManager.tsx` | Account fixes |
| `src/components/admin/QuickFixesPanel.tsx` | Common issue workflows |
| `src/components/admin/WinnersPanel.tsx` | Winner display |

### Modified Files
| File | Changes |
|------|---------|
| `src/hooks/useActiveEvent.ts` | Add timezone field to type |
| `src/pages/LogReadingPage.tsx` | Phase-based access, date restrictions |
| `src/pages/student/StudentLogReadingPage.tsx` | Phase blocking with messages |
| `src/pages/teacher/TeacherLogReading.tsx` | Phase blocking |
| `src/pages/auth/RegisterPage.tsx` | Check `canSignUp` |
| `src/pages/onboarding/*.tsx` | Check `canSignUp` |
| `src/components/layout/AdminSidebar.tsx` | Add "Data Explorer" link |
| `src/pages/admin/AdminSettingsPage.tsx` | Add timezone selector |
| `src/App.tsx` | Add `/admin/data` route |

### Database Migrations
1. Add `timezone` to events table
2. Add verification columns to children table
3. Create `event_winners` table with RLS
4. Add `final_amount` and `finalized_at` to pledges table

---

## Implementation Priority

**Phase 1: Event Status System**
1. Database: Add timezone column
2. Create `useEventStatus` hook with all permission flags
3. Update logging pages with phase checks
4. Update sign-up pages with `canSignUp` check
5. Add phase indicators to dashboards

**Phase 2: Admin Data Management**
1. Create AdminDataPage with tab structure
2. Build StudentDataExplorer with search and edit
3. Build PledgeDataExplorer with flagging
4. Build UserAccountManager with password reset
5. Add QuickFixesPanel

**Phase 3: Winner System**
1. Database: verification columns and winners table
2. Parent verification UI
3. Admin verification and calculation
4. Results display

**Phase 4: Payment Finalization**
1. Add final_amount to pledges
2. Implement close-event calculation
3. Update payment pages

