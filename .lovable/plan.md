
# Plan: Configurable Per-Grade Reading Log Verification System

## Overview

Create a verification system where:
- Admins set per-grade minute thresholds (e.g., 90 mins for K, 120 mins for 5th grade)
- When students log/edit reading that exceeds their grade's threshold, a verification request is created
- Parents see pending verifications in their dashboard and can approve/dismiss them
- If a log is edited to fall below threshold, its verification request is automatically removed

---

## Database Changes

### 1. New Column on Events Table
Add a JSONB column to store per-grade verification thresholds:

```text
┌─────────────────────────────────────────┐
│ events table (add column)               │
├─────────────────────────────────────────┤
│ log_verification_thresholds JSONB       │
│   default: {}                           │
│   example: {"K": 60, "1st": 90,         │
│             "5th": 120, "default": 90}  │
└─────────────────────────────────────────┘
```

### 2. New Table: log_verification_requests
Tracks logs that need parent verification:

```text
┌─────────────────────────────────────────┐
│ log_verification_requests               │
├─────────────────────────────────────────┤
│ id              UUID PK                 │
│ reading_log_id  UUID FK → reading_logs  │
│ child_id        UUID FK → children      │
│ minutes         INTEGER                 │
│ threshold_at_time INTEGER               │
│ status          TEXT ('pending','approved','dismissed')
│ created_at      TIMESTAMPTZ             │
│ reviewed_at     TIMESTAMPTZ             │
│ reviewed_by     UUID                    │
└─────────────────────────────────────────┘
```

### 3. Database Function: check_log_verification_needed
A function that:
- Looks up the child's grade
- Gets the threshold for that grade from the active event
- Returns whether verification is needed

### 4. Database Trigger: manage_log_verification
On INSERT/UPDATE to reading_logs:
- **INSERT**: If minutes exceed threshold → create verification request
- **UPDATE**: 
  - If minutes now exceed threshold but no request exists → create request
  - If minutes now below threshold and request exists → delete request
- **DELETE**: Remove any associated verification request

---

## Admin Settings UI Changes

### New Section: "Reading Log Verification"
Location: Admin Settings page, after "Teacher Reading Log Permissions"

Features:
- Toggle: "Require parent verification for long reading sessions"
- Default threshold input (applies to grades without specific setting)
- Per-grade threshold override:
  - List each grade with input field
  - Ability to set different thresholds per grade
  - Clear "use default" option

Example UI layout:
```text
┌────────────────────────────────────────────────────┐
│ 📋 Reading Log Verification                        │
├────────────────────────────────────────────────────┤
│ [✓] Require parent verification for long sessions  │
│                                                    │
│ Default threshold: [90] minutes                    │
│                                                    │
│ Per-grade overrides:                               │
│   K        [60] min  (younger kids, lower limit)   │
│   1st      [60] min                                │
│   2nd      [—] use default                         │
│   3rd      [—] use default                         │
│   4th      [—] use default                         │
│   5th      [120] min (older kids can read longer)  │
└────────────────────────────────────────────────────┘
```

---

## Parent Dashboard Changes

### Notification Badge Integration
Replace mock notification data with real queries:
- Query `log_verification_requests` WHERE status = 'pending'
- Count pending requests per child
- Show in notification bell

### Verification UI
Add to Child Details page or new dedicated page:
- List of pending verification requests
- For each: show date, book title, minutes logged
- Actions: "Approve" (marks as approved) or "Dismiss" (marks as dismissed, doesn't count toward verified total)

---

## Student Dashboard Edit Logic

### When Student Edits a Log
Modify `handleEditLog` in StudentPinDashboardPage:

1. After successful edit, call a function to check verification need
2. The database trigger handles the logic automatically:
   - If new minutes > threshold: creates/updates verification request
   - If new minutes ≤ threshold: deletes existing request if any

### Visual Indicator
Show students when a log is "pending parent review":
- Small badge/icon on logs that have pending verification
- Tooltip: "Your parent needs to approve this entry"

---

## Technical Implementation

### Files to Create
1. **Database migration** - New column and table with RLS policies
2. **`src/hooks/useLogVerificationRequests.ts`** - Fetch pending verification requests
3. **`src/hooks/useLogVerificationThresholds.ts`** - Admin CRUD for thresholds
4. **`src/components/family/PendingLogVerifications.tsx`** - Parent UI component

### Files to Modify
1. **`src/pages/admin/AdminSettingsPage.tsx`** - Add threshold configuration section
2. **`src/hooks/useEventSettings.ts`** - Add threshold fields to update logic
3. **`src/pages/student/StudentPinDashboardPage.tsx`** - Show verification status on logs
4. **`src/pages/family/ChildDetailsPage.tsx`** - Add verification approval UI
5. **`src/components/layout/MainNav.tsx`** - Replace mock notifications with real data

### RLS Policies for log_verification_requests
- Parents can SELECT/UPDATE requests for their children
- Admins have full access
- No public access

---

## User Flow

### Admin Flow
1. Go to Admin Settings
2. Enable "Require parent verification"
3. Set default threshold (e.g., 90 minutes)
4. Optionally set grade-specific thresholds
5. Save

### Student Flow
1. Log reading of 150 minutes (exceeds threshold)
2. System creates verification request automatically
3. Student sees "Pending parent review" badge on that log
4. Student can still edit the log
5. If edited to 60 minutes (below threshold), request auto-deletes
6. If edited to 180 minutes, request updates (not duplicated)

### Parent Flow
1. See notification badge "1 log to verify"
2. Click to view pending requests
3. See: "Emma logged 150 minutes on Jan 30 reading 'Charlotte's Web'"
4. Click "Approve" → request marked approved, counts toward verified total
5. Or click "Dismiss" → request marked dismissed, parent can investigate

---

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| No threshold set for grade | Uses default threshold |
| No default set | Verification disabled for that grade |
| Log edited multiple times | Single request updated, not duplicated |
| Log deleted | Associated request auto-deleted |
| Parent already verified child's total | Logs still flagged but parent sees "already verified" context |

---

## Summary of Changes

| Component | Change Type |
|-----------|-------------|
| events table | Add JSONB column |
| log_verification_requests | New table + RLS |
| Database trigger | New function |
| Admin Settings | New section |
| useEventSettings | Extended interface |
| StudentPinDashboard | Visual indicators |
| ChildDetailsPage | Approval UI |
| MainNav | Real notifications |
| New hooks (2) | Verification data management |
