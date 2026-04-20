# DESIGN.md

Visual design system for the Arielle & Kevin wedding site. Read before
any UI or component work. Tokens defined here must be used via CSS custom
properties — never hardcoded in components.

---

## Brand

- **Name**: Arielle & Kevin — Almost Suriel
- **Tagline**: We're getting married!
- **Personality**: Modern, romantic, feminine, editorial, premium
- **Audience**: Wedding guests (friends & family)
- **Not this**: Template-ish, masculine, overly playful, cluttered, gradient-heavy

## Voice and Tone

- **Writing style**: Warm, elegant, personal
- **Point of view**: First-person plural (we/our)
- **Example microcopy**:
  - CTA button: "RSVP Now"
  - Section heading: "Our Story"
  - Countdown label: "Days Until We Say I Do"

## Design Principles

1. Zero hardcoded values — every color, font, spacing, radius via CSS custom properties
2. Modern editorial aesthetic — full-bleed photos, card overlays, asymmetric layouts
3. Feminine & romantic — deep crimson + warm cream, elegant serif + script typography
4. Mobile-first — designed for phones, enhanced for desktop
5. No gradients, no emojis — flat solid colors with clear contrast

## Design Inspiration

Inspired by `template/1/` reference images (modern editorial wedding site):
- Full-bleed hero with centered invitation card overlay on photo
- Asymmetric photo + text sections with decorative corner frames
- Side-by-side dress code cards on dark crimson background
- Masonry gallery grid with hashtag heading
- Split-screen RSVP section (photo + content)
- Clean card-based layout for details and activities

Key reference files in `template/1/`:
- `hero.png` — full-viewport hero with card overlay
- `after-hero.png` — asymmetric story section
- `wedding-details.png` — card grid for venue/hotel info
- `dresscode.png` — side-by-side cards on dark background
- `galerry.png` — masonry photo gallery
- `rsvp-section.png` — split-screen RSVP layout
- `gift-registry-section.png` — centered registry embed

## Color Tokens

Semantic names, not hex names. All colors flat (no gradients). Values
live in `css/tokens.css` as CSS custom properties.

