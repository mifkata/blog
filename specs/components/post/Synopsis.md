# Synopsis

`src/components/Synopsis.astro` - Renders inline markdown to HTML.

Props: `text?: string`, `class?: string`

Markdown: `[t](url)`→a, `**b**`→strong, `*i*`→em, `` `c` ``→code, `\n\n`→paragraphs

Output: each paragraph→`<p>{content}</p>`, empty→none

Parse order: links→bold→italic→code
