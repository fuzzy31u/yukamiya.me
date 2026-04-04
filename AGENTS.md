# AGENTS.md

## Project Overview

This repository is a bilingual personal website built with Gatsby v4. It uses Netlify CMS for content editing and deploys to Netlify.

## Commands

- `npm install` - Install dependencies
- `npm run develop` or `npm start` - Start the Gatsby dev server at `http://localhost:8000`
- `npm run build` - Build the site for production with page logging
- `npm run serve` - Serve the production build locally
- `npm run clean` - Clean Gatsby cache and `public/`
- `npm run format` - Format `js`, `jsx`, `json`, and `md` files with Prettier
- `npm test` - Placeholder script that exits with code 1; automated tests are not implemented

## Repo Workflows

- Local Netlify CMS editing: run `npx netlify-cms-proxy-server`, then start Gatsby in another terminal and open `/admin/`
- About page updates: edit `src/data/about-content.js`; the About page does not use `src/content/pages/about.md`
- Blog posts: add or update Markdown files in `src/content/posts/`
- Static pages managed by CMS live in `src/content/pages/`

## Deployment Notes

- Netlify build command: `npm run build`
- Netlify publish directory: `public`
- Netlify Node version: `14.15.0`
- Netlify uses `@netlify/plugin-gatsby`
