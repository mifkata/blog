# ClaudeCommand

`src/components/post/ClaudeCommand/ClaudeCommand.astro` - Inline slash-command link.

## Props

- `name: string` (required)
- `external?: boolean` (default: false)

## URLs

- Internal: `github.com/mifkata/blog/blob/main/.claude/commands/{name}.md`
- External: `code.claude.com/docs/en/slash-commands`

## Visual

- `inline-flex items-center gap-1`
- Icon `w-4 h-4` (GitHub/globe)
- `font-mono text-sm text-accent`
- `/{name}`
- `title` tooltip

## Accessibility

- SVG icons have `aria-hidden="true"`
- `sr-only` text "(opens in new tab)" for external link indication
