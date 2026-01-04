# FeaturedSeries

`src/components/pages/home/FeaturedSeries/FeaturedSeries.tsx` - Series carousel for home page.

Props: `title: string`, `items: SeriesItem[]`

```ts
interface SeriesItem {
  url: string;
  title: string;
  synopsis?: string;
  heroImage?: string;
  updatedDate?: string;
}
```

Behavior: defaultIndex 0; auto-rotate 3s sequential; click stops rotation

Layout: header ("Featured Series:" + title + divider), grid `flex-col md:grid-cols-{n}`, details (Markdown synopsis, date, "Read more →")

Desktop: card heroImage scale(3→1), title link; active `scale-115 z-10`

Mobile: stacked cards (no image), teal highlight bar (`mix-blend-exclusion`); details show heroImage

Styling: `tailwind-variants` with slots and variants for `active`, `position`, `columns`

Wrapper: `FeaturedSeries.astro` fetches via `getSeriesWithPosts(slug)` and passes to React with `client:load`
