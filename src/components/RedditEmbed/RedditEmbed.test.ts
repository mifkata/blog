import { describe, it, expect } from "vitest";

// Extract URL parsing logic for testing
function parseRedditUrl(url: string): {
  postId: string | null;
  embedUrl: string | null;
} {
  const match = url.match(/reddit\.com\/r\/[\w]+\/comments\/([\w]+)/);
  const postId = match ? match[1] : null;
  const embedUrl = postId
    ? `https://www.redditmedia.com/r/${url.split("/r/")[1]?.split("?")[0]}?ref_source=embed&ref=share&embed=true`
    : null;
  return { postId, embedUrl };
}

describe("parseRedditUrl", () => {
  it("should parse standard reddit URL", () => {
    const url =
      "https://www.reddit.com/r/programming/comments/abc123/my_post_title/";
    const result = parseRedditUrl(url);
    expect(result.postId).toBe("abc123");
    expect(result.embedUrl).toContain("redditmedia.com");
    expect(result.embedUrl).toContain("programming/comments/abc123");
  });

  it("should parse reddit URL without www", () => {
    const url = "https://reddit.com/r/javascript/comments/xyz789/title/";
    const result = parseRedditUrl(url);
    expect(result.postId).toBe("xyz789");
  });

  it("should parse reddit URL with query params", () => {
    const url =
      "https://www.reddit.com/r/webdev/comments/def456/title/?utm_source=share";
    const result = parseRedditUrl(url);
    expect(result.postId).toBe("def456");
    expect(result.embedUrl).not.toContain("utm_source");
  });

  it("should return null for invalid URL", () => {
    const result = parseRedditUrl("https://example.com/not-reddit");
    expect(result.postId).toBeNull();
    expect(result.embedUrl).toBeNull();
  });

  it("should return null for reddit URL without comments", () => {
    const result = parseRedditUrl("https://www.reddit.com/r/programming/");
    expect(result.postId).toBeNull();
    expect(result.embedUrl).toBeNull();
  });

  it("should handle URL without trailing slash", () => {
    const url = "https://www.reddit.com/r/typescript/comments/ghi012/post";
    const result = parseRedditUrl(url);
    expect(result.postId).toBe("ghi012");
  });
});
