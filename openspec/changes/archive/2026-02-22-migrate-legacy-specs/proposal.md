## Why

The project has 51 spec files under `/specs/` using a flat, file-per-component structure that predates OpenSpec. These specs are invisible to `openspec` commands (`list`, `show`, `validate`, `status`), making them disconnected from the artifact-driven workflow. Migrating them into `openspec/specs/` brings them under unified management, enables change tracking against specs, and eliminates the legacy `/specs/` directory.

## What Changes

- Reorganize 51 legacy spec files from `/specs/` into `openspec/specs/<capability>/spec.md` grouped by capability
- Consolidate related component specs into single capability specs (e.g., all home page components → `home-page/spec.md`)
- Reformat specs to match OpenSpec conventions (structured sections, human-friendly format per CLAUDE.md rules)
- Remove the legacy `/specs/` directory after migration
- **BREAKING**: Any tooling or references pointing to `/specs/*.md` paths will need updating

## Capabilities

### New Capabilities

- `layout`: Site-wide layout components — BaseHead, Header, Footer, HeaderLink, GoogleAnalytics
- `home-page`: Home page — HomeHero, HomeTerminal, RecentPosts, FeaturedSeries, CurrentlyReading
- `about-page`: About page — AboutHero, AboutSection, QuirksList
- `blog-listing`: Blog index, year archive, tag pages — Blog-Index, Blog-Year, Tags-Index, Tag, FeaturedPost, PostsList
- `blog-post`: Individual blog post — BlogPostLayout, Blog-Slug, article content components (ArticleCard, ArticleSeries, PostCard, Markdown, Highlight, CodeCopyButton, ClaudeCommand, GithubLink, LabeledImage, WrapText, RedditEmbed, Comments)
- `resume-page`: Resume page — ExperienceTimeline, SkillsGrid, EarlyCareer
- `services-page`: Services page — ServicesGrid, ReasonsGrid, ClientList
- `ui-primitives`: Shared UI components — Button, Container, FormattedDate, Tag
- `common-sections`: Reusable page sections — PageHeader, SectionHeader, ContactCTA, ListSection, PageLayout
- `helpers`: Utility modules — series helper
- `testing`: Testing strategy and conventions

### Modified Capabilities

_(none — all specs are being created fresh in the new location)_

## Impact

- **Specs**: 51 files consolidated into ~11 capability specs
- **Code**: No code changes — this is a spec-only migration
- **References**: CLAUDE.md spec location references may need updating
- **Workflow**: After migration, all spec operations go through `openspec` commands
