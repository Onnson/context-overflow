# Deploying the site (Cloudflare Pages)

The site is generated from `corpus/` at build time; nothing under
`site/techniques/` is committed. The corpus validator runs as a pre-build
gate inside `build.mjs` — a corpus or privacy violation fails the deploy.

## Launch path A — direct upload (no dashboard, pure CLI)

Build locally, upload the artifact; needs only a Pages-scoped API token:

```sh
cd site && npm ci && node build.mjs && bundle install && bundle exec jekyll build
npx wrangler pages project create contextoverflow --production-branch main
npx wrangler pages deploy _site --project-name contextoverflow
# then attach the custom domain:
npx wrangler pages domain add contextoverflow --domain contextoverflow.org   # (or via API/dashboard)
```

Re-deploys are a re-run of build + `pages deploy`. Git-integrated CI builds
(path B below) can replace this later — connecting the GitHub repo requires
a one-time dashboard authorization.

## Launch path B — git-integrated Pages settings

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

- `contextoverflow.org` — the only domain: this site, plus the MCP Worker
  routed at `contextoverflow.org/mcp*` and `/classify` on the same zone

No analytics are configured, deliberately — none are added until everything
is live.
