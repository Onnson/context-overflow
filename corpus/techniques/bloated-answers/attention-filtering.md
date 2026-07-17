---
id: attention-filtering
name: Filter Before You Reason
type: practice
category: bloated-answers
problem: "I ask something simple and get a wall of text"
intent_signals:
  - answers that get worse as the conversation gets longer
  - the AI addressing side comments instead of the question
  - irrelevant context from earlier steering current answers
  - dumping a whole document in and getting mush back
related:
  sibling_of: [smallest-working-answer]
evidence: both
sources:
  - "Weston, J. & Sukhbaatar, S. (2023). System 2 Attention (is something you might need too). arXiv:2311.11829."
inheritable: true
---

## Problem

The answer isn't just long — it's *diluted*. You asked a specific question
against a big pile of context (a long conversation, a pasted document, a
sprawling ticket), and the response smears across everything in reach:
addressing your parenthetical aside, re-engaging the abandoned approach
from an hour ago, hedging toward an opinion someone expressed in the
pasted thread. Bloat, here, is an input problem wearing an output costume:
the answer is unfocused because the attention was.

## Mechanism

Models attend to everything in context, relevant or not — and irrelevant
material doesn't just sit there; it *steers*. Stray opinions bias answers
toward agreement, abandoned plans leak back in, and side details claim
response space in proportion to their presence rather than their
relevance.

The countermeasure is a separation step: **before answering, extract from
the available context only what the question actually depends on — then
reason over the extract, not the pile.** This is the mechanism behind
System 2 Attention (cited above): having a model first regenerate the
relevant portion of its context and then answer from that filtered
version measurably improves accuracy and objectivity, because the
distracting material never reaches the reasoning step. The same
separation works at the workflow level, and either side of the pair can
run it: the human by curating what goes in, the agent by filtering
explicitly before answering.

## How to apply — human

- Curate the input: paste the section, not the document; state the
  question against named facts rather than gesturing at the backlog.
  Every irrelevant paragraph you include is a small steering force you
  chose to add.
- For questions asked deep into a long session, re-anchor: "answering
  only this question, from only these facts: {facts} — {question}."
- When you must provide a big pile (it's genuinely all context), ask for
  the filter as a visible step: "first list the parts of this relevant
  to my question, then answer from just those."
- Read the extraction when you get one — a wrong filter caught early is
  a wrong answer prevented.

## How to apply — agent

For questions asked against large or noisy context:

1. Before reasoning, extract: which specific facts, constraints, and
   passages does this question depend on? List them (briefly, visibly
   when stakes warrant).
2. Check the extract for steerers — opinions, tones, abandoned
   directions that would bias the answer but don't bear on it. Leave
   them out deliberately.
3. Answer from the extract alone. If the answer wants material outside
   it, that's a signal the extract was wrong — redo the filter, don't
   quietly widen it.
4. Scale the visibility: high-stakes or ambiguous filtering is shown to
   the human; routine filtering just happens.

## Narration

> "Filtering first — this question depends on: {relevant facts}. Setting
> aside {noise} as not bearing on it. Answer: …"

## Verification

- **Human:** answers deep in long sessions match the quality of answers
  in fresh ones, and responses engage your question rather than your
  context's bystanders. Probe: plant an irrelevant strong opinion near a
  factual question — a filtering answer ignores it.
- **Agent:** your stated extract is sufficient — the answer you gave
  uses nothing outside it — and minimal — removing any listed item
  would change the answer. Excess in either direction means the filter
  was decorative.

## Failure modes

- **Filtering out the inconvenient** — the extract omits facts that
  complicate the preferred answer. The filter's criterion is relevance,
  not convenience; a filter that only ever removes friction is motivated
  reasoning with a process diagram.
- **The invisible filter** — silently deciding what's relevant on
  high-stakes questions. Filtered-out context the human believed was
  load-bearing must be visible to be correctable.
- **Extract bloat** — "relevant" defined so generously the filter passes
  everything, adding a step without removing noise. If the extract
  approaches the pile, no filtering happened.
- **Filtering as a substitute for asking** — when relevance is genuinely
  undecidable ("does the legacy constraint still apply?"), the move is a
  question, not a guess inside the filter.

## Field notes

Machine-side, Weston & Sukhbaatar (cited) demonstrated the mechanism
directly: regenerating relevant-only context before answering improved
factuality and reduced sycophantic drift caused by opinions embedded in
prompts — the model's answers stopped being steered by what merely sat
nearby. In production sessions with frontier agents, the workflow-level
version was standing practice under the name of focusing on core
requirements while filtering out irrelevant information: the observed
gains matched — fewer answers derailed by stale conversational residue,
and pasted-document questions producing engagement with the pertinent
section instead of a smear across the whole. The human-side curation
half proved equally load-bearing: sessions that dumped whole documents
"for context" measurably degraded answer focus versus sessions that
pasted the operative section.

## How to apply it in a prompt

The per-question form, annotated:

> **"Before you answer: list the facts from our conversation and the
> pasted material that this question actually depends on — nothing else.
> Then answer from that list only."**
> — makes the filter a visible, checkable artifact rather than a hope.
> "Nothing else" authorizes exclusion explicitly (models default to
> inclusive summaries), and "from that list only" binds the reasoning to
> the extract, which is the step that actually blocks the steering.
>
> **"If something I said earlier seems to conflict with this question,
> flag it instead of silently weighing it in."**
> — handles the residue case: long sessions accumulate half-retracted
> directions, and this converts their influence from silent bias into a
> visible conflict you can resolve.

Why this construction: diluted answers come from upstream — by the time
generation starts, the irrelevant material has already voted. Both lines
move the relevance decision to an explicit prior step with visible
output, which is precisely the intervention the cited result shows
works: separate deciding-what-matters from answering, and the answer
stops inheriting the pile's noise.
