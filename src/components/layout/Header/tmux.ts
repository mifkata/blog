/**
 * Live segments for the tmux-style status bar. Every source is public, needs
 * no key and allows cross-origin reads, so the site stays static.
 */

export type Level = "ok" | "warn" | "bad" | "unknown";

export const WINDOWS = [
  { name: "home", href: "/" },
  { name: "blog", href: "/blog" },
  { name: "about", href: "/about" },
] as const;

export const SERVICES = [
  { name: "Claude", url: "https://status.claude.com/api/v2/status.json" },
  { name: "OpenAI", url: "https://status.openai.com/api/v2/status.json" },
  { name: "GitHub", url: "https://www.githubstatus.com/api/v2/status.json" },
] as const;

export const PACKAGES = [
  { name: "claude-code", pkg: "@anthropic-ai/claude-code" },
  { name: "codex", pkg: "@openai/codex" },
  { name: "gemini-cli", pkg: "@google/gemini-cli" },
  { name: "opencode", pkg: "opencode-ai" },
] as const;

const KP_URL =
  "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
/** Cloudflare's per-request trace, served by the site itself. */
const TRACE_URL = "/cdn-cgi/trace";

/** How long each source stays fresh, in ms; also how often it's polled. */
const TTL = {
  agents: 3 * 60_000,
  releases: 30 * 60_000,
  kp: 15 * 60_000,
  edge: 10 * 60_000,
};
/** Time each release stays in the radar, in ms. */
const RADAR_STEP = 4000;
const CACHE_PREFIX = "mifkata-tmux:";
/** Versions seen on the previous visit, and this visit's copy of them. */
const SEEN_KEY = "mifkata-tmux-seen";
const BASELINE_KEY = "mifkata-tmux-baseline";

export function activeWindow(pathname: string): string | undefined {
  const section = pathname.split("/").filter(Boolean)[0];
  if (!section) return "home";
  if (section === "blog" || section === "tags") return "blog";
  if (section === "about") return "about";
  return undefined;
}

export interface Edge {
  colo: string;
  http: string;
  tls: string;
}

export function parseTrace(text: string): Edge | null {
  const fields = Object.fromEntries(
    text
      .split("\n")
      .map((line) => line.split("="))
      .filter((pair) => pair.length === 2),
  );
  if (!fields.colo || !fields.http) return null;
  return { colo: fields.colo, http: fields.http, tls: fields.tls ?? "" };
}

/** "http/2" → "h2", the way tmux users would write it. */
export function protocolLabel(http: string): string {
  const match = /^http\/(\d)$/.exec(http);
  return match ? `h${match[1]}` : http;
}

/** Statuspage indicators: none, minor, major, critical, maintenance. */
export function statusLevel(indicator: string | undefined): Level {
  if (indicator === "none") return "ok";
  if (indicator === "minor" || indicator === "maintenance") return "warn";
  if (indicator === "major" || indicator === "critical") return "bad";
  return "unknown";
}

export function agentsLabel(levels: Level[]): string {
  const incidents = levels.filter((l) => l === "warn" || l === "bad").length;
  if (incidents === 0) return "agents up";
  return incidents === 1 ? "1 incident" : `${incidents} incidents`;
}

/** The latest Kp value; NOAA has served both rows of objects and a header row of arrays. */
export function latestKp(data: unknown): number | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  const last = data[data.length - 1];
  let value: unknown;
  if (Array.isArray(last)) {
    const column = (data[0] as unknown[]).indexOf("Kp");
    value = last[column >= 0 ? column : 1];
  } else {
    value = (last as { Kp?: unknown }).Kp;
  }
  const kp = Number(value);
  return Number.isFinite(kp) ? kp : null;
}

const STORMS = ["minor", "moderate", "strong", "severe", "extreme"];

/** NOAA's scale: Kp 5 and up is a geomagnetic storm, G1 to G5. */
export function kpDescription(kp: number): string {
  if (kp >= 5) {
    const g = Math.min(5, Math.floor(kp) - 4);
    const word = STORMS[g - 1];
    return `${/^[aeiou]/.test(word) ? "an" : "a"} ${word} geomagnetic storm (G${g})`;
  }
  if (kp >= 4) return "active";
  if (kp >= 3) return "unsettled";
  return "quiet";
}

