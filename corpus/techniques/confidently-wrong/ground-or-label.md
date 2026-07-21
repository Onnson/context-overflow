---
id: ground-or-label
name: Ground It or Label It
type: practice
category: confidently-wrong
problem: "My AI states things that turn out to be false"
scent: "every sentence sounds equally certain, and you can't tell which ones it made up"
intent_signals:
  - fluent answers that turn out to contain invented details
  - not being able to tell which parts of an answer are verified
  - the AI stating guesses in the same voice as facts
  - wanting explicit uncertainty instead of confident tone
related:
  prevents: [declared-success-without-proof]
evidence: real-use
sources: []
inheritable: true
---

## Problem

The answer reads perfectly — same confident voice throughout. Later you
discover that one paragraph was verified fact, one was reasonable inference,
and one was invention, and nothing in the text distinguished them. The cost
isn't just the error; it's that you can't allocate your trust. When every
sentence sounds equally certain, you must either verify everything (and lose
the point of asking) or verify nothing (and inherit the inventions).

## Mechanism

One rule with two arms: **every claim is either grounded — traceable to
something checkable — or labeled as what it is.**

- **Grounded:** the claim comes with its source in reach — the file and
  line, the document, the command output, the citation. Not "trust me,"
  but "here's where to look."
- **Labeled:** anything not grounded carries its epistemic status visibly:
  *inference* (derived from grounded facts, derivation shown),
  *speculation* (plausible, unverified), or *unknown* ("I cannot verify
  this"). Saying "I don't have access to that" is a first-class answer,
  not a failure.

This works because it changes the unit of trust from the answer to the
claim. A fluent answer can no longer launder one invented sentence inside
five true ones — the unlabeled-and-ungrounded sentence becomes visible by
construction. And the labels give the confident voice somewhere honest to
live: confidence in grounded claims, marked tentativeness elsewhere.

## How to apply — human

- Install the rule as a standing instruction (see the prompt section), then
  hold the line on it: when an unlabeled guess slips through, name it —
  "that was speculation stated as fact; label it."
- Read labels as routing, not as weakness: grounded → spot-check the
  source occasionally; inference → check the derivation; speculation →
  treat as a lead, never as an input to a decision.
- Reward "I cannot verify this" by treating it as useful — if unverifiable
  answers get punished as unhelpful, they come back dressed as facts.

## How to apply — agent

For every claim in an output:

1. Can you point at its ground — a file, an output you actually saw, a
   document, a citation? Then state it plainly and keep the pointer
   available (or inline where it matters).
2. No ground, but derivable from grounded claims? Mark it *inference* and
   show the derivation in one line.
3. Neither? Mark it *speculation* — or say "I cannot verify this" — in the
   claim itself, not in a disclaimer paragraph somewhere else.
4. Never let fluency close the gap: if the honest version of a sentence is
   "probably X," the confident version is a defect, not a style.

## Narration

> "Grounded: {claims} (sources in reach). Inference: {claim}, derived from
> {basis}. Can't verify: {claim} — treat as speculation."

## Verification

- **Human:** pick one confident-sounding claim per session and ask "what's
  that grounded in?" The answer should be immediate and specific. "It's
  generally the case that…" means the rule has slipped.
- **Agent:** audit an output of yours: every sentence classifiable as
  grounded / labeled inference / labeled speculation, with none in the
  fourth category — unlabeled and ungrounded. The fourth category is the
  defect this practice exists to make impossible.

## Failure modes

- **Label spam** — hedging every sentence, including grounded ones, until
  labels carry no signal. Grounded claims should be stated *plainly*; the
  labels are for the rest. The practice sharpens confidence, it doesn't
  forbid it.
- **The disclaimer ghetto** — one "some of this may be inaccurate"
  paragraph at the end, leaving every individual claim as unallocatable as
  before. Labels live on claims.
- **Grounding theater** — citing a source that doesn't actually contain the
  claim. This is worse than no label; it spends the trust the practice is
  building. A pointed-at source must be one you actually read.
- **Punishing honesty** (human side) — reacting to "I cannot verify this"
  with frustration trains its replacement: the same content, stated
  confidently.

## Field notes

Observed as a standing rule in months of production sessions with frontier
agents, where outputs distinguish verified fact, inference, and speculation
with explicit labels and "I cannot verify this" is an accepted first-class
response. Two effects were consistent: humans stopped bulk-distrusting long
answers, because trust could be allocated per claim; and invented details
dropped sharply — not because the model got better, but because the fourth
category (unlabeled, ungrounded) had nowhere to hide once every claim had
to declare itself. The characteristic failure was also observed: sessions
that punished "cannot verify" answers as unhelpful got fewer of them and
more confident fabrications.

## How to apply it in a prompt

The standing instruction, annotated:

> **"Every factual claim you make is either grounded or labeled. Grounded
> means you can point at where it comes from — a file, an output you ran, a
> document, a citation — and you state it plainly. Everything else gets a
> visible label on the claim itself: 'inference' (show the one-line
> derivation), 'speculation', or 'I cannot verify this.'"**
> — defines both arms operationally. "Point at where it comes from" makes
> grounding checkable rather than felt; "on the claim itself" kills the
> end-of-answer disclaimer that labels everything and nothing.
>
> **"'I cannot verify this' is a good answer. Stating a guess in a
> confident voice is the failure I care about — I will treat any unlabeled
> claim as your assertion that it's grounded."**
> — sets the incentive right (honest uncertainty welcomed) and then makes
> the rule enforceable: by declaring how unlabeled claims will be read, it
> converts silence from a hiding place into a commitment.

Why this construction: fabrication survives on ambiguity — the reader can't
tell assertion from decoration. Both lines remove the ambiguity: the first
gives every claim exactly two legitimate states, the second assigns a
meaning to the illegitimate third state so it can't be occupied for free.
