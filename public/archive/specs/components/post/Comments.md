# Comments

`src/components/post/Comments/Comments.astro` - Giscus comments integration.

## Props

- `class?: string`

## Output

- Section with "Comments" heading + Giscus widget (80% width centered)

## Config

- Uses env vars: `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID`

## Visual

- `mt-16 pt-8 border-t`
- Mapping: pathname
- Theme: light
