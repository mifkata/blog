import { describe, it, expect } from "vitest";
import {
  activeWindow,
  agentsLabel,
  isFresh,
  kpDescription,
  latestKp,
  newSince,
  parseTrace,
  protocolLabel,
  statusLevel,
} from "./tmux";

describe("activeWindow", () => {
  it("should mark home on the front page", () => {
    expect(activeWindow("/")).toBe("home");
  });

  it("should mark blog for posts, years and tags", () => {
    expect(activeWindow("/blog")).toBe("blog");
    expect(activeWindow("/blog/2026/01/spec-driven-development/")).toBe("blog");
    expect(activeWindow("/tags/agents/")).toBe("blog");
  });

  it("should mark about, and nothing on other pages", () => {
    expect(activeWindow("/about/")).toBe("about");
    expect(activeWindow("/404")).toBeUndefined();
  });
});

describe("parseTrace", () => {
  const trace = [
    "fl=123f45",
    "h=mifkata.com",
    "visit_scheme=https",
    "colo=SOF",
    "http=http/2",
    "tls=TLSv1.3",
    "loc=BG",
  ].join("\n");

  it("should read the data centre, protocol and TLS version", () => {
    expect(parseTrace(trace)).toEqual({
      colo: "SOF",
      http: "http/2",
      tls: "TLSv1.3",
    });
  });

  it("should return null for anything that isn't a trace", () => {
    expect(parseTrace("<!doctype html><title>Not found</title>")).toBeNull();
  });
});

describe("protocolLabel", () => {
  it("should shorten HTTP/2 and HTTP/3", () => {
    expect(protocolLabel("http/2")).toBe("h2");
    expect(protocolLabel("http/3")).toBe("h3");
  });

  it("should leave other protocols as they are", () => {
    expect(protocolLabel("http/1.1")).toBe("http/1.1");
  });
});

describe("statusLevel and agentsLabel", () => {
  it("should map Statuspage indicators to levels", () => {
    expect(statusLevel("none")).toBe("ok");
    expect(statusLevel("minor")).toBe("warn");
    expect(statusLevel("maintenance")).toBe("warn");
    expect(statusLevel("major")).toBe("bad");
    expect(statusLevel("critical")).toBe("bad");
    expect(statusLevel(undefined)).toBe("unknown");
  });

  it("should say agents up unless something is degraded", () => {
    expect(agentsLabel(["ok", "ok", "unknown"])).toBe("agents up");
    expect(agentsLabel(["ok", "warn", "ok"])).toBe("1 incident");
    expect(agentsLabel(["bad", "warn", "ok"])).toBe("2 incidents");
  });
});

describe("latestKp", () => {
  it("should read the last row of NOAA's objects", () => {
    expect(
      latestKp([
        { time_tag: "2026-10-04T15:00:00", Kp: 4.33 },
        { time_tag: "2026-10-04T18:00:00", Kp: 5.67 },
      ]),
    ).toBe(5.67);
  });

  it("should read the older format with a header row", () => {
    expect(
      latestKp([
        ["time_tag", "Kp", "a_running", "station_count"],
        ["2026-10-04 18:00:00.000", "5.67", "67", "8"],
      ]),
    ).toBe(5.67);
  });

  it("should return null for empty or unexpected data", () => {
    expect(latestKp([])).toBeNull();
    expect(latestKp({ Kp: 3 })).toBeNull();
    expect(latestKp([{ time_tag: "x" }])).toBeNull();
  });
});

describe("kpDescription", () => {
  it("should describe calm levels", () => {
    expect(kpDescription(1.33)).toBe("quiet");
    expect(kpDescription(3)).toBe("unsettled");
    expect(kpDescription(4.33)).toBe("active");
  });

  it("should name storms on NOAA's G scale", () => {
    expect(kpDescription(5.67)).toBe("a minor geomagnetic storm (G1)");
    expect(kpDescription(7)).toBe("a strong geomagnetic storm (G3)");
    expect(kpDescription(9)).toBe("an extreme geomagnetic storm (G5)");
  });
});

describe("newSince", () => {
  it("should flag packages whose version changed since the last visit", () => {
    expect(
      newSince(
        { "claude-code": "2.1.288", codex: "0.160.0" },
        { "claude-code": "2.1.289", codex: "0.160.0", opencode: "1.18.34" },
      ),
    ).toEqual(new Set(["claude-code"]));
  });

  it("should flag nothing on a first visit", () => {
    expect(newSince({}, { codex: "0.160.0" })).toEqual(new Set());
  });
});

describe("isFresh", () => {
  it("should keep entries until they're older than the time to live", () => {
    expect(isFresh({ at: 1000 }, 500, 1400)).toBe(true);
    expect(isFresh({ at: 1000 }, 500, 1600)).toBe(false);
    expect(isFresh(null, 500, 1000)).toBe(false);
  });
});
