import { afterEach, describe, it, expect, vi } from "vitest";
import {
  analyticsCookies,
  CONSENT_KEY,
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

function stubPage(stored: string | null = null) {
  const accept = fakeControl();
  const decline = fakeControl();
  const settings = fakeControl();
  const banner = {
    hidden: true,
    querySelector: (selector: string) =>
      selector === "[data-cookie-accept]" ? accept : decline,
  };
  const cookies = new Set(["_ga", "_ga_TEST", "keep"]);
  const hooks = { enableAnalytics: vi.fn(), disableAnalytics: vi.fn() };
  const setItem = vi.fn();
  vi.stubGlobal("window", hooks);
  vi.stubGlobal("location", { hostname: "mifkata.com" });
  vi.stubGlobal("localStorage", { getItem: () => stored, setItem });
  vi.stubGlobal("document", {
    get cookie() {
      return [...cookies].map((name) => `${name}=1`).join("; ");
    },
    set cookie(value: string) {
      if (value.includes("1970")) cookies.delete(value.split("=")[0]);
    },
    querySelector: (selector: string) =>
      selector === "[data-cookie-settings]" ? settings : banner,
  });
  return { accept, banner, cookies, decline, hooks, setItem, settings };
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

  it("should keep the banner hidden after a recorded choice", () => {
    const { banner } = stubPage("denied");
    setupCookieBanner();
    expect(banner.hidden).toBe(true);
  });

  it("should enable analytics and remember it on Accept", () => {
    const { accept, banner, hooks, setItem } = stubPage();
    setupCookieBanner();
    accept.click();
    expect(hooks.enableAnalytics).toHaveBeenCalledOnce();
    expect(setItem).toHaveBeenCalledWith(CONSENT_KEY, "granted");
    expect(banner.hidden).toBe(true);
  });

  it("should disable analytics and clear its cookies on Decline", () => {
    const { banner, cookies, decline, hooks, setItem } = stubPage();
    setupCookieBanner();
    decline.click();
    expect(hooks.disableAnalytics).toHaveBeenCalledOnce();
    expect(hooks.enableAnalytics).not.toHaveBeenCalled();
    expect(setItem).toHaveBeenCalledWith(CONSENT_KEY, "denied");
    expect([...cookies]).toEqual(["keep"]);
    expect(banner.hidden).toBe(true);
  });

  it("should reopen from the footer and focus Accept", () => {
    const { accept, banner, settings } = stubPage("denied");
    setupCookieBanner();
    settings.click();
    expect(banner.hidden).toBe(false);
    expect(accept.focus).toHaveBeenCalledOnce();
  });

  it("should never scroll the page when moving focus", () => {
    const { accept, settings } = stubPage();
    setupCookieBanner();
    settings.click();
    accept.click();
    expect(accept.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(settings.focus).toHaveBeenCalledWith({ preventScroll: true });
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
