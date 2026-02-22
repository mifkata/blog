## ADDED Requirements

### Requirement: Blog post page
The system SHALL provide a Blog Post page at `src/pages/blog/[...slug].astro` at URL `/blog/{slug}` (dynamic catch-all) using BlogPostLayout. It SHALL generate static paths for each blog post using `post.id` as the slug. It SHALL load the current post, all posts (for related posts), extract h2/h3 headings for the table of contents, and compute related posts by matching tags sorted by match count.

#### Scenario: Render blog post
- **WHEN** a user navigates to `/blog/2025/my-post`
- **THEN** the page renders the post content within BlogPostLayout with headings, related posts, and metadata

### Requirement: BlogPostLayout
The system SHALL provide a BlogPostLayout at `src/layouts/BlogPostLayout.astro` that extends PageLayout (`common-sections`) with full size. It SHALL accept required `title`, `description`, `pubDate`, and optional `updatedDate`, `heroImage`, `tags`, `headings`, `relatedPosts`, and `showComments` (default: true).

Sections:
- **Hero**: When a hero image is provided, display a full-width hero (minimum 50% viewport height) with the image as a CSS background. A frosted-glass header overlay at the bottom-left shows the title, dates (with semi-transparent backgrounds), and tags (dark variant). When no hero image, display the header as a standalone block with a bottom border and standard colors.
- **Content**: Prose-formatted content at a max width of 920px. When a table of contents is shown, content flexes alongside the TOC.
- **TOC**: Visible on large screens when 2+ headings exist. Sticky sidebar (240px wide), shows h2 entries at normal indent and h3 entries indented.
- **Related Posts**: Up to 4 related posts in a 4-column grid.
- **Comments**: Giscus comments section (if `showComments` is true).
- **CodeCopyButton**: Injected for copy functionality on code blocks.

#### Scenario: Render post with hero image
- **WHEN** BlogPostLayout renders with a hero image
- **THEN** a full-width hero displays with a frosted-glass overlay containing the title, dates, and dark-variant tags

#### Scenario: Render post without hero image
- **WHEN** BlogPostLayout renders without a hero image
- **THEN** the header renders as a standard block with bottom border

#### Scenario: Table of contents visibility
- **WHEN** a post has 2 or more headings and the viewport is large
- **THEN** a sticky TOC sidebar appears alongside the content

#### Scenario: Table of contents hidden
- **WHEN** a post has fewer than 2 headings
- **THEN** no TOC sidebar is displayed

#### Scenario: Related posts display
- **WHEN** related posts are available
- **THEN** up to 4 related posts display in a grid below the content

### Requirement: ArticleCard component
The system SHALL provide an ArticleCard component at `src/components/post/ArticleCard/ArticleCard.astro` that renders a blog post card with image and metadata. It SHALL accept a required `post` entry, optional `class`, and optional `showTags` (default: true).

The card SHALL display in a 2-column grid (image left, content right on desktop): hero image thumbnail (200x120), title as `<h4>`, synopsis/description (clamped to 2 lines), formatted date (using FormattedDate from `ui-primitives`), and optional tags (using Tag from `ui-primitives`).

On hover, the image gains a shadow and the title changes to accent color.

#### Scenario: Render article card with tags
- **WHEN** ArticleCard renders with `showTags=true`
- **THEN** it displays the hero image, title, synopsis, date, and tag links

#### Scenario: Hover effect
- **WHEN** a user hovers over an ArticleCard
- **THEN** the image gains a shadow and the title changes to accent color

### Requirement: ArticleSeries component
The system SHALL provide an ArticleSeries component at `src/components/post/ArticleSeries/ArticleSeries.astro` that displays a collapsible list of related articles in a series. It SHALL accept a required `slug` to load the series via `getSeriesWithPosts` (`helpers`), optional `current` (highlights the current article), and optional `open` (default: false, controls initial expanded state).

If the series has no items, nothing renders. Otherwise, it renders a `<details>` element with the series title as `<summary>`, description text, and an ordered list of article links. The current article displays as bold text without a link.

#### Scenario: Render collapsed series
- **WHEN** ArticleSeries renders with `open=false`
- **THEN** it displays a collapsed `<details>` element with the series title visible

#### Scenario: Current article highlighted
- **WHEN** ArticleSeries renders with a `current` matching one of the items
- **THEN** that item displays as bold text without a link

