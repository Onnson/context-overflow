---
id: risk-tiered-review
name: Risk-Tiered Review
type: practice
category: faster-than-i-can-review
problem: "My AI produces more than I can review"
intent_signals:
  - '"it produces more than I can actually read"'
  - rubber-stamping diffs because reading everything is impossible
  - every change gets the same skim regardless of stakes
  - review backlog growing faster than it clears
  - '"I approved it without really looking"'
  - afraid to delegate more because review is the bottleneck
related:
  sibling_of: [adversarial-cross-check, sampling-audit]
evidence: real-use
sources: []
inheritable: true
---

## Problem

Your agent finished four things while you were reading the first one. So you
adapt the only way uniform review allows: everything gets a skim. Which means
the mechanical rename got thirty seconds — fine — and the change to the
authentication flow also got thirty seconds. Eventually you land at one of
two endpoints: you become the bottleneck, with an idle agent waiting on your
reading speed, or you become a rubber stamp, approving work you did not read
and hoping the important change wasn't in the batch. The review queue stops
being quality control and becomes a source of standing guilt.

## Mechanism

Review attention is a budget, and uniform allocation is the wrong prior
because risk is not uniformly distributed. What varies across deliverables —
by orders of magnitude — is blast radius: what breaks if this is wrong, who
sees it, and whether it can be cheaply undone. A one-line change to a
permission check carries more risk than a five-hundred-line generated
migration, and reading them with equal depth is a misallocation in both
directions.

The reason the fix has to be agreed *before* the work arrives: at review
time, queue pressure makes the depth decision for you, and it always decides
"skim." A standing tier policy moves the decision to a calm moment, and moves
the classification labor to the agent, who knows what the change touched.

The tier label is the load-bearing part. It is itself a small, reviewable
claim: checking "is this really low-tier?" takes seconds, while reading the
diff takes minutes. A wrong tier is a high-signal event worth a conversation;
a right tier lets you skip with a clear conscience. You have converted an
unreadable-volume problem into a spot-checkable classification problem.

## How to apply — human

- Sit with your agent once and define three or four tiers by blast radius,
  not by size or effort. A workable default: **tier 1** — irreversible,
  user-facing, security, data, or money: line-by-line read. **Tier 2** —
  internal logic: read the diff summary and the tests. **Tier 3** —
  mechanical, generated, or config-templated: receipts only (what ran, what
  the output was).
- Put the policy somewhere persistent — project instructions, a standing
  prompt — so it survives sessions instead of being renegotiated each time.
- Require every deliverable to arrive labeled: tier, plus one line on why.
- Review at the declared depth, and audit the *label* as you go. Disagreeing
  with a tier is cheap and productive: each dispute either fixes the policy
  wording or catches a real misclassification.
- Periodically pull one low-tier item and read it at full depth anyway. The
  sibling practice sampling-audit covers this; labels you never test stop
  being information.

## How to apply — agent

1. At task start, load the tier policy from persistent instructions. If none
   exists, propose one and get agreement before producing volume.
2. On finishing each deliverable, classify it by blast radius — reversibility,
   user-facing surface, security or data exposure, cross-cutting reach. Never
   by diff size or by how hard the work was.
3. Attach the label to the deliverable: the tier, one line of justification,
   and what the matching review consists of — what the human should read,
   which receipts are included.
4. When uncertain between two tiers, take the higher one and say you rounded
   up. Over-labeling costs the human minutes; under-labeling costs them an
   incident.
5. When one task mixes tiers — a mechanical refactor that includes one line
   touching a permission check — split the reporting. Name the high-tier part
   on its own line. A high-tier change must never ride unlabeled inside a
   low-tier batch.

## Narration

> "Tier {n} ({tier name}) — {one-line blast-radius reason}. Matching review:
> {what to read / receipts attached}."

For mixed batches:

> "This batch is tier {low} except {change}, which is tier {high} because
> {reason} — that is the part worth your reading time."

## Verification

