Astro.build app

# Init

- ensure `husky` hooks work

# Commands

`/spec-create`, `/spec-update`, `/spec-refine`, `/spec-apply`, `/spec-verify`, `/spec-compact`, `/spec-refactor` — specs at `specs/[arg].md`; if `[arg]` empty: use last spec
`/post-create [slug]`, `/tags-update` — blog
`/test-create [path]` — tests per `specs/Testing.md`; if `[path]` empty: use last spec
`/commit-staged`: do not add generator/co-author signature to messages

- if `[arg]` empty: use last spec
- when cmds modified: update `CLAUDE.md` + `README.md`
- always prefer `tailwind` over pure CSS

# Specs

- `specs/**/*.md`

# Components

- `src/components/<name>/<name>.(astro|tsx)` + `story` + `test`
- don't wrap `react` components in `astro`, unless necessary
- don't use default exports in `tsx` components

## Git

- Do not add author/co-author/generator footers to commit messages
- Use Conventional Commits for messages
- Body: imperative, lowercase, <72 chars, explain what/why
- Footer: reference issues, breaking changes

# SVG

- extract `svg` as icons

# Quality

- `pnpm lint:fix` `pnpm format:fix`
