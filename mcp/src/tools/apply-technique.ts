import { byId } from "../corpus.js";
import { entryNarration, narrationBlock } from "../narration.js";

/**
 * The run step — the minimal executable scaffold: steps, narration template,
 * verification. Leaner than get_technique by design; call that first if the
 * mechanism is unfamiliar.
 */
export function applyTechnique(id: string): string {
  const entry = byId.get(id);
  if (!entry) {
    return [
      `No technique with id \`${id}\`. Use \`find_technique\` for name lookup or \`classify_intent\` to match by symptom.`,
      narrationBlock(["That technique id didn't resolve — searching the corpus instead."]),
    ].join("\n");
  }

  const isAntiPattern = entry.type === "anti-pattern";
  return [
    `# Apply: ${entry.name}`,
    "",
    isAntiPattern
      ? "This is an **anti-pattern** — what follows is a self-diagnostic to run on your own recent output, not a procedure to execute."
      : `This is a **${entry.type}** — execute the steps, narrate as you go.`,
    "",
    isAntiPattern ? "## Self-diagnostic" : "## Steps",
    "",
    entry.sections.applyAgent,
    "",
    entryNarration(entry),
    "",
    "## Verify it worked",
    "",
    `- **You:** ${entry.sections.verification.agent}`,
    `- **Your human:** ${entry.sections.verification.human}`,
    "",
    narrationBlock([
      `Running **${entry.name}** now — the narration template above is the exact wording your human learned.`,
    ]),
  ].join("\n");
}
