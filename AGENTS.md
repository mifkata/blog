# mifkata.com

Personal blog at mifkata.com: long-form posts (`src/content/blog/`) and short notes (`src/content/notes/`) written in MDX, built as a static site.

Maintained with the `agentsmd-writer` skill and audited by `agentsmd-auditor`: change this file only through them. Sections owned by other skills and marked blocks are theirs.

## Stack

- Astro with MDX, React islands and Tailwind CSS
- Storybook for components, Vitest for tests, ESLint and Prettier for linting
- pnpm
- Cloudflare Pages hosting, provisioned with Terraform (`terraform/`)

## Skills

- New blog post → `blog-post-new`; new note → `blog-note-new`
- Review, edit or tighten a post → `blog-post-editor`
- Add tips, code samples or links to a post → `blog-post-enhancer`
- Final spelling and grammar pass on a post → `blog-post-proofreader`
- Frontend UI or client-side logic for a bead or spec → `frontend-astro-builder`; owns § Stack; review its bead → `frontend-astro-reviewer`; new Astro frontend → `frontend-astro-bootstrapper`
- Root toolchain pins, git hooks, toolchain upgrades → `repo-manager`
- README create or rewrite → `readme-writer`
- AGENTS.md or CLAUDE.md change, agents repeating a mistake → `agentsmd-writer`; audit → `agentsmd-auditor`
- Task tracking, claims, handoffs → `beads`; owns the `beads:skill` block
- Installed skill defect or missing capability → `skill-fix-handoff`; restore, update or install skills → `skill-installer`

## Workflows

- Blog post: `blog-post-new` → `blog-post-editor` → `blog-post-enhancer` → `blog-post-proofreader`
- Frontend bead: `frontend-astro-builder` → `frontend-astro-reviewer`

## Commands

- Build: `pnpm build`; test: `pnpm test:run`
- Lint/format: `pnpm lint`, `pnpm format`; fix `pnpm lint:fix`, `pnpm format:fix`

## Authority

- Never without the user: commit, push, history rewrite (rebase, reset, force push), deleting files or branches, deploy (`terraform apply`).
- Ambiguity or more than one viable path → ask the user; never decide silently.

## Subagents

- Every subagent spawn, any skill or runner, follows this section; skills read the model per role and grade here.
- Pick: `node .agents/skills/agentsmd-auditor/scripts/models.mjs pick <the role's models for the grade that this runner can spawn, in listed order>` → its `top` (the `model-pick` rubric: recorded success rate and runs; a tie → the first listed); `top` null → reported to the user; none it can spawn → its session model.
- Record each run: `node .agents/skills/agentsmd-auditor/scripts/models.mjs record <provider/model> <role> <grade> success|failure|escalated` (failure: error, timeout, refusal, or work sent back; escalated: handed to the next grade).
- Never pick a model `models.mjs stats` lists as excluded or `below` (under 60% after 15 runs; a model the registry keeps is never below).
- Vendors: design and the workers' and reviewers' `escalation` entries from Anthropic only; a runner spawning several vendors takes easy and moderate workers from Cursor and OpenAI only.
- Anthropic pacing (subscription limits, shared with every Claude session): at most 5 Anthropic subagents running at once, each start ≥5 s after the previous; "usage limit reached" or a rate-limit error → no new Anthropic subagent, the running ones finish, the rest go to Cursor or OpenAI when the role allows, else reported.
- Grade (`easy` | `moderate` | `hard` | `complex`): the bead's `grade`; none → the `band` of `node .agents/skills/agentsmd-auditor/scripts/rubric.mjs score grade <scores.json>` (scope, files, risk, contracts, migrations scored 0–5 against the `grade` rubric's anchors), recorded on the bead with its score. The grade sets model and effort below; effort never above `medium` except complex's `high` (higher levels are for chat sessions).
- Escalation: a failed easy or moderate run or review → one grade up, picked again; a failed hard or complex run or review → one retry on the `escalation` entry (its effort); a failure there → reported to the user.
- Workers: easy low `cursor/grok-4.3`, `cursor/grok-build-0.1`, `openai-codex/gpt-6-luna`, `anthropic/claude-haiku-5-5`, `anthropic/claude-haiku-4-5`; moderate medium `cursor/grok-4.5`, `cursor/grok-4.3`, `cursor/grok-build-0.1`, `openai-codex/gpt-6-sol`, `openai-codex/gpt-6-luna`, `anthropic/claude-sonnet-5-5`, `anthropic/claude-haiku-5-5`; hard medium `anthropic/claude-sonnet-5-5`, `openai-codex/gpt-6.1-sol`, `openai-codex/gpt-6-sol`, `cursor/grok-4.7`, `cursor/grok-4.6`, `cursor/grok-4.5`; complex high `anthropic/claude-sonnet-5-5`, `openai-codex/gpt-6-astra`, `openai-codex/gpt-6.1-sol`, `cursor/grok-4.7`; escalation medium `anthropic/claude-opus-5-5`.
- Reviewers: easy low `anthropic/claude-haiku-4-5`, `anthropic/claude-haiku-5-5`, `openai-codex/gpt-6-luna`, `cursor/grok-4.3`; moderate medium `anthropic/claude-haiku-5-5`, `anthropic/claude-haiku-4-5`, `openai-codex/gpt-6-sol`, `openai-codex/gpt-6-luna`, `cursor/grok-4.3`; hard medium `anthropic/claude-sonnet-5-5`, `openai-codex/gpt-6.1-sol`, `cursor/grok-4.7`, `cursor/grok-4.6`; complex high `anthropic/claude-sonnet-5-5`, `openai-codex/gpt-6-astra`, `openai-codex/gpt-6.1-sol`, `cursor/grok-4.7`; escalation medium `anthropic/claude-opus-5-5`.
- Design (`job: design`): medium `anthropic/claude-opus-5-5` only; no scored pick.

