# Tag

`src/components/ui/Tag/Tag.astro` - Clickable tag link for categorization.

## Props

- `tag: string` (required)
- `variant?: "default" | "dark"` (default: "default")
- `class?: string`
- `...HTMLAttributes<"a">`

## Output

- `<a href="/tags/{tag}/">{tag}</a>`

## Visual

- Default: `py-1 px-2 bg-gray-light rounded text-gray-dark text-sm`
  - Hover: `bg-accent text-white`
- Dark: `py-1 px-2 bg-white/20 rounded text-white text-sm`
  - Hover: `bg-white/30`
