import { describe, it, expect } from "vitest";

// Test URL generation logic extracted from component
function getCommandUrl(name: string, external: boolean): string {
  return external
    ? "https://code.claude.com/docs/en/slash-commands"
    : `https://github.com/mifkata/blog/blob/main/.claude/commands/${name}.md`;
}

function getCommandTitle(name: string, external: boolean): string {
  return external
    ? `View the official documentation for the /${name} command on Claude's website`
    : `View the source for the /${name} command on GitHub`;
}

describe("ClaudeCommand URL generation", () => {
  describe("internal commands", () => {
    it("generates GitHub URL for internal command", () => {
      const url = getCommandUrl("commit-message", false);
      expect(url).toBe(
        "https://github.com/mifkata/blog/blob/main/.claude/commands/commit-message.md",
      );
    });

    it("generates GitHub URL for spec commands", () => {
      const url = getCommandUrl("spec-create", false);
      expect(url).toBe(
        "https://github.com/mifkata/blog/blob/main/.claude/commands/spec-create.md",
      );
    });

    it("generates title for internal command", () => {
      const title = getCommandTitle("commit-message", false);
      expect(title).toBe(
        "View the source for the /commit-message command on GitHub",
      );
    });
  });

  describe("external commands", () => {
    it("generates Claude docs URL for external command", () => {
      const url = getCommandUrl("compact", true);
      expect(url).toBe("https://code.claude.com/docs/en/slash-commands");
    });

    it("generates same URL regardless of command name for external", () => {
      const url1 = getCommandUrl("help", true);
      const url2 = getCommandUrl("clear", true);
      expect(url1).toBe(url2);
    });

    it("generates title for external command", () => {
      const title = getCommandTitle("compact", true);
      expect(title).toBe(
        "View the official documentation for the /compact command on Claude's website",
      );
    });
  });

  describe("edge cases", () => {
    it("handles command names with hyphens", () => {
      const url = getCommandUrl("test-create", false);
      expect(url).toContain("test-create.md");
    });

    it("handles single word command names", () => {
      const url = getCommandUrl("help", false);
      expect(url).toContain("help.md");
    });
  });
});
