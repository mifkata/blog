## ADDED Requirements

### Requirement: Unit and integration test conventions
The system SHALL use Vitest with React Testing Library for unit and integration tests. Test files SHALL be co-located with their component at `<Component>.test.tsx`. Tests SHALL cover props, click interactions, conditional rendering, and callbacks.

#### Scenario: Component has unit test
- **WHEN** a new component is created
- **THEN** a co-located `<Component>.test.tsx` file SHALL exist testing its props, interactions, and conditional rendering

#### Scenario: Run unit tests
- **WHEN** `pnpm test` is executed
- **THEN** all Vitest unit and integration tests run and report results

### Requirement: End-to-end test conventions
The system SHALL use Playwright for end-to-end tests. E2E test files SHALL be located at `test/e2e/<feature>.spec.ts`. Tests SHALL cover happy paths, error states, loading states, and empty states.

#### Scenario: Page has E2E coverage
- **WHEN** a page feature is implemented
- **THEN** a corresponding `test/e2e/<feature>.spec.ts` file SHALL exist with scenario coverage

#### Scenario: Run E2E tests
- **WHEN** `pnpm e2e` is executed
- **THEN** all Playwright E2E tests run against the application

### Requirement: Storybook visual documentation
The system SHALL use Storybook for visual component documentation. Story files SHALL be co-located at `<Component>.stories.tsx`. Stories SHALL document all props, states, themes, and edge cases. Similar stories SHALL be compacted into one story with controls. Stories SHALL include `tags: ["autodocs"]` and use decorators for runtime JavaScript injection.

#### Scenario: Component has Storybook story
- **WHEN** a new component is created
- **THEN** a co-located `<Component>.stories.tsx` file SHALL exist documenting all variants and edge cases

#### Scenario: Run Storybook
- **WHEN** `pnpm storybook` is executed
- **THEN** a Storybook dev server launches with all component stories

### Requirement: Test coverage checklist
Every component SHALL have a unit test and a Storybook story. Every page SHALL have an integration test, E2E test, and coverage for all related components. Every feature SHALL cover happy path, error, loading, and empty states.

#### Scenario: Feature coverage verification
- **WHEN** a feature implementation is reviewed
- **THEN** it includes unit tests, integration tests, E2E tests, and Storybook stories as applicable to its scope
