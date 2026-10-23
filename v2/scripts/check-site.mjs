import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { parseHTML } from "linkedom";
const root = path.resolve("dist");
async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory()
          ? files(path.join(dir, e.name))
          : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const pages = (await files(root)).filter((f) => f.endsWith(".html"));
const excludedActivities = [];
for (const file of await readdir("src/content/activities")) {
  if (!file.endsWith(".json")) continue;
  const activity = JSON.parse(
    await readFile("src/content/activities/" + file, "utf8"),
  );
  if (
    activity.publicationStatus === "draft" ||
    activity.editorialStatus === "hold"
  )
    excludedActivities.push(file.slice(0, -5));
}
const canonicals = new Set();
const failures = [];
for (const file of pages) {
  const relative = path.relative(root, file);
  const html = await readFile(file, "utf8");
  const { document } = parseHTML(html);
  const check = (value, message) => {
    if (!value) failures.push(`${relative}: ${message}`);
  };
  check(document.querySelectorAll("h1").length === 1, "exactly one h1");
  check(["en", "ja"].includes(document.documentElement.lang), "language");
  check(
    document.querySelector('meta[name="description"]')?.content?.length > 20,
    "description",
  );
  for (const id of excludedActivities)
    check(
      !document.querySelector(`[data-activity-id="${id}"]`),
      `unpublished activity leaked: ${id}`,
    );
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  check(canonical?.startsWith("https://yukamiya.me/"), "canonical");
  check(!canonicals.has(canonical), "unique canonical");
  canonicals.add(canonical);
  check(!html.includes("[object Object]"), "invalid serialized content");
  check(
    document.querySelectorAll('script:not([type="application/ld+json"])')
      .length === 0,
    "no executable client scripts",
  );
  if (process.env.PUBLIC_RELEASE !== "production")
    check(
      document
        .querySelector('meta[name="robots"]')
        ?.content.includes("noindex"),
      "preview noindex",
    );
  for (const img of document.querySelectorAll("img"))
    check(img.hasAttribute("alt"), "image alternative text");
  for (const script of document.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    try {
      JSON.parse(script.textContent);
    } catch {
      check(false, "valid structured data");
    }
  }
  for (const el of document.querySelectorAll(
    "a[href],link[href],img[src],form[action]",
  )) {
    const raw =
      el.getAttribute("href") ??
      el.getAttribute("src") ??
      el.getAttribute("action");
    const u = new URL(raw, canonical);
    if (u.origin !== "https://yukamiya.me") continue;
    let target = path.join(root, decodeURIComponent(u.pathname));
    if (u.pathname.endsWith("/")) target = path.join(target, "index.html");
    try {
      assert((await stat(target)).isFile());
      if (u.hash && target.endsWith(".html")) {
        const d = parseHTML(await readFile(target, "utf8")).document;
        check(
          !!d.getElementById(decodeURIComponent(u.hash.slice(1))),
          `missing anchor ${raw}`,
        );
      }
    } catch {
      check(false, `missing internal target ${raw}`);
    }
  }
}
assert(pages.length >= 22, "Expected route inventory");
assert.equal(failures.length, 0, failures.join("\n"));
console.log(
  `Checked ${pages.length} pages: metadata, links, anchors, assets, image alternatives, structured data, preview indexing, draft exclusion and client scripts.`,
);
