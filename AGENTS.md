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
- CI workflow from `ci-checks.yml` → `ci-pipeline`
- README create or rewrite → `readme-writer`
- AGENTS.md or CLAUDE.md change, agents repeating a mistake → `agentsmd-writer`; audit → `agentsmd-auditor`
- Task tracking, claims, handoffs → `beads`; owns the `beads:skill` block
- Installed skill defect or missing capability → `skill-fix-handoff`; restore, update or install skills → `skill-installer`

## Workflows

- Blog post: `blog-post-new` → `blog-post-editor` → `blog-post-enhancer` → `blog-post-proofreader`
- Frontend bead: `frontend-astro-builder` → `frontend-astro-reviewer`

## Commands

- Build: `pnpm build`; test: `pnpm test:run`; typecheck: `pnpm typecheck`
- Lint/format: `pnpm lint`, `pnpm format`; fix `pnpm lint:fix`, `pnpm format:fix`

## Authority

- Never without the user: commit, push, history rewrite (rebase, reset, force push), deleting files or branches, deploy (`terraform apply`).
- Ambiguity or more than one viable path → ask the user; never decide silently.

## Subagents

- Every subagent spawn, any skill or runner, follows this section; skills read the model per role and grade here.
- Pick: `node .agents/skills/agentsmd-auditor/scripts/models.mjs pick --mode <the word after the grade's effort in its Workers or Reviewers line: rotate | prefer; none → rubric> --role <role> --grade <grade> <the role's models for the grade that this runner can spawn, in listed order>` → its `top` (`rubric`: the `model-pick` rubric over the recorded success rate and runs; `rotate`: the fewest recorded runs for the role and grade; `prefer`: the first listed; a tie → the first listed); several vendors → one pick per vendor; `top` null → reported to the user; none it can spawn → its session model.
- Record each run: `node .agents/skills/agentsmd-auditor/scripts/models.mjs record <provider/model> <role> <grade> success|failure|escalated` (failure: error, timeout, refusal, or work sent back; escalated: handed to the next grade); `below: true` in its output → `agentsmd-auditor` at once: its R10 hand-off to agent-foundry takes the model out of the template, then it is excluded here. Exit 1 (a git dir with no work tree reachable, or the file is not JSON): reported in the final reply, no retry, the file never edited by hand.
- Never pick a model `models.mjs stats` lists as excluded or `below` (under 60% after 8 runs; a model the registry keeps is never below).
- Vendors: design and the workers' and reviewers' `escalation` entries from Anthropic only; every other grade, easy to complex, spread across the vendors its line lists; a model id names its maker, not the tool that runs it (a Cursor runner spawns `xai/grok-*`).
- Anthropic pacing (subscription limits, shared with every Claude session): at most 4 Anthropic subagents running at once, each start ≥5 s after the previous; parallel work spread evenly across the vendors with a model for the grade, each vendor's model the top of its own pick; "usage limit reached" or a rate-limit error → no new Anthropic start, the running ones finish, the rest stays spread over the other vendors, else reported.
- Vendor failure (a started run stops on a vendor's auth, session or quota error; unstarted Anthropic work: the pacing line): that vendor named to the user at once as needing a relogin, never silently rerouted; the user picks wait for the relogin | fail over; only the failed work stops, the rest goes on; after a relogin the same session continues; on a failover the new model resumes from the previous model's worktree and working record, never a fresh start.
- Grade (`easy` | `moderate` | `hard` | `complex`): the bead's `grade`; none → the `band` of `node .agents/skills/agentsmd-auditor/scripts/rubric.mjs score grade <scores.json>` (scope, files, risk, contracts, migrations scored 0–5 against the `grade` rubric's anchors), recorded on the bead with its score. The grade sets model and effort below; a model followed by its own effort uses that one; grade effort never above `medium` except complex's `high`; a model's own effort up to `xhigh`; the escalation entry's effort as listed.
- Escalation: a failed easy or moderate run or review → one grade up, picked again; a failed hard or complex run or review → one retry on the `escalation` entry (its effort); a failure there → reported to the user.
- Workers: easy low prefer `xai/grok-4.7` high, `anthropic/claude-haiku-5-5` high, `openai-codex/gpt-6.1-sol` medium; moderate medium rotate `anthropic/claude-sonnet-5-5` medium, `openai-codex/gpt-6.1-sol` high, `xai/grok-4.7` xhigh; hard medium rotate `anthropic/claude-sonnet-5-5` high, `openai-codex/gpt-6-astra` medium; complex high rotate `anthropic/claude-opus-5-5` medium, `openai-codex/gpt-6-astra` xhigh; escalation high `anthropic/claude-opus-5-5`.
- Reviewers: easy low prefer `xai/grok-4.7` high, `anthropic/claude-haiku-5-5` high, `openai-codex/gpt-6.1-sol` medium; moderate medium rotate `anthropic/claude-sonnet-5-5` medium, `openai-codex/gpt-6.1-sol` high, `xai/grok-4.7` xhigh; hard medium rotate `anthropic/claude-sonnet-5-5` high, `openai-codex/gpt-6-astra` medium; complex high rotate `anthropic/claude-opus-5-5` medium, `openai-codex/gpt-6-astra` xhigh; escalation high `anthropic/claude-opus-5-5`.
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

