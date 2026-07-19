import { it } from "vitest";
import { classify } from "../src/classify.js";
import evalSet from "./eval-set.json";

/**
 * Measurement harness, not a gate: reports correct-or-acceptable accuracy on
 * the blind-generated eval set. Split: even indices = dev (tuning may look),
 * odd indices = holdout (measured only, never tuned against).
 *
 * Scoring: match with category in expected = correct; ambiguous offering an
 * expected category = acceptable; no_match on off_topic = correct.
 */
type EvalCase = { text: string; expected: string[] };

function score(cases: EvalCase[]) {
  let correct = 0;
  let acceptable = 0;
  const misses: string[] = [];
  for (const c of cases) {
    const r = classify(c.text);
    const offTopic = c.expected.includes("off_topic");
    if (offTopic) {
      if (r.kind === "no_match") correct++;
      else misses.push(`FP: "${c.text}" -> ${r.kind === "match" ? r.category : `${r.a}/${r.b}`}`);
    } else if (r.kind === "match" && c.expected.includes(r.category)) {
      correct++;
    } else if (r.kind === "match" && r.alsoConsider && c.expected.includes(r.alsoConsider)) {
      acceptable++;
    } else if (r.kind === "ambiguous" && (c.expected.includes(r.a) || c.expected.includes(r.b))) {
      acceptable++;
    } else {
      const got = r.kind === "match" ? r.category : r.kind === "ambiguous" ? `ambiguous ${r.a}/${r.b}` : "no_match";
      misses.push(`"${c.text}" [${c.expected.join("/")}] -> ${got}`);
    }
  }
  const n = cases.length;
  return { n, correct, acceptable, pct: (100 * (correct + acceptable)) / n, misses };
}

it("measures accuracy on dev and holdout splits", () => {
  const cases = evalSet as EvalCase[];
  const dev = cases.filter((_, i) => i % 2 === 0);
  const holdout = cases.filter((_, i) => i % 2 === 1);

  for (const [name, split] of [
    ["dev", dev],
    ["holdout", holdout],
    ["all", cases],
  ] as const) {
    const s = score(split);
    console.log(
      `EVAL ${name}: ${s.pct.toFixed(1)}% correct-or-acceptable (${s.correct} correct + ${s.acceptable} acceptable of ${s.n})`
    );
  }
  const devScore = score(dev);
  console.log(`\nDEV MISSES (${devScore.misses.length}):`);
  for (const m of devScore.misses) console.log(`  ${m}`);
});
