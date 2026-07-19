import { CORPUS } from "./corpus.js";
import { CATEGORY_LEXICON, CATEGORY_PHRASES } from "./lexicon.js";
import { bag, tokenize } from "./normalize.js";
import type { TechniqueEntry } from "./types.js";

/**
 * Deterministic two-stage classification. Stage 1 routes to a category by
 * matching the description against the category's identity document —
 * problem statement (weighted highest), slug vocabulary, curated lexicon,
 * and its entries' intent signals. Stage 2 ranks entries inside the category
 * by their own signals. Signal vocabularies collide heavily ACROSS
 * categories; identity-first routing is what makes lexical matching viable.
 */

// A description scoring under ABS_MIN matches nothing; a runner-up within
// MARGIN of the winner makes the match ambiguous. Tuned by golden fixtures.
export const ABS_MIN = 0.04;
export const MARGIN = 0.82;
const PROBLEM_WEIGHT = 3;
const SLUG_WEIGHT = 2;

interface Doc {
  weights: Map<string, number>;
  norm: number;
}

function buildDoc(counts: Map<string, number>, idfOf: (t: string) => number): Doc {
  const weights = new Map<string, number>();
  let sumSquares = 0;
  for (const [token, count] of counts) {
    const w = (1 + Math.log(count)) * idfOf(token);
    weights.set(token, w);
    sumSquares += w * w;
  }
  return { weights, norm: Math.sqrt(sumSquares) || 1 };
}

function similarity(query: Doc, doc: Doc): { score: number; hits: number } {
  let dot = 0;
  let hits = 0;
  for (const [token, w] of query.weights) {
    const dw = doc.weights.get(token);
    if (dw !== undefined) {
      dot += w * dw;
      hits++;
    }
  }
  return { score: dot / (query.norm * doc.norm), hits };
}

// --- Index, built once from static corpus data (immutable, module-scope-safe).

const entrySignalTokens = new Map(
  CORPUS.entries.map((e) => [e.id, tokenize(`${e.intentSignals.join("\n")}\n${e.name}`)])
);

const PHRASE_WEIGHT = 3;
const phraseMarker = (slug: string) => `__phrase_${slug}`;

const categoryIdentityTokens = new Map(
  CORPUS.categories.map((c) => {
    const tokens: string[] = [];
    for (let i = 0; i < PROBLEM_WEIGHT; i++) tokens.push(...tokenize(c.problem));
    for (let i = 0; i < SLUG_WEIGHT; i++) tokens.push(...tokenize(c.slug.replaceAll("-", " ")));
    tokens.push(...tokenize((CATEGORY_LEXICON[c.slug] ?? []).join(" ")));
    for (let i = 0; i < PHRASE_WEIGHT; i++) tokens.push(phraseMarker(c.slug));
    return [c.slug, tokens];
  })
);

/** Literal phrase hits become marker tokens the unigram model can score. */
function phraseTokens(description: string): string[] {
  const lower = ` ${description.toLowerCase().replace(/[^a-z0-9']+/g, " ")} `;
  const tokens: string[] = [];
  for (const [slug, phrases] of Object.entries(CATEGORY_PHRASES)) {
    for (const phrase of phrases) {
      if (lower.includes(phrase)) tokens.push(phraseMarker(slug));
    }
  }
  return tokens;
}

// Document frequency over every matchable document: 22 entry docs + 8
// category identity docs. Query tokens seen in no document get the MAXIMUM
// idf — unknown means rare, and a fat query norm is what keeps off-topic
// queries from scoring on a single stray overlap.
const idfOf = (() => {
  const df = new Map<string, number>();
  const docs = [...entrySignalTokens.values(), ...categoryIdentityTokens.values()];
  for (const tokens of docs) {
    for (const token of new Set(tokens)) df.set(token, (df.get(token) ?? 0) + 1);
  }
  const n = docs.length;
  const idf = new Map([...df].map(([t, d]) => [t, 1 + Math.log((n + 1) / (d + 1))]));
  const maxIdf = Math.max(...idf.values());
  return (token: string) => idf.get(token) ?? maxIdf;
})();

const entryDocs = new Map(
  [...entrySignalTokens].map(([id, tokens]) => [id, buildDoc(bag(tokens), idfOf)])
);

const categoryDocs = new Map(
  CORPUS.categories.map((c) => {
    const tokens = [...categoryIdentityTokens.get(c.slug)!];
    for (const id of c.entryIds) tokens.push(...entrySignalTokens.get(id)!);
    return [c.slug, buildDoc(bag(tokens), idfOf)];
  })
);

export type Classification =
  | { kind: "match"; category: string; ranked: { entry: TechniqueEntry; score: number }[] }
  | { kind: "ambiguous"; a: string; b: string }
  | { kind: "no_match" };

export function classify(description: string): Classification {
  const queryTokens = [...tokenize(description), ...phraseTokens(description)];
  const query = buildDoc(bag(queryTokens), idfOf);
  const distinct = new Set(queryTokens).size;

  // Longer descriptions must land more than one distinct token — a single
  // shared word in an otherwise foreign query is coincidence, not intent.
  // Qualification comes BEFORE ranking: a one-hit interloper outscoring the
  // right category must not turn the whole query into a no-match.
  const minHits = distinct >= 3 ? 2 : 1;
  const qualified = CORPUS.categories
    .map((c) => ({ slug: c.slug, ...similarity(query, categoryDocs.get(c.slug)!) }))
    .filter((c) => c.score >= ABS_MIN && c.hits >= minHits)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  if (qualified.length === 0) return { kind: "no_match" };
  const [top, second] = qualified;
  if (second && second.score / top.score > MARGIN) {
    return { kind: "ambiguous", a: top.slug, b: second.slug };
  }

  const ranked = CORPUS.entries
    .filter((e) => e.category === top.slug)
    .map((entry) => ({ entry, score: similarity(query, entryDocs.get(entry.id)!).score }))
    .sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));

  return { kind: "match", category: top.slug, ranked };
}
