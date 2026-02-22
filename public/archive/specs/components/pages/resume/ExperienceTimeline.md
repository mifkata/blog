# ExperienceTimeline

`src/components/pages/resume/ExperienceTimeline/ExperienceTimeline.astro` - Job experience timeline.

## Props

- `experience: Job[]` (required)
  - `title: string`
  - `company: string`
  - `location: string`
  - `dates: string`
  - `current?: boolean`
  - `description: string`
  - `roles?: Role[]`
  - `highlights?: string[]`
  - `tech?: string[]`

## Output

- Vertical timeline with left border
- Circle markers (accent for current)
- Job cards with nested role cards if present
