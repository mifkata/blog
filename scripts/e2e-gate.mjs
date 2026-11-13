// usage: node scripts/e2e-gate.mjs all | affected | setup | lighthouse
// all: every spec. affected: the GATE_TARGETS specs when GATE_SCOPE=affected, otherwise no spec.
// setup: the runner's browsers (Playwright) or binary (Cypress). lighthouse: lhci over e2e-gate.json `lighthouse.pages`;
// an empty list passes without Lighthouse; a page answering anything but 200 without a session fails first.
// Settings: scripts/e2e-gate.json. A free port is exported as E2E_PORT, the origin as E2E_BASE_URL (Cypress also
// CYPRESS_BASE_URL); the `server` command, when set (and `server.modes` absent or naming the mode), is started on it and
// stopped afterwards, with every process it spawned. Specs run from this folder with the suite's own runner and config.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const USAGE =
  "usage: node scripts/e2e-gate.mjs all | affected | setup | lighthouse\n";
const MODES = ["all", "affected", "setup", "lighthouse"];
const [mode, ...extra] = process.argv.slice(2);
if (!MODES.includes(mode) || extra.length > 0) {
  process.stderr.write(USAGE);
  process.exit(2);
}
const here = fileURLToPath(new URL("..", import.meta.url));
const config = JSON.parse(
  readFileSync(join(here, "scripts/e2e-gate.json"), "utf8"),
);
if (!["playwright", "cypress"].includes(config.runner)) {
  process.stderr.write(
    `e2e-gate: runner ${config.runner} is not playwright or cypress\n`,
  );
  process.exit(2);
}

const words = (value) => (value ?? "").split(/\s+/).filter(Boolean);
const bin = (name) => {
  for (let dir = here; ; dir = dirname(dir)) {
    const path = join(dir, "node_modules", ".bin", name);
    if (existsSync(path)) return [path];
    if (dirname(dir) === dir) return ["npx", "--no-install", name];
  }
};

const children = new Set();
const track = (child) => {
  children.add(child);
  const exit = new Promise((done) =>
    child.on("exit", (code, signal) => {
      children.delete(child);
      done(code ?? (signal ? 1 : 0));
    }),
  );
  child.on("error", () => {});
  return exit;
};
const run = (command, args, options = {}) => {
  const [file, ...prefix] = bin(command);
  return track(
    spawn(file, [...prefix, ...args], {
      cwd: here,
      stdio: "inherit",
      ...options,
    }),
  );
};
const stop = async () => {
  const waits = [...children].map(
    (child) =>
      new Promise((done) => {
        if (child.exitCode !== null || child.signalCode !== null) return done();
        const kill = setTimeout(() => signal(child, "SIGKILL"), 10_000);
        child.once("exit", () => {
          clearTimeout(kill);
          done();
        });
        signal(child, "SIGTERM");
      }),
  );
  await Promise.all(waits);
};
const signal = (child, name) => {
  try {
    process.kill(-child.pid, name);
  } catch {
    try {
      child.kill(name);
    } catch {
      // already gone
    }
  }
};
for (const name of ["SIGINT", "SIGTERM"])
  process.on(name, () => {
    void stop().then(() => process.exit(130));
  });

const freePort = () =>
  new Promise((done, failed) => {
    const server = createServer();
    server.unref();
    server.on("error", failed);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => done(port));
    });
  });

const startServer = async (origin) => {
  if (
    !config.server ||
    (config.server.modes && !config.server.modes.includes(mode))
  )
    return;
  const child = spawn("sh", ["-c", config.server.command], {
    cwd: here,
    stdio: "inherit",
    detached: true,
  });
  let exited = null;
  void track(child).then((code) => {
    exited = code;
  });
  const ready = new URL(config.server.path ?? "/", origin).href;
  const deadline = Date.now() + (config.server.readySeconds ?? 180) * 1000;
  while (exited === null) {
    try {
      await fetch(ready, { redirect: "manual" });
      return;
    } catch {
      if (Date.now() > deadline)
        throw new Error(`server not ready at ${ready}`);
      await new Promise((done) => setTimeout(done, 500));
    }
  }
  throw new Error(`server exited ${exited} before ${ready} answered`);
};

const runnerArgs = (targets) =>
  config.runner === "playwright"
    ? ["test", "-c", config.config, ...targets]
    : [
        "run",
        "--config-file",
        config.config,
        ...(targets.length > 0 ? ["--spec", targets.join(",")] : []),
      ];

const chromePath = () => {
  try {
    const require = createRequire(join(here, "package.json"));
    return require("playwright-core").chromium.executablePath();
  } catch {
    return null;
  }
};

const lighthouse = async (origin) => {
  const hrefs = (config.lighthouse?.pages ?? []).map(
    (page) => new URL(page.path, origin).href,
  );
  for (const href of hrefs) {
    const response = await fetch(href, { redirect: "manual" });
    if (response.status !== 200)
      throw new Error(
        `${href} answers ${response.status} without a session: not a public page, never measured`,
      );
  }
  const cwd = mkdtempSync(join(tmpdir(), "e2e-gate-lighthouse-"));
  const rc = `--config=${join(here, "scripts/lighthouserc.json")}`;
  const chrome = chromePath();
  const steps = [
    [
      "collect",
      rc,
      ...hrefs.map((href) => `--url=${href}`),
      ...(chrome ? [`--chromePath=${chrome}`] : []),
    ],
    ["assert", rc],
    ["upload", rc],
  ];
  for (const step of steps) {
    const code = await run("lhci", step, { cwd });
    if (code !== 0) return code;
  }
  process.stdout.write(
    `lighthouse: reports in ${join(cwd, "reports/lighthouse")}\n`,
  );
  return 0;
};

const main = async () => {
  if (mode === "setup") {
    const args =
      config.runner === "playwright"
        ? ["install", "--with-deps", ...(config.browsers ?? [])]
        : ["install"];
    return run(config.runner, args);
  }
  const targets =
    mode === "affected" && process.env.GATE_SCOPE === "affected"
      ? words(process.env.GATE_TARGETS)
      : [];
  if (mode === "affected" && targets.length === 0) {
    process.stdout.write("e2e-gate: no affected spec\n");
    return 0;
  }
  if (mode === "lighthouse" && (config.lighthouse?.pages ?? []).length === 0) {
    process.stdout.write("lighthouse: no public page listed\n");
    return 0;
  }
  if (mode === "lighthouse" && !config.server)
    throw new Error("lighthouse needs `server` in scripts/e2e-gate.json");
  const port = await freePort();
  const origin = (config.baseUrl ?? "http://localhost:{port}").replace(
    "{port}",
    String(port),
  );
  process.env.E2E_PORT = String(port);
  process.env.E2E_BASE_URL = origin;
  if (config.runner === "cypress") process.env.CYPRESS_BASE_URL = origin;
  process.stdout.write(`e2e-gate: ${mode} on ${origin}\n`);
  await startServer(origin);
  if (mode === "lighthouse") return lighthouse(origin);
  return run(config.runner, runnerArgs(targets));
};

let status;
try {
  status = await main();
} catch (error) {
  process.stderr.write(`e2e-gate: ${error.message}\n`);
  status = 1;
} finally {
  await stop();
}
process.exit(status);
