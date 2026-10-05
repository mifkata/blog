import { execSync } from "node:child_process";

function readCommit(): string | undefined {
  // Cloudflare Pages sets this; local builds and the dev server fall back to
  // the checkout's HEAD.
  const fromEnv = import.meta.env.CF_PAGES_COMMIT_SHA;
  if (fromEnv) return fromEnv;
  try {
    return (
      execSync("git rev-parse HEAD", {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() || undefined
    );
  } catch {
    return undefined;
  }
}

/** The full commit hash this build came from, if known. */
export const BUILD_COMMIT = readCommit();

/** The build's date, as YYYY-MM-DD in UTC. */
export const BUILD_DATE = new Date().toISOString().slice(0, 10);
