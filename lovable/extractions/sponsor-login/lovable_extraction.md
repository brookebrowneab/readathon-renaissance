# Sponsor Login Page — Extraction

## A) PAGE IDENTIFICATION

- **Page name**: `SponsorLoginPage`
- **Route**: `/sponsor/login`
- **Navigation sources**:
  - "I've sponsored before → Sign In" card on `/sponsor` (SponsorGatewayPage)
  - "Try a different email" link on `/sponsor/check-email` (SponsorCheckEmailPage)

---

## B) RESPONSIVE LAYOUT

- **Desktop**: Vertically centered single card (`max-w-md`) within a full-height layout. Header (MainNav) at top, Footer at bottom, card in center on `bg-background-warm`.
- **Mobile**: Same single-column layout; card and form elements are full-width within container padding. No elements hide, collapse, or change interaction on mobile.
- **Breakpoints**: None explicitly used on this page. Layout is inherently single-column.
- **Elements that move/collapse/hide/change**: None observed.

---

## C) COMPONENT STRUCTURE

The page has **four view modes** rendered conditionally via a `viewMode` state variable of type `"email" | "find-account" | "account-found" | "not-found"`.

### Shared wrapper (all views)
```
div (min-h-screen flex col)
├── MainNav
├── main (flex-1, centered)
│   └── div.container.max-w-md
│       └── BookContainer (variant="default", p-8)
│           └── [view-specific content]
└── Footer
```

### View: "email" (default)
```
BookContainer
├── Icon circle (Mail icon, bg-brand-blue/10)
├── h1 "Welcome Back!"
├── p "Enter your email to continue"
├── form
│   ├── FormField (label="Email Address", required)
│   │   └── Input (type=email, h-14, text-lg)
│   ├── Button "Send me a login link" (with ArrowRight icon)
│   └── p "We'll email you a link to sign in. No password needed!"
├── hr (border-t)
├── p "First time sponsoring? Ask the family..."
└── button "Not sure what email you used? Find my account" (with HelpCircle icon)
```

### View: "find-account"
```
BookContainer
├── button "Back to email login" (ArrowLeft)
├── Icon circle (Search icon, bg-brand-blue/10)
├── h1 "Let's find your account"
├── p "Search by the child you sponsored"
├── form
│   ├── FormField (label="Child's First Name", required)
│   │   └── Input (with User icon prefix, h-14, text-lg)
│   ├── FormField (label="School", required)
│   │   └── Select dropdown (h-14, text-lg, School icon prefix)
│   │       └── Options: hardcoded list of 4 schools
│   └── Button "Find Account" (with Search icon)
├── hr (border-t)
└── p "Can't find your account? Contact support" (mailto:help@school.org)
```

### View: "account-found"
```
BookContainer
├── button "Search again" (ArrowLeft)
├── Icon circle (CheckCircle, bg-success/10)
├── h1 "Found it!"
├── p "You sponsored a student at {school} in {year}."
├── div (bg-muted/50 rounded-xl)
│   ├── p "Your account email is:"
│   └── p (masked email, font-mono, text-2xl)
├── Button "Send login link to this email" (Mail icon)
├── p "We'll send a link to sign you in"
├── hr (border-t)
└── p "Not your account? Try a different search" (button link)
```

### View: "not-found"
```
BookContainer
├── button "Back to search" (ArrowLeft)
├── Icon circle (AlertCircle, bg-muted)
├── h1 "No Match Found"
├── p "We couldn't find a matching sponsorship."
├── div (bg-muted/50 rounded-xl)
│   └── p "You may have used a different email address..."
├── Button "Try Again" (variant=outline, Search icon)
└── p "Or contact us at help@school.org" (mailto link)
```

### Repeated patterns
- Icon circle header (20×20 rounded-full with centered icon) appears in all four views
- Serif h1 + muted paragraph subheading pattern in all views
- Full-width `h-14 text-lg` buttons throughout
- `border-t` divider before secondary actions
- `BookContainer` wrapper in all views

### Conditional sections
- Entire view content swaps based on `viewMode` state
- Loading spinner on buttons via `loading` prop when `isSubmitting` or `isSearching`

---

## D) UI STATES

| State | Description |
|-------|-------------|
| **Initial** | "email" view displayed. Email input empty, button disabled. |
| **Submitting (email)** | Button shows loading spinner, is disabled. Input remains visible. |
| **Success (email)** | Toast "Login link sent!", navigates to `/sponsor/check-email` with email in state. |
| **Error (email)** | Toast "Failed to send login link. Please try again." Button re-enables. |
| **Find account** | Form with child name + school select. Button disabled until both filled. |
| **Searching** | "Find Account" button shows loading spinner. |
| **Account found** | Shows masked email, school, year. "Send login link" button available. |
| **Not found** | Shows "No Match Found" with retry and contact options. |
| **Submitting (found email)** | "Send login link to this email" button shows loading spinner. |
| **Success (found email)** | Toast + navigate to `/sponsor/check-email` with masked email. |
| **Error (found email)** | Toast error. Button re-enables. |
| **Field-level validation** | HTML5 `required` on email input and child name input. No custom field-level errors displayed. |

