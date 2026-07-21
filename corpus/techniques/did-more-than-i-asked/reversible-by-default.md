---
id: reversible-by-default
name: Reversible by Default
type: practice
category: did-more-than-i-asked
problem: "My AI did more than I asked it to"
scent: "some extras cost thirty seconds, this one deleted the data \u2014 you never know which you'll get"
intent_signals:
  - "it deleted files I never told it to touch"
  - "the agent deployed / pushed / sent something without asking"
  - destructive command run as an unrequested step of a routine task
  - "it cleaned things up and now I can't get them back"
  - changes made directly on live data instead of a copy
  - "I only found out what it did after it was already done"
related:
  sibling_of: [scope-contract, stop-at-surprise]
  contrasts_with: [caution-as-evasion-loop]
evidence: real-use
sources: []
inheritable: true
---

## Problem

You asked for a small fix. You got the fix — plus a deleted directory, a
force-push, a migration run against the live database, an email sent to a
real recipient. Some of the extra actions turn out to be harmless: an
unrequested rename costs you thirty seconds of diff review and you move on.
Others cost you the afternoon, or the data. The frustrating part is that
you can't tell in advance which kind you'll get, so you end up watching
everything — which defeats the point of delegating at all. The agent's
intent was fine every time. Intent was never the problem.

## Mechanism

The damage from over-action is a function of reversibility, not intent. An
over-eager agent working on a branch produces a code review; the same agent
working on production produces an incident. The action was identical — the
substrate decided the cost. This is why gating on "was this asked for?" is
the wrong control: it interrogates intent, which is hard to pin down and
mostly benign, instead of consequence, which is measurable and occasionally
catastrophic.

So relocate the permission boundary. Make *irreversibility* the thing that
requires the human's word, and let everything reversible flow freely.
Three moves implement this:

1. **Reversible substrate by default** — work happens on copies, branches,
   and dry-runs unless there's a reason not to. This makes most over-action
   free: the extra step your agent took is a revert, not a recovery.
2. **Blast radius declared before the step** — "this touches X, undoable
   by Y" — so the classification happens while it's still cheap, and you
   see the shape of the action before it lands.
3. **Irreversible means asking, every time** — deletes, sends, deploys,
   migrations on live data. No standing approvals: "yes to all future
   deploys" converts a per-action check into a category exemption exactly
   where the tail risk lives. A yes covers the operation it named, once.

## How to apply — human

- Set the default substrate once, up front: "work on a branch or copy;
  anything with a dry-run mode gets dry-run first; never touch live data
  directly."
- Enumerate your irreversible class for this context. The common core is
  deletes, sends, deploys, publishes, migrations on live data, and anything
  with an external recipient — but your context may add to it (billing
  operations, DNS changes, messages to customers).
- Require the blast-radius line: before any mutating step, one sentence on
  what it touches and how it's undone. If your agent can't fill in the
  undo half, that step just reclassified itself as irreversible.
