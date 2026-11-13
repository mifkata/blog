// usage: node scripts/affected-specs.mjs < <changed repo-relative paths>
// Prints the spec files (relative to this folder) a change reaches, one per line, over scripts/e2e-gate.json `testDir`
// and `specPattern`: a changed spec; the specs whose relative imports reach a changed file (transitively); a changed
// file of `appDirs`: the specs (with the files they import) visiting a route it serves or naming a test id literal it
// holds (`testIdAttributes`); an app file with no such hit selects the specs importing it, if any, else every spec;
// every spec for any other changed file of `suiteTrees`, the runner config or this folder's `scripts/e2e-gate.*`, or a
// deleted file there. `none` when every path is non-code
// (Markdown, `docs/`, `.beads/`). Other paths select nothing.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

if (process.argv.length > 2) {
  process.stderr.write(
    "usage: node scripts/affected-specs.mjs < <changed repo-relative paths>\n",
  );
  process.exit(2);
}
const here = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const config = JSON.parse(
  readFileSync(join(here, "scripts/e2e-gate.json"), "utf8"),
);
const testDir = resolve(here, config.testDir);
const specPattern = new RegExp(config.specPattern);
const SOURCE = /\.(?:[cm]?[jt]sx?|vue|svelte|astro)$/;
const EXTENSIONS = [
  "",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
];

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        if (entry.name === "node_modules" || entry.name.startsWith("."))
          return [];
        const path = join(dir, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
      })
    : [];
const specs = walk(testDir).filter((path) =>
  specPattern.test(relative(testDir, path).split("\\").join("/")),
);

let root = here;
try {
  root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: here,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  // not a git work tree: paths are taken relative to this folder's parent
}

const texts = new Map();
const text = (path) => {
  if (!texts.has(path))
    texts.set(path, existsSync(path) ? readFileSync(path, "utf8") : "");
  return texts.get(path);
};
const resolveImport = (from, spec) => {
  const base = resolve(dirname(from), spec);
  for (const candidate of [
    ...EXTENSIONS.map((ext) => base + ext),
    ...EXTENSIONS.slice(1).map((ext) => join(base, `index${ext}`)),
  ])
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  return null;
};
const imports = (path) =>
  [
    ...text(path).matchAll(
      /(?:from|import|require)\s*\(?\s*['"](\.{1,2}\/[^'"]*)['"]/g,
    ),
  ]
    .map(([, spec]) => resolveImport(path, spec))
    .filter(Boolean);
const reach = (spec) => {
  const seen = new Set([spec]);
  const stack = [spec];
  while (stack.length > 0)
    for (const next of imports(stack.pop()))
      if (
        !seen.has(next) &&
        SOURCE.test(next) &&
        !next.includes("/node_modules/")
      ) {
        seen.add(next);
        stack.push(next);
      }
  return seen;
};
const reached = new Map(specs.map((spec) => [spec, reach(spec)]));
const body = (spec) => [...reached.get(spec)].map(text).join("\n");

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const visits = (spec) =>
  [...body(spec).matchAll(/\b(?:goto|visit)\(\s*['"`](\/[^'"`$?#]*)/g)].map(
    ([, path]) => path,
  );
const routePattern = (file) => {
  const app = /(?:^|\/)app\/(?:(.*)\/)?page\.[jt]sx?$/.exec(file);
  const kit =
    /(?:^|\/)src\/routes\/(?:(.*)\/)?\+page(?:\.server)?\.(?:svelte|[jt]s)$/.exec(
      file,
    );
  const pages = /(?:^|\/)pages\/(.+)\.(?:astro|mdx?|vue|[jt]sx?)$/.exec(file);
  let path;
  if (app || kit)
    path = ((app ?? kit)[1] ?? "")
      .split("/")
      .filter((s) => !/^\(.*\)$|^@/.test(s))
      .join("/");
  else if (pages && !/^(?:_|api\/)/.test(pages[1]))
    path = pages[1].replace(/(?:^|\/)index$/, "");
  else return null;
  const segments = path
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      if (/^\[\[?\.\.\./.test(segment)) return ".*";
      if (/^\[.+\]$/.test(segment)) return "[^/]+";
      return escape(segment);
    });
  return new RegExp(`^/${segments.join("/")}/?$`);
};
const testIds = (content) =>
  (config.testIdAttributes ?? []).flatMap((attribute) =>
    [
      ...content.matchAll(
        new RegExp(
          `${escape(attribute)}\\s*[=:]\\s*\\{?\\s*['"\`]([^'"\`$]+)['"\`]`,
          "g",
        ),
      ),
    ].map(([, id]) => id),
  );

const under = (path, dir) => path === dir || path.startsWith(`${dir}/`);
const appDirs = (config.appDirs ?? []).map((dir) => resolve(here, dir));
const owned = [
  ...(config.suiteTrees ?? [config.testDir]).map((dir) => resolve(here, dir)),
  resolve(here, config.config),
  resolve(here, "scripts/e2e-gate.mjs"),
  resolve(here, "scripts/affected-specs.mjs"),
  resolve(here, "scripts/e2e-gate.json"),
];

const targets = new Set();
let paths = 0;
let code = 0;
for (const path of readFileSync(0, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)) {
  paths += 1;
  if (/\.md$/.test(path) || /(?:^|\/)(?:\.beads|docs)\//.test(path)) continue;
  code += 1;
  const absolute = join(root, path);
  if (specs.includes(absolute)) {
    targets.add(absolute);
    continue;
  }
  const importers = specs.filter((spec) => reached.get(spec).has(absolute));
  for (const spec of importers) targets.add(spec);
  if (owned.some((dir) => under(absolute, dir))) {
    if (importers.length === 0 || !existsSync(absolute))
      for (const spec of specs) targets.add(spec);
    continue;
  }
  const app = appDirs.find((dir) => under(absolute, dir));
  if (!app) continue;
  const ids = testIds(text(absolute));
  const route = routePattern(relative(app, absolute).split("\\").join("/"));
  const hits = specs.filter(
    (spec) =>
      ids.some((id) =>
        new RegExp(`(?<![\\w-])${escape(id)}(?![\\w-])`).test(body(spec)),
      ) ||
      (route !== null && visits(spec).some((visited) => route.test(visited))),
  );
  for (const spec of hits.length > 0 || importers.length > 0 ? hits : specs)
    targets.add(spec);
}
process.stdout.write(
  paths > 0 && code === 0
    ? "none\n"
    : [...targets]
        .map((spec) => relative(here, spec).split("\\").join("/"))
        .sort()
        .map((spec) => `${spec}\n`)
        .join(""),
);
