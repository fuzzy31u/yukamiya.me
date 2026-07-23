# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Gatsby v4 using the gatsby-starter-foundation template. It's a bilingual (English/Japanese) site for software engineer Yu Kamiya, featuring:

- Personal blog with Markdown posts
- Static pages (About, Contact, Index)
- Netlify CMS for content management
- Dark/light theme support with Theme UI
- Search functionality via ElasticLunr
- Responsive design with SCSS

## Commands

### Development
- `npm run develop` or `npm start` - Start development server at http://localhost:8000
- `gatsby develop` - Alternative development command
- `npm run clean` - Clean Gatsby cache and public directory

### Build & Deploy
- `npm run build` - Build for production (creates `public/` directory)
- `gatsby build --log-pages` - Build with page logging
- `npm run serve` - Serve production build locally

### Code Quality
- `npm run format` - Format code with Prettier (JS, JSX, JSON, MD files)

### Testing
- Tests are not implemented (package.json script returns exit code 1)

### Netlify CMS Local Development
- `npx netlify-cms-proxy-server` - Run CMS proxy server for local content editing
- Then run `gatsby develop` in another terminal

## Architecture

### Core Structure
- **Gatsby Configuration**: `gatsby-config.js` defines plugins, site metadata from `src/util/site.json`
- **Content Management**: Netlify CMS configured in `static/admin/config.yml`
- **Styling**: SCSS with Theme UI integration, theme colors in `src/util/` JSON files
- **Search**: ElasticLunr indexes title, template, and slug fields

### Key Directories
- `src/components/` - React components (layout, navigation, blog-list, etc.)
- `src/content/` - Markdown content (pages/ and posts/)
- `src/templates/` - Gatsby page templates for different content types
- `src/util/` - Configuration files (site metadata, theme colors, social media)
- `static/assets/` - Images and static files
- `static/admin/` - Netlify CMS configuration

### Content Structure
- Blog posts use frontmatter with template, title, slug fields
- Pages follow similar structure with different templates
- Site metadata and Google Analytics ID configured in `src/util/site.json`

### Deployment
- Deploys to Netlify with Node.js 14.15.0
- Build command: `npm run build`
- Publish directory: `public`
- Uses @netlify/plugin-gatsby for optimizations

## Important Notes
- This is a personal website - respect the bilingual content structure
- Site metadata and Google Analytics are configured via `src/util/site.json`
- Netlify CMS allows content editing without code changes
- Theme switching implemented via Theme UI with custom color schemes

## Content Update Guidelines
- When updating content with URLs (especially in about.md), always check each site and put the site title correctly, not only user's memo format
- Use WebFetch tool to get proper page titles and article names from actual websites
- Ensure all links have accurate, descriptive titles that match the source content
- **Important**: Check the details of the title, datetime on the links respectively before adding them to any section
- Use the canonical URL or `og:url` verified from the fetched source page. Do not replace a verified canonical URL with a guessed numeric or path-based alternative.
- The about page uses `src/data/about-content.js` for structured data, NOT the markdown file `src/content/pages/about.md`
- When adding new content to the about page, update `about-content.js` with proper bilingual titles (ja/en), dates, and URLs

## Automated Review Gate

- A Greptile score below 5/5 requires review and remediation, even when the review says the change is otherwise safe to merge.
- Check each Greptile finding against the fetched source and local code. Fix confirmed problems; keep verified canonical data when a finding is incorrect, and document the evidence in the PR.
- After each fix, push the PR and comment `@greptileai` to force a new review. Continue until the latest review reports 5/5 with no actionable findings.
- Merge only when the Greptile gate, all required GitHub checks, and `AUTO_REVIEW_STATUS: pass` are satisfied.
