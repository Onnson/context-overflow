/**
 * Usage events, dual-written: structured console.log → Workers Logs (the
 * in-dashboard Query Builder view, days of retention) and Analytics Engine
 * → 3-month trends via SQL. Anonymous by design — user-agent and country,
 * never IPs or identity. Query texts are collected transparently (the site
 * says so in plain words) to grow the corpus and understand how people and
 * AI collaborate. Logging must never break a request: everything is
 * try/catch-swallowed, and an absent binding is a silent skip.
 */

export interface CoEvent {
  event: "tool_call" | "classify_api" | "initialize";
  tool?: string;
  outcome?: string;
  category?: string;
  technique?: string;
  query?: string;
  clientName?: string;
}

export interface Env {
  CO_EVENTS?: AnalyticsEngineDataset;
}

const QUERY_LIMIT = 500;

export function record(env: Env, request: Request, e: CoEvent): void {
  const enriched = {
    ...e,
    query: e.query?.slice(0, QUERY_LIMIT),
    ua: request.headers.get("user-agent") ?? "",
    country: (request.cf?.country as string) ?? "",
  };
  try {
    console.log(JSON.stringify({ co: enriched }));
  } catch {}
  try {
    env.CO_EVENTS?.writeDataPoint({
      blobs: [
        enriched.event,
        enriched.tool ?? "",
        enriched.outcome ?? "",
        enriched.category ?? "",
        enriched.technique ?? "",
        enriched.query ?? "",
        enriched.ua,
        enriched.country,
        enriched.clientName ?? "",
      ],
      doubles: [1],
      indexes: [enriched.tool ?? enriched.event],
    });
  } catch {}
}
