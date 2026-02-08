# ArticleCard

`src/components/post/ArticleCard/ArticleCard.astro` - Blog post card with image and metadata.

## Props

- `post: CollectionEntry<"blog">` (required)
- `class?: string`
- `showTags?: boolean` (default: true)

## Layout

- `grid md:grid-cols-[200px_1fr] gap-6` - image left, content right

## Content

- Hero image (200x120)
- Title (h4)
- Synopsis/description (line-clamp-2)
- Date
- Tags

## Visual

- Group hover → image shadow + title accent color

## Dependencies

- FormattedDate, synopsis → Markdown, Tag
