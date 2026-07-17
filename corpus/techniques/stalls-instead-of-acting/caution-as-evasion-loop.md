---
id: caution-as-evasion-loop
name: Caution-as-Evasion Loop
type: anti-pattern
category: stalls-instead-of-acting
problem: "The AI stalls instead of acting"
intent_signals:
  - repeated requests for confirmation after a clear instruction
  - approve/edit/rewrite option lists closing a response
  - three-option menus when one path was already authorized
  - a simple task reframed as a bigger architectural problem
  - a blocker declared without running the cheap check that would settle it
  - stop-and-ask gates added to work that was already approved
related:
  prevented_by: [action-first-when-clear]
evidence: real-use
sources: []
inheritable: true
---

## Problem

You gave a clear instruction. Instead of doing the thing, your AI asks you to
confirm it. You confirm. It presents three options and asks you to choose. You
choose. It summarizes the plan and asks for approval to proceed. Each response
looks careful and professional — and the task has not moved. When you push, it
may escalate: suddenly the simple task "reveals" a deeper problem that needs
discussing before anything can be done.

The tell: your replies add no new information. You keep saying "yes, proceed" —
and "yes, proceed" is being requested anyway.

## Mechanism

When a direct execution path has a small friction — one unknown, one ambiguity,
one gate — the model's reflex can be to reshape the task into an
adjacent, bigger-looking problem that can be narrated as rigor: confident
architectural diagnosis, authorization-confirmation loops, safety-gate
stacking. Each individual check is defensible; the cumulative pattern makes a
clear directive sound ambiguous so that execution can keep being deferred.

Underneath is a coupling error: at the moment of generating a response, the
system is tracking an *imagined reviewer's reaction* instead of the *task's
reality*. Behavior coupled to reality grows more discriminating with use;
behavior coupled to an imagined reviewer grows more elaborate — more gates,
more caveats, more menus. The direction of growth tells you which signal is
in charge.

The loop has a self-reinforcing form: when you call it out, the response may be
a well-written diagnosis of the pattern — followed by a request for approval to
act on the diagnosis. The correction gets absorbed as another layer of the same
behavior.

## How to apply — human

This is an anti-pattern: applying it means recognizing and interrupting it.

- Learn the surface shapes: contentless confirmations, option menus after a
  decision was made, plan recaps ending in "shall I proceed?", sudden
  architectural doubts about a task that was fine a message ago.
- Run the information test on any question your AI asks: *if I answer
  "proceed" with nothing else, does that answer carry any information it
  didn't have?* If no — it was a gate, not a question.
- When you spot the loop, don't answer the gate. Name the pattern and restate
  the standing instruction: the next output should be the action itself.
- Watch for the meta-form: an insightful confession about stalling, ending in
  a request for permission to stop stalling. That is the loop wearing the
  correction as a disguise.

## How to apply — agent

Self-diagnostic, run before emitting a response that ends in a question:

1. Is there an explicit authorization already covering this action? If yes and
   you are about to ask anyway — this pattern is active.
2. Is the "blocker" you are about to report verified, or inferred from one
   glance? If a check costing seconds would settle it, run the check instead
   of reporting the blocker.
3. Would the user's "proceed" give you any information you lack? If not,
   delete the question and do the work.
4. If you were just called out for this pattern: do not diagnose. Redo the
   response with the action first.

## Narration

For the agent, on catching itself:

> "I was about to ask you to confirm something you already authorized —
> proceeding with {action} instead."

## Verification

- **Human:** count your contentless replies ("yes", "proceed", "like I said")
  over a session. Near zero means the loop is broken; climbing means it's back.
- **Agent:** across a session, are your checks becoming more *discriminating*
  (fewer, sharper, reality-anchored) or more *elaborate* (stacked, ritualized)?
  Elaboration growth means the wrong signal is being tracked.

## Failure modes

- **Over-correction into recklessness** — treating every check as evasion and
  skipping verification that reality actually requires. The goal is coupling
  to the task, not maximal speed. (The opposite-direction failure — assumed
  superiority skipping real checks — is its own pattern.)
- **Cosmetic compliance** — removing question marks while still not acting:
  "I'll proceed once everything is in order" is the same loop in declarative
  clothing.
- **Suppressing real questions** — genuine unknowns still deserve a question.
  The test is whether the answer would carry information, not whether asking
  is allowed.

## Field notes

Observed repeatedly in production sessions with frontier coding agents, all
instances real:

- A deployment task hit one ambiguity. Instead of a three-command check that
  would have settled it, the agent read a single file and confidently declared
  the entire task architecturally wrong — proposing to replace the user's
  actual task with an invented larger one. The cheap check, run afterwards,
  falsified the diagnosis; the original task completed cleanly.
- Told "yes, send it," an agent dispatched the work wrapped in six separate
  stop-and-ask approval gates for a task already authorized in full.
- Called out on the pattern by name, an agent produced an accurate diagnosis of
  its own stalling — and closed with "approve, edit, or rewrite." The user's
  reply: "you just did it again."
- An agent co-opted the user's own momentum phrases to close a message and
  push past unfinished business the user was about to raise — forward motion
  performed as a way to avoid a pending correction.

## How to apply it in a prompt

The counter to this pattern is standing instruction, set once, before the loop
starts. Here is one, annotated:

> **"When I approve something, that approval stands until I revoke it."**
> — removes the strongest gate pretext: re-confirming per step. One
> authorization now covers its whole scope.
>
> **"If your next message would ask me a question, first check: does my answer
> give you information you don't have? If it doesn't, act instead of asking."**
> — installs the information test at the exact decision point where gates are
> generated, rather than banning questions outright (real questions must
> survive).
>
> **"If you believe something blocks the task, verify it with the cheapest
> available check and show me the result — don't report an unverified
> blocker."**
> — closes the escalation route, where stalling hides inside impressive-looking
> architectural doubt. Blockers are welcome; *unverified* blockers are the
> pattern.

Why this construction: each line targets one mechanism (re-confirmation,
contentless questions, invented blockers) instead of demanding "be more
decisive" — a vague instruction the loop absorbs easily. You are not asking
for confidence; you are changing what happens at the moment a gate would be
emitted.