#### Scenario: Empty series
- **WHEN** the series has no items
- **THEN** the component renders nothing

### Requirement: PostCard component
The system SHALL provide a PostCard component at `src/components/post/PostCard/PostCard.astro` that renders a compact blog post card as a list item. It SHALL accept a required `post`, optional `showImage` (default: true), and optional `featured` (default: false).

Standard mode: half-width on desktop with image, title, and date. Featured mode: full-width with larger text, centered on desktop. On hover, the card gains a shadow and accent color.

#### Scenario: Render standard post card
- **WHEN** PostCard renders with default props
- **THEN** it displays a half-width card with image, title, and date

#### Scenario: Render featured post card
- **WHEN** PostCard renders with `featured=true`
- **THEN** it displays a full-width card with larger text

### Requirement: Markdown renderer
The system SHALL provide a Markdown component at `src/components/post/Markdown/Markdown.tsx` (React) that renders markdown text to HTML using `marked`. It SHALL accept optional `text` and `className` props. Empty or missing text SHALL render nothing. The component SHALL be server-rendered only (`marked` is not bundled to the client). Output uses `dangerouslySetInnerHTML`.

#### Scenario: Render markdown text
- **WHEN** Markdown receives text containing markdown formatting
- **THEN** it renders the parsed HTML in a div

#### Scenario: Empty text
- **WHEN** Markdown receives no text or empty text
- **THEN** it renders nothing (null)

### Requirement: Highlight component
The system SHALL provide a Highlight component at `src/components/post/Highlight/Highlight.astro` that applies color highlighting to text or blocks. It SHALL accept optional `color` (`yellow`, `green`, `blue`, `pink`; default: yellow) and optional `block` (default: false).

Inline mode renders a `<mark>` element. Block mode renders a `<div>` with padding and rounded corners. Colors use semi-transparent backgrounds with dark mode variants.

#### Scenario: Render inline highlight
- **WHEN** Highlight renders with `block=false`
- **THEN** content is wrapped in a `<mark>` element with the selected color background

#### Scenario: Render block highlight
- **WHEN** Highlight renders with `block=true`
- **THEN** content is wrapped in a padded, rounded `<div>` with the selected color background

### Requirement: CodeCopyButton
The system SHALL provide a CodeCopyButton component at `src/components/post/CodeCopyButton/CodeCopyButton.astro` that adds copy-to-clipboard buttons to all code blocks on the page. It is a script-only component with no props.

It SHALL wrap each `<pre>` element in a relative container, add a copy button positioned at the top-right (hidden until hover), and copy the code text to clipboard on click. After copying, the button text SHALL change from "Copy" to "Copied!" for 2 seconds. The script SHALL initialize on page load and on `astro:page-load` events.

#### Scenario: Copy code block
- **WHEN** a user hovers over a code block and clicks the copy button
- **THEN** the code content is copied to clipboard and the button shows "Copied!" for 2 seconds

#### Scenario: Button visibility
- **WHEN** a user hovers over a code block
- **THEN** the copy button becomes visible at the top-right corner

### Requirement: ClaudeCommand link
The system SHALL provide a ClaudeCommand component at `src/components/post/ClaudeCommand/ClaudeCommand.astro` that renders an inline slash-command reference link. It SHALL accept a required `name` and optional `external` (default: false).

Internal commands link to the GitHub repository command file. External commands link to the Claude Code documentation. The link displays with a monospace font, accent color, and a small icon (GitHub icon for internal, globe icon for external), formatted as `/{name}`.

SVG icons SHALL have `aria-hidden="true"`. External links SHALL include screen-reader-only text "(opens in new tab)".

#### Scenario: Render internal command link
- **WHEN** ClaudeCommand renders with `name="commit"` and `external=false`
- **THEN** it displays `/{name}` with a GitHub icon linking to the repository command file

#### Scenario: Render external command link
- **WHEN** ClaudeCommand renders with `external=true`
- **THEN** it displays `/{name}` with a globe icon linking to Claude Code docs, with accessible "opens in new tab" text

### Requirement: GithubLink with preview
The system SHALL provide a GithubLink component at `src/components/post/GithubLink/GithubLinkReact.tsx` (React) that renders a GitHub repository link with optional lazy-loaded file preview. It SHALL accept a required `url`, optional `expanded` (default: false), optional `maxHeight` (pixel limit for iframe), and optional `children` for description.

