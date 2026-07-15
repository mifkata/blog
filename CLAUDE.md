# PromptLab

## Overview

[placeholder]

## Stack

[placehoder]

## Rules

- When unsure about a request, ALWAYS ask clarifying questions before proceeding. Do not guess at parameters like copyright holders, next steps, or which file to modify. Ask first, act second.
- Update `.env.example` when adding ENV vars to code

---

## Git

- Commit and push after executing a task
- If untracked changes exist that are unrelated to current task, ignore them
- Do not include author/co-author information in commit messages
- Use conventional commit messages (e.g., `feat: add random forest training script`)

# Pull Requests

- Pushing a branch for the first time, should open a Draft PR automatically. Use `gh` CLI tool for GitHub operations.
- Automatically assign the current `git` user to newly created PRs.
- PR description should include only: Change requirements (goal of the PR), summary of applied changes.
- PR description summary of applied changes should be dynamically updated.
- Do not add any generation/co-authoring references in PR description.
- Do not add test plans to PR descriptions.

---

## Testing

- Testing instructions are in `public/archive/openspec-specs/testing/spec.md`.

---

# Memory Management with Beads

## Core Principle

Every unit of work must be tracked. Beads (`bd`) track individual tasks — decisions, context, and completed work — forming a persistent memory of what was done, why, and what the system looks like now.

---

## Beads: Task-Level Memory

### Always Create a Bead

Before starting any work — including spec creation/updates — create a bead:

```bash
bd create -t "Brief description of the task"
# or for quick capture:
bd q "Brief description"
```

This is non-negotiable. Every unit of work gets a bead. If you're unsure whether something warrants a bead, it does.

### Bead Lifecycle

| Stage             | Action                            | Command                         |
| ----------------- | --------------------------------- | ------------------------------- |
| **Start**         | Create the bead                   | `bd create -t "..."`            |
| **Begin work**    | Mark as in-progress               | `bd set-state <id> in_progress` |
| **Track context** | Add comments with decisions/notes | `bd comments <id> add "..."`    |
| **Dependencies**  | Link related beads                | `bd dep add <id> <dep-id>`      |
| **Complete**      | Close when merged to main         | `bd close <id>`                 |

### Maintaining Context

- **Comments are memory**: Use `bd comments <id> add "..."` to record decisions, blockers, and context that would otherwise be lost between sessions.
- **Check current state**: `bd list` / `bd ready` to see what's open and unblocked.
- **Review activity**: `bd activity` for real-time state feed.
- **Find prior work**: `bd search "query"` to locate relevant past beads.
- **Avoid duplicates**: `bd find-duplicates` before creating beads for work that may already exist.

### Structuring Larger Work

For epics or multi-step efforts:

```bash
bd epic ...             # Group related beads
bd children <parent>    # See sub-tasks
bd graph                # Visualize dependencies
bd swarm ...            # Structured epic management
```

---

## Integrated Workflow

```
1. Identify work needed

2. Create a bead for the task
   └── bd create -t "..." OR bd q "..."

3. Begin work
   └── bd set-state <id> in_progress

4. During work
   ├── Record decisions and context as comments
   └── Link dependencies between beads

5. Complete work
   └── Code merged to main → bd close <id>
```

---

## Key Rules

1. **Bead creation is automatic and persistent.** Every task, no matter how small, gets a bead.
2. **Beads close on merge, not on completion of coding.** The bead stays open until code reaches `main`.
3. **Comments are cheap, lost context is expensive.** When in doubt, add a comment to the bead.

---

# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

---

Sanity: say "CLAUDE.md LOADED"
