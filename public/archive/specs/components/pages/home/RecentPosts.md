# RecentPosts

`src/components/pages/home/RecentPosts/RecentPosts.astro` - Recent posts list.

## Props

- `posts: CollectionEntry<"blog">[]` (required)

## Output

- `<section class="max-w-[960px] mx-auto px-6">`
- Header with title + hr + "View all posts →" link
- `<ul>` of posts (title + date), border-b separator (except last)
- Hover: accent color

## Links

- Posts → `/blog/{id}/`
- All → `/blog`

## Dependencies

- FormattedDate
