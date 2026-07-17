export const REQUIRED_SECTIONS = [
  "Problem",
  "Mechanism",
  "How to apply — human",
  "How to apply — agent",
  "Narration",
  "Verification",
  "Failure modes",
  "Field notes",
  "How to apply it in a prompt",
] as const;

/** Returns error strings for missing/misordered/extra top-level sections. */
export function checkSections(body: string): string[] {
  const found = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  const errors: string[] = [];

  const expected = REQUIRED_SECTIONS as readonly string[];
  for (const section of expected) {
    if (!found.includes(section)) errors.push(`missing section: ## ${section}`);
  }
  for (const section of found) {
    if (!expected.includes(section)) errors.push(`unknown section: ## ${section}`);
  }
  if (errors.length === 0) {
    const inOrder = found.every((s, i) => s === expected[i]);
    if (!inOrder) errors.push(`sections out of order: [${found.join(", ")}]`);
  }
  return errors;
}
