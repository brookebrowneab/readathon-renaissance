

# Sponsor Logo on Home Page -- Design Options

Here are five placement options for incorporating a sponsor logo into the home page, each fitting the existing visual language (hand-drawn borders, serif typography, warm palette). These are proposals only -- no changes will be made until you choose one.

---

## Option A: "Sponsored By" Strip Between Stats and How It Works

- A new horizontal section between the Stats bookshelf band and the "How It Works" section (where the hand-drawn divider line currently sits).
- Layout: centered "Sponsored by" label in small muted text, followed by the sponsor logo image.
- On mobile: stacks vertically, logo scales down.
- Uses the existing hand-drawn border style around the logo or a subtle divider above/below.
- Data: a new `site_content` key (e.g. `home.sponsor_logo_url`) or a field on the `events` table, admin-editable.

## Option B: Inside the Hero Section (Beside or Below CTAs)

- The sponsor logo appears below the CTA buttons in the hero area, with a small "Proudly supported by" caption.
- Visually subordinate to the headline and buttons -- smaller size, muted opacity.
- On mobile: centered below buttons with reduced size.
- Advantage: high visibility without disrupting the hero hierarchy.

## Option C: Footer "Presented By" Row

- A new row added above the existing footer links, inside the Footer component.
- Contains centered sponsor logo with "Presented by" or "Thanks to our sponsor" label.
- Separated from footer links by a subtle border-top.
- On mobile: same layout, logo scales proportionally.
- Least intrusive -- doesn't affect above-the-fold content at all.

## Option D: Alongside the Countdown Timer

- The sponsor logo appears to the left of the existing countdown timer in the top-right area below the header.
- Layout becomes: `[sponsor logo] ... [countdown]` using `justify-between` in the container.
- On mobile: logo sits above or below the countdown, centered.
- Gives the sponsor premium "presenting partner" positioning without touching the hero.

## Option E: Dedicated "Our Sponsors" Section Before the CTA

- A new full-width section between "Making a Difference" and the final CTA block.
- Contains a heading ("Our Sponsors" or "Thank You to Our Sponsors"), one or more logo images in a centered flex row.
- Uses the hand-drawn border card style consistent with the "Making a Difference" list.
- Scales naturally to support multiple sponsors in the future.
- On mobile: logos wrap or scroll horizontally.

---

## Data Considerations (All Options)

- Sponsor logo URL would be stored as either:
  - A new `site_content` key (e.g. `home.sponsor_logo_url`, `home.sponsor_name`) -- admin-editable via the existing Site Content Editor.
  - Or a new column on the `events` table if it's event-specific (similar to `logo_url`).
- The `useEventLogo` hook pattern could be replicated as `useSponsorLogo`.
- A fallback (hide the section entirely) should apply when no sponsor logo is configured.

## Next Step

Let me know which option (or combination) you prefer and I will implement it.

