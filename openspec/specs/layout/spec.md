# Layout

Site-wide layout components that appear on every page.

## BaseHead

📁 Path: `src/components/layout/BaseHead/BaseHead.astro`

HTML `<head>` section with meta tags, assets, and SEO configuration.

### Props
- `title` — page title (required)
- `description` — page description (required)
- `image?` — OG image (default: `og-default.jpg`)

### Includes
- Global CSS, preloaded fonts, favicon
- GoogleAnalytics (`layout`)
- Sitemap and RSS links

### SEO Tags
- charset, viewport, generator, canonical URL
- Open Graph (`og:*`) tags
- Twitter Card (`twitter:*`) tags

## Header

📁 Path: `src/components/layout/Header/Header.astro`

Sticky site header with navigation, pinned to viewport top with white background and subtle shadow. Content centered at 960px max width.

### Structure
- Logo
- Desktop nav: numbered HeaderLinks (Blog, About, Services) + Resume button (inverse variant)
- Mobile: hamburger toggle → dropdown menu + overlay backdrop; click overlay to close

### Dependencies
- Uses: Button (`ui-primitives`), HeaderLink (`layout`)

## HeaderLink

📁 Path: `src/components/layout/HeaderLink/HeaderLink.astro`

Navigation link with automatic active state detection.

### Props
- `href` — link target (required)
- `number?` — numbered prefix (e.g., "01")
- `class?` — additional CSS classes
- Spreads HTML `<a>` attributes

### Behavior
- Active detection: matches current pathname or first path segment
- Active state: accent color, medium font weight
- Number prefix: renders as small muted text before link text (e.g., "01.")

## Footer

📁 Path: `src/components/layout/Footer/Footer.astro`

Site footer with top border and gradient background.

### Layout (3 columns on desktop)
- Copyright/contact: year, role, quote, email, GitHub/LinkedIn icons
- Utility links: Tags, Sitemap, RSS, Source repo
- ASCII cat decoration

### Meta
- Last updated date
- "Built with Astro" credit
- Commit SHA from `CF_PAGES_COMMIT_SHA` environment variable

## GoogleAnalytics

📁 Path: `src/components/layout/GoogleAnalytics/GoogleAnalytics.astro`

Google Analytics tracking script loader.

### Config
- Measurement ID: `G-SDS8ZJG4SS`
- Loads async `gtag.js` + inline config script

### Behavior
- Production only: loads when `import.meta.env.PROD` is true
- Development: script is not loaded
