# FeaturedPost

`src/components/pages/blog/FeaturedPost/FeaturedPost.astro` - Large featured blog post card.

## Props

- `post: CollectionEntry<"blog">` (required)

## Output

- `<section class="mb-16 py-8 border-t border-b border-gray-light group">`
- 2-col grid:
  - Left: "Latest post" label + title + hero image (hover: shadow-xl + opacity-80)
  - Right: "Published at" label + date + tags + synopsis + "Read more" link

## Dependencies

- Image, FormattedDate, synopsis → Markdown, Tag
