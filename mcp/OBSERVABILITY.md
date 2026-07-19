# Observability

Every tool call, landing classification, and MCP initialize emits one
anonymous event (no IPs, no identity — user-agent and country only; query
texts are collected transparently, as stated on the site). Events are
dual-written:

- **Workers Logs** — the in-dashboard view. Structured `{"co": {...}}` JSON,
  auto-indexed. Retention: 3 days (free) / 7 days (paid).
- **Analytics Engine** — dataset `contextoverflow_events`, 3-month
  retention, SQL API for trends.

## Event fields

`co.event` (tool_call | classify_api | initialize) · `co.tool` · `co.outcome`
(match | ambiguous | no_match | served | not_found) · `co.category` ·
`co.technique` · `co.query` (≤500 chars) · `co.clientName` (initialize only)
· `co.ua` · `co.country`

Analytics Engine blob order: event, tool, outcome, category, technique,
query, ua, country, clientName (blob1…blob9); double1 = 1; index1 = tool.

## Dashboard (Cloudflare → Workers & Pages → contextoverflow-mcp-production → Logs → Query Builder)

Saved queries have no API — create each once in the Query Builder and hit
**Save Query**; they persist account-wide. The six that answer "who / how
many / what":

1. **Calls by tool** — filter `co.event = tool_call`, group by `co.tool`,
   visualize count over time.
2. **Classification outcomes** — filter `co.event exists`, group by
   `co.outcome` (watch the no_match rate — it's the corpus-growth signal).
3. **Top problem categories** — filter `co.outcome = match`, group by
   `co.category`.
4. **Top techniques served** — filter `co.tool = get_technique OR
   apply_technique`, group by `co.technique`.
5. **Clients** — group by `co.clientName` (initialize events) and by `co.ua`.
6. **What people ask** — filter `co.query exists`, table view of `co.query`,
   `co.outcome`, `co.category`, newest first.

## Three-month trends (Analytics Engine SQL API)

Requires an API token with **Account Analytics: Read** (current project
tokens lack it — one-minute dashboard fix to enable pulling these remotely):

```sh
curl "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "SELECT blob2 AS tool, sum(_sample_interval) AS calls
      FROM contextoverflow_events
      WHERE timestamp > NOW() - INTERVAL '30' DAY
      GROUP BY tool ORDER BY calls DESC"
```

Variants: `blob4` = category, `blob3` = outcome, `blob8` = country,
`blob6` = query text.
