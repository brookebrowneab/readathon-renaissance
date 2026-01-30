
# Enhanced Parent Dashboard Cleanup Plan

## Overview
This comprehensive plan consolidates the parent experience by simplifying pledge management, unifying child settings, reducing navigation complexity, and adding new features for class/grade progress, inline log editing, validation, and enhanced child account management. The goal is to make the parent dashboard more intuitive while maintaining clear separation between parent-owned children and sponsor-only views.

---

## Summary of All Changes

| Area | Current State | Solution |
|------|---------------|----------|
| My Pledges | Parents can mark pledges paid/unpaid | Remove payment status controls, add "Pay Now" with event status logic |
| Child Details | Links to separate Settings page with mock data | Add inline EditChildDialog, class/grade progress, inline log editing |
| Account Page | Only profile and password settings | Add Children's Accounts section with full management |
| Navigation | Too many clicks to reach settings | Streamline from dashboard to details |
| Sponsor View | N/A | Verify proper read-only separation |
| Reading Logs | View only on details page | Add inline editing and validation checkboxes |
| Delete Child | Not available in UI | Add to Account page with cascade handling |

---

## Phase 1: My Pledges Page - Payment Controls Update

**File:** `src/pages/MyPledgesPage.tsx`

### Changes Required:

1. **Remove Admin-Only Payment Controls**
   - Remove "Mark as Paid" and "Mark as Unpaid" buttons
   - Remove `handleMarkPaidClick`, `handleConfirmMarkPaid`, and `handleMarkUnpaid` functions
   - Remove `markPaidDialogOpen`, `pledgeToMarkPaid` state
   - Remove the `ConfirmDialog` for marking paid

2. **Add "Pay Now" Button with Event Status Logic**
   - Import `useEventStatus` hook to check if read-a-thon is closed
   - Add "Pay Now" button that is:
     - **Always enabled** for `flat` (one-time) pledges that are unpaid
     - **Only enabled when event is `closed`** for `per_minute` pledges
     - **Disabled/hidden** for already paid pledges
   - Link "Pay Now" to `/sponsor/pay?pledge={pledgeId}`

3. **Display Logic**
   - Show payment status as read-only badge (Paid/Pending)
   - For per-minute pledges during active event: show "Final amount calculated when read-a-thon ends"
   - Paid pledges show "Paid" badge, no actions available

### New Payment Button Logic:
```typescript
const { phase, isPaymentsDue } = useEventStatus();

const canPayNow = (pledge: ParentPledge) => {
  if (pledge.is_paid) return false;
  if (pledge.pledge_type === "flat") return true;
  if (pledge.pledge_type === "per_minute") return isPaymentsDue; // only when closed
  return false;
};
```

---

## Phase 2: Enhance ChildDetailsPage

**File:** `src/pages/family/ChildDetailsPage.tsx`

### 2a. Add Class and Grade Reading Progress

**New imports:**
- `useClassGradeTotals` hook for aggregated stats
- `useClassReadingStats` for detailed class info

**New UI Section** (between Reading Progress and Reading Log):
```text
+------------------------------------------+
|  Community Progress                      |
|  +----------------+ +------------------+ |
|  | Class Total    | | Grade Total      | |
|  | Mrs. Smith     | | 3rd Grade        | |
|  | 4,520 min      | | 12,340 min       | |
|  | 24 students    | | 89 students      | |
|  +----------------+ +------------------+ |
+------------------------------------------+
```

### 2b. Inline Reading Log Editing

**Changes to Reading History section:**
- Replace simple log display with `ReadingLogsTable` component (already exists)
- Add edit icons to each log entry
- Import `useReadingLogs` for mutation access
- On edit: show inline inputs for minutes and book title
- On save: call `updateLog.mutate()`
- On delete: call `deleteLog.mutate()`

### 2c. Reading Log Validation Feature

**New functionality:**
- Add checkbox next to each reading log entry
- Checkbox toggles a "verified" state
- Verified logs get a checkmark badge
- Add "Select All" and "Validate Selected" bulk actions
- Store validation in database fields (`verified_at`, `verified_by`)

**New UI pattern:**
```text
[ ] 30 min - "Charlotte's Web" - Jan 15  [Edit] [Delete]
[x] 45 min - "Magic Tree House" - Jan 14 ✓Verified
```

**Note:** This requires checking if reading_logs table has `verified_at` and `verified_by` columns. Currently, children table has these for child-level verification, but log-level verification may need a migration.

### 2d. Replace Settings Link with Inline Dialog

**Changes:**
- Import `EditChildDialog` component
- Add state: `editDialogOpen`, `selectedChild`
- Change Settings button to open dialog instead of navigating
- Add ownership check to show/hide edit capabilities

