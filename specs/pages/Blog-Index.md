# Blog Index

`src/pages/blog/index.astro` - Blog listing page.

## URL

- `/blog`

## Layout

- PageLayout (size="wide")

## Data

- `posts` = all sorted desc
- `featuredPost` = posts[0]
- `otherPosts` = posts.slice(1)

## Sections

- Page Header: title, description
- Featured Post: 2-col grid, hero image, title, synopsis, date, tags
- All Posts: ArticleCard list

## Dependencies

- PageLayout, ArticleCard, FormattedDate, synopsis → Markdown, Tag
