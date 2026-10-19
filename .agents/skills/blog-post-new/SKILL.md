---
name: blog-post-new
description: >-
  Starts a new blog post: interviews the user for the title and description, then creates an unpublished
  (`draft: true`) MDX file in src/content/blog with placeholder frontmatter and a placeholder hero image that
  exists, so Astro builds and dev keep working. Use when the user asks to create, start, scaffold or draft a new
  blog post or article. Not for notes (src/content/notes) or for editing existing posts.
metadata:
  arguments: "[title]"
---

# blog-post-new

OUTPUT: `src/content/blog/<YYYY>/<MM>/<slug>.mdx`, a draft that builds as is.

## 1. Interview

Ask for anything not given as an argument, in one round of questions:

- **Title**: as it should appear on the post.
- **Description**: one or two sentences, used for the meta description and cards.

Then derive the slug from the title: lowercase, words joined by `-`, no stop-word trimming. Show the title,
description, slug and file path back to the user and ask them to confirm or correct them before writing. If the
file already exists, stop and ask; never overwrite a post.

## 2. Write the draft

Use the current UTC time for `pubDate` and the current year and month for the path. Every other value is a
placeholder for the author to replace:

```mdx
---
title: "<title>"
description: "<description>"
synopsis: >-
  TODO: synopsis - two or three short paragraphs shown above the post and on cards.
pubDate: "<YYYY-MM-DDTHH:MM:00Z>"
heroImage: "@/assets/blog/placeholder.png"
tags: []
draft: true
---

TODO: write the post.
```

- Escape double quotes in the title and description.
- `heroImage` must point at a file that exists, or the build fails. `@/assets/blog/placeholder.png` is a snapshot of
  the site's home social card, kept for this purpose; don't move or delete it.
- `draft: true` keeps the post out of production builds; it is still visible in `pnpm dev`.

## 3. Report

Tell the user:

- the file path and the dev URL (`http://localhost:4321/blog/<YYYY>/<MM>/<slug>/`)
- where the real hero image goes: `src/assets/blog/<YYYY>/<MMDD>-<slug>.<png|jpg>`, then update `heroImage`
- before publishing: fill `synopsis` and `tags` (tags must exist in `src/data/tags.json`), set `pubDate`, remove
  `draft: true`, and add the post to `src/data/series.json` if it belongs to a series