### Surfaces
- `--canvas` (#FFF8F0) — primary background, warm cream
- `--surface` (#FFFFFF) — cards, panels
- `--elevated` (#F5F0EA) — raised or highlighted sections

### Text
- `--ink` (#2C2C2C) — primary body text
- `--slate` (#6B6B6B) — secondary text
- `--muted` (#9A9A9A) — tertiary text, captions

### Accent
- `--signal` (#9B1B30) — primary brand accent, deep crimson (CTAs, highlights, dark sections)
- `--signal-deep` (#7A1526) — hover / pressed state
- `--signal-light` (#A52222) — lighter crimson variant
- `--accent-soft` (#E8D5D0) — secondary accent, warm rose (badges, subtle emphasis, decorative)

### Support
- `--border` (rgba(44,44,44,0.08)) — default borders, dividers
- `--border-strong` (rgba(44,44,44,0.15)) — emphasized dividers
- `--danger` (#B91C1C) — destructive actions, errors
- `--success` (#166534) — confirmations, successful states

### RGB Channel Tokens (for alpha transparency)
- `--canvas-rgb: 255, 248, 240`
- `--surface-rgb: 255, 255, 255`
- `--ink-rgb: 44, 44, 44`
- `--signal-rgb: 139, 26, 26`
- `--accent-soft-rgb: 232, 213, 208`

Usage: `rgba(var(--canvas-rgb), 0.9)` instead of raw rgba values.

## Typography

### Font stacks
- `--font-display` (Playfair Display) — headlines, editorial moments, section titles
- `--font-script` (Cormorant Garamond) — couple names, dates, romantic accents
- `--font-body` (DM Sans) — body copy, UI, navigation

Google Fonts loaded: Playfair Display (400,700), Cormorant Garamond (300,400,600i), DM Sans (400,500,700)

### Type scale (mobile-first)
- `--text-xs` — 0.75rem (12px)
- `--text-sm` — 0.875rem (14px)
- `--text-base` — 1rem (16px)
- `--text-lg` — 1.125rem (18px)
- `--text-xl` — 1.375rem (22px)
- `--text-2xl` — 1.75rem (28px)
- `--text-3xl` — 2.25rem (36px)
- `--text-4xl` — 3rem (48px)
- `--text-display` — 4rem mobile, 5rem tablet, 6rem desktop

### Hierarchy rules
- H1 once per page (hero names), `--font-display`
- Section headings use `--font-display`
- Script font (`--font-script`) reserved for couple names, "We're getting married!", romantic accents
- Body copy uses `--font-body` for clarity on mobile

## Spacing

8px base scale:
- `--space-1` — 0.25rem (4px)
- `--space-2` — 0.5rem (8px)
- `--space-3` — 0.75rem (12px)
- `--space-4` — 1rem (16px)
- `--space-6` — 1.5rem (24px)
- `--space-8` — 2rem (32px)
- `--space-10` — 2.5rem (40px)
- `--space-12` — 3rem (48px)
- `--space-16` — 4rem (64px)
- `--space-20` — 5rem (80px)
- `--space-24` — 6rem (96px)
- `--space-32` — 8rem (128px)

## Radii

- `--radius-sm` — 4px
- `--radius-md` — 8px
- `--radius-lg` — 16px
- `--radius-xl` — 24px
- `--radius-pill` — 999px
- `--radius-round` — 50%

## Shadows

Flat-first. Shadows used sparingly for depth, never for decoration.

- `--shadow-sm` — subtle card lift (0 1px 3px)
- `--shadow-md` — elevated panels (0 4px 16px)
- `--shadow-lg` — modals, dropdowns (0 12px 40px)
- `--shadow-nav` — navbar on scroll (0 2px 20px)

## Motion

- `--ease-out` — cubic-bezier(0.16, 1, 0.3, 1) (default for entrances)
- `--ease-in-out` — cubic-bezier(0.65, 0, 0.35, 1) (default for state changes)
- `--duration-fast` — 150ms
- `--duration-base` — 300ms
- `--duration-slow` — 500ms

Animation library: GSAP + ScrollTrigger (CDN)
Smooth scroll: Lenis (CDN)
All animations respect `prefers-reduced-motion`.
CSS transitions on base selectors, never inside `:hover`.

## Breakpoints

Mobile-first. Use `min-width` queries only.

- 640px — large phones, small tablets
- 768px — tablets
- 1024px — small laptops
- 1280px — desktops

## Layout

- `--max-width` — 1200px (content container)
- `--section-padding-y` — var(--space-24) mobile, var(--space-32) desktop
- `--section-padding-x` — var(--space-6) mobile, var(--space-12) desktop
- `--nav-height` — 64px

## Mobile-First Responsive Strategy

Every section MUST be fully usable and beautiful on mobile (320px+) FIRST. Desktop
is an enhancement, not the baseline.

### Mobile Rules (applied to all sections)
- **Hero**: Card centered on mobile, shifts left on desktop (768px+). Card max-width
  shrinks on small screens. Names use `--text-2xl` mobile, `--text-display` desktop.
- **Navbar**: Full-screen crimson overlay with hamburger on mobile. Horizontal links
  on desktop (768px+). Hamburger hidden on desktop.
- **Countdown**: Numbers use `--text-4xl` mobile, `--text-display` desktop. Blocks
  stack tighter on mobile with smaller gaps.
- **Our Story**: Single column (text then photo) on mobile. Side-by-side asymmetric
  layout on desktop (768px+).
- **Wedding Details**: Cards stack vertically on mobile. Side-by-side on desktop
  (1024px+). Card photos go full-width on mobile.
- **Dress Code**: Cards stack vertically on mobile. Side-by-side on desktop (768px+).
- **Wedding Party**: 2-column grid on mobile, 4-column on desktop (768px+).
- **Gallery**: 2-column masonry on mobile, 3 at 640px, 4 at 1024px.
- **Things To Do**: 1-column on mobile, 2 at 768px, 3 at 1024px.
- **RSVP**: Stacked (photo on top, content below) on mobile. Split-screen 50/50
  on desktop (768px+).
- **FAQ**: Full-width accordion, same on all breakpoints. Touch targets 44px+.
- **Footer**: All links wrap naturally, centered.

### Testing Breakpoints
Test at these widths: 320px, 375px, 414px, 640px, 768px, 1024px, 1280px, 1440px.
Every section must look intentional at every width, not just "not broken."

## Section Order (single scrolling page)

1. **Navbar** — sticky, backdrop blur, hamburger on mobile
2. **Hero** — full-bleed photo, centered invitation card overlay, countdown timer
3. **Our Story** — asymmetric layout, text + offset photo with corner frames
4. **Wedding Details** — venue/hotel cards with photos, timeline, map links
5. **Dress Code** — crimson background, side-by-side ladies/gentlemen cards
6. **Wedding Party** — circular headshots grid, bridal + groom sides
7. **Gallery** — masonry grid, #almostsuriel hashtag, lightbox
8. **Things To Do** — activity cards for Miami area venues
9. **Gift Registry** — Zola embed widget (key: "almostsuriel")
10. **RSVP** — split-screen, CTA linking to Zola RSVP page
11. **FAQs** — accordion-style Q&A cards
12. **Footer** — crimson background, couple names, nav links

## Components

All components use vanilla HTML + CSS. Every element:
1. Uses design tokens via `var(--*)`
2. Is responsive by default (mobile-first)
3. Has accessible defaults (labels, focus states, sufficient contrast)
4. Uses `.reveal` class for GSAP scroll-triggered animations

### Button
- Variants: primary (crimson fill), outline (crimson border), ghost (text only)
- All have `:focus-visible` outlines
- Min touch target: 44x44px
- Dark-background overrides for buttons on `--signal` sections

### Card
- Padding: `var(--space-6)`
- Radius: `var(--radius-lg)`
- Border: `1px solid var(--border)`
- Background: `var(--surface)`

### FAQ Accordion
- `max-height` collapse with `.active` toggle
- Chevron rotation on open
- `role="region"` and `aria-expanded` for accessibility

## Photo Folder Structure

```
photos/
  hero/           -- 1 hero background photo
  story/          -- 2-3 photos for Our Story section
  details/        -- venue and hotel photos
  party/          -- headshots for each wedding party member
  gallery/        -- all gallery photos (multiple)
  things-to-do/   -- activity location photos
  rsvp/           -- 1 photo for RSVP split-screen
```

## Integrations

- **Registry**: Zola embed widget (key: "almostsuriel", widget.js script)
- **RSVP**: Link to Zola RSVP page (no embeddable RSVP widget)
- **Hosting**: Vercel (static deploy)
- **Domain**: Porkbun (to be purchased later)

## Accessibility

- All text meets WCAG AA contrast
- Focus states visible on all interactive elements (`:focus-visible`)
- Target sizes >= 44x44px on touch
- Form fields have labels
- Images have alt text (or marked decorative)
- Respect `prefers-reduced-motion`
- `.js-enabled .reveal` guard so content stays visible without JS
- `aria-expanded`, `aria-controls`, `aria-label`, `aria-live` used throughout

## File Structure

```
wedding-rsvp-site/
  index.html            -- single-page site, all sections
  css/
    tokens.css          -- CSS custom properties
    styles.css          -- all component styles, imports tokens.css
  js/
    main.js             -- GSAP, Lenis, countdown, hamburger, FAQ, lightbox
  photos/               -- photo folders by section
  template/1/           -- design reference images
  DESIGN.md             -- this file
```

## References

- `template/1/` — modern editorial wedding site layout (primary inspiration)
- Zola.com — registry widget and RSVP page
