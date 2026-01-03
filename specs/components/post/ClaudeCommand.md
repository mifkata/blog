# ClaudeCommand

`src/components/post/ClaudeCommand/ClaudeCommand.astro` - Inline slash-command link.

Props: `name: string`, `external?: boolean` (default: false)

URLs:

- internal: `github.com/mifkata/blog/blob/main/.claude/commands/{name}.md`
- external: `code.claude.com/docs/en/slash-commands`

Visual: `inline-flex items-center gap-1`, icon `w-4 h-4` (GitHub/globe), `font-mono text-sm text-accent`, `/{name}`, `title` tooltip
