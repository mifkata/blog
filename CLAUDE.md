Astro.build app

# Init

- ensure `husky` hooks work

# Commands

`/spec-create`, `/spec-update`, `/spec-refine`, `/spec-apply`, `/spec-verify`, `/spec-compact`, `/spec-refactor` — specs at `specs/[arg].md`
`/post-create [slug]`, `/tags-update` — blog
`/test-create [path]` — tests per `specs/Testing.md`
`/commit-message`, `/commit-staged` — git (never commit without `/commit-staged`)

- if `[arg]` empty: use last spec
- when cmds modified: update `CLAUDE.md` + `README.md`

# Specs

- `specs/**/*.md`

# Components

- `src/components/<name>/<name>.(astro|tsx)` + `story` + `test`

# Quality

- `pnpm lint:fix` `pnpm format:fix`
