# ManageChildrenPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: ManageChildrenPage
- **Route**: `/children`, `/family/manage`
- **Navigation Source**: Dashboard

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Collapsible cards with detailed stats.
  - Table view for logs inside collapsible.
- **Mobile**:
  - `MobileStudentCard` components.
  - Status indicators (Exceeding/On-track/Needs-attention).
  - Swipe actions implies or simplified tap-to-act.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content + `BottomTabBar` (Mobile).
- **Header**: Title, "Add Child" button.
- **Child List**:
  - **Desktop**:
    - Header: Avatar, Name, Stats (Progress Ring).
    - Actions: Invite, Edit, Menu (Remove), View Logs (Toggle).
    - Content: `ChildReadingLogsSection` (Table).
  - **Mobile**:
    - Card: Avatar, Name, Progress Bar, Status Badge.
    - Actions: Log Reading, View Details.

## D) UI STATES
- **Loading**: Full page loader.
- **Empty**: "No children enrolled" state.
- **Expanded**: Log table visibility.
- **Dialogs**: Edit Child, Delete Confirmation.

## E) USER ACTIONS
- **Navigation**:
  - Add Child -> `/onboarding/add-child`.
  - Child Details -> `/children/:id`.
  - Log Reading -> `/log-reading?child=:id`.
- **Management**:
  - Edit Profile (Name, Grade).
  - Remove Child (Destructive).
- **Logs**: View/Hide logs.

## F) DATA DISPLAY
- **Progress**: Total minutes / Goal.
- **Status**: Computed status based on progress vs goal.
- **Avatar**: Initials.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**: `useChildren`, `useAllChildrenReadingLogs`.
- **Calculations**: Sums logs for total minutes client-side.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated Parents.

## I) OPEN QUESTIONS / AMBIGUITIES
- None.
