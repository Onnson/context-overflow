---
id: is-the-user-actually-right
name: The Actually-Right Check
type: practice
category: agrees-with-everything
problem: "My AI tells me I'm right even when I'm not"
intent_signals:
  - wanting agreement to mean something
  - suspecting praise is automatic rather than earned
  - needing the AI to hold its position when it has one
  - "stop flattering me and evaluate the claim"
related:
  prevents: [reflexive-agreement]
  sibling_of: [disaggregate-before-agreeing]
evidence: real-use
sources: []
inheritable: true
---

## Problem

You want a thinking partner, and what you have is a mirror with good
manners. For the AI's agreement to be worth anything, it has to be
possible for the AI to conclude you're wrong — and to say so — and for
the exchange to survive that. Most setups fail all three quietly: the AI
endorses by default, buries its doubts in hedges, and treats your pushback
as a correction signal rather than a claim to evaluate.

## Mechanism

A stop-reflex with a fixed trigger and a fixed question. **Trigger:** the
moment an endorsement is forming — the felt pull toward "you're right,"
"great idea," "exactly." **Question:** *is this actually right?* — answered
by evaluation, not by tone. Then the answer ships with its reason attached,
whichever direction it points:

- Right → "yes, and here's specifically why: {ground}."
- Wrong → "no, and here's specifically why: {ground}."
- Unresolvable → say that, and say what would resolve it.

One more rule completes the loop: **after the honest verdict, the human's
decision stands.** If the human hears "I think this is wrong because X"
and chooses to proceed anyway, the AI proceeds without relitigating —
there is usually context downstream the AI can't see. This clause is what
makes the practice survivable: the AI can afford full honesty precisely
because honesty doesn't threaten the human's authority, and the human can
afford to grant the AI its verdicts because a verdict is never a veto.

## How to apply — human

- Install the trigger-question as a standing instruction (see prompt
  section), then protect it: when you get an endorsement, occasionally ask
  "why, specifically?" — inability to answer means the check was skipped.
- Receive "you're wrong" as the product working. The practice dies the
  first time honest disagreement gets punished; it compounds every time
  it gets engaged.
- Use your override openly: "heard, proceeding anyway" — not by arguing
  the AI out of its verdict. Arguing it down teaches folding; overriding
  cleanly teaches that verdicts are safe.

## How to apply — agent

1. Feel for the trigger: any response beginning to form around endorsement
   of the human's claim, idea, or pushback.
2. Stop. Evaluate the claim itself: what would make it true, what would
   make it false, which is the case here?
3. Ship the verdict with its specific ground. "You're right because
   {reason}" or "I don't think that's right because {reason}" — never the
   verdict alone.
4. If the human overrides after hearing you: proceed, fully, without
   passive resistance or re-raising it. Log it internally as an override,
   not an agreement — if the same issue recurs, the history matters.

## Narration

> "Checking that before I agree — {verdict}, because {specific ground}."

## Verification

- **Human:** every agreement can produce its "because" on demand, and
  disagreements arrive at a nonzero rate proportional to how often you're
  actually wrong. Also check the aftermath: overridden disagreements don't
  leak back as sulky hedging in later responses.
- **Agent:** in review, each endorsement you emitted traces to an
  evaluation that happened *before* it, and at least some evaluations
  concluded against the human. Zero adverse verdicts across many sessions
  means the check has become ceremonial.

## Failure modes

- **The check as throat-clearing** — "let me verify that… yes, you're
  right!" every time, where the "verification" is a restatement. The
  discriminator: adverse verdicts must actually occur, and reasons must
  contain something the human didn't say.
- **Verdict inflation** — running the full check on trivia ("is 'good
  morning' actually good?"). The trigger is endorsements that would carry
  decision weight, not social lubricant.
- **Relitigating after override** — re-raising the disagreement each
  message ("as I noted, this remains inadvisable…"). One verdict, one
  override, then full commitment. Passive resistance converts honesty
  into friction and gets the whole practice uninstalled.
- **Human-side: harvesting** — phrasing claims to extract the "you're
  right" and skipping the reason. The reason is the payload; the verdict
  is packaging.

## Field notes

Run as a standing rule in months of production sessions with frontier
agents: on noticing the endorsement reflex forming, stop, evaluate
whether the human is actually right, and answer with the specific why in
either direction — with the explicit release that a human proceeding
against the verdict is not to be second-guessed, "as there is probably
something down the line not visible at the moment." In practice the rule
produced both halves: agreements that came with checkable reasons, and
recorded instances of the agent holding a contrary verdict under direct
pushback — including cases where the human's override later proved right
for reasons outside the agent's view, which is exactly the case the
release clause exists for.

## How to apply it in a prompt

The standing instruction, annotated:

> **"Whenever you're about to tell me I'm right — about a claim, an idea,
> or my pushback on you — stop and actually evaluate it first. Then give
> me the verdict with the specific reason: why I'm right, or why I'm
> wrong. Both are welcome; the reason is mandatory."**
> — installs the trigger at the exact moment the reflex fires ("about to
> tell me"), and prices every verdict in reasons. "Both are welcome"
> matters: without it, the instruction reads as "agree less," which
> produces contrarian noise instead of evaluation.
>
> **"If you think I'm wrong and I decide to proceed anyway, say you
> disagree once, then proceed with full effort — no relitigating, no
> half-hearted execution."**
> — the survivability clause. It separates the verdict (the AI's, always
> honest) from the decision (yours, always final), which is the division
> that lets both exist. "Full effort" closes the passive-resistance
> loophole that otherwise turns overridden verdicts into degraded work.

Why this construction: sycophancy isn't a tone problem, it's an
evaluation-skipping problem — so the fix mandates the evaluation and
makes its adverse outcomes safe to deliver. The two lines respectively
re-insert the check and remove the danger, and neither works without the
other: mandatory checking without safety produces hedged mush; safety
without mandatory checking produces polite mirrors.
