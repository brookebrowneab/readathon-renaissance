# HowItWorksPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: HowItWorksPage
- **Route**: `/how-it-works`
- **Navigation Source**: Public Navigation / Home Page CTA

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Steps list: Centered max-width container.
  - Stats section: 3-column grid.
  - CTA section: Flex row for buttons.
- **Mobile**:
  - Stats section: 3-column grid (dense) or implicit stacking handled by grid-cols-3 (might be cramped on very small screens, layout defines `grid-cols-3` for all widths but `md:gap-10` vs `gap-6`).
  - CTA section: Flex column for buttons.
- **Breakpoints**: `md` used for spacing and font sizes.

## C) COMPONENT STRUCTURE
- **Layout**: `PublicLayout`.
- **Hero Section**: Title with highlighter effect, dynamic description.
- **Steps Section**:
  - List of steps.
  - Each step: Checkmark image + Title + Description + Bulleted list.
- **FAQ Section**:
  - List of FAQs (Title + Text).
- **Stats/Impact Section**:
  - 3-column stats display with bookshelf background.
- **CTA Section**:
  - Title, description.
  - "Register" and "Sign In" buttons.

## D) UI STATES
- **Loading**: Implicit via content hook.
- **Default**: Displays content from `DEFAULT_CONTENT` if CMS is empty.

## E) USER ACTIONS
- **Navigation**:
  - Click "Register Now" -> `/register`.
  - Click "Sign In" -> `/login`.

## F) DATA DISPLAY
- **Steps**:
  - Title, Description.
  - Details list (bullet points).
- **FAQs**: Question, Answer.
- **Stats**: Event Duration, Typical Goal, School Impact.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**: `useSiteContentMultiple`.
- **Keys**:
  - `howitworks.hero_description`
  - `howitworks.steps` (JSON Array)
  - `howitworks.faqs` (JSON Array)
  - `howitworks.stats` (JSON Object)

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Stats Source**: "Stats" here refer to static info (e.g., "2 weeks long") rather than live event data.
