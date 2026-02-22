## 1. Phase 1 — Independent Capabilities

- [x] 1.1 Create `openspec/specs/helpers/spec.md` from `specs/helpers/series.md`
- [x] 1.2 Create `openspec/specs/testing/spec.md` from `specs/Testing.md`
- [x] 1.3 Create `openspec/specs/ui-primitives/spec.md` from `specs/components/ui/Button.md`, `Container.md`, `FormattedDate.md`, `Tag.md`

## 2. Phase 2 — Shared and Layout Capabilities

- [x] 2.1 Create `openspec/specs/common-sections/spec.md` from `specs/components/pages/common/` (PageHeader, SectionHeader, ContactCTA, ListSection), `specs/layouts/PageLayout.md`, and `specs/pages/404.md`
- [x] 2.2 Create `openspec/specs/layout/spec.md` from `specs/components/layout/` (BaseHead, Header, HeaderLink, Footer, GoogleAnalytics)

## 3. Phase 2 — Page Capabilities

- [x] 3.1 Create `openspec/specs/about-page/spec.md` from `specs/pages/About.md` and `specs/components/pages/about/` (AboutHero, AboutSection, QuirksList)
- [x] 3.2 Create `openspec/specs/resume-page/spec.md` from `specs/pages/Resume.md` and `specs/components/pages/resume/` (ExperienceTimeline, SkillsGrid, EarlyCareer)
- [x] 3.3 Create `openspec/specs/services-page/spec.md` from `specs/pages/Services.md` and `specs/components/pages/services/` (ServicesGrid, ReasonsGrid, ClientList)
- [x] 3.4 Create `openspec/specs/home-page/spec.md` from `specs/pages/Home.md` and `specs/components/pages/home/` (HomeHero, HomeTerminal, RecentPosts, FeaturedSeries, CurrentlyReading)
- [x] 3.5 Create `openspec/specs/blog-listing/spec.md` from `specs/pages/Blog-Index.md`, `Blog-Year.md`, `Tags-Index.md`, `Tag.md` and `specs/components/pages/blog/` (FeaturedPost, PostsList)
- [x] 3.6 Create `openspec/specs/blog-post/spec.md` from `specs/pages/Blog-Slug.md`, `specs/layouts/BlogPostLayout.md`, and `specs/components/post/` (ArticleCard, ArticleSeries, PostCard, Markdown, Highlight, CodeCopyButton, ClaudeCommand, GithubLink, LabeledImage, WrapText, RedditEmbed, Comments)

## 4. Phase 3 — Cleanup and Validation

- [x] 4.1 Update CLAUDE.md spec location references from `/specs/` to `openspec/specs/<capability>/spec.md`
- [x] 4.2 ~~Remove the legacy `/specs/` directory~~ — SKIPPED: keeping legacy specs for now
- [x] 4.3 Run `openspec list --specs` and verify all 11 capabilities are visible
- [ ] 4.4 Run `openspec validate` on each new capability spec — BLOCKED: specs use human-friendly format per CLAUDE.md but validator expects formal `## Purpose` / `## Requirements` / `### Requirement:` / `#### Scenario:` structure
