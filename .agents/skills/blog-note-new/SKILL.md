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

Create `src/content/notes/<YYYY-MM-DD>-<slug>.mdx` with `draft: true`.

## Gather the details

- Use the title, date and body the user already supplied. Ask for a missing title;
  a note needs no description, synopsis or hero image.
- Infer book-review intent from requests such as “book note,” “book-review note”
  or “a note about the book I read,” including wording supplied as skill
  arguments. Such a request needs `tags: [book-review]`; do not scaffold it as an
  ordinary untagged note merely because the request also supplies a title.
- If no date was supplied, use the current UTC calendar day. Treat a supplied
  date as a calendar day, not a timestamp to shift into another time zone.
- Derive the slug from the title: lowercase words joined by `-`, without trimming
  stop words. Show the title, date and proposed path when asking for missing or
  ambiguous details; do not ask again for choices the user already made.
- If the destination exists, ask for a different title or slug. Do not overwrite
  an existing note.

## Create the draft

Check the notes collection in `src/content.config.ts` for the current schema.
Use the flat dated filename convention, not the blog's year/month directories.

```mdx
---
title: "<title>"
date: <YYYY-MM-DD>
tags: []
draft: true
---

TODO: write the note.
```

Quote and escape the title as a YAML string. If the user supplied body text, put
it in place of the placeholder without rewriting it. Do not invent the author's
opinions, book ratings or review text.

For a book note, replace `tags: []` with `tags: [book-review]`. Both
`src/pages/index.astro` and `src/pages/notes/index.astro` consume this tag to
identify reviews. Preserve other tags the user supplied. Do not add blog-only
fields or register notes in `src/data/tags.json` or `src/data/series.json`.

`draft: true` keeps a note out of production and visible in development. Check
that the new file parses with the current schema using an available Astro check
or build; there is no image asset to generate.

## Report

Give the file path and its development timeline link, using this blog's actual
development-server address when it is running (check `astro dev status`); otherwise
show the default `http://localhost:4321/notes/#<YYYY-MM-DD>-<slug>`. Notes have
timeline anchors, not individual article routes. Mention that publishing requires
replacing any placeholder text, checking the date, and removing `draft: true`.
