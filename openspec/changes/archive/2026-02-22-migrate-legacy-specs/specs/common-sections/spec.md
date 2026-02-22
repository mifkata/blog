## ADDED Requirements

### Requirement: PageLayout base layout
The system SHALL provide a PageLayout component at `src/layouts/PageLayout.astro` that wraps all standard pages. It SHALL render the full HTML document structure: `<html>` with BaseHead (`layout`), Header (`layout`), a `<main>` content area with the page slot, and Footer (`layout`).

It SHALL accept `title`, `description`, an optional `image` for SEO, a `size` prop (`default` at 720px, `wide` at 960px, `full` at 1120px), and an optional CSS class.

Page size conventions:
- Home: full
- About, Resume, Services, Blog Index: wide
- Blog Year, Tags Index, Tag, 404: default

#### Scenario: Render default layout
- **WHEN** PageLayout is rendered with `size="default"`
- **THEN** the main content area is centered with a maximum width of 720px

#### Scenario: Render wide layout
- **WHEN** PageLayout is rendered with `size="wide"`
- **THEN** the main content area is centered with a maximum width of 960px

#### Scenario: Render full layout
- **WHEN** PageLayout is rendered with `size="full"`
- **THEN** the main content area is centered with a maximum width of 1120px

### Requirement: PageHeader component
The system SHALL provide a PageHeader component at `src/components/pages/common/PageHeader/PageHeader.astro` that renders a page title section. It SHALL accept a required `title`, optional `subtitle` (muted styling), optional `description`, and a default slot for additional content below.

#### Scenario: Render with title only
- **WHEN** PageHeader is rendered with only a title
- **THEN** it displays the title as an `<h1>` with bottom margin

#### Scenario: Render with subtitle and description
- **WHEN** PageHeader is rendered with title, subtitle, and description
- **THEN** it displays the title, subtitle in muted text, and description below

### Requirement: SectionHeader component
The system SHALL provide a SectionHeader component at `src/components/pages/common/SectionHeader/SectionHeader.astro` that renders a section heading with an optional icon. It SHALL accept a required `title` and an `icon` slot displayed inline before the title.

#### Scenario: Render section header with icon
- **WHEN** SectionHeader is rendered with a title and an icon in the icon slot
- **THEN** it displays the icon and title inline as an `<h2>`

### Requirement: ContactCTA component
The system SHALL provide a ContactCTA component at `src/components/pages/common/ContactCTA/ContactCTA.astro` that renders a centered call-to-action section with a top border. It SHALL accept optional headline (default: "Want to work together?"), description, button text (default: "Get in Touch"), and button href (default: mailto link). It uses Button (`ui-primitives`) with inverse variant.

#### Scenario: Render default CTA
- **WHEN** ContactCTA is rendered without props
- **THEN** it displays "Want to work together?" headline with a "Get in Touch" mailto button

#### Scenario: Render custom CTA
- **WHEN** ContactCTA is rendered with custom headline and button text
- **THEN** it displays the custom headline and button text

### Requirement: ListSection component
The system SHALL provide a ListSection component at `src/components/pages/common/ListSection/ListSection.astro` that renders a section with an uppercase title header and optional horizontal rule line. It SHALL accept a required `title`, optional `showLine` (default: true), and a default slot for content.

#### Scenario: Render with line
- **WHEN** ListSection is rendered with a title and `showLine=true`
- **THEN** it displays an uppercase title followed by a horizontal rule and slot content

#### Scenario: Render without line
- **WHEN** ListSection is rendered with `showLine=false`
- **THEN** it displays the uppercase title without a horizontal rule

### Requirement: 404 error page
The system SHALL provide a 404 page at `src/pages/404.astro` using PageLayout with default size and centered text alignment. It SHALL display a 404 image, a themed title ("These are not the droids..."), and a description message.

#### Scenario: Render 404 page
- **WHEN** a user navigates to a non-existent URL
- **THEN** the 404 page displays with the error image, title, and description centered on the page
