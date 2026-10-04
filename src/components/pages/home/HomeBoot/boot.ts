/**
 * The home page boot: on a visitor's first visit (or after a long break) the
 * hero briefly becomes a terminal, types a welcome and the <mifkata /> tag,
 * then morphs the tag into the header logo and powers on the circuit board.
 *
 * Whether it plays is decided before first paint by the gate in BaseHead,
 * which sets <html data-boot="full" | "short">. Any scroll, click or key
 * press fast-forwards to the end.
 */

import { PALETTE_BY_SEASON, type Season } from "@/helpers/season";
import { BOOT_TIMING, type BootTiming } from "./timing";

export type BootMode = "full" | "short";

export interface BootLine {
  kind: "command" | "output";
  text: string;
  /** Ends with "... ok", like a step that completed. */
  ok?: boolean;
}

export interface BootContext {
  hour: number;
  year: number;
  season: Season;
  dark: boolean;
}

declare global {
  interface Window {
    /** Set by the BaseHead gate: reveals the page if the boot never runs. */
    __bootFailsafe?: number;
  }
}

const TAG = "mifkata";

export function greeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning.";
  if (hour >= 12 && hour < 18) return "Good afternoon.";
  if (hour >= 18 && hour < 23) return "Good evening.";
  return "Hello, night owl.";
}

/** The theme the site is wearing, e.g. "v2026.winter/dark". */
export function themeVersion(
  year: number,
  season: Season,
  dark: boolean,
): string {
  return `v${year}.${season}/${dark ? "dark" : "light"}`;
}

/** The season whose palette is showing; fall if none is set. */
export function seasonOfPalette(palette: string | undefined): Season {
  const entry = Object.entries(PALETTE_BY_SEASON).find(
    ([, value]) => value === palette,
  );
  return (entry?.[0] as Season | undefined) ?? "fall";
}

export function bootLines(mode: BootMode, context: BootContext): BootLine[] {
  const theme = `Applying theme ${themeVersion(context.year, context.season, context.dark)}`;
  if (mode === "short") {
    return [
      { kind: "output", text: "Welcome back." },
      { kind: "output", text: theme, ok: true },
    ];
  }
  return [
    { kind: "command", text: "ssh guest@mifkata.com" },
    { kind: "output", text: `${greeting(context.hour)} Welcome.` },
    { kind: "output", text: "Booting mifkata", ok: true },
    { kind: "output", text: theme, ok: true },
    { kind: "command", text: "whoami" },
  ];
}

/** How long a boot takes from the first character to the tag landing, in ms. */
export function bootDuration(
  lines: BootLine[],
  timing: BootTiming = BOOT_TIMING,
): number {
  const screen = lines.reduce(
    (total, line) =>
      total +
      (line.kind === "command" ? line.text.length * timing.commandTyping : 0) +
      (line.ok ? timing.stepDelay : 0) +
      timing.lineDelay,
    0,
  );
  return screen + TAG.length * timing.logoTyping + timing.hold + timing.morph;
}

function element(tag: string, className: string, text = ""): HTMLElement {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}

/** Plays the boot if the gate asked for one; safe to call on any page. */
export function runBoot(): void {
  const html = document.documentElement;
  const mode = html.dataset.boot as BootMode | undefined;
  if (!mode) return;
  window.clearTimeout(window.__bootFailsafe);

  const screen = document.querySelector<HTMLElement>("[data-boot-screen]");
  const linesEl = document.querySelector<HTMLElement>("[data-boot-lines]");
  const logo = document.querySelector<HTMLElement>("[data-boot-logo]");
  const letters = document.querySelector<HTMLElement>("[data-boot-letters]");
  const headerWord = document.querySelector<HTMLElement>(
    "[data-site-logo-word]",
  );

  // The reboot link adds ?boot; drop it so a refresh doesn't replay.
  const url = new URL(window.location.href);
  if (url.searchParams.has("boot")) {
    url.searchParams.delete("boot");
    history.replaceState(history.state, "", url);
  }

  const powerOn = () =>
    document
      .querySelector("[data-circuit-hero]")
      ?.dispatchEvent(new CustomEvent("circuit:power-on"));

  if (!screen || !linesEl || !logo || !letters) {
    delete html.dataset.boot;
    return;
  }

  // Any interaction fast-forwards: every remaining delay becomes zero.
  let skipped = false;
  const skip = () => {
    skipped = true;
  };
  const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];
  for (const name of events) {
    window.addEventListener(name, skip, { once: true, passive: true });
  }
  const wait = (ms: number) =>
    new Promise<void>((resolve) =>
      window.setTimeout(resolve, skipped ? 0 : ms),
    );

  const caret = element("span", "boot-caret");

  async function type(target: HTMLElement, text: string, delay: number) {
    target.append(caret);
    for (const letter of text) {
      caret.before(letter);
      await wait(delay);
    }
  }

  async function play() {
    const now = new Date();
    const lines = bootLines(mode!, {
      hour: now.getHours(),
      year: now.getFullYear(),
      season: seasonOfPalette(html.dataset.palette),
      dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    });

    if (import.meta.env.DEV) {
      console.info(
        `[boot] ${mode} boot: ~${(bootDuration(lines) / 1000).toFixed(1)}s`,
        BOOT_TIMING,
      );
    }

    for (const line of lines) {
      const row = element("p", "boot-line");
      linesEl!.append(row);
      if (line.kind === "command") {
        row.append(element("span", "boot-prompt", "$ "));
        await type(row, line.text, BOOT_TIMING.commandTyping);
      } else {
        row.append(line.text);
        if (line.ok) {
          row.append(" ...");
          await wait(BOOT_TIMING.stepDelay);
          row.append(" ", element("span", "boot-ok", "ok"));
        }
      }
      await wait(BOOT_TIMING.lineDelay);
    }

    logo!.hidden = false;
    await type(letters!, TAG, BOOT_TIMING.logoTyping);
    caret.remove();
    logo!.classList.add("is-typed");
    await wait(BOOT_TIMING.hold);
    handOver();
  }

  function finish() {
    for (const name of events) window.removeEventListener(name, skip);
    delete html.dataset.boot;
  }

  // Morph the big tag into the header logo where the browser can.
  function handOver() {
    if (!document.startViewTransition || !headerWord) {
      finish();
      powerOn();
      return;
    }
    html.style.setProperty("--boot-morph", `${BOOT_TIMING.morph}ms`);
    logo!.style.viewTransitionName = "site-logo";
    const transition = document.startViewTransition(() => {
      logo!.style.viewTransitionName = "";
      headerWord.style.viewTransitionName = "site-logo";
      finish();
    });
    transition.finished.finally(() => {
      html.style.removeProperty("--boot-morph");
      headerWord.style.viewTransitionName = "";
      powerOn();
    });
  }

  void play();
}
