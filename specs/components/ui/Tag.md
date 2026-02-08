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

- Base: `py-1 px-2 rounded text-sm no-underline`
- Default: `bg-gray-light text-gray-dark`, hover `bg-accent text-white`
- Dark: `bg-white/20 !text-white`, hover `bg-white/30`
