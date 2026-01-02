Astro.build app

# Init

- make sure `husky` hooks are working

# Commands

## Specs

| Command                 | Description                            |
| :---------------------- | :------------------------------------- |
| `/spec-create [path]`   | Create new spec at `specs/[path].md`   |
| `/spec-update [path]`   | Update existing spec with user changes |
| `/spec-refine [path]`   | Analyze and improve spec quality       |
| `/spec-apply [path]`    | Implement spec requirements            |
| `/spec-verify [path]`   | Verify implementation matches spec     |
| `/spec-compact [path]`  | Minimize spec token size               |
| `/spec-refactor [path]` | Refactor codebase to use spec          |

## Blog

| Command               | Description                                 |
| :-------------------- | :------------------------------------------ |
| `/post-create [slug]` | Create new blog post at `src/content/blog/` |
| `/tags-update`        | Sync `src/data/tags.json` with blog posts   |

## Testing

| Command               | Description           |
| :-------------------- | :-------------------- |
| `/test-create [path]` | Create tests for spec |

## Git

| Command           | Description                                  |
| :---------------- | :------------------------------------------- |
| `/commit-message` | Suggest commit message for staged changes    |
| `/commit-staged`  | Commit staged changes with generated message |

- when modified: update `CLAUDE.md` and `README.md`
- never commit unless cmd `/commit-staged`

# Sepcs

- `specs/**/*.md`
- spec cmds (if `[arg]` empty, assume last used spec)

# Tests

- `specs/Testing.md` for conventions

# Components

- `src/components/<name>/<name>.(astro|tsx)`
- includes `story` and `test` files for each

# Quality

- all code should be pass `pnpm lint:fix` `pnpm format:fix`
