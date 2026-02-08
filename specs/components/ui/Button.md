# Button

`src/components/ui/Button/Button.astro` - Clickable action element.

## Props

- `href?: string` (renders as `<a>`)
- `variant?: "normal"|"inverse"|"ghost"` (default: normal)
- `class?: string`

## Variants

- Normal: light gradient + brown text
- Inverse: orange gradient + light text
- Ghost: transparent + border

## Visual

- `inline-flex gap-2 px-4 py-2 rounded`
- Hover: lift -0.5 + shadow
- Transition 200ms

## Slots

- Default: button content (text/icons)
