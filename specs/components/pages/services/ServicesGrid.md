# ServicesGrid

`src/components/pages/services/ServicesGrid/ServicesGrid.astro` - Service offerings grid.
Props: `services` (array of `{title, description, icon}`)
Icons: server, layout, git-branch, cloud, users → mapped to icon components
Output: `<div class="grid md:grid-cols-2 gap-6">` → service cards with icon box + title (#6FA4AF) + description
Uses: Server, Layout, GitBranch, Cloud, Users icons
