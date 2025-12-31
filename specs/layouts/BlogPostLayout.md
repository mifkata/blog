# BlogPostLayout

`src/layouts/BlogPostLayout.astro` - Individual blog post layout.

Extends: PageLayout (size="wide")

Props: `title`, `description`, `pubDate`, `updatedDate?`, `heroImage?`, `tags?`, `headings?`, `relatedPosts?`, `showComments?` (default: true)

Data: `showToc`=headings.length≥2, `displayedRelatedPosts`=relatedPosts.slice(0,4)

Structure: PageLayout → Article (Hero + Content/TOC flex) → Related Posts → Comments + CodeCopyButton

Sections:

- Hero: 1200x600, rounded-xl shadow-lg
- Header: title (h1), dates, tags
- Content: prose max-w-[720px], flex-1 when TOC shown
- TOC (lg+, ≥2 headings): sticky w-[240px] top-28, h2=normal, h3=indented
- Related: 4-col grid, max 4 posts
- Comments: Giscus (if showComments)

Uses: PageLayout, FormattedDate, Tag, Comments, CodeCopyButton
