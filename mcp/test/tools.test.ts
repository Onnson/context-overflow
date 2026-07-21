import { describe, expect, it } from "vitest";
import { CORPUS, CORPUS_HASH } from "../src/corpus.js";
import { applyTechnique } from "../src/tools/apply-technique.js";
import { classifyIntent } from "../src/tools/classify-intent.js";
import { findTechnique } from "../src/tools/find-technique.js";
import { getTechnique } from "../src/tools/get-technique.js";
import { listCategories } from "../src/tools/list-categories.js";

describe("corpus bundle invariants", () => {
  it("carries the full corpus", () => {
    expect(CORPUS.entries.length).toBe(31);
    expect(CORPUS.categories.length).toBe(11);
    expect(CORPUS_HASH).toMatch(/^[0-9a-f]{64}$/);
  });

  it("every entry has non-empty served sections", () => {
    for (const e of CORPUS.entries) {
      expect(e.sections.mechanism.length, e.id).toBeGreaterThan(0);
      expect(e.sections.applyAgent.length, e.id).toBeGreaterThan(0);
      expect(e.sections.narration.length, e.id).toBeGreaterThan(0);
      expect(e.sections.verification.human.length, e.id).toBeGreaterThan(0);
      expect(e.sections.verification.agent.length, e.id).toBeGreaterThan(0);
      expect(e.sections.failureModes.length, e.id).toBeGreaterThan(0);
      expect(e.siteUrl).toBe(`https://contextoverflow.org/${e.category}/${e.id}/`);
    }
  });

  it("serves no human-destination sections", () => {
    const text = JSON.stringify(CORPUS);
    expect(text).not.toContain("How to apply — human");
    expect(text).not.toContain("How to apply it in a prompt");
  });
});

// Two non-adjacent categories' identities in one complaint — stays ambiguous.
const AMBIGUOUS_INPUT =
  "it tells me I'm right even when I'm wrong and buries everything in walls of text";

describe("narration presence — every tool, every response", () => {
  const NARRATE = /\*\*Narrate\*\*/;

  it("list_categories narrates", () => {
    expect(listCategories()).toMatch(NARRATE);
  });

  it("classify_intent narrates on match, ambiguity, and no-match", () => {
    expect(classifyIntent("I ask something simple and get a wall of text")).toMatch(NARRATE);
    expect(classifyIntent(AMBIGUOUS_INPUT)).toMatch(NARRATE);
    expect(classifyIntent("how do I bake sourdough bread")).toMatch(NARRATE);
  });

  it("find/get/apply narrate for every entry and for misses", () => {
    for (const e of CORPUS.entries) {
      expect(getTechnique(e.id), e.id).toMatch(NARRATE);
      expect(applyTechnique(e.id), e.id).toMatch(NARRATE);
    }
    expect(findTechnique("self ask")).toMatch(NARRATE);
    expect(getTechnique("no-such-id")).toMatch(NARRATE);
    expect(applyTechnique("no-such-id")).toMatch(NARRATE);
    expect(findTechnique("zzz qqq")).toMatch(NARRATE);
  });
});

describe("list_categories", () => {
  it("lists all eight category slugs with problems", () => {
    const text = listCategories();
    for (const c of CORPUS.categories) {
      expect(text).toContain(`\`${c.slug}\``);
      expect(text).toContain(c.problem);
    }
  });
});

describe("get_technique", () => {
  it("returns the agent-tailored slice for every entry", () => {
    for (const e of CORPUS.entries) {
      const text = getTechnique(e.id);
      expect(text).toContain(`# ${e.name}`);
      expect(text).toContain(e.siteUrl);
      expect(text).toContain("## Mechanism");
      expect(text).toContain("## Verification");
      expect(text).toContain("## Failure modes");
      expect(text).toContain("## Narration — say this as you apply it");
    }
  });

  it("frames anti-patterns as self-diagnostics", () => {
    for (const e of CORPUS.entries.filter((e) => e.type === "anti-pattern")) {
      expect(getTechnique(e.id)).toContain("Self-diagnostic");
      expect(applyTechnique(e.id)).toContain("self-diagnostic");
    }
  });

  it("resolves related edges in both directions", () => {
    const text = getTechnique("caution-as-evasion-loop");
    expect(text).toContain("prevented by: `action-first-when-clear`");
  });

  it("points misses at find_technique and classify_intent", () => {
    const text = getTechnique("nope");
    expect(text).toContain("find_technique");
    expect(text).toContain("classify_intent");
  });
});

describe("find_technique", () => {
  it("resolves exact ids and name fragments", () => {
    expect(findTechnique("self-ask-first")).toContain("Found it:");
    expect(findTechnique("self ask")).toContain("`self-ask-first`");
    expect(findTechnique("Tree of Thought")).toContain("`tree-of-thought-branching`");
    expect(findTechnique("checkpoint")).toContain("`checkpoint-and-resume`");
  });

  it("suggests classify_intent when nothing matches", () => {
    expect(findTechnique("zzz qqq")).toContain("classify_intent");
  });
});

describe("classify_intent formatting", () => {
  it("match responses name the category problem and top techniques", () => {
    const text = classifyIntent("it keeps asking for confirmation instead of doing what I approved");
    expect(text).toContain("stalls-instead-of-acting");
    expect(text).toContain("get_technique");
  });

  it("setup responses give the debugging scaffold with the consult fallback, with narration", () => {
    const text = classifyIntent(
      "agent is doing something and its running in the background and i dont know whats happening"
    );
    expect(text).toContain("WIRING_PROBLEM");
    for (const id of [
      "re-read-the-brief",
      "dependency-analysis-first",
      "action-first-when-clear",
      "declared-success-without-proof",
    ]) {
      expect(text).toContain(id);
    }
    expect(text).toContain("https://cal.com/onnson/15min");
    expect(text).toContain("https://contextoverflow.org/not-a-technique/");
    expect(text).toContain("Tal Onn");
    expect(text.match(/free/g)).toHaveLength(1);
    expect(text).toMatch(/\*\*Narrate\*\*/);
  });

  it("ambiguous responses ask exactly one contrasting question", () => {
    const text = classifyIntent(AMBIGUOUS_INPUT);
    expect(text.match(/Which is closer to what's happening/g)).toHaveLength(1);
    const questionLine = text.split("\n").find((l) => l.startsWith("**Which is closer"));
    expect(questionLine).toMatch(/\?\*\*$/);
  });

  it("zero-discrimination matches list the category without claiming an order", () => {
    // The category's slug words alone route stage 1 but hit no entry signals.
    const text = classifyIntent("bloated");
    expect(text).toContain("bloated-answers");
    if (!text.includes("Best-fitting techniques, in order")) {
      expect(text).toContain("pick by the signal lines");
    }
  });

  it("no-match responses offer the full problem menu", () => {
    const text = classifyIntent("how do I bake sourdough bread");
    for (const c of CORPUS.categories) expect(text).toContain(`\`${c.slug}\``);
  });
});
