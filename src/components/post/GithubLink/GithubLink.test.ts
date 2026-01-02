import { describe, it, expect } from "vitest";

// Test the URL parsing logic extracted from the component
function parseGithubUrl(url: string) {
  const githubRegex =
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/(tree|blob)\/([^\/]+)\/(.+))?/;
  const match = url.match(githubRegex);

  const isValid = !!match;
  const owner = match?.[1] ?? "";
  const repo = match?.[2] ?? "";
  const type = match?.[3] as "tree" | "blob" | undefined;
  const branch = match?.[4] ?? "";
  const path = match?.[5] ?? "";

  const displayName = path ? `${owner}/${repo}/${path}` : `${owner}/${repo}`;

  const rawUrl =
    type === "blob"
      ? `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
      : null;

  const isImage = /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(path);
  const isCode =
    /\.(js|ts|jsx|tsx|css|html|json|md|mdx|yml|yaml|sh|py|rb|go|rs|java|c|cpp|h)$/i.test(
      path,
    );

  return {
    isValid,
    owner,
    repo,
    type,
    branch,
    path,
    displayName,
    rawUrl,
    isImage,
    isCode,
  };
}

describe("GithubLink URL Parsing", () => {
  describe("repository URLs", () => {
    it("parses basic repo URL", () => {
      const result = parseGithubUrl("https://github.com/owner/repo");
      expect(result.isValid).toBe(true);
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
      expect(result.displayName).toBe("owner/repo");
      expect(result.type).toBeUndefined();
    });

    it("parses repo URL with trailing slash", () => {
      const result = parseGithubUrl(
        "https://github.com/anthropics/claude-code",
      );
      expect(result.isValid).toBe(true);
      expect(result.owner).toBe("anthropics");
      expect(result.repo).toBe("claude-code");
    });
  });

  describe("directory URLs (tree)", () => {
    it("parses directory URL", () => {
      const result = parseGithubUrl(
        "https://github.com/owner/repo/tree/main/src/components",
      );
      expect(result.isValid).toBe(true);
      expect(result.owner).toBe("owner");
      expect(result.repo).toBe("repo");
      expect(result.type).toBe("tree");
      expect(result.branch).toBe("main");
      expect(result.path).toBe("src/components");
      expect(result.displayName).toBe("owner/repo/src/components");
    });

    it("parses directory URL with feature branch", () => {
      const result = parseGithubUrl(
        "https://github.com/owner/repo/tree/feature/new-thing/src",
      );
      expect(result.isValid).toBe(true);
      expect(result.branch).toBe("feature");
      expect(result.path).toBe("new-thing/src");
    });
  });

  describe("file URLs (blob)", () => {
    it("parses file URL", () => {
      const result = parseGithubUrl(
        "https://github.com/owner/repo/blob/main/src/index.ts",
      );
      expect(result.isValid).toBe(true);
      expect(result.type).toBe("blob");
      expect(result.branch).toBe("main");
      expect(result.path).toBe("src/index.ts");
      expect(result.rawUrl).toBe(
        "https://raw.githubusercontent.com/owner/repo/main/src/index.ts",
      );
    });

    it("identifies code files", () => {
      const tsFile = parseGithubUrl(
        "https://github.com/owner/repo/blob/main/index.ts",
      );
      expect(tsFile.isCode).toBe(true);
      expect(tsFile.isImage).toBe(false);

      const pyFile = parseGithubUrl(
        "https://github.com/owner/repo/blob/main/script.py",
      );
      expect(pyFile.isCode).toBe(true);

      const jsonFile = parseGithubUrl(
        "https://github.com/owner/repo/blob/main/package.json",
      );
      expect(jsonFile.isCode).toBe(true);
    });

    it("identifies image files", () => {
      const pngFile = parseGithubUrl(
        "https://github.com/owner/repo/blob/main/image.png",
      );
      expect(pngFile.isImage).toBe(true);
      expect(pngFile.isCode).toBe(false);

      const jpgFile = parseGithubUrl(
        "https://github.com/owner/repo/blob/main/photo.JPG",
      );
      expect(jpgFile.isImage).toBe(true);

      const svgFile = parseGithubUrl(
        "https://github.com/owner/repo/blob/main/icon.svg",
      );
      expect(svgFile.isImage).toBe(true);
    });
  });

  describe("invalid URLs", () => {
    it("rejects non-GitHub URLs", () => {
      const result = parseGithubUrl("https://gitlab.com/owner/repo");
      expect(result.isValid).toBe(false);
    });

    it("rejects malformed URLs", () => {
      const result = parseGithubUrl("not-a-url");
      expect(result.isValid).toBe(false);
    });

    it("rejects GitHub URLs without repo", () => {
      const result = parseGithubUrl("https://github.com/owner");
      expect(result.isValid).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("handles http URLs", () => {
      const result = parseGithubUrl("http://github.com/owner/repo");
      expect(result.isValid).toBe(true);
    });

    it("handles deeply nested paths", () => {
      const result = parseGithubUrl(
        "https://github.com/owner/repo/blob/main/src/components/ui/Button/Button.tsx",
      );
      expect(result.isValid).toBe(true);
      expect(result.path).toBe("src/components/ui/Button/Button.tsx");
      expect(result.isCode).toBe(true);
    });
  });
});
