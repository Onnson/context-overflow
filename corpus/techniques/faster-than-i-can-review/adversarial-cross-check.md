---
id: adversarial-cross-check
name: Adversarial Cross-Check
type: practice
category: faster-than-i-can-review
problem: "My AI produces more than I can review"
scent: "the diff is too big to read, and asking it to double-check always comes back fine"
intent_signals:
  - "it generated more code than I can possibly read"
  - approving large diffs unread because reviewing would take longer than the work
  - '"looks good to me" from the same agent that wrote it'
  - asking the author to double-check and getting confirmation every time
  - bugs surfacing later in output that was skimmed, not read
  - review backlog growing while the agent keeps producing
related:
  contrasts_with: [reflexive-agreement]
  sibling_of: [declared-success-without-proof, risk-tiered-review]
evidence: real-use
sources: []
inheritable: true
---

## Problem

Your agent hands you a forty-file diff, or a report longer than the brief
that produced it. Reading all of it properly would take longer than doing
the work yourself, so you do what everyone does: skim, spot a few things,
approve. The alternative — reviewing everything line by line — turns you
into the bottleneck the agent was supposed to remove. Either way you lose:
rubber-stamp and defects ship inside the unread bulk; read everything and
the delegation saved you nothing. Asking the author "are you sure?" doesn't
help; it says yes. The constraint is no longer generation. It's your review
capacity, and volume is climbing while capacity isn't.

## Mechanism

You can't read everything, so stop trying to. Commission a second,
independent pass whose explicit job is to refute the work — a second agent,
a second session, or the same agent re-prompted cold — and spend your
attention only on where the two passes disagree.

Why this works: an author's errors are correlated with its own reasoning.
Asked to check its work, it re-derives the same justifications that
produced the mistake, which is why "double-check yourself" in the same
session returns confirmation almost every time. A reviewer with fresh
context and no access to the author's rationale has to reconstruct
correctness from the artifact alone — its errors are *differently*
distributed, so the two passes fail in different places.

Both conditions are load-bearing. **Independent** means the reviewer never
sees the author's reasoning, summary, or your framing — only the artifact.
**Adversarial** means the instruction is "find what's wrong," never "check
this": a reviewer asked to check tends to agree, and an agreeing reviewer
measures nothing — that's reflexive-agreement wearing a review badge.

The payoff is a triage structure for your attention: what both passes agree
on ships with spot-checks (agreement between independent passes is
evidence, not proof); what they fight about gets your eyes. You've
converted an unreviewable volume into a short disagreement list.

## How to apply — human

- When output exceeds what you'll actually read, commission the cross-check
  instead of pretending you'll read it. A second agent, a second session,
  or the same agent re-prompted with no memory of authoring — any of these,
  as long as the context is cold.
- Hand the reviewer the artifact only. Not the author's explanation, not
  the summary, not your own opinion of it. Every word of rationale you pass
  along is independence you've spent.
- Word the brief adversarially: "assume this contains errors; find them and
  demonstrate each one." Never "does this look right?"
- Read the disagreements in full — that's your review. Spot-check a sample
  of what both passes agreed on.
- Keep your eyes on the genuinely high-stakes parts regardless of
  agreement; cross-checking allocates attention, it doesn't replace
  judgment on what can't afford to be wrong.

## How to apply — agent

1. When your output exceeds plausible review size for your human (long
   diff, many files, long report), propose the cross-check — do not hand
   them the full artifact as their reading assignment.
2. Prepare the review package: the artifact alone, stripped of your
   reasoning, justifications, and summary. Those contaminate the reviewer.
3. Write the reviewer's brief adversarially: "Assume this contains at least
   one significant error. Your job is to find errors, not assess quality.
   For each finding, show the concrete case where it fails." Require
   demonstrated failures, not impressions.
4. If you are the reviewer (re-prompted cold), do not reload the authoring
   session's context or ask what the author intended. The artifact is the
   whole input.
5. Merge the passes into three lists: agreed-sound (ships with
   spot-checks), disputed (both positions, side by side), and
   reviewer-found defects you accept (fix them, note the fix).
6. Deliver the disputed list as the human's reading assignment. That list,
   not the artifact, is the deliverable of this step.

## Narration

> "This is {size} — past review-sized. Commissioning an adversarial pass:
> a cold {reviewer} briefed to refute it, with the artifact only."

