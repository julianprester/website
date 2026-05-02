# Website Backlog

Items discovered during the site audit. Ordered roughly by impact within each
category.

## Architecture & Build

- [ ] **Tailwind CSS v4 migration** — full config format rewrite
  (`tailwind.config.js` → CSS-based config). Will also unlock v4 performance
  improvements and smaller CSS output.
- [~] **CSS minification** — declined
- [~] **HTML minification** — declined
- [ ] **Cache busting** — hash-based filenames or query strings for
  `/css/tailwind.css` and `/js/alpine.js` so CDN caches don't serve stale
  assets
- [ ] **RSS plugin virtual templates** — the RSS plugin v3.0.0 added a
  "Virtual Template" method that could replace the 4 separate XML files
  (`all.xml.njk`, `bookshelf.xml.njk`, `links.xml.njk`, `writing.xml.njk`)
  with config calls in `.eleventy.js`
- [ ] **Drop `grab_articles.js` heavy dependencies** — `openai`, `axios`,
  `turndown` are only used by this one script. Consider extracting to a
  separate package or simplifying. Also evaluate `openai` v4→v6 upgrade.
- [ ] **Shared config for `util/` scripts** — `@octokit/rest` is
  initialized in both `grab_articles.js` and `status_update.js`; env vars
  are read blindly. A shared `util/config.js` would reduce duplication and
  add startup validation.
- [ ] **GitHub Actions: cache `node_modules`** — add `cache: 'npm'` to all
  `actions/setup-node` steps
- [ ] **Add linting / formatting** — ESLint, Prettier, `.editorconfig`.
  Templates have inconsistent indentation (mix of 2-space and 4-space).
- [ ] **Missing `tags` in generated link posts** — `grab_articles.js` does
  not write a `tags: links` field in frontmatter, so newer links may not
  appear in `collections.links` (which  `links.xml.njk` depends on).
- [ ] **Auto-merge socialbot PRs** — if LLM-generated tweets are considered
  pre-approved, add GitHub Actions auto-merge to avoid accumulating open PRs.

## SEO

- [ ] **JSON-LD structured data** — add Schema.org markup:
  - Homepage: `Person` (affiliation, alumniOf, sameAs links)
  - `/research/`: `ScholarlyArticle` for each publication
  - `/bookshelf/<slug>/`: `Book` (author, dateRead, review body)
  - `/writing/<slug>/`: `Article` / `BlogPosting`
- [ ] **RSS auto-discovery `<link>` tags** — add to `<head>` so browsers and
  feed readers can discover the feeds automatically
- [ ] **Unique meta descriptions** — pages without explicit `description`
  frontmatter (books, news items) inherit the same generic description from
  `base.html`. Use `eleventyComputed` to auto-derive descriptions from
  content.
- [ ] **Sitemap `<lastmod>` dates** — `sitemap.xml.njk` should include
  `<lastmod>` for each URL
- [ ] **OG image generation** — auto-generate social cards per page (title +
  author + site name) instead of reusing the 512px favicon
- [ ] **Canonical URLs on listing pages** — add self-referencing canonicals
  to `bookshelf.html`, `writing.html`, `tags.html`

## RSS Feeds

- [ ] **Full content in RSS** — feeds currently only include excerpts.
  Switch to `<content:encoded>` with full HTML content.
- [ ] **Author, category, and `<dc:creator>` tags** — some feeds hardcode
  author info while others use `meta.name`; unify and add categories.

## Design & UX

- [ ] **Skip-to-content link** — WCAG 2.1 AA requirement, helps keyboard
  users bypass navigation
- [ ] **`aria-current="page"` on active nav** — currently only color
  indicates the active page; screen reader users get no indication
- [ ] **Focus indicators on tab buttons** — the research page tabs
  (Journal/Conference/Presentations) use `outline-none` with no alternative
  focus style
- [ ] **Print stylesheet** — academic site; visitors may print CV,
  publications, or book notes. At minimum hide nav/footer and remove dark
  backgrounds.
- [ ] **Update Twitter → X** — footer and meta tags still reference
  `twitter.com` instead of `x.com` (currently redirects)
- [ ] **ARIA labels on RSS icon links** — the RSS SVG links in
  `writing.html` and `bookshelf.html` have no text content, announcing as
  "empty link" to screen readers
- [ ] **Tab panel ARIA roles** — the Alpine-powered tabs on the research
  page lack `role="tablist"`, `role="tab"`, `role="tabpanel"`,
  `aria-selected`, and keyboard navigation support

## Content

- [ ] **Add `/news/` archive page** — the "What's New" section shows 5
  items with a "Show more" toggle. A dedicated `/news/` listing page would
  improve discoverability of older milestones.
- [ ] **Writing section** — only 2 posts (both from 2023). Either commit to
  regular writing, fold existing posts into About, or hide the section
  until there's more content.
- [ ] **Homepage photo / headshot** — adds credibility for an academic
  personal site
- [ ] **Custom 404 page** — currently no `404.html`; Netlify will serve its
  generic fallback

## Performance

- [ ] **Bookshelf grid image optimization** — all 23 covers load eagerly.
  Add explicit `width`/`height` to prevent layout shift; consider
  `fetchpriority="low"` for below-fold images.
- [ ] **Alpine.js bundle size** — the full CDN build is ~44KB but only 3
  components use it (dark mode, show-more, tabs). Consider the CSP build
  (~15KB) or vanilla JS (~1KB).

## Nice-to-Have

- [ ] **Webmention support** — for an academic blog, webmentions enable
  cross-blog conversations
- [ ] **Client-side search** — Pagefind or Lunr for finding books, posts,
  and links
- [ ] **PWA / offline support** — service worker to cache pages for offline
  reading of book notes
- [ ] **CI status badge in README** — build/deploy status for visitors
