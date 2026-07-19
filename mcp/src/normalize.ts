const STOPWORDS = new Set(
  (
    "a an the and or but if then else when while at by for with about into through during before after " +
    "to from up down in out on off over under again further here there all any both each few more " +
    "most other some such no nor not only own same so than too very can will just should now i me my we " +
    "how why where whether " +
    "our you your he him his she her it its they them their what which who whom this that these those am " +
    "is are was were be been being have has had having do does did doing would could ought of as until " +
    "ai instead like something keep keeps kept stop stops stopped stopping make makes made making"
  ).split(" ")
);

// Auxiliary-negation contractions, dropped only when the apostrophe was
// present — the bare verbs "won"/"don" stay meaningful.
const CONTRACTIONS = new Set(
  "don won isn aren doesn didn couldn shouldn wasn weren can hasn haven wouldn ain".split(" ")
);

/** Light deterministic stemmer — enough to fold corpus/user inflections. */
function stem(token: string): string {
  let t = token.replace(/'.*$/, "");
  if (t.length > 3 && t.endsWith("ies")) t = t.slice(0, -3) + "y";
  else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1);
  if (t.length >= 6 && t.endsWith("ly")) t = t.slice(0, -2);
  if (t.length >= 9 && t.endsWith("ment")) t = t.slice(0, -4);
  if (t.length >= 6 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length >= 5 && t.endsWith("ed")) t = t.slice(0, -2);
  if (t.length >= 5 && t.endsWith("e")) t = t.slice(0, -1);
  if (t.length >= 4 && t[t.length - 1] === t[t.length - 2]) t = t.slice(0, -1);
  return t;
}

/** Lowercase, split, stem, drop stopwords and single characters. */
export function tokenize(text: string): string[] {
  const raw = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const out: string[] = [];
  for (const token of raw) {
    const base = token.replace(/'.*$/, "");
    if (STOPWORDS.has(base)) continue;
    if (token.includes("'") && CONTRACTIONS.has(base)) continue;
    const stemmed = stem(token);
    if (stemmed.length > 1 && !STOPWORDS.has(stemmed)) out.push(stemmed);
  }
  return out;
}

/** Token bag with counts. */
export function bag(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
}
