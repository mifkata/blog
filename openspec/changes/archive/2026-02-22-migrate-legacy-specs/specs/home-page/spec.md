## ADDED Requirements

### Requirement: Home page structure
The system SHALL provide a Home page at `src/pages/index.astro` at URL `/` using PageLayout (`common-sections`) with full size. It SHALL load all blog posts sorted by date descending, extract the latest post and the 3 most recent posts. It SHALL render the following sections in order: HomeHero, HomeTerminal, a Featured Showcase (3-column grid with Latest/Popular/About cards), RecentPosts, and CurrentlyReading.

#### Scenario: Render home page
- **WHEN** a user navigates to `/`
- **THEN** the page displays Hero, Terminal, Featured Showcase, Recent Posts, and Currently Reading sections

### Requirement: HomeHero section
The system SHALL provide a HomeHero component at `src/components/pages/home/HomeHero/HomeHero.astro` that renders a full-width hero section with a background image. The hero SHALL use negative margins to break out of the PageLayout container and span the full viewport width. It SHALL display a white overlay, the author's intro text (name, subtitle, description) constrained to a readable width, and two call-to-action buttons: an inverse Button (`ui-primitives`) linking to `/blog` and a ghost Button linking to `/about`.

#### Scenario: Render hero with CTAs
- **WHEN** HomeHero renders on the home page
- **THEN** it displays a full-width background image with intro text and two CTA buttons

### Requirement: HomeTerminal section
The system SHALL provide a HomeTerminal component at `src/components/pages/home/HomeTerminal/HomeTerminal.astro` that renders a decorative fake CLI terminal. It SHALL accept optional `command` (default: "cat current_focus.txt") and `output` (default: "Exploring vibe coding...") props.

The terminal SHALL display a dark box with monospace font, an accent-colored `$` prompt with the command in white, and a muted `>` prefix with the output text.

#### Scenario: Render with defaults
- **WHEN** HomeTerminal renders without props
- **THEN** it displays a dark terminal box with "$ cat current_focus.txt" and "> Exploring vibe coding..."

#### Scenario: Render with custom command
- **WHEN** HomeTerminal renders with custom command and output props
- **THEN** it displays the custom command and output in the terminal format

### Requirement: RecentPosts section
The system SHALL provide a RecentPosts component at `src/components/pages/home/RecentPosts/RecentPosts.astro` that renders a list of recent blog posts. It SHALL accept a required `posts` array. Each post SHALL display as a list item with title and formatted date (using FormattedDate from `ui-primitives`), separated by bottom borders. The section SHALL include a header with title, horizontal rule, and a "View all posts" link to `/blog`.

On hover, post titles SHALL change to the accent color.

#### Scenario: Render recent posts
- **WHEN** RecentPosts renders with a posts array
- **THEN** it displays a titled section with post titles and dates as a bordered list

#### Scenario: Navigate to all posts
- **WHEN** a user clicks "View all posts"
- **THEN** they navigate to `/blog`

### Requirement: FeaturedSeries carousel
The system SHALL provide a FeaturedSeries component with an Astro wrapper at `src/components/pages/home/FeaturedSeries/FeaturedSeries.astro` and a React component at `FeaturedSeries.tsx` loaded with `client:load`. The React component SHALL accept a `title` string and `items` array (each with url, title, optional synopsis, optional hero image, optional updated date).

Behavior: starts at item 0, auto-rotates every 3 seconds through items sequentially, clicking any item stops auto-rotation. The active item details display markdown synopsis (via `marked`), date, and a "Read more" link.

Desktop: cards show hero images with scale animation, active card scales up with elevated z-index. Mobile: stacked cards without images, active card has a teal highlight bar with blend-exclusion, details show the hero image. Uses `tailwind-variants` for styling with slots and variants.

Buttons SHALL have `aria-label` and `aria-pressed` attributes for accessibility.

#### Scenario: Auto-rotate through series items
- **WHEN** FeaturedSeries renders with multiple items and no user interaction
- **THEN** it cycles through items every 3 seconds, updating the displayed details

#### Scenario: User clicks a series item
- **WHEN** a user clicks a series card
- **THEN** auto-rotation stops and the clicked item's details display

#### Scenario: Accessible carousel controls
- **WHEN** the carousel renders
- **THEN** each item button has `aria-label="View details for {title}"` and `aria-pressed` reflecting selection state

### Requirement: CurrentlyReading section
The system SHALL provide a CurrentlyReading component at `src/components/pages/home/CurrentlyReading/CurrentlyReading.astro` that renders a reading list section. It SHALL load book data from `src/data/books.json` (array of objects with title, author, url).

The section SHALL display with a light gray background, rounded corners, and an accent-colored left border. Each book renders as a linked title (accent color) with the author name.

#### Scenario: Render reading list
- **WHEN** CurrentlyReading renders with books data
- **THEN** it displays a styled card with each book as a linked title and author
