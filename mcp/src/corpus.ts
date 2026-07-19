import { CORPUS } from "./generated/corpus.js";
import type { TechniqueEntry } from "./types.js";

export { CORPUS, CORPUS_HASH } from "./generated/corpus.js";

export const byId = new Map(CORPUS.entries.map((e) => [e.id, e]));
export const categoryBySlug = new Map(CORPUS.categories.map((c) => [c.slug, c]));

const EDGE_LABELS: Record<string, [string, string]> = {
  prevents: ["prevents", "prevented by"],
  prevented_by: ["prevented by", "prevents"],
  contrasts_with: ["contrasts with", "contrasts with"],
  sibling_of: ["same family as", "same family as"],
  derived_from: ["derived from", "basis of"],
};

/** Related edges resolved in both directions: id → [{label, target}]. */
const relatedIndex = new Map<string, { label: string; target: string }[]>(
  CORPUS.entries.map((e) => [e.id, []])
);
for (const entry of CORPUS.entries) {
  for (const [edge, targets] of Object.entries(entry.related)) {
    const [forward, reverse] = EDGE_LABELS[edge];
    for (const target of targets ?? []) {
      addEdge(entry.id, forward, target);
      addEdge(target, reverse, entry.id);
    }
  }
}
function addEdge(id: string, label: string, target: string) {
  const list = relatedIndex.get(id)!;
  if (!list.some((e) => e.label === label && e.target === target)) {
    list.push({ label, target });
  }
}

export function relatedOf(id: string): { label: string; entry: TechniqueEntry }[] {
  return (relatedIndex.get(id) ?? []).map(({ label, target }) => ({
    label,
    entry: byId.get(target)!,
  }));
}

/** Cross-category same-family edges of an entry — co-presenting problems. */
export function crossCategorySiblings(entry: TechniqueEntry): TechniqueEntry[] {
  return relatedOf(entry.id)
    .filter(({ label, entry: e }) => label === "same family as" && e.category !== entry.category)
    .map(({ entry: e }) => e);
}
