// Prints `none` when every changed repo-relative path on stdin is non-code (Markdown, `docs/`, `.beads/`); otherwise
// the files `vitest related` starts from, one per line, or `full` when a path reaches tests beyond the import graph
// (config, lockfile, assets, styles, a deleted file, a file outside this folder).
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

const full = () => {
  process.stdout.write("full\n");
  process.exit(0);
};
let prefix;
try {
  const options = { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] };
  prefix = execFileSync("git", ["rev-parse", "--show-prefix"], options).trim();
} catch {
  full();
}
const targets = new Set();
let paths = 0;
let code = 0;
for (const path of readFileSync(0, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)) {
  paths += 1;
  const inside = path.startsWith(prefix);
  const rel = inside ? path.slice(prefix.length) : path;
  if (/\.md$/.test(rel) || /^(?:\.beads|docs)\//.test(rel)) continue;
  code += 1;
  if (
    !inside ||
    !/^(?:src|test)\/.+\.[cm]?[jt]sx?$/.test(rel) ||
    !existsSync(rel)
  )
    full();
  if (/\s/.test(rel)) full();
  targets.add(rel);
}
process.stdout.write(
  paths > 0 && code === 0
    ? "none\n"
    : [...targets]
        .sort()
        .map((target) => `${target}\n`)
        .join(""),
);
