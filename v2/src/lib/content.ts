import { getCollection, getEntry } from "astro:content";
import type { Locale } from "./i18n";
export async function getProfile() {
  const profile = await getEntry("profile", "yu");
  if (!profile) throw new Error("Missing profile");
  return profile.data;
}
export async function getWork(locale: Locale) {
  return (
    await getCollection(
      "work",
      ({ data }) => data.locale === locale && data.visibility === "published",
    )
  ).sort((a, b) => a.data.priority - b.data.priority);
}
export async function getActivities() {
  return (
    await getCollection(
      "activities",
      ({ data }) =>
        data.publicationStatus !== "draft" && data.editorialStatus !== "hold",
    )
  ).sort(
    (a, b) =>
      (b.data.date.value ?? "").localeCompare(a.data.date.value ?? "") ||
      a.id.localeCompare(b.id),
  );
}
