# mifkata.com

Personal blog at mifkata.com: long-form posts (`src/content/blog/`) and short notes (`src/content/notes/`) written in MDX, built as a static site.

Maintained with the `agentsmd-writer` skill and audited by `agentsmd-auditor`: change this file only through them. Sections owned by other skills and marked blocks are theirs.

## Stack

- Astro with MDX, React islands and Tailwind CSS
- Storybook for components, Vitest for tests, ESLint and Prettier for linting
- pnpm
- Cloudflare Pages hosting, provisioned with Terraform (`terraform/`)

## Skills

- New blog post → `blog-post-new`
- New note → `blog-note-new`
- Review, edit or tighten a post → `blog-post-editor`
- Add tips, code samples or links to a post → `blog-post-enhancer`
- Final spelling and grammar pass on a post → `blog-post-proofreader`
- Frontend UI or client-side logic for a bead or spec → `frontend-astro-builder`; owns § Stack
- Review a `frontend-astro-builder` bead → `frontend-astro-reviewer`
- New Astro frontend → `frontend-astro-bootstrapper`
- Root toolchain pins, git hooks, toolchain upgrades → `repo-manager`
- README create or rewrite → `readme-writer`
- AGENTS.md or CLAUDE.md change, agents repeating a mistake → `agentsmd-writer`; audit → `agentsmd-auditor`
- Task tracking, claims, handoffs → `beads`; owns the `beads:skill` block
- Installed skill defect or missing capability → `skill-fix-handoff`

## Workflows

- Blog post: `blog-post-new` → `blog-post-editor` → `blog-post-enhancer` → `blog-post-proofreader`
- Frontend bead: `frontend-astro-builder` → `frontend-astro-reviewer`
- AGENTS.md: `agentsmd-writer` → `agentsmd-auditor`

## Commands

- Build: `pnpm build`
- Test: `pnpm test:run`
- Lint: `pnpm lint`; fix `pnpm lint:fix`
- Format: `pnpm format`; fix `pnpm format:fix`

## Authority

- Never without the user: commit, push, history rewrite (rebase, reset, force push), deleting files or branches, deploy (`terraform apply`).

## Subagents

- Every subagent spawn, any skill or runner, follows this section; skills read the model per role and grade here.
- Pick: `node .agents/skills/agentsmd-auditor/scripts/models.mjs pick <the role's models for the grade that this runner can spawn, in listed order>` → its `top` (the `model-pick` rubric: recorded success rate and runs; a tie → the first listed); `top` null → reported to the user; none it can spawn → its session model.
- Record each run: `node .agents/skills/agentsmd-auditor/scripts/models.mjs record <provider/model> <role> <grade> success|failure|escalated` (failure: error, timeout, refusal, or work sent back; escalated: handed to the next grade).
- Never pick a model `models.mjs stats` lists as excluded or `below` (under 60% after 15 runs; a model the registry keeps is never below).
- Vendors: design and the reviewers' `escalation` entry from Anthropic only; a runner spawning several vendors takes easy and moderate workers from Cursor and OpenAI only.
- Anthropic pacing (subscription limits, shared with every Claude session): at most 5 Anthropic subagents running at once, each start ≥5 s after the previous; "usage limit reached" or a rate-limit error → no new Anthropic subagent, the running ones finish, the rest go to Cursor or OpenAI when the role allows, else reported.
- Grade (`easy` | `moderate` | `hard` | `complex`): the bead's `grade`; none → the `band` of `node .agents/skills/beads/scripts/rubric.mjs score grade <scores.json>` (scope, files, risk, contracts, migrations scored 0–5 against the `grade` rubric's anchors), recorded on the bead with its score. The grade sets model and effort below; effort never above `medium` (higher levels are for chat sessions) except the complex ladder below.
- Escalation: a failed review → one grade up, picked again; a failure there, or of a complex review → the reviewers' `escalation` entry. A complex run (worker, or review at `escalation`) that fails at `medium` → one retry at `high`, then one at `xhigh`, then reported to the user.
- Workers: easy low `cursor/grok-4.3`, `cursor/grok-build-0.1`, `openai-codex/gpt-6-luna`, `anthropic/claude-haiku-5-5`; moderate medium `cursor/grok-4.5`, `openai-codex/gpt-6-sol`, `anthropic/claude-sonnet-5-5`; hard medium `anthropic/claude-sonnet-5-5`, `openai-codex/gpt-6.1-sol`, `cursor/grok-4.7`, `anthropic/claude-opus-5-5`; complex medium `anthropic/claude-opus-5-5`, `openai-codex/gpt-6-astra`, `cursor/grok-4.7`.
- Reviewers: easy low `anthropic/claude-haiku-4-5`, `openai-codex/gpt-6-luna`, `cursor/grok-4.3`; moderate medium `anthropic/claude-haiku-5-5`, `openai-codex/gpt-6-sol`, `cursor/grok-4.3`; hard medium `anthropic/claude-sonnet-5-5`, `openai-codex/gpt-6.1-sol`, `cursor/grok-4.7`; complex medium `anthropic/claude-opus-5-5`, `openai-codex/gpt-6-astra`, `cursor/grok-4.7`; escalation medium `anthropic/claude-opus-5-5`.
- Design (`job: design`): medium `anthropic/claude-opus-5-5` only; no scored pick.

## Rules

- When unsure about a request, ALWAYS ask clarifying questions before proceeding. Do not guess at parameters like copyright holders, next steps, or which file to modify. Ask first, act second.
- When asking the user for a judgement call, put the context in the request itself: what you found, the trade-offs, and what is at stake. Give every option a description that states as explicitly as possible what it will do, which files or state it touches, and what it leaves unchanged. Never offer bare labels.
- Update `.env.example` when adding ENV vars to code
- Don't write comments that restate the implementation, e.g. `// Drafts are visible in dev` above `import.meta.env.DEV || !data.draft`, or a label repeating the element or condition right below it. Comments that add what the code can't say (intent, constraints, units, workarounds, config) are welcome.
- Commits: conventional (`feat: …`), terse, focused on the change; no author or co-author lines.
- Work on `main`; no feature branches or pull requests unless the user asks.
- Push (when asked): `git pull --rebase`, `git push`, then `git status` up to date with origin.
- Untracked changes unrelated to the task → ignore.
- No TodoWrite, TaskCreate or MEMORY.md files; task tracking and project memory live in bd.
- Close on merge, not on coding done: a bead stays open until its code reaches `main`.
- Sanity: say "AGENTS.md LOADED"
- A defect in an installed skill (its text contradicts a tool, a script fails, a case is missing) or a capability it lacks that a workaround covered (a raw shell command its script has no subcommand for) → `skill-fix-handoff`, never a local edit of the installed copy under `.agents/skills/` or a runtime skill dir.
- A skill handoff record set `done` (`docs/skill-handoffs/SH-<hash>-<slug>.md`) → once committed, deleted from the repo with `node .agents/skills/skill-fix-handoff/scripts/handoff.mjs prune`; no committed done record stays.

## Testing

- Testing instructions are in bead `blog-0v1` (`bd show blog-0v1`).

<!-- beads:skill -->
## Task tracking (Beads)

Work is tracked with Beads (`bd`). Load the `beads` skill before any `bd` command or task-tracking step and follow it; it holds the whole workflow. No markdown TODO lists; agent-local task tools only for the current turn.
<!-- /beads:skill -->
