import { execFileSync } from "node:child_process";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { assertScope } from "./scope.mjs";
const run = (cmd, args) =>
  execFileSync(cmd, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
if (!process.argv.includes("--execute"))
  throw new Error(
    "Publishing is opt-in: create an isolated automation/portfolio-curator-* branch, then pass --execute. Never run on the implementation branch.",
  );
const base = process.argv[process.argv.indexOf("--base") + 1];
if (!process.argv.includes("--base") || !/^[-\w/]+$/.test(base))
  throw new Error("Explicit --base branch required");
const remote = run("git", ["remote", "get-url", "origin"]);
if (
  !/^(https:\/\/github\.com\/|git@github\.com:)fuzzy31u\/yukamiya\.me(?:\.git)?$/.test(
    remote,
  )
)
  throw new Error("Unexpected repository");
const branch = run("git", ["branch", "--show-current"]);
if (!/^automation\/portfolio-curator-[a-z0-9-]+$/.test(branch))
  throw new Error("Dedicated curator branch required");
run("git", ["fetch", "origin", base]);
const baseRef = `origin/${base}`;
if (
  run("git", ["merge-base", "HEAD", baseRef]) !==
  run("git", ["rev-parse", baseRef])
)
  throw new Error("Branch must be based on current remote base");
const committed = run("git", ["diff", "--name-only", baseRef, "HEAD"])
  .split("\n")
  .filter(Boolean);
const changed = run("git", ["diff", "--name-only", "HEAD"])
  .split("\n")
  .filter(Boolean);
const untracked = run("git", ["ls-files", "--others", "--exclude-standard"])
  .split("\n")
  .filter(Boolean);
const files = [...new Set([...committed, ...changed, ...untracked])];
assertScope(files);
if (run("git", ["diff", "--name-only", "--diff-filter=D", baseRef]).trim())
  throw new Error("Curator cannot delete records");
// Paths are checked before any staging. No shell interpolation; no force push or merge operation.
run("npm", ["--prefix", "v2", "run", "validate"]);
if (changed.length || untracked.length) {
  run("git", ["add", "--", ...changed, ...untracked]);
  run("git", ["commit", "-m", "Propose curated portfolio content"]);
}
run("git", ["push", "--set-upstream", "origin", branch]);
const existing = JSON.parse(
  run("gh", [
    "pr",
    "list",
    "--repo",
    "fuzzy31u/yukamiya.me",
    "--head",
    branch,
    "--base",
    base,
    "--state",
    "open",
    "--json",
    "url",
  ]),
);
if (existing.length) console.log(existing[0].url);
else {
  const dir = await mkdtemp(path.join(tmpdir(), "portfolio-pr-"));
  try {
    const body = path.join(dir, "body.md");
    await writeFile(
      body,
      "Structured portfolio candidates and source coverage from the curator. New activities remain drafts and are excluded from the site.\n\nReview each source title, date, identity, translation, summary, and relevance rationale. Publishing requires a human edit to selected/published, fresh required checks, Greptile 5/5, Claude pass, and human approval. No automatic merge.\n",
    );
    console.log(
      run("gh", [
        "pr",
        "create",
        "--repo",
        "fuzzy31u/yukamiya.me",
        "--base",
        base,
        "--head",
        branch,
        "--draft",
        "--title",
        "Review curated portfolio activities",
        "--body-file",
        body,
      ]),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
