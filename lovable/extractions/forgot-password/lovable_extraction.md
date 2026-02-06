# ForgotPasswordPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: ForgotPasswordPage
- **Route**: `/forgot-password`
- **Navigation Source**: Login Page

## B) RESPONSIVE LAYOUT
- **Desktop/Mobile**: Centered card layout, single column.

## C) COMPONENT STRUCTURE
- **Layout**: `PublicLayout`.
- **States**:
  - **Form State**:
    - Logo.
    - Title & Instructions.
    - Email Input.
    - Submit Button.
    - Back Link.
  - **Success State** (`isSubmitted`):
    - Checkmark Icon.
    - Confirmation Message (with email).
    - "Try again" link.
    - Back to Sign In button.

## D) UI STATES
- **Input**: Email state.
- **Submitted**: Boolean toggle to show success message.

## E) USER ACTIONS
- **Submit**:
  - Prevents default.
  - Logs email (console).
  - Sets `isSubmitted` to true.
  - **Note**: No actual API call in current code (Mock implementation).
- **Navigation**: Back to Login.

## F) DATA DISPLAY
- **Email**: Displayed in success message.

## G) FRONTEND DATA EXPECTATIONS
- **Current**: No API integration implemented (console log only).
- **Future**: Should call `resetPasswordForEmail`.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Implementation**: Functional logic is missing/mocked. Needs Supabase integration.
