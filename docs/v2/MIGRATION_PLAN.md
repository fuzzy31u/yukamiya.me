# yukamiya.me — Staged migration plan

Discovery checkpoint · 19 October 2026

## Boundary and dependency order

Discovery is complete enough for the first design/architecture decision. No migration, repository push, issue creation, scheduler change or production deployment has been performed. The proposal is for an isolated v2 branch, with reviewable PRs into that branch and a separately reviewed cutover into main.

```text
Approve direction/model
 → inventory + content reconciliation + preview-only Astro foundation
 → design system + real homepage slice
 → case studies + bilingual secondary content
 → SEO/forms/redirects/accessibility/performance acceptance
 → curator v2 conversion + shadow runs
 → final content sync + cutover rehearsal
 → production approval/cutover
 → observation + cleanup
```

CI and preview scaffolding start with the foundation, not at the end. Automation policy development can proceed after schemas stabilize, but legacy automation remains authoritative until final handoff.

## Branch and environment strategy

Proposed integration branch: `v2/astro`. Keep production main and its current Netlify build unchanged during implementation. Create feature branches from v2, with coherent PRs targeting v2. Refresh v2 from main regularly and reconcile content changes through the migration ledger.

Use a separate Netlify preview site with no production domain or production secrets, or a demonstrably isolated branch-deploy configuration. Prefer the separate preview site if inherited build settings cannot be cleanly isolated. Ensure nested PR previews build the v2 package and output, never the legacy default. Require noindex headers and do not include private draft content in public previews. Deploy-preview availability and provider settings must be verified before relying on them.

A temporary `v2/` application directory is acceptable during parallel development; it avoids changing the legacy root build until the final cutover. Keep a separate package/lockfile for that temporary app. Move it to the repository root in the cutover PR or explicitly configure its base directory, then remove temporary duplication after observation. This is a staging mechanism, not a permanent monorepo requirement.

## Proposed PR sequence

| PR | Deliverable | Dependencies / acceptance |
|---|---|---|
| 1 — Content contract and Astro foundation | Preview-only static Astro, typed profile/work/activity schemas, migration ledger, existing-content extraction, basic CI | Every legacy record mapped; drafts excluded; legacy build/deploy unchanged; supported Node pinned |
| 2 — Editorial design and homepage | Shared tokens, bilingual layout/navigation, optimized real portrait, selected work summaries and contact CTA | Real desktop/mobile render approved; no framework hydration; homepage communicates current scope without About |
| 3 — Three narrative case studies | AI adoption, AI-assisted review and QUREO pages; evidence, roles, limitations and related sources | Claims/source review; missing metrics remain explicit; each story works in both supported languages |
| 4 — Supporting pages and preservation | About, Speaking & Writing, archive, Contact/Thanks, legacy book review and route map | No valuable content lost; original article stays addressable; functional localized form and archive |
| 5 — Release quality | Metadata, locale alternates, OG images, sitemap/robots, redirects, 404, font/image budgets, accessibility and browser tests | Deterministic PR checks pass; desktop/tablet/mobile visual QA; keyboard/zoom/reduced-motion checks; preview contact delivery tested |
| 6 — Curator v2 | Typed state conversion, relevance policy, content-only PR writer, bounded state, incident separation, shadow-run tooling | Old state untouched until migration review; replay/idempotency tests; verified candidates only; human publication gate |
| 7 — Deployment cutover and QA | Final sync, build switch, static deployment, service-worker retirement, modern post-deploy QA, rollback rehearsal | Owner release approval; immutable rollback artifact/config captured; latest-head checks and reviewer gates pass |
| 8 — Legacy cleanup | Remove Gatsby/CMS/React/old styles and retired automation after observation; update docs | Successful monitoring period and owner acceptance; rollback artifacts retained |

PR 2 includes the design system and homepage because the system should be evaluated on actual content. PR 5 is a final hardening slice; accessibility, metadata and tests begin earlier rather than being postponed wholesale. Keep each PR focused; split only when review size demands it.

## Content migration safeguards

1. Snapshot the audited source and later refresh it from main. Export old arrays/Markdown into a migration ledger with stable IDs and explicit dispositions.
2. Treat main as authority until the content freeze. Do not let v2 extraction overwrite newer weekly activity changes.
3. Keep a delta report between source snapshot and current main. Review added/changed/deleted items before each reconciliation.
4. Resolve current title, Waffle affiliation, LinkedIn destination, research dates and case-study ownership gaps. Missing evidence blocks the affected claim, not all site development.
5. Keep historical content as archive material where it no longer belongs on the homepage. Consolidation preserves all source relationships.
6. Briefly pause legacy publishing only at final handoff, after v2 conversion is validated. Resume against the new schema after successful cutover; never run both writers against the same content authority.

## URL and behavior migration map

