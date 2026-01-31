
# Plan: Configurable Per-Grade Reading Log Verification System

**Status: ✅ Implemented**

## Overview

Create a verification system where:
- Admins set per-grade minute thresholds (e.g., 90 mins for K, 120 mins for 5th grade)
- When students log/edit reading that exceeds their grade's threshold, a verification request is created
- Parents see pending verifications in their dashboard and can approve/dismiss them
- If a log is edited to fall below threshold, its verification request is automatically removed

---

## Implementation Summary

### Database Changes ✅
- Added `log_verification_enabled` (boolean) to `events` table
- Added `log_verification_thresholds` (JSONB) to `events` table
- Created `log_verification_requests` table with RLS policies
- Created `get_verification_threshold()` function
- Created `manage_log_verification()` trigger on `reading_logs`

### Hooks Created ✅
- `src/hooks/useLogVerificationRequests.ts` - Fetch/update verification requests
- `src/hooks/useLogVerificationThresholds.ts` - Admin CRUD for thresholds

### Admin Settings UI ✅
- Created `src/components/admin/LogVerificationSettings.tsx`
- Added to Admin Settings page after "Teacher Reading Log Permissions"

### Student Dashboard ✅
- Shows "Pending" badge on logs that need parent verification
- Verification statuses refresh after log insert/edit/delete

---

## Remaining Work (Future)

### Parent Dashboard Changes
- Add notification badge showing pending verification count
- Add verification approval UI to Child Details page
- Replace mock notifications in MainNav with real data

---

## User Flow

### Admin Flow
1. Go to Admin Settings
2. Enable "Require parent verification for long sessions"
3. Set default threshold (e.g., 90 minutes)
4. Optionally set grade-specific thresholds
5. Save

### Student Flow
1. Log reading of 150 minutes (exceeds threshold)
2. System creates verification request automatically
3. Student sees "Pending" badge on that log
4. Student can still edit the log
5. If edited to 60 minutes (below threshold), request auto-deletes
6. If edited to 180 minutes, request updates (not duplicated)

### Parent Flow (Future)
1. See notification badge "1 log to verify"
2. Click to view pending requests
3. See: "Emma logged 150 minutes on Jan 30 reading 'Charlotte's Web'"
4. Click "Approve" → request marked approved
5. Or click "Dismiss" → request marked dismissed
