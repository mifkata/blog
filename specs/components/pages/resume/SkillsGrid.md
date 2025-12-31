# SkillsGrid

`src/components/pages/resume/SkillsGrid/SkillsGrid.astro` - Technical skills grid.
Props: `skills` (array of `{name, icon, items[]}`, required)
Icons: server, layout, database, cloud, check, tool → mapped to icon components
Output: `<div class="grid grid-cols-2 md:grid-cols-3 gap-6">` → skill groups with icon + name + tag pills
Uses: Server, Layout, Database, Cloud, Check, Tool icons
