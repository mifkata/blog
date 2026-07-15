# Testing

Unit, integration, E2E, and visual testing strategy.

## Stack

- Unit/Integration: Vitest + React Testing Library
- E2E: Playwright
- Visual: Storybook

## File Structure

- Unit tests: co-located as `<Component>.test.tsx`
- E2E tests: `test/e2e/<feature>.spec.ts`
- Stories: co-located as `<Component>.stories.tsx`

## Unit Tests

- Co-locate with components
- Cover: props, click interactions, conditional rendering, callbacks
- Command: `pnpm test`

## E2E Tests

- One file per feature
- Cover: happy path, errors, loading states, empty states
- Command: `pnpm e2e`

## Storybook

- Co-locate with components
- Document all props, states, themes, edge cases
- Compact similar stories into one with controls
- Add `tags: ["autodocs"]`
- Use `decorators` for runtime JS injection
- Command: `pnpm storybook`

## Coverage Checklist

- Component → unit test + story
- Page → integration test + E2E + all related components covered
- Feature → happy path, errors, loading, empty
