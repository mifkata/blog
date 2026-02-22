## Context

The project has 51 spec files under `/specs/` organized by component type (`components/layout/`, `components/pages/home/`, `pages/`, etc.). These specs predate OpenSpec and follow a CSS-class-heavy, implementation-focused format with sections like Props, Output, Visual (containing raw Tailwind classes), and Dependencies.

Current state:
- 51 files across 10 subdirectories, invisible to `openspec` commands
- Specs reference each other by component name only (e.g., "Dependencies: Button, FormattedDate") with no paths or capability grouping
- Format is technical — describes exact CSS classes (`sticky top-0 z-50 bg-white shadow-sm`) rather than visual behavior
- No capability-level overview — each component is documented in isolation

Target state: ~11 capability specs under `openspec/specs/<capability>/spec.md`, visible to all `openspec` tooling, using human-friendly format per CLAUDE.md rules.

## Goals / Non-Goals

**Goals:**
- Consolidate 51 component-level specs into ~11 capability-level specs under `openspec/specs/`
- Make all specs visible to `openspec list --specs`, `openspec show`, `openspec validate`
- Reformat content to human-friendly visual descriptions (per CLAUDE.md: prefer visual descriptions over code snippets or class names)
- Preserve all meaningful behavioral and structural information
- Establish cross-references between capability specs where components have dependencies across capabilities

**Non-Goals:**
- No code changes — this is spec-only migration
- No content invention — only reformatting and consolidating existing spec content
- No changes to OpenSpec tooling or configuration
- No refactoring of actual component file structure (specs describe the existing code as-is)

## Decisions

### 1. Consolidation strategy: merge into capability-level sections

Group related component specs into a single capability spec with sections per component. Each capability spec gets an overview section describing the capability as a whole, followed by component sections.

**Why**: Component-level specs are too granular for capability tracking. A page like Home has 5 component specs that only make sense together. Capability-level specs match how OpenSpec manages changes.

**Alternative considered**: Keep one spec per component in `openspec/specs/<component>/spec.md` — rejected because it would create 51 spec directories, defeating the consolidation purpose.

### 2. Capability grouping (11 groups)

| Capability | Source specs | Count |
|---|---|---|
| `layout` | BaseHead, Header, HeaderLink, Footer, GoogleAnalytics | 5 |
| `home-page` | Home page + HomeHero, HomeTerminal, RecentPosts, FeaturedSeries, CurrentlyReading | 6 |
| `about-page` | About page + AboutHero, AboutSection, QuirksList | 4 |
| `blog-listing` | Blog-Index, Blog-Year, Tags-Index, Tag page + FeaturedPost, PostsList | 6 |
| `blog-post` | Blog-Slug, BlogPostLayout + ArticleCard, ArticleSeries, PostCard, Markdown, Highlight, CodeCopyButton, ClaudeCommand, GithubLink, LabeledImage, WrapText, RedditEmbed, Comments | 14 |
| `resume-page` | Resume page + ExperienceTimeline, SkillsGrid, EarlyCareer | 4 |
| `services-page` | Services page + ServicesGrid, ReasonsGrid, ClientList | 4 |
| `ui-primitives` | Button, Container, FormattedDate, Tag | 4 |
| `common-sections` | PageHeader, SectionHeader, ContactCTA, ListSection, PageLayout | 5 |
| `helpers` | series helper | 1 |
| `testing` | Testing spec | 1 |

**Why**: Groups match natural page/feature boundaries. Pages and their components belong together. Shared components (ui-primitives, common-sections) get their own capabilities since they cross page boundaries.

**Alternative considered**: Group by technical layer (all pages together, all components together) — rejected because it loses the page-context relationship that makes specs useful.

### 3. Format shift: visual descriptions over CSS classes

Transform implementation-heavy descriptions into human-friendly visual descriptions.

Example transformation:
- **Before**: `sticky top-0 z-50 bg-white shadow-sm`, `inline-flex gap-2 px-4 py-2 rounded`
- **After**: "Sticky header with white background and subtle shadow", "Rounded inline button with icon support"

Retain file paths (e.g., `src/components/ui/Button/Button.astro`) as references. Keep prop interfaces since they document the component API. Drop raw CSS class lists.

**Why**: CLAUDE.md explicitly requires "human-friendly; easy-to-read; prefer visual descriptions over code snippets or class names."

### 4. Directory naming: lowercase-kebab-case

Directories follow `openspec/specs/<capability>/spec.md` with lowercase-kebab-case capability names (e.g., `home-page`, `blog-post`, `ui-primitives`).

**Why**: Matches CLAUDE.md convention ("Capitalised-Kebab-Case.md" for filenames, but OpenSpec uses directory-based organization with `spec.md` as the leaf file). Lowercase directories are conventional for OpenSpec.

### 5. Cross-capability references

When a component in one capability depends on a component in another (e.g., HomeHero depends on Button from ui-primitives), reference it as: "Uses: Button (`ui-primitives`)".

**Why**: Preserves the dependency information from legacy specs while linking to the new capability structure. Enables tracing impact when a shared component changes.

### 6. 404 page placement

The `404.md` page spec goes into `common-sections` since it's a standalone utility page that uses the shared PageLayout, similar to other common sections.

**Why**: It doesn't belong to any specific feature page group and is too small for its own capability.

## Risks / Trade-offs

**Information loss during format conversion** → Mitigate by reviewing each legacy spec during migration and verifying no behavioral detail is dropped. Accept that exact CSS class values are intentionally excluded (they live in the code, not specs).

**Stale references in CLAUDE.md** → CLAUDE.md references `specs/` paths in the spec location section. Update these references as a final step after migration. Include this in the tasks artifact.

**Large `blog-post` capability spec** → 14 source specs consolidated into one file may be long. Mitigate by keeping component sections concise (overview + props + visual behavior, no implementation detail). If too large, consider splitting into `blog-post` (layout/page) and `blog-post-components` (content widgets).

**Testing spec is cross-cutting** → The Testing spec covers conventions for all capabilities, not just one. Keep it as its own capability (`testing`) since it describes project-wide testing strategy rather than a single feature.

## Migration Plan

### Phase 1: Independent capabilities (no cross-dependencies to resolve)

1. `helpers` — smallest, single file, good for validating the process
2. `testing` — standalone, cross-cutting
3. `ui-primitives` — shared components referenced by many others

### Phase 2: Page capabilities (depend on ui-primitives and common-sections)

4. `common-sections` — shared page sections
5. `layout` — site-wide structure
6. `about-page`
7. `resume-page`
8. `services-page`
9. `home-page`
10. `blog-listing`
11. `blog-post` — largest, migrate last

### Phase 3: Cleanup

12. Update CLAUDE.md spec location references
13. Remove `/specs/` directory
14. Run `openspec validate` on all new specs
15. Run `openspec list --specs` to verify all 11 capabilities are visible

### Verification per capability

- All source spec content accounted for (no behavioral detail lost)
- File paths to source code are correct
- Cross-capability references use the new capability names
- `openspec show <capability>` works correctly

## Open Questions

1. **Preserve legacy specs as archive?** Should we keep `/specs/` as a git-history-only archive, or delete it entirely? Recommendation: delete entirely — git history preserves the old content if ever needed.

2. **Testing spec scope**: The current Testing spec references Astro-specific patterns. If the project grows beyond Astro, should Testing be split per-app? Recommendation: keep as single `testing` capability for now; split later if needed.

3. **blog-post size threshold**: At what point should `blog-post` be split into sub-capabilities? Recommendation: migrate as one spec first, split only if it exceeds ~150 lines.
