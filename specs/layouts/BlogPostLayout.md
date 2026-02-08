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

- Hero: full-width (`mb-6 -mt-12 -mx-6 sm:mx-auto sm:mb-6 sm:-mt-6 xl:-mt-12 xl:-mx-25.5 xl:mb-12`), w-auto shadow-lg (no rounded), negates PageLayout padding
- Header: title (h1), dates, tags
- Content: prose max-w-[920px], flex-1 when TOC shown
- TOC (lg+, >= 2 headings): sticky w-[240px] top-28, h2=normal, h3=indented
- Related: 4-col grid, max 4 posts
- Comments: Giscus (if showComments)

## Dependencies

- PageLayout, FormattedDate, Tag, Comments, CodeCopyButton
