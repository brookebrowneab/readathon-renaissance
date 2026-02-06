# InviteSponsorsPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: InviteSponsorsPage
- **Route**: `/invite`, `/children/:id/invite`
- **Navigation Source**: Dashboard

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - 2-column grid for Email Invitation form (Email/Name).
  - Previous sponsors list rows.
- **Mobile**:
  - Form fields stack.
  - Previous sponsors list adapts (pledge info moves below name).
- **Breakpoints**: `sm`.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content.
- **Header**: Title, Description.
- **Previous Sponsors Section** (Conditional):
  - List of past sponsors (Mock data currently).
  - "Invite" button per row.
  - "Invite All" button.
- **Email Invitation Form**:
  - Email, Name, Relationship (Select), Personal Message.
  - Preview card.
  - Send button.
- **Share Section**:
  - Copy Link button.
  - Share via SMS, WhatsApp, Print.
- **Sent Invitations List**:
  - Status badges (Sent, Opened, Pledged).
  - Actions: Resend, Cancel.

## D) UI STATES
- **Loading**: `isSubmitting` during send.
- **Empty**: No previous sponsors.
- **Validation**: Email/Name required.
- **Success**: Toast notifications on invite/copy.

## E) USER ACTIONS
- **Invite**:
  - Individual invite (New).
  - Re-invite previous sponsor.
  - Invite all previous.
- **Share**: Copy link, Open external share URLs.
- **Manage**: Resend/Cancel sent invitations.

## F) DATA DISPLAY
- **Previous Sponsors**: Name, Email, Last Pledge Amount/Type, Year.
- **Current Invitations**: Name, Status, Sent Date.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**: `useAuth`.
- **Mock Data**: Currently uses `mockPreviousSponsors` and `mockInvitations`. Needs connection to real `sponsor_invitations` and historical pledge data.
- **Link Generation**: Generates `/f/:userId` link.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated Parents.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Data Source**: The page relies heavily on mock data (`getMockChildData`, `mockPreviousSponsors`). Backend endpoints for "Previous Sponsors" (historical data) need to be defined/implemented.
