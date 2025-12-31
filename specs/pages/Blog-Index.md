# Blog Index

`src/pages/blog/index.astro` - Blog listing page.

URL: `/blog`

## Data

- `posts`: all blog posts sorted by date (desc)
- `featuredPost`: posts[0]
- `otherPosts`: posts.slice(1)

## Layout

Header → Page Header → Featured Post → All Posts → Footer

## Sections

**Page Header**: title, description

**Featured Post**: 2-col grid (md+), hero image, title, synopsis, date, tags

**All Posts**: vertical list of ArticleCard components

## Components

Uses: BaseHead, Header, Footer, ArticleCard, FormattedDate, Synopsis, Tag
