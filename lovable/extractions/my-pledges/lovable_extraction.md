# MyPledgesPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: MyPledgesPage
- **Route**: `/my-pledges`
- **Navigation Source**: Account Settings / Dashboard

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Pledges listed in standard rows/cards.
- **Mobile**:
  - Stacked layout.
  - "Pay Now" buttons full width.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content + `Footer`.
- **Header**: Title & Subtitle.
- **Stats Bar**: Total Pledged, Paid Count, Pending Count.
- **Pledge List**:
  - Grouped by Child.
  - Pledge Card:
    - Status Badge (Paid/Pending).
    - Details (Date, Type, Payment Method).
    - Amount.
    - Actions (Edit, Delete, Pay Now).
    - Payment History (Receipt links).

## D) UI STATES
- **Loading**: Skeletons.
- **Empty**: "No pledges yet" state with Invite/Sponsor CTAs.
- **Error**: Retry button.
- **Dialogs**: Edit Pledge, Delete Confirmation.

## E) USER ACTIONS
- **Edit**: Change amount/type (only if unpaid).
- **Delete**: Remove pledge (only if unpaid).
- **Pay Now**: Navigate to `/sponsor/pay`.
- **View Receipt**: External link to Square receipt.

## F) DATA DISPLAY
- **Amounts**: Currency formatting.
- **Dates**: `MMM d, yyyy`.
- **Badges**: Success (Paid), Secondary (Pending).
- **Calculations**: Estimated totals for per-minute pledges.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**: `useParentPledges`, `usePledges`, `useUserPayments`, `useEventStatus`.
- **Logic**:
  - Groups pledges by child.
  - Determines "Pay Now" eligibility (flat vs per-minute rules).

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated Parents.

## I) OPEN QUESTIONS / AMBIGUITIES
- None.
