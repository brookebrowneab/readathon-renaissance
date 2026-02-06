# AboutPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: AboutPage
- **Route**: `/about`
- **Navigation Source**: Main Navigation (Public)

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Hero section centered.
  - Mission section: 2-column grid (Text left, Stats right).
  - Values section: 3-column grid.
  - Security section: Centered content with 2-column grid for list items.
- **Mobile**:
  - Hero section centered.
  - Mission section: Stacks vertically (Text top, Stats bottom).
  - Values section: Stacks vertically (1 column).
  - Security section: List items stack vertically (1 column).
- **Breakpoints**: `sm` (grid-cols-2 for stats/security), `md` (grid-cols-3 for values), `lg` (grid-cols-2 for mission).

## C) COMPONENT STRUCTURE
- **Layout**: `PublicLayout`.
- **Hero Section**: Title with highlighter effect, subtitle.
- **Mission Section**:
  - Scrollable text container (max-h-80).
  - Statistics grid (Icon + Value + Label).
- **Values Section**:
  - Grid of value cards (Icon + Title + Description).
- **Privacy & Safety Section**:
  - Icon & Title.
  - Description text.
  - Security measures list.

## D) UI STATES
- **Loading**: Implicit via `useSiteContentMultiple`.
- **Content Fallback**: Uses `DEFAULT_CONTENT` and hardcoded fallbacks if API data is missing.

## E) USER ACTIONS
- None (Informational page only).

## F) DATA DISPLAY
- **Mission Text**: Supports multi-paragraph (splits on `\n\n`).
- **Statistics**:
  - Icon (mapped string to Lucide icon).
  - Value (string).
  - Label (string).
- **Values**:
  - Icon (mapped string to Lucide icon).
  - Title (string).
  - Description (string).

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**:
  - `useSiteContentMultiple`: Fetches content keys `about.mission_title`, `about.mission_text`, `about.statistics`, `about.values`, `about.privacy_text`.
- **Data Shape**:
  - `about.statistics`: JSON array `[{ icon, value, label }]`.
  - `about.values`: JSON array `[{ icon, title, description }]`.
  - `about.mission_text`: String (newlines for paragraphs).

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Public.

## I) OPEN QUESTIONS / AMBIGUITIES
- **Icon Mapping**: `iconMap` relies on exact string matches (e.g., "Users", "School"). If CMS provides an unknown icon name, it defaults to `Users` or `Target`.
