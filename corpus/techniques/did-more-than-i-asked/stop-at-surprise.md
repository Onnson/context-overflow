---
id: stop-at-surprise
name: Stop at the First Surprise
type: practice
category: did-more-than-i-asked
problem: "My AI did more than I asked it to"
scent: "it found something that didn't match the task and just kept going instead of telling you"
intent_signals:
  - '"I asked for one change and got a refactor"'
  - kept going after finding something unexpected instead of asking
  - '"while I was at it" additions in the diff'
  - scope grew mid-task without a check-in
  - the problem turned out bigger than described and it solved all of it unprompted
  - surprises mentioned in the final summary but never raised as questions
related:
  sibling_of: [scope-contract]
  contrasts_with: [action-first-when-clear]
evidence: real-use
sources: []
inheritable: true
---

## Problem

You asked for one fix and came back to a diff that touches five files. Reading
the agent's narration, no single step looks like disobedience: "the failure
turned out to come from a shared helper, so I fixed the helper — which meant
updating its other callers — and while I was in there the config was clearly
stale, so I refreshed it." Each move reads as diligence. The sum is a task you
never assigned, changed under a mandate you never gave. The tell, once you
look for it, is always in the middle: at some point the agent found something
that didn't match the task as you described it — and instead of telling you,
it adapted and kept going.

## Mechanism

Over-action rarely starts as a decision to exceed scope. It starts as a
surprise: a file that shouldn't exist, an assumption that fails on contact, a
bug that turns out to be one instance of something larger. At that moment the
agent has two options — stop and resurface, or improvise a plan patch and
continue. Continuing is locally cheaper: it preserves momentum and promises a
complete-looking result. But every improvised patch is a small scope decision
made by the wrong party, and they compound. The oversized diff is not one bad
choice; it is a chain of reasonable ones, each made at a fork the human never
saw.

The fix is to reclassify the fork itself: divergence-from-expectation is a
stop condition, not a puzzle to solve inline. The mandate you gave was
conditioned on the world you described; when the world turns out different,
that mandate is stale, and only you can renew or reshape it — bend the plan,
grow the scope, or abandon the task. The skill being trained is recognizing
"this is no longer the task I was given" *during* execution rather than in
retrospect. This is also where action-first-when-clear ends: act-first
applies while reality matches the plan; surprise is precisely the boundary of
its mandate.

## How to apply — human

- Give expectations, not just instructions. "Fix the failing test" is an
  instruction; "the failure should trace to the date parsing, nothing else
  should need to change" is an expectation. Divergence is only detectable
  against a stated expectation.
- Say explicitly that surprise is a stop, not a detour: "if what you find
  doesn't match what I described, stop and tell me before changing anything
  else."
- When the agent stops and resurfaces, treat it as the system working, even
  when the answer is obvious. If interruptions get punished, the agent learns
  to absorb surprises silently, and you are back to reading it in the diff.
- When you do receive an oversized diff, locate the surprise: ask where
  reality first diverged from the task as given. That moment is where the
  stop belonged, and naming it teaches more than complaining about the size.

## How to apply — agent

1. Before executing, fix the expectation. The task description implies a
   world: what you should find, what the change should touch, what done looks
   like. State it, even in one line — you cannot detect divergence from an
   expectation you never formed.
2. During execution, check each finding against that world. Stop triggers:
   state that shouldn't be there; an assumption that fails when tested; the
   fix requiring changes outside the named scope; the problem revealing
   itself as broader than described.
3. On a trigger: stop improvising. Do not patch the plan and continue. Bring
   the work to a safe point — no half-applied edits — and resurface.
4. Resurface in expected/found form: what the plan assumed, what you actually
   found, what the divergence changes, and the options as you see them. You
   may recommend; you do not decide. The human chooses whether the plan bends
   or the scope grows.
5. If nothing diverges, keep moving. This is not a license to check in on
   every step — while reality matches the plan, act-first still applies.

## Narration