/** Packages whose version changed since the baseline; unknown packages aren't new. */
export function newSince(
  baseline: Record<string, string>,
  current: Record<string, string>,
): Set<string> {
  return new Set(
    Object.keys(current).filter(
      (name) =>
        baseline[name] !== undefined && baseline[name] !== current[name],
    ),
  );
}

export function isFresh(
  entry: { at: number } | null,
  ttl: number,
  now: number,
): boolean {
  return entry !== null && now - entry.at < ttl;
}

function readStore<T>(store: Storage, key: string): T | null {
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStore(store: Storage, key: string, value: unknown) {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked; the bar still works without it.
  }
}

async function cached<T>(
  key: string,
  ttl: number,
  load: () => Promise<T | null>,
): Promise<T | null> {
  const entry = readStore<{ at: number; data: T }>(
    sessionStorage,
    CACHE_PREFIX + key,
  );
  if (isFresh(entry, ttl, Date.now())) return entry!.data;
  const data = await load().catch(() => null);
  if (data !== null)
    writeStore(sessionStorage, CACHE_PREFIX + key, { at: Date.now(), data });
  return data ?? entry?.data ?? null;
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json();
}

interface Agent {
  name: string;
  level: Level;
  description: string;
}

const loaders = {
  agents: async (): Promise<Agent[]> =>
    Promise.all(
      SERVICES.map(async ({ name, url }) => {
        try {
          const data = (await getJson(url)) as {
            status?: { indicator?: string; description?: string };
          };
          return {
            name,
            level: statusLevel(data.status?.indicator),
            description: data.status?.description ?? "No status",
          };
        } catch {
          return {
            name,
            level: "unknown" as Level,
            description: "Couldn't reach the status page",
          };
        }
      }),
    ),
  releases: async (): Promise<Record<string, string> | null> => {
    const entries = await Promise.all(
      PACKAGES.map(async ({ name, pkg }) => {
        try {
          const data = (await getJson(
            `https://registry.npmjs.org/${pkg}/latest`,
          )) as { version?: string };
          return data.version ? ([name, data.version] as const) : null;
        } catch {
          return null;
        }
      }),
    );
    const found = entries.filter((e) => e !== null);
    return found.length ? Object.fromEntries(found) : null;
  },
  kp: async (): Promise<number | null> => latestKp(await getJson(KP_URL)),
  edge: async (): Promise<Edge | null> => {
    const response = await fetch(TRACE_URL, { cache: "no-store" });
    return response.ok ? parseTrace(await response.text()) : null;
  },
};

/** Runs once the page has loaded and the browser has a moment to spare. */
function whenIdle(run: () => void) {
  const idle = () =>
    typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(run, { timeout: 3000 })
      : window.setTimeout(run, 500);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

/**
 * Loads a source and again whenever it goes stale, while the tab is visible.
 * A fresh copy from this session shows at once; a new request waits until the
 * page has loaded, so the bar never competes with the page's own downloads.
 */
function poll<T>(
  key: keyof typeof TTL,
  load: () => Promise<T | null>,
  render: (data: T | null) => void,
) {
  let timer = 0;
  const run = async () => {
    window.clearTimeout(timer);
    if (document.hidden) return;
    render(await cached(key, TTL[key], load));
    timer = window.setTimeout(run, TTL[key]);
  };
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) run();
  });
  const entry = readStore<{ at: number }>(sessionStorage, CACHE_PREFIX + key);
  if (isFresh(entry, TTL[key], Date.now())) run();
  else whenIdle(run);
}

function escape(text: string): string {
  return text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );
}

