

# Sponsor Dashboard Menu Implementation Plan

## Overview
Add a dedicated navigation menu for sponsors on the Sponsor Dashboard page. This menu will provide easy access to key sponsor features and match the visual style established elsewhere in the app.

## Current State Analysis

The Sponsor Dashboard currently has:
- No dedicated sidebar or menu navigation
- A logout button in the header area
- Content focused on past sponsorships and getting started with new ones

Existing navigation patterns in the app:
- **Parent Dashboard**: Has a "Quick Actions" sidebar on desktop with styled action buttons
- **Bottom Tab Bar**: Used on mobile for role-based navigation (sponsors have: Home, Pledges, Payments, Profile)
- **Mobile Drawer**: Provides navigation links for sponsors (Dashboard, My Pledges, Payments)

## Proposed Menu Structure

Based on the available sponsor pages and functionality, the menu will include:

| Menu Item | Route | Icon | Description |
|-----------|-------|------|-------------|
| Dashboard | `/sponsor/dashboard` | Home | Current page - overview and stats |
| My Pledges | `/my-pledges` | Heart | View pledges made to students |
| Make Payment | `/sponsor/pay` | CreditCard | Pay pending pledges |
| Account | - | User | Profile/account settings |
| Sign Out | - | LogOut | Logout action |

## Implementation Approach

### Desktop: Quick Actions Sidebar (similar to Parent Dashboard)
- Position a sticky sidebar on the right side on larger screens (lg+)
- Display menu items as styled buttons matching the `handDrawnBorder` aesthetic
- Show sponsor stats summary below the menu
- Highlight the active page

### Mobile: Bottom Tab Bar + Mobile Drawer
- Add the `BottomTabBar` component with role="sponsor"
- The existing mobile drawer already has sponsor navigation defined

## Technical Changes

### File: `src/pages/sponsor/SponsorDashboardPage.tsx`

1. **Import BottomTabBar component** for mobile navigation

2. **Restructure layout** to include:
   - Main content area (existing content, but narrower on desktop)
   - Desktop sidebar with Quick Actions menu
   - Mobile bottom tab bar

3. **Add menu items** as styled links/buttons:
   - Use `NavLink` or check `location.pathname` for active states
   - Apply consistent styling with `handDrawnBorder`
   - Include icons from lucide-react

4. **Add spacer** at bottom for mobile to account for the bottom tab bar

### File: `src/components/layout/BottomTabBar.tsx`

1. **Update sponsorTabs** to point to the correct routes:
   - Change "Pledges" href from `/sponsor/dashboard` to `/my-pledges`
   - Ensure "Profile" points to a valid route or remains placeholder

### File: `src/components/layout/MobileNavDrawer.tsx`

1. **Update sponsorNav** to point "My Pledges" to `/my-pledges` instead of `/sponsor/dashboard`

## Visual Design

The sidebar will match the Parent Dashboard style:

```text
+---------------------------+
|     Quick Actions         |
+---------------------------+
| [Home icon] Dashboard     |  <- active state highlighted
| [Heart icon] My Pledges   |
| [Card icon] Make Payment  |
| [User icon] Account       |
+---------------------------+
|        Stats              |
+---------------------------+
| Total Given | Years       |
|   $99       |   2         |
+---------------------------+
```

Mobile bottom tabs:

```text
+------+--------+---------+---------+
| Home | Pledges| Payments| Profile |
+------+--------+---------+---------+
```

## Summary of File Changes

1. **`src/pages/sponsor/SponsorDashboardPage.tsx`**
   - Add flex layout with main content + sidebar
   - Add desktop sidebar with Quick Actions menu
   - Add BottomTabBar for mobile
   - Add spacer div for mobile bottom bar
   - Move Sign Out button to sidebar menu

2. **`src/components/layout/BottomTabBar.tsx`**
   - Update `sponsorTabs` to use `/my-pledges` for Pledges tab

3. **`src/components/layout/MobileNavDrawer.tsx`**
   - Update `sponsorNav` to use `/my-pledges` for My Pledges item

