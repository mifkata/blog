# Common Sections

Reusable page sections, base layout, and utility pages shared across the site.

## PageLayout

📁 Path: `src/layouts/PageLayout.astro`

Base page layout wrapping all standard pages. Renders the full HTML document: `<html>` → BaseHead + Header + `<main>` content slot + Footer.

### Props

- `title` — page title (required)
- `description` — page description (required)
- `image?` — SEO image
- `size?` — `default` (720px) | `wide` (960px) | `full` (1120px)
- `class?` — additional CSS classes

### Page Size Conventions

- Full: Home
- Wide: About, Resume, Services, Blog Index
- Default: Blog Year, Tags Index, Tag, 404

### Notes

- BlogPostLayout is a separate layout with TOC, related posts, and comments
- Uses: BaseHead, Header, Footer (`layout`)

## PageHeader

📁 Path: `src/components/pages/common/PageHeader/PageHeader.astro`

Page title section with optional subtitle and description.

### Props

- `title` — page title (required)
- `subtitle?` — muted secondary text
- `description?` — body text
- `class?` — additional CSS classes
- Default slot for additional content below

## SectionHeader

📁 Path: `src/components/pages/common/SectionHeader/SectionHeader.astro`

Section heading with optional icon displayed inline.

### Props

- `title` — section title (required)
- `class?` — additional CSS classes
- `icon` slot — icon element displayed before title

## ContactCTA

📁 Path: `src/components/pages/common/ContactCTA/ContactCTA.astro`

Centered call-to-action section with top border separator.

### Props

- `headline?` — default: "Want to work together?"
- `description?` — default: availability message
- `buttonText?` — default: "Get in Touch"
- `buttonHref?` — default: `mailto:hi@mifkata.com`
- Default slot for additional content

### Dependencies

- Uses: Button (`ui-primitives`) with inverse variant

## ListSection

📁 Path: `src/components/pages/common/ListSection/ListSection.astro`

Section with uppercase title header and optional horizontal rule.

### Props

- `title` — section title (required)
- `showLine?` — show horizontal rule (default: true)
- `class?` — additional CSS classes
- Default slot for content

## 404 Error Page

📁 Path: `src/pages/404.astro`
📍 Route: `/404`

Not found error page using PageLayout with default size and centered text. Displays a 404 image, themed title ("These are not the droids..."), and description.

### Dependencies

- Uses: PageLayout (`common-sections`)
