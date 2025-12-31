# Blog Year

`src/pages/blog/[year].astro` - Posts by year archive.

URL: `/blog/{year}` (dynamic)

## Data

- `year`: from params
- `posts`: posts filtered by year, sorted by date (desc)

## Static Paths

Generates pages for each unique year from blog posts

## Layout

Header → Container → Year Title → Post List → Footer

## Components

Uses: BaseHead, Header, Footer, Container, ArticleCard
