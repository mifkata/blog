# About Page

Personal bio page with avatar, interests, values, and quirks.

## Page

📁 Path: `src/pages/about.astro`
📍 Route: `/about`
📐 Layout: PageLayout — wide

### Data
- `quirks` — personality quirks array
- `lifeOutsideWork` — interests array

### Sections (in order)
1. AboutHero — avatar + intro
2. Outside of Work — interests with icons
3. Values — personal values text
4. How People See Me — self-perception
5. Quirks — QuirksList component
6. Right Now — current focus
7. ContactCTA — "Get in Touch" mailto button

### Dependencies
- Uses: PageLayout (`common-sections`), Button (`ui-primitives`), ContactCTA (`common-sections`)

## AboutHero

📁 Path: `src/components/pages/about/AboutHero/AboutHero.astro`

Hero section with circular avatar and introduction text. Static content, no props.

### Layout
- Horizontal row on desktop: large circular avatar image with caption + intro text (h1 name, subtitle, description)

## AboutSection

📁 Path: `src/components/pages/about/AboutSection/AboutSection.astro`

Titled content section for the about page.

### Props
- `title` — section title (required)
- `class?` — additional CSS classes
- `icon` slot — icon element displayed inline with title
- Default slot — section content

## QuirksList

📁 Path: `src/components/pages/about/QuirksList/QuirksList.astro`

Bulleted list of personality quirks with orange circle icon markers.

### Props
- `quirks` — string array (required)
