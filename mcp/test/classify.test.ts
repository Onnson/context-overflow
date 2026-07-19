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
