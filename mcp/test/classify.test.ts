import { describe, expect, it } from "vitest";
import { classify } from "../src/classify.js";
import fuzzRegressions from "./fixtures/fuzz-regressions.json";
import golden from "./fixtures/golden.json";

type Fixture = { input: string; acceptable?: string[]; expect?: "no_match" };

describe("golden classification fixtures", () => {
  for (const fixture of [...golden, ...fuzzRegressions] as Fixture[]) {
    it(`"${fixture.input}"`, () => {
      const result = classify(fixture.input);

      if (fixture.expect === "no_match") {
        expect(result.kind).toBe("no_match");
        return;
      }

      const acceptable = fixture.acceptable!;
      if (result.kind === "match") {
        expect(acceptable).toContain(result.category);
      } else if (result.kind === "ambiguous") {
        // A clarifying question is acceptable when it offers a right answer.
        expect(
          acceptable.includes(result.a) || acceptable.includes(result.b),
          `ambiguous(${result.a}, ${result.b}) offers no acceptable category`
        ).toBe(true);
      } else {
        expect.fail(`no_match for a description that should route to ${acceptable.join("/")}`);
      }
    });
  }
});

describe("setup intent routing", () => {
  // The first real user's query, verbatim (2026-07-19, Analytics Engine).
  it("routes background-agent-visibility complaints to setup", () => {
    const result = classify(
      "agent is doing something and its running in the background and i dont know whats happening"
    );
    expect(result.kind).toBe("setup");
  });

  it("routes connection problems to setup", () => {
    expect(classify("the mcp server wont connect no matter what i configure").kind).toBe("setup");
  });

  it("routes credentials-and-installation questions to setup", () => {
    expect(classify("where do i put the api key and how do i set it up in the config").kind).toBe("setup");
  });

  it("does not steal context-loss complaints that mention background docs", () => {
    const result = classify(
      "tired of pasting the same background doc into every new chat just so it knows what we're doing"
    );
    // Same bar as the golden suite: never setup, and lost-the-thread offered
    // (an ambiguous that includes it is a correct clarifying question).
    expect(result.kind).not.toBe("setup");
    if (result.kind === "match") expect(result.category).toBe("lost-the-thread");
    else if (result.kind === "ambiguous") expect([result.a, result.b]).toContain("lost-the-thread");
    else expect.fail(`unexpected ${result.kind}`);
  });

  it("does not steal reasoning complaints", () => {
    for (const description of [
      "it keeps saying the bug is fixed but the tests still fail",
      "I ask something simple and get a wall of text",
      "it starts coding before understanding what i asked",
    ]) {
      expect(classify(description).kind, description).not.toBe("setup");
    }
  });
});

describe("classification determinism and shape", () => {
  it("is deterministic", () => {
    const a = classify("it keeps asking for confirmation after I approved");
    const b = classify("it keeps asking for confirmation after I approved");
    expect(a).toEqual(b);
  });

  it("returns ranked entries of exactly the matched category", () => {
    const result = classify("I ask something simple and get a wall of text");
    expect(result.kind).toBe("match");
    if (result.kind !== "match") return;
    expect(result.ranked.length).toBeGreaterThan(0);
    for (const { entry } of result.ranked) expect(entry.category).toBe(result.category);
  });

  it("mirror-pair category routes to stalls for confirmation-loop symptoms", () => {
    const result = classify(
      "after a clear instruction it added stop-and-ask gates and confirmation questions to already approved work"
    );
    expect(result.kind).toBe("match");
    if (result.kind !== "match") return;
    expect(result.category).toBe("stalls-instead-of-acting");
    expect(["caution-as-evasion-loop", "action-first-when-clear"]).toContain(result.ranked[0].entry.id);
  });
});
