## Beads (bd): hard rules

Full routine: load the `beads` skill. These hold even when it is not loaded.

- Claim before the first edit: `node .agents/skills/beads/scripts/bead.mjs claim <id>`.
- Claim before creating a branch or worktree, and again when resuming. An `in_progress` bead this session did not claim is another session's, even under the same actor name: never work it.
- Every bd write through that script (claim, note, request, followup, question, handoff, close, respond, remember, apply); reads inline.
- A user request no open bead covers → `bead.mjs request` with its `--grade`, words verbatim, first.
- Work outside the claimed bead → `bead.mjs followup`; never widen scope silently.
- Close only done, verified work with leftovers filed; else `bead.mjs handoff`.
- Human beads answered only with the user's verbatim words (`bead.mjs respond`); a bead waiting on one is handed off and stays `open` (R9).
- No git commit, push, `bd sync` or Dolt push unless the user or repo grants it; never `bd init`, `bd edit`, `bd delete`.
- A factory section in AGENTS.md governs routed items.
