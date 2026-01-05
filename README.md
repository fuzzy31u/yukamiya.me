# yukamiya.me

Personal website for Yu Kamiya, a software engineer. This is a bilingual (English/Japanese) site featuring a blog and personal information.

[![Netlify Status](https://api.netlify.com/api/v1/badges/63521b78-612e-4a2f-a409-3fa8009e7f3b/deploy-status)](https://app.netlify.com/sites/frosty-perlman-9da1cb/deploys)

**Live Site:** [yukamiya.me](https://yukamiya.me)

## About This Site

This website is built with Gatsby v4 and features:

- **Bilingual Content**: Full support for English and Japanese content
- **Blog Posts**: Markdown-based blog posts with frontmatter
- **Static Pages**: About, Contact, and Index pages
- **Content Management**: Netlify CMS for easy content editing
- **Theme Support**: Dark/light mode with Theme UI
- **Search**: ElasticLunr-powered search functionality
- **Responsive Design**: Mobile-friendly SCSS styling
- **SEO Optimized**: OpenGraph, Twitter Cards, and XML sitemaps

## Development

### Prerequisites

- Node.js (v14.15.0 or higher)
- npm

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/fuzzy31u/yukamiya.me.git
cd yukamiya.me
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run develop
# or
npm start
```

The site will be available at `http://localhost:8000`

GraphQL playground: `http://localhost:8000/___graphql`

### Local Content Editing with Netlify CMS

To use Netlify CMS locally:

1. In one terminal, start the CMS proxy server:
```bash
npx netlify-cms-proxy-server
```

2. In another terminal, start Gatsby:
```bash
npm run develop
```

3. Access the CMS at `http://localhost:8000/admin/`

### Available Commands

- `npm run develop` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build locally
- `npm run clean` - Clean Gatsby cache and public directory
- `npm run format` - Format code with Prettier

## Project Structure

```
.
├── src/
│   ├── components/     # React components (layout, navigation, etc.)
│   ├── content/        # Markdown content (pages/ and posts/)
│   ├── data/           # Structured data (about-content.js)
│   ├── templates/      # Gatsby page templates
│   └── util/           # Configuration files (site.json, theme colors, social media)
├── static/
│   ├── admin/          # Netlify CMS configuration
│   └── assets/         # Images and static files
├── gatsby-config.js    # Gatsby configuration
├── gatsby-node.js      # Gatsby Node APIs
└── gatsby-browser.js   # Gatsby browser APIs
```

## Configuration

Site metadata and settings are configured in:
- `src/util/site.json` - Site title, description, URL, social media handles, Google Analytics
- `src/util/default-colors.json` - Default theme colors
- `static/admin/config.yml` - Netlify CMS configuration

## Content Management

### About Page
The About page uses structured data from `src/data/about-content.js` (not the markdown file). When updating the About page, edit this JavaScript file with proper bilingual titles (ja/en), dates, and URLs.

### Blog Posts
Blog posts are stored in `src/content/posts/` as Markdown files with frontmatter including:
- `template`: Post template type
- `title`: Post title
- `slug`: URL slug
- `date`: Publication date

### Static Pages
Static pages are stored in `src/content/pages/` with similar frontmatter structure.

## Deployment

This site is deployed on Netlify with:
- **Build Command**: `npm run build`
- **Publish Directory**: `public`
- **Node Version**: 14.15.0
- **Plugin**: @netlify/plugin-gatsby for optimizations

## Technology Stack

- **Framework**: Gatsby v4
- **CMS**: Netlify CMS
- **Styling**: SCSS with Theme UI
- **Search**: ElasticLunr
- **Deployment**: Netlify
- **Analytics**: Google Analytics

## License

MIT

## Credits

Built with [gatsby-starter-foundation](https://github.com/stackrole/gatsby-starter-foundation)
