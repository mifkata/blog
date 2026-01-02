# GithubLink

`src/components/post/GithubLink/GithubLink.astro` - GitHub file link with preview.
Props:

- `url: string` (required)
- `expanded?: boolean` - show preview expanded by default (default: false)

Slot: default slot for description (supports rich content/links)
URL types: repo, directory, file - all display as links; only files have preview
Behavior:

- Header: GitHub icon + repo/path name + external link icon → opens in `_blank`
- Description: slot content below header (optional)
- Preview (files only, expandable):
  - Code files: emgithub.com embed
  - Images: raw.githubusercontent.com
    Visual: `border border-gray-light rounded-lg p-4`, header: `font-mono text-sm`
    Fallback: invalid URL → warning message
