# Tag

`src/pages/tags/[tag].astro` - Posts by tag page.

URL: `/tags/{tag}` (dynamic)

## Data

- `tag`: from params
- `posts`: posts with tag, sorted by date (desc)
- `tagInfo`: from `@/data/tags.json` (title, description)
- `pageTitle`: tagInfo.title or tag
- `pageDescription`: tagInfo.description or default

## Static Paths

Generates page for each unique tag from blog posts

## Layout

Header → Container → Title + Description → Post List → Footer

## Components

Uses: BaseHead, Header, Footer, Container, ArticleCard