export function setupTmuxBar(): void {
  const bar = document.querySelector<HTMLElement>("[data-tmux]");
  if (!bar || bar.dataset.tmuxReady) return;
  bar.dataset.tmuxReady = "true";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const part = (name: string) =>
    bar.querySelector<HTMLElement>(`[data-tmux-${name}]`)!;
  const show = (el: HTMLElement, visible: boolean) => (el.hidden = !visible);

  const agents = part("agents");
  poll("agents", loaders.agents, (list) => {
    const known = (list ?? []).filter((a) => a.level !== "unknown");
    show(agents, known.length > 0);
    if (!list || known.length === 0) return;
    agents.querySelector("[data-agents-label]")!.textContent = agentsLabel(
      list.map((a) => a.level),
    );
    agents.querySelector("[data-agents-dots]")!.innerHTML = list
      .map(
        (a) =>
          `<span class="tmux-dot is-${a.level}" title="${escape(a.name)}"></span>`,
      )
      .join("");
    agents.querySelector("[data-agents-tip]")!.innerHTML =
      list
        .map(
          (a) =>
            `<span class="tmux-tip-row"><span class="tmux-dot is-${a.level}"></span>${escape(a.name)}: ${escape(a.description)}</span>`,
        )
        .join("") +
      `<span class="tmux-tip-note">From the public status pages, checked every 3 minutes.</span>`;
  });

  const edge = part("edge");
  poll("edge", loaders.edge, (data) => {
    show(edge, data !== null);
    if (!data) return;
    edge.querySelector("[data-edge-text]")!.textContent =
      `${data.colo} · ${protocolLabel(data.http)}`;
    edge.querySelector("[data-edge-tip]")!.textContent =
      `Served by Cloudflare's ${data.colo} data centre over ${data.http.toUpperCase()}${data.tls ? ` with ${data.tls.replace("TLSv", "TLS ")}` : ""}.`;
  });

  const kp = part("kp");
  poll("kp", loaders.kp, (value) => {
    show(kp, value !== null);
    if (value === null) return;
    kp.querySelector("[data-kp-text]")!.textContent = `Kp ${value.toFixed(1)}`;
    kp.querySelector("[data-kp-tip]")!.textContent =
      `Planetary K-index from NOAA: ${value.toFixed(2)}, ${kpDescription(value)}. It measures disturbance in Earth's magnetic field; 5 and up means auroras reach further from the poles.`;
  });

  const radar = part("radar");
  const slot = radar.querySelector<HTMLElement>("[data-radar-slot]")!;
  const box = radar.querySelector<HTMLElement>("[data-radar-box]")!;
  let releases: [string, string][] = [];
  let fresh = new Set<string>();
  let index = 0;
  const draw = (animate: boolean) => {
    if (!releases.length) return;
    const [name, version] = releases[index % releases.length];
    const from = box.getBoundingClientRect().width;
    slot.innerHTML = `<span class="tmux-radar-item${animate ? " is-in" : ""}">${escape(name)} ${escape(version)}${fresh.has(name) ? ' <span class="tmux-new">new</span>' : ""}</span>`;
    if (!animate) return;
    // Resize from the old name's width to the new one, so nothing gapes
    box.style.width = "";
    const to = box.getBoundingClientRect().width;
    box.style.width = `${from}px`;
    void box.offsetWidth;
    box.style.width = `${to}px`;
    box.addEventListener("transitionend", () => (box.style.width = ""), {
      once: true,
    });
  };
  poll("releases", loaders.releases, (versions) => {
    show(radar, versions !== null);
    if (!versions) return;
    let baseline = readStore<Record<string, string>>(
      sessionStorage,
      BASELINE_KEY,
    );
    if (!baseline) {
      baseline =
        readStore<Record<string, string>>(localStorage, SEEN_KEY) ?? {};
      writeStore(sessionStorage, BASELINE_KEY, baseline);
    }
    writeStore(localStorage, SEEN_KEY, versions);
    fresh = newSince(baseline, versions);
    releases = Object.entries(versions);
    radar.querySelector("[data-radar-list]")!.innerHTML =
      releases
        .map(
          ([name, version]) =>
            `<span>${escape(name)}</span><span>${escape(version)}</span><span class="tmux-new-text">${fresh.has(name) ? "new" : ""}</span>`,
        )
        .join("") +
      `<span class="tmux-tip-note">Latest versions on npm. "new" means released since your last visit.</span>`;
    draw(false);
  });
  window.setInterval(() => {
    if (reduced.matches || document.hidden || releases.length < 2) return;
    if (radar.matches(":hover, :focus-within")) return;
    index++;
    draw(true);
  }, RADAR_STEP);
}