## Docs

- `docs/agents-md/`: AGENTS.md registers: rules, subagent models, model run stats, audit findings; `node .agents/skills/agentsmd-auditor/scripts/query.mjs docs/agents-md/audit.json findings --where status=open`, `node .agents/skills/agentsmd-auditor/scripts/models.mjs stats`
- `docs/repo/`: repo setup decisions and questions (`repo-manager`); `node .agents/skills/repo-manager/scripts/query.mjs docs/repo/index.json deployables --where path=.`
- `docs/skills/`: skill install and migration records (`skill-installer`); `node .agents/skills/skill-installer/scripts/query.mjs docs/skills/migrated.json skills`

<!-- beads:skill -->
## Task tracking (Beads)

Work is tracked with Beads (`bd`). Load the `beads` skill before any `bd` command or task-tracking step and follow it; it holds the whole workflow. No markdown TODO lists; agent-local task tools only for the current turn.
<!-- /beads:skill -->

<!-- repo-manager -->
## Repo

- Toolchain versions live only in the root `mise.toml` `[tools]`; never another version file (no `.nvmrc`, `.python-version`, `.tool-versions`). A version change is a repo-wide change, never part of a feature's work.
- The app's `fix`, `check` and `fast` tasks live in the root `mise.toml`: `mise run fast` (static analysis, then only the affected tests), `mise run check` (the full tier: build, then every test), `mise run fix <files>`.
- Git hooks (`lefthook.yml`): pre-commit runs the app's `fix` on its staged files, pre-push its `check` (the full tier). Never `--no-verify`.
- Root files (`lefthook.yml`, this section) are regenerated by the repo setup; hand edits are overwritten.

## Workflow

- Checks are the project's own commands (each deployable's `fast` and `check`, the hooks, CI); never relax, skip or silence a gate, a threshold or a mutation setting.
- Mutation runs only in CI (each `ci-checks.yml` `slow`), never locally per change; a failed CI mutation job → read the surviving mutants from its log and add tests that kill those on lines you wrote.
- A limit in a deployable's `AGENTS.md` § Thresholds changes only through a decision the user accepted, applied in its home in its own commit.
- Generated files are never edited by hand: Compose files come from each `dev-services.yml`, CI workflows from each `ci-checks.yml`; change the source in the same commit and regenerate.
- Code comments are minimal and technical; never a decision, question, rule or bead ID, a skill name, or design reasoning in code.
- `AGENTS.md` lines state rules and facts only; never a bead, decision, question or spec ID: the decision stays on its bead or spec file.
<!-- /repo-manager -->
