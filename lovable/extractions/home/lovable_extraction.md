# HomePage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: HomePage
- **Route**: `/`
- **Navigation Source**: Default entry point

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Top-right countdown timer with custom border radius.
  - Hero section with left-aligned large headline, highlighter effect, and CTA buttons.
  - Stats section displayed as a 3-column grid.
  - "How It Works" steps in a 2-column grid.
  - "Making a Difference" section with a 2-column list.
- **Mobile**:
  - Countdown timer stacks or adjusts padding.
  - Hero content has equal padding; text remains left-aligned.
  - Stats section becomes a horizontally scrollable container (swipeable) with `overflow-x-auto`.
  - "How It Works" steps stack vertically.
  - "Making a Difference" list stacks vertically.
- **Breakpoints**: Standard Tailwind breakpoints (`md`, `lg`).
- **Hidden Elements**: None explicitly hidden, but layout shifts significantly (grid to stack/scroll).

## C) COMPONENT STRUCTURE
- **Layout**: `PublicLayout` (wraps entire page).
- **Hero Section**:
  - Countdown timer (top right).
  - Headline (dynamic/randomized).
  - Description.
  - CTA Buttons ("Get Started", "Learn More").
- **Stats Section**:
  - Background image (`booksShelfBannerV2`).
  - Data display (Minutes Logged, Books Completed, Funds Raised).
- **How It Works Section**:
  - Section title & description.
  - Steps list (mapped from content).
- **Making a Difference Section**:
  - Section title & intro.
  - List of impact items.
  - Contact email footer.
- **CTA Section**:
  - Background color & images (`openBook`, `booksShelfHero`).
  - Title & description.
  - Action buttons ("Register Now", "Sign In").
  - Student Login link footer.

## D) UI STATES
- **Loading**: Implied during `useActiveEvent` and `useSiteContentMultiple` data fetching (no explicit spinner shown in code, likely handles undefined gracefully).
- **Empty**: Fallback content provided via `DEFAULT_CONTENT` if hooks return no data.
- **Dynamic Content**: Hero headline is randomized on mount.

## E) USER ACTIONS
- **Navigation**:
  - Click "Get Started" -> Navigate to `/register`.
  - Click "Learn More" / "How It Works" -> Navigate to `/how-it-works`.
  - Click "Sign In" -> Navigate to `/login`.
  - Click "Student Login" -> Navigate to `/student/login`.
  - Click email link -> Opens mail client.

## F) DATA DISPLAY
- **Countdown**: Days/Hours calculated client-side based on `activeEvent` dates.
- **Hero Headline**: Randomly selected from `home.hero_headlines` array.
- **Stats**:
  - Minutes Logged (string).
  - Books Completed (string).
  - Funds Raised (string).
- **Impact Items**: List of strings.
- **Formatting**: No specific formatting logic (strings passed directly from content).

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**:
  - `useActiveEvent`: Returns `start_date`, `end_date` for countdown.
  - `useSiteContentMultiple`: Returns dictionary of content strings/JSON.
- **Data Shape (Content)**:
  - `home.hero_headlines`: JSON string array.
  - `home.stats`: JSON object `{ minutes_logged, books_completed, funds_raised }`.
  - `home.how_it_works_steps`: JSON array of objects `{ title, description }`.
  - `home.making_difference_items`: JSON string array.
  - Other text fields: Simple strings.

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public (no auth required).
- **Restrictions**: None.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Stats Real-time**: Stats appear to be manually managed via CMS content (`home.stats`) rather than calculated live from database logs in this component.
