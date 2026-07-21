---
id: sampling-audit
name: Sampling Audit
type: practice
category: faster-than-i-can-review
problem: "My AI produces more than I can review"
intent_signals:
  - '"it touched 300 files, there is no way I can read all of that"'
  - rubber-stamping a bulk diff after scrolling through it
  - reviewing every file for five seconds instead of any file for five minutes
  - generated test suites merged without one test read closely
  - '"looks fine" verdicts on migrations nobody actually read'
  - spot-checking only the files the agent pointed at
related:
  sibling_of: [risk-tiered-review]
  derived_from: [declared-success-without-proof]
evidence: real-use
sources: []
inheritable: true
---

## Problem

Your agent finishes a migration across 200 files, or generates 60 tests, or
applies one refactor to every call site in the repo. You open the diff and
know immediately that you will not read all of it. So you do the next thing:
you scroll. Everything is pattern-shaped, the patterns look like the pattern
you asked for, and after a few minutes of skimming you approve. That review
felt like work — your eyes touched every file — but it would not have caught
a wrong default, a swapped argument, or an edge case mishandled the same way
in forty places. Shallow-everywhere review is the worst of both worlds: it
costs real time and catches almost nothing, while producing the feeling of
having reviewed.

## Mechanism

Two facts make sampling work where skimming fails.

First, attention divided by N goes to zero. Deep review of one file is a
real check; one-fortieth of that attention per file is not a check at all,
just exposure. You cannot scale depth down and keep the property that made
review worth doing.

Second — and this is the load-bearing one — defects in generated batches are
*correlated*. The batch came from one procedure: one prompt, one pattern,
one misunderstanding. When the procedure is wrong, it is wrong the same way
across many items. So you are not really reviewing 200 independent changes;
you are testing whether one generating procedure was sound. A random sample
of 3-5 items, reviewed to full depth, is enough to answer that question: if
the procedure has a systematic flaw, a deep read of a few random outputs
will usually surface an instance of it.

Two structural conditions keep the measurement honest. You pick the sample —
an author-chosen sample is a portfolio, not a measurement, and this holds
whether the author is a person or an agent surfacing its "representative"
files. And you pre-commit the rule before looking: one real defect in the
sample means the whole batch is suspect and the defect class gets searched
for globally. Decide that rule after finding a defect and you will negotiate
it down to "just fix this one file."

This is a batch-shaped descendant of the receipts rule from
declared-success-without-proof: "all 200 items are correct" is a completion
claim too large to take on assertion, and the deep sample is the receipt
sized to it.

## How to apply — human

- Before you look at anything, pick 3-5 items at random — an index from a
  random number, every Nth file, anything the agent did not influence. Small
  is fine: 3 of 50 is informative, because you are testing the procedure,
  not the items.
- State the rule to your agent up front: "one real defect in these means the
  whole batch is suspect, and we search all of it for that defect class."
- Review the sample at full depth — the attention you would give a
  hand-written change to a file you care about. Depth is the entire point;
  five skims prove nothing five hundred skims did not.
- Sample clean: accept the batch, with calibrated confidence. You have
  evidence the procedure was sound, not proof every item is correct.
- Sample dirty: do not fix the sampled file and move on. Name the defect
  class, have the agent search the entire batch for it, fix all instances,
  then draw a fresh sample.

## How to apply — agent

1. After producing a batch of similar outputs, report the batch size and
   ask your human to pick the sample — or take a seed from them and derive
   indices from it. Never nominate the sample items yourself; a
   self-selected sample is the files you are most confident in, which is
   exactly the wrong measurement.
2. Restate the pre-committed rule before the review starts, so it is on
   record before any defect exists to negotiate about.
3. Walk through each sampled item at full depth: what changed, why, and
   where it could be wrong — not a summary of the pattern applied.
4. If a defect is found, treat it as a class, not an incident: characterize
   it, search every item in the batch for the same pattern, report the
   count found, fix all of them, and offer a fresh sample.
5. Report what the sample supports, no more: a clean sample means "no
   evidence the procedure was unsound," not "batch verified."

## Narration

> "Batch of {N} done. Pick {k} items for a deep walk-through — or give me a
> seed and I will derive a random sample. I am not choosing them myself.
> Standing rule: one real defect in the sample and I search all {N} for
> that defect class."

