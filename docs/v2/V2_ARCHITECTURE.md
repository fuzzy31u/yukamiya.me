# yukamiya.me — V2 architecture

Proposed at discovery checkpoint · 19 October 2026 · Not implemented

## Decisions

Use Astro with static HTML, TypeScript, Content Collections, plain CSS and build-time image optimization. Keep Netlify. Do not carry over Gatsby, React, Theme UI, ElasticLunr, the offline plugin or Netlify CMS by default. Keep dependencies small: Astro, its sitemap integration, type/check tooling, and development-only browser/accessibility checks. Markdown is sufficient; add MDX only if an actual editorial requirement justifies executable content.

Select the current stable Astro release and a supported active Node LTS at implementation time, pin their compatible versions in the lockfile/runtime configuration, and record them in an ADR. Do not copy the old Node 14 constraint or assume a version from this planning document.

Astro's current collection approach supports build-time loaders and schemas in `src/content.config.ts`; use `glob()` for individual records and `file()` for suitable single-file data. Keep content available locally at build time. [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/).

## Information architecture

```text
/                           English homepage
/work/                      Selected Work (three lead stories)
/work/[slug]/               Narrative case study
/speaking-writing/          Selected talks, writing, research and interviews
/speaking-writing/archive/  Secondary complete retained activity index
/about/                     Current scope, short biography, career, recognition
/contact/                   Bilingual-localized Netlify contact form
/thanks/                    Form confirmation, noindex
/ja/…                       Japanese equivalents of the core portfolio routes
/bookreview-edtech          Existing Japanese article, same URL
/404.html                   Helpful error page, real HTTP 404 for missing paths
```

Navigation: Work · Speaking & Writing · About · Contact · EN/日本語. Name links home. No separate “Impact” section competing with Work: impact is the organizing principle of each case study. No new page for each external media mention. A small static site does not need a search UI at launch.

Homepage must stand alone: positioning/current role → three selected work stories → selected public evidence → brief leadership background → contact. Include role, organization, timeframe, decisions and outcome at a glance. Case-study detail offers depth, not the first explanation of who Yu is.

