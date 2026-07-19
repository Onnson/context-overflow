import type { Env } from "./observability.js";

/**
 * Key-protected usage dashboard served by the Worker itself: server-side SQL
 * against the Analytics Engine dataset, rendered as one HTML page. Wrong or
 * missing key returns 404 (the path stays invisible). Secrets:
 * DASH_KEY (access), ANALYTICS_TOKEN + CF_ACCOUNT_ID (SQL API reads).
 */

export interface DashEnv extends Env {
  DASH_KEY?: string;
  ANALYTICS_TOKEN?: string;
  CF_ACCOUNT_ID?: string;
}

function constantTimeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

const QUERIES: Record<string, string> = {
  byTool:
    'SELECT blob1 AS event, blob2 AS tool, count() AS n FROM "context-overflow" GROUP BY event, tool ORDER BY n DESC',
  outcomes:
    'SELECT blob3 AS outcome, count() AS n FROM "context-overflow" WHERE blob3 != \'\' GROUP BY outcome ORDER BY n DESC',
  categories:
    'SELECT blob4 AS k, count() AS n FROM "context-overflow" WHERE blob3 = \'match\' AND blob4 != \'\' GROUP BY k ORDER BY n DESC LIMIT 12',
  techniques:
    'SELECT blob5 AS k, count() AS n FROM "context-overflow" WHERE blob5 != \'\' GROUP BY k ORDER BY n DESC LIMIT 12',
  countries:
    'SELECT blob8 AS k, count() AS n FROM "context-overflow" WHERE blob8 != \'\' GROUP BY k ORDER BY n DESC LIMIT 12',
  clients:
    'SELECT blob7 AS k, count() AS n FROM "context-overflow" GROUP BY k ORDER BY n DESC LIMIT 12',
  daily:
    'SELECT toStartOfInterval(timestamp, INTERVAL \'1\' DAY) AS k, count() AS n FROM "context-overflow" GROUP BY k ORDER BY k',
  queries:
    'SELECT timestamp, blob6 AS query, blob3 AS outcome, blob4 AS category, blob8 AS country FROM "context-overflow" WHERE blob6 != \'\' ORDER BY timestamp DESC LIMIT 50',
};

type Row = Record<string, string>;

async function runSql(env: DashEnv, sql: string): Promise<Row[]> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/analytics_engine/sql`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${env.ANALYTICS_TOKEN}` },
      body: sql,
    }
  );
  if (!res.ok) throw new Error(`sql ${res.status}`);
  const data = (await res.json()) as { data?: Row[] };
  return data.data ?? [];
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function barPanel(title: string, rows: Row[], keyField: string): string {
  if (rows.length === 0) return `<section class="panel"><p class="eyebrow">${title}</p><p class="empty">no data yet</p></section>`;
  const max = Math.max(...rows.map((r) => Number(r.n)));
  const lines = rows
    .map(
      (r) => `<div class="row"><span class="label" title="${esc(r[keyField])}">${esc(r[keyField] || "—")}</span><span class="track"><span class="bar" style="width:${Math.max(2, Math.round((100 * Number(r.n)) / max))}%"></span></span><span class="n">${Number(r.n)}</span></div>`
    )
    .join("");
  return `<section class="panel"><p class="eyebrow">${title}</p>${lines}</section>`;
}

