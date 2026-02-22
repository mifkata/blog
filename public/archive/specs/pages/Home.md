# Home

`src/pages/index.astro` - Landing page.

## URL

- `/`

## Layout

- PageLayout (size="full")

## Data

- `posts` = all sorted desc
- `latestPost` = posts[0]
- `recentPosts` = posts.slice(0, 3)

## Sections

- Hero: bg image + overlay, name (h1), tagline (h2), description, 2 CTAs
- Terminal: fake CLI output
- Featured Showcase: 3-col grid - Latest/Popular/About cards
- Recent Posts: 3 posts list + "View all" link
- CurrentlyReading component

## Dependencies

- PageLayout, Button, FormattedDate, CurrentlyReading
