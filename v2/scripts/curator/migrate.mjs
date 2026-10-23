import path from "node:path";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { readJson, writeJson, locked } from "./store.mjs";
import { freshCandidate, hash } from "./core.mjs";
export async function migrate(oldFile, root) {
  return locked(root, async () => {
    const bytes = await readFile(oldFile, "utf8");
    const old = JSON.parse(bytes);
    const report = {
      schemaVersion: 1,
      sourceSha256: hash(bytes),
      sources: old.sources,
      mappings: [],
    };
    for (const [key, record] of Object.entries(old.activities)) {
      const id = hash(key).slice(0, 24);
      let dest;
      if (record.content_type.startsWith("qa-")) {
        dest = `incidents/${id}.json`;
        const recurrences = record.recurrences ?? [];
        await writeJson(path.join(root, dest), {
          schemaVersion: 1,
          id,
          legacyKey: key,
          title: record.title,
          status: record.status === "merged" ? "resolved" : "open",
          firstSeen: record.detected_at,
          lastSeen:
            recurrences.at(-1)?.resolved_at ??
            record.merged_at ??
            record.detected_at,
          recurrenceCount: recurrences.length,
          recentRecurrences: recurrences.slice(-5),
          legacy: { ...record, recurrences: undefined },
        });
      } else if (record.status === "merged") {
        dest = `decisions/${record.detected_at.slice(0, 4)}/${id}.json`;
        await writeJson(path.join(root, dest), {
          schemaVersion: 1,
          id,
          canonicalUrl: record.canonical_url,
          occurrenceKey: "legacy-unspecified",
          decision: "legacy-merged",
          legacyKey: key,
          legacy: record,
        });
      } else {
        const c = freshCandidate(
          record.canonical_url,
          "zenn-author",
          record.detected_at,
          record.title,
        );
        c.blocker = "legacy-evidence-needs-reverification";
        c.legacy = { key, status: record.status, record };
        dest = `candidates/${c.id}.json`;
        await writeJson(path.join(root, dest), c);
      }
      report.mappings.push({ key, destination: dest });
    }
    for (const [key, record] of Object.entries(old.rejected_candidates)) {
      const id = hash(key).slice(0, 24);
      const dest = `decisions/${record.rejected_at.slice(0, 4)}/${id}.json`;
      await writeJson(path.join(root, dest), {
        schemaVersion: 1,
        id,
        canonicalUrl: key,
        occurrenceKey: "legacy-unspecified",
        decision: "legacy-rejected",
        legacyKey: key,
        legacy: record,
      });
      report.mappings.push({ key, destination: dest });
    }
    // Preserve original source timestamps as historical coverage, never claim v2 ran those queries.
    await writeJson(path.join(root, "migration.json"), report);
    return report;
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const root = path.resolve(".automation/portfolio-curator");
  const old = path.resolve(
    "../.automation/auto-detect-my-public-activities/state.json",
  );
  if (await readJson(path.join(root, "migration.json"), null))
    throw new Error(
      "Migration already exists; refusing to overwrite resumed state",
    );
  const report = await migrate(old, root);
  console.log(
    `Preserved ${report.mappings.length} records and ${Object.keys(report.sources).length} source timestamps; original unchanged.`,
  );
}
