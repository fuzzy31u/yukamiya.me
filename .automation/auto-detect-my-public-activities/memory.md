# Auto detect my public activities — working memory

`state.json` is the machine-readable authority. This file holds the durable, hard-won judgment calls that are not derivable from the data.

## Identity and validation

- Target person: Yu Kamiya / 神谷優, handles `fuzzy31u` and `yukamiya`. AI-Driven Office Manager & Tech DE&I Lead at CyberAgent.
- **Trust page metadata over search-result prose.** Search summaries repeatedly assert things the source page contradicts. Always fetch the source and read `<meta name="author">`, `og:url`, `article:published_time`, and the visible byline.
- **Byline ≠ speaker.** CyberAgent event reports are usually written by an events/PR person with Kamiya only presenting. Those are `speaking`, never `writing`. This exact trap produced the correct classification of `archives/52578/` (author: Sena Ishikawa; Kamiya presented).
- Authoritative enumerations, better than any search:
  - `https://developers.cyberagent.co.jp/blog/archives/author/yukamiya/` — 3 posts as of 2026-08. Page 2 is empty.
  - `https://zenn.dev/yukamiya` — 16 articles as of 2026-08.

## Known false positives — do not re-investigate

- `https://developers.cyberagent.co.jp/blog/archives/39730/` (CA BASE NEXT 2022) is **by `syuta`** (菅原シュウタ), not Kamiya. Verified: `<meta name="author" content="syuta">`, byline `WRITER: syuta`, zero occurrences of 神谷 / yukamiya / fuzzy31u. The `site:...blog yukamiya` search summary asserts she wrote it; that is a hallucination. Also recorded in `state.json → rejected_candidates`.
- A **different** 神谷優 — a Kanagawa University graduate student in architectural acoustics — won the 日本音響学会 学生優秀発表賞 (`https://www.kanagawa-u.ac.jp/news/details_25836.html`). Surfaces on `神谷優 受賞`. Never add to `awards`.
- Other name collisions that recur: 神谷優太 (footballer), 神谷浩史 (voice actor), Yuu Kamiya (novelist, *No Game No Life*), 神谷優里 (actress).

## Content rules

- **Never guess a date.** Use `month: "00"` when the event month is genuinely unpublished — it is the documented convention in `.github/ISSUE_TEMPLATE/content-addition-speaking.yml` and `src/components/TimelineSection.jsx` renders year-only for it. Precedent: the Women in Tech LT 2024 entry, where both co-host reports said only "先日".
- **Zenn is represented as a profile link only.** `about-content.js → links` carries the Zenn profile; 0 of 16 individual articles are enumerated (same treatment as the Findy list page). Adding one article is an editorial decision for the owner, not a deterministic automation change.
- About-page data lives in `src/data/about-content.js`, never `src/content/pages/about.md`.

## QA gotchas

- **`/about` static HTML contains only the first 10 speaking entries** (`TimelineSection.jsx` `slice(0, 10)`); the rest live in the JS bundle and render via the year filter / "もっと見る". Grepping `public/about/index.html` for a newly added entry gives a false negative — verify via the bundle plus a browser filter click.
- **The `QA Post Deploy` workflow generates false broken-link reports.** It runs on GitHub Actions (US cloud egress) and several Japanese hosts block cloud IPs. Issues #96, #93, #88, #102, #103 were all non-reproducing — every URL returned 200 from a normal connection, with real page content and matching `og:url`. **Always re-verify a link finding yourself, with and without a browser User-Agent, before treating it as real.**

## Cloud environment constraints

- **Some cloud runs have no external egress at all.** On 2026-08-13 the environment's network policy answered `403` to `CONNECT` for every external host — `developers.cyberagent.co.jp`, `zenn.dev`, `cyberagent.co.jp`, `yukamiya.me`, even `google.com` — so both `WebFetch` and `curl` were dead. `WebSearch` still works (it runs server-side, not through the egress proxy), as does GitHub via MCP and npm via the registry bypass. Check `$HTTPS_PROXY/__agentproxy/status` to confirm.
- Consequence: the sweep can still run, but **source-page validation and link verification cannot**. In that state, never promote a candidate on search-summary evidence alone — record it as `detected` with the egress blocker and leave its validation to a run with egress. Leave `last_checked_at` stale for the author-page sources, and skip `QA Post Deploy` (its link findings would be unverifiable).

## History

- Detection has found roughly one genuine new item per several weeks. An hourly cadence was tried and produced 11 consecutive empty sweeps before exhausting the session search budget; weekly matches the real rate.
- Last shipped change: PR #101 (merged 2026-08-09) added the Women in Tech LT 2024 speaking entry. Verified live in production.
- 2026-08-13: empty sweep (18 queries, 0 new). Every hit was already in `about-content.js` or a known collision.
