/**
 * Creates the ContextOverflow usage views as saved queries in Cloudflare's
 * own dashboard (Workers & Pages → Observability → Queries) via the
 * Workers Observability API. Idempotent: existing queries with the same
 * name are left untouched.
 *
 * The queries CRUD endpoints are present in Cloudflare's official OpenAPI
 * schema (github.com/cloudflare/api-schemas) though not rendered on the
 * docs site; verified live with a create/list/delete round-trip.
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... \
 *     node scripts/create-dashboard-queries.mjs
 */

const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token || !account) {
  console.error("set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID");
  process.exit(1);
}
const BASE = `https://api.cloudflare.com/client/v4/accounts/${account}/workers/observability/queries`;

const count = { key: "", keyType: "string", operator: "count" };
const str = (value) => ({ value, type: "string" });
const eq = (key, value) => ({ key, operation: "eq", value, type: "string" });
const exists = (key) => ({ key, operation: "exists", type: "string" });

const QUERIES = [
  {
    name: "CO / Calls by tool",
    description: "MCP tool calls, grouped by tool. Chart count over time in Visualizations.",
    parameters: {
      datasets: ["cloudflare-workers"],
      filters: [eq("co.event", "tool_call")],
      calculations: [count],
      groupBys: [str("co.tool")],
      limit: 100,
    },
  },
  {
    name: "CO / Outcomes & no-match rate",
    description: "Classification outcomes across MCP and the landing box. no_match share = corpus-growth signal.",
    parameters: {
      datasets: ["cloudflare-workers"],
      filters: [exists("co.outcome")],
      calculations: [count],
      groupBys: [str("co.outcome")],
      limit: 100,
    },
  },
  {
    name: "CO / Top problem categories",
    description: "Which of the eight problems people actually have (matched classifications).",
    parameters: {
      datasets: ["cloudflare-workers"],
      filters: [eq("co.outcome", "match")],
      calculations: [count],
      groupBys: [str("co.category")],
      limit: 100,
    },
  },
  {
    name: "CO / Techniques served",
    description: "Which techniques get fetched and applied.",
    parameters: {
      datasets: ["cloudflare-workers"],
      filters: [exists("co.technique")],
      calculations: [count],
      groupBys: [str("co.technique")],
      limit: 100,
    },
  },
  {
    name: "CO / Clients & countries",
    description: "Who connects: user agents and countries (anonymous; no IPs logged).",
    parameters: {
      datasets: ["cloudflare-workers"],
      filters: [exists("co.event")],
      calculations: [count],
      groupBys: [str("co.ua"), str("co.country")],
      limit: 100,
    },
  },
  {
    name: "CO / What people ask",
    description: "Raw questions sent for matching (collected transparently, per site disclosure). View as events list.",
    parameters: {
      datasets: ["cloudflare-workers"],
      filters: [exists("co.query")],
      calculations: [],
      groupBys: [],
      limit: 100,
    },
  },
];

const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const listRes = await fetch(BASE, { headers });
const existing = new Set(((await listRes.json()).result ?? []).map((q) => q.name));

for (const query of QUERIES) {
  if (existing.has(query.name)) {
    console.log(`skip (exists): ${query.name}`);
    continue;
  }
  const res = await fetch(BASE, { method: "POST", headers, body: JSON.stringify(query) });
  const body = await res.json();
  if (body.success) {
    console.log(`created: ${query.name} (${body.result.id})`);
  } else {
    console.error(`FAILED: ${query.name} → ${JSON.stringify(body.errors).slice(0, 200)}`);
    process.exitCode = 1;
  }
}
