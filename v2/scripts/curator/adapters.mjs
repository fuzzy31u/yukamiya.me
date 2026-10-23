import { parseHTML } from "linkedom";
import { canonicalize, hash, evidence } from "./core.mjs";
const clean = (s) => s?.replace(/\s+/g, " ").trim();
export function discover(source, response) {
  if (source.adapter === "zenn-author") {
    const data = JSON.parse(response.body);
    if (!Array.isArray(data.articles))
      throw new Error("unexpected-zenn-response");
    if (
      data.articles.length &&
      !data.articles.some((a) => a.user?.username === "yukamiya")
    )
      throw new Error("enumeration-author-mismatch");
    return {
      items: data.articles
        .filter((a) => a.user?.username === "yukamiya")
        .map((a) => ({
          url: canonicalize(new URL(a.path, "https://zenn.dev").href),
          title: a.title,
        })),
      partial: !!data.next_page,
    };
  }
  const { document } = parseHTML(response.body);
  const urls = [...document.querySelectorAll("a[href]")]
    .map((a) => new URL(a.getAttribute("href"), response.url).href)
    .filter((u) =>
      /^https:\/\/developers\.cyberagent\.co\.jp\/blog\/archives\/\d+\/$/.test(
        u,
      ),
    );
  if (!urls.length) throw new Error("enumeration-empty-unverified");
  return {
    items: [...new Set(urls)].map((url) => ({ url, title: url })),
    partial: !!document.querySelector("a.next, .next.page-numbers"),
  };
}
export function verify(source, response, now) {
  const { document } = parseHTML(response.body);
  const meta = (k) =>
    document
      .querySelector(`meta[property="${k}"],meta[name="${k}"]`)
      ?.getAttribute("content");
  const canonical =
    document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
    meta("og:url");
  if (!canonical) throw new Error("canonical-missing");
  const url = canonicalize(new URL(canonical, response.url).href);
  if (new URL(url).hostname !== new URL(response.url).hostname)
    throw new Error("canonical-host-conflict");
  let identity = meta("author");
  let published = meta("article:published_time");
  let title = clean(
    meta("og:title") || document.querySelector("h1")?.textContent,
  );
  if (source.adapter === "zenn-author") {
    const raw = document.querySelector("script#__NEXT_DATA__")?.textContent;
    if (!raw) throw new Error("identity-unverifiable");
    const page = JSON.parse(raw)?.props?.pageProps;
    const article = page?.article;
    if (
      !article?.path ||
      canonicalize(new URL(article.path, response.url).href) !== url ||
      article.status !== "published"
    )
      throw new Error("article-identity-conflict");
    identity = page?.user?.username;
    published = article?.publishedAt || article?.published_at;
    title = clean(article?.title) || title;
  }
  if (!identity) throw new Error("identity-unverifiable");
  if (identity !== "yukamiya") throw new Error("identity-conflict");
  if (!published && source.adapter === "cyberagent-author")
    published = document
      .querySelector("time.entry-date.published")
      ?.getAttribute("datetime");
  if (!title || !published || !/^\d{4}-\d{2}-\d{2}/.test(published))
    throw new Error("title-or-date-missing");
  return evidence.parse({
    url,
    checkedAt: now,
    sha256: hash(response.body),
    sourceTitle: title,
    sourceDate: { value: published.slice(0, 10), precision: "day" },
    identity,
    identityMethod: "author-metadata",
    canonicalMethod: document.querySelector('link[rel="canonical"]')
      ? "canonical"
      : "og:url",
    adapter: source.adapter,
  });
}
