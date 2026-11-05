// Runs Vitest. Without --fast: the whole suite with coverage. With --fast: only the tests of GATE_TARGETS when
// GATE_SCOPE=affected (`vitest related`, no coverage), otherwise nothing. The --slow projects GATE_SLOW does not name
// are left out of a --fast run. GATE_PARTITIONS above 1: that many workers.
// usage: node scripts/gate-test.mjs [--fast] [--slow <project>[,<project>…]] [<vitest flag>…]
import { spawnSync } from "node:child_process";
import process from "node:process";

const args = process.argv.slice(2);
const flag = (name) =>
  args.includes(name) ? args.splice(args.indexOf(name), 1).length > 0 : false;
const fast = flag("--fast");
const at = args.indexOf("--slow");
const slow =
  at === -1 ? [] : (args.splice(at, 2)[1]?.split(",").filter(Boolean) ?? []);
const words = (value) => (value ?? "").split(/\s+/).filter(Boolean);
const { GATE_SCOPE, GATE_TARGETS, GATE_SLOW, GATE_PARTITIONS } = process.env;
const targets = GATE_SCOPE === "affected" ? words(GATE_TARGETS) : [];
if (fast && targets.length === 0) process.exit(0);
const skipped = fast
  ? slow.filter((project) => !words(GATE_SLOW).includes(project))
  : [];
const workers = Number(GATE_PARTITIONS ?? 1);
const mode = fast
  ? ["related", "--run", "--passWithNoTests", ...targets]
  : ["run", "--coverage"];
const flags = [
  ...skipped.map((project) => `--project=!${project}`),
  ...(workers > 1 ? [`--maxWorkers=${workers}`] : []),
];
const result = spawnSync("vitest", [...mode, ...flags, ...args], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
