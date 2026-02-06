# LogReadingPage Extraction

## A) PAGE IDENTIFICATION
- **Page Name**: LogReadingPage
- **Route**: `/log-reading`
- **Navigation Source**: Dashboard / Actions

## B) RESPONSIVE LAYOUT
- **Desktop**:
  - Max-width container.
- **Mobile**:
  - Uses `MobileMinutesStepper` for input (implied by import, though code shows standard buttons/inputs too).

## C) COMPONENT STRUCTURE
- **Layout**: `MainNav` + Content + `Footer`.
- **Header**: Title & Instructions.
- **Notices**: Grace Period warning (if applicable).
- **Child Selector**: Button group (if multiple children).
- **Stats Banner**: Selected child's current progress/goal.
- **Success View**: Confetti, Message, Summary.
- **Form**:
  - Date Picker (Calendar popover).
  - Minutes Input (Stepper/Buttons + Manual input).
  - Book Title (Autocomplete/Suggestions).
  - Notes (Textarea).
  - Submit Button.
- **History**: Recent logs list (collapsible/modal).

## D) UI STATES
- **Blocking**:
  - "Reading Starts Soon" (Pre-event).
  - "Read-a-thon Complete" (Closed).
  - Grace Period (Warning but allowed).
- **Validation**:
  - Future dates blocked.
  - Minutes constraints (1-480).
- **Success**: Replaces form with celebration view.
- **Loading**: Global loading state.

## E) USER ACTIONS
- **Select**: Child, Date, Book (Suggestion).
- **Input**: Minutes, Notes.
- **Submit**: Creates reading log.
- **Undo/Delete**: Delete recent log option.

## F) DATA DISPLAY
- **Progress**: Real-time updates based on new log.
- **Dates**: Smart formatting (Today, Yesterday).

## G) FRONTEND DATA EXPECTATIONS
- **Hooks**: `useChildren`, `useReadingLogs`, `useActiveEvent`, `useEventStatus`.
- **Validation**: Zod schema (`readingLogSchema`).

## H) AUTH / ROLE ASSUMPTIONS
- **Visibility**: Authenticated Parents.
- **Access Control**: `canParentsLog` flag from `useEventStatus` blocks access based on event phase.

## I) OPEN QUESTIONS / AMBIGUITIES
- None.
