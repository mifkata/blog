## ADDED Requirements

### Requirement: Services page structure
The system SHALL provide a Services page at `src/pages/services.astro` at URL `/services` using PageLayout (`common-sections`) with wide size. It SHALL load services (5 offerings), reasons (6 why-hire items), and clients (notable names) data. It SHALL render: a hero section with title/tagline/description, ServicesGrid, a "Why Work With Me" ReasonsGrid section, a "Trusted By" ClientList section, and a ContactCTA (`common-sections`).

#### Scenario: Render services page
- **WHEN** a user navigates to `/services`
- **THEN** the page displays Hero, Services grid, Reasons grid, Client list, and CTA sections in a wide layout

### Requirement: ServicesGrid component
The system SHALL provide a ServicesGrid component at `src/components/pages/services/ServicesGrid/ServicesGrid.astro` that renders service offerings in a responsive grid. It SHALL accept a required `services` array where each service has a title, description, and icon identifier (server, layout, git-branch, cloud, users).

The grid SHALL display in 2 columns on desktop, with each card showing a mapped icon, a teal-accented title, and description text.

#### Scenario: Render services grid
- **WHEN** ServicesGrid renders with a services array
- **THEN** it displays a 2-column grid with icon, title, and description for each service

### Requirement: ReasonsGrid component
The system SHALL provide a ReasonsGrid component at `src/components/pages/services/ReasonsGrid/ReasonsGrid.astro` that renders "why hire me" reasons in a responsive grid. It SHALL accept a required `reasons` array where each reason has a title and description.

The grid SHALL display in 2 columns on desktop, with each item showing an underlined title (sage green accent) and description.

#### Scenario: Render reasons grid
- **WHEN** ReasonsGrid renders with a reasons array
- **THEN** it displays a 2-column grid with accented title and description for each reason

### Requirement: ClientList component
The system SHALL provide a ClientList component at `src/components/pages/services/ClientList/ClientList.astro` that renders client names as a flowing list of tag pills. It SHALL accept a required `clients` string array and display each name as a rounded pill with a light gray background.

#### Scenario: Render client list
- **WHEN** ClientList renders with a clients array
- **THEN** it displays client names as wrapped tag pills in a flowing layout
