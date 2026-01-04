# FeaturedSeries

`src/components/pages/home/FeaturedSeries/FeaturedSeries.astro` - Series carousel for home page.

Props: `slug: string`

Data: `getSeriesWithPosts(slug)` → items with title, synopsis, updatedDate, heroImage

Behavior: defaultIndex 0; auto-rotate 5s sequential; click stops rotation

Layout: header ("Featured Series:" + title + divider), grid `flex-col md:grid-cols-{n}`, details (Synopsis, date, "Read more →")

Desktop: card heroImage scale(3→1), title link; active `border-accent scale(1.15) z-10`

Mobile: stacked cards (no image), teal highlight bar (`mix-blend-exclusion`); details show heroImage
