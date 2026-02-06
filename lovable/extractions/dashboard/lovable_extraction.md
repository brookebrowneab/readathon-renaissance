# DashboardPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: DashboardPage
- **Route**: `/dashboard`
- **Navigation Source**: Login / Onboarding Complete

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Header with logout.
  - Grid layout for children cards (`grid-cols-2` or `grid-cols-3`).
- **Mobile**:
  - Header.
  - Swipeable `MobileProgressDisplay` for children stats.
  - Vertical stack of `ChildProgressCard` (Compact).
- **Breakpoints**: `sm`, `md`, `xl`.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content + `BottomTabBar` (Mobile).
- **Header**: Welcome message (Parent or Sponsor mode).
- **Parent View**:
  - "Your Readers" section.
  - `MobileProgressDisplay` (Mobile only).
  - `ChildProgressCard` grid.
  - `PledgesSection` (Incoming pledges).
- **Sponsor View**:
  - `SponsoredChildCard` (Horizontal or Stacked).
  - `SponsoredClassCard`.
- **Empty State**: "No children added" with CTA.

## D) UI STATES
- **Loading**: Skeletons for children and pledges.
- **Role Mode**:
  - `isSponsorOnly`: User has sponsor profile but no children -> Redirects/Shows sponsor view.
  - Parent Mode: Shows children and pledges.
- **Empty**: No children added yet.

## E) USER ACTIONS
- **Navigation**:
  - "Manage Children" -> `/account#children`.
  - "Add Child" -> `/onboarding/add-child`.
  - "Log Reading" -> `/log-reading`.
  - "Invite Sponsors" -> `/invite`.
- **Logout**: Signs out user.
- **Pledge Management**: Delete pledge (via `PledgesSection`).

## F) DATA DISPLAY
- **User Name**: Display name or email.
- **Children Cards**:
  - Avatar initials.
  - Minutes read / Goal (Progress Ring).
  - Stats: Today's minutes, Best Streak.
  - Class/Grade info.
  - Fundraising total.
- **Pledges**: List of pledges (filtered/merged based on role).

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**:
  - `useChildren`, `useParentPledges`, `useSponsorPledges`.
  - `useAllChildrenReadingLogs`, `useClassGradeTotals`.
  - `useMultipleClassFundraisingTotals`, `useActiveEvent`.
- **Logic**:
  - Merges parent/sponsor pledges.
  - Calculates aggregated reading stats client-side from logs.
  - Redirects sponsor-only users to `/sponsor/dashboard`.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated users.
- **Role Logic**: Automatically detects "Sponsor Only" status to redirect or adjust UI.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Routing**: `isSponsorOnly` triggers a redirect to `/sponsor/dashboard`, suggesting this page is primarily for Parents, but it contains fallback logic to render sponsor views just in case.
