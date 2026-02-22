## ADDED Requirements

### Requirement: About page structure
The system SHALL provide an About page at `src/pages/about.astro` at URL `/about` using PageLayout (`common-sections`) with wide size. It SHALL load quirks and life-outside-work data arrays and render the following sections in order: Hero, Outside of Work (interests with icons), Values, How People See Me, Quirks (bullet list), Right Now (current focus), and a ContactCTA (`common-sections`) with a mailto button.

#### Scenario: Render about page
- **WHEN** a user navigates to `/about`
- **THEN** the page displays all sections (Hero, Outside of Work, Values, How People See Me, Quirks, Right Now, CTA) in a wide layout

### Requirement: AboutHero section
The system SHALL provide an AboutHero component at `src/components/pages/about/AboutHero/AboutHero.astro` that renders the about page hero with a circular avatar image and introduction text. On desktop, the avatar and intro text display side by side. The avatar is a large circular image with a caption, and the intro contains the name as an `<h1>` plus subtitle and description text.

#### Scenario: Render hero layout
- **WHEN** AboutHero renders on a desktop viewport
- **THEN** the circular avatar and introduction text display in a horizontal row

### Requirement: AboutSection content block
The system SHALL provide an AboutSection component at `src/components/pages/about/AboutSection/AboutSection.astro` that renders a titled content section on the about page. It SHALL accept a required `title` and provide an `icon` slot and a default content slot. The title renders as an `<h2>` with the icon displayed inline.

#### Scenario: Render section with icon
- **WHEN** AboutSection renders with a title and icon
- **THEN** the icon and title display inline as an `<h2>`, followed by the slot content

### Requirement: QuirksList component
The system SHALL provide a QuirksList component at `src/components/pages/about/QuirksList/QuirksList.astro` that renders a bulleted list of personality quirks. It SHALL accept a required `quirks` string array and render each item with an orange circle icon bullet and text.

#### Scenario: Render quirks list
- **WHEN** QuirksList is rendered with an array of quirk strings
- **THEN** it displays a vertical list with orange circle icon bullets and the quirk text for each item
