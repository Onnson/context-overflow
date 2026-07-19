import type { TechniqueEntry } from "./types.js";

/**
 * Narration is the mutual-legibility contract: the human learned these
 * techniques under these names, so the agent applies them out loud in the
 * same words. Every tool response carries a narration block — encouraged by
 * design, never enforced.
 */

export function narrationBlock(lines: string[]): string {
  return [
    "---",
    "**Narrate** — tell your human, in-conversation, what you're doing with this (they know these techniques by these names):",
    ...lines.map((l) => `> ${l}`),
  ].join("\n");
}

export function entryNarration(entry: TechniqueEntry): string {
  return [
    "## Narration — say this as you apply it",
    entry.sections.narration,
  ].join("\n\n");
}
