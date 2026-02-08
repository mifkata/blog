# Frontend Testing

Unit + Integration + E2E + Storybook.

## Stack

- Unit/Integration: Vitest + React Testing Library
- E2E: Playwright
- Visual: Storybook

## Structure

```
src/components/ArticleCard/
  ArticleCard.astro
  ArticleCard.test.tsx      # Unit
  ArticleCard.stories.tsx   # Storybook
test/e2e/
  blog.spec.ts
  home.spec.ts
```

## Unit Tests

- Co-locate: `<Component>.test.tsx`
- Test: props, clicks, conditionals, callbacks

## E2E Tests

- Location: `test/e2e/<feature>.spec.ts`

## Storybook

- Location: `<Component>.stories.tsx`
- Document: all props, states, themes, edge cases
- Compact similar stories into one with controls
- Add `tags: ["autodocs"]`
- Inject runtime JS using story `decorators`

## Commands

- `pnpm test` - unit/integration
- `pnpm e2e` - playwright
- `pnpm storybook` - dev server

## Checklist

- Component: unit test + story
- Page: integration test + e2e + all related components covered
- Feature: happy path, errors, loading, empty
