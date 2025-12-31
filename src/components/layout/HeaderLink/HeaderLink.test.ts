import { describe, it, expect } from "vitest";

// Extract the active state logic for testing
function isActiveLink(href: string, pathname: string): boolean {
  const cleanPathname = pathname.replace(/^\//, "");
  const subpath = cleanPathname.match(/[^\/]+/g);
  return href === `/${cleanPathname}` || href === "/" + (subpath?.[0] || "");
}

describe("isActiveLink", () => {
  it("should match exact pathname", () => {
    expect(isActiveLink("/blog", "blog")).toBe(true);
    expect(isActiveLink("/about", "about")).toBe(true);
  });

  it("should match first path segment", () => {
    expect(isActiveLink("/blog", "blog/my-post")).toBe(true);
    expect(isActiveLink("/blog", "blog/2025/post")).toBe(true);
  });

  it("should not match different paths", () => {
    expect(isActiveLink("/blog", "about")).toBe(false);
    expect(isActiveLink("/about", "blog/post")).toBe(false);
  });

  it("should handle root path", () => {
    expect(isActiveLink("/", "")).toBe(true);
  });

  it("should handle pathname with leading slash", () => {
    // After removing leading slash, "/blog" becomes "blog" which matches
    expect(isActiveLink("/blog", "/blog")).toBe(true);
  });
});