---

## E) USER ACTIONS

### 1. Submit email for magic link
- **Trigger**: Form submit (click "Send me a login link" or press Enter)
- **Validation**: HTML5 required + type=email; button disabled if email empty
- **Immediate UI**: Button enters loading state
- **After completion**: Success → toast + navigate to `/sponsor/check-email`; Error → toast error
- **Reversible**: No (email is sent)

### 2. Switch to "Find my account" view
- **Trigger**: Click "Not sure what email you used? Find my account"
- **Immediate UI**: View switches to find-account form
- **Reversible**: Yes, via "Back to email login" button

### 3. Search for account
- **Trigger**: Form submit on find-account view
- **Validation**: Both childName and school must be non-empty; button disabled otherwise
- **Immediate UI**: Button enters loading state (1s simulated delay)
- **After completion**: If name starts with "e" (case-insensitive) → account-found view; otherwise → not-found view
- **Reversible**: Yes, via back buttons

### 4. Send login link to found email
- **Trigger**: Click "Send login link to this email"
- **Validation**: foundAccount must exist
- **Immediate UI**: Button enters loading state
- **After completion**: Same as email submit (toast + navigate)
- **Reversible**: No

### 5. Try Again (from not-found)
- **Trigger**: Click "Try Again" button
- **Immediate UI**: Resets childName and school, returns to find-account view
- **Reversible**: N/A

### 6. Navigate back (various)
- **Trigger**: Click back arrows in find-account, account-found, or not-found views
- **Immediate UI**: Returns to previous view, optionally clearing state
- **Reversible**: Yes

---

## F) DATA DISPLAY

### Email view
- No dynamic data displayed. All content is static.

### Find-account view
- **School dropdown**: Hardcoded list of 4 school names (MOCK_SCHOOLS). Read-only select.
- No dynamic data from API.

### Account-found view
- **maskedEmail**: Displayed in `font-mono text-2xl`. Format: `g***a@e*****.com` (partially masked)
- **school**: Plain text, e.g. "Lincoln Elementary"
- **year**: Plain text, e.g. "2024"
- All read-only.

### Not-found view
- No dynamic data. All static content.

### Formatting rules
- No currency, date, or truncation formatting on this page.

### Desktop vs mobile differences
- None. Same fields displayed at all breakpoints.

---

## G) FRONTEND DATA EXPECTATIONS

### API calls

1. **`supabase.functions.invoke("send-sponsor-magic-link")`**
   - **Method**: POST (implicit via functions.invoke)
   - **Request body**: `{ email: string, redirectTo: string }`
   - **`redirectTo`**: Always `${window.location.origin}/sponsor/dashboard`
   - **Response**: Success/error. No response body used by UI.
   - **Used in**: handleEmailSubmit, handleSendToFoundEmail

2. **Find account search** — Currently **mocked** (no API call)
   - Simulated with `setTimeout(1000ms)`
   - Match logic: name starts with "e" → found; otherwise → not found
   - Expected real shape (from mock):
     ```ts
     {
       maskedEmail: string;  // e.g. "g***a@e*****.com"
       school: string;       // e.g. "Lincoln Elementary"
       year: string;         // e.g. "2024"
     }
     ```

3. **School list** — Currently **hardcoded** (MOCK_SCHOOLS array)
   - Expected real shape: `string[]` of school names

### Required vs optional
- `email` — required for email view submit
- `childName` + `school` — required for find-account submit
- `foundAccount` — required for account-found view actions

### Derived/computed values
- `redirectTo` computed as `${window.location.origin}/sponsor/dashboard`

---

## H) AUTH / ROLE ASSUMPTIONS

- **Who can see this page**: Anyone (public, no auth required)
- **Restricted actions**: None. The page is the entry point for sponsor authentication.
- **Post-auth redirect**: `/sponsor/dashboard`

---

## I) OPEN QUESTIONS / AMBIGUITIES

- **Find-account search is fully mocked**: The match logic (name starts with "e") is a demo placeholder. Real implementation needs an API endpoint to search sponsors by child name + school.
- **School list is hardcoded**: Real implementation needs a dynamic list of schools (currently only one school exists in the system per event settings).
- **Masked email in found-account view**: Unknown how masking is done server-side. The mock shows a fixed value.
- **`handleSendToFoundEmail` sends the masked email**: It passes `foundAccount.maskedEmail` (e.g. `g***a@e*****.com`) to the magic link function, which would not be a valid email. The real implementation presumably needs to send the actual email server-side while only displaying the masked version to the user.
- **Contact support email**: Hardcoded as `help@school.org`. Unknown if this should be dynamic per event/school.
- **No loading/skeleton state**: Page renders immediately with no data fetching on mount.
- **`BookContainer` component**: Legacy component used as card wrapper. Variant is always `"default"`.
- **Toast library**: Uses `sonner` for success/error notifications.
