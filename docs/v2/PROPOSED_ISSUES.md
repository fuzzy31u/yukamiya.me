# yukamiya.me — Proposed GitHub issues

Discovery proposal · 19 October 2026 · Drafts only; no GitHub issues created

Use seven meaningful work packages. PRs may be smaller than an issue, but each must deliver a coherent, reviewable result. The release/cleanup issue intentionally spans two PRs.

## 1. Establish the Astro content foundation and isolated preview

**Problem:** content is split between JavaScript, Markdown, JSX and CMS settings; the legacy deployment must remain stable while v2 develops.

**Scope:** create the v2 integration branch/application, pin supported Astro/Node versions, define profile/work/activity schemas, extract existing content, build the reconciliation ledger, create preview-only deployment and deterministic base CI. Document architecture decisions and editing workflow.

**Acceptance criteria**

- All existing content records and legacy routes have a disposition and stable mapping; no silent loss.
- Drafts are absent from public output and sitemap.
- Schema validation rejects duplicate IDs, invalid dates and missing references.
- Static preview builds from the lockfile; production main keeps its current build.
- CI/preview origins are clearly distinguished from production.

**Dependencies:** checkpoint acceptance. **Proposed PR:** 1.

## 2. Deliver the bilingual homepage and editorial design system

**Problem:** the homepage emphasizes a generic engineering title and a role list rather than leadership and evidence.

**Scope:** recommended editorial/executive direction, centralized tokens, typography, bilingual navigation, responsive portrait, current role, three selected work summaries, selected public evidence and contact CTA. Thin route layer reads content, with no professional facts hardcoded into components.

**Acceptance criteria**

- The first screen explains current professional focus; mobile places positioning ahead of photography.
- Desktop/mobile screenshots of actual EN/JA content receive visual review before expanding the system.
- Links and navigation work without a React runtime; focus and contrast are tested.
- Hero images are optimized and dimensioned; fonts have deliberate fallbacks.
- No ticker, unnecessary animation, generic service-card grid or unsupported claims.

**Dependencies:** issue 1; owner choice of headline/direction. **Proposed PR:** 2.

## 3. Publish three evidence-led work narratives

**Problem:** important projects are scattered across publications, talks and awards, without a clear account of contribution and outcomes.

**Scope:** Engineering AI adoption, AI-assisted review evaluation, QUREO translation workflow. Each includes context, problem, personal role, decisions, approach, outcome, source evidence and limits. Add related talks/articles as references, not duplicate projects.

**Acceptance criteria**

- Both languages have coherent narratives and accurate source attribution.
- Every numeric claim identifies whether it is scope, target or observed result and has evidence.
- The 50% review-reduction aspiration is never presented as achieved.
- Personal responsibility is separated from organizational/team accomplishment.
- Unsupported/confidential details remain absent; unresolved evidence questions are tracked.
- Case studies render well on desktop and mobile, including long headings and source lists.

**Dependencies:** issues 1–2 and owner content review. **Proposed PR:** 3.

## 4. Complete supporting content and preserve valuable history

**Problem:** About is an oversized archive; secondary pages contain starter copy and incomplete localization.

**Scope:** concise About, curated Speaking & Writing, secondary archive, localized contact/confirmation, legacy Japanese book review and asset preservation. Resolve current affiliation/title/link discrepancies. Keep Tech DE&I/research/community leadership visible.

**Acceptance criteria**

- All retained legacy content can be found; the old article URL remains valid.
- Content selections communicate relevance; archive is subordinate to selected work.
- Language links resolve to actual counterparts and original source languages are labeled.
- Contact fields, validation and confirmation are localized and accessible.
- Netlify form name/action are preserved or explicitly migrated; actual preview delivery is tested before release.
- CMS retirement is documented and agreed; no undocumented loss of editing capability.

**Dependencies:** issues 1–2; content ledger. **Proposed PR:** 4.

## 5. Establish release-quality SEO, accessibility and performance checks

**Problem:** missing canonicals, broken social metadata, incomplete locale semantics and nondeterministic QA permit regressions.

**Scope:** shared metadata layout, OG assets, structured data where useful, sitemap/robots, true 404, redirects, font/image budgets, internal links/anchors, browser/axe checks and measured performance. Replace obsolete About-file comparisons with schema/build assertions.

**Acceptance criteria**

- Every public page has appropriate title/description/canonical; locale alternates are reciprocal.
- OG URLs resolve to actual images; drafts/thanks/error/admin do not enter the public sitemap.
- Old route and sitemap redirects pass an automated matrix; no catch-all soft 404.
- Representative pages pass deterministic CI and manual keyboard, zoom and reduced-motion review.
- Mobile/desktop visual evidence and comparable Lighthouse results are recorded; field-data limits are stated.
- Analytics decision is explicit; no legacy UA script is carried over accidentally.

**Dependencies:** issues 1–4; checks begin earlier and mature here. **Proposed PR:** 5.

## 6. Replace activity automation with a structured portfolio curator

**Problem:** discovery, QA repair, JavaScript edits and merge bookkeeping are coupled; the current policy hides relevant technical writing and creates noisy state-only work.

**Scope:** state schemas/converter, verified-source enumeration, canonical and occurrence dedupe, editorial relevance, identity validation, content-only PR generation, resumability, incident isolation, bounded logs and shadow runs. Preserve known false positives and useful network boundaries.

**Acceptance criteria**

- Every old activity/rejection/incident maps to v2 with evidence and no lost unresolved candidate.
- Replaying a run or retrying after interruption does not duplicate items or PRs.
- Reused event URLs across different years stay distinct; alternate links for the same event consolidate.
- Blocked fetches do not advance successful verification timestamps; search snippets alone cannot publish.
- Routine diffs cannot modify UI, workflows, policy or deployment configuration.
- Human current-head approval is required; the bot cannot merge or deploy.
- No-op sweeps avoid unnecessary application builds; state retention and deployment exclusions are tested.
- Shadow runs compare the proposed output with legacy behavior; at least one new candidate and one no-op/failure fixture are exercised.

**Dependencies:** issue 1 schemas; issue 5 validators; checkpoint approval of selective Zenn inclusion. **Proposed PR:** 6.

## 7. Rehearse cutover, deploy safely and retire the legacy stack

**Problem:** static hosting changes can break forms, old links and cached Gatsby clients; rollback must work without rebuilding an obsolete toolchain.

**Scope:** final content delta sync, captured immutable rollback deploy/config, preview release QA, service-worker retirement, reviewed Netlify build switch, deploy-SHA-aware post-deploy checks, curator handoff, observation and later cleanup.

**Acceptance criteria**

- Actual Netlify configuration, form delivery, branch protection and external routine schedule are verified.
- Fresh-client, old-worker-client and rollback rehearsals succeed.
- Final source deltas are reconciled before the legacy writer pauses.
- Established reviewer gates, deterministic checks and human release approval pass before production cutover.
- Post-deploy QA targets the actual deployed revision and routes; external fetch uncertainty does not repeatedly create false issues.
- At least seven days and one scheduled curator run are observed successfully before removing legacy code.
- Gatsby/React/Theme UI/CMS/old automation are removed only after replacement acceptance; license notices, needed assets and rollback records remain.

**Dependencies:** issues 1–6. **Proposed PRs:** 7 (cutover), 8 (cleanup).

## Tracking conventions

Use labels such as `v2`, `content`, `design`, `automation`, `release` only if they already exist or are intentionally created. Each PR should link the relevant issue, describe user-visible behavior, list evidence and checks, and state what remains unresolved. Do not mark migration complete on a successful build alone: production stability, content integrity and visual review are independent acceptance gates.