- **Human:** your review minutes redistribute — the small high-tier fraction
  gets more attention than it used to, total review time drops or holds flat.
  Track two numbers: how often you disagree with a declared tier (should be
  rare and shrinking), and how often a spot-checked low-tier item turns up
  something that deserved a higher tier (should be near zero — each hit is a
  policy recalibration, not just a caught bug).
- **Agent:** every deliverable you handed over carries a tier and a reason;
  the tiers correlate with blast-radius factors, not with diff size; no
  deliverable containing a tier-1 change went out labeled below it.

## Failure modes

- **Everything is tier 1.** Fear-driven inflation reproduces uniform depth
  with extra paperwork. If more than a small fraction of output is top-tier,
  either the tiering is broken or the work should be decomposed differently.
- **Everything is tier 3.** The agent optimizing for approval speed
  classifies downward. This is why doubt rounds up and why labels get
  audited; a discovered under-label should be treated as more serious than a
  slow answer.
- **Size as proxy.** Tiering by lines changed feels objective and is wrong in
  the dangerous direction: the riskiest changes are often one line.
- **Policy rot.** The system changes, the tiers don't. A low-tier item that
  causes an incident is not just a miss — it is the trigger to rewrite the
  tier definitions.
- **Arguing every label.** If tier disputes consume the time the tiers saved,
  the policy is underspecified. Fix the definitions once, not the instances
  repeatedly.
- **Trusting labels without sampling.** Receipts-only tiers still need an
  occasional full read; that is the sibling practice sampling-audit, and
  without it this technique degrades into delegated self-grading.

## Field notes

Observed in production sessions with a frontier coding agent producing
multi-file changes faster than the human could read them. Uniform review
collapsed in the predictable order: careful reading, then skimming, then
approval by fatigue. The miss that surfaced the problem was a consequential
change riding inside a batch of mechanical ones — approved unread precisely
because the batch looked mechanical. After tiers were agreed in advance and
every deliverable arrived labeled, review attention concentrated on the small
high-tier fraction, and the label disputes that did occur were cheap: each
one either tightened the policy wording or caught a genuine misclassification
before it mattered. The residual drift was classification by effort rather
than consequence — large mechanical work creeping upward, small risky changes
sitting too low — corrected by re-anchoring the tier definitions on
reversibility and exposure rather than on how much work the change had been.

## How to apply it in a prompt

The standing policy, annotated:

> **"Review depth scales with blast radius, not size — and we set the scale
> now, before the work arrives."**
> — the timing clause is the point. Depth decided at review time is decided
> by queue pressure, and queue pressure always picks "skim." Agreeing the
> scale in advance is what makes it hold when the volume shows up.
>
> **"Tiers: T1 — irreversible, user-facing, security, data, or money: I read
> line by line. T2 — internal logic: I read your diff summary and the tests.
> T3 — mechanical or generated: receipts only, what ran and what it
> output."**
> — each tier names what the human will actually do, which makes the label a
> promise about attention rather than a bureaucratic tag. It also lets the
> agent shape the deliverable to the review it will get: T2 work is only
> reviewable at T2 depth if the diff summary is honest and the tests are
> real.
>
> **"Label every deliverable with its tier and one line on why. If you're
> unsure, round up."**
> — the label is the reviewable claim: arguing about a tier costs seconds,
> reading everything costs the afternoon. Round-up removes the incentive
> gradient toward under-labeling, which is the direction that produces
> incidents.
>
> **"If a batch mixes tiers, name the high-tier part on its own line. It
> never rides inside a low-tier batch."**
> — closes the burial hatch. The classic miss is not a mislabeled
> deliverable; it is a correctly risky line hidden inside a correctly boring
> batch.

Why this construction: the drowning is caused by a uniform-depth default
that no one chose — it is just what review looks like when depth was never
made a decision. These lines make it a decision, made once, at a calm
moment, with the classification work assigned to the party that has the
context to do it and the audit assigned to the party with the authority to
check it.
