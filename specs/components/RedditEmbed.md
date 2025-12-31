# RedditEmbed

`src/components/RedditEmbed/RedditEmbed.astro` - Lazy-loaded Reddit post embed.

Props: `url: string` (required), `height?: number` (default: 320)

Behavior: shows placeholder→lazy loads iframe when visible (IntersectionObserver)

URL parsing: extracts post ID from reddit.com/r/{sub}/comments/{id}/ format

Fallback: invalid URL→error message, placeholder→"View on Reddit" link

Visual: `border rounded-lg`, iframe: sandboxed with allow-scripts/same-origin/popups
