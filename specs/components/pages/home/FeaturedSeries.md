# FeaturedSeries

`src/components/pages/home/FeaturedSeries/FeaturedSeries.tsx` - Series carousel for home page.

## Props

- `title: string`
- `items: SeriesItem[]`

```ts
interface SeriesItem {
  url: string;
  title: string;
  synopsis?: string;
  heroImage?: string;
  updatedDate?: string;
}
```

## Behavior

- defaultIndex 0
- Auto-rotate 3s sequential
- Click stops rotation

## Accessibility

- Buttons have `aria-label="View details for {title}"`, `aria-pressed={isActive}`

## Layout

- Header: "Featured Series:" + title + divider
- Grid: `flex-col md:grid-cols-{n}`
- Details: Markdown synopsis, date, "Read more ->"

## Desktop

- Card heroImage scale(3->1), title link
- Active: `scale-115 z-10`

## Mobile

- Stacked cards (no image), teal highlight bar (`mix-blend-exclusion`)
- Details show heroImage

## Styling

- `tailwind-variants` with slots and variants for `active`, `position`, `columns`

## Wrapper

- `FeaturedSeries.astro` fetches via `getSeriesWithPosts(slug)` and passes to React with `client:load`
