

# Dashboard Mobile/Tablet Layout: Hamburger Menu + Sponsor Banner

## What Changes

On mobile and tablet (below `lg` breakpoint), the dashboard will get two new elements in the header area:

1. **Hamburger menu (left)** -- Opens the Quick Actions as a dropdown/drawer
2. **Sponsor logo banner (right)** -- Hangs down from the white header area with rounded bottom corners

On desktop (`lg+`), everything stays as-is (sidebar with Quick Actions and SponsorTab).

---

## Visual Layout (Mobile/Tablet)

```text
+--[ MainNav header (white) ]---------------------------+
|  [Logo]                              [Nav] [Hamburger] |
+--------------------------------------------------------+
|  [=] Quick Actions          [ Sponsor Logo Banner ]    |
|  hamburger (left)           drops from white area,     |
|                             rounded bottom corners     |
+--------------------------------------------------------+
|                                                        |
|  Dashboard content...                                  |
```

---

## Technical Details

### 1. New Component: `DashboardMobileBar`

A sub-header bar visible only on mobile/tablet (`lg:hidden`), placed just below the MainNav inside DashboardPage:

- **Left side**: Hamburger icon button that opens a sheet/drawer containing the Quick Actions buttons
- **Right side**: Sponsor logo banner -- uses the same data (`home.sponsor_logo_url`, `home.sponsor_name`) but styled differently:
  - White/light background (extending from the header)
  - Rounded bottom corners (`rounded-b-xl`)
  - No top rounding (flush with header)
  - Shadow on bottom edge for depth
  - Conditionally hidden if no sponsor logo URL

### 2. Modify `SponsorTab.tsx`

Add a `variant` prop to support two styles:
- `"tab"` (default) -- current right-flush navy pill with rounded left corners (used on HomePage and desktop dashboard sidebar)
- `"banner"` -- drops from header, white/light background, rounded bottom corners, right-aligned

### 3. Modify `DashboardPage.tsx`

- Extract the Quick Actions buttons into a shared list/component so they can be rendered both in the desktop sidebar and in the mobile hamburger drawer
- Add the `DashboardMobileBar` below `<MainNav />`, visible only on `lg:hidden`
- The existing `<aside>` sidebar remains `hidden lg:block`

### 4. Files to Create/Modify

| File | Action |
|---|---|
| `src/components/layout/SponsorTab.tsx` | Add `variant` prop (`"tab"` or `"banner"`) with corresponding styles |
| `src/pages/DashboardPage.tsx` | Add mobile bar with hamburger + sponsor banner below MainNav; extract Quick Actions into reusable section |

### 5. Sponsor Banner Styling (variant="banner")

```text
Container: bg-white rounded-b-xl shadow-md px-4 py-2
Logo: h-10 w-auto object-contain (no invert -- displayed on light bg)
Label: "Proudly supported by" in small text above logo
Position: right side of the mobile sub-header bar
```

### 6. Hamburger Drawer

Uses the existing `Sheet` component (from Radix/shadcn) opening from the left, containing:
- "Quick Actions" heading
- All the same action buttons currently in the desktop sidebar
- Close button

