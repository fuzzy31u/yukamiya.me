import path from "node:path";
import { readdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { z } from "zod";
import { readJson, readRecords } from "./store.mjs";
import { candidate, canonicalize, timestamp } from "./core.mjs";
import { activitySchema } from "../../src/schemas/activity.mjs";
export const policySchema = z.strictObject({
  schemaVersion: z.literal(1),
  mode: z.literal("shadow"),
  allowedHosts: z
    .array(z.string().regex(/^[a-z0-9.-]+$/))
    .min(1)
    .max(20),
  maxCandidates: z.number().int().min(1).max(250),
  maxFetchesPerRun: z.number().int().min(1).max(20),
  maxProposals: z.number().int().min(1).max(3),
  maxBytes: z.number().int().min(1000).max(2000000),
  timeoutMs: z.number().int().min(1000).max(30000),
  maxRedirects: z.number().int().min(0).max(4),
  sources: z
    .array(
      z.strictObject({
        id: z.enum(["cyberagent-author", "zenn-author"]),
        url: z.url(),
        adapter: z.enum(["cyberagent-author", "zenn-author"]),
      }),
    )
    .max(10),
});
export async function validate(
  root = path.resolve(".automation/portfolio-curator"),
  contentDir = path.resolve("src/content/activities"),
) {
  const policy = policySchema.parse(
    await readJson(path.join(root, "policy.json")),
  );
  assert.equal(
    new Set(policy.sources.map((s) => s.id)).size,
    policy.sources.length,
    "duplicate source ID",
  );
  for (const s of policy.sources)
    assert(
      policy.allowedHosts.includes(new URL(canonicalize(s.url)).hostname),
      "source allowlist",
    );
  const records = await readRecords(path.join(root, "candidates"));
  assert(records.length <= policy.maxCandidates, "Candidate cap");
  for (const { name, data } of records) {
    const c = candidate.parse(data);
    assert.equal(name, c.id + ".json");
  }
  const ledger = await readJson("docs/content-ledger.json");
  const seen = new Set();
  const contentRecords = await readRecords(contentDir);
  const legacyUrls = new Set(
    contentRecords
      .filter((r) => r.data.schemaVersion === 2 && r.data.url)
      .map((r) => canonicalize(r.data.url)),
  );
  for (const { name, data } of contentRecords) {
    const a = activitySchema.parse(data);
    if (a.schemaVersion === 2) {
      const m = ledger.mappings.find((m) => m.id + ".json" === name);
      assert(
        m && m.source === a.legacyRef,
        "New records cannot claim legacy status",
      );
    } else {
      assert(
        !legacyUrls.has(a.canonicalUrl) || a.occurrenceKey !== "artifact",
        "Curated record duplicates legacy activity",
      );
      const key = a.canonicalUrl + "\n" + a.occurrenceKey;
      assert(!seen.has(key), "duplicate curated occurrence");
      seen.add(key);
      const c = records.find(
        (r) => r.data.id === name.replace(/^curated-|\.json$/g, ""),
      );
      assert(c, "Candidate provenance required");
      const changedSourceDraft =
        c.data.status === "held" &&
        c.data.blocker === "source-facts-changed; human-reconcile" &&
        a.publicationStatus === "draft" &&
        a.editorialStatus === "hold";
      if (!changedSourceDraft)
        assert.equal(c.data.canonicalUrl, a.canonicalUrl);
      if (a.publicationStatus === "draft") {
        assert(c.data.proposal, "Draft requires candidate proposal");
        assert.deepEqual(
          c.data.proposal.relevance,
          a.relevance,
          "Draft and editorial decision disagree",
        );
      }
    }
  }
  const sources = await readJson(path.join(root, "sources.json"), {});
  for (const [id, s] of Object.entries(sources)) {
    assert(policy.sources.some((p) => p.id === id));
    z.strictObject({
      lastAttempt: timestamp,
      lastSuccessfulDiscovery: timestamp.optional(),
      lastSuccessfulVerification: timestamp.optional(),
      blocker: z.string().nullable(),
      partial: z.boolean().optional(),
    }).parse(s);
  }
  const migration = await readJson(path.join(root, "migration.json"), null);
  if (migration) {
    assert.match(migration.sourceSha256, /^[a-f0-9]{64}$/);
    for (const m of migration.mappings) {
      assert(
        /^(candidates|incidents)\/[a-f0-9]{24}\.json$|^decisions\/\d{4}\/[a-f0-9]{24}\.json$/.test(
          m.destination,
        ),
        "Unsafe migration destination",
      );
      assert(await readJson(path.join(root, m.destination)));
    }
  }
  const decisionRoot = path.join(root, "decisions");
  for (const year of await readdir(decisionRoot)) {
    if (!/^\d{4}$/.test(year)) continue;
    for (const { data } of await readRecords(path.join(decisionRoot, year)))
      z.strictObject({
        schemaVersion: z.literal(1),
        id: z.string().regex(/^[a-f0-9]{24}$/),
        canonicalUrl: z.string(),
        occurrenceKey: z.string(),
        decision: z.enum(["legacy-merged", "legacy-rejected"]),
        legacyKey: z.string(),
        legacy: z.record(z.string(), z.unknown()),
      }).parse(data);
  }
  for (const { data } of await readRecords(path.join(root, "incidents")))
    z.strictObject({
      schemaVersion: z.literal(1),
      id: z.string(),
      legacyKey: z.string(),
      title: z.string(),
      status: z.enum(["resolved", "open"]),
      firstSeen: timestamp,
      lastSeen: timestamp,
      recurrenceCount: z.number().int().nonnegative(),
      recentRecurrences: z.array(z.unknown()).max(5),
      legacy: z.record(z.string(), z.unknown()),
    }).parse(data);
  return {
    candidates: records.length,
    legacyMappings: migration?.mappings.length ?? 0,
  };
}
