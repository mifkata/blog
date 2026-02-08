# Highlight

`src/components/post/Highlight/Highlight.astro` - Text/block highlighting with color variants.

## Props

- `color?: "yellow"|"green"|"blue"|"pink"` (default: yellow)
- `block?: boolean` (default: false)

## Output

- Inline -> `<mark>`
- Block -> `<div class="p-4 rounded-md my-4">`

## Colors

- `bg-{color}-200/60`
- Dark mode: `bg-{color}-500/30`

## Slots

- Default: content to highlight