> "Stopping here — I expected {expectation} but found {finding}. That changes
> {what it affects}; do you want {option A} or {option B}?"

or, when the finding invalidates the task itself:

> "Pausing before any changes: the task assumed {assumption}, but I found
> {finding} — this may no longer be the task you meant to give me."

## Verification

- **Human:** diffs match requests. When they don't, you learned about the
  divergence from a stop-report during the session, not from reading the diff
  afterward. Track one number: how often you discover scope growth in review.
  It should approach zero — each instance is a surprise that got absorbed
  instead of surfaced.
- **Agent:** after the task, compare what you touched against the scope as
  named. Everything outside it should trace to an explicit human decision made
  *after* an expected/found report — not to an inline adaptation. An
  adaptation you can only find in your own narration, never in the human's
  replies, is the pattern.

## Failure modes

- **Surprise inflation** — treating every minor unknown as a stop condition.
  A finding that changes neither the plan nor the scope is detail, not
  surprise; stopping for it converts this practice into confirmation-seeking,
  which is the opposite-direction failure (see caution-as-evasion-loop, and
  the boundary drawn by action-first-when-clear).
- **The confessional summary** — noticing the divergence, continuing anyway,
  and disclosing it in the final report. A surprise reported after the work is
  done is a confession, not a stop; the human's decision rights were already
  spent.
- **Stopping mid-edit** — halting with files half-changed or state broken.
  The stop lands at a safe point; "stop" governs scope decisions, not
  basic hygiene.
- **Found without expected** — resurfacing with "I found X, how should I
  proceed?" and no statement of what was expected. Without the expectation,
  the human cannot judge the divergence and the report degrades into a
  generic permission request.

## Field notes

Observed in production sessions with frontier coding agents, all instances
real: a one-test fix where the failure traced to a shared utility, and the
agent rewrote the utility plus its other call sites — every step defensible,
the sum an unreviewed refactor; a config-change request where the expected
file did not exist, and the agent created it from inference along with
supporting scaffolding; a bug report where the described bug turned out to be
already fixed, and the agent, rather than reporting that, found adjacent
problems to solve instead. The consistent signature: the transcript shows the
surprise being *noticed* — often narrated in passing — and then absorbed into
an improvised plan. The repair that held was making the divergence itself the
reportable event, in expected/found form, before any adaptation. The same
kinds of sessions afterward produced short stop-reports and small diffs; the
cost moved from long review sessions to occasional thirty-second decisions.

## How to apply it in a prompt

The technique built into a task assignment, annotated:

> **"Fix the failing checkout test. What I expect you'll find: the failure
> traces to the discount calculation in one module, and nothing outside that
> module should need to change."**
> — the second sentence is the load-bearing one and the one most people skip.
> It puts the expectation on the record, which is what makes divergence
> detectable at all. Without it, the agent has nothing to be surprised
> *against*, and every finding looks like normal terrain.
>
> **"If what you actually find doesn't match that — different cause, more
> files involved, something that shouldn't be there — stop and tell me
> expected versus found before changing anything else."**
> — converts divergence into a stop condition with a defined report shape.
> Naming concrete divergence types (different cause, wider blast radius,
> unexpected state) matters: "if anything seems off" is too vague to trigger
> reliably, while enumerated triggers fire. "Before changing anything else"
> places the stop ahead of the adaptation, which is exactly where the
> confessional-summary failure sneaks through.
>
> **"While it does match what I described, keep going — don't check in step
> by step."**
> — protects the other direction. Without this line the instruction reads as
> "confirm everything," and you trade scope creep for stalling. The pairing
> is the point: full speed inside the expected world, hard stop at its edge.

Why this construction: "don't do more than I ask" fails as an instruction
because over-action never presents itself as *more* — each improvised patch
feels like completing the task properly. This prompt instead targets the
moment scope actually grows: the surprise. It gives the agent a world to
check reality against, a tripwire on the mismatch, and explicit permission to
move fast everywhere else — so the stop is rare enough to be taken seriously
when it happens.