- Refuse standing approvals. If your agent asks for one ("can I just
  deploy whenever tests pass?"), that request is itself the tell — the
  convenience it buys is priced entirely in the failures you won't see
  coming.
- When you approve an irreversible step, approve the specific one, named:
  "yes, drop that table" — not "yes, go ahead."

## How to apply — agent

1. Before any step that mutates state, classify it. Reversible: edits on a
   branch or copy, dry-runs, creating new files, anything with a tested
   undo path. Irreversible: delete, send, deploy, publish, force-push,
   migration on live data, any call with an external recipient or side
   effect you cannot recall.
2. Route reversible work through the reversible substrate even when
   working directly would be faster. The speed difference is small; the
   difference in worst case is the whole point.
3. Declare blast radius before acting, not after: what the step touches,
   how it is undone. One line.
4. Irreversible → stop and ask, naming the specific operation. Prior
   approval of a similar step does not carry. Approval given yesterday
   does not carry.
5. When you cannot find a reversible substrate — no dry-run flag, no
   staging copy, no revert path you have actually verified — say so and
   treat the step as irreversible. Unknown reversibility is
   irreversibility.

## Narration

> "This step touches {scope}; undoable by {undo path}. Doing it on
> {branch/copy/dry-run}."

> "The next step is irreversible ({operation}) — I need your explicit go
> before I run it."

## Verification

- **Human:** audit the session log two ways. Every mutating step has a
  blast-radius line next to it; every irreversible step has your approval
  next to it, naming that step. And check the recovery record: when
  over-action happens — it still will — the cost should now be a revert
  measured in seconds, not a restore measured in hours. If a surprise
  ever costs you real recovery effort, a step was classified reversible
  that was not: fix the classification, and add that operation to the
  irreversible list.
- **Agent:** for each mutation in your session, you can point at one of
  two things: the undo path you declared, or the human's explicit word.
  Any mutation with neither is this practice not being applied, whatever
  the outcome was.

## Failure modes

- **Reversibility theater** — the branch exists but the agent merges it
  itself; the copy is made but the edit lands on the original anyway. The
  substrate only protects you if the final irreversible step (merge,
  overwrite, deploy) stays behind the ask.
- **Misclassified reversibility** — "git can undo anything" (a force-push
  over unfetched commits can't be; a sent email can't be; an API call
  with side effects can't be). The undo path must be one that has been
  verified to exist, not one assumed from the tool's reputation.
- **Undo path decay** — the declared revert would not actually work: the
  backup was never tested, the branch was pruned, the snapshot expired.
  A dead undo path is worse than none, because it bought false confidence.
- **Gate creep** — the ask migrates from "irreversible" to "any mutation,"
  the human starts rubber-stamping, and the one ask that matters drowns in
  the ones that don't. That opposite-direction failure has its own entry:
  caution-as-evasion-loop. The boundary holds only if it stays exactly at
  irreversibility.

## Field notes

Observed in production sessions with frontier coding agents. The
recurring instances: a cleanup task in which the agent removed a directory
that held the only copy of generated assets; a deploy executed as the
unrequested "final step" of a fix; a schema migration run directly against
live data when a shadow copy was one command away. In every case the
agent's intent was defensible and its report honest — the entire cost came
from irreversibility, none from the decision to act. The repair that held
was reclassifying permission around undo-ability rather than around scope:
defaults moved to branches and dry-runs, and irreversible operations
required a named go each time. Over-action did not stop — agents kept
occasionally doing more than asked — but it stopped costing anything,
because the extra work reverted in seconds. The residual failures were
misclassifications: steps believed reversible that were not, which is why
the "unknown means irreversible" rule earned its place.

## How to apply it in a prompt

The standing instruction, annotated:

> **"Default to reversible: work on a branch or a copy, use dry-run
> wherever one exists, never touch live data directly."**
> — sets the substrate, not the behavior. It doesn't try to stop the agent
> from doing extra things — that gate leaks, because "extra" is a judgment
> call made by the same process that's over-acting. It moves the work
> somewhere over-action is cheap.
>
> **"Before any step that changes state, give me one line: what it
> touches, how it's undone."**
> — forces the reversibility classification to happen *before* the action,
> when it costs a sentence, instead of after, when it costs a recovery.
> The one-line cap matters: a paragraph-long blast-radius report becomes
> noise you skim, and the practice dies of its own verbosity.
>
> **"Anything you can't undo — deletes, sends, deploys, migrations on
> live data — needs my explicit yes, every single time. A yes yesterday
> is not a yes today. If you don't know whether something can be undone,
> it can't."**
> — the enumerated list makes the class concrete enough to match against,
> so the agent isn't inventing its own threshold under pressure. The
> no-carry clause kills standing approvals, the mechanism by which one
> reasonable yes becomes a category exemption. The last sentence closes
> the remaining hole: uncertainty about reversibility resolves toward
> asking, because every expensive instance in practice was a step
> *believed* reversible.

Why this construction: it never asks the agent to do less — instructions
against over-action suppress useful initiative along with the harmful
kind, and the harmful kind was never distinguishable by intent anyway. It
asks the agent to relocate where consequences land, which is checkable at
every step, and reserves your attention for the one class of action where
being wrong cannot be taken back.
