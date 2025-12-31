# Blog Slug

`src/pages/blog/[...slug].astro` - Individual blog post page.

URL: `/blog/{slug}` (dynamic, catch-all)

## Data

- `post`: current post from collection
- `allPosts`: all posts (for related posts)
- `headings`: h2/h3 from content (for TOC)
- `relatedPosts`: posts with matching tags, sorted by match count, max 3

## Static Paths

Generates page for each blog post using post.id as slug

## Layout

Uses BlogPost layout with Content slot

## Components

Uses: BlogPost (layout)
