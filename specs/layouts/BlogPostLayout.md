# BlogPostLayout

`src/layouts/BlogPostLayout.astro` - Individual blog post layout.

## Extends

- PageLayout (size="full")

## Props

- `title: string` (required)
- `description: string` (required)
- `pubDate: Date` (required)
- `updatedDate?: Date`
- `heroImage?: ImageMetadata`
- `tags?: string[]`
- `headings?: Heading[]`
- `relatedPosts?: CollectionEntry<"blog">[]`
- `showComments?: boolean` (default: true)

## Data

- `showToc` = headings.length >= 2
- `displayedRelatedPosts` = relatedPosts.slice(0, 4)

## Structure

- PageLayout → Article (Hero + Content/TOC flex) → Related Posts → Comments + CodeCopyButton

## Sections

- Hero: full-width, negates PageLayout padding, hero image as background (cover, centered), contains Header overlay
  - Header (overlay): semi-transparent background block for readability, positioned over hero image bottom
    - Title (h1), dates (FormattedDate, updatedDate), tags
  - Fallback (no heroImage): Header renders as standalone block without background image
- Content: prose max-w-[920px], flex-1 when TOC shown
- TOC (lg+, >= 2 headings): sticky w-[240px] top-28, h2=normal, h3=indented
- Related: 4-col grid, max 4 posts
- Comments: Giscus (if showComments)

## Dependencies

- PageLayout, FormattedDate, Tag, Comments, CodeCopyButton
