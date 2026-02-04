Astro.build app

# Init

- ensure `husky` hooks work

## Git

- Never commit or push without being explicitly asked
- When asked to commit, push automatically unless told not to
- Do not commit author/co-author information
- Use conventional commit messages (e.g., `feat: add random forest training script`)

# Pull Requests

- Pushing a branch for the first time, should open a Draft PR automatically. Use `gh` CLI tool for GitHub operations.
- Automatically assign the current `gh` user to newly created PRs.
- PR description should include only information about specific changes with no actionable items.
- PR description should be updated when new commits are pushed, if a previously defined change was rolled back or modified, it should be only 1 record for the current state of a change (examples: deleted func(), restored func() in 2 commits should cleanup any reference to func() being changed, as it was rolled back to previous change; if a value was changed from 3 to 5 to 7, only 1 record for the change should be in the PR description - latest value: 7).
- Do not add any generation/co-authoring references in PR description.
- Do not add test plans to PR descriptions.

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
- Use Conventional Commits format
- Body: imperative, lowercase, <72 chars, explain what/why
- Footer: reference issues, breaking changes

# SVG

- extract `svg` as icons

# Quality

- `pnpm lint:fix` `pnpm format:fix`
