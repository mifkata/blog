# RedditEmbed

`src/components/post/RedditEmbed/RedditEmbed.astro` - Lazy-loaded Reddit post embed.

## Props

- `url: string` (required)
- `height?: number` (default: 320)

## Behavior

- Shows placeholder -> lazy loads iframe when visible (IntersectionObserver)

## URL Parsing

- Extracts post ID from `reddit.com/r/{sub}/comments/{id}/` format

## Fallback

- Invalid URL -> error message
- Placeholder -> "View on Reddit" link

## Visual

- `border rounded-lg`
- Iframe: sandboxed with allow-scripts/same-origin/popups
