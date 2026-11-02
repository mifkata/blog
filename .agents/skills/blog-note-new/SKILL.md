---
name: blog-note-new
description: >-
  Start a new unpublished MDX note in src/content/notes. Gather the title and any
  supplied note text, derive the dated filename, and create a draft that works in
  Astro. Use when the user asks to create, start, scaffold or draft a short note,
  mental note, book note or book-review note for this blog. Not for long-form blog posts or
  editing existing notes.
metadata:
  arguments: "[title]"
---

# blog-note-new

OUTPUT: `src/content/notes/<YYYY-MM-DD>-<slug>.mdx`, a draft that builds as is, written only by `scripts/new.mjs` from `assets/note.mdx`.

## Procedure

1. Use the title, date, tags and body the user supplied; ask only for a missing title. A note has no description, synopsis or hero image.
2. Book note, book-review note or a note about a book the user read, however it was worded → `--tag book-review`, kept alongside any other tags the user gave.
3. Body text → saved verbatim to a temp file for `--body-file`, or piped with `--body-file -`. Never rewrite it, and never invent opinions, ratings or review text.
4. `<new> --title "<title>" [--date <YYYY-MM-DD>] [--tag <tag>]… [--body-file <path|->] --dry-run`; show the title, date and path only when something was missing or ambiguous.
5. `<new>` with the same arguments; a non-zero exit stops the run.
6. `pnpm exec astro sync` validates the frontmatter.
7. Report the `path`, the `url` and every `next` line of the script's JSON.

`<new>` = `node <skill-dir>/scripts/new.mjs` (any folder inside the repo). No `--date` → the current UTC day; a supplied date is a calendar day, never shifted across time zones.

Exit: 0 done; 1 the note exists (never overwrite: ask for another title) or the body file is unreadable; 2 usage.

Notes have timeline anchors, not article routes. Never add blog-only fields, or register a note in `src/data/tags.json` or `src/data/series.json`.
