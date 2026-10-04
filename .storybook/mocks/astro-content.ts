// Mock for astro:content in Storybook
export async function getCollection(name: string) {
  if (name === "blog") {
    return [
      {
        id: "2025/sandboxing-ai-agents-with-devcontainers",
        slug: "2025/sandboxing-ai-agents-with-devcontainers",
        data: {
          title: "Sandboxing AI Agents with Dev Containers",
          synopsis: "Learn how to set up secure dev containers for AI agents.",
          pubDate: new Date("2025-12-30"),
          updatedDate: new Date("2026-01-02"),
        },
      },
      {
        id: "2026/01/agent-instructions-and-commands",
        slug: "2026/01/agent-instructions-and-commands",
        data: {
          title: "Project Instructions and Reusable Commands",
          synopsis:
            "Best practices for organizing Claude Code commands and CLAUDE.md.",
          pubDate: new Date("2026-01-02"),
          updatedDate: new Date("2026-01-02"),
        },
      },
      {
        id: "2026/01/spec-driven-development",
        slug: "2026/01/spec-driven-development",
        data: {
          title: "Spec-Driven Development (SDD) for AI Coding Agents",
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
