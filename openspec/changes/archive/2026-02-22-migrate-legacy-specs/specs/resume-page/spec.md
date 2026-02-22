## ADDED Requirements

### Requirement: Resume page structure
The system SHALL provide a Resume page at `src/pages/resume.astro` at URL `/resume` using PageLayout (`common-sections`) with wide size. It SHALL load skills (categorized tech skills), experience (job history with roles), and early career (2000-2010 summary) data. It SHALL render: a hero section with title and summary, SkillsGrid, ExperienceTimeline, EarlyCareer, and a ContactCTA (`common-sections`).

#### Scenario: Render resume page
- **WHEN** a user navigates to `/resume`
- **THEN** the page displays Hero, Skills, Experience, Early Career, and CTA sections in a wide layout

### Requirement: ExperienceTimeline component
The system SHALL provide an ExperienceTimeline component at `src/components/pages/resume/ExperienceTimeline/ExperienceTimeline.astro` that renders a vertical timeline of job experience. It SHALL accept a required `experience` array where each job has title, company, location, dates, optional current flag, description, optional nested roles, optional highlights, and optional tech tags.

The timeline SHALL display a vertical left border with circle markers (accent-colored for current position). Each job renders as a card, with nested role cards when the job has multiple client roles.

#### Scenario: Render timeline with current job
- **WHEN** ExperienceTimeline renders with a job marked as `current: true`
- **THEN** that job's timeline marker displays in the accent color

#### Scenario: Render job with nested roles
- **WHEN** a job entry has a `roles` array
- **THEN** nested role cards render within the parent job card

### Requirement: SkillsGrid component
The system SHALL provide a SkillsGrid component at `src/components/pages/resume/SkillsGrid/SkillsGrid.astro` that renders a grid of technical skill categories. It SHALL accept a required `skills` array of groups, each with a name, icon identifier (server, layout, database, cloud, check, tool), and items list.

The grid SHALL display in 2 columns on mobile and 3 columns on desktop, with each group showing its mapped icon, category name, and skill items as tag pills.

#### Scenario: Render skills grid
- **WHEN** SkillsGrid renders with skill groups
- **THEN** it displays a responsive grid with icon, category name, and skill tags for each group

### Requirement: EarlyCareer component
The system SHALL provide an EarlyCareer component at `src/components/pages/resume/EarlyCareer/EarlyCareer.astro` that renders a summary section for early career history. It SHALL accept a required `period` string, `description` string, and `companies` string array.

It renders as a timeline item with a circle marker, an "Early Career" heading, the period, description text, and company names as tag pills.

#### Scenario: Render early career section
- **WHEN** EarlyCareer renders with period, description, and companies
- **THEN** it displays a timeline-style card with the period label, description, and company name pills