### 2e. Add Link to Account Page for Student Login Settings

**New sidebar quick action:**
```typescript
<Button variant="outline" className="w-full justify-start" asChild>
  <Link to="/account#children">
    <User className="h-4 w-4 mr-2" />
    Manage Student Account
  </Link>
</Button>
```

---

## Phase 3: Expand Account Settings Page

**File:** `src/pages/AccountSettingsPage.tsx`

### 3a. Add Children's Accounts Section

**New imports:**
- `useChildren` hook
- `useParentInvitations` hook
- `EditChildDialog` component
- `useDeleteInvitation`, `useUpdateInvitationStatus` hooks

**New section structure:**
```text
+------------------------------------------+
| Children's Accounts                       |
| Manage your children's profiles and login |
+------------------------------------------+
| [Child Card 1: Emma]                      |
| Grade: 3rd Grade | Teacher: Mrs. Smith   |
| Login: Enabled ✓ | Username: emma_reader |
| Public Link: Enabled                      |
| [Edit Profile] [View Details]             |
|                                           |
| Pending Sponsor Requests (2)              |
| > Grandma Smith - [Approve] [Decline]     |
| > Uncle Bob - [Approve] [Decline]         |
|                                           |
| [Delete Child] <-- Danger Zone            |
+------------------------------------------+
```

### 3b. Fields to Display Per Child
- **Grade** (from `grade_info`)
- **Homeroom Teacher** (from `class_name` or teacher lookup)
- **Public Sponsor Link Toggle** (from `share_public_link`)
- **Student Login Status** (from `student_login_enabled`)
- **Username** (from `student_username`)

### 3c. Sponsor Request Approval Inline

**Integration:**
- Fetch invitations using `useParentInvitations()`
- Group by child
- Show pending requests with Approve/Decline buttons
- Use `useUpdateInvitationStatus` mutation

### 3d. Delete Child Functionality

**New "Danger Zone" per child:**
- Add expandable danger section
- Requires typing child's name to confirm
- On delete:
  1. Cancel all unpaid pledges for this child
  2. Send notification to sponsors about cancellation
  3. Delete child record (cascades to reading_logs)
  4. Show confirmation toast

**Deletion cascade logic:**
```typescript
const handleDeleteChild = async (childId: string, childName: string) => {
  // 1. Get all unpaid pledges for this child
  const { data: unpaidPledges } = await supabase
    .from("pledges")
    .select("*, sponsors(*)")
    .eq("child_id", childId)
    .eq("is_paid", false);
  
  // 2. Notify sponsors (optional edge function call)
  for (const pledge of unpaidPledges || []) {
    // Send cancellation notification
  }
  
  // 3. Delete child (cascades reading_logs, pledges)
  await deleteChild.mutateAsync(childId);
  
  toast.success(`${childName} removed from Read-a-thon`);
};
```

---

## Phase 4: Update Dashboard Navigation

**File:** `src/pages/DashboardPage.tsx`

### Changes:
- Update "Manage Children" link to point to `/account#children`
- Keep child card "Details" button pointing to `/family/children/:id`
- No major structural changes needed

---

## Phase 5: Verify Sponsor-Only View Separation

**File:** `src/pages/family/ChildDetailsPage.tsx`

### Ownership Check:
```typescript
const { children } = useChildren();
const isOwner = children.some(c => c.id === id);

// If not owner, show limited view
if (!isOwner) {
  return <SponsorViewOfChild childId={id} />;
}
```

### Sponsor View Features (read-only):
- Reading progress ring
- Total minutes
- Days remaining
- No edit buttons
- No settings access
- No reading log management

---

## Phase 6: Remove Deprecated Routes

**File:** `src/App.tsx`

### Routes to Remove/Redirect:
```typescript
// Remove this route:
<Route path="/family/children/:id/settings" element={<ChildSettingsPage />} />

// Or redirect to child details:
<Route path="/family/children/:id/settings" element={<Navigate to="/family/children/:id" replace />} />
```

**File:** `src/pages/family/index.ts`
- Remove `ChildSettingsPage` export (if removing entirely)

---

## Database Considerations

### Potential Migration Needed
If log-level verification is required (beyond child-level), add to `reading_logs` table:
- `verified_at: timestamp with time zone | nullable`
- `verified_by: uuid | nullable | references auth.users`
- `is_verified: boolean | default false`

**Note:** Currently, verification exists at the child level (`total_verified`, `verified_at`, `verified_by` on `children` table). The plan assumes we validate logs at the child level, but inline log validation could be implemented as a UI pattern that updates the child's `total_verified` status.

