# AddSponsorPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: AddSponsorPage
- **Route**: `/children/:id/add-sponsor`
- **Navigation Source**: Invite Sponsors Page

## B) RESPONSIVE LAYOUT
- **Desktop/Mobile**: Single column form layout.

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content.
- **Header**: Title ("Record a pledge for [Child]").
- **Form**:
  - **Step 1**: Sponsor Info (Name, Email, Phone).
    - Returning Sponsor Detection (Email match).
  - **Step 2**: Pledge Details.
    - Type Toggle (Fixed vs Per-minute).
    - Amount Input.
    - Calculator (for per-minute).
  - **Step 3**: Payment Method.
    - Options: Email link, Text link, Check, Cash, Direct.
  - **Submit Button**.
- **Success View**:
  - Confirmation message.
  - Next steps based on payment method.
  - "Record Another" button.

## D) UI STATES
- **Detection**: Found Returning Sponsor -> Shows prompt to reuse last year's amount.
- **Validation**:
  - Name required.
  - Amount > 0.
  - Contact method required if sending link.
- **Success**: Replaces form with success message.

## E) USER ACTIONS
- **Input**: Enter sponsor details.
- **Toggle**: Pledge type, Payment method.
- **Submit**: Records pledge (Simulated API currently).
- **Navigation**: Back to Invite page.

## F) DATA DISPLAY
- **Calculator**: Shows estimated total for per-minute pledges based on reading goal.
- **Returning Info**: Displays past pledge stats if email matches.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**: `useParams`.
- **Mock Data**: Uses `mockPreviousSponsors`. Needs real API.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated Parents.
- **Intent**: Manual entry for offline pledges (Cash/Check) or assisted entry for sponsors.

## I) OPEN QUESTIONS / AMBIGUITIES
- **API**: Currently simulated (`setTimeout`). Needs `addPledge` mutation integration.
