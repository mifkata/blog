# Markdown

`src/components/post/Markdown/Markdown.tsx` - Renders markdown to HTML using `marked`.

## Props

- `text?: string`
- `className?: string`

## Parsing

- `marked.parse(text, { async: false })`

## Output

- `<div dangerouslySetInnerHTML />`
- Empty text -> null

## SSR

- Server-rendered only; `marked` not bundled to client
