# yukamiya.me v2 — isolated Astro preview

This directory is a working v2 implementation. The root Gatsby site and its Netlify configuration remain the production application. Nothing in this directory changes the production build automatically.

## Local development

Use Node 24 (see `.nvmrc`), then run:

```sh
npm ci
npm run dev
```

For a production-shaped local build:

```sh
npm run validate
npm run preview
```

Telemetry can be disabled with `ASTRO_TELEMETRY_DISABLED=1`.

## Content and presentation

Astro Content Collections in `src/content.config.ts` validate structured profile and activity JSON, work Markdown, and the preserved Japanese article. English routes are at `/`; Japanese equivalents are at `/ja/`. The original `/bookreview-edtech/` article remains available. Case-study metrics distinguish scope, observed results, and targets. No client framework or executable client JavaScript is shipped.

`docs/content-ledger.json` traces all 82 legacy activity records. Historical records are retained in the archive with `legacy-import` verification; this does not assert that all external links have been reverified. Three selected activities appear on the homepage. Routine updates belong in content files, never components.

The import and seed scripts are one-time migration tools. They can overwrite editorial changes and must not become the weekly publishing command. Keep the ledger as migration evidence; do not regenerate it to hide deleted records.

## Validation

`npm run validate` runs Astro diagnostics, preservation/reference/date tests, the static build, and HTML checks for internal routes and anchors, metadata, image alternatives, structured data, accidental JavaScript, and preview indexing. `.github/workflows/v2-checks.yml` runs these checks on relevant pull requests. Browser review is still required for layout, focus, responsive behavior, and real assistive-technology use.

## Preview safety and release

Builds default to noindex: HTML metadata, robots.txt, and `public/_headers`. Setting `PUBLIC_RELEASE=production` changes HTML/robots but deliberately does not remove the header safety latch. Production cutover must explicitly review and update that header, root Netlify settings, redirects, service-worker retirement, form processing, and required review gates. Do not point production at this directory before those tasks are complete.

Inquiries are temporarily closed. `src/config/contact.mjs` sets `contactEnabled = false`: the homepage invitation and all navigation/footer contact links are omitted, no form is emitted, and both contact and confirmation URLs show a bilingual pause notice. Contact URLs are noindex and excluded from the sitemap while paused. Static HTML validation checks these behaviors.

To reopen, first review the invitation and form copy for the intended scope (for example, speaking invitations), then set `contactEnabled = true`, validate, and review the preview. The retained form uses the `contact` Netlify form name, honeypot, locale field, and translated confirmations. Verify Netlify detection and delivery before reopening. This switch controls the Astro site's UI and generated form markup; it does not delete historical Netlify forms or alter the legacy production site or its submission backend.

## Still to implement before cutover

- Automation v2 is implemented in shadow mode for two authored-writing sources; see `.automation/portfolio-curator/README.md`. Extend speaking/media adapters, exercise draft PR publishing, verify branch protection, and review the scheduler switch before replacing the current routine.
- Netlify preview deployment and delivery testing; old service-worker retirement and cached-client QA.
- Accessibility audit, Lighthouse baseline, external-link verification, full device/keyboard checks, and final copy review.
- Required Greptile and Claude reviews, production switch with rollback, then legacy cleanup.

Do not interpret this preview as completion of the migration. The discovery documents in the task's `outputs/` directory define the remaining sequence.
