# Astro v2 implementation

Parent repository review and merge gates still apply. This isolated directory supersedes the legacy requirement to store new portfolio content in `src/data/about-content.js`: use these Astro content collections instead. Keep the legacy production application unchanged until an explicit cutover.

Run `npm run validate` on Node 24. Inspect both English and Japanese pages at desktop and mobile widths after visual changes. Never report Lighthouse or full accessibility compliance without running those checks.

Do not run the one-time import/seed scripts during routine activity publishing. Never fabricate metrics; preserve evidence and distinguish scope from measured outcomes and targets. Existing automation must not be redirected to v2 until its new state/content contract is implemented and reviewed.
