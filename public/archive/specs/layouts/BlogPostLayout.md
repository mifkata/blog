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
- `optimizedHero` = getImage({ src: heroImage, width: 1920 }) when heroImage exists

## Structure

- PageLayout → Article (Hero + Content/TOC flex) → Related Posts → Comments + CodeCopyButton

## Sections

- Hero: full-width, negates PageLayout padding, min-h-[50vh], hero image as CSS background (bg-cover bg-center), position relative
  - Header (overlay): absolute bottom-6 left-6 lg:bottom-12 lg:left-24, backdrop-blur-[6px] bg-black/25, p-6, max-w-lg, rounded-lg
    - Title (h1): md:!text-3xl, inline, !text-white, text-shadow 0 2px 8px rgba(0,0,0,0.8)
    - Date + tags row: flex, gap-3, text-sm text-gray-300
      - Dates: self-start, bg-[#000000]/50 px-1 background per date element
      - Tags: flex wrap, Tag dark variant
  - Fallback (no heroImage): Header as standalone block with border-b, standard text colors
- Content: prose max-w-[920px], flex-1 when TOC shown
- TOC (lg+, >= 2 headings): sticky w-[240px] top-28, h2=normal, h3=indented
- Related: 4-col grid, max 4 posts
- Comments: Giscus (if showComments)

## Dependencies

- PageLayout, FormattedDate, Tag, Comments, CodeCopyButton
