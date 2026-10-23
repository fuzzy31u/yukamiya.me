import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { activitySchema } from "./schemas/activity.mjs";
import { glob } from "astro/loaders";
const localized = z.object({ en: z.string().min(1), ja: z.string().min(1) });
const httpsUrl = z
  .url()
  .refine((v) => new URL(v).protocol === "https:", "HTTPS required");
const evidence = z.object({
  title: z.string(),
  url: httpsUrl,
  note: z.string().optional(),
});
const profile = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/profile" }),
  schema: z.object({
    name: localized,
    headline: localized,
    intro: localized,
    role: localized,
    biography: z.object({ en: z.array(z.string()), ja: z.array(z.string()) }),
    philosophy: localized,
    philosophyBody: localized,
    career: z.array(
      z.object({ period: localized, title: localized, company: z.string() }),
    ),
    education: z.array(
      z.object({
        period: z.string(),
        degree: localized,
        field: localized,
        school: localized,
      }),
    ),
    links: z.array(z.object({ label: z.string(), url: httpsUrl })),
    featuredWork: z.array(z.string()),
    featuredActivities: z.array(z.string()),
  }),
});
const activities = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/activities" }),
  schema: activitySchema,
});
const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/work" }),
  schema: z.object({
    translationKey: z.string(),
    locale: z.enum(["en", "ja"]),
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    role: z.string(),
    organization: z.string(),
    timeframe: z.string(),
    context: z.string(),
    problem: z.string(),
    approach: z.array(z.string()).min(1),
    outcome: z.string(),
    limitations: z.string(),
    metrics: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        kind: z.enum(["scope", "observed-result", "target"]),
        sourceUrl: httpsUrl,
      }),
    ),
    evidence: z.array(evidence).min(1),
    featured: z.boolean(),
    priority: z.number(),
    visibility: z.enum(["published", "draft"]),
    seoDescription: z.string(),
  }),
});
const writing = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.literal("ja"),
    date: z.string(),
    legacyPath: z.string(),
  }),
});
export const collections = { profile, activities, work, writing };
