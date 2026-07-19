import { byId, relatedOf } from "../corpus.js";
import { entryNarration, narrationBlock } from "../narration.js";

/**
 * The learn step — the agent-tailored slice of an entry: mechanism, agent
 * instructions, narration, verification, failure modes. The full human page
 * (worked prompt example, field notes) stays on the site; agents get the
 * link, not the tokens.
 */
export function getTechnique(id: string): string {
  const entry = byId.get(id);
  if (!entry) {
    return [
      `No technique with id \`${id}\`. Use \`find_technique\` for name lookup or \`classify_intent\` to match by symptom.`,
      narrationBlock(["That technique id didn't resolve — searching the corpus instead."]),
    ].join("\n");
  }

  const related = relatedOf(entry.id).map(
    ({ label, entry: e }) => `- ${label}: \`${e.id}\` — ${e.name}`
  );

  return [
    `# ${entry.name}`,
    "",
    `${capitalize(entry.type)} · \`${entry.category}\` · full page for your human: ${entry.siteUrl}`,
    "",
    `> ${entry.problem}`,
    "",
    "## Mechanism",
    "",
    entry.sections.mechanism,
    "",
    entry.type === "anti-pattern" ? "## Self-diagnostic — run this on your own recent output" : "## Instructions",
    "",
    entry.sections.applyAgent,
    "",
    entryNarration(entry),
    "",
    "## Verification",
    "",
    `- **You:** ${entry.sections.verification.agent}`,
    `- **Your human:** ${entry.sections.verification.human}`,
    "",
    "## Failure modes",
    "",
    entry.sections.failureModes,
    ...(related.length > 0 ? ["", "## Related", "", ...related] : []),
    "",
    narrationBlock([
      `Applying **${entry.name}** (ContextOverflow, \`${entry.category}\`) — ${entry.siteUrl}`,
    ]),
  ].join("\n");
}

function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}