The header displays a GitHub icon with the parsed `owner/repo/path` and an external link. URLs are parsed into three types: repository root, directory (tree), and file (blob). File URLs enable a preview toggle.

Preview behavior: lazy-loads content when expanded. Code files display via an emgithub.com iframe that auto-resizes to content height via `postMessage`. Image files display as raw images from `raw.githubusercontent.com`. When `maxHeight` is set, content is capped with a scrollbar.

Accessibility: SVG icons have `aria-hidden`, external link has screen-reader text, toggle button has `aria-expanded` and `aria-controls` with a unique ID per instance.

#### Scenario: Render repository link
- **WHEN** GithubLink receives a repository URL
- **THEN** it displays the GitHub icon, parsed path, and external link without preview toggle

#### Scenario: Expand file preview
- **WHEN** a user clicks the preview toggle on a file URL
- **THEN** the code content loads in an iframe that auto-resizes to fit

#### Scenario: Render image preview
- **WHEN** the file URL points to an image
- **THEN** the preview displays the raw image instead of an iframe

#### Scenario: Invalid URL
- **WHEN** GithubLink receives an invalid URL
- **THEN** it displays a warning message

### Requirement: LabeledImage with lightbox
The system SHALL provide a LabeledImage component at `src/components/post/LabeledImage/LabeledImage.tsx` (React) that renders an image with a caption and fullscreen lightbox modal. It SHALL accept a required `src` (string or Astro image import), required `alt`, optional `width` (default: 1280), optional `height`, and optional `children` for caption content.

Click, Enter, or Space on the image opens a fullscreen modal with a dark backdrop. Click on backdrop or Escape closes the modal. Body scroll is locked when modal is open.

Accessibility: image has `role="button"`, `tabindex={0}`, and `aria-label="{alt} - Click to enlarge"`. Modal has `aria-hidden` when closed. Keyboard: Enter/Space to open, Escape to close.

#### Scenario: Open lightbox
- **WHEN** a user clicks or presses Enter/Space on the image
- **THEN** a fullscreen modal opens with the image on a dark backdrop and body scroll is locked

#### Scenario: Close lightbox
- **WHEN** the modal is open and the user clicks the backdrop or presses Escape
- **THEN** the modal closes and body scroll is restored

#### Scenario: Render caption
- **WHEN** LabeledImage has children content
- **THEN** a centered italic caption displays below the image

### Requirement: WrapText component
The system SHALL provide a WrapText component at `src/components/post/WrapText/WrapText.astro` that enables text wrapping on `<pre>` elements at a specified responsive breakpoint. It SHALL accept optional `media` (`all`, `sm`, `md`, `lg`, `xl`; default: `md`). It wraps slot content in a container that applies CSS text-wrap to nested `<pre>` elements at the configured breakpoint.

#### Scenario: Wrap at medium breakpoint
- **WHEN** WrapText renders with default `media="md"`
- **THEN** nested `<pre>` elements wrap text at the medium breakpoint and above

### Requirement: RedditEmbed component
The system SHALL provide a RedditEmbed component at `src/components/post/RedditEmbed/RedditEmbed.astro` that renders a lazy-loaded Reddit post embed. It SHALL accept a required `url` and optional `height` (default: 320px).

The component SHALL show a placeholder initially, then lazy-load the Reddit iframe when visible using IntersectionObserver. The URL is parsed to extract the post ID. Invalid URLs display an error message. The placeholder includes a "View on Reddit" fallback link. The iframe is sandboxed with `allow-scripts`, `allow-same-origin`, and `allow-popups`.

#### Scenario: Lazy load Reddit embed
- **WHEN** the RedditEmbed scrolls into view
- **THEN** the iframe loads with the Reddit post content

#### Scenario: Invalid Reddit URL
- **WHEN** RedditEmbed receives an invalid URL format
- **THEN** it displays an error message instead of the embed

### Requirement: Comments integration
The system SHALL provide a Comments component at `src/components/post/Comments/Comments.astro` that integrates Giscus for GitHub-backed comments. It SHALL accept an optional `class` prop.

The component renders a "Comments" heading followed by a centered Giscus widget (80% width). It uses environment variables (`PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID`) for configuration, maps comments by pathname, and uses the light theme.

#### Scenario: Render comments section
- **WHEN** Comments renders on a blog post page
- **THEN** it displays a "Comments" heading followed by the Giscus widget configured with the correct repository settings
