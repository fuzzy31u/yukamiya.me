import path from "node:path";
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { readJson, writeJson, readRecords, locked } from "./store.mjs";
import {
  candidate,
  canonicalize,
  freshCandidate,
  retry,
  disposition,
  proposal,
} from "./core.mjs";
import { fetchPublic } from "./network.mjs";
import { discover, verify } from "./adapters.mjs";
import { policySchema } from "./validate.mjs";
import { curatedActivity } from "../../src/schemas/activity.mjs";
export async function knownUrls(root, contentDir, ignoredContentName = null) {
  const keys = new Set();
  for (const { name, data } of await readRecords(contentDir))
    if (name !== ignoredContentName && data.url)
      keys.add(
        canonicalize(data.url) + "\n" + (data.occurrenceKey ?? "artifact"),
      );
  const dir = path.join(root, "decisions");
  await readRecords(dir);
  for (const year of await readdir(dir)) {
    if (!/^\d{4}$/.test(year)) continue;
    for (const { data } of await readRecords(path.join(dir, year)))
      if (data.canonicalUrl)
        keys.add(canonicalize(data.canonicalUrl) + "\nartifact");
  }
  return keys;
}
export async function sweep({
  root,
  contentDir,
  policy,
  now = new Date().toISOString(),
  fetcher = fetchPublic,
}) {
  policy = policySchema.parse(policy);
  return locked(root, async () => {
    const records = (await readRecords(path.join(root, "candidates"))).map(
      ({ data }) => candidate.parse(data),
    );
    const existing = await knownUrls(root, contentDir);
    const coverage = await readJson(path.join(root, "sources.json"), {});
    const report = {
      fetched: 0,
      discovered: 0,
      verified: 0,
      blocked: 0,
      overflow: 0,
      partialSources: [],
      errors: [],
    };
    for (const source of policy.sources) {
      if (report.fetched >= policy.maxFetchesPerRun) break;
      const state = { ...coverage[source.id], lastAttempt: now };
      report.fetched++;
      try {
        const response = await fetcher(source.url, policy);
        const found = discover(source, response);
        if (found.partial) report.partialSources.push(source.id);
        for (const item of found.items) {
          const c = freshCandidate(item.url, source.id, now, item.title);
          if (
            existing.has(c.canonicalUrl + "\nartifact") ||
            records.some(
              (r) =>
                r.canonicalUrl === c.canonicalUrl ||
                r.aliases.includes(c.canonicalUrl),
            )
          )
            continue;
          if (records.length >= policy.maxCandidates) {
            report.overflow++;
            continue;
          }
          records.push(c);
          report.discovered++;
        }
        state.lastSuccessfulDiscovery = now;
        state.blocker = null;
        state.partial = found.partial;
      } catch (error) {
        state.blocker = error.message;
        report.errors.push({ source: source.id, error: error.message });
      }
      coverage[source.id] = state;
    }
    for (let index = 0; index < records.length; index++) {
      let c = records[index];
      if (report.fetched >= policy.maxFetchesPerRun) break;
      if (
        !["detected", "blocked"].includes(c.status) ||
        (c.nextRetryAt && c.nextRetryAt > now)
      )
        continue;
      const source = policy.sources.find((s) => s.id === c.sourceId);
      if (!source) continue;
      report.fetched++;
      try {
        const response = await fetcher(c.canonicalUrl, policy);
        const evidence = verify(source, response, now);
        if (evidence.url !== c.canonicalUrl) {
          c.aliases = [...new Set([...c.aliases, c.canonicalUrl])];
          c.canonicalUrl = evidence.url;
        }
        if (
          existing.has(c.canonicalUrl + "\n" + c.occurrenceKey) ||
          records.some(
            (other, i) =>
              i !== index &&
              other.canonicalUrl === c.canonicalUrl &&
              other.occurrenceKey === c.occurrenceKey,
          )
        ) {
          c.status = "held";
          c.blocker = "canonical-duplicate-requires-reconciliation";
        } else {
          c.status = "verified";
          c.blocker = null;
          c.evidence = evidence;
          c.nextRetryAt = null;
          report.verified++;
          if (coverage[source.id])
            coverage[source.id].lastSuccessfulVerification = now;
        }
      } catch (error) {
        c = retry(c, now, error.message);
        report.blocked++;
      }
      records[index] = candidate.parse(c);
    }
    for (const c of records)
      await writeJson(path.join(root, "candidates", c.id + ".json"), c);
    await writeJson(path.join(root, "sources.json"), coverage);
    return report;
  });
}
export async function propose({
  root,
  contentDir,
  policy,
  proposals,
  now = new Date().toISOString(),
  fetcher = fetchPublic,
}) {
  policy = policySchema.parse(policy);
  return locked(root, async () => {
    if (proposals.length > policy.maxProposals)
      throw new Error("Review budget exceeded");
    const planned = [];
    const known = await knownUrls(root, contentDir);
    for (const input of proposals) {
      const p = proposal.parse(input);
      const c = candidate.parse(
        await readJson(path.join(root, "candidates", p.candidateId + ".json")),
      );
      if (
        !["verified", "held", "declined", "proposed"].includes(c.status) ||
        !c.evidence
      )
        throw new Error("Candidate requires verified source");
      if (c.blocker === "source-facts-changed; human-reconcile")
        throw new Error("Source-changed draft requires human reconciliation");
      const decision = disposition(p.relevance);
      if (decision !== "propose") {
        const file = path.join(contentDir, "curated-" + c.id + ".json");
        const previous = await readJson(file, null);
        let activity = null;
        if (previous) {
          if (previous.publicationStatus !== "draft")
            throw new Error("Never overwrite published content");
          if (
            !c.proposal ||
            !sameEditorialCopy(previous, c.proposal) ||
            !sameEditorialCopy(previous, p) ||
            ![c.proposal.relevance, p.relevance].some(
              (r) => JSON.stringify(r) === JSON.stringify(previous.relevance),
            )
          )
            throw new Error(
              "Existing draft was edited; human reconciliation required before rescoring",
            );
          // Keep the hidden draft and its editorial copy, while making its
          // score agree with the new candidate decision.
          activity = curatedActivity.parse({
            ...previous,
            relevance: p.relevance,
          });
        }
        planned.push({
          c: {
            ...c,
            proposal: p,
            status: decision === "hold" ? "held" : "declined",
            blocker: "editorial-" + decision,
          },
          activity,
          file,
        });
        continue;
      }
      const source = policy.sources.find((s) => s.id === c.sourceId);
      if (!source) throw new Error("Unknown source");
      const current = verify(
        source,
        await fetcher(c.canonicalUrl, policy),
        now,
      );
      if (
        current.url !== c.evidence.url ||
        current.sourceTitle !== c.evidence.sourceTitle ||
        current.sourceDate.value !== c.evidence.sourceDate.value ||
        current.identity !== c.evidence.identity
      )
        throw new Error("Source facts changed; reverify candidate");
      if (p.title[p.originalLanguage] !== current.sourceTitle)
        throw new Error("Original title must match source exactly");
      const key = c.canonicalUrl + "\n" + c.occurrenceKey;
      const file = path.join(contentDir, "curated-" + c.id + ".json");
      const previous = await readJson(file, null);
      if (known.has(key) && !previous) throw new Error("Duplicate activity");
      const activity = curatedActivity.parse({
        schemaVersion: 3,
        kind: p.kind,
        title: p.title,
        summary: p.summary,
        date: current.sourceDate,
        url: current.url,
        canonicalUrl: current.url,
        aliases: c.aliases,
        occurrenceKey: c.occurrenceKey,
        sourceId: c.sourceId,
        originalLanguage: p.originalLanguage,
        verificationStatus: "verified",
        editorialStatus: "hold",
        publicationStatus: "draft",
        detectedAt: c.detectedAt,
        evidence: current,
        relevance: p.relevance,
      });
      if (previous) {
        if (previous.publicationStatus !== "draft")
          throw new Error("Never overwrite published content");
        // Retry without refreshing timestamps or silently rewriting an edited draft.
        const stable = (a) =>
          JSON.stringify({
            ...a,
            evidence: { ...a.evidence, checkedAt: "", sha256: "" },
          });
        if (stable(previous) !== stable(activity))
          throw new Error(
            "Existing draft differs; human reconciliation required",
          );
        activity.evidence = previous.evidence;
      }
      known.add(key);
      planned.push({
        c: { ...c, status: "proposed", proposal: p, blocker: null },
        activity,
        file,
      });
    }
    for (const item of planned) {
      if (item.activity) await writeJson(item.file, item.activity);
      await writeJson(
        path.join(root, "candidates", item.c.id + ".json"),
        candidate.parse(item.c),
      );
    }
    return {
      drafts: planned.filter((p) => p.c.status === "proposed").length,
      heldOrDeclined: planned.filter((p) => p.c.status !== "proposed").length,
    };
  });
}
function sameEditorialCopy(activity, proposal) {
  return (
    activity.kind === proposal.kind &&
    activity.originalLanguage === proposal.originalLanguage &&
    JSON.stringify(activity.title) === JSON.stringify(proposal.title) &&
    JSON.stringify(activity.summary) === JSON.stringify(proposal.summary)
  );
}

