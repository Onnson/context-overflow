---
id: outside-view-first
name: Outside View First
type: practice
category: starting-blind
problem: "It starts producing before it understands the task"
scent: "the estimate was detailed and confident, and the work still ran over in the usual ways"
intent_signals:
  - plans and estimates built purely from the task's own details
  - '"this should be straightforward" preceding a quagmire'
  - the AI scoping work with no reference to how such work usually goes
  - optimistic first drafts of timelines, designs, or effort guesses
related:
  sibling_of: [self-ask-first]
evidence: both
sources:
  - "Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux — Part 3, ch. 23, 'The Outside View' (the planning fallacy and reference class forecasting)."
inheritable: true
---

## Problem

Asked to scope something — an estimate, a plan, a "how hard would it be" —
your AI dives straight into the task's own details and builds an answer
from the inside: these steps, this code, therefore this size. The answer
is coherent, specific, and systematically optimistic, because it's
constructed entirely from the case in front of it — a case in which,
naturally, nothing unexpected appears, since the unexpected is precisely
what the inside of a plan doesn't contain. You act on the scoping, and
reality delivers the usual surcharge.

## Mechanism

This is the planning fallacy in delegated form (Kahneman, cited above):
plans built from a case's internals ignore the *distribution* — how tasks
of this kind actually tend to go, with all their unglamorous typical
failures. The corrective is the outside view: before reasoning from the
case's details, ask what reference class the task belongs to and what
normally happens in that class. "Migrations of this kind usually surface
integration surprises" is information no amount of inside inspection
produces, because it comes from the class, not the case.

The practice, made operational: **class before case.** First name the kind
of thing this is and its known typical costs and failure points; then do
the inside analysis; then reconcile — where the inside answer is rosier
than the class baseline, the difference is a claim that *this case is
special*, and that claim needs stating and defending explicitly rather
than riding in silently as optimism.

## How to apply — human

- Ask for the class before the estimate: "before you scope this — what
  kind of task is this, and how do tasks of that kind usually go?" The
  question costs one exchange and reliably surfaces the typical failure
  points inside-view scoping omits.
- When an estimate arrives without a class, run the challenge: "what
  would have to be true for this to go that smoothly?" — which forces
  the hidden this-case-is-special claim into the open.
- Bring your own base rates where you have them ("the last three
  integrations each doubled") — your history is a reference class the
  AI doesn't have unless you supply it.
- Accept boring answers. The outside view's output is often "this will
  take longer than it looks, in the usual ways" — its value is being
  right, not being interesting.

## How to apply — agent

When asked to scope, estimate, or plan:

1. Classify first: what reference class does this task belong to?
   (Migration, refactor across N files, third-party integration, "small
   UI change"…) Name it out loud.
2. State the class's typical shape: common failure points, usual hidden
   costs, and — where you can ground it — how often such tasks exceed
   their inside-view estimates.
3. Then do the inside analysis of this specific case.
4. Reconcile: if your case-analysis is more optimistic than the class
   baseline, state the specialness claim explicitly ("this avoids the
   usual X because Y") so the human can judge it — or adjust toward the
   baseline if you can't defend one.

## Narration

> "Outside view first: this is a {reference class} task; they typically
> {known costs/failure points}. Inside view of this one: {case analysis}.
> Where I'm more optimistic than the class: {stated reason, or adjusted}."

## Verification

- **Human:** scopings you receive name a reference class and either
  match its baseline or defend the deviation. Longitudinally: your
  estimate misses shrink and — the truer signal — stop being
  *systematically* one-sided.
- **Agent:** in review, each optimistic deviation from a class baseline
  carried an explicit defense, and completed tasks let you check both:
  was the class right, and was the defense? A defense that keeps failing
  ("no legacy surprises here") is an optimism generator wearing
  analysis clothes.

## Failure modes

- **Fake base rates** — inventing precise-sounding class statistics
  ("such migrations run 2.3× over") without grounds. The outside view
  runs on honest class knowledge, which is often qualitative ("these
  usually hit auth edge cases"); a fabricated number is worse than a
  hedge, because it launders optimism through false precision.
- **Wrong reference class** — classifying by surface ("it's a config
  change") instead of by mechanism ("it's a change every service reads
  at boot"). The class choice *is* the analysis; a wrong class imports
  the wrong distribution.
- **Outside view as fatalism** — quoting the class to avoid the inside
  work ("these always blow up, who can say"). The practice is a
  reconciliation of two views, not a replacement of one by the other;
  the case details still matter, checked against the class.
- **Ceremony on trivia** — reference-classing a typo fix. Price of
  entry: the scoping has to carry decision weight.

## Field notes

The mechanism is Kahneman's (cited): planners using a case's internals
systematically underestimate, and consulting the reference class —
"cases like this one" — corrects in the right direction; the chapter's
own curriculum-project story (an inside-view estimate of two years
against a class baseline of seven-plus, resolved in the class's favor)
is the pattern in miniature. In production sessions with frontier
agents, the delegated version recurred constantly: agent scopings of
integration and migration work came back clean-roomed and optimistic
until the class question ("how do these usually go?") was made a
standing part of scoping requests — after which typical-failure items
(auth edge cases, stale-config surprises, the second system nobody
mentioned) started appearing in plans *before* they appeared in
reality. The human-supplied base-rate move proved especially cheap and
effective: two sentences of project history reliably outperformed the
agent's uncalibrated optimism.

## How to apply it in a prompt

The scoping request, annotated:

> **"Before you estimate this: tell me what kind of task it is and how
> tasks of that kind usually go — typical hidden costs, where they
> usually blow up. Then scope this one specifically. If your specific
> scope is sunnier than the typical case, say exactly why this one is
> special."**
> — sequences class before case, which is the entire intervention: once
> the baseline is on the table first, optimism has to argue instead of
> just arriving. The "say exactly why" clause converts silent
> specialness into an auditable claim — most of them don't survive
> being written down.
>
> **"For context, my base rates: {your history with such tasks}."**
> — supplies the reference-class data the AI genuinely lacks: *your*
> codebase's, team's, or vendor's track record. One sentence of real
> history anchors the class better than any general knowledge, and it
> licenses the AI to give you the unflattering baseline without
> guessing at it.

Why this construction: the planning fallacy isn't an information gap —
the inside view feels *more* informed, which is the trap. The prompt
works by ordering, not by adding: class first, case second,
discrepancies defended. That ordering is what the cited work shows
humans need imposed from outside — and a delegated planner needs it
imposed by the request.
