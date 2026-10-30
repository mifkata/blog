import { afterEach, describe, it, expect, vi } from "vitest";
import {
  analyticsCookies,
  cookieDomains,
  parseConsent,
  setupCookieBanner,
} from "./consent";

function fakeControl() {
  const listeners: (() => void)[] = [];
  return {
    focus: vi.fn(),
    addEventListener: (_: string, listener: () => void) =>
      listeners.push(listener),
    click: () => listeners.forEach((listener) => listener()),
  };
}

function stubPage() {
  const controls = {
    "[data-cookie-accept]": fakeControl(),
    "[data-cookie-decline]": fakeControl(),
    "[data-cookie-settings]": fakeControl(),
  };
  const banner = {
    hidden: true,
    querySelector: (selector: keyof typeof controls) => controls[selector],
  };
  vi.stubGlobal("window", {});
  vi.stubGlobal("location", { hostname: "mifkata.com" });
  vi.stubGlobal("localStorage", { getItem: () => null, setItem: vi.fn() });
  vi.stubGlobal("document", {
    cookie: "",
    querySelector: (selector: keyof typeof controls) =>
      selector === "[data-cookie-settings]" ? controls[selector] : banner,
  });
  return { banner, ...controls };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("setupCookieBanner", () => {
  it("should show the banner while no choice is recorded", () => {
    const { banner } = stubPage();
    setupCookieBanner();
    expect(banner.hidden).toBe(false);
  });

  it("should never scroll the page when moving focus", () => {
    const page = stubPage();
    setupCookieBanner();
    page["[data-cookie-settings]"].click();
    page["[data-cookie-accept]"].click();
    expect(page["[data-cookie-accept]"].focus).toHaveBeenCalledWith({
      preventScroll: true,
    });
    expect(page["[data-cookie-settings]"].focus).toHaveBeenCalledWith({
      preventScroll: true,
    });
  });
});

describe("parseConsent", () => {
  it("should keep a recorded choice", () => {
    expect(parseConsent("granted")).toBe("granted");
    expect(parseConsent("denied")).toBe("denied");
  });

  it("should treat anything else as no choice", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent("")).toBeNull();
    expect(parseConsent("yes")).toBeNull();
  });
});

describe("analyticsCookies", () => {
  it("should find every Google Analytics cookie", () => {
    expect(
      analyticsCookies("_ga=GA1.1.1; _ga_SDS8ZJG4SS=GS1; _gid=GA1.2.3"),
    ).toEqual(["_ga", "_ga_SDS8ZJG4SS", "_gid"]);
  });

  it("should leave other cookies alone", () => {
    expect(analyticsCookies("theme=dark; _gallery=1; ga=2")).toEqual([]);
    expect(analyticsCookies("")).toEqual([]);
  });
});

describe("cookieDomains", () => {
  it("should cover the hostname and its parents, never the bare TLD", () => {
    expect(cookieDomains("www.mifkata.com")).toEqual([
      "www.mifkata.com",
      ".www.mifkata.com",
      "mifkata.com",
      ".mifkata.com",
    ]);
  });

  it("should offer no domain for a single-label host", () => {
    expect(cookieDomains("localhost")).toEqual([]);
  });
});
