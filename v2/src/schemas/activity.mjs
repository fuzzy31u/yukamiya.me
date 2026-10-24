import { z } from "zod";
import {
  date,
  localized,
  url,
  timestamp,
  evidence,
  relevance,
  score,
} from "../../scripts/curator/core.mjs";
const kinds = z.enum([
  "awards",
  "certifications",
  "speaking",
  "organizedEvents",
  "research",
  "writing",
  "media",
  "podcasts",
]);
const common = {
  kind: kinds,
  title: localized,
  date,
  url: url.optional(),
  venue: z.string().optional(),
  role: z.string().optional(),
  originalLanguage: z.enum(["ja", "en", "unknown"]),
  verificationStatus: z.enum(["legacy-import", "verified", "pending"]),
  editorialStatus: z.enum(["retained", "selected", "hold"]),
  publicationStatus: z.enum(["published", "draft", "archived"]),
  summary: localized.optional(),
};
const legacy = z.strictObject({
  schemaVersion: z.literal(2),
  ...common,
  legacyRef: z.string().min(1),
});
export const curatedActivity = z
  .strictObject({
    schemaVersion: z.literal(3),
    ...common,
    url,
    canonicalUrl: url,
    aliases: z.array(url).max(20),
    occurrenceKey: z.string().min(1).max(200),
    sourceId: z.string().min(1),
    detectedAt: timestamp,
    evidence,
    relevance,
    verificationStatus: z.literal("verified"),
    editorialStatus: z.enum(["hold", "selected"]),
    publicationStatus: z.enum(["draft", "published"]),
    summary: localized,
  })
  .superRefine((a, ctx) => {
    if (a.url !== a.canonicalUrl || a.url !== a.evidence.url)
      ctx.addIssue({
        code: "custom",
        message: "Canonical/evidence URL mismatch",
      });
    if (
      a.date.value !== a.evidence.sourceDate.value ||
      a.date.precision !== a.evidence.sourceDate.precision
    )
      ctx.addIssue({
        code: "custom",
        message: "Date must match verified source",
      });
    if (
      a.publicationStatus === "published" &&
      (a.editorialStatus !== "selected" || score(a.relevance) < 8)
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Published activity requires editorial selection and relevance >= 8",
      });
  });
export const activitySchema = z.union([legacy, curatedActivity]);
