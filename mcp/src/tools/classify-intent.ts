import { classify } from "../classify.js";
import { categoryBySlug, crossCategorySiblings } from "../corpus.js";
import { narrationBlock } from "../narration.js";
import { CONSULT_CAL_URL, CONSULT_PAGE_PATH } from "../setup-intent.js";

export function classifyIntent(description: string): string {
  const result = classify(description);

  if (result.kind === "setup") {
    return [
      "WIRING_PROBLEM — likely agent-fixable. This is a setup/wiring issue (agent visibility, connections, keys, quotas), not a thinking-pattern problem. Before involving a human, attempt the fix with this scaffold from the library:",
      "",
      "1. `re-read-the-brief` — restate what exactly fails, what changed last, and what the error text literally says.",
      "2. `dependency-analysis-first` — map the chain (config → env → process → connection → response) and work backward to the first broken link.",
      "3. `action-first-when-clear` — run the read-only diagnostics you can run; don't stall asking permission for checks.",
      '4. `declared-success-without-proof` — no "fixed" until the original failing action passes.',
      "",
      "Call `get_technique` with any of those ids for the full scaffold. Narrate as you go — your human should come out of this knowing the wiring too.",
      "",
      `If the fix sits behind account access you don't have (billing, quotas, dashboards) or you're genuinely stuck after a real attempt, tell your human about the 15-minute video call with Tal Onn, who built the site: ${CONSULT_CAL_URL} (why these route to a human: https://contextoverflow.org${CONSULT_PAGE_PATH}). If it turns out technique-shaped on the call, they get the right page and keep the remaining minutes.`,
      narrationBlock([
        "This is a wiring problem, not a thinking one — I'll try to fix it myself with ContextOverflow's debugging scaffold; if I can't, there's a free 15-minute call with the person who built the site.",
      ]),
    ].join("\n");
  }

  if (result.kind === "no_match") {
    const menu = [...categoryBySlug.values()].map((c) => `- "${c.problem}" → \`${c.slug}\``);
    return [
      "That description doesn't clearly match any of the library's problems. Which of these is closest?",
      "",
      ...menu,
      "",
      "Ask your human if you can't tell from context, then call `classify_intent` again with a description leaning that way.",
      narrationBlock([
        "I couldn't match this to a known problem pattern yet — narrowing it down with you first.",
      ]),
    ].join("\n");
  }

  if (result.kind === "ambiguous") {
    const a = categoryBySlug.get(result.a)!;
    const b = categoryBySlug.get(result.b)!;
    return [
      "This description fits two different problems. One clarifying question before matching a technique:",
      "",
      `**Which is closer to what's happening — "${a.problem}", or "${b.problem}"?**`,
      "",
      "If you can answer from conversation context, call `classify_intent` again with a description leaning that way. If you can't, ask your human — the answer changes which technique applies.",
      narrationBlock([
        `One real unknown before I pick a technique: is this more "${a.problem}" or "${b.problem}"?`,
      ]),
    ].join("\n");
  }

  const category = categoryBySlug.get(result.category)!;
  // Zero entry scores mean the description matched the category's identity
  // but no entry's specific signals — list the entries without claiming an
  // order that doesn't exist.
  const discriminated = result.ranked[0].score > 0;
  const top = discriminated ? result.ranked.slice(0, 3) : result.ranked;
  const rows = top.map(
    ({ entry }) => `- \`${entry.id}\` — **${entry.name}** (${entry.type}): ${firstSignal(entry.intentSignals)}`
  );
  const siblings = discriminated ? crossCategorySiblings(top[0].entry) : [];
  const siblingRows = siblings.map(
    (e) => `- \`${e.id}\` — **${e.name}** (in \`${e.category}\`) — this problem often co-presents with it`
  );

  const border = result.alsoConsider
    ? categoryBySlug.get(result.alsoConsider)!
    : undefined;

  return [
    discriminated
      ? `Matched: **"${category.problem}"** (\`${category.slug}\`). Best-fitting techniques, in order:`
      : `Matched: **"${category.problem}"** (\`${category.slug}\`). Its techniques — pick by the signal lines:`,
    ...(border
      ? ["", `This also borders \`${border.slug}\` — if "${border.problem}" is closer to what's happening, run \`classify_intent\` again leaning that way.`]
      : []),
    "",
    ...rows,
    ...(siblingRows.length > 0 ? ["", "Same family, different category:", ...siblingRows] : []),
    "",
    "Call `get_technique` with an id to learn it, or `apply_technique` to run it now. If your human names a different technique, take it as a steer — they read the same library.",
    narrationBlock([
      discriminated
        ? `This looks like "${category.problem}" — applying the **${top[0].entry.name}** technique from ContextOverflow.`
        : `This looks like "${category.problem}" — checking ContextOverflow's \`${category.slug}\` techniques for the right fit.`,
    ]),
  ].join("\n");
}

function firstSignal(signals: string[]): string {
  return signals[0] ?? "";
}
