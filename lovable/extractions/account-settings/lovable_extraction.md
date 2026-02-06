# AccountSettingsPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: AccountSettingsPage
- **Route**: `/account`
- **Navigation Source**: Dashboard / Menu

## B) RESPONSIVE LAYOUT
- **Desktop/Mobile**: Single column, vertical stack of sections.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content + `Footer`.
- **Header**: Title & Subtitle.
- **Quick Links**: "My Pledges" button (non-teachers).
- **Children Section** (Parents only):
  - Collapsible card per child.
  - Header: Avatar, Name, Grade/Class.
  - Badges: Login status, Public link status, Sponsor count.
  - Content:
    - Student Login details (Username, Status).
    - Public Link toggle (Switch).
    - Active Sponsors list.
    - Delete Child button.
- **Profile Section**:
  - Name, Display Name, Email (Read-only), Phone.
  - Save button.
- **Password Section**:
  - New Password, Confirm Password.
  - Update button.
- **Danger Zone**:
  - Delete Account.

## D) UI STATES
- **Loading**: Initial data fetch.
- **Saving**: `isSavingProfile`, `isSavingPassword`, `isDeleting`.
- **Expanded**: Child cards expand/collapse.
- **Editing**: Child profile edit dialog.

## E) USER ACTIONS
- **Profile**: Update personal info.
- **Password**: Change password.
- **Child Management**:
  - Toggle public link.
  - Edit child details (opens dialog).
  - Delete child (requires confirmation).
  - Delete invitation.
- **Account**: Delete entire account (requires typing "DELETE").

## F) DATA DISPLAY
- **Profile**: Pre-filled from `profiles` table.
- **Children**: List of children with their specific metadata and stats.
- **Sponsors**: List of active invitations per child.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**:
  - `useAuth`, `useTeacherAuth`.
  - `useChildren`, `useChildrenStudentAuth`.
  - `useParentInvitations`.
- **Supabase**: Direct calls for profile updates and account deletion (cascading deletes).

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated users.
- **Teacher Restriction**: Hides "My Pledges" and "Children's Accounts" sections for teachers.

## I) OPEN QUESTIONS / AMBIGUITIES
- None.