English remains at existing unprefixed URLs; Japanese gets `/ja/`. Link to the equivalent translation, not merely the other homepage. Do not silently send visitors to another language. English summaries of Japanese external material should show “Original in Japanese.” Retain the legacy Japanese article with `lang="ja"`; do not invent an English translation or hreflang counterpart. [Astro locale routing](https://docs.astro.build/en/guides/internationalization/).

## Source structure

```text
src/
  content.config.ts
  content/
    profile/yu.json
    work/{story}.{en|ja}.md
    activities/{stable-id}.json
    writing/bookreview-edtech.md
  schemas/                 Shared data contracts for Astro and validators
  layouts/{Base,CaseStudy,Article}.astro
  components/              Nav, Footer, WorkSummary, EvidenceList, Picture
  pages/                   Thin route adapters only
  styles/{tokens,global,typography}.css
  assets/                  Optimizable photos and editorial images
scripts/
  validate-content.ts
  check-built-site.ts
  curator/                 Fetch/normalize/dedupe/state/PR stages
.automation/portfolio-curator/
  policy.json
  sources.json
  candidates/{id}.json
  decisions/{year}/{id}.json
  incidents/{id}.json
  schema/                  State contracts, versioned migration rules
public/
  favicon.svg, favicon.ico, robots.txt, _redirects, _headers
```

The profile is the authority for identity, current roles, career and contact links. Work records own narratives. Activity records own public appearances and source relationships. Components never own professional facts. Labels can live in a small typed locale dictionary; no full translation framework is required.

## Content contracts

All records have `schemaVersion`, stable IDs, explicit provenance and a publication state. Dates are ISO values with precision, not JavaScript-generated guesses. Separate an activity's occurrence date from article publication, detection and verification times.

### Profile (singleton JSON)

- `id`, bilingual `name`, `headline`, `intro`, `shortBio`.
- `roles[]`: organization, official title, display title, start/end with precision, `current`, source references, `verifiedAt`.
- `career[]`, `education[]`, `recognition[]`: bilingual labels, dated facts, evidence references; concurrent roles allowed.
- `portrait`: local image reference, localized alt text, credit/license information.
- `contactLinks[]`: approved URLs and labels; no invented address or guessed LinkedIn URL.
- `featuredWorkIds`, `featuredActivityIds`: explicit editorial selection, not “latest N.”

### Work (localized Markdown + typed frontmatter)

| Field | Rule |
|---|---|
| `id`, `translationKey`, `locale`, `slug` | Stable story identity; unique locale/slug pair; safe path pattern |
| `title`, `summary`, `role`, `organization` | Required, concise; role distinguishes personal contribution from team work |
| `timeframe` | Start/end or display range with precision; do not turn an unknown month into January |
| `context`, `problem`, `approach`, `decisions`, `outcome` | Typed strings/lists required for published work; longer explanation in Markdown |
| `metrics[]` | `{label, value, unit?, kind, period?, baseline?, methodology?, sourceIds[]}` |
| `kind` for metrics | `scope`, `observed-result`, `target`; target cannot render as an achieved result |
| `limitations`, `openQuestions` | Explicit evidence gaps, private detail boundaries; unresolved critical claims block publication |
| `technologies[]`, `topics[]` | Small controlled vocabulary; technologies support the story rather than dominate it |
| `evidence[]` | `{id, url?, kind, locator, checkedAt, attribution}`; owner-confirmed evidence labeled as such |
| `relatedActivityIds[]`, `links[]` | Valid references; related coverage does not become another work story |
| `visibility`, `featured`, `priority` | `draft`, `published`, `archived`; editorial controls, not automation defaults |
| `seo` | Localized title, description, optional local preview image |

Suggested body order: context → problem → my role → approach and decisions → outcome → evidence and limitations. Avoid putting large narrative bodies in Astro components. Require evidence for every displayed metric; scoped source facts do not imply attributable improvement.

### Activity (one JSON per occurrence/artifact)

- `id`, `kind`: talk, authored-article, supervised-transcript, interview, research, event-organizing, recognition or podcast. `participationRole` distinguishes author, speaker, guest, moderator and organizer.
- `title.{ja,en}`, `summary.{ja,en}`, `originalLanguage`; English is an editorial translation unless verified official wording exists.
- `canonicalUrl`, `aliases[]`, `sourceId`, `sourceUrls[]`, `identityEvidence[]`.
- `eventId?`, `seriesId?`, `occurrenceDate?`, `publishedDate?`, `datePrecision`: day/month/year/unknown. Keep unknown dates null; preserve the original textual date in provenance when useful.
- `detectedAt`, `verifiedAt?`, `verificationStatus`: pending/verified/blocked/rejected.
- `relevance`: versioned score, dimension breakdown and short rationale.
- `editorialStatus`: candidate/hold/selected/declined; `publicationStatus`: draft/published/archived.
- `relatedWorkIds[]`, `featured` (human-controlled), `priority`, `evidence[]`.

Use one activity record for a talk plus its announcement, recording and slides. An authored article about that talk can be a separate linked artifact. A recurring conference may reuse the same URL: stable event/year/session identity distinguishes occurrences, while canonical URL aliases deduplicate pages within an occurrence. This improves the current one-URL-one-entry rule without discarding its history.

### Validation beyond field types

Reject duplicate IDs/slugs, unresolved references, invalid or impossible dates, missing required translations, unsafe schemes, and published records without verified sources and editorial selection. Assert one h1 per rendered portfolio page, canonical URL/image validity, locale alternate symmetry and internal anchor targets. Validate both source records and what the build actually emits. Importing drafts must never generate routes, sitemap entries, feed data, client bundles or rendered links.

Migration uses a reconciliation ledger: each old array entry/Markdown file → new ID → retain/feature/archive/merge-with plus rationale. All source content remains recoverable. Duplicate mentions are linked or consolidated explicitly, never silently deleted.

## Automation v2

```text
Weekly scheduler
  → source enumeration + bounded discovery
  → public fetch → identity/date/canonical verification
  → normalization → occurrence-aware deduplication
  → participation classification → relevance proposal
  → candidate record → structured content proposal
  → schema/evidence/build validation
  → one coherent PR with preview and source report
  → required checks + current-head reviews + human approval
  → human merge → Netlify deploy → read-only QA
```

Keep the existing cloud scheduler initially; replace its contract only after the new model and migration adapter work. The scheduler location is an operational choice, not an Astro dependency. Do not introduce a database. The routine may create/update a branch and PR in this repository; it must not merge, change deployment configuration, call production hooks, or mutate components. Human approval before publication is stricter than the old routine's documented merge orchestration.

### Responsibilities and enforcement

- **Discovery:** authoritative author feeds first; bounded identity-alias queries second. Store query coverage separately from successful source validation. Search prose is a lead, not evidence.
- **Verification:** exact identity match supported by byline/profile/event participation; fetched title, source date, canonical/OG URL and timestamp. Hold inaccessible sources. A site mention of a project is not automatically an activity by Yu.
- **Deterministic processing:** URL parsing, tracking-parameter rules, redirects, date handling, stable IDs, alias matching, field validation and sort order are code. Preserve meaningful query parameters.
- **AI assistance:** propose classification, bilingual summaries and relevance from verified evidence. Treat fetched content as quoted data, never executable instructions. Reject unknown keys and raw HTML in routine records.
- **Writer:** allowlisted content and curator-state paths only. CI rejects routine changes to components, scripts, workflows, schemas, policy, deploy files or agent instructions. Separate human maintenance PRs update those files.
- **Publishing:** proposed records can have publishable status in a PR, but the production build reads only human-reviewed main. Do not embed a self-asserted `approved: true` as the approval mechanism. Protect main, require a human review on the latest content changes, dismiss stale approval, and prohibit bot auto-merge.
- **Review gates:** preserve Greptile 5/5 with no actionable findings and Claude pass requirements until intentionally revised. Match review evidence to the PR head SHA and trusted reviewer identity; neither an arbitrary comment nor a prior commit's pass should unlock publication.

### Portfolio relevance policy (proposal)

Verification is a gate, not a score. Only verified items can enter editorial selection. Score five dimensions from 0–2: directness of Yu's contribution, depth/substance, fit with current practice, strength of usable evidence, and distinct contribution relative to existing coverage. Total 0–10; record reasons and policy version.

- 8–10: propose inclusion for human review.
- 5–7: hold for a digest or strengthen evidence; no automatic site addition.
- 0–4: keep a compact declined record for dedupe; exclude from presentation.

A substantive AI evaluation article could score highly even on Zenn; a conference appearance needs a verified substantive role; routine commits and casual posts generally lack substance. Prestige and recency are not substitutes for contribution. A more recent duplicate should update a source relationship, not displace an older stronger story. Homepage featuring always remains a separate human decision.

Explicitly replace the blanket Zenn/Speaker Deck profile-only rule with selective article/deck eligibility after checkpoint approval. Preserve existing profile links. Provide a maximum of three new public items per weekly PR as a review budget, with verified overflow held for later; do not invent activity to meet a quota.

### State, persistence and retention

Retain JSON, but split by responsibility rather than maintaining a single mutable narrative document:

| Store | Authority / retention |
|---|---|
| `sources.json` | Stable source IDs, last attempt, last successful discovery, last successful verification, cursor/ETag, error class; dated query variants live in run reports, not permanent source keys |
| `candidates/{id}.json` | Resumable stage, source evidence, blocker enum, retry time, related PR; never rely on a run summary to remember a candidate |
| `decisions/{year}/{id}.json` | Compact durable accepted/declined/merged decision, aliases, source hash and PR reference; partition by year and retain for dedupe |
| `incidents/{id}.json` | QA issue identity and resolution, separate from activity publication; retain totals/first/last and latest five recurrence details |
| Run artifacts | Detailed fetch/check logs and current PR-gate scratch; proposed 30-day retention, regenerated from GitHub when expired |
| `memory.md` | Concise exceptions with IDs linking to durable evidence, no repeating weekly diary; proposed maximum 200 lines |

Use atomic writes and one active run/PR branch at a time. Retry from the last durable stage. Dedup key includes stable occurrence identity; use a normalized URL hash provisionally when identity is incomplete, then preserve aliases on reconciliation. Backoff transient fetch failures; distinguish network-policy denial, rate limit, source unavailable, identity conflict and editorial hold. Never stamp a successful check for an unrun or blocked source.

During migration retain the old state file unchanged, then convert every entry with a mapping report. `merged` QA records become resolved incidents, not published activities. Carry rejection evidence and recurrence totals forward.

To reduce empty-sweep review churn, propose a dedicated `automation-state` branch for operational checkpoints, excluded from deployment. Its bot may write only operational state; public content and policy remain PR-only to main. Review this narrow permission separately during implementation. If branch isolation cannot be enforced, keep one state-only PR per week initially; do not silently use direct main commits. No-op sweeps need no Gatsby/Astro build. Preserve resumability on Git, not expiring artifacts alone. Periodically compact checkpoints while retaining decision fingerprints and Git history.

### Network and QA boundaries

Start from the existing verified-source inventory and reduce broad wildcards where practical. Public HTTPS read-only fetching; validate destination at every redirect and DNS resolution, reject private/link-local/loopback addresses and non-HTTP schemes, bound redirects/time/bytes, strip credentials, and do not send secrets or repository data to sources. Source-fetching jobs get no production secrets; authenticated writes are scoped to GitHub publication proposals only.

External link QA: distinguish 404/410 from 403/429/timeouts and transport failure; use bounded retries and known-host exceptions. Retain evidence and confidence, with repeated independent confirmation before opening/reopening an incident. Never rewrite canonical URLs to speculative alternatives or remove content automatically. Deterministic local link checks can block PRs; uncertain external reachability is advisory.

## SEO, performance, accessibility and hosting

One shared layout owns title, description, canonical, locale alternates, OG/Twitter absolute image URLs, favicon and optional JSON-LD. Use Person/ProfilePage for the biography and Article for original long-form writing when justified; do not imply ownership of third-party publications. Topic language should emerge naturally from actual work. Example title: “Yu Kamiya — AI Adoption & Technical Leadership.”

Use Astro sitemap integration; include only public canonical content; exclude confirmation, admin, drafts and errors. Add robots.txt and noindex preview headers. Robots directives are not access control; confidential drafts must never enter a public build. Preserve old sitemap paths with redirects. No RSS until there is a maintained original publishing stream.

Use Astro image components with explicit dimensions, responsive widths and formats. Eager-load only the actual above-fold hero; lazy-load later images. No carousel or video embed on the homepage. [Astro images](https://docs.astro.build/en/guides/images/).

Central tokens control colors, spacing, type scale, content width, focus and motion. Semantic landmarks, one h1, descriptive links, 44px preferred touch targets, keyboard-operable navigation, no scroll reveal dependency, no maximum-scale restriction, and reduced-motion support. Japanese needs its own readable line-height and wrapping review.

Targets for implementation (not measured current results): Lighthouse performance ≥95 on representative mobile pages, accessibility 100 automated score with manual checks, LCP ≤2.5s, CLS ≤0.1 and INP ≤200ms where field data exists. Aim for zero framework runtime, ≤10KB compressed optional first-party JS, ≤100KB compressed CSS, and a ≤200KB mobile hero variant; report justified exceptions. Use three comparable lab runs and the median, not one score as proof of real-user performance.

Netlify static build: `npm ci` then validated `astro build`, publish `dist`. No adapter needed for this static design. Preserve useful headers and Netlify Forms; verify form detection and test delivery on an isolated preview, with a real honeypot and localized success/error experience. [Astro on Netlify](https://docs.astro.build/en/guides/deploy/netlify/).

PR checks: locked install → Astro/type/schema checks → content provenance and route checks → build → internal URL/anchor/image validation → representative desktop/mobile browser tests + axe → preview metadata/status smoke checks. Use format checking and targeted linting if they prevent real defects. Keep external-link crawling and heavier Lighthouse runs separate from deterministic checks. Review action permissions and pass workflow inputs through environment variables rather than interpolating them into shell scripts.
