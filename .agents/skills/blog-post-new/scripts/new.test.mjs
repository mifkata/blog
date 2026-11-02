import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = join(dirname(fileURLToPath(import.meta.url)), "new.mjs");
const date = "2026-11-02T01:30:45Z";
const path = "src/content/blog/2026/11/cafe-dont-panic.mdx";

function repo() {
  const root = mkdtempSync(join(tmpdir(), "post-new-"));
  spawnSync("git", ["init", "-q"], { cwd: root });
  mkdirSync(join(root, "src/assets/blog"), { recursive: true });
  writeFileSync(join(root, "src/assets/blog/placeholder.png"), "");
  return root;
}

const run = (root, ...args) =>
  spawnSync("node", [script, ...args], { cwd: root, encoding: "utf8" });

const valid = [
  "--title",
  'Café: "Don\'t" Panic',
  "--description",
  'Says "hi".',
  "--date",
  date,
];

test("writes a draft from the template", () => {
  const root = repo();
  const result = run(root, ...valid);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).path, path);
  const mdx = readFileSync(join(root, path), "utf8");
  assert.match(mdx, /^title: "Café: \\"Don't\\" Panic"$/m);
  assert.match(mdx, /^description: "Says \\"hi\\"\."$/m);
  assert.match(mdx, /^pubDate: "2026-11-02T01:30:00Z"$/m);
  assert.match(mdx, /^draft: true$/m);
  assert.doesNotMatch(mdx, /{{/);
});

test("reports the hero image path", () => {
  const { next } = JSON.parse(run(repo(), ...valid).stdout);
  assert.match(next[0], /src\/assets\/blog\/2026\/1102-cafe-dont-panic\./);
});

test("keeps $ patterns in the title literal", () => {
  const root = repo();
  run(root, "--title", "Cost", "--description", "Pay $& or $1", "--date", date);
  const mdx = readFileSync(
    join(root, "src/content/blog/2026/11/cost.mdx"),
    "utf8",
  );
  assert.match(mdx, /Pay \$& or \$1/);
});

test("dry run writes nothing", () => {
  const root = repo();
  const result = run(root, ...valid, "--dry-run");
  assert.equal(JSON.parse(result.stdout).action, "plan");
  assert.equal(existsSync(join(root, path)), false);
});

test("never overwrites a post", () => {
  const root = repo();
  run(root, ...valid);
  writeFileSync(join(root, path), "mine");
  assert.equal(run(root, ...valid).status, 1);
  assert.equal(readFileSync(join(root, path), "utf8"), "mine");
});

test("refuses without the placeholder image", () => {
  const root = mkdtempSync(join(tmpdir(), "post-new-"));
  spawnSync("git", ["init", "-q"], { cwd: root });
  assert.equal(run(root, ...valid).status, 1);
});

test("rejects bad input as usage errors", () => {
  const root = repo();
  assert.equal(run(root, "--title", "Only").status, 2);
  assert.equal(run(root, "--title", "!!!", "--description", "x").status, 2);
  assert.equal(run(root, ...valid.slice(0, 4), "--date", "nope").status, 2);
});
