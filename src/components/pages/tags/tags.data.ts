const post = (
  id: string,
  title: string,
  date: string,
  tags: string[],
  description: string,
) => ({ id, title, date: new Date(`${date}T00:00:00Z`), tags, description });

export const STORY_NOW = new Date("2026-11-13T00:00:00Z");

export const STORY_POSTS = [
  post(
    "2026/10/long-horizon-task-management-with-beads",
    "Long horizon task management with Beads",
    "2026-11-05",
    ["workflow", "devex", "architecture", "dag", "sdd"],
    "Tracking long-running agent work as a graph of small, dependent tasks.",
  ),
  post(
    "2026/10/writing-efficient-skills-for-llm-agents",
    "Tips for writing efficient skills for LLM agents",
    "2026-10-02",
    ["ai", "agents", "devex", "skills", "sdd"],
    "How to plan and write skills that regulate how coding agents work.",
  ),
  post(
    "2026/09/must-have-tools-for-leaner-ai-agent-context",
    "3 must-have tools for a leaner AI agent context",
    "2026-09-21",
    ["ai", "agents", "claude", "tools", "tokens", "workflow"],
    "Three tools that cut token spend and keep your coding agent focused.",
  ),
  post(
    "2026/02/the-rise-of-openclaw",
    "The rise of OpenClaw",
    "2026-02-04",
    ["ai", "agents", "openclaw"],
    "OpenClaw, the agentic sensation that took the world by storm in a matter of days.",
  ),
  post(
    "2026/01/system-prompts-and-skills",
    "System prompts and skills",
    "2026-01-02",
    ["ai", "agents", "workflow", "llm", "skills", "howto"],
    "The basics of having successful AGENTS.md and skills for agentic workflows.",
  ),
  post(
    "2025/sandboxing-ai-agents-with-devcontainers",
    "Sandboxing AI Agents with Dev Containers",
    "2025-12-30",
    ["coding", "ai", "devcontainers", "agents", "claude", "devex", "howto"],
    "Dev containers as a way to protect your data while working with AI coding agents.",
  ),
];

export const STORY_TAG_INFO = {
  agents: {
    title: "AI Agents",
    description:
      "Posts about AI coding agents: how they work, how to steer them and how to keep them in check.",
  },
  ai: {
    title: "Artificial Intelligence",
    description:
      "Posts about AI, machine learning, LLMs, and using them for creative purposes.",
  },
  workflow: {
    title: "Workflow",
    description: "Creating and orchestrating agentic workflows.",
  },
  dag: {
    title: "Task Graphs",
    description:
      "Directed acyclic graphs for planning and tracking dependent work.",
  },
};
