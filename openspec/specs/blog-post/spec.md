# Blog Post

Individual blog post page, layout, and content components.

## Blog Post Page

📁 Path: `src/pages/blog/[...slug].astro`
📍 Route: `/blog/{slug}` (dynamic catch-all)

### Static Paths
- Generates a page for each blog post using `post.id` as slug

### Data
- `post` — current post
- `allPosts` — all posts (for related posts)
- `headings` — h2/h3 extracted for table of contents
- `relatedPosts` — posts with matching tags, sorted by match count

### Dependencies
- Uses: BlogPostLayout

## BlogPostLayout

📁 Path: `src/layouts/BlogPostLayout.astro`

Individual blog post layout extending PageLayout (`common-sections`) with full size.

### Props
- `title` — post title (required)
- `description` — post description (required)
- `pubDate` — publish date (required)
- `updatedDate?` — last update date
- `heroImage?` — hero image
- `tags?` — post tags
- `headings?` — for TOC generation
- `relatedPosts?` — related post entries
- `showComments?` — enable comments (default: true)

### Sections

**Hero (with image)**
- Full-width, minimum 50% viewport height, hero image as CSS background
- Frosted-glass header overlay at bottom-left: title, dates (semi-transparent backgrounds), tags (dark variant)

**Hero (without image)**
- Standard block with bottom border, standard text colors

**Content**
- Prose format, max width 920px
- Flexes alongside TOC when visible

**Table of Contents (large screens, 2+ headings)**
- Sticky sidebar, 240px wide
- h2 entries at normal indent, h3 entries indented

**Related Posts**
- Up to 4 posts in a 4-column grid

**Comments**
- Giscus integration when `showComments` is true

**CodeCopyButton**
- Injected for copy functionality on code blocks

### Dependencies
- Uses: PageLayout (`common-sections`), FormattedDate (`ui-primitives`), Tag (`ui-primitives`), Comments, CodeCopyButton

## ArticleCard

📁 Path: `src/components/post/ArticleCard/ArticleCard.astro`

Blog post card with image and metadata, used in listing pages.

### Props
- `post` — blog post entry (required)
- `class?` — additional CSS classes
- `showTags?` — display tags (default: true)

### Layout (2-column grid on desktop)
- Left: hero image thumbnail (200x120)
- Right: title as `<h4>`, synopsis (clamped to 2 lines), date, tags

### Behavior
- Hover: image gains shadow, title changes to accent color

### Dependencies
- Uses: FormattedDate (`ui-primitives`), Tag (`ui-primitives`), Markdown

## ArticleSeries

📁 Path: `src/components/post/ArticleSeries/ArticleSeries.astro`

Collapsible list of related articles in a series.

### Props
- `slug` — series slug (required)
- `current?` — current article URL or post ID (highlighted in list)
- `open?` — start expanded (default: false)

### Behavior
- Loads series via `getSeriesWithPosts(slug)` from `helpers`
- Renders nothing if series has no items
- Collapsible `<details>` with series title as `<summary>`
- Description text below summary
- Ordered list of article links; current article shown as bold text without link

## PostCard

📁 Path: `src/components/post/PostCard/PostCard.astro`

Compact blog post card as a list item.

### Props
- `post` — blog post entry (required)
- `class?` — additional CSS classes
- `showImage?` — show hero image (default: true)
- `featured?` — featured mode (default: false)

### Modes
- Standard: half-width on desktop, image + title + date
- Featured: full-width, larger text, centered on desktop

### Behavior
- Hover: gains shadow and accent color

### Dependencies
- Uses: FormattedDate (`ui-primitives`)

## Markdown

📁 Path: `src/components/post/Markdown/Markdown.tsx`

React component rendering markdown text to HTML using `marked`.

### Props
- `text?` — markdown source text
- `className?` — additional CSS classes

### Behavior
- Parses via `marked.parse(text, { async: false })`
- Empty or missing text renders nothing
- Server-rendered only; `marked` is not bundled to client
- Output uses `dangerouslySetInnerHTML`

## Highlight

📁 Path: `src/components/post/Highlight/Highlight.astro`

Text/block highlighting with color variants.

