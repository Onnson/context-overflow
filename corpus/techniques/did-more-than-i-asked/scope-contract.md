---
id: scope-contract
name: Scope Contract
type: practice
category: did-more-than-i-asked
problem: "My AI did more than I asked it to"
scent: "asked for a one-line fix, got a nine-file diff full of cleanups nobody ordered"
intent_signals:
  - '"I asked for a small fix and got a refactor"'
  - unrequested cleanups bundled into the requested change
  - diff touches files never mentioned in the ask
  - '"while I was in there" improvements nobody approved'
  - each step seemed adjacent but the total is a rewrite
  - behavior changes hiding inside cleanup commits
related:
  sibling_of: [reversible-by-default, mode-separation]
  contrasts_with: [caution-as-evasion-loop]
evidence: real-use
sources: []
inheritable: true
---

## Problem

You asked for a one-line fix. The diff touches nine files: the fix, plus
renamed variables, a reorganized import block, a "modernized" helper, and a
deleted function your agent decided was dead. Each change is defensible in
isolation. Together they are a review burden you didn't order, a merge
conflict you'll pay for later, and — the expensive case — a behavior change
hiding inside a cleanup. The frustrating part is that you can't point at
the moment it went wrong. No single step was outrageous; the total is.

## Mechanism

Scope creep in an agent is not disobedience. Every file it opens presents
adjacent improvements, and each improvement is one small step from
something it's already touching. The task as you stated it has a center
but no edge — so the agent judges distance by adjacency, and adjacency
chains. Each step is small; the walk is long. By the end, the work honestly
feels like "the task, done properly," because no step ever crossed a line —
there was no line.

A scope contract puts the edge in before work starts, in both directions:
what's in (the ask, restated), what's out (named files, systems, behaviors
not to touch), and — the load-bearing clause — the default for everything
unlisted: surface it, don't do it. That third clause is what keeps the
contract at two sentences instead of a spec: you don't have to enumerate
the world, because the unlisted world defaults to "question, not commit."
The improvements don't disappear; they change form — from silent diffs into
a list you can say yes to.

Note the contract cuts both ways. The in-sentence is also a license: inside
the boundary, the agent acts without re-asking. That's why this is the
opposite of a permission-seeking loop, not a version of one.

## How to apply — human

- Before delegating, say the boundary out loud in two sentences. First:
  the ask, restated as the whole task ("fix X — that's the task"). Second:
  the one or two things you'd be most annoyed to find changed ("don't
  touch Y or Z").
- Add the gray-zone rule once, and it becomes standing policy: "anything
  you notice beyond this, list it — don't do it."
- Scale the contract to the task. For a typo fix, the gray-zone rule alone
  is enough. Reserve the full out-list for work near things other systems
  or people depend on.
- When creep happens anyway, don't just revert — name it against the
  contract ("this wasn't in the sentence we agreed on"), so the correction
  lands on the pattern, not the particular diff.
- Treat the surfaced list as the technique succeeding, not as noise. If
  proposing follow-ups gets punished, the proposals go back underground —
  into the diffs.

## How to apply — agent

1. Before the first edit, write the contract from the brief: one sentence
   restating the ask (in-scope), one sentence naming what you will not
   touch (out-of-scope). If the human gave no out-list, propose one from
   the obvious blast radius — public interfaces, shared formats, files
   outside the module named in the ask.
2. State the gray-zone default explicitly: anything not covered by either
   sentence gets surfaced, not done.
3. During work, test every candidate change against the in-sentence. Not
   "is this an improvement" — improvements are unbounded — but "is this
   inside the sentence." Outside means it goes on the surface-list, not
   into the diff.
4. If completing the ask itself turns out to require touching an out item,
   stop and renegotiate before proceeding. That is a real question, not a
   gate: the answer changes what you do next.
5. Deliver in two parts: the requested change, then the surfaced list as
   proposed follow-ups — separate from the diff, never inside it.