| Existing | Proposed action |
|---|---|
| `/`, `/about`, `/contact` | Preserve; normalize trailing slash consistently with one redirect maximum |
| `/thanks/` | Preserve form destination; noindex and exclude from sitemap |
| `/bookreview-edtech` | Preserve exact legacy URL and Japanese content/assets |
| `/blog` | 301 to `/speaking-writing/#writing`; include a discoverable legacy article link |
| `/sitemap/sitemap-index.xml` | Redirect to Astro's published sitemap index |
| `/sitemap/sitemap-0.xml` | Redirect to an appropriate replacement sitemap after verifying emitted filenames |
| `/admin/` | Retire only after Git/PR editing is accepted; serve a useful retirement page during transition, noindex |
| legacy asset URLs | Retain assets referenced by preserved articles/external links; optimize newly rendered variants separately |
| unknown URLs | Genuine HTTP 404, not SPA catch-all 200 |

Inventory real redirect behavior, Netlify `_headers`, form detection and existing service-worker URLs before cutover. Do not use a wildcard redirect to home. Avoid changing canonical URLs and architecture without an explicit old-to-new route test.

## Acceptance and QA

- Content: bilingual completeness for core pages, provenance, no target-as-result metric, no personal/team attribution ambiguity, preserved historical records.
- Functional: all old URLs resolve correctly; language switches land on equivalents; contact is keyboard usable; form detection and test delivery verified outside production; errors and confirmation work without application JavaScript.
- Visual: homepage, case study, index, About and Contact at 320/390/768/1280/1440 widths; long English/Japanese headings; keyboard focus, 200% zoom and reduced motion. Validate cold loads as well as internal navigation.
- Technical: locked install, type/schema/content checks, static build, internal link/anchor/image checks, axe on representative routes, metadata/sitemap validation. No missing or orphaned public work references.
- Performance: capture comparable Lighthouse lab results before and after, with median of three runs on representative mobile pages. Confirm real delivered image/font sizes. Treat field CWV separately; low-traffic sites may not have enough field data.
- Operations: CI targets the exact reviewed SHA; Netlify deploy belongs to that SHA; post-deploy checks consume the actual successful deploy URL and commit, not a hardcoded assumption. External-link uncertainty must not create repeated false-positive issues.

## Service-worker retirement

The old Gatsby offline worker is a special rollback risk. Inspect its actual registered URL/scope and cache names in a returning-client test. Rehearse a compatible retirement worker at the old URL that stops caching legacy routes, removes only this site's known legacy caches, and unregisters safely. If a one-time client cleanup script is needed, bound it to those registrations and remove it after the transition. Do not clear unrelated browser storage or assume a cache purge on Netlify clears browser caches.

Test fresh visitors, a client with the legacy worker installed, a tab left open across deployment, and rollback after v2 has loaded. Retain any retirement shim needed by returning clients even if Gatsby application files are removed.

## Cutover runbook (future action)

1. Record last-good Netlify deploy ID, Git SHA, build command, base/publish directories, Node version, plugins, redirects, headers, form configuration and relevant environment-variable names. Preserve secrets in the provider, never in the plan.
2. Capture an immutable legacy deploy artifact or confirm Netlify can republish the prior successful artifact. Do not rely on being able to reinstall Node 14 dependencies later.
3. Freeze content publishing briefly, pull final main delta, migrate and validate it. Record the new schema version and migration commit.
4. Rehearse v2 preview and rollback; review all unresolved evidence and delivery gaps. Require the established Greptile/Claude/check gates plus explicit human release approval.
5. Merge the cutover; switch static build/output settings as reviewed; keep domain/DNS unchanged. Remove the Gatsby Netlify build plugin only as part of this reviewed configuration change.
6. Verify root, three cases, both locales, contact, old article, unknown URL, canonical/OG, sitemap, headers and returning-client worker behavior against the actual deploy.
7. Enable curator v2 in proposal-only mode. Keep old state snapshot and conversion report. Observe for at least seven days and one scheduled curator run before cleanup; longer if a blocker persists.

## Rollback

Rollback triggers: inaccessible key routes, broken contact delivery, stale worker preventing v2 display, incorrect/private content exposure, or critical rendering/accessibility regression. The owner/release operator restores the captured Netlify artifact and matching config, then verifies core routes/form behavior. Pause the new curator to avoid writing the wrong model during rollback. Revert the cutover on main through a coherent PR so the next automatic deploy does not reintroduce the bad release.

Content remains in Git on v2; do not discard newly authored material. If curator v2 created records, preserve them and convert only approved deltas before re-enabling the old writer. Rollback is not complete until a fresh visitor and a returning cached visitor both see the intended release.

## Decisions for this checkpoint

Recommended defaults: Executive + Editorial direction; headline option 1; three lead work stories; English root plus Japanese routes; keep Netlify and contact form; selectively include substantial Zenn work; no search/RSS/PWA at launch; automation proposes PRs and humans publish.

Approve or adjust these choices before full implementation. Owner clarification is required later for precise role wording, evidence/metrics and disclosure boundaries, the correct LinkedIn link, and whether CMS editing is still needed. Live Netlify settings and scheduler configuration remain pre-cutover verification tasks, not reasons to alter production during discovery.
