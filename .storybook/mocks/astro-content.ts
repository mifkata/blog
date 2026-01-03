// Mock for astro:content in Storybook
export async function getCollection(name: string) {
  if (name === "blog") {
    return [
      {
        id: "2025/claude-code-devcontainers",
        slug: "2025/claude-code-devcontainers",
        data: {
          title: "Claude Code: Dev Containers",
          synopsis: "Learn how to set up secure dev containers for AI agents.",
          pubDate: new Date("2025-12-30"),
          updatedDate: new Date("2026-01-02"),
        },
      },
      {
        id: "2026/01/claude-code-system-prompting-and-commands",
        slug: "2026/01/claude-code-system-prompting-and-commands",
        data: {
          title: "Claude Code: System Prompting and Commands",
          synopsis:
            "Best practices for organizing Claude Code commands and CLAUDE.md.",
          pubDate: new Date("2026-01-02"),
          updatedDate: new Date("2026-01-02"),
        },
      },
      {
        id: "2026/01/claude-code-spec-driven-development",
        slug: "2026/01/claude-code-spec-driven-development",
        data: {
          title: "Claude Code: Spec-Driven Development",
          synopsis:
            "Working with specs to maintain organized AI-assisted development.",
          pubDate: new Date("2026-01-03"),
          updatedDate: new Date("2026-01-03"),
        },
      },
    ];
  }
  return [];
}
