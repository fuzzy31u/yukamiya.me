import { createHash } from "node:crypto";
import { z } from "zod";
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export function canonicalize(raw) {
  const u = new URL(raw);
  if (u.protocol !== "https:" || u.username || u.password || u.port)
    throw new Error("Public HTTPS URL required");
  u.hash = "";
  for (const key of [...u.searchParams.keys()])
    if (/^utm_/i.test(key) || ["fbclid", "gclid"].includes(key))
      u.searchParams.delete(key);
  u.searchParams.sort();
  return u.href;
}
export const text = z
  .string()
  .min(1)
  .max(4000)
  .refine((s) => !/[<>\u0000-\u0008]/.test(s), "Plain text only");
export const url = z.string().transform(canonicalize);
export const timestamp = z.iso.datetime({ offset: true });
export const localized = z.strictObject({ en: text, ja: text });
export const date = z
  .strictObject({
    value: z.string().nullable(),
    precision: z.enum(["year", "month", "day", "unknown"]),
  })
  .superRefine((d, ctx) => {
    const patterns = {
      year: /^\d{4}$/,
      month: /^\d{4}-(0[1-9]|1[0-2])$/,
      day: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    };
    if (d.precision === "unknown") {
      if (d.value !== null)
        ctx.addIssue({ code: "custom", message: "Unknown date must be null" });
      return;
    }
    if (
      !patterns[d.precision].test(d.value ?? "") ||
      (d.precision === "day" &&
        new Date(d.value + "T00:00:00Z").toISOString().slice(0, 10) !== d.value)
    )
      ctx.addIssue({
        code: "custom",
        message: "Invalid calendar date or precision",
      });
  });
export const relevance = z.strictObject({
  policyVersion: z.literal(1),
  contribution: z.number().int().min(0).max(2),
  substance: z.number().int().min(0).max(2),
  fit: z.number().int().min(0).max(2),
  evidence: z.number().int().min(0).max(2),
  distinctness: z.number().int().min(0).max(2),
  rationale: text,
});
export function score(r) {
  return [
    "contribution",
    "substance",
    "fit",
    "evidence",
    "distinctness",
  ].reduce((n, k) => n + r[k], 0);
}
export function disposition(r) {
  const n = score(relevance.parse(r));
  return n >= 8 ? "propose" : n >= 5 ? "hold" : "decline";
}
export function candidateId(canonicalUrl, occurrenceKey = "artifact") {
  return hash(canonicalize(canonicalUrl) + "\n" + occurrenceKey).slice(0, 24);
}
export const evidence = z.strictObject({
  url,
  checkedAt: timestamp,
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  sourceTitle: text,
  sourceDate: date,
  identity: text,
  identityMethod: z.literal("author-metadata"),
  canonicalMethod: z.enum(["canonical", "og:url"]),
  adapter: z.enum(["cyberagent-author", "zenn-author"]),
});
export const proposal = z.strictObject({
  candidateId: z.string().regex(/^[a-f0-9]{24}$/),
  title: localized,
  summary: localized,
  relevance,
  kind: z.literal("writing"),
  originalLanguage: z.enum(["ja", "en"]),
});
export const candidate = z
  .strictObject({
    schemaVersion: z.literal(1),
    id: z.string().regex(/^[a-f0-9]{24}$/),
    canonicalUrl: url,
    aliases: z.array(url).max(20),
    occurrenceKey: text,
    sourceId: text,
    title: text,
    detectedAt: timestamp,
    status: z.enum([
      "detected",
      "verified",
      "blocked",
      "held",
      "declined",
      "proposed",
    ]),
    attempts: z.number().int().min(0).max(1000),
    nextRetryAt: timestamp.nullable(),
    blocker: z.string().max(1000).nullable(),
    evidence: evidence.optional(),
    proposal: proposal.optional(),
    legacy: z
      .object({
        key: z.string(),
        status: z.string(),
        record: z.record(z.string(), z.unknown()),
      })
      .optional(),
  })
  .superRefine((c, ctx) => {
    if (["verified", "proposed"].includes(c.status) && !c.evidence)
      ctx.addIssue({
        code: "custom",
        message: "Verified stage requires evidence",
      });
    if (c.status === "proposed" && !c.proposal)
      ctx.addIssue({
        code: "custom",
        message: "Proposed stage requires editorial proposal",
      });
    if (c.evidence && c.evidence.url !== c.canonicalUrl)
      ctx.addIssue({
        code: "custom",
        message: "Candidate/evidence canonical mismatch",
      });
  });
export function retry(c, now, reason) {
  const attempts = Math.min(c.attempts + 1, 1000);
  return {
    ...c,
    status: "blocked",
    attempts,
    blocker: reason.slice(0, 1000),
    nextRetryAt: new Date(
      Date.parse(now) +
        Math.min(2 ** Math.min(attempts, 10) * 3600000, 7 * 86400000),
    ).toISOString(),
  };
}
export function freshCandidate(
  raw,
  sourceId,
  now,
  title = raw,
  occurrenceKey = "artifact",
) {
  const canonicalUrl = canonicalize(raw);
  return candidate.parse({
    schemaVersion: 1,
    id: candidateId(canonicalUrl, occurrenceKey),
    canonicalUrl,
    aliases: [],
    occurrenceKey,
    sourceId,
    title,
    detectedAt: now,
    status: "detected",
    attempts: 0,
    nextRetryAt: null,
    blocker: null,
  });
}