> "Cross-check merged: {n_agreed} points both passes accept — spot-check
> those; {n_disputed} disagreements need your eyes: {list}."

## Verification

- **Human:** your reading time collapses to the disagreement list plus
  spot-checks. Watch two numbers: defects the reviewer finds (a reviewer
  that never finds anything has broken independence or a soft brief — fix
  the setup, don't celebrate), and defects that later surface in the
  *agreed* portion (should be rare; each one means widen the spot-check).
- **Agent:** a review that returns "looks good" with no attempted
  refutations is a failed cross-check, not assurance — rerun it with a
  harder brief. A healthy reviewer report contains either demonstrated
  failures or named refutation attempts that didn't land.

## Failure modes

- **Contaminated reviewer** — the reviewer saw the author's reasoning or
  summary and now confirms it. This is reflexive-agreement in a review
  costume; the pass costs tokens and measures nothing.
- **Adversarial theater** — the reviewer manufactures objections to satisfy
  the "find something wrong" brief, and style nitpicks bury the triage.
  Counter: require a concrete failure case per finding, and make "attempted
  these refutations, none landed" a legitimate result.
- **Agreement read as proof** — independent passes can share model-level
  blind spots; agreement shrinks risk, it doesn't zero it. That's what the
  spot-checks are for, and why high-stakes sections get human eyes
  regardless (risk-tiered-review covers the tiering).
- **Cost creep** — cross-checking a twenty-line change costs more than
  reading it. This is a volume tool, not a ritual; below review capacity,
  just read the work.
- **Reviewer scope drift** — the reviewer redesigns instead of refutes.
  Bound the brief to defects in what exists, or you'll get a second
  artifact you also can't review.

## Field notes

Observed in production sessions with frontier coding agents. A multi-file
refactor was approved after a skim; a cold second-session pass, run
afterwards out of curiosity, located a real regression within minutes — the
author session had confirmed its own correctness three times when asked
"are you sure?". The pattern repeated in the other direction too: across
many sessions, same-session self-review almost never surfaced a genuine
defect, while cold adversarial passes surfaced them at a steady rate, and
occasionally flagged sound code — which was the useful part, because those
disputes were exactly where human judgment earned its keep. The practical
finding that made this stick: disagreement lists were consistently short
enough to read in full, which the raw diffs never were. The recurring setup
mistake was contamination — pasting the author's summary into the review
prompt "for context" — after which the reviewer's findings dropped to
near zero and the pass quietly stopped measuring anything.

## How to apply it in a prompt

The reviewer brief, annotated — this is the half that does the work:

> **"You are reviewing work you did not produce. Assume it contains at
> least one significant error. Your job is to find errors, not to assess
> quality or suggest improvements."**
> — three moves in two lines. "Did not produce" installs the cold stance
> even when it's technically the same model. "Assume it contains an error"
> defeats the agreement prior that makes checked-by-request reviews
> worthless. "Not to assess quality" blocks scope drift into redesign and
> style commentary.
>
> **"For each problem you find: the concrete case where it fails — input,
> state, expected versus actual. If you attempt a refutation and the code
> holds, say what you tried."**
> — the first sentence prevents adversarial theater: a finding without a
> failure case is an opinion, and opinions drown triage. The second is the
> quiet load-bearing clause: it makes *agreement informative*. "No issues"
> means nothing; "tried these three attacks, none landed" is evidence.
>
> *(Then the artifact — and nothing else. No author summary, no "the goal
> was", no "I think it's fine but". Independence is spent one contextual
> hint at a time, and it doesn't refund.)*

The standing instruction to the author agent, annotated:

> **"When your output exceeds what I can realistically read, don't hand it
> to me — commission the adversarial pass and bring me the disagreements.
> What both passes accept, I'll spot-check."**
> — relocates the default: unreviewable volume triggers the protocol
> instead of a doomed reading assignment. Naming the spot-check keeps
> "agreed" from silently becoming "verified."

Why this construction: the failure lives in two gaps — a reviewer that
wants to agree, and a human attention budget spread over everything and
therefore effective on nothing. The brief closes the first gap by making
refutation the job and demonstrated failure the currency; the standing
instruction closes the second by routing attention to disagreements only.
Neither line works alone: an adversarial pass nobody triages is noise, and
a triage fed by an agreeing reviewer is an empty list that looks like good
news.
