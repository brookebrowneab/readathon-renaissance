# ChildDetailsPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: ChildDetailsPage
- **Route**: `/children/:id`
- **Navigation Source**: Manage Children / Dashboard

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Two-column layout (Main info left, Sidebar/Additional info right - implicitly handled by flex/grid).
  - Progress section: Ring + Grid stats.
- **Mobile**:
  - Stacked layout.
  - Progress section vertical stack.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content + `Footer`.
- **Header**: Avatar, Name, Grade/Class, Edit Button (Owner only).
- **Progress Section**:
  - Reading Goal Ring.
  - Stats Grid: Read Today, Best Session, Days Active, Goal.
  - Days Remaining countdown.
  - Verification Badge.
- **Community Progress**:
  - Class Total card.
  - Grade Total card.
- **Reading Log Section**:
  - Header with Bulk Actions (Owner only).
  - `ReadingLogsTable` (implied or inline list with checkboxes).

## D) UI STATES
- **Loading**: Skeletons.
- **Error**: "Child not found".
- **Empty Logs**: Placeholder state.
- **Selection**: Checkbox state for log validation.

## E) USER ACTIONS
- **Edit**: Open Edit Profile dialog.
- **Logs**:
  - Select/Deselect logs.
  - Validate selected (bulk update).
  - Edit/Delete individual logs (inline).

## F) DATA DISPLAY
- **Stats**: Calculated client-side from `logs` (Today, Streak, Active Days).
- **Community**: Fetched via hooks (`classStats`, `classGradeTotals`).

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**:
  - `useChildById`, `useReadingLogs`, `usePledges`.
  - `useClassReadingStats`, `useClassGradeTotals`.
- **Validation**: Frontend logic for "Validate Selected" (updates `total_verified` on child).

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated Users.
- **Ownership**: `isOwner` check determines edit/validate permissions.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Validation**: Validation logic updates `child.total_verified` but also seems to imply log-level validation in UI, though backend schema only has `child.total_verified` or `log_verification_requests`. The exact "Validate" action behavior might need clarification (updates child or logs?). Code suggests updating child.
