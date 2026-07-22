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

Analytics are anonymous by design: a cookieless Cloudflare Web Analytics
beacon (in `_includes/head_custom.html`) for the site, plus per-request
MCP and `/classify` events written to Analytics Engine — user-agent and
country only, never IPs or identity. Details in `mcp/OBSERVABILITY.md`.

## Post-deploy cache check

The theme's CSS filenames never change between deploys. The zone's Browser
Cache TTL setting, if set to a fixed value, overwrites the `max-age=0,
must-revalidate` that Pages sends — browsers that visited before the deploy
then keep the old stylesheet for that TTL while receiving new HTML.
Preview subdomains bypass the zone and can never reproduce this.

After every production deploy, fetch both stylesheets and grep for a rule
introduced by the deploy:

    curl -s -A "co-probe/1" https://contextoverflow.org/assets/css/just-the-docs-default.css | grep -c <new-rule>
    curl -s -A "co-probe/1" https://contextoverflow.org/assets/css/just-the-docs-dark.css | grep -c <new-rule>

Permanent fix (dashboard, zone owner): Caching → Configuration → Browser
Cache TTL → "Respect Existing Headers".

## AI-search watch (cognitive-debt authority)

Target queries (baseline 2026-07-22: contextoverflow.org absent from all —
recorded in persistent_context/workflow_state/exploration_findings.md):

- what is cognitive debt AI
- how do I avoid cognitive debt from ChatGPT
- techniques to stop AI making me dumber
- cognitive offloading how to prevent AI
- is AI making me dumber what to do

Re-probe weekly (jina/Google for classic results; ChatGPT/Perplexity/Gemini
manually). Server-side truth: zone analytics hits from OAI-SearchBot,
PerplexityBot / Perplexity-User, Claude-SearchBot — answer-engine fetches.
