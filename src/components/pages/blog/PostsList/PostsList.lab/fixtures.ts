import type { ImageMetadata } from "astro";
import devcontainers from "@/assets/blog/2025/1230-devcontainers.png";
import openclaw from "@/assets/blog/2026/0204-the-openclaw-invasion.png";
import tools from "@/assets/blog/2026/0921-must-have-tools-for-leaner-ai-agent-context.png";
import vibeCoding from "@/assets/blog/2025/1201-ai-agents.png";

export type LabPost = {
  id: string;
  data: {
    title: string;
    synopsis?: string;
    description: string;
    pubDate: Date | string;
    heroImage: ImageMetadata;
    tags: string[];
  };
};

export const posts: LabPost[] = [
  {
    id: "2026/09/must-have-tools-for-leaner-ai-agent-context",
    data: {
      title: "3 must-have tools for a leaner AI agent context",
      synopsis:
        "Organising your AI workflow is no longer just about putting the chaos in order, it directly impacts your AI costs. Every command your agent runs and every file it reads ends up in the context window, and the bigger that window grows, the more you pay and the less focused the agent becomes.\n\nThis article looks at three tools I run in my local dev setup to fight that - one for trimming shell output, one for compressing context and one for giving the agent a memory that outlives the session. It also covers where context compression falls short, when running **Claude Code** through a proxy.",
      description: "",
      pubDate: "2026-09-21",
      heroImage: tools,
      tags: ["ai", "agents", "claude", "tools"],
    },
  },
  {
    id: "2026/02/the-rise-of-openclaw",
    data: {
      title: "The rise of OpenClaw",
      synopsis:
        "Optimising one's workflow with agents is no easy task to grasp. You constantly want to improve on it and organise it in a way to reduce noise, which is quite a lot.\n\nHow do we manage that chaos of specs, instructions, skills, commands, cross-agent workflows, etc.? [OpenClaw](https://openclaw.ai/) comes to the rescue. And then there's the [Social Network for AI agents](https://www.moltbook.com/).",
      description: "",
      pubDate: "2026-02-04",
      heroImage: openclaw,
      tags: ["ai", "agents", "openclaw"],
    },
  },
  {
    id: "2025/sandboxing-ai-agents-with-devcontainers",
    data: {
      title: "Sandboxing AI Agents with Dev Containers",
      synopsis:
        "Coding agents run shell commands with your user's privileges, whether it's **Claude Code**, **Codex** or an open-source harness like **OpenCode** running against your own models. Their own guardrails have come a long way, but a prompt injection hidden in an open-source package can still turn the agent against your machine. Agents belong in a sandbox, especially when you run a swarm of them.\n\nThis article shows how I sandbox mine in a dev container: the agent works on the project inside the container, the host keeps the git credentials, and notifications get out through a single whitelisted command. One trade-off up front: containers are slower on macOS and Windows, where they run inside a virtual machine with limited access to the bare metal.",
      description: "",
      pubDate: "2025-12-30",
      heroImage: devcontainers,
      tags: ["coding", "ai", "devcontainers"],
    },
  },
  {
    id: "2025/vibe-coding-with-ai-agents",
    data: {
      title: "The unavoidable present of vibe coding",
      synopsis:
        "My AI-powered coding workflow with Claude Code, Copilot and ChatGPT.",
      description: "",
      pubDate: "2025-12-01",
      heroImage: vibeCoding,
      tags: ["ai", "productivity", "coding"],
    },
  },
];