export async function reverify({
  root,
  contentDir,
  policy,
  id,
  now = new Date().toISOString(),
  fetcher = fetchPublic,
}) {
  policy = policySchema.parse(policy);
  if (!/^[a-f0-9]{24}$/.test(id)) throw new Error("Invalid candidate ID");
  return locked(root, async () => {
    const file = path.join(root, "candidates", id + ".json");
    const c = candidate.parse(await readJson(file));
    if (!["verified", "held", "declined", "proposed"].includes(c.status))
      throw new Error("Only verified candidates can be reverified");
    const activityName = "curated-" + id + ".json";
    const activity = await readJson(path.join(contentDir, activityName), null);
    if (activity && activity.publicationStatus !== "draft")
      throw new Error("Never overwrite published content");
    if (activity) curatedActivity.parse(activity);
    const source = policy.sources.find((s) => s.id === c.sourceId);
    if (!source) throw new Error("Unknown source");
    const current = verify(source, await fetcher(c.canonicalUrl, policy), now);
    const otherCandidates = (await readRecords(path.join(root, "candidates")))
      .filter(({ data }) => data.id !== id)
      .map(({ data }) => candidate.parse(data));
    if (
      (await knownUrls(root, contentDir, activityName)).has(
        current.url + "\n" + c.occurrenceKey,
      ) ||
      otherCandidates.some(
        (other) =>
          other.canonicalUrl === current.url &&
          other.occurrenceKey === c.occurrenceKey,
      )
    )
      throw new Error("Canonical duplicate requires human reconciliation");
    const sourceFactsChanged =
      current.url !== c.evidence?.url ||
      current.sourceTitle !== c.evidence?.sourceTitle ||
      current.sourceDate.value !== c.evidence?.sourceDate.value ||
      current.sourceDate.precision !== c.evidence?.sourceDate.precision ||
      current.identity !== c.evidence?.identity;
    const needsEditorialReview =
      !!activity &&
      (sourceFactsChanged ||
        c.blocker === "source-facts-changed; human-reconcile");
    const updated = candidate.parse({
      ...c,
      canonicalUrl: current.url,
      aliases:
        current.url === c.canonicalUrl
          ? c.aliases
          : [...new Set([...c.aliases, c.canonicalUrl])],
      title: current.sourceTitle,
      status: needsEditorialReview ? "held" : activity ? c.status : "verified",
      attempts: 0,
      nextRetryAt: null,
      blocker: needsEditorialReview
        ? "source-facts-changed; human-reconcile"
        : activity
          ? c.blocker
          : null,
      evidence: current,
      proposal: activity ? c.proposal : undefined,
    });
    await writeJson(file, updated);
    return {
      id,
      status: updated.status,
      canonicalUrl: updated.canonicalUrl,
      needsEditorialReview,
    };
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const root = path.resolve(".automation/portfolio-curator");
  const policy = await readJson(path.join(root, "policy.json"));
  const contentDir = path.resolve("src/content/activities");
  const [command, file] = process.argv.slice(2);
  if (command === "sweep")
    console.log(
      JSON.stringify(await sweep({ root, contentDir, policy }), null, 2),
    );
  else if (command === "propose" && file)
    console.log(
      JSON.stringify(
        await propose({
          root,
          contentDir,
          policy,
          proposals: await readJson(file),
        }),
        null,
        2,
      ),
    );
  else if (command === "retry" && /^[a-f0-9]{24}$/.test(file ?? "")) {
    await locked(root, async () => {
      const dest = path.join(root, "candidates", file + ".json");
      const c = candidate.parse(await readJson(dest));
      if (c.status !== "blocked")
        throw new Error("Only blocked candidates can be retried");
      await writeJson(dest, {
        ...c,
        status: "detected",
        nextRetryAt: null,
        blocker: "manual-retry-requested",
      });
    });
    console.log("Candidate queued for re-verification.");
  } else if (command === "reverify" && /^[a-f0-9]{24}$/.test(file ?? "")) {
    console.log(
      JSON.stringify(
        await reverify({ root, contentDir, policy, id: file }),
        null,
        2,
      ),
    );
  } else
    throw new Error(
      "Usage: run.mjs sweep | propose <editorial-proposals.json> | retry <blocked-id> | reverify <candidate-id>",
    );
}
