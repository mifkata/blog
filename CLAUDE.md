Astro.build app

# Sepcs

- `specs/**/*.md`
- spec cmds (each accepts `[arg]` that searches in `./specs`): `/spec-create` `/spec-refine` `/spec-apply` `/spec-verify` `/spec-compact`
- when cmd is called without arg, assume last used spec

# Tests

- `specs/Testing.md` for conventions

# Components

- `src/components/<name>/<name>.(astro|tsx)`
- includes `story` and `test` files for each

# Quality

- all code should be pass `pnpm lint:fix` `pnpm format:fix`
