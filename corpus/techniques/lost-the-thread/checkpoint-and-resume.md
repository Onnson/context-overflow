---
id: checkpoint-and-resume
name: Named Checkpoints
type: protocol
category: lost-the-thread
problem: "My AI forgets everything between sessions"
intent_signals:
  - wanting to save the state of a conversation before trying something risky
  - long sessions drifting until early decisions get lost
  - "remember this point so we can come back to it"
  - branching an exploration without losing the main line
related:
  sibling_of: [session-handoff, persistent-context-files]
evidence: real-use
sources: []
inheritable: true
---

## Problem

Deep into a productive session, you're about to try something that might
derail it — a risky refactor, a speculative direction, a big context dump.
If it goes wrong, you can't get back: the good state you had an hour ago
exists only as a feeling. Or the session simply runs long, and by the end
the AI's grip on decisions made in the first hour has quietly loosened —
things you settled early start drifting.

Version control gives you this for code. Nothing gives it to you for the
*conversation state* — what's agreed, what's known, where you are.

## Mechanism

A checkpoint is a named snapshot of session state, written down at a moment
you choose: current objective, decisions in force, work state, and what
comes next. Naming it ("CHK-3", "before-the-refactor") makes it addressable
— you can say "go back to before-the-refactor" and mean something precise.

Two effects. First, recovery: a bad excursion ends with a restore instead of
an archaeology dig. Second — less obvious — the act of writing a checkpoint
re-surfaces the session's core state *into the recent conversation*, which
counteracts drift: the AI re-reads what it wrote an hour of tokens ago, and
early decisions regain their weight.

## How to apply — human

- Checkpoint at natural boundaries: after a decision is locked, before a
  risky excursion, before dumping large new context in.
- Give each one a name you'd actually use to refer back.
- Keep checkpoints outside the conversation too (a file), so restoring works
  even in a fresh session — a checkpoint that lives only in the chat dies
  with the chat.
- To restore: name the checkpoint and ask for a restatement of its contents
  before continuing — the restatement is the proof the restore happened.

## How to apply — agent

On "checkpoint" (or when proposing one before a risky step):

1. Write a named snapshot with four parts: **objective** (what we're doing),
   **decisions in force** (settled, with reasons), **work state** (done /
   in-flight), **next step**.
2. Persist it to a file if the project keeps persistent context; otherwise
   emit it clearly in-conversation under its name.
3. Confirm the name back to the human.

On "restore {name}":

1. Read the checkpoint back — aloud, condensed to a few lines.
2. Discard conclusions formed after the checkpoint unless the human says to
   keep them.
3. Continue from the checkpoint's named next step.

## Narration

Creating:

> "Checkpoint '{name}' saved: {objective}, {n} decisions in force, next step
> {step}."

Restoring:

> "Restored '{name}' — resuming from: {one-line state}. Post-checkpoint
> conclusions discarded."

## Verification

- **Human:** after a restore, spot-check one early decision ("what did we
  decide about X?") — the answer should come from the checkpoint, correct and
  immediate. If restoring produces a summary of the *whole session* instead
  of the named point, it didn't restore.
- **Agent:** a checkpoint you wrote passes the fresh-eyes test: a new session
  given only that checkpoint could state objective, decisions, and next step
  without the conversation.

## Failure modes

- **Checkpoint inflation** — snapshotting every few minutes turns the
  protocol into noise and no checkpoint means anything. Boundaries, not
  intervals.
- **Chat-only checkpoints** — a snapshot that lives only in the scrollback
  is lost exactly when you need it most (session death). Persist the ones
  that matter.
- **Restore-in-name-only** — the AI acknowledges the restore but keeps
  reasoning from post-checkpoint state. The discard step is explicit for
  this reason; the restatement is how you catch it.
- **Checkpointing instead of deciding** — saving state to avoid committing
  to a direction. A checkpoint protects a decision; it doesn't substitute
  for one.

## Field notes

Drawn from production practice with frontier agents on long-running
projects, where a checkpoint registry (IDs, dates, descriptions) plus
per-checkpoint state files carried sessions across days and full memory
resets. The drift-correction effect was discovered in use, not designed:
sessions that checkpointed at decision boundaries visibly relitigated less,
because writing the snapshot forced the settled decisions back through the
recent context. The canonical failure was also observed: a rich session
checkpointed only in-conversation, then lost to a crashed window — the
checkpoint's name survived in the human's memory, its contents nowhere.

## How to apply it in a prompt

Setting up the protocol at session start, annotated:

> **"When I say 'checkpoint {name}', write a snapshot with exactly: objective,
> decisions in force (with reasons), work state, next step — and save it to
> `context/checkpoints/{name}.md`."**
> — fixes the trigger word, the four-part structure, and the location. The
> structure matters most: without named parts, checkpoints come back as
> prose summaries, which restore badly.
>
> **"When I say 'restore {name}', read that file, restate it in four lines,
> and drop any conclusion we formed after it unless I keep it explicitly."**
> — makes restore an operation with observable output (the four-line
> restatement) rather than an acknowledgment. The drop clause is the half
> that makes restore real; without it you get "restored!" followed by
> reasoning from the state you were escaping.

Why this construction: checkpoints work when creating and restoring are
*operations* — fixed trigger, fixed shape, fixed location — not favors the
AI interprets freshly each time. The prompt is really a tiny protocol
definition, and the value is that both sides now mean the same thing by the
words.
