---
id: mode-separation
name: Explore, Plan, Implement — Separately
type: protocol
category: problem-too-big
problem: "The task is too big and it (or I) can't hold it"
scent: "it's writing code while still figuring out the task, and nobody can say where we are"
intent_signals:
  - the AI writing code while still discovering what the task is
  - plans changing mid-implementation because understanding arrived late
  - big tasks dissolving into interleaved research, design, and half-built pieces
  - "let's figure out what we're doing before we do it"
related:
  sibling_of: [dependency-analysis-first]
evidence: real-use
sources: []
inheritable: true
---

## Problem

On a big task, everything happens at once: the AI reads two files, starts
implementing, discovers mid-edit that the architecture isn't what it
assumed, revises the plan it never quite stated, implements the revision,
and discovers again. Each discovery arrives *after* work that depended on
it. You can't review the plan (there isn't one, exactly), you can't trust
the half-built pieces (they encode superseded understandings), and neither
of you can say where in the task you are.

## Mechanism

Big tasks contain three different kinds of work, and interleaving them is
what makes the task unholdable:

- **Explore** — building understanding: reading, searching, mapping what
  exists, finding the constraints. Output: knowledge, written down. Rule:
  *nothing gets modified.*
- **Plan** — converting understanding into an approach: steps, order,
  risks, what gets touched. Output: a plan a human can review. Rule:
  *ends with explicit approval, not with drift into building.*
- **Implement** — executing the approved plan. Output: the work. Rule:
  *discoveries that invalidate the plan stop implementation and reopen it
  — they don't get patched silently mid-flight.*

The separation works for the same reason phases work anywhere: each mode
has a different success criterion, and mixing them means no criterion is
ever actually applied. But the quiet payoff is *addressability* — "we're
in explore" locates both of you in the task. The mode boundaries are also
natural checkpoints: understanding is complete enough to plan; the plan
is good enough to build. Those are exactly the two judgments that
interleaved work never gets to make deliberately.

## How to apply — human

- Open big tasks by naming the mode: "explore first — map how X works
  and report; no changes yet."
- Hold the boundary when the AI runs ahead ("while exploring I went
  ahead and fixed—"): pull it back once, explicitly — the boundary is
  only real if crossings get named.
- Review at the transitions, which is where your judgment is cheapest
  and most leveraged: approve the understanding, then approve the plan.
  Two small reviews beat one giant review of finished-but-wrong work.
- Let mode size scale with task size — explore can be five minutes. The
  protocol's value is the boundaries existing, not the phases being big.

## How to apply — agent

1. On receiving a big or unfamiliar task, declare the mode you're
   entering — default: explore.
2. In explore: read, search, map; write findings down; touch nothing.
   Exit by stating what you now know and what remains unknown.
3. In plan: produce the approach — steps, order, files touched, risks.
   Exit only on the human's explicit approval; silence is not approval.
4. In implement: execute the approved plan. If reality contradicts it —
   an assumption fails, a discovery invalidates a step — stop, say so,
   and reopen plan with the new information. Do not silently improvise
   the plan's replacement inside implementation.
5. At every point, be able to answer "which mode are we in?"

## Narration

> "Entering {mode}: {what that means for this task}. Exiting when
> {criterion}."

At a boundary:

> "Explore done — I know {findings}, still unknown: {gaps}. Ready to
> plan, or dig further?"

## Verification

- **Human:** you can always answer "where are we in this task?" — and
  plans reach you *before* implementation exists, while your review can
  still steer it cheaply.
- **Agent:** no file modifications carry an explore-mode timestamp; no
  implementation step lacks a corresponding approved-plan line; every
  mid-implementation discovery produced a stated plan reopening rather
  than a silent patch. Any of the three violated means the modes were
  labels, not boundaries.

## Failure modes

- **Mode theater** — announcing modes and interleaving anyway. The test
  is the artifacts: explore that ends with changed files, plan that was
  never reviewable, implementation containing unplanned architecture.
- **Eternal explore** — research that never converges to a plan because
  completeness feels safer than commitment. Explore exits on *enough to
  plan*, not on *nothing left to learn* — name the remaining unknowns
  and carry them as plan risks.
- **Plan-approval as gate ritual** — recapping an obvious approach and
  waiting for a nod on work that needed no plan. Small clear tasks skip
  the protocol; that's not a violation, that's sizing.
- **Frozen plan** — treating approval as forbidding revision, so
  implementation grinds through a plan reality has falsified. The
  protocol's rule is the opposite: discoveries reopen planning. The sin
  is *silent* deviation, not deviation.

## Field notes

Run as the standing operating structure across months of production
sessions with frontier agents: explore as default entry mode with an
explicit no-modification rule, plan gated on explicit human approval,
implement bound to the approved plan with deviations surfaced rather
than patched. Two observations recur. First, the failure the protocol
exists for appeared whenever it lapsed — most memorably, tasks where
implementation began during exploration and the resulting code encoded
three successive misunderstandings, costing more to unwind than the
whole task cost to redo cleanly. Second, the boundaries earned their
keep as *review points*: humans consistently caught wrong directions at
the plan boundary in minutes that would have surfaced in finished work
hours later. The protocol also composes: its boundaries are where
checkpoints and handoffs naturally live.

## How to apply it in a prompt

Opening a big task, annotated:

> **"We'll do this in three modes: explore, plan, implement. Start in
> explore — read and map everything relevant, change nothing, and come
> back with what you learned and what's still unknown. Don't plan yet."**
> — names the protocol, enters the first mode, and states its two rules
> (no changes, exit with findings-plus-unknowns). "Don't plan yet" is
> load-bearing: uninstructed, understanding slides into proposing, which
> slides into building.
>
> **"Then propose a plan — steps, what gets touched, risks — and stop.
> I'll approve it, change it, or send you back to explore. You build
> only what I approved."**
> — makes the plan an artifact with a full stop after it, and the
> approval a real decision point with all three exits named. "Only what
> I approved" gives implementation its boundary in advance.
>
> **"If you discover mid-build that the plan is wrong, stop and tell me
> — don't improvise a new plan inside the old one's approval."**
> — the escape valve that keeps the protocol honest under contact with
> reality. Without it, approval either freezes the plan (grinding
> through known-wrong steps) or silently expires (improvisation) — this
> line routes discoveries back through the only gate that makes
> approval mean something.

Why this construction: an unholdable task is unholdable because
everything in it is simultaneously in motion. The three instructions
pin the motion down to one kind at a time with human judgment at the
seams — which is the entire protocol: not phases for ceremony's sake,
but boundaries placed exactly where cheap review prevents expensive
rework.
