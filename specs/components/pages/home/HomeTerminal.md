# HomeTerminal

`src/components/pages/home/HomeTerminal/HomeTerminal.astro` - Fake CLI terminal.
Props: `command?` (string, default: "cat current_focus.txt"), `output?` (string, default: "Exploring vibe coding...")
Output: `<section class="max-w-[960px] mx-auto px-6 pb-12 mt-8">` → dark box (`bg-gray-dark`), monospace, accent `$` prompt, white command, muted `>` output
