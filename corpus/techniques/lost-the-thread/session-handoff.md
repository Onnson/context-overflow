---
id: session-handoff
name: Session Handoff Package
type: protocol
category: lost-the-thread
problem: "My AI forgets everything between sessions"
scent: "the next session has the files but no idea what was half-finished or what came next"
intent_signals:
  - a session is ending mid-task and the next one needs to continue
  - handing work from one AI or chat to another
  - "continue where the last conversation stopped"
  - context window running out before the work is done
related:
  sibling_of: [persistent-context-files, checkpoint-and-resume]
evidence: real-use
sources: []
inheritable: true
---

## Problem

The session is ending — the window is full, the day is over, or the task is
moving to a different tool — and the work isn't done. Next session, you watch
the new instance struggle: it has the files, but not the *situation*. It
doesn't know what was just tried, what the half-finished change was for, or
that you were two steps into a five-step plan. It either asks you to
reconstruct everything or, worse, doesn't ask.

## Mechanism

Continuation needs more than project memory — it needs the working state:
where exactly the work stopped, what is mid-flight, what the immediate next
step was, and what constraints were active. That state is precisely the part
that never gets written down, because at the end of a session it feels
obvious.

A handoff package is a short, structured note written *by the outgoing
session, for the incoming one*, treating the successor as a competent stranger:
everything needed to continue, nothing that can be re-derived from the
project itself. The discipline is in the addressing — writing to a reader who
was not there forces out the context that "everyone knows."

## How to apply — human

- Before ending a mid-task session, ask for a handoff: "write a handoff note
  for the next session: state, in-flight work, next step, open questions,
  active constraints."
- Read it. If it says "continue the refactor" without saying which files are
  half-changed, it failed the stranger test — push back once: "would someone
  who wasn't here be able to continue from this?"
- Store it where the next session will actually look (with the project's
  persistent context files, if you keep them).
- Start the next session by feeding it the package and asking for a one-line
  restatement of the situation before any work — a cheap check that the
  handoff landed.

## How to apply — agent

When a session is ending with work in flight, produce a handoff with exactly
these parts:

1. **State:** what is done and verified, in one or two lines.
2. **In-flight:** what is started but unfinished, file by file — including
   changes made but not yet tested.
3. **Next step:** the single concrete action the successor should take first.
4. **Open questions:** anything awaiting the human's answer, verbatim.
5. **Active constraints:** standing instructions from this session that the
   successor cannot see ("don't touch X", "the user prefers Y").

Write for a reader with zero shared context. Exclude anything recoverable
from the repository itself. On the receiving side: read the package first,
restate the situation in one line, then execute the named next step — don't
re-plan from scratch.

## Narration

Outgoing:

> "Work is mid-flight — writing a handoff package: state, in-flight changes,
> next step, open questions, constraints."

Incoming:

> "Picking up from the handoff: {one-line situation}. First action: {next step}."

## Verification

- **Human:** the next session's first response shows correct situational
  awareness without you re-explaining — and its first action is the handoff's
  named next step, not a re-plan.
- **Agent:** the stranger test — every statement in the package is either
  self-contained or points at a file that exists. If continuing requires
  asking the human something the outgoing session knew, the handoff missed it.

## Failure modes

- **The memoir** — a long narrative of everything that happened. The successor
  needs the situation, not the story; length hides the next step.
- **"Everyone knows" leakage** — referring to "the fix we discussed" or "the
  usual approach." The reader was not there. Names, paths, and verbatim
  instructions only.
- **Handoff as a substitute for finishing** — cutting work at an arbitrary
  point because a handoff exists. Stop at a coherent boundary when possible;
  a handoff mid-thought is still a broken thought.
- **Receiving side re-planning** — an incoming session that treats the
  package as background and starts fresh anyway wastes exactly the state the
  package preserved. The named next step is the contract.

## Field notes

Synthesized from production sessions with frontier coding agents where long
tasks routinely outlived context windows. The recurring miss was never the
completed work — repositories carry that — but in-flight changes and active
constraints: a successor session once reverted a deliberate half-migration
because "half the files were inconsistent," and another re-asked three
questions the human had already answered. Packages that survived were the
ones written to the competent-stranger standard; packages that failed
referred to the outgoing session's own conversation ("as discussed above")
— a reference the incoming session, by definition, could not resolve.

## How to apply it in a prompt

The end-of-session request, annotated:

> **"Before we stop: write a handoff note for the next session, structured as —
> state (done and verified), in-flight (unfinished, file by file), next step
> (one concrete action), open questions (verbatim), constraints (standing
> instructions I gave you)."**
> — naming the five parts turns "summarize the session" into a checklist the
> AI can't satisfy with a narrative. "File by file" and "one concrete action"
> pin the two parts that vague handoffs always drop.
>
> **"Write it for a competent reader who has the repo but was not in this
> conversation. If a sentence needs this conversation to make sense, rewrite
> it."**
> — the stranger standard, stated as a test the AI can run on its own output.
> This is the line that stops "continue the fix we discussed."

Why this construction: a handoff fails through omission, and omission is
invisible to the writer. Both instructions work by making the omissions
checkable — a fixed structure so gaps show as empty slots, and a reader
standard so shared-context references become visible errors.