> "The sample surfaced {defect}. Treating it as a class — searching the
> whole batch for the same pattern before anything else moves."

## Verification

- **Human:** your findings rate goes up, not down — deep review of five
  random items should surface more real defects per hour than skimming two
  hundred ever did. Track the misses: when a defect later surfaces in an
  item you accepted, ask two questions — was the sample actually random,
  and was the review actually deep? Nearly every miss traces to one of
  those two.
- **Agent:** check your own trail — did the human (or a seed they supplied)
  pick the sample, or did you? Did a found defect trigger a global class
  search with a reported count, or a single-item fix? If the answer to
  either is the second option, the audit did not happen; something that
  looked like it did.

## Failure modes

- **Author-picked sample** — the agent offers its three best files, the
  review passes, the batch was never measured. The randomness is not a
  nicety; it is the mechanism.
- **Shallow sampling** — five items reviewed at skim depth. You have kept
  the sampling and discarded the audit; the technique is deep-somewhere,
  and this is shallow-somewhere.
- **Negotiating after the find** — without the pre-committed rule, the
  first defect becomes "an isolated case," gets fixed in place, and its
  forty siblings ship. The rule exists because post-hoc you will not hold
  the line.
- **Sampling a mixed batch** — 40 mechanical renames plus 10 files of
  novel logic is not one population. A random sample mostly lands on the
  mechanical part and blesses the risky part unseen. Partition by risk
  first and read the risky tier in full — that is the sibling technique,
  risk-tiered-review — then sample within the homogeneous remainder.
- **Sample as absolution** — the audit becomes a ritual that licenses not
  thinking about the batch at all. A clean sample is evidence about the
  procedure; it does not transfer responsibility for the outcome.
- **Over-claiming the statistics** — reporting "verified" because 4 of 200
  were clean. The honest claim is narrower, and keeping it narrow is what
  keeps the technique from becoming the failure it descends from.

## Field notes

Observed in production sessions with a frontier coding agent doing bulk
edits and migrations. The instance that made the case: a multi-file
mechanical change was skim-approved after a scroll-through; a later
randomized deep check of three files found the same edge-case mishandling
in all three, and a global search then found it in most of the batch — a
defect rate near total, invisible to a review that had touched every file.
After switching to random deep samples with the pre-committed batch rule,
defect classes started being caught at the sample stage instead of in
production. A secondary effect showed up in the agent's own reporting:
knowing the sample would be drawn externally, its completion claims shifted
from "all items done" toward naming the cases it was least sure the pattern
covered — which is the batch version of an honest unverified state, and
worth more than the confident summary it replaced.

## How to apply it in a prompt

The review request, annotated:

> **"You changed {N} files. I rolled {i}, {j}, {k} as my sample — walk me
> through those three at full depth: what changed, why, and where it could
> be wrong."**
> — "I rolled" is the load-bearing phrase: the sample's authority comes
> entirely from the author not having chosen it. Asking the agent for its
> "most representative files" would replace the measurement with a
> portfolio. "Full depth" and "where it could be wrong" set the contract:
> this is the review you would give hand-written code, aimed at defects,
> not a tour of the pattern.
>
> **"Rule, agreed now: one real defect in these three and the whole batch
> is suspect — you name the defect class and search all {N} for it before
> we discuss anything else."**
> — the rule is stated *before* the review, while no specific defect exists
> to feel like an exception. Stated after a find, the same rule loses to
> "that one is just an oddity." The class-search clause converts a single
> find into what it statistically is: evidence about the whole procedure.
>
> **"If the sample is clean, tell me what that establishes and what it
> does not."**
> — keeps the conclusion the right size. A clean sample supports "no
> evidence the generating procedure was unsound," and making the agent say
> the limit out loud stops the quiet upgrade to "batch verified."

Why this construction: the failure it replaces — skimming everything — is
driven by the feeling that responsible review means touching every item.
These lines rebuild the review around what actually detects defects in
generated batches: correlated errors, deep attention, and a decision rule
fixed before the evidence arrives. Each sentence removes one way the
measurement degrades — author selection, shallow depth, post-hoc
negotiation, over-claiming — because in practice it degrades through
exactly those four doors.
