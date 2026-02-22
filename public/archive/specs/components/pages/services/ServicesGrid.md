# ServicesGrid

`src/components/pages/services/ServicesGrid/ServicesGrid.astro` - Service offerings grid.

## Props

- `services: Service[]` (required)
  - `title: string`
  - `description: string`
  - `icon: string`

## Icons

- server, layout, git-branch, cloud, users → mapped to icon components

## Output

- `<div class="grid md:grid-cols-2 gap-6">`
- Service cards with icon box + title (#6FA4AF) + description

## Dependencies

- Server, Layout, GitBranch, Cloud, Users icons
