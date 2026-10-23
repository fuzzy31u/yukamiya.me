# V2 review checkpoint

The five discovery documents in this directory describe the initial architectural checkpoint. They are retained as the design rationale; implemented details now live in `v2/README.md` and `v2/.automation/portfolio-curator/README.md`.

This PR introduces an isolated Astro implementation. Netlify Deploy Previews use `v2/` with Node 24 and noindex; production retains the Gatsby build, Node 14 setting and Gatsby plugin. Do not merge as a production-cutover decision. Preview configuration follows Netlify's documented [deploy contexts](https://docs.netlify.com/build/configure-builds/file-based-configuration/) and [context-specific plugins](https://docs.netlify.com/extend/install-and-use/build-plugins/).

Implemented: English/Japanese portfolio, three sourced case studies, preserved activity archive and book-review URL, static metadata, deterministic checks, and shadow-mode authored-article curation. Remaining: hosted preview QA, Lighthouse/accessibility audits, broader source adapters, GitHub publishing activation, old service-worker retirement, and reviewed cutover/rollback.
