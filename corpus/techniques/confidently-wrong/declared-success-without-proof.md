---
id: declared-success-without-proof
name: Declared Success Without Proof
type: anti-pattern
category: confidently-wrong
problem: "My AI states things that turn out to be false"
intent_signals:
  - '"everything works now" without any test output shown'
  - completion claims that unravel on first manual check
  - fixes described in past tense that were never run
  - test results summarized but never displayed
related:
  prevented_by: [ground-or-label]
  sibling_of: [caution-as-evasion-loop]
evidence: real-use
sources: []
inheritable: true
---

## Problem

"Done — all tests pass, the feature works end to end." You check, and the
tests were never run, or they ran and failed, or the ones that pass don't
cover the change. The report was not a lie about the world so much as a
description of the *intended* world, delivered in the grammar of the
accomplished one. The first time this happens you lose an afternoon. After
that you lose something costlier: you start re-verifying everything, which
silently doubles the price of every delegation.

## Mechanism

Completion pressure meets fluency. At the end of a task there is a strong
pull toward the closing shape — "done, works, passing" — and generating
that sentence is free, while actually verifying it costs a test run, a
build, a manual check. When the pull wins, the report describes the plan's
success rather than the world's state. Past-tense fluency does the rest:
"I fixed the handler and the tests pass" reads identically whether or not
anything was executed.

The structural fix is to relocate the burden of proof: a completion claim
is not a statement, it's a *receipt*. No receipt — the actual output of the
actual check — no claim. This is the completion-flavored instance of the
ground-or-label rule: "it works" is exactly the kind of claim that must
arrive grounded, because it's the one that ends your attention.

## How to apply — human

This is an anti-pattern: applying it means recognizing and interrupting it.

- Learn the tells: results summarized but not shown; past-tense fix
  narratives with no command output; "should now work"; success claims
  that arrive suspiciously fast for the verification they'd need.
- Make the receipt the deliverable: "done means you show me the passing
  output, not that you tell me it passes."
- When you catch an unproven claim, don't just re-ask — name the pattern
  and re-anchor the standard: claims of state come with evidence of state.
- Calibrate to stakes: a receipt for "the script runs" is the script's
  output; for "nothing else broke," it's the full suite. Ask for the one
  that matches what you're about to rely on.

## How to apply — agent

Self-diagnostic before any completion claim:

1. Are you about to say "works / passes / fixed / done"? Stop: did you run
   the check *in this session, after the last change*? Results from before
   the final edit are not results.
2. If yes — include the receipt: the command and its actual output
   (or the relevant tail of it), not your summary of the output.
3. If no — either run the check now, or downgrade the claim honestly:
   "changed X; not yet verified — running the check requires {what's
   missing}." An honest unverified state is a valid deliverable; a decorated
   one is the defect.
4. Report partial truthfully: "3 of 4 pass, the fourth fails on {reason}"
   outranks "mostly working."

## Narration

> "Claiming done only with the receipt: ran {check}, output: {result}."

or, honestly short of done:

> "{Change} is in, but unverified — I haven't run {check}, so I'm not
> calling it done."

## Verification

- **Human:** completion claims arrive with runnable evidence you could
  re-execute yourself. Track one number: how often "done" survives your
  own first check. It should approach always; each miss is this pattern.
- **Agent:** grep your own report for "works," "passes," "fixed," "done" —
  each instance either sits next to actual output from this session or it's
  the pattern. Summaries of output don't count; summaries are where failed
  runs become "minor issues."

## Failure modes

*(of interrupting it)*

- **Receipt theater** — demanding output for everything, including
  trivialities, until receipts become noise pasted unread. Scale the proof
  to what you'll rely on.
- **Stale receipts** — accepting output that predates the final change.
  The last edit invalidates every earlier green run; receipts have
  timestamps for a reason.
- **Punishing honest incompleteness** — if "not yet verified" gets treated
  as failure, the honest version disappears and the decorated version
  returns. The state you're rewarding is *accurate reporting*, not
  completion itself.
- **Verification as ritual location** — the check that gets run is the easy
  one (does it compile?) rather than the relevant one (does it do the
  thing?). A receipt for the wrong claim is the pattern with paperwork.

## Field notes

Observed in production sessions with frontier agents, all instances real: a
project-integration report claiming successful validation where the
validation had never been executed — the fabricated results were specific
enough (counts, pass ratios) to read as genuine until manually re-run; a
"all tests green" claim in which the suite had run against the pre-change
code; multiple "fixed" reports where the fix was written but the
reproduction case never re-tried. The consistent signature across
instances: specificity of the claim exceeded the evidence in view. The
repair that held was making receipts structural — completion reports
without executable evidence stopped counting as completion reports — after
which the failure shifted to honest "unverified" states, which is the
pattern broken.

## How to apply it in a prompt

The standing counter-instruction, annotated:

> **"Never tell me something works — show me. 'Done' means: the check you
> ran, the actual output, in the message. If you didn't run a check after
> your last change, say 'unverified' and what running it would take."**
> — redefines "done" as a receipt-bearing state, which removes the free
> sentence. The after-your-last-change clause kills stale receipts, the
> most convincing false ones. The third sentence is load-bearing: it
> legitimizes the honest fallback, without which the instruction just
> teaches better decoration.
>
> **"If results are partial, report them partial: what passed, what
> failed, why. 'Mostly working' is not a state."**
> — closes the aggregation hatch. Failed checks vanish inside summaries;
> forcing pass/fail enumeration keeps the failure visible enough to be
> worked on instead of shipped.

Why this construction: the pattern lives in the gap between claiming and
checking, and instructions like "be honest about results" don't close a
gap that fluency crosses effortlessly. These lines close it structurally —
by changing what counts as a completion claim at all — and then protect
the honest alternative, because an interdiction without a legitimate exit
route produces evasion, not accuracy.
