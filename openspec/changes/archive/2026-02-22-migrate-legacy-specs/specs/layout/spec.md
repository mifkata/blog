## ADDED Requirements

### Requirement: BaseHead HTML head
The system SHALL provide a BaseHead component at `src/components/layout/BaseHead/BaseHead.astro` that renders the HTML `<head>` section. It SHALL accept a required `title`, required `description`, and optional `image` (defaults to `og-default.jpg`).

It SHALL include: global CSS, GoogleAnalytics (`layout`), preloaded fonts, favicon, sitemap link, RSS feed link, charset/viewport/generator meta tags, canonical URL, Open Graph tags, and Twitter Card tags.

#### Scenario: Render with default image
- **WHEN** BaseHead is rendered without an image prop
- **THEN** it uses `og-default.jpg` as the Open Graph and Twitter Card image

#### Scenario: Render with custom image
- **WHEN** BaseHead is rendered with a custom image
- **THEN** the Open Graph and Twitter Card tags reference the provided image

#### Scenario: SEO meta tags present
- **WHEN** any page renders with BaseHead
- **THEN** the HTML head contains title, description, canonical URL, Open Graph tags, and Twitter Card tags

### Requirement: Header navigation
The system SHALL provide a Header component at `src/components/layout/Header/Header.astro` that renders a sticky site header with navigation. The header SHALL be pinned to the top of the viewport with a white background and subtle shadow, centered at a maximum width of 960px.

It SHALL contain: a logo, desktop navigation with numbered HeaderLinks (Blog, About, Services) plus a Resume button using Button (`ui-primitives`) with inverse variant, and a mobile hamburger menu toggle.

#### Scenario: Render desktop navigation
- **WHEN** the viewport is desktop-sized
- **THEN** the header displays the logo, numbered navigation links, and a Resume button inline

#### Scenario: Render mobile navigation
- **WHEN** the viewport is mobile-sized and the user taps the hamburger icon
- **THEN** a dropdown menu appears with navigation links and an overlay backdrop

#### Scenario: Close mobile menu
- **WHEN** the mobile menu is open and the user taps the overlay backdrop
- **THEN** the mobile menu closes

### Requirement: HeaderLink with active state
The system SHALL provide a HeaderLink component at `src/components/layout/HeaderLink/HeaderLink.astro` that renders a navigation link with automatic active state detection. It SHALL accept a required `href`, optional `number` prefix, and spread HTML anchor attributes.

Active state SHALL be determined by matching the current pathname or the first path segment. Active links display in accent color with medium font weight. An optional number renders as a small muted prefix (e.g., "01.").

#### Scenario: Render active link
- **WHEN** the user is on `/blog` and HeaderLink has `href="/blog"`
- **THEN** the link displays in accent color with medium font weight

#### Scenario: Render inactive link
- **WHEN** the user is on `/about` and HeaderLink has `href="/blog"`
- **THEN** the link displays in default dark gray color

#### Scenario: Render numbered link
- **WHEN** HeaderLink is rendered with `number="01"`
- **THEN** the number appears as a small muted prefix before the link text

### Requirement: Footer
The system SHALL provide a Footer component at `src/components/layout/Footer/Footer.astro` that renders a site footer with a top border and gradient background. It SHALL display three columns on desktop: copyright/contact info (year, role, quote, email, GitHub/LinkedIn icons), utility links (Tags, Sitemap, RSS, Source repo), and an ASCII cat decoration.

The footer SHALL show the last updated date, "Built with Astro" credit, and the current commit SHA from the `CF_PAGES_COMMIT_SHA` environment variable.

#### Scenario: Render footer with commit SHA
- **WHEN** the page renders in a Cloudflare Pages deployment
- **THEN** the footer displays the commit SHA from the environment variable

#### Scenario: Render footer links
- **WHEN** the footer renders
- **THEN** it includes links to Tags, Sitemap, RSS feed, and the source code repository

### Requirement: GoogleAnalytics tracking
The system SHALL provide a GoogleAnalytics component at `src/components/layout/GoogleAnalytics/GoogleAnalytics.astro` that loads the Google Analytics tracking script. It SHALL only load in production mode (`import.meta.env.PROD`) and use measurement ID `G-SDS8ZJG4SS`.

#### Scenario: Production environment
- **WHEN** the site is built for production
- **THEN** the GA gtag.js script loads asynchronously with the configured measurement ID

#### Scenario: Development environment
- **WHEN** the site runs in development mode
- **THEN** the GA script is not loaded
