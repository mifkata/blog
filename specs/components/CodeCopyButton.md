# CodeCopyButton

`src/components/CodeCopyButton/CodeCopyButton.astro` - Adds copy buttons to code blocks.

Props: none (script-only component)

Behavior: wraps each `<pre>` in `<div class="relative group">`, adds copy button

Button: `absolute top-2 right-2`, hidden until hover, copies code to clipboard

Feedback: "Copy"→"Copied!" for 2s

Init: runs on load + `astro:page-load` event