### Props
- `color?` — `yellow` (default) | `green` | `blue` | `pink`
- `block?` — block mode (default: false)
- Default slot for content

### Modes
- Inline: renders as `<mark>` element
- Block: renders as padded, rounded `<div>`
- Colors use semi-transparent backgrounds with dark mode variants

## CodeCopyButton

📁 Path: `src/components/post/CodeCopyButton/CodeCopyButton.astro`

Script-only component that adds copy-to-clipboard buttons to code blocks. No props.

### Behavior
- Wraps each `<pre>` in a relative container
- Adds copy button at top-right, hidden until hover
- Copies code to clipboard on click
- Button text: "Copy" → "Copied!" for 2 seconds
- Initializes on page load and `astro:page-load` events

## ClaudeCommand

📁 Path: `src/components/post/ClaudeCommand/ClaudeCommand.astro`

Inline slash-command reference link.

### Props
- `name` — command name (required)
- `external?` — external link (default: false)

### Behavior
- Internal: links to GitHub repo command file, GitHub icon
- External: links to Claude Code docs, globe icon
- Displays as monospace `/{name}` in accent color

### Accessibility
- SVG icons: `aria-hidden="true"`
- External links: screen-reader text "(opens in new tab)"

## GithubLink

📁 Path: `src/components/post/GithubLink/GithubLinkReact.tsx`

React GitHub repository link with optional lazy-loaded file preview.

### Props
- `url` — GitHub URL (required)
- `expanded?` — start expanded (default: false)
- `maxHeight?` — pixel limit for iframe height
- `children?` — description content

### URL Types
- Repository: `github.com/owner/repo` — no preview
- Directory: `github.com/owner/repo/tree/branch/path` — no preview
- File: `github.com/owner/repo/blob/branch/path` — preview enabled

### Preview Behavior
- Code files: lazy-loaded emgithub.com iframe, auto-resizes via `postMessage`
- Image files: raw image from `raw.githubusercontent.com`
- `maxHeight`: caps height with scrollbar
- Invalid URL: warning message

### Accessibility
- SVG icons: `aria-hidden="true"`
- External link: screen-reader text "(opens in new tab)"
- Toggle button: `aria-expanded`, `aria-controls` with unique ID per instance

## LabeledImage

📁 Path: `src/components/post/LabeledImage/LabeledImage.tsx`

React image with caption and fullscreen lightbox modal.

### Props
- `src` — image source (string or Astro image import, required)
- `alt` — alt text (required)
- `width?` — image width (default: 1280)
- `height?` — image height
- `children?` — caption content

### Behavior
- Click/Enter/Space on image opens fullscreen modal with dark backdrop
- Click backdrop or Escape closes modal
- Body scroll locked when modal is open

### Accessibility
- Image: `role="button"`, `tabindex={0}`, `aria-label="{alt} - Click to enlarge"`
- Modal: `aria-hidden` when closed
- Keyboard: Enter/Space to open, Escape to close

## WrapText

📁 Path: `src/components/post/WrapText/WrapText.astro`

Wraps `<pre>` element text at a specified responsive breakpoint.

### Props
- `media?` — breakpoint: `all` | `sm` | `md` (default) | `lg` | `xl`

### Behavior
- Wraps slot content in a container that applies CSS text-wrap to nested `<pre>` elements at the configured breakpoint

## RedditEmbed

📁 Path: `src/components/post/RedditEmbed/RedditEmbed.astro`

Lazy-loaded Reddit post embed.

### Props
- `url` — Reddit post URL (required)
- `height?` — iframe height in px (default: 320)

### Behavior
- Shows placeholder initially, lazy-loads iframe when visible (IntersectionObserver)
- Parses URL to extract post ID from `reddit.com/r/{sub}/comments/{id}/`
- Invalid URL: displays error message
- Placeholder includes "View on Reddit" fallback link
- Iframe: sandboxed with `allow-scripts`, `allow-same-origin`, `allow-popups`

## Comments

📁 Path: `src/components/post/Comments/Comments.astro`

Giscus comments integration for blog posts.

### Props
- `class?` — additional CSS classes

### Layout
- "Comments" heading + centered Giscus widget (80% width)

### Config
- Env vars: `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID`
- Mapping: pathname
- Theme: light
