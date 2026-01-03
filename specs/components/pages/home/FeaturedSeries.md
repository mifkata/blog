# FeaturedSeries

`src/components/pages/home/FeaturedSeries/FeaturedSeries.astro` - Series carousel for home page.

Props: `slug: string`

Data: `getSeriesWithPosts(slug)` → items with title, synopsis, updatedDate, heroImage

Behavior: article defaultIndex?: 0 selected on mount; auto-rotate every 5s; click to select

Layout: header (series title + divider), grid of cards (columns = min(items.length, 4)), active article details below (title, Synopsis component, date)

Visual: grid `grid-cols-{n}` where n = min(items, 4); card: heroImage on top, title below; active `border-accent`
