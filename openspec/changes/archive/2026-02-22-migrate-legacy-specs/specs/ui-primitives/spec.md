## ADDED Requirements

### Requirement: Button component
The system SHALL provide a Button component at `src/components/ui/Button/Button.astro` that renders a clickable action element. It SHALL accept an optional `href` (rendering as an anchor), a `variant` prop (`normal`, `inverse`, or `ghost`), and a default slot for content.

- Normal variant: light gradient background with brown text
- Inverse variant: orange gradient background with light text
- Ghost variant: transparent background with a border

On hover, the button SHALL lift slightly with a shadow transition.

#### Scenario: Render as link
- **WHEN** Button is rendered with `href="/blog"`
- **THEN** it renders as an `<a>` element linking to `/blog`

#### Scenario: Render normal variant
- **WHEN** Button is rendered without a variant or with `variant="normal"`
- **THEN** it displays with a light gradient background and brown text

#### Scenario: Render inverse variant
- **WHEN** Button is rendered with `variant="inverse"`
- **THEN** it displays with an orange gradient background and light text

#### Scenario: Render ghost variant
- **WHEN** Button is rendered with `variant="ghost"`
- **THEN** it displays with a transparent background and visible border

### Requirement: Container component
The system SHALL provide a Container component at `src/components/ui/Container/Container.astro` that renders a centered content wrapper as a `<main>` element. It SHALL accept a `size` prop (`default` or `wide`) controlling the max width: default is 720px, wide is 960px. It SHALL accept a default slot for page content.

#### Scenario: Render default size
- **WHEN** Container is rendered without a size prop
- **THEN** it centers content with a maximum width of 720px

#### Scenario: Render wide size
- **WHEN** Container is rendered with `size="wide"`
- **THEN** it centers content with a maximum width of 960px

### Requirement: FormattedDate component
The system SHALL provide a FormattedDate component at `src/components/ui/FormattedDate/FormattedDate.astro` that renders a `<time>` element with an ISO datetime attribute and a human-readable formatted date. It SHALL accept a `date` prop (Date, string, or number) and display it in US English short format (e.g., "Dec 30, 2025").

#### Scenario: Render a date
- **WHEN** FormattedDate is rendered with a valid date
- **THEN** it outputs a `<time>` element with `datetime` set to the ISO string and visible text in "Mon DD, YYYY" format

### Requirement: Tag component
The system SHALL provide a Tag component at `src/components/ui/Tag/Tag.astro` that renders a clickable tag link to `/tags/{tag}/`. It SHALL accept a `tag` string, an optional `variant` (`default` or `dark`), and spread HTML anchor attributes.

- Default variant: light gray background with dark text, hover changes to accent background with white text
- Dark variant: semi-transparent white background with white text, for use on dark backgrounds

#### Scenario: Render default tag
- **WHEN** Tag is rendered with `tag="javascript"`
- **THEN** it renders a link to `/tags/javascript/` with light gray background

#### Scenario: Render dark variant tag
- **WHEN** Tag is rendered with `tag="react"` and `variant="dark"`
- **THEN** it renders a link to `/tags/react/` with semi-transparent white styling suitable for dark backgrounds
