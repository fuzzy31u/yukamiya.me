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
