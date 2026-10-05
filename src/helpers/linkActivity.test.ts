import { describe, it, expect } from "vitest";
import { matchingStories, topStories, type StoryHit } from "./linkActivity";

const hit = (overrides: Partial<StoryHit>): StoryHit => ({
  objectID: "1",
  title: "Agent Skills",
  url: "https://agentskills.io/home",
  points: 544,
  num_comments: 260,
  created_at: "2026-02-03T10:00:00Z",
  ...overrides,
});

describe("matchingStories", () => {
  it("should keep stories about exactly the linked page", () => {
    const stories = matchingStories(
      [hit({}), hit({ objectID: "2", url: "https://agentskills.io/home/" })],
      "https://agentskills.io/home",
    );
    expect(stories.map((story) => story.id)).toEqual(["1", "2"]);
    expect(stories[0]).toMatchObject({ points: 544, comments: 260 });
  });

  it("should drop pages that merely contain the text", () => {
    const stories = matchingStories(
      [
        hit({
          url: "https://www.netsuite.com/articles/in-demand-tech-skills.shtml",
        }),
        hit({ objectID: "2", url: "https://skills.sh/?q=googleworkspace" }),
      ],
      "https://skills.sh",
    );
    expect(stories).toEqual([]);
  });

  it("should drop stories below the points threshold or without a URL", () => {
    expect(
      matchingStories(
        [hit({ points: 3 }), hit({ objectID: "2", url: null })],
        "https://agentskills.io/home",
      ),
    ).toEqual([]);
  });
});

describe("topStories", () => {
  it("should list each story once, most points first", () => {
    const [a, b] = matchingStories(
      [hit({}), hit({ objectID: "2", points: 135 })],
      "https://agentskills.io/home",
    );
    expect(topStories([b, a, a], 3).map((story) => story.id)).toEqual([
      "1",
      "2",
    ]);
    expect(topStories([b, a], 1)).toHaveLength(1);
  });
});
