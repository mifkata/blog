## ADDED Requirements

### Requirement: Series data loading
The system SHALL provide a `getSeriesWithPosts(slug)` helper at `src/helpers/series.ts` that loads blog series data from `src/data/series.json` and maps series items to their corresponding blog posts.

Each series entry in the JSON data SHALL contain a slug, title, description, optional hero image, an optional title-trim prefix, and an ordered list of post IDs.

The helper SHALL match each series item to a blog post by `post.id`, build the post URL as `/blog/{post.id}/`, and apply the trim prefix to shorten post titles when configured.

#### Scenario: Load a valid series by slug
- **WHEN** `getSeriesWithPosts("my-series")` is called with a slug that exists in `series.json`
- **THEN** the helper returns the series object with items enriched with post URLs and trimmed titles, preserving the original item order

#### Scenario: Series slug not found
- **WHEN** `getSeriesWithPosts("nonexistent")` is called with a slug not in `series.json`
- **THEN** the helper throws an error

#### Scenario: Trim prefix applied to titles
- **WHEN** a series has `trim: "Part N: "` configured
- **THEN** each post title has the matching prefix removed in the returned items
