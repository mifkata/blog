# Resume Page

Professional experience page with skills, timeline, and early career.

## Page

📁 Path: `src/pages/resume.astro`
📍 Route: `/resume`
📐 Layout: PageLayout — wide

### Data

- `skills` — categorized tech skills
- `experience` — job history with roles
- `earlyCareer` — 2000–2010 summary

### Sections (in order)

1. Hero — title + summary text
2. SkillsGrid — categorized skill tags
3. ExperienceTimeline — job history
4. EarlyCareer — early career summary
5. ContactCTA — "Get in Touch" button

### Dependencies

- Uses: PageLayout (`common-sections`), Button (`ui-primitives`), ContactCTA (`common-sections`)

## ExperienceTimeline

📁 Path: `src/components/pages/resume/ExperienceTimeline/ExperienceTimeline.astro`

Vertical timeline of job experience with left border and circle markers.

### Props

- `experience` — Job array (required)
  - `title`, `company`, `location`, `dates`
  - `current?` — accent-colored marker when true
  - `description`, `roles?`, `highlights?`, `tech?`

### Layout

- Vertical left border with circle markers
- Current job: accent-colored marker
- Job cards with nested role cards when `roles` is present

## SkillsGrid

📁 Path: `src/components/pages/resume/SkillsGrid/SkillsGrid.astro`

Responsive grid of technical skill categories.

### Props

- `skills` — SkillGroup array (required)
  - `name`, `icon` (server/layout/database/cloud/check/tool), `items`

### Layout

- 2 columns on mobile, 3 on desktop
- Each group: mapped icon + category name + skill tag pills

## EarlyCareer

📁 Path: `src/components/pages/resume/EarlyCareer/EarlyCareer.astro`

Summary section for early career history, rendered as a timeline item.

### Props

- `period` — date range string (required)
- `description` — summary text (required)
- `companies` — company name array (required)

### Layout

- Timeline item with circle marker
- "Early Career" heading, period, description, company name pills
