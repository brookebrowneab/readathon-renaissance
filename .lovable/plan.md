

# Logo Generator Tool for Admin

## Overview

This feature adds a logo generator tool to the admin settings page that allows administrators to create a new version of the Read-a-thon logo with updated dates each year. The tool will:

1. Display the static logo elements (Janney mascot, "Read-a-thon" text, open book icon)
2. Allow editing the date text with smart formatting
3. Provide horizontal positioning control for the date text (left/right slider)
4. Export the final logo as both SVG and PNG formats

## Date Format Rules

| Scenario | Format | Example |
|----------|--------|---------|
| Different months | "StartMonth Day - EndMonth Day" (no suffixes) | "February 24 - March 24" |
| Same month | "Month DaySuffix - DaySuffix" (with ordinal suffixes) | "February 24th - 28th" |

No year is displayed in either case.

## Requirements Summary

| Component | Behavior |
|-----------|----------|
| Janney logo | Static, not editable |
| "Read-a-thon" text | Static, not editable |
| Open book icon | Static, not editable |
| Date text | Auto-formatted from event dates, movable left/right |
| Font | Cooper Black (fixed size) |
| Export | SVG and PNG download |

## Technical Approach

### Date Formatting Logic

```typescript
function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function formatEventDatesForLogo(startDate: Date, endDate: Date): string {
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  
  if (startMonth === endMonth) {
    // Same month with ordinal suffixes: "February 24th - 28th"
    const startSuffix = getOrdinalSuffix(startDay);
    const endSuffix = getOrdinalSuffix(endDay);
    return `${startMonth} ${startDay}${startSuffix} - ${endDay}${endSuffix}`;
  } else {
    // Different months without suffixes: "February 24 - March 24"
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
}
```

### Ordinal Suffix Examples

| Day | Suffix | Result |
|-----|--------|--------|
| 1 | st | 1st |
| 2 | nd | 2nd |
| 3 | rd | 3rd |
| 4-10 | th | 4th, 5th, etc. |
| 11, 12, 13 | th | 11th, 12th, 13th (special case) |
| 21 | st | 21st |
| 22 | nd | 22nd |
| 23 | rd | 23rd |
| 24-30 | th | 24th, 25th, etc. |
| 31 | st | 31st |

### Component Structure

A new `LogoGenerator` component will be created and added as a new section on the Admin Settings page:

1. Load the existing SVG logo as a base
2. Auto-generate date text from active event dates using the format rules above
3. Allow manual override of the date text if needed
4. Use a slider to adjust horizontal position
5. Provide real-time preview
6. Export functionality using canvas conversion

### UI Layout

```text
+----------------------------------------------------------+
|  Logo Generator                                           |
+----------------------------------------------------------+
|  [Preview Area - Shows logo with date]                   |
|                                                          |
|  +----------------------------------------------------+  |
|  |  [Janney Logo] [Book] READ-A-THON                  |  |
|  |              February 24th - 28th                  |  |
|  +----------------------------------------------------+  |
|                                                          |
|  Date Text: [February 24th - 28th________]               |
|  (Auto-generated from event dates)                       |
|                                                          |
|  Position:  [<-------- slider -------->]                 |
|             Left                  Right                  |
|                                                          |
|  [Download SVG]  [Download PNG]                          |
+----------------------------------------------------------+
```

## Implementation Steps

### 1. Add Cooper Black Font

Add Cooper Black font file and @font-face declaration.

### 2. Create LogoGenerator Component

New file: `src/components/admin/LogoGenerator.tsx`

- Ordinal suffix helper function
- State for date text (auto-generated from active event, editable)
- State for horizontal position (slider value, default center)
- SVG rendering with dynamic text positioning
- Export functions for SVG and PNG

### 3. Date Auto-Generation

On component mount, read the active event's start and end dates and apply the formatting rules:
- Same month: "Month DaySuffix - DaySuffix" (e.g., "February 24th - 28th")
- Different months: "Month Day - Month Day" (e.g., "February 24 - March 24")

### 4. Export Functions

**SVG Export:**
- Serialize SVG element with embedded font
- Create Blob and trigger download

**PNG Export:**
- Render SVG to canvas at 2x resolution
- Convert to PNG using toDataURL()
- Trigger download

### 5. Integration

Add LogoGenerator component to Admin Settings page as a new card section.

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/admin/LogoGenerator.tsx` | Create - Main component |
| `src/pages/admin/AdminSettingsPage.tsx` | Modify - Add LogoGenerator section |
| `public/fonts/cooper-black.woff2` | Add - Cooper Black font file |
| `src/index.css` | Modify - Add @font-face for Cooper Black |

## Edge Cases

1. **No active event**: Show message prompting user to create an event first
2. **Font loading delay**: Show loading indicator until font is ready
3. **Very long date text**: Position slider helps fit text appropriately
4. **Manual text override**: Users can edit the auto-generated text if needed

