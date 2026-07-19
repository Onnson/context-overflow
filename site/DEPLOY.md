# Deploying the site (Cloudflare Pages)

The site is generated from `corpus/` at build time; nothing under
`site/techniques/` is committed. The corpus validator runs as a pre-build
gate inside `build.mjs` — a corpus or privacy violation fails the deploy.

## Cloudflare Pages settings

- **Framework preset:** None
- **Root directory:** `/` (repository root — the build reads `corpus/` and `validator/`)
- **Build command:**

  ```sh
  cd site && npm ci && node build.mjs && bundle install && bundle exec jekyll build
  ```

- **Build output directory:** `site/_site`
- **Environment variables:** `RUBY_VERSION=3.3.0` (Node is auto-detected)

## Local build

```sh
cd site
npm ci
node build.mjs                      # validates corpus, generates pages
bundle install
bundle exec jekyll build            # output in site/_site
bundle exec jekyll serve            # preview at localhost:4000
```

## Domains

- `contextoverflow.org` — primary (this site)
- `contextoverflow.info` — 301 redirect to `.org` (Cloudflare Bulk Redirect)
- `contextoverflow.online` — MCP Worker, not this site

No analytics are configured, deliberately — none are added until everything
is live.
