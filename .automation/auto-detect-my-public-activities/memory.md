# Auto detect my public activities — working memory

`state.json` is the machine-readable authority. This file holds the durable, hard-won judgment calls that are not derivable from the data.

## Identity and validation

- Target person: Yu Kamiya / 神谷優, handles `fuzzy31u` and `yukamiya`. AI-Driven Office Manager & Tech DE&I Lead at CyberAgent.
- **Trust page metadata over search-result prose.** Search summaries repeatedly assert things the source page contradicts. Always fetch the source and read `<meta name="author">`, `og:url`, `article:published_time`, and the visible byline.
- **Byline ≠ speaker.** CyberAgent event reports are usually written by an events/PR person with Kamiya only presenting. Those are `speaking`, never `writing`. This exact trap produced the correct classification of `archives/52578/` (author: Sena Ishikawa; Kamiya presented).
- Authoritative enumerations, better than any search:
  - `https://developers.cyberagent.co.jp/blog/archives/author/yukamiya/` — 3 posts as of 2026-08. Page 2 is empty.
  - `https://zenn.dev/yukamiya` — 16 articles as of 2026-08.
  - `https://woman.nikkei.com/atcl/author/02667/` — 日経xwoman author page, identified 2026-08-16. **Confirmed the right 神谷優**: the bio matches on every specific — AIドリブン推進室 Enabling Group マネージャー, Tech DE&I Project 発足 2023-01, Women Techmakers Ambassador, Forbes JAPAN Women In Tech 30 2024, 現職 2025-08. Not yet enumerated (the run that found it had no egress); `about-content.js` carries only one 日経xwoman article, so this page may list untracked ones. Fetch it on the next run with egress.

## Known false positives — do not re-investigate

- `https://developers.cyberagent.co.jp/blog/archives/39730/` (CA BASE NEXT 2022) is **by `syuta`** (菅原シュウタ), not Kamiya. Verified: `<meta name="author" content="syuta">`, byline `WRITER: syuta`, zero occurrences of 神谷 / yukamiya / fuzzy31u. The `site:...blog yukamiya` search summary asserts she wrote it; that is a hallucination. Also recorded in `state.json → rejected_candidates`.
- A **different** 神谷優 — a Kanagawa University graduate student in architectural acoustics — won the 日本音響学会 学生優秀発表賞 (`https://www.kanagawa-u.ac.jp/news/details_25836.html`). Surfaces on `神谷優 受賞`. Never add to `awards`.
- Other name collisions that recur: 神谷優太 (footballer), 神谷浩史 (voice actor), Yuu Kamiya (novelist, *No Game No Life*), 神谷優里 (actress), 神谷康司 (designer), 神谷智仁 (Zenn author `densan_kamiyat`).
- **The `site:developers.cyberagent.co.jp/blog yukamiya` summary invents author attributions.** It returns the blog top page and then narrates "posts by yukamiya" assembled from whatever is listed there — the newest post on the blog plus the known-false CA BASE NEXT 2022 one. Seen 2026-08-23 attributing a 2026-08-17 post on 新旧MetricKitの共存 (iOS 27 / タップル) to her. She has exactly 3 posts (50516, 51796, 63720). Treat any post from this query's prose as unvalidated until the author page or `<meta name="author">` confirms it; never open an issue off it.
- **The MetricKit post is `archives/65298`, published 2026-08-12, and search attributes it to Kanta Oikawa** — not 2026-08-17 and not her, as narrowed on 2026-08-30. Still parked rather than rejected: search prose is the evidence class that created the false positive, so it cannot also retire it. One fetch of `archives/65298` from a run with egress closes it.
- `https://developers.cyberagent.co.jp/blog/archives/55718/` (Technovation Girls TA) is **by 清水 良一** of 技術広報, who was the TA himself. It surfaces on `site:...blog 神谷優` only because it is a Tech DE&I post and she leads that project. **A project mention is not an activity** — the same distinction as byline ≠ speaker. Recorded in `rejected_candidates` with `evidence_level: search_only`.
- **Park an unvalidated candidate as an `activities` entry, not in `runs.last_result`.** `last_result` is overwritten every run, so a candidate recorded only there is lost. Give it a `status: detected` entry with the blocker and the next step — a normalized fallback key when no canonical URL was returned. The MetricKit candidate above is the precedent (`unvalidated:ca-devblog-metrickit-2026-08-17`).

