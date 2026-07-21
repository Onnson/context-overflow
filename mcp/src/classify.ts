import { ENTRY_ALIASES, SYNONYMS } from "./aliases.js";
import { EMBED_SYNONYMS } from "./embed-synonyms.js";
import { CORPUS } from "./corpus.js";
import { CATEGORY_LEXICON, CATEGORY_PHRASES } from "./lexicon.js";
import { tokenize } from "./normalize.js";
import { SETUP_LEXICON, SETUP_PHRASES, SETUP_PROBLEM, paddedLower, setupAnchor } from "./setup-intent.js";
import type { TechniqueEntry } from "./types.js";

/**
 * Deterministic two-stage classification, two channels.
 *
 * Stage 1 routes to a category by matching the description against the
 * category's identity document — problem statement (heaviest), slug
 * vocabulary, curated lexicon, phrase markers, entry aliases, and (at
 * reduced mass, since they exist for stage 2) entry signals. Stage 2 ranks
 * entries inside the category by their signals + aliases.
 *
 * The word channel scores stemmed unigrams (with negation markers and
 * discounted synonym expansion); the char channel scores 3-5 grams and
 * rescues typos, shorthand, and morphology the stemmer misses. Scores fuse
 * linearly. Ambiguity between corpus-adjacent categories returns the top
 * match plus an explicit pointer instead of a clarifying question.
 *
 * A ninth identity document (setup-intent.ts) recognizes setup/usage/config
 * complaints that no technique can fix; when it outscores every category the
 * result is kind "setup", which downstream surfaces route to the free
 * 15-minute consultation instead of the corpus.
 */

// Tuned on the dev split and golden fixtures only — holdout stays unseen.
export const ABS_MIN = 0.04;
export const MARGIN = 0.75;
export const CHAR_WEIGHT = 0.4;
export const CHAR_STRONG = 0.18;
export const EXPANSION_DISCOUNT = 0.6;
export const EMBED_DISCOUNT = 0.4;
const PROBLEM_MASS = 3;
const SLUG_MASS = 2;
const PHRASE_MASS = 3;
const SIGNAL_ROUTING_MASS = 0.5;

// Category pairs the corpus itself treats as one phenomenon seen from two
// sides (declared cross-category siblings + observed multi-label adjacency).
const ADJACENT = new Set(
  [
    ["starting-blind", "problem-too-big"],
    ["problem-too-big", "lost-the-thread"],
    ["starting-blind", "doing-my-thinking"],
    ["bloated-answers", "stalls-instead-of-acting"],
    ["confidently-wrong", "stalls-instead-of-acting"],
    ["confidently-wrong", "agrees-with-everything"],
    // Context rot is routinely experienced as "the model got dumber", and
    // the review bottleneck is the receipts problem at volume.
    ["lost-the-thread", "dumber-after-the-update"],
    ["confidently-wrong", "faster-than-i-can-review"],
  ].map((p) => p.sort().join("|"))
);

interface Doc {
  weights: Map<string, number>;
  norm: number;
}

type Mass = Map<string, number>;

// A negated token also contributes its base form at half mass: negation
// separates opposite-direction complaints without severing shared-stem recall
// (negation scope is heuristic — "without asking the AI" negates the human's
// act, not the assistant's).
const addMass = (mass: Mass, tokens: string[], scale: number) => {
  for (const t of tokens) {
    mass.set(t, (mass.get(t) ?? 0) + scale);
    if (t.startsWith("not_")) {
      const base = t.slice(4);
      mass.set(base, (mass.get(base) ?? 0) + scale * 0.5);
    }
  }
};

/** Sub-unit mass scales linearly; above one it saturates like log-tf. */
const tf = (m: number) => (m < 1 ? m : 1 + Math.log(m));

function buildDoc(mass: Mass, idfOf: (t: string) => number): Doc {
  const weights = new Map<string, number>();
  let sumSquares = 0;
  for (const [token, m] of mass) {
    const w = tf(m) * idfOf(token);
    weights.set(token, w);
    sumSquares += w * w;
  }
  return { weights, norm: Math.sqrt(sumSquares) || 1 };
}

