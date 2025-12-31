# FeaturedPost

`src/components/pages/blog/FeaturedPost/FeaturedPost.astro` - Large featured blog post card.
Props: `post` (CollectionEntry<"blog">, required)
Output: `<section class="mb-16 group">` → 2-col grid with hero image (if present) + "Latest Post" label + title + synopsis + date + tags
Uses: Image, FormattedDate, Synopsis, Tag
