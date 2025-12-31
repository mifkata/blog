# Tags Index

`src/pages/tags/index.astro` - All tags listing.

URL: `/tags`

## Data

- `posts`: all blog posts
- `tagCounts`: tag → count map from posts
- `tags`: sorted [tag, count] entries
- `tagsInfo`: from `@/data/tags.json` (title, description per tag)

## Layout

Header → Container → Title → Tag List → Footer

## Content

List of tags with count and optional description from tags.json

## Components

Uses: BaseHead, Header, Footer, Container, Tag
