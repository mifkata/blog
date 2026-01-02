# GithubLink

`src/components/post/GithubLink/GithubLink.tsx` - React/TS GitHub link with lazy preview.

## Props

- `url: string` (required)
- `expanded?: boolean` (default: false)
- `maxHeight?: number` - limit iframe height in px (default: unlimited)
- `children?: ReactNode` - description slot

## Behavior

- Header: GitHub icon + `owner/repo/path` + external link → `_blank`
- Description: children below header (optional)
- Preview (files only):
  - Lazy load: fetch content only when expanded
  - Code: emgithub.com iframe
  - Images: raw.githubusercontent.com `<img>`
  - Iframe auto-resizes to content height via `postMessage` listener
  - If `maxHeight` set: cap height, show scrollbar

## URL Parsing

- Repo: `github.com/owner/repo`
- Dir: `github.com/owner/repo/tree/branch/path`
- File: `github.com/owner/repo/blob/branch/path` → preview enabled

## Visual

- Container: `border border-gray-light rounded-lg p-4`
- Header: `font-mono text-sm`, icon `w-5 h-5`
- Toggle: `text-accent`, `▶ Show` / `▼ Hide`
- Invalid URL: warning message

## Implementation

- All logic in component (no external `.ts` init files)
- TypeScript, functional component with hooks
- `useState` for expanded state
- `useEffect` for iframe resize listener
- `useRef` for iframe element
