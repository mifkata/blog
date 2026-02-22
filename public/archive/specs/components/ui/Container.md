# Container

`src/components/ui/Container/Container.astro` - Centered content wrapper.

## Props

- `size?: "default"|"wide"` (default: "default")
- `class?: string`
- `...HTMLAttributes<"main">`

## Output

- `<main class="mx-auto px-4 py-12 {maxWidth}">`

## Sizes

- Default: `max-w-[720px]`
- Wide: `max-w-[960px]`

## Slots

- Default: page content
