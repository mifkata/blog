# UI Primitives

Shared, reusable UI components used across multiple pages and capabilities.

## Button

📁 Path: `src/components/ui/Button/Button.astro`

Clickable action element that renders as a link when `href` is provided.

### Props
- `href?` — renders as `<a>` when set
- `variant?` — `normal` (default) | `inverse` | `ghost`
- `class?` — additional CSS classes
- Default slot for content (text/icons)

### Variants
- Normal — light gradient background, brown text
- Inverse — orange gradient background, light text
- Ghost — transparent background with border

### Behavior
- Hover: lifts slightly with shadow (200ms transition)

## Container

📁 Path: `src/components/ui/Container/Container.astro`

Centered content wrapper rendering as `<main>`.

### Props
- `size?` — `default` (720px) | `wide` (960px)
- `class?` — additional CSS classes
- Spreads HTML `<main>` attributes
- Default slot for page content

## FormattedDate

📁 Path: `src/components/ui/FormattedDate/FormattedDate.astro`

Renders a `<time>` element with ISO datetime and human-readable display.

### Props
- `date` — Date, string, or number (required)
- `class?` — additional CSS classes

### Format
- Locale: `en-us`
- Style: "Dec 30, 2025" (month short, day numeric, year numeric)

## Tag

📁 Path: `src/components/ui/Tag/Tag.astro`

Clickable tag link for categorization, linking to `/tags/{tag}/`.

### Props
- `tag` — tag string (required)
- `variant?` — `default` | `dark`
- `class?` — additional CSS classes
- Spreads HTML `<a>` attributes

### Variants
- Default — light gray background, dark text; hover: accent background, white text
- Dark — semi-transparent white background, white text; for dark backgrounds
