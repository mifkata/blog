# Blog Post

`src/layouts/BlogPost.astro` - Individual blog post layout.

## Props

`title`, `description`, `pubDate`, `updatedDate?`, `heroImage?`, `tags?`, `headings?`, `relatedPosts?`, `showComments?` (default: true)

## Data

- `showToc`: headings.length >= 2
- `displayedRelatedPosts`: relatedPosts.slice(0, 4)

## Layout

Header → Article (Hero + Content/TOC) → Related Posts → Comments → Footer

## Sections

**Hero Image**: full-width, 1200x600, rounded-xl shadow-lg

**Article Header**: title (h1), pubDate, updatedDate (if set), tags

**Content**: `<slot />` in prose container, max-w-[720px]

**TOC** (lg+ only, if ≥2 headings): sticky sidebar w-[240px], h2=normal, h3=smaller+indented

**Related Posts**: 4-col grid (lg+), image + title, max 4 posts

**Comments**: Giscus widget (if showComments)

## Components

Uses: BaseHead, Header, Footer, FormattedDate, Tag, Comments, CodeCopyButton

## Visual

Max-width: 960px, content: 720px, TOC: 240px sticky top-28