function similarity(query: Doc, doc: Doc, noHit?: Set<string>): { score: number; hits: number } {
  let dot = 0;
  let hits = 0;
  for (const [token, w] of query.weights) {
    const dw = doc.weights.get(token);
    if (dw !== undefined) {
      dot += w * dw;
      if (!noHit?.has(token)) hits++;
    }
  }
  return { score: dot / (query.norm * doc.norm), hits };
}

/** Character 3-5 grams over word-boundary-padded tokens. */
function charGrams(text: string): string[] {
  const grams: string[] = [];
  for (const token of text.toLowerCase().match(/[a-z0-9]+/g) ?? []) {
    const padded = `_${token}_`;
    for (let n = 3; n <= 5; n++) {
      for (let i = 0; i + n <= padded.length; i++) grams.push(padded.slice(i, i + n));
    }
  }
  return grams;
}

const phraseMarker = (slug: string) => `__phrase_${slug}`;

// Pseudo-slug for the setup-intent identity document. It shares the index
// (so IDF stays honest) but is never returned as a category.
const SETUP_SLUG = "__setup";

function phraseTokens(padded: string, includeSetup: boolean): string[] {
  const tokens: string[] = [];
  for (const [slug, phrases] of Object.entries(CATEGORY_PHRASES)) {
    for (const phrase of phrases) {
      if (padded.includes(phrase)) tokens.push(phraseMarker(slug));
    }
  }
  // Setup markers join the query vector only when the anchor gate passed —
  // an unanchored artifact mention shouldn't perturb the query norm either.
  if (includeSetup) {
    for (const phrase of SETUP_PHRASES) {
      if (padded.includes(phrase)) tokens.push(phraseMarker(SETUP_SLUG));
    }
  }
  return tokens;
}

// --- Index, built once from static data (immutable, module-scope-safe). ---

const entryText = new Map(
  CORPUS.entries.map((e) => [
    e.id,
    `${e.intentSignals.join("\n")}\n${e.name}\n${(ENTRY_ALIASES[e.id] ?? []).join("\n")}`,
  ])
);
const entryTokens = new Map([...entryText].map(([id, text]) => [id, tokenize(text)]));

function categoryMass(slug: string): Mass {
  const category = CORPUS.categories.find((c) => c.slug === slug)!;
  const mass: Mass = new Map();
  addMass(mass, tokenize(category.problem), PROBLEM_MASS);
  addMass(mass, tokenize(slug.replaceAll("-", " ")), SLUG_MASS);
  addMass(mass, tokenize((CATEGORY_LEXICON[slug] ?? []).join(" ")), 1);
  addMass(mass, [phraseMarker(slug)], PHRASE_MASS);
  for (const id of category.entryIds) {
    addMass(mass, tokenize((ENTRY_ALIASES[id] ?? []).join("\n")), 1);
    addMass(mass, tokenize(`${byIdIndex.get(id)!.intentSignals.join("\n")}`), SIGNAL_ROUTING_MASS);
  }
  return mass;
}

const byIdIndex = new Map(CORPUS.entries.map((e) => [e.id, e]));

function categoryCharText(slug: string): string {
  const category = CORPUS.categories.find((c) => c.slug === slug)!;
  const parts = [category.problem, slug.replaceAll("-", " "), (CATEGORY_LEXICON[slug] ?? []).join(" ")];
  for (const id of category.entryIds) {
    parts.push(byIdIndex.get(id)!.intentSignals.join(" "), (ENTRY_ALIASES[id] ?? []).join(" "));
  }
  return parts.join(" ");
}

