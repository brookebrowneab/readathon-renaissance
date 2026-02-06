# LoginPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: LoginPage
- **Route**: `/login`
- **Navigation Source**: Public Nav, CTA buttons

## B) RESPONSIVE LAYOUT
- **Desktop**: Centered card with fixed max-width (`max-w-md`).
- **Mobile**: Full width container with padding.
- **Breakpoints**: `lg` for padding adjustments.

## C) COMPONENT STRUCTURE
- **Layout**: `PublicLayout`.
- **Container**: Centered section with custom border styling.
- **Header**: Icon badge, Title, Subtitle.
- **Form**:
  - Email Input (with icon).
  - Password Input (with icon, visibility toggle, forgot link).
  - Remember Me Checkbox.
  - Submit Button.
- **Divider**: "Or".
- **Demo Section**: Buttons for demo access (Parent, Student, Teacher, Sponsor, Admin).
- **Footer**: Register link.

## D) UI STATES
- **Initial**: Empty form.
- **Password Visibility**: Toggled state (text/password type).
- **Loading**: `isLoading` state disables submit button and changes text.
- **Error**: Toast notification on failure.
- **Success**: Toast notification and navigation.

## E) USER ACTIONS
- **Input**: Type email, password.
- **Toggle**: Show/Hide password.
- **Submit**: Triggers `signIn`.
  - **Validation**: HTML5 `required` attributes.
  - **Success**: Redirects to `/dashboard`.
  - **Failure**: Displays error toast.
- **Navigation**:
  - Forgot Password -> `/forgot-password`.
  - Register -> `/register`.
  - Demo Buttons -> Navigate to respective dashboards without auth (mock/demo mode).

## F) DATA DISPLAY
- **Input Values**: Controlled state (`email`, `password`).

## G) FRONTEND DATA EXPECTATIONS
- **Hook**: `useAuth` (`signIn`).
- **Response**: `{ error }` object.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public (Guest).
- **Demo Access**: Explicit demo buttons bypass auth for testing/preview purposes.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Demo Logic**: Demo buttons navigate directly to protected routes. Backend must allow this or frontend has mock mode.
