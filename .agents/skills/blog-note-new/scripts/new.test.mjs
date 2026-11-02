import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = join(dirname(fileURLToPath(import.meta.url)), "new.mjs");
const path = "src/content/notes/2026-11-02-a-note.mdx";
const valid = ["--title", "A Note", "--date", "2026-11-02"];

function repo() {
  const root = mkdtempSync(join(tmpdir(), "note-new-"));
  spawnSync("git", ["init", "-q"], { cwd: root });
  return root;
}

const run = (root, args, input) =>
  spawnSync("node", [script, ...args], { cwd: root, encoding: "utf8", input });

test("writes an untagged draft with the placeholder body", () => {
  const root = repo();
  const result = run(root, valid);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.path, path);
  assert.match(output.url, /\/notes\/#2026-11-02-a-note$/);
  const mdx = readFileSync(join(root, path), "utf8");
  assert.match(mdx, /^title: "A Note"$/m);
  assert.match(mdx, /^date: 2026-11-02$/m);
  assert.match(mdx, /^tags: \[\]$/m);
  assert.match(mdx, /^draft: true$/m);
  assert.match(mdx, /^TODO: write the note\.$/m);
});

test("writes tags once each", () => {
  const root = repo();
  run(root, [...valid, "--tag", "book-review", "--tag", "ai", "--tag", "ai"]);
  assert.match(
    readFileSync(join(root, path), "utf8"),
    /^tags: \[book-review, ai\]$/m,
  );
});

test("keeps a supplied body verbatim", () => {
  const root = repo();
  const body = "My **own** words, $& and {{kept}}.\n";
  run(root, [...valid, "--body-file", "-"], body);
  assert.match(
    readFileSync(join(root, path), "utf8"),
    /^My \*\*own\*\* words, \$& and {{kept}}\.$/m,
  );
});

test("dry run writes nothing", () => {
  const root = repo();
  assert.equal(
    JSON.parse(run(root, [...valid, "--dry-run"]).stdout).action,
    "plan",
  );
  assert.equal(existsSync(join(root, path)), false);
});

test("never overwrites a note", () => {
  const root = repo();
  run(root, valid);
  writeFileSync(join(root, path), "mine");
  assert.equal(run(root, valid).status, 1);
  assert.equal(readFileSync(join(root, path), "utf8"), "mine");
});

test("rejects bad input as usage errors", () => {
  const root = repo();
  assert.equal(run(root, []).status, 2);
  assert.equal(run(root, ["--title", "!!!"]).status, 2);
  assert.equal(run(root, ["--title", "x", "--date", "2026-02-30"]).status, 2);
});
