import { describe, it, expect } from "vitest";
import { REMEMBERED, rememberRead, unreadFirst } from "./readNext";

describe("unreadFirst", () => {
  const same = (id: string) => id;

  it("should move posts already read behind the rest, keeping each order", () => {
    expect(
      unreadFirst(
        ["sdd", "tools", "openclaw", "commands"],
        same,
        new Set(["sdd", "openclaw"]),
      ),
    ).toEqual(["tools", "commands", "sdd", "openclaw"]);
  });

  it("should keep the order when nothing has been read", () => {
    expect(unreadFirst(["a", "b"], same, new Set())).toEqual(["a", "b"]);
  });
});

describe("rememberRead", () => {
  it("should put the post first and list it once", () => {
    expect(rememberRead(["a", "b", "c"], "b")).toEqual(["b", "a", "c"]);
  });

  it("should forget the oldest beyond the limit", () => {
    const read = Array.from({ length: REMEMBERED }, (_, i) => `post-${i}`);
    const next = rememberRead(read, "new");
    expect(next).toHaveLength(REMEMBERED);
    expect(next[0]).toBe("new");
    expect(next).not.toContain(`post-${REMEMBERED - 1}`);
  });
});
