---
id: rephrase-and-respond
name: Rephrase Before Responding
type: practice
category: doing-my-thinking
problem: "I'm outsourcing my thinking and getting dumber"
intent_signals:
  - answers that solve a slightly different problem than the one asked
  - discovering misalignment only after a lot of work was done
  - '"that''s not what I meant" arriving late'
  - wanting to verify the AI understood before it runs
related:
  sibling_of: [self-ask-first]
evidence: both
sources:
  - "Deng, Y., Zhang, W., Chen, Z., & Gu, Q. (2023). Rephrase and Respond: Let Large Language Models Ask Better Questions for Themselves. arXiv:2311.04205."
inheritable: true
---

## Problem

You ask for something; the AI delivers something *adjacent* — technically
responsive to your words, aimed at a different intent. You spot it three
paragraphs in, or worse, after the work is merged. The mismatch was present
in the first seconds of the exchange; nothing surfaced it until the cost had
compounded. And each time you let an adjacent answer slide because it's
"close enough," your own definition of what you actually wanted gets a
little blurrier.

## Mechanism

Before executing, the AI restates the request in its own words — expanded,
disambiguated, with its reading of the intent made explicit — and the human
confirms or corrects. Misalignment gets caught at the restatement, when it
costs one sentence, instead of at delivery, when it costs the work.

Two distinct effects:

- **Machine-side (documented):** models answer their own rephrasing of a
  question better than the raw question — rephrasing surfaces ambiguities
  the model would otherwise resolve arbitrarily (the "Rephrase and Respond"
  result, cited above).
- **Human-side (the reason this sits in this category):** the confirmation
  step forces *you* to check the restatement against your intent — which
  means you must actually hold your intent precisely enough to check
  something against it. That small repeated act is thinking retained.
  Skipping it — letting the AI's interpretation stand unexamined — is
  thinking outsourced, one exchange at a time.

## How to apply — human

- For any request where misunderstanding is plausible and rework is
  expensive, ask for the restatement before execution: "before you start,
  say back what you understand me to want."
- Read the restatement *against your intent*, not for plausibility — the
  question is "is this what I meant?", not "does this sound reasonable?"
  Those diverge exactly when it matters.
- Correct precisely: name the difference between what it said and what you
  meant. Precise corrections teach the AI your vocabulary for next time.
- Don't ritualize it on trivial requests — the restatement gate is for
  requests with divergence room.

## How to apply — agent

For non-trivial or ambiguity-bearing requests:

1. Before executing, restate the request expanded: what is being asked,
   for what purpose, with what constraints — in your words, not an echo of
   the human's.
2. Where the request is ambiguous, don't silently pick a reading: state the
   reading you chose and mark it as chosen ("I'm reading X as meaning Y").
3. Proceed on confirmation; on correction, update and restate the delta in
   one line.
4. For trivial unambiguous requests, skip the gate — restating "fix the
   typo" is ceremony.

## Narration

> "My reading of the request: {restatement}. Flagging one interpretation I
> chose: {ambiguity} → {chosen reading}. Correct me or I'll proceed."

## Verification

- **Human:** "that's not what I meant" arrives at the restatement, not at
  delivery. If you're still discovering misalignment in finished work, the
  gate is being skipped or the restatements are echoes.
- **Agent:** your restatement contains at least one thing the human's
  literal words didn't say — a purpose, a constraint, a chosen reading. A
  restatement that only reorders the human's words verifies nothing.

## Failure modes

- **The echo** — restating by shuffling the request's own words. It passes
  every check while verifying nothing; the restatement must expand, or it's
  noise.
- **Rubber-stamp confirmation** — the human skims "yep, go." The gate's
  value is the human's actual check; confirming without reading converts
  the practice into latency.
- **Restating everything** — applying the gate to trivial requests trains
  both sides to stop reading the restatements. Reserve it for divergence
  room.
- **Interrogation instead of restatement** — replacing the restatement with
  a battery of clarifying questions the AI could have answered itself.
  State your reading and mark the chosen ambiguities; ask only what you
  genuinely cannot resolve.

## Field notes

Machine-side, Deng et al. (cited) showed the mechanism experimentally:
letting a model rephrase and expand a question before answering improves
accuracy across tasks, because ambiguities that would be resolved silently
and arbitrarily get resolved explicitly instead. In production use with
frontier coding agents, the human-side effect dominated: restatement gates
on multi-file changes caught wrong readings of scope ("refactor this" read
as "redesign this") before execution repeatedly. The practice's own
embedded form — a standing instruction that the agent confirm alignment by
rephrasing understanding — has been observed to shift misalignment
discovery from delivery time to request time across whole projects.

## How to apply it in a prompt

The standing version, annotated:

> **"For any request where you could plausibly get my intent wrong: before
> executing, give me your reading of it in your own words — what I want,
> why I probably want it, and any interpretation you had to choose. Then
> wait."**
> — "in your own words" outlaws the echo; "why I probably want it" forces
> the restatement up to intent level, where the expensive misalignments
> live; "any interpretation you had to choose" surfaces the silent
> disambiguations, which are exactly the places adjacent-but-wrong answers
> come from. "Then wait" makes it a gate rather than a preamble the work
> steamrolls past.
>
> **"Skip this for trivial requests — if there's no room for you to be
> wrong about what I mean, just do it."**
> — scopes the gate. Without the exemption, the practice degrades into
> ceremony on every message, and both sides stop reading — which is how a
> verification step dies.

Why this construction: the failure this prevents is invisible at request
time and expensive at delivery time, so the prompt moves the check to where
the failure is born. Every clause targets a specific degeneration of the
practice (echoing, plausibility-reading, over-application) rather than
asking generically for "confirmation" — which is how you get gates without
checks.
