# Tag

`src/pages/tags/[tag].astro` - Posts by tag page.

URL: `/tags/{tag}` (dynamic)

Layout: PageLayout (size="default")

Static Paths: generates page for each unique tag from blog posts

Data: `tag`=from params, `posts`=with tag sorted desc, `tagInfo`=from tags.json, `pageTitle`=tagInfo.title||tag, `pageDescription`=tagInfo.description||default

Content: Title (h1), optional description, ArticleCard list

Uses: PageLayout, ArticleCard
