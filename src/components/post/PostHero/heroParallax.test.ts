import { describe, it, expect } from "vitest";
import { SPEED, heroProgress, imageShift } from "./heroParallax";

// Desktop header: 106px at the top of the page, 52px once it shrinks.
const EXPANDED = 106;
const SHRUNK = 52;

describe("imageShift", () => {
  it("should not move the image at the top of the page", () => {
    expect(imageShift(0, EXPANDED, EXPANDED)).toBe(0);
  });

  it("should keep the image's top edge under the header while it shrinks", () => {
    const scrollY = 60;
    const frameTop = EXPANDED - scrollY;
    const shift = imageShift(scrollY, frameTop, SHRUNK);
    expect(frameTop + shift).toBeLessThanOrEqual(SHRUNK);
  });

  it("should follow the scroll at SPEED once the header covers enough", () => {
    const scrollY = 400;
    expect(imageShift(scrollY, EXPANDED - scrollY, SHRUNK)).toBe(
      SPEED * scrollY,
    );
  });

  it("should never move the image up", () => {
    expect(imageShift(20, EXPANDED - 20, 0)).toBe(0);
  });
});

describe("heroProgress", () => {
  it("should be 0 while the hero is at or below the top of the window", () => {
    expect(heroProgress(EXPANDED, 600)).toBe(0);
  });

  it("should grow as the hero scrolls up, and stop at 1", () => {
    expect(heroProgress(-300, 600)).toBe(0.5);
    expect(heroProgress(-900, 600)).toBe(1);
  });
});
