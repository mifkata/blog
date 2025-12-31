# Comments

`src/components/post/Comments/Comments.astro` - Giscus comments integration.

Props: `class?: string`

Output: section with "Comments" heading + Giscus widget (80% width centered)

Config: uses env vars `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID`

Visual: `mt-16 pt-8 border-t`, mapping: pathname, theme: light