export async function handleDashboard(request: Request, env: DashEnv): Promise<Response> {
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!env.DASH_KEY || !constantTimeEqual(key, env.DASH_KEY)) {
    return new Response("Not found.", { status: 404 });
  }
  if (!env.ANALYTICS_TOKEN || !env.CF_ACCOUNT_ID) {
    return new Response("Dashboard data access is not configured (missing secrets).", { status: 503 });
  }

  const [byTool, outcomes, categories, techniques, countries, clients, daily, queries] =
    await Promise.all(Object.values(QUERIES).map((q) => runSql(env, q)));

  const total = byTool.reduce((s, r) => s + Number(r.n), 0);
  const noMatch = outcomes.find((r) => r.outcome === "no_match");
  const matches = outcomes.find((r) => r.outcome === "match");
  const classified = Number(matches?.n ?? 0) + Number(noMatch?.n ?? 0);
  const noMatchPct = classified ? Math.round((100 * Number(noMatch?.n ?? 0)) / classified) : 0;

  const queryRows = queries
    .map(
      (r) => `<tr><td>${esc(r.timestamp)}</td><td class="q">${esc(r.query)}</td><td>${esc(r.outcome)}</td><td>${esc(r.category)}</td><td>${esc(r.country)}</td></tr>`
    )
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>ContextOverflow — MCP usage</title>
<style>
  :root { --bg:#f7f8fa; --panel:#fff; --ink:#1c2024; --muted:#667085; --line:#e4e7ec; --accent:#5b5bd6; --soft:#eceafb; }
  @media (prefers-color-scheme: dark) { :root { --bg:#16181d; --panel:#1e2127; --ink:#e8eaed; --muted:#8b93a1; --line:#2c313a; --accent:#7c7ceb; --soft:#26263f; } }
  body { background:var(--bg); color:var(--ink); margin:0; padding:2rem 1rem 4rem;
         font:14px/1.5 ui-monospace,"SF Mono",Menlo,Consolas,monospace; }
  .wrap { max-width:62rem; margin:0 auto; display:flex; flex-direction:column; gap:1.25rem; }
  h1 { font-size:1.1rem; margin:0; } .sub { color:var(--muted); font-size:.75rem; margin-top:.3rem; }
  .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(9rem,1fr)); gap:.75rem; }
  .stat { background:var(--panel); border:1px solid var(--line); border-radius:6px; padding:.8rem 1rem; }
  .stat b { display:block; font-size:1.5rem; font-variant-numeric:tabular-nums; }
  .stat span { color:var(--muted); font-size:.7rem; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
  @media (max-width:44rem) { .grid { grid-template-columns:1fr; } }
  .panel { background:var(--panel); border:1px solid var(--line); border-radius:6px; padding:1rem 1.15rem; }
  .eyebrow { text-transform:uppercase; letter-spacing:.12em; font-size:.65rem; color:var(--muted); margin:0 0 .6rem; }
  .empty { color:var(--muted); font-size:.8rem; }
  .row { display:flex; align-items:center; gap:.6rem; margin:.35rem 0; }
  .label { flex:0 0 11rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:.78rem; }
  .track { flex:1; background:var(--soft); border-radius:3px; height:.85rem; }
  .bar { background:var(--accent); border-radius:3px; height:100%; display:block; }
  .n { flex:0 0 2.8rem; text-align:right; font-variant-numeric:tabular-nums; font-size:.78rem; }
  table { width:100%; border-collapse:collapse; font-size:.78rem; }
  th { text-align:left; color:var(--muted); font-weight:500; text-transform:uppercase; letter-spacing:.08em;
       font-size:.62rem; padding:.4rem .6rem; border-bottom:1px solid var(--line); }
  td { padding:.45rem .6rem; border-bottom:1px solid var(--line); vertical-align:top; }
  td.q { max-width:26rem; } .tablewrap { overflow-x:auto; }
  footer { color:var(--muted); font-size:.7rem; }
</style></head><body><div class="wrap">
<header><h1>ContextOverflow — MCP usage</h1>
<p class="sub">Analytics Engine dataset "context-overflow" · events since 2026-07-19 16:00 UTC · rendered live on request</p></header>
<div class="stats">
  <div class="stat"><b>${total}</b><span>total events</span></div>
  <div class="stat"><b>${classified}</b><span>classifications</span></div>
  <div class="stat"><b>${noMatchPct}%</b><span>no-match rate</span></div>
  <div class="stat"><b>${countries.length}</b><span>countries</span></div>
</div>
<div class="grid">
${barPanel("Calls by tool", byTool.map((r) => ({ ...r, k: r.tool || r.event })), "k")}
${barPanel("Outcomes", outcomes.map((r) => ({ ...r, k: r.outcome })), "k")}
${barPanel("Problem categories matched", categories, "k")}
${barPanel("Techniques served", techniques, "k")}
${barPanel("Countries", countries, "k")}
${barPanel("Clients (user-agent)", clients, "k")}
</div>
${barPanel("Events per day", daily, "k")}
<section class="panel"><p class="eyebrow">What people ask (latest 50)</p>
<div class="tablewrap"><table><tr><th>time (UTC)</th><th>query</th><th>outcome</th><th>category</th><th>country</th></tr>
${queryRows || '<tr><td colspan="5" class="empty">no queries yet</td></tr>'}
</table></div></section>
<footer>Anonymous by design: no IPs, no identity. Key-protected page; rotate with <code>wrangler secret put DASH_KEY --env production</code>.</footer>
</div></body></html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
