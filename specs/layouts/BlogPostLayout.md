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

- Hero: full-width, min-h-[50vh], negates PageLayout padding, hero image as CSS background (bg-cover bg-center), position relative
  - Header (overlay): absolute bottom-0 left-0 right-0, frosted glass (backdrop-blur-md bg-black/40), p-6 xl:p-8, text-white
    - Title (h1 text-white), dates (text-gray-300), tags
  - Fallback (no heroImage): Header renders as standalone block with border-b border-gray-light
- Content: prose max-w-[920px], flex-1 when TOC shown
- TOC (lg+, >= 2 headings): sticky w-[240px] top-28, h2=normal, h3=indented
- Related: 4-col grid, max 4 posts
- Comments: Giscus (if showComments)

## Dependencies

- PageLayout, FormattedDate, Tag, Comments, CodeCopyButton
