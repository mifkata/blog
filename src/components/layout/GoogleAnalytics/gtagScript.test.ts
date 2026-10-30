import { afterEach, describe, it, expect, vi } from "vitest";
import "@/components/layout/CookieBanner/consent";
import { gtagScript } from "./gtagScript";

const GA_ID = "G-TEST";
const KEY = "consent";

function runScript(stored: string | null | Error) {
  const appended: { src: string }[] = [];
  const page = {
    readyState: "complete",
    createElement: () => ({ src: "" }),
    head: { append: (script: { src: string }) => appended.push(script) },
  };
  vi.stubGlobal("window", globalThis);
  vi.stubGlobal("dataLayer", undefined);
  vi.stubGlobal("requestIdleCallback", (load: () => void) => load());
  vi.stubGlobal("document", page);
  vi.stubGlobal("localStorage", {
    getItem: () => {
      if (stored instanceof Error) throw stored;
      return stored;
    },
  });
  new Function(gtagScript(GA_ID, KEY))();
  return {
    appended,
    page,
    enable: () => window.enableAnalytics?.(),
    disable: () => window.disableAnalytics?.(),
    disabled: () => Reflect.get(globalThis, `ga-disable-${GA_ID}`),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  for (const name of [
    "enableAnalytics",
    "disableAnalytics",
    `ga-disable-${GA_ID}`,
  ]) {
    Reflect.deleteProperty(globalThis, name);
  }
});

describe("gtagScript", () => {
  it("should load nothing without consent", () => {
    expect(runScript(null).appended).toEqual([]);
    expect(runScript("denied").appended).toEqual([]);
  });

  it("should load nothing when storage is blocked", () => {
    expect(runScript(new Error("blocked")).appended).toEqual([]);
  });

  it("should load gtag.js for a visitor who already accepted", () => {
    const { appended } = runScript("granted");
    expect(appended.map((script) => script.src)).toEqual([
      `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
    ]);
  });

  it("should load gtag.js once, however often it is enabled", () => {
    const { appended, enable } = runScript(null);
    enable();
    enable();
    expect(appended).toHaveLength(1);
  });

  it("should switch analytics off and back on", () => {
    const { enable, disable, disabled } = runScript("granted");
    disable();
    expect(disabled()).toBe(true);
    enable();
    expect(disabled()).toBe(false);
  });

  it("should wait for the page to load", () => {
    const listeners: (() => void)[] = [];
    vi.stubGlobal("addEventListener", (_: string, on: () => void) =>
      listeners.push(on),
    );
    const { appended, enable, page } = runScript(null);
    page.readyState = "loading";
    enable();
    expect(appended).toEqual([]);
    listeners.forEach((on) => on());
    expect(appended).toHaveLength(1);
  });
});
