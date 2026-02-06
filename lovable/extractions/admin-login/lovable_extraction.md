# AdminLoginPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: AdminLoginPage
- **Route**: `/admin/login`
- **Navigation Source**: Footer / Direct Link

## B) RESPONSIVE LAYOUT
- **Desktop/Mobile**: Centered card layout.

## C) COMPONENT STRUCTURE
- **Layout**: Header + Main + Footer (Custom structure, not `PublicLayout`).
- **Container**: Centered card with custom border.
- **Header**: Shield Icon + Title.
- **Tabs**: Switch between "Sign In" and "Create Admin".
- **Form (Login)**: Email, Password, Submit.
- **Form (Signup)**: Email, Password, Submit.
- **Access Denied View**: Shown if logged in but not admin.

## D) UI STATES
- **Tabs**: Login vs Signup.
- **Loading**: Global page loader (`isLoading`) and button loader (`isSubmitting`).
- **Access Denied**: Special state if `user && !isAdmin`.
  - Shows "Complete Admin Setup" button if no admin exists in DB.
- **Admin Exists Check**: Checks DB on mount to conditionally allow "Create Admin" flow or setup.

## E) USER ACTIONS
- **Tab Switch**: Toggle Login/Signup.
- **Login Submit**: Calls `signIn`.
- **Signup Submit**: Calls `signUp` + `bootstrap-admin` edge function.
- **Bootstrap**: Calls `bootstrap-admin` function manually (if in Access Denied state and no admin exists).

## F) DATA DISPLAY
- **Error Messages**: Toast notifications for auth failures.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**: `useAuth` (`signIn`, `signUp`, `refreshAdmin`).
- **Supabase**:
  - Query `user_roles` to check if admin exists.
  - Invoke `bootstrap-admin` edge function.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public (for login form).
- **Security**: Checks `isAdmin` flag. Redirects to `/admin` if already authorized.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Signup Tab**: Logic suggests anyone can create an admin account if they use the signup tab, unless `bootstrap-admin` enforces "first user only" logic server-side.
