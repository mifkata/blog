# Home Page

Landing page with hero, terminal, featured content, and reading list.

## Page

📁 Path: `src/pages/index.astro`
📍 Route: `/`
📐 Layout: PageLayout — full

### Data
- `posts` — all blog posts sorted descending
- `latestPost` — posts[0]
- `recentPosts` — posts.slice(0, 3)

### Sections (in order)
1. HomeHero — full-width hero with background image
2. HomeTerminal — fake CLI output
3. Featured Showcase — 3-column grid: Latest / Popular / About cards
4. RecentPosts — 3 most recent posts
5. CurrentlyReading — reading list

### Dependencies
- Uses: PageLayout (`common-sections`), Button (`ui-primitives`), FormattedDate (`ui-primitives`), CurrentlyReading

## HomeHero

📁 Path: `src/components/pages/home/HomeHero/HomeHero.astro`

Full-width hero section with background image. Static content, no props.

### Layout
- Breaks out of PageLayout container using negative margins to span full viewport
- Background image (`home-hero-bg.png`) with white overlay
- Content constrained to readable width: intro text (name, tagline, description)
- Two CTAs: inverse Button → `/blog`, ghost Button → `/about`

### Dependencies
- Uses: Button (`ui-primitives`)

## HomeTerminal

📁 Path: `src/components/pages/home/HomeTerminal/HomeTerminal.astro`

Decorative fake CLI terminal section.

### Props
- `command?` — command text (default: "cat current_focus.txt")
- `output?` — output text (default: "Exploring vibe coding...")

### Layout
- Dark box with monospace font
- Accent-colored `$` prompt + white command text
- Muted `>` prefix + output text

## RecentPosts

📁 Path: `src/components/pages/home/RecentPosts/RecentPosts.astro`

Recent blog posts list section.

### Props
- `posts` — blog post array (required)

### Layout
- Header: title + horizontal rule + "View all posts →" link to `/blog`
- List of posts: title + formatted date, separated by bottom borders
- Hover: title changes to accent color

### Dependencies
- Uses: FormattedDate (`ui-primitives`)

## FeaturedSeries

📁 Path (wrapper): `src/components/pages/home/FeaturedSeries/FeaturedSeries.astro`
📁 Path (React): `src/components/pages/home/FeaturedSeries/FeaturedSeries.tsx`

Interactive series carousel loaded with `client:load`.

### Props
- `title` — series title
- `items` — SeriesItem array (url, title, synopsis?, heroImage?, updatedDate?)

### Behavior
- Starts at item 0, auto-rotates every 3 seconds
- Clicking any item stops auto-rotation
- Active item shows: markdown synopsis, date, "Read more →" link

### Desktop
- Cards show hero images with scale animation
- Active card: scaled up with elevated z-index

### Mobile
- Stacked cards without images, teal highlight bar (blend-exclusion)
- Active item details show hero image

### Styling
- Uses `tailwind-variants` with slots and variants

### Accessibility
- Buttons: `aria-label="View details for {title}"`, `aria-pressed` state

### Dependencies
- Wrapper fetches via `getSeriesWithPosts(slug)` from `helpers`

## CurrentlyReading

📁 Path: `src/components/pages/home/CurrentlyReading/CurrentlyReading.astro`

Reading list section. Static content, no props.

### Data
- Imports from `src/data/books.json` (array of {title, author, url})

### Layout
- Styled card: light gray background, rounded corners, accent-colored left border
- Each book: linked title (accent color) + author name