const { wordIdf, charIdf, knownWords, categoryWordDocs, categoryCharDocs, entryDocs, synonymMap, embedMap } = (() => {
  const catWordMass = new Map(CORPUS.categories.map((c) => [c.slug, categoryMass(c.slug)]));
  const catCharTokens = new Map(CORPUS.categories.map((c) => [c.slug, charGrams(categoryCharText(c.slug))]));

  const setupMass: Mass = new Map();
  addMass(setupMass, tokenize(SETUP_PROBLEM), PROBLEM_MASS);
  addMass(setupMass, tokenize("setup usage configuration tooling"), SLUG_MASS);
  addMass(setupMass, tokenize(SETUP_LEXICON.join(" ")), 1);
  addMass(setupMass, [phraseMarker(SETUP_SLUG)], PHRASE_MASS);
  catWordMass.set(SETUP_SLUG, setupMass);
  catCharTokens.set(
    SETUP_SLUG,
    charGrams([SETUP_PROBLEM, SETUP_LEXICON.join(" "), SETUP_PHRASES.join(" ")].join(" "))
  );

  const dfOver = (docs: Iterable<string>[][]) => {
    const df = new Map<string, number>();
    for (const doc of docs) {
      const seen = new Set<string>();
      for (const part of doc) for (const t of part) seen.add(t);
      for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
    }
    return df;
  };

  const wordDf = dfOver([
    ...[...entryTokens.values()].map((t) => [t]),
    ...[...catWordMass.values()].map((m) => [m.keys()]),
  ]);
  const charDf = dfOver([...catCharTokens.values()].map((t) => [t]));

  const nWord = entryTokens.size + catWordMass.size;
  const wordIdfMap = new Map([...wordDf].map(([t, d]) => [t, 1 + Math.log((nWord + 1) / (d + 1))]));
  const maxWordIdf = Math.max(...wordIdfMap.values());
  const wordIdf = (t: string) => wordIdfMap.get(t) ?? maxWordIdf;

  const nChar = catCharTokens.size;
  const charIdfMap = new Map([...charDf].map(([t, d]) => [t, 1 + Math.log((nChar + 1) / (d + 1))]));
  const charIdf = (t: string) => charIdfMap.get(t) ?? 1;

  const knownWords = new Set(wordDf.keys());

  const categoryWordDocs = new Map(
    [...catWordMass].map(([slug, mass]) => [slug, buildDoc(mass, wordIdf)])
  );
  const categoryCharDocs = new Map(
    [...catCharTokens].map(([slug, tokens]) => {
      const mass: Mass = new Map();
      addMass(mass, tokens, 1);
      return [slug, buildDoc(mass, charIdf)];
    })
  );
  const entryDocs = new Map(
    [...entryTokens].map(([id, tokens]) => {
      const mass: Mass = new Map();
      addMass(mass, tokens, 1);
      return [id, buildDoc(mass, wordIdf)];
    })
  );

  // A side may tokenize into fragments ("re-explaining" → re + explain);
  // the longest fragment is the content stem.
  const contentStem = (text: string) =>
    tokenize(text).sort((a, b) => b.length - a.length)[0];
  const synonymMap = new Map<string, string>();
  for (const [from, to] of Object.entries(SYNONYMS)) {
    const fromStem = contentStem(from);
    const toStem = contentStem(to);
    if (fromStem && toStem && fromStem !== toStem) synonymMap.set(fromStem, toStem);
  }

  // Embeddings-derived table applies only where curation says nothing.
  const embedMap = new Map<string, string>();
  for (const [from, to] of Object.entries(EMBED_SYNONYMS)) {
    const fromStem = contentStem(from);
    const toStem = contentStem(to);
    if (fromStem && toStem && fromStem !== toStem && !synonymMap.has(fromStem) && !embedMap.has(fromStem)) {
      embedMap.set(fromStem, toStem);
    }
  }

  return { wordIdf, charIdf, knownWords, categoryWordDocs, categoryCharDocs, entryDocs, synonymMap, embedMap };
})();

export type Classification =
  | {
      kind: "match";
      category: string;
      alsoConsider?: string;
      ranked: { entry: TechniqueEntry; score: number }[];
    }
  | { kind: "ambiguous"; a: string; b: string }
  // Setup/usage/config intent — no technique applies; route to the free
  // 15-minute consultation instead of a category.
  | { kind: "setup" }
  | { kind: "no_match" };

