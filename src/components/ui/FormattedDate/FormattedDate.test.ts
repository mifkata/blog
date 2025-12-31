import { describe, it, expect } from "vitest";

// Extract the formatting logic for testing
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

describe("formatDate", () => {
  it("should format date as 'Mon DD, YYYY'", () => {
    const date = new Date("2025-12-31");
    expect(formatDate(date)).toBe("Dec 31, 2025");
  });

  it("should handle single digit days", () => {
    const date = new Date("2025-01-05");
    expect(formatDate(date)).toBe("Jan 5, 2025");
  });

  it("should handle different months", () => {
    expect(formatDate(new Date("2025-03-15"))).toBe("Mar 15, 2025");
    expect(formatDate(new Date("2025-07-04"))).toBe("Jul 4, 2025");
    expect(formatDate(new Date("2025-11-28"))).toBe("Nov 28, 2025");
  });

  it("should handle different years", () => {
    expect(formatDate(new Date("2020-06-15"))).toBe("Jun 15, 2020");
    expect(formatDate(new Date("2030-01-01"))).toBe("Jan 1, 2030");
  });
});
