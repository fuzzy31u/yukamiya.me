import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const source = await readFile(
  new URL("../../src/data/about-content.js", import.meta.url),
  "utf8",
);
const legacy = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const root = new URL("../", import.meta.url);
const categories = [
  "awards",
  "certifications",
  "speaking",
  "organizedEvents",
  "research",
  "writing",
  "media",
  "podcasts",
];
const mappings = [];
for (const kind of categories) {
  for (const [index, item] of legacy[kind].entries()) {
    const seed = `${kind}|${item.url || item.title.en}|${item.year || ""}|${item.month || ""}`;
    const id = `${kind}-${createHash("sha256").update(seed).digest("hex").slice(0, 12)}`;
    const value = item.year
      ? `${item.year}${item.month && item.month !== "00" ? `-${item.month}` : ""}`
      : null;
    const record = {
      schemaVersion: 2,
      kind,
      title: item.title,
      date: {
        value,
        precision: value ? (value.length === 4 ? "year" : "month") : "unknown",
      },
      ...(item.url ? { url: item.url } : {}),
      ...(item.venue || item.org ? { venue: item.venue || item.org } : {}),
      ...(item.role ? { role: item.role } : {}),
      originalLanguage: "unknown",
      verificationStatus: "legacy-import",
      editorialStatus: "retained",
      publicationStatus: "archived",
      legacyRef: `src/data/about-content.js#${kind}[${index}]`,
    };
    await writeFile(
      new URL(`src/content/activities/${id}.json`, root),
      JSON.stringify(record, null, 2) + "\n",
    );
    mappings.push({
      source: record.legacyRef,
      id,
      disposition: "retained in archive",
      original: item,
    });
  }
}
await mkdir(new URL("docs", root), { recursive: true });
await writeFile(
  new URL("docs/content-ledger.json", root),
  JSON.stringify(
    {
      sourceSha: "8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b",
      mappings,
      profileSource: {
        workHistory: legacy.workHistory,
        education: legacy.education,
        links: legacy.links,
        highlights: legacy.highlights,
      },
      otherSources: [
        "src/data/home-content.js",
        "src/content/pages/index.md",
        "src/content/pages/contact.md",
        "src/content/posts/20210128.md",
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Preserved ${mappings.length} activity records; career, education, links and highlights recorded in ledger.`,
);