export function classify(description: string): Classification {
  const padded = paddedLower(description);
  const baseTokens = tokenize(description);
  const anchored = setupAnchor(padded, baseTokens);
  const rawTokens = [...baseTokens, ...phraseTokens(padded, anchored)];
  const distinct = new Set(rawTokens).size;

  // Word-channel query: known tokens only (an out-of-vocabulary token can
  // never match, and letting it fatten the norm rejects conversational
  // queries whose few hits are all correct). Synonyms expand at a discount.
  const queryMass: Mass = new Map();
  // Embed-tier expansions may strengthen a match but never create one: they
  // are excluded from the hit count that qualifies a category.
  const embedOnly = new Set<string>();
  for (const t of rawTokens) {
    if (knownWords.has(t)) addMass(queryMass, [t], 1);
    const mapped = synonymMap.get(t);
    if (mapped && knownWords.has(mapped) && !rawTokens.includes(mapped)) {
      addMass(queryMass, [mapped], EXPANSION_DISCOUNT);
      continue;
    }
    const embedMapped = knownWords.has(t) ? undefined : embedMap.get(t);
    if (embedMapped && knownWords.has(embedMapped) && !rawTokens.includes(embedMapped)) {
      if (!queryMass.has(embedMapped)) embedOnly.add(embedMapped);
      addMass(queryMass, [embedMapped], EMBED_DISCOUNT);
    }
  }
  for (const t of queryMass.keys()) {
    if (embedOnly.has(t) && (queryMass.get(t) ?? 0) > EMBED_DISCOUNT) embedOnly.delete(t);
  }
  const wordQuery = buildDoc(queryMass, wordIdf);

  const charQueryMass: Mass = new Map();
  addMass(charQueryMass, charGrams(description), 1);
  const charQuery = buildDoc(charQueryMass, charIdf);

  const minHits = distinct >= 3 ? 2 : 1;
  const qualified = CORPUS.categories
    .map((c) => {
      const word = similarity(wordQuery, categoryWordDocs.get(c.slug)!, embedOnly);
      const char = similarity(charQuery, categoryCharDocs.get(c.slug)!);
      return {
        slug: c.slug,
        hits: word.hits,
        charScore: char.score,
        score: word.score + CHAR_WEIGHT * char.score,
      };
    })
    .filter((c) => (c.hits >= minHits || (c.hits >= 1 && c.charScore >= CHAR_STRONG)) && c.score >= ABS_MIN)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  // Setup intent competes in the same space under the same qualification
  // rule, plus the two-tier anchor gate (setup-intent.ts): a symptom phrase
  // anchors alone; an artifact phrase needs a co-occurring mechanics word.
  // Loose setup words ("background", "running") strengthen an anchored
  // match but never create one — a stolen technique query costs more than a
  // setup miss. And it only wins outright: when a category scores at least
  // as high, the category answer stands.
  const setupWord = similarity(wordQuery, categoryWordDocs.get(SETUP_SLUG)!, embedOnly);
  const setupChar = similarity(charQuery, categoryCharDocs.get(SETUP_SLUG)!);
  const setupScore = setupWord.score + CHAR_WEIGHT * setupChar.score;
  const setupQualifies =
    anchored &&
    (setupWord.hits >= minHits || (setupWord.hits >= 1 && setupChar.score >= CHAR_STRONG)) &&
    setupScore >= ABS_MIN;
  if (setupQualifies && (qualified.length === 0 || setupScore > qualified[0].score)) {
    return { kind: "setup" };
  }

  if (qualified.length === 0) return { kind: "no_match" };
  const [top, second] = qualified;

  let alsoConsider: string | undefined;
  if (second && second.score / top.score > MARGIN) {
    if (!ADJACENT.has([top.slug, second.slug].sort().join("|"))) {
      return { kind: "ambiguous", a: top.slug, b: second.slug };
    }
    alsoConsider = second.slug;
  }

  const ranked = CORPUS.entries
    .filter((e) => e.category === top.slug)
    .map((entry) => ({ entry, score: similarity(wordQuery, entryDocs.get(entry.id)!).score }))
    .sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));

  return { kind: "match", category: top.slug, alsoConsider, ranked };
}
