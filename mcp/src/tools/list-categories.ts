import { CORPUS } from "../corpus.js";
import { narrationBlock } from "../narration.js";

export function listCategories(): string {
  const rows = CORPUS.categories.map(
    (c) => `- \`${c.slug}\` — "${c.problem}" (${c.entryIds.length} techniques)`
  );
  return [
    "Eight problems, named the way a human experiences them. Every technique lives in exactly one:",
    "",
    ...rows,
    "",
    "Describe what's going wrong to `classify_intent`, or fetch a known technique with `get_technique`.",
    narrationBlock([
      "I'm checking ContextOverflow for a technique that fits what's happening here.",
    ]),
  ].join("\n");
}
