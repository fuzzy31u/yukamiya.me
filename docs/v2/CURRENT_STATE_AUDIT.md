# yukamiya.me — Current-state audit

Discovery checkpoint · 19 October 2026 · No application or production changes

## Assessment

The material supports a senior AI transformation portfolio, but the site organizes it as a personal biography and activity archive. The largest gap is editorial: visitors see a generic engineering label before they see the work that establishes technical leadership. Astro should replace the runtime, but the redesign must also change what is selected, how evidence is presented, and how automation proposes publication.

## Evidence and scope

Audited repository: [fuzzy31u/yukamiya.me](https://github.com/fuzzy31u/yukamiya.me), commit `8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b` (18 October 2026). Inventoried all 78 tracked files, including application routes, templates/components, styles, content, assets, CMS, lockfile, all three workflows, issue templates, automation state and guidance. Read README, AGENTS, CLAUDE and the local QA skill as current-system evidence; did not execute its issue-creation instructions.

Live inspection: homepage and About at desktop and a 390 × 844 mobile viewport; mobile navigation and EN/JA switch; desktop Contact; rendered metadata; HTTP checks of every public content route, admin, sitemap, robots and an unknown URL. Both portraits inspected. Recent GitHub Actions show Claude Code Review success on the latest PR head. A combined-status request for the merge commit returned no individual statuses: that is not proof of a failed deploy or a successful one.

Limits: no legacy dependency installation/build, Lighthouse run, field Core Web Vitals dataset, exhaustive external-link crawl, form submission, Netlify dashboard inspection, or live cloud-routine configuration inspection. Source configuration is distinguished below from deployed behavior. Production matches the sampled content, but its exact deployed Git SHA is unconfirmed. Visual findings are observations, not a complete WCAG certification.

## A. UX and visual audit

| Area | Concrete observation | Consequence / v2 response |
|---|---|---|
| Positioning | Home gives “Software Engineer” its own prominent line. The AI office role is inside a long slash-separated paragraph. | A recruiter must reinterpret the label. Lead with AI adoption and technical leadership, followed immediately by evidence. |
| Hero hierarchy | Name dominates; the description gives professional roles, recognition, podcasting and family identity similar weight. “Know more” is the sole content CTA. | No fast answer to what problems Yu solves. Give scope, selected work and a clear contact route priority. |
| Typography | Home uses a system sans; About adds Instrument Serif, DM Sans and Noto Sans JP through client-injected Google Fonts. | Two competing page identities and late font discovery. Establish one bilingual typographic system, loaded in HTML. |
| Spacing | About starts with a large blank band: outer page padding plus 128px first-section padding. On mobile, awards occupy the opening screens. | Space postpones meaning instead of clarifying it. Begin with a short introduction and controlled section rhythm. |
| Navigation | Only Home, About, Contact. Blog is generated but its menu item is commented out. Search only renders blog-post results. | Search cannot find most of the professional evidence. Replace with direct Work and Speaking & Writing navigation; omit search initially. |
| Color | Pale cyan header with white/translucent white labels; pale CTA text on cyan. About introduces terracotta, cream and charcoal separately. | Weak visual emphasis and contrast. Consolidate tokens and verify actual text/background combinations. |
| Imagery | Home uses a credible real workplace portrait, rounded with a shadow. Mobile places it before the name and positioning. | Useful authenticity, inefficient first-screen order. Lead mobile with positioning; retain real photography. |
| Work presentation | No project or case-study routes. About places achievements in awards, speaking, writing and media buckets. | Visitors must assemble one project from many links. Build three evidence-led narratives with linked sources. |
| Density | Home contains little evidence; About contains 11 major content/link sections and 26 media entries. Every small item gets generous card treatment. | Extreme shift from sparse introduction to archive. Feature a few stories; put older material in a secondary index. |
| Motion | Infinite duplicated highlights ticker, hover lift/scale effects, gradients and blur. No reduced-motion rule found in the styles. | Credentials become moving decoration. Use a static evidence row and minimal state transitions. |
| Responsive behavior | Mobile menu and language switching work. Home stacks the photo first; About's cards become narrow, heavily padded columns. No homepage horizontal overflow observed at sampled width. | This is not a wholly broken responsive site; its mobile information order is the main problem. Test intermediate widths as well. |
| Seniority | Certifications appear before work history, which follows podcasts near the end. No ownership, tradeoff or outcome summaries. | Signals participation more strongly than leadership. Move current scope and decisions forward. |
| Contact | English-only form and “send us” copy remain when Japanese is selected. | Impersonal starter copy and incomplete localization. Preserve the useful form with personal, bilingual copy. |
| Identity | Footer explicitly advertises a Gatsby/Netlify CMS starter; its Stackrole link points back to this site. | Strong template residue. Replace visitor-facing credit; retain required license notices in source. |

## B. Content audit

Current structured inventory: 4 awards, 2 certifications, 32 speaking entries, 4 organized events, 3 research entries, 8 writing entries, 26 media entries, 3 podcast appearances, 8 career entries, 1 education entry, 4 profile links, plus separate highlight lists. Markdown contains two pages and one 2021 Japanese book review. There is no case-study collection.

### Keep, elevate, restructure

- Elevate the AI Driven Office role and engineering AI adoption program. Tie supporting articles, talks and recognition to one work narrative instead of treating each mention as an independent achievement.
- Elevate applied AI evaluation and human review design from the parked Zenn candidates. These demonstrate practical judgment beyond tool enthusiasm.
- Preserve QUREO internationalization/translation as a technical and product case study. Career labels alone hide the scope of this work.
- Preserve Tech DE&I, DevRel, research, Ms.Engineer and Waffle as evidence of organizational leadership. AI positioning should not erase this distinctive body of work.
- Keep selected speaking, the speaker award, Forbes recognition and substantive publications. Place certifications lower on About, not ahead of the work.
- Keep podcasting and personal context in About, with an intentional short introduction. Retain older writing through an archive; do not promote every historical mention on the homepage.

### Correct or resolve before publication

- `home-content.js` duplicates highlights and mixes “Manager” with “Board Member.” The latter can sound like a corporate board directorship internationally. Confirm the exact English role and scope; use Manager in the meantime, supported by career data.
- `AboutHero.jsx` contains an older QUREO/software-engineer introduction, but is not used by the live About template. Remove this stale code during cleanup; do not mistake it for current live biography.
- Home says Waffle Advisor; career history says pro bono Technical Assistant through 2025. Reconcile current affiliation and dates with the owner.
- The LinkedIn URL uses an unusual `/company/` path for a person. Verify the intended profile before changing it; do not guess a replacement.
- Speaking uses `month: "00"` for unknown months. Preserve uncertainty explicitly, not as a fabricated date.
- Research has a 2024 entry while the related publication announcement is labeled 2025. Distinguish research/presentation/publication dates rather than silently harmonizing them.
- `archives/50516` is a conference transcript published by technical PR and supervised by the speaker. Model participation/credit rather than assuming every linked article is authored writing.
- Some event URLs are reused across years. URL equality alone cannot determine whether two records describe the same occurrence.

### Case-study shortlist and evidence boundaries

| Proposed story | Why it belongs | Evidence still required |
|---|---|---|
| Engineering AI adoption at CyberAgent | Organizational reach, evaluation design, operating process | Exact personal responsibility, current cycle results, longitudinal outcomes and permission for internal detail |
| Evaluating AI-assisted review | Benchmark design, error analysis, human judgment, operational implementation | Work context/disclosure boundaries; actual time-saving measurement; independently review the dataset limitations |
| QUREO translation workflow | Product delivery, internationalization, quality/cost tradeoffs, automation | Owner-confirmed timeframe and scope; attributable business outcome and any reusable artifacts |
| Tech DE&I program (supporting story) | Leadership continuity, community building, research | Personal vs team attribution, dated outcome evidence; avoid causal hiring/retention claims without data |
| Agent workflow experiments (selected technical note) | Practical permission and review design | Clearly label personal projects; do not imply company-wide deployment |

The AI Banzuke source documents 44 development organizations and a two-axis, 14-item assessment. Those are scope/design facts, not measured productivity improvement. [Primary article](https://developers.cyberagent.co.jp/blog/archives/63720/).

The review-evaluation article explicitly says the 50% reduction is a goal and actual review time has not yet been measured. This limitation should be part of the case study's credibility. [Author's account](https://zenn.dev/yukamiya/articles/reduce-review-cost-human-in-loop-ai).

The QUREO account supports translation workflow automation and model comparison, with the speaker describing overseas development responsibility. It does not establish a revenue increase attributable to Yu. [Conference transcript](https://developers.cyberagent.co.jp/blog/archives/50516/).

## C. Architecture and technical debt

### Current route and behavior inventory

| URL | Source / behavior | Migration disposition |
|---|---|---|
| `/` | Markdown selects redesign template; hero copy comes from JS; Gatsby image from Markdown | Replace composition; preserve root URL |
| `/about` | Created explicitly in `gatsby-node.js`; JS arrays rendered in React | Keep URL; concise biography + career + archive access |
| `/contact` | Markdown + Netlify form, POST to `/thanks` | Preserve form capability and URL |
| `/thanks/` | React confirmation page | Keep; exclude from indexing |
| `/blog` | Generated index, one post, absent from nav | Redirect to selected Writing section with legacy item accessible |
| `/bookreview-edtech` | Japanese Markdown article with images and cross-post attribution | Preserve exact URL and content; mark article language correctly |
| unknown route | Live HTTP 404 with starter error page | Keep true 404 status; rewrite copy |
| `/admin/` | Live Content Manager; git-gateway config targets main | Retire only after replacement editing workflow is accepted |
| `/sitemap/sitemap-index.xml` | Live 200; child sitemap lists six content routes, including thanks | Preserve old sitemap URL via redirect after migration |
| `/robots.txt` | Live 404 | Add explicit crawler policy and sitemap link |

The root-level sitemap URLs return 404, but the sitemap exists under `/sitemap/`; this is not a missing-sitemap finding.

### Must fix during migration

1. **Framework/runtime:** lockfile resolves Gatsby 4.24.8, React 16.14.0, Theme UI 0.6.2, Sass 1.49.7. Netlify declares Node 14.15.0. Replace with a supported Astro/toolchain combination and static output. Lockfile contains 2,081 package entries; no vulnerability scan was run, so this is a maintenance finding, not a CVE count.
2. **Content authority:** homepage copy in JS, title/image in Markdown, About data in JS, old biography in JSX, metadata in JSON. CMS edits do not cover the real homepage hero or About data. Consolidate typed content and remove competing stores.
3. **Localization:** CSS switches duplicate English/Japanese markup, localStorage and custom events coordinate state; HTML stays `en-US` in Japanese. Contact remains English. Use separate static locale URLs and matching metadata.
4. **Metadata:** no canonical link in sampled HTML; book-review `og:image` is literally `https://yukamiya.me[object Object]` because the SEO component receives Gatsby image data, not a URL. About has no h1. Source/live HTML includes a second viewport declaration with `maximum-scale=1`; remove it rather than relying on browser conflict resolution.
5. **Analytics:** repository has only `UA-188277291-1` and the Universal Analytics plugin. UA has been replaced by GA4; this is not evidence of usable current analytics. Decide explicitly whether to use a newly verified analytics property or no tracker. [Google notice](https://support.google.com/analytics/answer/11583528).
6. **CI/QA:** no deterministic PR build/type/content/link/a11y workflow in the tracked configuration. `npm test` always fails as a placeholder. Netlify build is a separate deployment check. QA still reads nonexistent `src/content/pages/about.md` and old section counts.
7. **Offline migration:** Gatsby installs an offline worker; `gatsby-browser.js` prompts to reload updates. Test a returning visitor with the old worker. A simple server deploy does not ensure previously cached clients see v2.
8. **Accessibility baseline:** contrast, correct locale, heading structure, skip link, visible focus, menu expanded state, reduced motion and zoom support must be established centrally. Search input has placeholder-only labeling and removes its outline when open.

### Should fix

- Replace the duplicated `gatsby-plugin-netlify` registration and Gatsby-specific plugin chain during cutover, keeping useful headers.
- Replace client-injected fonts; use limited local WOFF2 assets or deliberate system fallbacks with Japanese coverage.
- Hero source image is ~15.0 MB and alternate portrait ~9.4 MB. Gatsby already serves a responsive WebP on the sampled homepage, so these are source/static-asset risks, not a claim that every visitor downloads 15 MB. Optimize via Astro and keep large originals outside the public output.
- Form declares a honeypot field name without rendering the corresponding field. Preserve name/action compatibility and add a real hidden honeypot, accessible errors and delivery verification in preview.
- Separate QA incidents from public activity records and automate deterministic validation.
- Reconcile reviewer gates with real protected-branch settings and current-head checks. Instructions alone do not enforce merge policy.

### Optional cleanup / deliberate omissions

Remove unused legacy homepage, AboutHero, empty home blog-list component, surplus icon mappings, unused stock image and style fragments once content parity is verified. Retire search, dark-theme machinery and PWA behavior unless a concrete need emerges. No RSS at launch: one historical local post and curated external work do not justify a publication feed yet.

## D. Automation audit

### Current pipeline

```text
Cloud routine (documented weekly, Sunday 21:07 JST)
 → name/handle/site searches + author/profile enumerations
 → fetch public source; verify identity/title/date/canonical URL
 → canonical-keyed state + rejection history + prose memory
 → issues / edits to src/data/about-content.js
 → PR / review-fix loops
 → Greptile 5/5 + Claude pass marker + required checks
 → merge → Netlify Gatsby build/deploy
 → optional repository_dispatch/manual QA → issues → next routine
```

The weekly trigger and full orchestration are external to this checkout; there is no weekly discovery workflow here. The tracked post-deploy schedule is commented out, despite older comments advertising a weekly schedule. Webhook setup is documented but its live installation was not verified.

### Properties worth retaining

Canonical evidence, source-specific last-checked timestamps, identity collision handling, no search-summary-only publication, event-level dedupe, recurrence history, retry blockers, PR review gates, narrow public network access, prompt-injection boundaries and separation of durable state from judgment notes are all useful foundations.

### Concrete coupling and operational weaknesses

- The same routine discovers activity, repairs QA issues, edits executable JavaScript, manages reviews, reconciles merges and updates its own memory. A new article can therefore involve UI-source edits and deployment troubleshooting.
- `state.json` is 35,557 bytes, with 112 source/query keys and 21 tracked entries (16 merged, 5 detected). Size is modest today; growth semantics are the problem. Dated query variants, recurrence arrays and prose fields have no machine-enforced retention limit.
- `memory.md` is 22,806 bytes and duplicates state, historical counts and review details. A “last shipped” note mentions PR #101 although later sections describe PR #110. Contradictory memory already creates review work.
- QA incidents share `activities`; `merged` sometimes means an issue was closed without a PR. That status conflates publication and incident resolution.
- The five Zenn candidates are blocked by editorial policy, not necessarily technical failure. Current status fields cannot express this cleanly.
- Every sweep must commit state. Recent history contains repeated empty-sweep PRs; the completed review result of one PR is often recorded by the next. This produces a self-referential bookkeeping loop.
- False broken-link reports recur for Japanese sources. Network denial, rate limiting and actual content removal need distinct outcomes; a single failed fetch should not trigger content removal.
- Search queries enumerate identity aliases but do not decide portfolio value. A large activity archive can keep growing while the strongest current work stays invisible.

## Principal risks

Highest migration risks are loss of legacy routes/assets, stale service-worker clients, incomplete Japanese metadata, loss of form delivery, unsynchronized content changes while v2 develops, and presenting team/company scale or aspirational metrics as personal outcomes. Netlify settings, review enforcement and external routine configuration must be verified before cutover. No production change is needed to resolve the design checkpoint.

## Inspectable repository references

All paths above refer to the audited commit, not an assumed future main:

- [Route generation](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/gatsby-node.js) and [Gatsby plugins](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/gatsby-config.js).
- [About content and career evidence](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/src/data/about-content.js) and [homepage copy](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/src/data/home-content.js).
- [SEO component](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/src/components/seo.js), [blog image call](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/src/templates/blog-post.js) and [Netlify configuration](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/netlify.toml).
- [Automation contract](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/.automation/auto-detect-my-public-activities/README.md), [state](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/.automation/auto-detect-my-public-activities/state.json) and [judgment/history notes](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/.automation/auto-detect-my-public-activities/memory.md).
- [Post-deploy QA](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/.github/workflows/qa-post-deploy.yml) and [repository review gate](https://github.com/fuzzy31u/yukamiya.me/blob/8c6b1e18bfbedebf2dcbcb1ac33f28ccccb4a67b/AGENTS.md).
