export function allowedPath(file) {
  return (
    /^v2\/src\/content\/activities\/curated-[a-f0-9]{24}\.json$/.test(file) ||
    /^v2\/\.automation\/portfolio-curator\/(candidates\/[a-f0-9]{24}\.json|decisions\/\d{4}\/[a-f0-9]{24}\.json|sources\.json)$/.test(
      file,
    )
  );
}
export function assertScope(files) {
  if (!files.length) throw new Error("No changes to propose");
  for (const file of files)
    if (!allowedPath(file)) throw new Error(`Forbidden curator write: ${file}`);
}

// Compare both the index and worktree to HEAD. A staged edit can be absent from
// the worktree diff when the file on disk has been restored to HEAD.
export function inspectPublisherChanges(run, baseRef) {
  const lines = (args) => run("git", args).split("\n").filter(Boolean);
  const diff = (...args) =>
    lines(["diff", "--no-renames", "--name-only", ...args]);
  const committed = diff(baseRef, "HEAD");
  const changed = diff("HEAD");
  const staged = diff("--cached");
  const untracked = lines(["ls-files", "--others", "--exclude-standard"]);
  assertScope([
    ...new Set([...committed, ...changed, ...staged, ...untracked]),
  ]);
  const deleted = [
    ...diff("--diff-filter=D", baseRef, "HEAD"),
    ...diff("--diff-filter=D", "HEAD"),
    ...diff("--cached", "--diff-filter=D"),
  ];
  if (deleted.length) throw new Error("Curator cannot delete records");
  return { changed, staged, untracked };
}
