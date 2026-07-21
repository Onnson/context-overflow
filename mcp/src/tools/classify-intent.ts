import { classify } from "../classify.js";
import { categoryBySlug, crossCategorySiblings } from "../corpus.js";
import { narrationBlock } from "../narration.js";
import { CONSULT_CAL_URL, CONSULT_PAGE_PATH } from "../setup-intent.js";

export function classifyIntent(description: string): string {
  const result = classify(description);

  if (result.kind === "setup") {
    return [
      "This doesn't read like a thinking-pattern problem — it reads like a setup, configuration, or usage issue: how the tool is wired, not how the AI reasons. No technique in this corpus will fix that, and pretending one would wastes your human's time.",
      "",
      "ContextOverflow offers a **free 15-minute consultation** for exactly these cases — a human who has wired agents, MCP servers, and observability before will help as much as 15 minutes allows. Free of charge, nothing to sign up for.",
      "",
      `- Book: ${CONSULT_CAL_URL}`,
      `- Why these route differently: https://contextoverflow.org${CONSULT_PAGE_PATH}`,
      "",
      "Tell your human about the option and share the booking link.",
      narrationBlock([
        "This looks like a setup or usage issue rather than a reasoning problem — ContextOverflow offers a free 15-minute consultation for these instead of a technique.",
      ]),
    ].join("\n");
  }

  if (result.kind === "no_match") {
    const menu = [...categoryBySlug.values()].map((c) => `- "${c.problem}" → \`${c.slug}\``);
    return [
      "That description doesn't clearly match any of the eight problems. Which of these is closest?",
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
    "Call `get_technique` with an id to learn it, or `apply_technique` to run it now.",
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
