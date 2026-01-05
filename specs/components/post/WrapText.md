# WrapText

`src/components/post/WrapText/WrapText.astro` - Wraps `<pre>` at specified breakpoint.

Props: `media?: "all"|"sm"|"md"|"lg"|"xl"` (default: "md")

Output: `<div class="wrap-text" data-media={media}><slot /></div>`

Style: `@screen {media} { .wrap-text[data-media="X"] :global(pre) { @apply text-wrap } }`
