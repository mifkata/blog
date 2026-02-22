# Blog Listing

Blog index, year archive, and tag pages for browsing posts.

## Blog Index

📁 Path: `src/pages/blog/index.astro`
📍 Route: `/blog`
📐 Layout: PageLayout — wide

### Data
- `posts` — all posts sorted descending
- `featuredPost` — posts[0]
- `otherPosts` — posts.slice(1)

### Sections
1. PageHeader — title + description
2. FeaturedPost — latest post as featured card
3. PostsList — remaining posts as article list

### Dependencies
- Uses: PageLayout (`common-sections`), PageHeader (`common-sections`), ArticleCard (`blog-post`), FormattedDate (`ui-primitives`), Tag (`ui-primitives`)

## Blog Year Archive

📁 Path: `src/pages/blog/[year].astro`
📍 Route: `/blog/{year}` (dynamic)
📐 Layout: PageLayout — default

### Static Paths
- Generates a page for each unique year from blog posts

### Data
- `year` — from URL params
- `posts` — filtered by year, sorted descending

### Content
- Year title as `<h1>` + ArticleCard list

### Dependencies
- Uses: PageLayout (`common-sections`), ArticleCard (`blog-post`)

## Tags Index

📁 Path: `src/pages/tags/index.astro`
📍 Route: `/tags`
📐 Layout: PageLayout — default

### Data
- `posts` — all posts
- `tagCounts` — tag → count map
- `tags` — sorted entries
- `tagsInfo` — metadata from `tags.json`

### Content
- Title as `<h1>` + tag list with counts and optional descriptions

### Dependencies
- Uses: PageLayout (`common-sections`), Tag (`ui-primitives`)

## Tag Page

📁 Path: `src/pages/tags/[tag].astro`
📍 Route: `/tags/{tag}` (dynamic)
📐 Layout: PageLayout — default

### Static Paths
- Generates a page for each unique tag

### Data
- `tag` — from URL params
- `posts` — posts with tag, sorted descending
- `tagInfo` — from `tags.json` (title, description)

### Content
- Tag title as `<h1>` + optional description + ArticleCard list

### Dependencies
- Uses: PageLayout (`common-sections`), ArticleCard (`blog-post`)

## FeaturedPost

📁 Path: `src/components/pages/blog/FeaturedPost/FeaturedPost.astro`

Large featured blog post card for the blog index.

### Props
- `post` — blog post entry (required)

### Layout (2-column grid)
- Left: "Latest post" label + linked title + hero image
- Right: "Published at" label + date + tags + synopsis + "Read more" link
- Hover: hero image gains shadow and adjusts opacity

### Dependencies
- Uses: FormattedDate (`ui-primitives`), Tag (`ui-primitives`), Markdown (`blog-post`)

## PostsList

📁 Path: `src/components/pages/blog/PostsList/PostsList.astro`

Blog posts list section using ArticleCard components.

### Props
- `posts` — blog post array (required)
- `title?` — section title (default: "All Posts")
- `showHeader?` — show title header (default: true)

### Layout
- Optional header: uppercase `<h3>` title + horizontal rule
- List of ArticleCard entries

### Dependencies
- Uses: ArticleCard (`blog-post`)
