# AGENTS.md

## Overview

- Personal site built with Gatsby v4 and Netlify CMS.
- Deploys on Netlify with `NODE_VERSION = "14.15.0"` in [`/Users/a11621/.codex/worktrees/d5cc/yukamiya.me/netlify.toml`](/Users/a11621/.codex/worktrees/d5cc/yukamiya.me/netlify.toml).

## Commands

- `npm install` to install dependencies.
- `npm run develop` or `npm start` to run Gatsby locally at `http://localhost:8000`.
- `npm run build` to create the production build in `public/`.
- `npm run serve` to serve the production build locally.
- `npm run clean` to clear Gatsby caches and build artifacts.
- `npm run format` to run Prettier on `js`, `jsx`, `json`, and `md` files.
- `npm test` is a placeholder script that exits with code `1`; do not treat it as a real test suite.

## Content Workflows

- For local Netlify CMS work, run `npx netlify-cms-proxy-server` in one terminal and `npm run develop` in another, then open `/admin/`.
- Blog posts live in `src/content/posts`.
- Static pages live in `src/content/pages`.
- The About page is driven by `src/data/about-content.js`, not `src/content/pages/about.md`.
- Site metadata and analytics settings live in `src/util/site.json`.

## Notes

- Keep bilingual content structure intact when editing content.
- Prefer documenting only commands and workflows that are confirmed by `package.json`, Netlify config, or checked-in CMS config.
