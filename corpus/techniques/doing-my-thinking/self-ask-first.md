---
id: self-ask-first
name: Self-Ask Before Delegating
type: practice
category: doing-my-thinking
problem: "I'm outsourcing my thinking and getting dumber"
intent_signals:
  - pasting a problem to the AI before reading it yourself
  - accepting answers without being able to say what a good answer would look like
  - feeling unable to evaluate what the AI returns
  - wanting to use AI without losing your own grip on the problem
related:
  sibling_of: [rephrase-and-respond]
evidence: both
sources:
  - "Press, O., Zhang, M., Min, S., Schmidt, L., Smith, N. A., & Lewis, M. (2022). Measuring and Narrowing the Compositionality Gap in Language Models. arXiv:2210.03350."
inheritable: true
---

## Problem

The problem lands, and your first move is to paste it to the AI — before
you've read it closely yourself. The answer comes back plausible, and you
realize you can't evaluate it: you never formed a view of what a good answer
would look like. Do this for a month and you notice the deeper cost — on the
day the AI is wrong, you have nothing to catch it with. The tool that was
supposed to extend your thinking has been *doing* it.

## Mechanism

Three questions, answered by you, before the problem leaves your hands:

1. **What do I know?** — the facts and constraints you already hold.
2. **What do I need to know?** — the actual gaps, named as questions.
3. **What am I assuming?** — the load-bearing beliefs you haven't checked.

Thirty seconds of this changes both sides of the exchange. Your request gets
sharper: you delegate the named gaps instead of the undigested problem. And
your evaluation capacity survives: you now hold a model of the problem to
check the answer against, so the AI's output lands in a prepared mind rather
than a vacant one.

The same decomposition move is documented on the machine side: prompting a
model to explicitly ask and answer its own sub-questions before answering a
compositional question measurably improves its accuracy (the "self-ask"
pattern, cited above). The reason it works is the same for you as for the
model — decomposition before answering catches the gap between *sounding
resolvable* and *being resolved*.

## How to apply — human

- Before sending a problem to your AI, answer the three questions —
  out loud, on paper, or in the prompt itself. If question 2 comes up empty,
  you haven't read the problem yet; that's the tell.
- Delegate the gaps, not the whole: "I know A and B; I need C and D; I'm
  assuming E — check that assumption and get me C and D."
- When the answer arrives, evaluate it against your own pre-formed model
  first, and note where it surprises you — surprise is either your gap
  or its error, and telling those apart is exactly the muscle this
  preserves.

## How to apply — agent

When handed a broad or compositional problem:

1. Before answering, decompose: state the sub-questions the problem actually
   contains, and answer them in sequence, showing the chain.
2. If the human sent a raw problem-dump, reflect the decomposition back:
   "this breaks into {sub-questions} — here's each."
3. Distinguish in your answer what was given by the human, what you derived,
   and what you assumed — so the human's own model has something to attach
   to.

## Narration

> "Breaking this into its sub-questions before answering: {sub-questions}."

## Verification

- **Human:** you can state, before reading the AI's answer, what a good
  answer needs to contain — and afterwards, you can say specifically why you
  accept or reject what came back. "Looks right" is the failing grade.
- **Agent:** your answer shows its sub-questions and which are assumption
  vs. derivation. A compositional question answered in one undifferentiated
  block skipped the practice.

## Failure modes

- **Ritual self-ask** — writing three perfunctory answers to get to the
  pasting. The tell is question 3 always coming back "nothing." You are
  always assuming something; not finding it means not looking.
- **Self-ask as procrastination** — expanding the three questions into a
  research project before any delegation. The practice is thirty seconds of
  orientation, not a gate that must be exhaustively satisfied.
- **Delegating the self-ask** — asking the AI "what should I be asking
  here?" as your *first* move. Useful question, wrong order: it hands over
  the exact step that keeps you sharp. Form your own three answers, then
  compare with the AI's if you like.

## Field notes

The machine-side effect is established in the literature: Press et al.
(cited) showed models fail compositional questions they can answer piecewise
— the "compositionality gap" — and that explicit self-questioning narrows
it. The human-side practice comes from production experience: sessions
where the human ran the three questions before delegating produced visibly
different exchanges — requests scoped to actual gaps, and errors caught on
arrival because the human held a model to check against. The degradation
pattern is equally real and observed: humans who paste-first for weeks
report losing the ability to tell a good answer from a fluent one.

## How to apply it in a prompt

The practice is mostly pre-prompt — the three questions happen before you
write. But the prompt can carry their output, annotated:

> **"Here's what I already know: {facts and constraints}. Here's what I need
> from you: {the named gaps}. I'm assuming {assumptions} — flag it if either
> assumption is wrong."**
> — the three-part structure is your self-ask, externalized. Stating knowns
> stops the AI from re-deriving (and possibly contradicting) what you have;
> naming the gaps turns "help me with this" into a scoped request; declaring
> assumptions makes them checkable by a second reader instead of silent
> load-bearing walls.
>
> **"Answer the gaps one at a time, and separate what you derived from what
> you assumed."**
> — asks the AI to run the same decomposition discipline on its side, which
> is the machine-verified half of the technique: sub-question-by-sub-question
> answers are both more accurate and far easier for your prepared model to
> audit than one fused response.

Why this construction: the prompt isn't the technique — the thirty seconds
before it is. What the construction does is make the thinking you did
*load-bearing in the exchange*, so the AI extends a model you hold instead
of replacing the need for one.
