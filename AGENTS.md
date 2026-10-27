# mifkata.com

## Overview

Personal blog at mifkata.com: long-form posts (`src/content/blog/`) and short notes (`src/content/notes/`) written in MDX, built as a static site.

## Stack

- Astro with MDX, React islands and Tailwind CSS
- Storybook for components, Vitest for tests, ESLint and Prettier for linting
- pnpm, with nx running Astro and Storybook together in dev
- Cloudflare Pages hosting, provisioned with Terraform (`terraform/`)

## Rules

- When unsure about a request, ALWAYS ask clarifying questions before proceeding. Do not guess at parameters like copyright holders, next steps, or which file to modify. Ask first, act second.
- When asking the user for a judgement call, put the context in the request itself: what you found, the trade-offs, and what is at stake. Give every option a description that states as explicitly as possible what it will do, which files or state it touches, and what it leaves unchanged. Never offer bare labels.
- Update `.env.example` when adding ENV vars to code
- Don't write comments that restate the implementation, e.g. `// Drafts are visible in dev` above `import.meta.env.DEV || !data.draft`, or a label repeating the element or condition right below it. Comments that add what the code can't say (intent, constraints, units, workarounds, config) are welcome.

## Git

- Never commit or push unless the user explicitly asks; leave changes uncommitted so they can be reviewed
- If untracked changes exist that are unrelated to current task, ignore them
- Do not include author/co-author information in commit messages
- Use conventional commit messages (e.g., `feat: add random forest training script`)
- Commit messages should be terse, do not explicit details, just focus on the change
- Work on `main`: no feature branches or pull requests unless the user asks for one
- When asked to push: `git pull --rebase`, `git push`, then confirm `git status` is up to date with origin

## Testing

- Testing instructions are in bead `blog-0v1` (`bd show blog-0v1`).

## Beads

- No TodoWrite, TaskCreate or MEMORY.md files; task tracking and project memory live in bd.
- Close on merge, not on coding done: a bead stays open until its code reaches `main`.

Sanity: say "AGENTS.md LOADED"

<!-- beads:skill -->
## Task tracking (Beads)

Work is tracked with Beads (`bd`). Load the `beads` skill before any `bd` command or task-tracking step and follow it; it holds the whole workflow. No markdown TODO lists; agent-local task tools only for the current turn.
<!-- /beads:skill -->
