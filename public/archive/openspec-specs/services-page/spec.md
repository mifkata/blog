# Services Page

Consulting services page with offerings, reasons to hire, and client list.

## Page

📁 Path: `src/pages/services.astro`
📍 Route: `/services`
📐 Layout: PageLayout — wide

### Data

- `services` — 5 service offerings
- `reasons` — 6 why-hire items
- `clients` — notable client names

### Sections (in order)

1. Hero — title, tagline, description
2. ServicesGrid — service offering cards
3. Why Work With Me — ReasonsGrid
4. Trusted By — ClientList
5. ContactCTA — "Get in Touch" button

### Dependencies

- Uses: PageLayout (`common-sections`), Button (`ui-primitives`), ContactCTA (`common-sections`)

## ServicesGrid

📁 Path: `src/components/pages/services/ServicesGrid/ServicesGrid.astro`

Responsive grid of service offering cards.

### Props

- `services` — Service array (required)
  - `title`, `description`, `icon` (server/layout/git-branch/cloud/users)

### Layout

- 2-column grid on desktop
- Each card: mapped icon + teal-accented title + description

## ReasonsGrid

📁 Path: `src/components/pages/services/ReasonsGrid/ReasonsGrid.astro`

Responsive grid of "why hire me" reasons.

### Props

- `reasons` — Reason array (required)
  - `title`, `description`

### Layout

- 2-column grid on desktop
- Each item: underlined title (sage green accent) + description

## ClientList

📁 Path: `src/components/pages/services/ClientList/ClientList.astro`

Flowing list of client names as tag pills.

### Props

- `clients` — string array (required)

### Layout

- Wrapped flex container of rounded pills with light gray background