## Content rules

- **Never guess a date.** Use `month: "00"` when the event month is genuinely unpublished — it is the documented convention in `.github/ISSUE_TEMPLATE/content-addition-speaking.yml` and `src/components/TimelineSection.jsx` renders year-only for it. Precedent: the Women in Tech LT 2024 entry, where both co-host reports said only "先日".
- **Zenn is represented as a profile link only.** `about-content.js → links` carries the Zenn profile; 0 of 16 individual articles are enumerated (same treatment as the Findy list page). Adding one article is an editorial decision for the owner, not a deterministic automation change.
- About-page data lives in `src/data/about-content.js`, never `src/content/pages/about.md`.

## Review gate gotchas

- **Greptile edits its existing summary comment in place on re-review** — the `Reviews (N): Last reviewed commit` footer increments and the score is rewritten; it does not post a new comment. Polling for *new* comments therefore makes a finished re-review look like silence. On 2026-08-23 this run twice concluded Greptile had "never re-scored" while its summary already read 5/5. **Re-read the existing Greptile comment and check its score and footer commit, not the comment list.**
- A Claude Code Review run can take far longer than the first one on the same PR; a step sitting at `in_progress` is not a wedged workflow. Never push an empty commit to kick it.

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
- 2026-08-16: empty sweep (21 queries, 0 new), egress blocked again — the no-egress cloud environment is now the norm, not a one-off. Only durable output was the 日経xwoman author page above.
- 2026-08-30: empty sweep (25 queries, 0 new), egress blocked for the fourth run running. `gh` is not installed in the cloud image either — GitHub access is MCP-only, so plan around that rather than treating a missing `gh` as a preflight failure. Durable output: the MetricKit candidate narrowed to `archives/65298`, `archives/55718` rejected, a second Zenn article parked.
- 2026-08-23: empty sweep (24 queries, 0 new), egress blocked for the third run running. Assume no egress and plan the run around `WebSearch` + GitHub MCP; check `$HTTPS_PROXY/__agentproxy/status` and one `curl` before assuming otherwise. Note the status endpoint reports `enabled: true` with no relay failures even while every `CONNECT` is refused — it is not a usable egress signal.

## Same activity, different URL

- CyberAgent announces its own people's talks on `cyberagent.co.jp/techinfo/news/`, so one talk often has both a CA announcement URL and an organizer URL. `about-content.js` links the organizer page. Dedup by **event**, not by URL, or the announcement looks like a second activity. Seen 2026-08-16: `techinfo/news/detail/id=27174` (Women Developers Summit 登壇) is the announcement for the already-tracked `event.shoeisha.jp/devsumi/20211117/session/3515/`.
- Seen 2026-08-23, same pattern: `id=31073` (プロダクトヒストリーカンファレンス2024) → tracked as `youtrust.jp/articles/categories/career_development/phc2024-report04`; `id=28413` (第3回インダストリアルAIシンポジウム SIAI2023) → tracked as `ai-gakkai.or.jp/siai/program/lecture`.
- CyberAgent Way also runs **more than one article per event**: `way id=28794` (Women Tech Terrace 2023) is a second article about the event already tracked as `id=28827`. Seen 2026-08-30.
- **Speaker Deck gets the same treatment as Zenn** — profile link only in `about-content.js → links`, individual decks not enumerated. Decks surfacing under `speakerdeck.com/fuzzy31u` generally map to an already-tracked talk anyway (the エンジニア版AI番付 deck → `event.shoeisha.jp/devsumi/20250627/session/5829`).
