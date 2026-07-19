# Observability

Every tool call, landing classification, and MCP initialize emits one
anonymous event (no IPs, no identity — user-agent and country only; query
texts are collected transparently, as stated on the site). Events are
dual-written:

- **Workers Logs** — the in-dashboard view. Structured `{"co": {...}}` JSON,
  auto-indexed. Retention: 3 days (free) / 7 days (paid).
- **Analytics Engine** — dataset `context-overflow`, 3-month
  retention, SQL API for trends.

## Event fields

`co.event` (tool_call | classify_api | initialize) · `co.tool` · `co.outcome`
(match | ambiguous | no_match | served | not_found) · `co.category` ·
`co.technique` · `co.query` (≤500 chars) · `co.clientName` (initialize only)
· `co.ua` · `co.country`

Analytics Engine blob order: event, tool, outcome, category, technique,
query, ua, country, clientName (blob1…blob9); double1 = 1; index1 = tool.

## Dashboard (Cloudflare → Workers & Pages → Observability → Queries)

Six saved queries live in the Cloudflare dashboard itself, created via the
Workers Observability API (`scripts/create-dashboard-queries.mjs` —
idempotent, re-runnable with `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`):

`CO / Calls by tool` · `CO / Outcomes & no-match rate` (the no_match share
is the corpus-growth signal) · `CO / Top problem categories` ·
`CO / Techniques served` · `CO / Clients & countries` ·
`CO / What people ask` (raw query log)

Open any of them in the Queries tab; the Visualizations tab charts them.
API note: the queries CRUD endpoints (`/accounts/{id}/workers/observability/
queries`, GET/POST/PATCH/DELETE) are in Cloudflare's official OpenAPI schema
and answer live, but are not rendered on the docs site — the docs show only
the telemetry endpoints. `POST …/telemetry/query` with a `queryId` re-runs
a saved query programmatically.

## Three-month trends (Analytics Engine SQL API)

Requires an API token with **Account Analytics: Read** (current project
tokens lack it — one-minute dashboard fix to enable pulling these remotely):

```sh
curl "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql" \
  -H "Authorization: Bearer <TOKEN>" \
  --data-binary @- <<'SQL'
SELECT blob2 AS tool, sum(_sample_interval) AS calls
FROM "context-overflow"
WHERE timestamp > NOW() - INTERVAL '30' DAY
GROUP BY tool ORDER BY calls DESC
SQL
```

Variants: `blob4` = category, `blob3` = outcome, `blob8` = country,
`blob6` = query text.
