# FormattedDate

`src/components/ui/FormattedDate/FormattedDate.astro` - Formatted date display.

## Props

- `date: Date | string | number` (required)
- `class?: string`

## Output

- `<time datetime="{ISO}" class="text-nowrap {class}">{formatted}</time>`

## Format

- Locale: `en-us`
- Style: "Dec 30, 2025" (month short, day numeric, year numeric)
