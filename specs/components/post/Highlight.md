# Highlight

`src/components/post/Highlight/Highlight.astro` - Text/block highlighting with color variants.

Props: `color?: "yellow"|"green"|"blue"|"pink"` (default: yellow), `block?: boolean` (default: false)

Output: inline→`<mark>`, block→`<div class="p-4 rounded-md my-4">`

Colors: `bg-{color}-200/60`, dark mode: `bg-{color}-500/30`

Slot: content to highlight
