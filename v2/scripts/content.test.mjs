import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
const json = async (p) => JSON.parse(await readFile(p, "utf8"));
const activities = await Promise.all(
  (await readdir("src/content/activities"))
    .filter((f) => f.endsWith(".json"))
    .map(async (f) => ({
      id: f.slice(0, -5),
      ...(await json(`src/content/activities/${f}`)),
    })),
);
const ledger = await json("docs/content-ledger.json");
test("every legacy activity remains traceable without duplicate IDs", () => {
  assert.equal(ledger.mappings.length, 82);
  assert.equal(new Set(activities.map((a) => a.id)).size, activities.length);
  for (const m of ledger.mappings) {
    const a = activities.find((a) => a.id === m.id);
    assert(a, m.source);
    assert.equal(a.legacyRef, m.source);
    assert.deepEqual(a.title, m.original.title);
  }
});
test("date precision matches supplied evidence", () => {
  for (const a of activities) {
    const d = a.date;
    const formats = {
      year: /^\d{4}$/,
      month: /^\d{4}-(0[1-9]|1[0-2])$/,
      day: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    };
    if (d.precision === "unknown") assert.equal(d.value, null);
    else assert.match(d.value, formats[d.precision], a.id);
  }
});
test("featured references resolve to intentionally selected content", async () => {
  const files = await readdir("src/content/profile");
  const profile = await json(`src/content/profile/${files[0]}`);
  for (const id of profile.featuredActivities) {
    const a = activities.find((a) => a.id === id);
    assert(a, id);
    assert.equal(a.editorialStatus, "selected");
    assert.equal(a.publicationStatus, "published");
    assert(a.summary?.en && a.summary?.ja);
  }
});