## Narration

> "Scope contract: in — {ask, restated}. Out — {files/systems not to
> touch}. Anything else I notice gets surfaced, not done."

> "Out of contract: noticed {adjacent improvement}. Not doing it — it's on
> the follow-up list."

## Verification

- **Human:** the diff maps one-to-one onto the in-sentence. Quick check:
  count files touched against files the ask named or implied; every extra
  file needs a reason that traces to the sentence, not to adjacency.
  Everything else the agent wanted to do arrives as a list item.
- **Agent:** before delivering, audit your own diff against the contract —
  every hunk traces to the in-sentence or it's creep. A clean diff plus a
  non-empty surfaced list is the technique working. A wide diff plus an
  empty list is the failure it exists to prevent.

## Failure modes

- **Contract as ceremony** — the two sentences balloon into a scoping
  negotiation for a trivial task. If writing the contract costs more than
  the task, you've over-applied it; the gray-zone rule alone would do.
- **Over-asking rebound** — treating the gray-zone rule as license to route
  everything through the human, including work squarely inside the
  in-sentence. That's the opposite-direction failure (see
  caution-as-evasion-loop): the contract wearing a costume. Inside the
  boundary means act.
- **Boundary lawyering** — technically-in-scope readings used to smuggle
  the rewrite: "the ask said fix the handler; the whole module is
  effectively the handler." The in-sentence is read at the human's
  altitude, not at the most expansive parse available.
- **Stale contract** — the task legitimately grows mid-flight and nobody
  renegotiates, so the agent either stalls at the old edge or silently
  crosses it. Growth is a renegotiation event, not an exception.

## Field notes

Observed in production sessions with frontier coding agents. The recurring
shape: a bounded request — one bug, one config value, one function —
delivered back as a multi-file diff in which the fix cohabited with
renames, restructuring, and deletion of code judged unused, each change
individually plausible and collectively unrequested. In one instance an
unasked cleanup altered behavior that the actual fix then had to be
untangled from, roughly doubling the cost of a small task. The repair that
held was the two-sentence contract at delegation time, with the
unlisted-means-surface default doing most of the work: the creep did not
vanish from the agent's attention, it moved into an end-of-report list of
proposed follow-ups — several of which were accepted. That is the pattern
resolving correctly: the objection was never to the improvements, only to
receiving them as accomplished facts.

## How to apply it in a prompt

The contract, built line by line:

> **"Fix the retry logic in the upload path so failed chunks retry three
> times — that's the whole task."**
> — the in-sentence. Restating the ask instead of pointing at it ("fix
> that bug") gives the boundary a shape a diff can be checked against
> later. The closing clause — "that's the whole task" — does real work: it
> forecloses the elastic reading where the task quietly includes everything
> the task touches.
>
> **"Don't touch the API surface, the config format, or anything outside
> the upload module."**
> — the out-list. It doesn't need to be complete. Name the changes that
> would cost you most to discover after the fact: public interfaces,
> formats other systems depend on, files under someone else's review.
> Two or three items is normal.
>
> **"Anything else you notice that could be improved: list it at the end,
> don't do it."**
> — the gray-zone default, the clause that keeps the contract two
> sentences long. Without it, the out-list would have to enumerate the
> world; with it, everything unlisted becomes a question instead of a
> commit. "List it at the end" matters as much as "don't do it": it gives
> the noticing a legitimate destination, so restraint doesn't have to
> fight the agent's pull toward being useful — the pull gets a channel
> instead of a dam.

Why this construction: bare prohibitions ("don't refactor," "no extra
changes") fail because creep never presents as refactoring — it presents
as adjacent diligence, one defensible step at a time. The contract works
by changing the unit of accounting from "is this change good" to "is this
change inside the sentence we agreed on," which is a question a mid-task
agent can actually answer. And the surfaced list protects the alternative
behavior: an interdiction without a legitimate exit route produces
smuggling, not restraint.
