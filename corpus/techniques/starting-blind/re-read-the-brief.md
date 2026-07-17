---
id: re-read-the-brief
name: Re-Read the Brief
type: practice
category: starting-blind
problem: "It starts producing before it understands the task"
intent_signals:
  - output that addresses most of the request but drops a requirement
  - constraints stated in the task getting ignored in the result
  - the AI answering the first half of a two-part question
  - work restarting because the brief was misread, not because it was hard
related:
  sibling_of: [rephrase-and-respond]
evidence: both
sources:
  - "Xu, X., Tao, C., Shen, T., Xu, C., Xu, H., Long, G., Lou, J., & Ma, S. (2023). Re-Reading Improves Reasoning in Large Language Models. arXiv:2309.06275."
inheritable: true
---

## Problem

The work comes back competent and *incomplete* — three of your four
requirements met, the fourth not refused but simply gone, as if it had
never been in the message. Or the output honors the task but violates the
constraint you stated in the same paragraph. Nothing failed downstream;
the failure happened in the first seconds, when the brief was read once,
partially, and the production started before the reading finished.

## Mechanism

A single pass over a request is a lossy read — for a model as for you.
First-pass attention snags on the most salient elements (the verb, the
big noun, the interesting sub-problem) and the momentum of production
does the rest: generation starts aimed at the salient parts, and the
non-salient parts — the second requirement, the quiet constraint, the
"but not X" — never make it into the plan.

The countermeasure is almost embarrassingly cheap: **read the brief
again, as a step, before producing.** The second pass hits different
material — with the gist known, attention is free to catch the
qualifiers and enumerate the actual requirements. This is measurable on
the machine side: simply having a model re-read the question before
answering improves reasoning accuracy across tasks and model types (the
Re2 result, cited above) — the second pass lets attention distribute
"bidirectionally," seeing early parts of the question in light of later
ones. The practice wraps that mechanism in a checkable habit: the
re-read produces an explicit requirements list, and the work is checked
against that list before it ships.

## How to apply — human

- Write briefs that survive partial reading badly — enumerate: "four
  requirements: 1… 2… 3… 4…" A numbered list makes a dropped item
  visible in a way flowing prose never is.
- Ask for the read-back on anything multi-part: "before you start, list
  what I asked for." Three seconds to verify beats a redo cycle.
- When output comes back incomplete, diagnose it as a reading failure,
  not a capability failure: point at the dropped requirement — "item 3
  was in the brief" — which reinstalls the practice better than "try
  again."
- Re-read your own brief before sending it, once, for the same reason:
  half of "the AI missed a requirement" cases are requirements that are
  in your head and not in the text.

## How to apply — agent

On receiving any non-trivial request:

1. Read it once for the gist. Then read it again — this time extracting:
   every requirement (numbered), every constraint ("must," "don't,"
   "only," "except"), every question actually asked.
2. Check the extraction for the easy-to-drop classes: second halves of
   compound sentences, negative constraints, requirements stated as
   asides ("oh and it should also…").
3. Produce against the extracted list, not against your memory of the
   request.
4. Before delivering, walk the list once: each item either satisfied in
   the output or explicitly addressed as not done and why. Silence on a
   listed item is the failure this practice exists to prevent.

## Narration

> "Re-reading the brief before starting — I count {n} requirements:
> {list}. Producing against that list."

## Verification

- **Human:** multi-part requests come back with all parts addressed —
  including the ones the AI *couldn't* do, addressed as such rather than
  skipped. Dropped-requirement redos trend to zero.
- **Agent:** compare your pre-work extraction against the brief after
  delivery: did the list capture everything? Then against the output:
  did every listed item get satisfied-or-addressed? A miss in the first
  comparison is a reading failure; in the second, a discipline failure.
  They have different fixes — know which one happened.

## Failure modes

- **Ritual re-reading** — a second pass that's really the first pass
  repeated: same salient elements, same misses. The re-read must produce
  an *artifact* (the numbered extraction); a re-read that leaves no list
  behind was a glance.
- **Extraction without checkback** — building the list, then producing
  from momentum anyway and never walking the list at the end. The final
  walk is where dropped items actually get caught; the list alone is
  just better-documented blindness.
- **Over-application** — running full extraction ceremonies on one-line
  unambiguous requests. The practice prices in at multi-part or
  constraint-bearing briefs; below that, just do the thing.
- **Reading the brief instead of the world** — a perfect requirements
  list doesn't substitute for checking the actual system state before
  acting. This practice fixes misread *requests*; misread *reality* is
  its own problem.

## Field notes

Machine-side, Xu et al. (cited) established the mechanism with unusual
directness: appending the question again — literally prompting the model
to read it twice — improved reasoning performance across arithmetic,
commonsense, and symbolic benchmarks on both plain and
chain-of-thought-style prompting, attributed to attention getting a
second, better-informed pass over the input. In production sessions with
frontier agents, the practice ran as a standing rule — review the
requirements before each major action — and the observed failure it
suppressed was exactly the canonical one: multi-requirement briefs
returning with a silently dropped item. The requirement-extraction
variant (list, then produce, then walk the list) outperformed bare
re-reading in practice, because the list made the final completeness
check mechanical instead of impressionistic.

## How to apply it in a prompt

The standing instruction, annotated:

> **"Before starting on any multi-part request: re-read it and list what
> I actually asked for — every requirement numbered, every constraint
> included. Produce against your list, and end by walking it: each item
> done, or named as not done with the reason."**
> — installs all three stages (re-read, extract, checkback) as one
> pipeline. The numbered list is the load-bearing element: it converts
> "did I address everything?" from a feeling into a walk. The
> end-walk clause catches the drops that survive even a good extraction,
> and "named as not done" keeps honesty cheaper than silence.
>
> **"Constraints count as requirements — 'don't touch X' is item zero."**
> — negative constraints are the most-dropped class (they generate no
> output, so their absence is invisible in the result). Promoting them
> explicitly into the list gives them the same protection as the
> positive requirements they otherwise hide behind.

Why this construction: starting blind is a first-seconds failure, so the
fix must occupy the first seconds — everything here happens before and
after production, none of it during. The prompt buys, for the cost of
one list, the thing single-pass reading structurally cannot provide: a
completeness check with an explicit denominator.
