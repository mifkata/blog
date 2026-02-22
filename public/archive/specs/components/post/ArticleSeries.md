# ArticleSeries

`src/components/post/ArticleSeries/ArticleSeries.astro` - Displays a series of related articles.

## Props

- `slug: string` - Series slug to load
- `current?: string` - Current article URL or `post.id` (highlights in list)
- `open?: boolean` - Start expanded (default: false)

## Behavior

1. Load series via `getSeriesWithPosts(slug)` from `helpers/series`
2. Render nothing if `items.length === 0`
3. Render `<ol>` with `<li><a href={url}>{title}</a></li>`
4. Current article: no link, `font-bold`

## Visual

- Collapsible `<details>` with `<summary>` showing series title
- Description text below summary
- `<ol>` ordered list with `list-decimal`
