# CodeCopyButton

`src/components/post/CodeCopyButton/CodeCopyButton.astro` - Adds copy buttons to code blocks.

## Props

- None (script-only component)

## Behavior

- Wraps each `<pre>` in `<div class="relative group">`
- Adds copy button
- Button: `absolute top-2 right-2`, hidden until hover
- Copies code to clipboard

## Feedback

- "Copy" -> "Copied!" for 2s

## Init

- Runs on load + `astro:page-load` event
