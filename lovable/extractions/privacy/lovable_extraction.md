# PrivacyPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: PrivacyPage
- **Route**: `/privacy`
- **Navigation Source**: Footer / Registration Form

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Security Safeguards list: 2-column grid.
- **Mobile**:
  - Security Safeguards list: Stacks vertically (1 column).
- **Breakpoints**: `sm` for grid layout.

## C) COMPONENT STRUCTURE
- **Layout**: `PublicLayout`.
- **Hero**: Title, Last Updated date.
- **Content Sections**:
  - Intro text.
  - Personal Data Collection.
  - Use and Sharing (with list).
  - Children's Privacy.
  - Cookies.
  - Security Safeguards (Featured section with grid list).
  - Your Rights.
  - Contact Us.

## D) UI STATES
- **Static**: Content is hardcoded in the component (unlike other pages which use CMS hooks).

## E) USER ACTIONS
- **Navigation**: Click email links (`mailto:`).

## F) DATA DISPLAY
- **Hardcoded Text**: All policy text, lists, and dates are directly in the TSX file.

## G) FRONTEND DATA EXPECTATIONS
- None (Static content).

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public.

## I) OPEN QUESTIONS / AMBIGUITIES
- None.
