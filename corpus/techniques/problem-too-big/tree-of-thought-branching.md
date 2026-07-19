---
id: tree-of-thought-branching
name: Branch Before You Commit
type: practice
category: problem-too-big
problem: "The task is too big and it (or I) can't hold it"
intent_signals:
  - the AI committing to the first approach it generates
  - big design decisions arriving as faits accomplis
  - '"did you consider alternatives?" answered retroactively'
  - wanting options compared before work begins
related:
  sibling_of: [dependency-analysis-first]
evidence: both
sources:
  - "Yao, S., Yu, D., Zhao, J., Shafran, I., Griffiths, T. L., Cao, Y., & Narasimhan, K. (2023). Tree of Thoughts: Deliberate Problem Solving with Large Language Models. arXiv:2305.10601."
inheritable: true
---

## Problem

For a hard problem with real design space, your AI produces… an answer.
One. The first coherent path it found, committed to and elaborated,
presented with the confidence of a considered choice. Ask "did you weigh
alternatives?" and you get a retroactive justification — alternatives
generated *after* the commitment, strawmanned into losing. On a big task
this is how you end up three days into the wrong architecture: not
because the choice was hard, but because no choice ever actually
happened.

## Mechanism

Generation is sequential and committal: each step builds on the last,
and early moves harden into foundations without ever being compared to
their alternatives. For problems where the first step *matters* — design
decisions, architectures, strategies — this means the most consequential
choice in the task gets the least deliberation.

The countermeasure restructures the work from a line into a tree:
**generate genuinely different approaches first, evaluate them against
stated criteria, then commit — with the comparison on the record.**
This is the mechanism Tree of Thoughts made measurable (cited above):
letting a model explore multiple reasoning branches with lookahead and
self-evaluation, instead of one left-to-right pass, transforms success
rates on problems where the first move determines reachability of the
solution. The workflow version inherits the property: the value
concentrates exactly where early commitments are expensive to unwind.

Three parts make branching real rather than decorative:

1. **Genuine divergence** — branches must differ in kind (different
   architecture, different trade-off priority), not in dressing.
2. **Criteria before verdict** — what makes an approach win here gets
   stated first, so evaluation can't be back-fit to the favorite.
3. **Recorded comparison** — the losing branches and *why they lost*
   ship with the recommendation. That record is what turns "trust me"
   into a reviewable decision — and it keeps its value later, when
   someone asks why the road not taken wasn't.

## How to apply — human

- Ask for branches on decisions with real design space: "give me three
  genuinely different approaches before you commit to any — and tell me
  first what criteria should decide between them."
- Audit divergence: if the three options are one idea at three levels of
  effort, say so and ask for actual alternatives.
- Engage the criteria, not just the verdict — the criteria list is where
  your context (constraints the AI can't see, what you'll regret) enters
  the decision cheaply.
- Keep the comparison: the "why not B" paragraph is future
  documentation for the day someone proposes B again.

## How to apply — agent

For decisions where early commitment is expensive:

1. Before elaborating any approach, state the decision criteria for
   *this* problem — constraints, priorities, what failure looks like.
2. Generate 2–4 approaches that differ structurally. Test: would they
   produce different failure modes? If not, they're one branch in
   costumes.
3. Evaluate each against the criteria — including at least one honest
   step of lookahead per branch: where does this approach hit trouble
   first?
4. Commit to one, and present: recommendation, the comparison table or
   paragraph, and what would change the verdict ("if constraint X
   loosens, B wins").
5. For problems with no real design space, skip the ceremony — one good
   path, taken, is not a violation.

## Narration

> "Branching before committing: {n} approaches — {names}. Criteria:
> {criteria}. Recommending {choice}; {runner-up} loses on {reason}."

## Verification

- **Human:** big decisions arrive as comparisons, not conclusions — and
  the alternatives are real (you could imagine choosing them). Later
  reversals cite new information, not "we never considered that."
- **Agent:** your branches would fail differently; your criteria were
  stated before your evaluation; your recommendation names what would
  flip it. A comparison where the winner scores best on every axis is
  usually a back-fit — real trade-offs leave marks.

## Failure modes

- **Decorative branching** — three options generated to legitimize the
  pre-chosen one, evaluation back-fit accordingly. The
  criteria-before-verdict order and the different-failure-modes test
  exist to make this visible.
- **Branch explosion** — treating every choice as a design summit.
  Branching prices in where commitment is expensive; applied to
  reversible or trivial choices it's pure ceremony and it erodes the
  practice's credibility for the decisions that need it.
- **Eternal deliberation** — branches multiplying because comparison
  feels safer than commitment. The practice *ends in a commit*; a tree
  that never picks a path is the too-big problem wearing analysis
  clothes.
- **Averaged verdicts** — resolving the comparison by blending branches
  into a compromise that inherits everyone's weaknesses. Branches exist
  to be *chosen between*; synthesis is occasionally right, but it must
  win on the criteria, not on diplomatic comfort.

## Field notes

Machine-side, Yao et al. (cited) established the core result: on
problems whose first moves determine solvability, exploring and
self-evaluating multiple reasoning branches raised success rates
dramatically over single-pass generation (their Game of 24 figure:
from single digits to 74%). In production sessions with frontier
agents, the workflow version ran as a standing planning technique —
explore multiple approaches, analyze trade-offs, select with rationale
— and its value showed most clearly in the counterfactuals: decisions
made through recorded comparison were revisited later only when new
information arrived, while single-path commitments generated recurring
"wait, why didn't we…" archaeology. The recorded losers proved
unexpectedly durable as documentation: months later, rejected-approach
paragraphs answered proposals to adopt the rejected approach, with
reasons intact.

## How to apply it in a prompt

The decision request, annotated:

> **"Before committing to an approach: first, tell me what criteria
> should decide this — constraints, priorities, what failure looks like
> here. Then give me three approaches that are genuinely different (they
> should fail in different ways, not be one idea at three sizes)."**
> — the ordering clause (criteria first) prevents evaluation from being
> back-fit to a favorite, and the fail-differently test is a concrete
> divergence standard the AI can self-apply — "genuinely different"
> alone gets you cosmetic variety.
>
> **"Evaluate each against the criteria, pick one, and show your work:
> why the winner wins, why each loser loses, and what would change your
> answer."**
> — requires the comparison to survive on the record, which is what
> makes the recommendation reviewable now and the decision explicable
> later. "What would change your answer" extracts the verdict's
> sensitivity — the single most useful line for you, because it tells
> you which of your private constraints, if any, flips the choice.

Why this construction: single-path commitment isn't a laziness problem
— it's the natural shape of generation, and it must be displaced by an
explicitly requested structure. The prompt installs the tree (diverge,
evaluate, commit) with its two integrity guards (criteria-first,
genuine divergence), which are the difference between deliberation and
deliberation-flavored justification.