## Rules

- When asking the user for a judgement call, put the context in the request itself: what you found, the trade-offs, and what is at stake. Give every option a description that states as explicitly as possible what it will do, which files or state it touches, and what it leaves unchanged. Never offer bare labels.
- Update `.env.example` when adding ENV vars to code
- Commits: conventional (`feat: …`), terse, focused on the change; no author or co-author lines.
- Work on `main`; no feature branches or pull requests unless the user asks; push (when asked): `git pull --rebase`, `git push`, then `git status` up to date with origin.
- Untracked changes unrelated to the task → ignore.
- No TodoWrite, TaskCreate or MEMORY.md files; task tracking and project memory live in bd.
- Close on merge, not on coding done: a bead stays open until its code reaches `main`.
- A defect in an installed skill (its text contradicts a tool, a script fails, a case is missing) or a capability it lacks that a workaround covered (a raw shell command its script has no subcommand for) → `skill-fix-handoff` (files a GitHub issue on agent-foundry; its URL to the user at once and in the final reply), never a local edit of the installed copy under `.agents/skills/` or a runtime skill dir.
- Open skill handoffs: after a long chain of work and on request → `node .agents/skills/skill-fix-handoff/scripts/handoff.mjs check`; a fixed one → `skill-installer` reinstalls the skill and records the migration.

<!-- beads:skill -->
## Task tracking (Beads)

Work is tracked with Beads (`bd`). Load the `beads` skill before any `bd` command or task-tracking step and follow it; it holds the whole workflow. No markdown TODO lists; agent-local task tools only for the current turn.
<!-- /beads:skill -->

<!-- repo-manager -->
## Repo

- Toolchain versions live only in the root `mise.toml` `[tools]`; never another version file (no `.nvmrc`, `.python-version`, `.tool-versions`). A version change is a repo-wide change, never part of a feature's work.
- The app's `fix` and `check` tasks live in the root `mise.toml`: `mise run check`, `mise run fix <files>`; Dockerfile images against the pins: `tools/repo/toolchain.sh`.
- Git hooks (`lefthook.yml`): pre-commit runs the app's `fix` on its staged files, pre-push its `check` and the toolchain check. Never `--no-verify`.
- Root files (`lefthook.yml`, `tools/repo/`, this section) are regenerated by the repo setup; hand edits are overwritten.

## Workflow

- Checks are the project's own commands (each deployable's `check`, the hooks, CI); never relax, skip or silence a gate, a threshold or a mutation setting.
- Mutation runs only in CI (each `ci-checks.yml` `slow`), never locally per change; a failed CI mutation job → read the surviving mutants from its log and add tests that kill those on lines you wrote.
- A limit in a deployable's `AGENTS.md` § Thresholds changes only through a decision the user accepted, applied in its home in its own commit.
- Generated files are never edited by hand: Compose files come from each `dev-services.yml`, CI workflows from each `ci-checks.yml`; change the source in the same commit and regenerate.
- Code comments are minimal and technical; never a decision, question, rule or bead ID, a skill name, or design reasoning in code.
- `AGENTS.md` lines state rules and facts only; never a bead, decision, question or spec ID: the decision stays on its bead or spec file.
<!-- /repo-manager -->
