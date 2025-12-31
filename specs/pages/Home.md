# Home

`src/pages/index.astro` - Landing page.

## Data

- `posts`: all blog posts sorted by date (desc)
- `latestPost`: posts[0]
- `recentPosts`: posts.slice(0, 3)

## Layout

Header → Hero → Terminal → Featured Showcase → Recent Posts → CurrentlyReading → Footer

## Sections

**Hero**: bg image + overlay, intro text, name (h1), tagline (h2), description, 2 CTAs (Blog, About)

**Terminal**: fake CLI output showing current focus

**Featured Showcase**: 3-col grid (md+) - Latest Post card, Popular Post card, About card

**Recent Posts**: list of 3 posts (title + date), "View all posts" link

**CurrentlyReading**: imported component

## Components

Uses: BaseHead, Header, Footer, Button, FormattedDate, CurrentlyReading

## Visual

Max-width: 960px centered, sections with px-6 padding
