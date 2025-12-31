# Blog Year

`src/pages/blog/[year].astro` - Posts by year archive.

URL: `/blog/{year}` (dynamic)

Layout: PageLayout (size="default")

Static Paths: generates page for each unique year from blog posts

Data: `year`=from params, `posts`=filtered by year, sorted desc

Content: Year title (h1), ArticleCard list

Uses: PageLayout, ArticleCard
