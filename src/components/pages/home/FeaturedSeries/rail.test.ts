import { describe, it, expect } from "vitest";
import {
  FLICK,
  isCutOff,
  railPosition,
  rangeLabel,
  revealTarget,
  settleIndex,
} from "./rail";

// The desktop column: 1072px wide, 24px gaps, 2.35 cards in view.
const viewport = 1072;
const gap = 24;
const cardWidth = (viewport - 2 * gap) / 2.35;
const step = cardWidth + gap;
const track = (count: number) => ({
  viewport,
  step,
  cardWidth,
  count,
  scrollWidth: count * cardWidth + (count - 1) * gap,
});
const maxScroll = (count: number) => track(count).scrollWidth - viewport;

describe("railPosition", () => {
  it("should start with the first two cards in view", () => {
    const position = railPosition({ ...track(6), scrollLeft: 0 });
    expect(position).toEqual({
      first: 0,
      last: 1,
      atStart: true,
      atEnd: false,
      current: 0,
    });
  });

  it("should move one card per snap position", () => {
    const position = railPosition({ ...track(6), scrollLeft: 2 * step });
    expect(position.first).toBe(2);
    expect(position.last).toBe(3);
    expect(position.current).toBe(2);
  });

  it("should end on the last two cards and mark the last one current", () => {
    const position = railPosition({ ...track(6), scrollLeft: maxScroll(6) });
    expect(position).toMatchObject({
      first: 4,
      last: 5,
      atEnd: true,
      current: 5,
    });
  });

  it("should treat a scroll within a pixel or two of the end as the end", () => {
    const position = railPosition({
      ...track(3),
      scrollLeft: maxScroll(3) - 1.5,
    });
    expect(position.atEnd).toBe(true);
  });

  it("should count one card in view on phones", () => {
    const phone = { viewport: 342, cardWidth: 287, step: 301 };
    const position = railPosition({
      ...phone,
      count: 3,
      scrollWidth: 3 * 287 + 2 * 14,
      scrollLeft: 0,
    });
    expect(position.first).toBe(0);
    expect(position.last).toBe(0);
  });
});

describe("rangeLabel", () => {
  it("should show a range when several cards are in view", () => {
    expect(rangeLabel(railPosition({ ...track(6), scrollLeft: 0 }), 6)).toBe(
      "1–2 of 6",
    );
  });

  it("should show a single number when one card is in view", () => {
    expect(
      rangeLabel(
        { first: 1, last: 1, atStart: false, atEnd: false, current: 1 },
        3,
      ),
    ).toBe("2 of 3");
  });
});

describe("isCutOff", () => {
  it("should flag the card hanging off the right edge", () => {
    expect(isCutOff(2 * step, cardWidth, 0, viewport)).toBe(true);
  });

  it("should not flag cards fully in view", () => {
    expect(isCutOff(0, cardWidth, 0, viewport)).toBe(false);
    expect(isCutOff(step, cardWidth, 0, viewport)).toBe(false);
  });

  it("should flag a card hanging off the left edge", () => {
    expect(isCutOff(step, cardWidth, step + 40, viewport)).toBe(true);
  });
});

describe("revealTarget", () => {
  const base = { width: cardWidth, viewport, step, maxScroll: maxScroll(6) };

  it("should scroll one card on for the cut-off card at the right", () => {
    expect(revealTarget({ ...base, start: 2 * step, scrollLeft: 0 })).toBe(
      step,
    );
  });

  it("should align a card cut off at the left with the start", () => {
    expect(
      revealTarget({ ...base, start: 3 * step, scrollLeft: 3 * step + 80 }),
    ).toBe(3 * step);
  });

  it("should not scroll past the end", () => {
    expect(
      revealTarget({ ...base, start: 5 * step, scrollLeft: 3 * step }),
    ).toBe(maxScroll(6));
  });
});

describe("settleIndex", () => {
  it("should settle on the nearest card after a slow drag", () => {
    expect(settleIndex(1.4, 0)).toBe(1);
    expect(settleIndex(1.6, 0)).toBe(2);
  });

  it("should move on in the direction of a flick", () => {
    expect(settleIndex(1.1, -FLICK - 0.1)).toBe(2);
    expect(settleIndex(1.9, FLICK + 0.1)).toBe(1);
  });
});
