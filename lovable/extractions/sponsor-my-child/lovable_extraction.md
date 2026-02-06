# SponsorMyChildPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: SponsorMyChildPage
- **Route**: `/family/sponsor-my-child`
- **Navigation Source**: Dashboard

## B) RESPONSIVE LAYOUT
- **Desktop/Mobile**: Multi-step wizard layout.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content.
- **Wizard**:
  - **Step 0 (Type)**: Sponsor own child vs Support class.
  - **Step 1 (Select)**: Choose Child or Choose Class.
  - **Step 2 (Amount)**:
    - **Individual**: Fixed vs Per-minute form.
    - **Class**: Flat vs Milestone form.
  - **Step 3 (Confirm)**: Success message & Summary.
- **Navigation**: Back / Continue buttons.

## D) UI STATES
- **Steps**: Tracks `currentStep` (0-3).
- **Selection**: Highlights selected options.
- **Loading**: Submission state.

## E) USER ACTIONS
- **Flow**: Navigate through wizard steps.
- **Input**: Enter amounts, milestones.
- **Submit**: Creates pledge(s).
  - Handles Individual Pledge (`addPledge`).
  - Handles Class Pledge (`createClassPledge` / `createMilestonePledges`).

## F) DATA DISPLAY
- **Calculations**: Projected totals for per-minute/milestone pledges.
- **Class Stats**: Fundraising totals for class selection context.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**:
  - `useChildren`, `useSponsorableChildren`, `useAvailableClasses`.
  - `usePledges`, `useClassPledges`.
- **Logic**: Complex branching logic for different pledge types.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated Parents/Sponsors. (Parents sponsoring their own kids).

## I) OPEN QUESTIONS / AMBIGUITIES
- None.
