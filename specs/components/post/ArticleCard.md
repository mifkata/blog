# ArticleCard

`src/components/post/ArticleCard/ArticleCard.astro` - Blog post card with image and metadata.

Props: `post: CollectionEntry<"blog">` (required), `class?: string`, `showTags?: boolean` (default: true)

Layout: `grid md:grid-cols-[200px_1fr] gap-6` - image left, content right

Content: hero image (200x120), title (h4), synopsis/description (line-clamp-2), date, tags

Visual: group hover→image shadow + title accent color

Uses: FormattedDate, synopsis -> Markdown, Tag
