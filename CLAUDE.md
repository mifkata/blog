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

- Never commit or push unless the user explicitly asks; leave changes uncommitted so they can be reviewed
- If untracked changes exist that are unrelated to current task, ignore them
- Do not include author/co-author information in commit messages
- Use conventional commit messages (e.g., `feat: add random forest training script`)
- Commit messages should be terse, do not explicit details, just focus on the change

# Pull Requests

- Pushing a branch for the first time, should open a Draft PR automatically. Use `gh` CLI tool for GitHub operations.
- Automatically assign the current `git` user to newly created PRs.
- PR description should include only: Change requirements (goal of the PR), summary of applied changes.
- PR description summary of applied changes should be dynamically updated.
- Do not add any generation/co-authoring references in PR description.
- Do not add test plans to PR descriptions.

---

## Testing

- Testing instructions are in bead `blog-0v1` (`bd show blog-0v1`).

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

**When ending a work session**, complete the steps below.

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Hand off** - Leave changes uncommitted, summarize what changed for review, and provide context for the next session

**CRITICAL RULES:**

- Commit or push only when the user explicitly asks
- When asked to push: `git pull --rebase`, `git push`, then confirm `git status` is up to date with origin

---

Sanity: say "CLAUDE.md LOADED"