---

## Technical Implementation Details

### Files to Modify

1. `src/pages/MyPledgesPage.tsx`
   - Remove payment status controls
   - Add "Pay Now" with event status logic
   
2. `src/pages/family/ChildDetailsPage.tsx`
   - Add class/grade progress section
   - Add inline log editing via ReadingLogsTable
   - Add validation checkbox functionality
   - Replace Settings navigation with EditChildDialog
   - Add link to Account page
   - Add ownership check for sponsor view
   
3. `src/pages/AccountSettingsPage.tsx`
   - Add Children's Accounts section
   - Display grade, teacher, public link toggle
   - Add sponsor approval workflow
   - Add delete child functionality
   
4. `src/pages/DashboardPage.tsx`
   - Update navigation links
   
5. `src/App.tsx`
   - Remove/redirect ChildSettingsPage route

### Files to Potentially Remove

1. `src/pages/family/ChildSettingsPage.tsx` - Deprecated by inline dialog

### New Components (inline in existing files)

1. `ChildAccountCard` - In AccountSettingsPage for displaying child management
2. `SponsorRequestCard` - In AccountSettingsPage for approval workflow
3. `CommunityProgressCard` - In ChildDetailsPage for class/grade stats

---

## Navigation Flow After Changes

```text
PARENT DASHBOARD (/dashboard)
├── Child Card
│   ├── [Details] -> ChildDetailsPage (/family/children/:id)
│   │   ├── Reading Progress (ring + stats)
│   │   ├── Community Progress (NEW: class + grade totals)
│   │   ├── Reading Log with inline editing + validation
│   │   ├── Sponsors List
│   │   ├── [Edit Profile] -> Opens EditChildDialog (inline)
│   │   ├── [Manage Student Account] -> Account page (/account#children)
│   │   └── [Log Reading] -> LogReadingPage
│   └── [Log] -> LogReadingPage
├── Sidebar Quick Actions
│   ├── Add Reading Log
│   ├── Invite Sponsor
│   ├── My Pledges -> MyPledgesPage (view/edit, "Pay Now" button)
│   ├── Make a Pledge
│   └── Add a Child

ACCOUNT PAGE (/account)
├── Children's Accounts (NEW section)
│   ├── [Per child card]
│   │   ├── Grade, Teacher, Public Link toggle
│   │   ├── Student login status + credentials
│   │   ├── [Edit Profile] -> Opens EditChildDialog
│   │   ├── [View Details] -> ChildDetailsPage
│   │   ├── Pending Sponsor Requests (approve/decline)
│   │   └── [Delete Child] -> Confirmation dialog
├── Profile Information
├── Change Password
└── Danger Zone (delete account)

MY PLEDGES PAGE (/my-pledges)
├── Summary Stats (read-only: Total, Paid, Pending)
├── Pledges by Child
│   ├── [Per pledge]
│   │   ├── Status badge (read-only)
│   │   ├── Amount + type
│   │   ├── [Edit] -> Edit amount/type only
│   │   ├── [Delete] -> Delete pledge
│   │   └── [Pay Now] -> Payment flow (conditional visibility)

SPONSOR VIEW (non-parent viewing sponsored child)
└── Read-only progress view (no edit/settings/management)
```

---

## Implementation Order

1. **Phase 1** - My Pledges payment controls cleanup + Pay Now logic
2. **Phase 2** - ChildDetailsPage enhancements (class/grade progress, inline editing, validation)
3. **Phase 3** - Account page children section with full management
4. **Phase 4** - Dashboard navigation streamlining
5. **Phase 5** - Ownership verification for sponsor views
6. **Phase 6** - Remove deprecated routes and cleanup

---

## Testing Checklist

- [ ] My Pledges: Cannot mark paid/unpaid
- [ ] My Pledges: Pay Now works for flat pledges anytime
- [ ] My Pledges: Pay Now only appears for per-minute when event closed
- [ ] My Pledges: Paid pledges show status but no actions
- [ ] Child Details: Class total minutes display correctly
- [ ] Child Details: Grade total minutes display correctly
- [ ] Child Details: Can edit reading logs inline
- [ ] Child Details: Can validate reading logs with checkbox
- [ ] Child Details: Edit Profile opens dialog (not navigates)
- [ ] Account: Children section shows all children
- [ ] Account: Can edit grade, teacher, public link per child
- [ ] Account: Can approve/decline sponsor requests
- [ ] Account: Can delete child with confirmation
- [ ] Account: Deleting child notifies sponsors
- [ ] Sponsor View: Cannot see edit controls when viewing non-owned child
- [ ] Navigation: Settings route redirects properly
