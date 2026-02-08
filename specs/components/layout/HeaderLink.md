# HeaderLink

`src/components/layout/HeaderLink/HeaderLink.astro` - Navigation link with active state detection.

## Props

- `href: string` (required)
- `number?: string`
- `class?: string`
- `...HTMLAttributes<"a">`

## Behavior

- Active: matches current pathname or first path segment -> `text-accent font-medium`

## Visual

- `inline-flex items-center gap-1 text-gray-dark`
- Hover: `text-accent`
- Number: renders as `<span class="text-sm text-gray">{number}.</span>` prefix

## Slots

- Default: link text
