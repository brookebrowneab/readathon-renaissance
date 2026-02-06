# FAQPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: FAQPage
- **Route**: `/faq`
- **Navigation Source**: Public Navigation / Footer

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Hero text left-aligned with indentation.
  - Accordion items take full width of container.
  - "Still Have Questions" buttons in flex row.
  - CTA buttons in flex row.
- **Mobile**:
  - Hero text indentation reduced.
  - "Still Have Questions" buttons stack vertically.
  - CTA buttons stack vertically.
- **Breakpoints**: `sm`, `md`, `lg`.

## C) COMPONENT STRUCTURE
- **Layout**: `PublicLayout`.
- **Hero**: Title with highlighter effect, description.
- **FAQ List**:
  - Grouped by Category.
  - Accordion component for questions.
- **Contact Section**:
  - "Still Have Questions" text.
  - Email button & "How It Works" link.
- **CTA Section**: Standard registration/login CTA.

## D) UI STATES
- **Accordion**: Expand/Collapse state (controlled by `Accordion` component).
- **Loading**: Implicit.

## E) USER ACTIONS
- **Interaction**: Click accordion header to expand/collapse answer.
- **Navigation**:
  - Click "Contact Us" -> `mailto:` link.
  - Click "How It Works" -> `/how-it-works`.
  - Register/Sign In buttons.

## F) DATA DISPLAY
- **FAQ Content**:
  - Categorized list.
  - Each item has Question (q) and Answer (a).
  - Rendered inside Accordion.

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**: `useSiteContentMultiple`.
- **Keys**:
  - `faq.hero_description`
  - `faq.items`: JSON array of objects `{ category, questions: [{ q, a }] }`.
  - `faq.still_questions_text`

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public.

## I) OPEN QUESTIONS / AMBIGUITIES
- None.
