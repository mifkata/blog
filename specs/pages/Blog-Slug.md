# Blog Slug

`src/pages/blog/[...slug].astro` - Individual blog post page.

## URL

- `/blog/{slug}` (dynamic, catch-all)

## Layout

- BlogPostLayout

## Static Paths

- Generates page for each blog post using post.id as slug

## Data

- `post` = current post
- `allPosts` = all posts
- `headings` = h2/h3 for TOC
- `relatedPosts` = matching tags max 3

## Dependencies

- BlogPostLayout
