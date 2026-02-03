

# Move Student Dashboard Main Container Down 15px on Tablet

## Change Summary

Add 15px top margin to the main container specifically for tablet viewport sizes.

## Implementation

**File:** `src/pages/student/StudentDashboardPage.tsx`

**Current (line 96):**
```tsx
<main className="px-4 pb-8 space-y-6 max-w-lg mx-auto">
```

**Updated:**
```tsx
<main className="px-4 pb-8 space-y-6 max-w-lg mx-auto md:mt-[15px] lg:mt-0">
```

## Technical Details

- `md:mt-[15px]` - Applies 15px top margin at the `md` breakpoint (768px+), which is the tablet range
- `lg:mt-0` - Resets the margin to 0 at the `lg` breakpoint (1024px+) to avoid affecting desktop
- Uses Tailwind's arbitrary value syntax `[15px]` for the exact pixel value requested

