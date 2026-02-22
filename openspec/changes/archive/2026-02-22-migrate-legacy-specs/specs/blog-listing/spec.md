## ADDED Requirements

### Requirement: Blog index page
The system SHALL provide a Blog Index page at `src/pages/blog/index.astro` at URL `/blog` using PageLayout (`common-sections`) with wide size. It SHALL load all blog posts sorted by date descending, designate the first post as the featured post, and display the rest below. It SHALL render: a PageHeader (`common-sections`) with title and description, a FeaturedPost component for the latest post, and a PostsList component for all remaining posts.

#### Scenario: Render blog index
- **WHEN** a user navigates to `/blog`
- **THEN** the page displays a page header, the latest post as a featured card, and remaining posts as an article list

### Requirement: Blog year archive page
The system SHALL provide a Blog Year page at `src/pages/blog/[year].astro` at URL `/blog/{year}` (dynamic) using PageLayout (`common-sections`) with default size. It SHALL generate static paths for each unique year found in blog posts. It SHALL filter posts by the year parameter, sort descending, and display a year title as `<h1>` followed by an ArticleCard (`blog-post`) list.

#### Scenario: Render year archive
- **WHEN** a user navigates to `/blog/2025`
- **THEN** the page displays "2025" as heading and lists all posts from that year

### Requirement: Tags index page
The system SHALL provide a Tags Index page at `src/pages/tags/index.astro` at URL `/tags` using PageLayout (`common-sections`) with default size. It SHALL load all posts, compute tag counts, sort tags alphabetically, and load tag metadata from `tags.json`. It SHALL display a title and a list of tags with their post counts and optional descriptions.

#### Scenario: Render tags index
- **WHEN** a user navigates to `/tags`
- **THEN** the page displays an alphabetical list of all tags with their post counts

### Requirement: Tag page
The system SHALL provide a Tag page at `src/pages/tags/[tag].astro` at URL `/tags/{tag}` (dynamic) using PageLayout (`common-sections`) with default size. It SHALL generate static paths for each unique tag. It SHALL load tag metadata from `tags.json` for the title and description, filter posts by the tag, sort descending, and display a title, optional description, and an ArticleCard (`blog-post`) list.

#### Scenario: Render tag page
- **WHEN** a user navigates to `/tags/javascript`
- **THEN** the page displays the tag title, optional description, and all posts tagged with "javascript"

### Requirement: FeaturedPost component
The system SHALL provide a FeaturedPost component at `src/components/pages/blog/FeaturedPost/FeaturedPost.astro` that renders a large featured blog post card. It SHALL accept a required `post` entry. It SHALL display a 2-column grid layout: left side with a "Latest post" label, linked title, and hero image (with hover shadow and opacity effects); right side with a "Published at" label, formatted date (using FormattedDate from `ui-primitives`), tags (using Tag from `ui-primitives`), markdown synopsis, and a "Read more" link.

#### Scenario: Render featured post with hero image
- **WHEN** FeaturedPost renders with a post that has a hero image
- **THEN** it displays the hero image on the left with title, and metadata/synopsis on the right

#### Scenario: Hover effect on featured post
- **WHEN** a user hovers over the featured post's image
- **THEN** the image gains a shadow and adjusts opacity

### Requirement: PostsList component
The system SHALL provide a PostsList component at `src/components/pages/blog/PostsList/PostsList.astro` that renders a list of blog posts using ArticleCard (`blog-post`) components. It SHALL accept a required `posts` array, optional `title` (default: "All Posts"), and optional `showHeader` (default: true). When header is shown, it displays an uppercase `<h3>` title with a horizontal rule above the article list.

#### Scenario: Render posts list with header
- **WHEN** PostsList renders with posts and `showHeader=true`
- **THEN** it displays the "All Posts" header followed by ArticleCard entries

#### Scenario: Render posts list without header
- **WHEN** PostsList renders with `showHeader=false`
- **THEN** it displays ArticleCard entries without a title header
