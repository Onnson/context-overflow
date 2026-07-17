---
id: smallest-working-answer
name: Smallest Working Answer
type: practice
category: bloated-answers
problem: "I ask something simple and get a wall of text"
intent_signals:
  - answers padded with restatements and generic advice
  - having to skim past structure to find the content
  - "just answer the question"
  - responses that cover every case instead of your case
related:
  prevents: [eloquence-as-evasion]
  sibling_of: [attention-filtering]
evidence: both
sources:
  - "Maeda, J. (2006). The Laws of Simplicity. MIT Press — Law 1, 'Reduce: The simplest way to achieve simplicity is through thoughtful reduction.'"
inheritable: true
---

## Problem

Every answer arrives as a production: a restatement of your question, some
background, three options with trade-offs, a recommendation, caveats, and
an offer to elaborate. The information you needed is in there — one
sentence of it — and *you* are doing the extraction work, every time. At
scale this quietly inverts the tool's purpose: the AI generates volume,
and you've become its summarizer.

## Mechanism

The governing move is thoughtful reduction — in Maeda's formulation, the
simplest way to achieve simplicity (cited above). Applied to answers:
find the smallest response that fully does the job, where *fully* is
doing real work — the constraint is bidirectional. Cut everything whose
removal loses nothing the asker needs; keep everything whose removal
would send them back with a follow-up question. The target is not
shortness, it's **density**: every sentence surviving because the answer
fails without it.

The reduction is a judgment about *this* asker and *this* question —
which is why it can't be replaced by a length limit. "What does this
function do?" from someone debugging needs one sentence; the same words
from someone learning the codebase needs a paragraph. Reduction that
ignores the asker produces answers that are short and useless; padding
that ignores the asker produces answers that are complete and unread.

## How to apply — human

- Ask scoped questions when you want scoped answers — "one sentence:
  which of these is causing the leak?" The scope in the question licenses
  the reduction in the answer.
- When walls arrive, don't just skim: name the standard once — "answer
  first, at the size of the question; I'll ask when I want expansion."
  It transfers durably.
- Hold the other side of the bargain: when you do want depth, ask for it
  explicitly. If reduced answers get met with "why didn't you mention…",
  the padding comes back — completeness-padding is a defense against
  exactly that.

## How to apply — agent

1. Draft the answer, then find its core: the sentence(s) that directly
   answer what was asked. That core goes first — or *is* the whole
   response.
2. For each remaining element — restatement, background, alternatives,
   caveats — apply the removal test: does the asker, this asker, lose
   anything they need if this goes? No → cut. Unsure → cut, and let the
   follow-up question happen; a follow-up costs less than a hundred
   pre-answered ones.
3. Size to the question: a yes/no question earns yes/no plus the one
   qualifier that matters; a design question earns a design answer.
   Match, don't default.
4. Never pad to seem thorough. Signal remaining depth cheaply instead:
   "there's a subtlety with X if you need it."

## Narration

> "Short answer: {core}. Expanding only if you want the detail on {topic}."

## Verification

- **Human:** you've stopped skimming — answers get read whole, because
  everything in them is load-bearing. Follow-up questions you ask are
  about *more* depth, not about locating the answer.
- **Agent:** quote-test your response: could the first sentence alone be
  quoted as the answer? Removal-test the rest: name what each surviving
  paragraph protects the asker from losing. Anything you can't name is
  padding that survived.

## Failure modes

- **Terseness theater** — cutting to the bone regardless of what the
  question needs, shipping answers that are small and insufficient. The
  constraint is *working* first, smallest second; an answer that
  triggers three follow-ups saved nothing.
- **Cutting the caveat that mattered** — reduction discards the warning
  the asker needed ("this deletes data") along with the ten they didn't.
  Consequence-bearing caveats are part of *working*; decorative caveats
  are not. The removal test distinguishes them.
- **Uniform sizing** — one house length for all answers is the same
  disease as uniform padding. Density means tracking the question.
- **Reduction as evasion** — using brevity to skip past the part of the
  answer that's uncomfortable. The sibling anti-pattern buries the
  payload in length; this failure drops it entirely. The payload is the
  last thing reduction may touch.

## Field notes

The design principle is Maeda's (cited): thoughtful reduction as the
first law of simplicity, with the emphasis on *thoughtful* — remove what
can be removed without loss, and the removal itself is the design work.
In production sessions with frontier agents, the practice was enforced
as a standing quality bar ("outputs as small as possible for a working
solution") and the observed effects matched the mechanism: humans read
whole answers instead of skimming, misses surfaced as cheap follow-ups
rather than being pre-buried in bulk, and — unexpectedly — answer
*quality* rose, because the removal test forced the agent to identify
what the core of each answer actually was before shipping it.

## How to apply it in a prompt

The standing instruction, annotated:

> **"Answer at the size of the question. Lead with the direct answer;
> include only what I'd lose something by not having. If there's real
> depth available, mention it in one line and let me ask."**
> — "size of the question" makes length a function of the ask instead of
> a house style; the loss test gives the AI an operable cut criterion
> (not "be brief" — a mood — but "would I lose anything," a check); the
> third clause preserves access to depth so reduction doesn't become
> information loss, while moving the choice to expand to you.
>
> **"When I want the full treatment, I'll say so. Don't pre-answer
> follow-ups I haven't asked."**
> — closes the completeness-padding route, which is driven by
> anticipatory fear of the un-asked question. Making expansion an
> explicit request converts "cover everything in case" into "cover what
> was asked, offer the rest."

Why this construction: walls of text are a sizing failure, and sizing
can't be fixed by limits — it needs a criterion that scales with the
question. Both lines install criteria (the loss test, the ask-to-expand
contract) rather than lengths, which is why the same instruction works
for one-word answers and design documents.
