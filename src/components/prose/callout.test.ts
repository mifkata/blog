import { describe, it, expect } from "vitest";
import { calloutType } from "./callout";

describe("calloutType", () => {
  it("should read the type from the colour posts already use", () => {
    expect(calloutType()).toBe("note");
    expect(calloutType(undefined, "pink")).toBe("warning");
    expect(calloutType(undefined, "green")).toBe("tip");
    expect(calloutType(undefined, "blue")).toBe("note");
  });

  it("should prefer an explicit type", () => {
    expect(calloutType("tip", "pink")).toBe("tip");
  });
});
