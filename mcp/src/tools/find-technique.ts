import { byId, CORPUS } from "../corpus.js";
import { narrationBlock } from "../narration.js";
import { tokenize } from "../normalize.js";
import type { TechniqueEntry } from "../types.js";

/** Direct lookup by id, name, or keywords — for when the technique is already known. */
export function findTechnique(query: string): string {
  const exact = byId.get(query.trim().toLowerCase().replace(/\s+/g, "-"));
  const matches = exact ? [exact] : rank(query);

  if (matches.length === 0) {
    return [
      `Nothing in the corpus matches "${query}". If you're describing a problem rather than naming a technique, use \`classify_intent\` — it matches symptoms, not names.`,
      narrationBlock(["I didn't find that technique by name — matching by symptom instead."]),
    ].join("\n");
  }

  const rows = matches.map(
    (e) => `- \`${e.id}\` — **${e.name}** (${e.type}, \`${e.category}\`): "${e.problem}"`
  );
  return [
    matches.length === 1 ? "Found it:" : "Closest techniques by name:",
    "",
    ...rows,
    "",
    "Call `get_technique` with the id to learn it, or `apply_technique` to run it.",
    narrationBlock([`Pulling **${matches[0].name}** from ContextOverflow.`]),
  ].join("\n");
}

function rank(query: string): TechniqueEntry[] {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return [];
  return CORPUS.entries
    .map((entry) => {
      const nameTokens = new Set(tokenize(`${entry.name} ${entry.id.replaceAll("-", " ")}`));
      let hits = 0;
      for (const t of queryTokens) if (nameTokens.has(t)) hits++;
      return { entry, score: hits / Math.sqrt(nameTokens.size) };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id))
    .slice(0, 5)
    .map(({ entry }) => entry);
}
