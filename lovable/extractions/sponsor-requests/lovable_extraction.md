# SponsorRequestsPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: SponsorRequestsPage
- **Route**: `/family/sponsor-requests`
- **Navigation Source**: Dashboard

## B) RESPONSIVE LAYOUT
- **Desktop/Mobile**: Single column list layout.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content + `Footer`.
- **Header**: Title, Privacy Notice.
- **Pending Section**:
  - List of Request Cards.
  - Card: Sponsor Info, History Stats, Actions (Approve/Deny).
- **Processed Section**:
  - List of past decisions (read-only).

## D) UI STATES
- **Empty**: "No pending requests".
- **Processing**: Disabled buttons during action.
- **Dialog**: Confirmation modal for Approve/Deny.

## E) USER ACTIONS
- **Approve**: Opens dialog -> Confirm (Option to allow sharing).
- **Deny**: Opens dialog -> Confirm.

## F) DATA DISPLAY
- **Sponsor Stats**: "Returning" badge, Past sponsorships, Total contributed.
- **Privacy**: Contextual explanation of data visibility.

## G) FRONTEND DATA EXPECTATIONS
- **Mock Data**: Currently uses `mockRequests`. Needs real `sponsor_invitations` integration where `status = 'pending'`.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated Parents.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Data Source**: Relies on mock data. Real implementation needs to query `sponsor_invitations`.
