/**
 * "Not a technique" intent: complaints about tooling, configuration, or
 * usage mechanics — installing, connecting, keys, quotas, or seeing what a
 * running agent is doing. No thinking technique fixes these, so the
 * classifier routes them to a free 15-minute human consultation instead of
 * pretending a category fits.
 *
 * Anchoring is two-tier (adversarial audit, 2026-07-21): symptom phrases
 * describe broken mechanics and anchor alone; artifact phrases merely name
 * tooling objects ("api key", "mcp server") and anchor only alongside a
 * mechanics word elsewhere in the query — otherwise any sentence that
 * *mentions* the artifact ("rename an api key constant") gets stolen from
 * its real category. A setup miss falls back to no_match; a stolen
 * technique query is a wrong answer.
 */

import { tokenize } from "./normalize.js";

export const CONSULT_PAGE_PATH = "/not-a-technique/";
export const CONSULT_CAL_URL = "https://cal.com/onnson/15min?overlayCalendar=true";

export const SETUP_PROBLEM =
  "I can't see what my agent is doing while it runs in the background — or the tool itself won't install, connect, or stay configured";

export const SETUP_LEXICON: string[] = [
  "install installed installing reinstall setup configure configured configuration config settings",
  "connect connected connecting connection disconnect disconnected endpoint server localhost port offline",
  "logs logging monitor monitoring observability dashboard console terminal tail status visibility",
  "notification notifications notify alerts watch watching background running process",
  "key keys token credential credentials auth authentication login password billing subscription quota version upgrade api",
  "permission denied npm invoice charged downgrade changelog errors",
];

/** Phrases that describe broken mechanics — anchor setup on their own. */
export const SETUP_SYMPTOM_PHRASES: string[] = [
  "whats happening",
  "what's happening",
  "what is happening",
  "what it's doing",
  "what its doing",
  "cant see what",
  "can't see what",
  "still running",
  "is it running",
  "how do i install",
  "how to install",
  "how do i set up",
  "how to set up",
  "set it up",
  "wont connect",
  "won't connect",
  "not connecting",
  "connection refused",
  "logged out",
  "signed out",
  "permission denied",
  "quota exceeded",
  "find the logs",
  "where are the logs",
  "my invoice",
  "charged twice",
  "which version am i",
];

/**
 * Phrases that merely name a tooling artifact — anchor only when a
 * mechanics word co-occurs, so mentioning the artifact isn't enough.
 */
export const SETUP_ARTIFACT_PHRASES: string[] = [
  "in the background",
  "api key",
  "mcp server",
  "env var",
  "environment variable",
  "config file",
  "rate limit",
  "usage limit",
];

export const SETUP_PHRASES: string[] = [...SETUP_SYMPTOM_PHRASES, ...SETUP_ARTIFACT_PHRASES];

// Words that signal something is actually broken or actively running (the
// artifact tier's required co-occurrence). Deliberately excludes the
// artifact phrases' own tokens (api, key, server, config, …).
const MECHANICS_WORDS =
  "running runs process broken break breaks breaking fail fails failed failing " +
  "error errors crash crashes crashed expired expires invalid missing denied " +
  "refused refuses timeout disconnect disconnects disconnected reconnect exceeded revoked rotated";
const MECHANICS_STEMS = new Set(tokenize(MECHANICS_WORDS));

/** The padded lowercase form every phrase channel substring-matches against. */
export const paddedLower = (description: string) =>
  ` ${description.toLowerCase().replace(/[^a-z0-9']+/g, " ")} `;

/**
 * The anchor gate: a symptom phrase alone qualifies; an artifact phrase
 * qualifies only with a mechanics stem somewhere in the query.
 */
export function setupAnchor(padded: string, queryStems: Iterable<string>): boolean {
  if (SETUP_SYMPTOM_PHRASES.some((p) => padded.includes(p))) return true;
  if (!SETUP_ARTIFACT_PHRASES.some((p) => padded.includes(p))) return false;
  for (const t of queryStems) {
    const base = t.startsWith("not_") ? t.slice(4) : t;
    if (MECHANICS_STEMS.has(base)) return true;
  }
  return false;
}
