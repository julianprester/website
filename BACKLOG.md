# Website Backlog

Items discovered during the site audit. Checked items are implemented.

## Architecture & Build

- [ ] **Tailwind CSS v4 migration** — full config format rewrite
  (`tailwind.config.js` → CSS-based config). Will also unlock v4 performance
  improvements and smaller CSS output.
- [~] **CSS / HTML minification** — declined
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
  `actions/setup-node` steps (moot if workflows are being removed)
- [ ] **Add linting / formatting** — ESLint, Prettier, `.editorconfig`.
  Templates have inconsistent indentation (mix of 2-space and 4-space).
- [ ] **Missing `tags` in generated link posts** — `grab_articles.js` does
  not write a `tags: links` field in frontmatter, so newer links may not
  appear in `collections.links` (which `links.xml.njk` depends on).
- [ ] **Auto-merge socialbot PRs** — if LLM-generated tweets are considered
  pre-approved, add GitHub Actions auto-merge to avoid accumulating open PRs.

## SEO

- [x] **JSON-LD structured data** — Person on homepage, Book on bookshelf,
  Article on writing/news/links pages
- [x] **RSS auto-discovery `<link>` tags** — all 4 feeds discoverable from
  `<head>`
- [x] **Unique meta descriptions** — `eleventyComputed` derives per-page
  descriptions based on URL pattern
- [x] **Sitemap `<lastmod>` dates** — already present, outputs
  `page.date.toISOString()`
- [ ] **OG image generation** — auto-generate social cards per page (title +
  author + site name) instead of reusing the 512px favicon
- [x] **Canonical URLs on listing pages** — already present via `meta.html` on every page

## RSS Feeds

- [x] **Full content in RSS** — `<content:encoded>` with CDATA-wrapped HTML
  in all 4 feeds
- [x] **Channel descriptions** — meaningful subtitles for each feed
- [x] **`<category>` tags and `<dc:creator>`** — unified to `meta.name`,
  categories from item frontmatter tags

## Design & UX

- [x] **Skip-to-content link** — keyboard-accessible, visually hidden until
  focused
- [x] **`aria-current="page"` on active nav** — screen readers can now
  identify the current page
- [x] **Focus indicators on tab buttons** — replaced `outline-none` with
  `focus-visible:ring` on research page tabs
- [~] **Print stylesheet** — declined
- [x] **Update Twitter → X** — footer icon link and JSON-LD `sameAs`
- [x] **ARIA labels on RSS icon links** — all 6 RSS SVG links now have
  `aria-label`
- [x] **Tab panel ARIA roles** — `role="tablist"`, `role="tab"`,
  `role="tabpanel"`, `aria-selected`, `aria-labelledby`, `tabindex`

## Content

- [~] **Add `/news/` archive page** — declined
- [ ] **Writing section** — only 2 posts (both from 2023). Either commit to
  regular writing, fold existing posts into About, or hide the section
  until there's more content.
- [ ] **Homepage photo / headshot** — adds credibility for an academic
  personal site
- [x] **Custom 404 page** — styled page with nav links, Netlify-compatible

## Performance

- [~] **Bookshelf grid image optimization** — already well-optimized
  (width/height, loading=lazy, decoding=async); `fetchpriority` infeasible
  from the shortcode without a counter
- [x] **Alpine.js bundle size** — replaced with ~1KB inline vanilla JS + `<details>`

## Nice-to-Have

- [ ] **Webmention support** — for an academic blog, webmentions enable
  cross-blog conversations
- [ ] **Client-side search** — Pagefind (zero-config, ~200KB). Add to build
  pipeline, search input in nav. Covers all book notes, writing, links.
- [ ] **PWA / offline support** — service worker to cache pages for offline
  reading of book notes
- [ ] **CI status badge in README** — build/deploy status for visitors
