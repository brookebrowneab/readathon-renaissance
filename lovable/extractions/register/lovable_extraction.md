# RegisterPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: RegisterPage
- **Route**: `/register`
- **Navigation Source**: Public Nav, Login Page

## B) RESPONSIVE LAYOUT
- **Desktop**: 2-column grid for First/Last name.
- **Mobile**: Fields stack vertically.
- **Breakpoints**: None specific (grid layout is implicit/responsive).

## C) COMPONENT STRUCTURE
- **Layout**: `PublicLayout`.
- **Container**: Centered card with custom border.
- **Form**:
  - First/Last Name (Grid).
  - Email.
  - Phone (Optional).
  - Password (with strength indicator).
  - Confirm Password.
  - Terms Checkbox.
  - Submit Button.
- **Footer**: Login link.

## D) UI STATES
- **Validation**:
  - Touched state tracking per field.
  - Email format check.
  - Password strength (Weak/Medium/Strong) & requirements (Length, Uppercase, Number).
  - Confirm password match.
  - Terms acceptance.
- **Loading**: `isSubmitting` state.
- **Error**: Field-level error messages + Toast for API errors.

## E) USER ACTIONS
- **Input**: Type user details.
- **Validation**: Real-time validation visual feedback (green checks, red errors).
- **Submit**: Triggers `signUp`.
  - **Success**:
    - Stores parent data in `sessionStorage` (`parentData`).
    - Redirects to `/onboarding/add-child`.
    - Shows success toast.
- **Navigation**: Login link -> `/login`.

## F) DATA DISPLAY
- **Password Strength**: Visual bar + label (Weak/Medium/Strong).
- **Requirements**: List of checks (Length, Uppercase, Number) with success/failure icons.

## G) FRONTEND DATA EXPECTATIONS
- **Hook**: `useAuth` (`signUp`).
- **Payload**: Email, Password, DisplayName, Metadata (`first_name`, `last_name`, `phone`).
- **Session Storage**: Sets `parentData` for onboarding flow continuity.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public.
- **Flow**: Registration immediately leads to onboarding (Add Child), not Dashboard.

## I) OPEN QUESTIONS / AMBIGUITIES
- None.
