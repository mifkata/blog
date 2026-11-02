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

OUTPUT: `src/content/blog/<YYYY>/<MM>/<slug>.mdx`, a draft that builds as is, written only by `scripts/new.mjs` from `assets/post.mdx`.

## Procedure

1. Ask in one round for whatever the arguments did not give: the title, as it appears on the post, and a description of one or two sentences for the meta description and cards.
2. `<new> --title "<title>" --description "<description>" --dry-run`; show the title, description, slug and path; wait for confirmation or corrections.
3. `<new>` with the confirmed values; a non-zero exit stops the run.
4. `pnpm exec astro sync` validates the frontmatter.
5. Report the `path`, the `url` and every `next` line of the script's JSON.

`<new>` = `node <skill-dir>/scripts/new.mjs` (any folder inside the repo). `--date <ISO date>` overrides the current UTC time.

Exit: 0 done; 1 the post exists or the placeholder image is missing (never overwrite: ask for another title); 2 usage.

`@/assets/blog/placeholder.png` is the hero the template points at, because a missing file fails the build; never move or delete it.
