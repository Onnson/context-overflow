---
id: persistent-context-files
name: Persistent Context as Files
type: protocol
category: lost-the-thread
problem: "My AI forgets everything between sessions"
scent: "every session starts with re-explaining the project, or it proposes the thing you ruled out last month"
intent_signals:
  - re-explaining the project at the start of every session
  - the AI confidently redoing work that was already done
  - decisions getting relitigated because nobody remembers deciding them
  - wanting an AI that "picks up where we left off"
related:
  sibling_of: [session-handoff, checkpoint-and-resume]
evidence: both
sources:
  - "Norman, D. (2013). The Design of Everyday Things. Basic Books — ch. 3, knowledge in the head vs. knowledge in the world."
inheritable: true
---

## Problem

Every new session starts from zero. You spend the first ten minutes
re-explaining what the project is, what was decided last week, and why the
obvious-looking approach was already tried and rejected. Sometimes you skip
the re-explaining — and pay for it when the AI cheerfully proposes the thing
you ruled out a month ago, or "fixes" something that was deliberate.

The thread of the work lives only in your head and in scrollback you'll never
reread.

## Mechanism

An AI session has no memory of previous sessions. Anything not written down is
gone when the window closes — and anything written only in chat history is
effectively gone too, because history is unstructured and nobody reads it back.

The fix borrows a principle from design psychology: knowledge doesn't have to
live in the head to be usable — it can live in the world. A small set of
structured files in the project itself becomes the AI's long-term memory:
what the project is for, what has been decided, what's in progress, what
failed and why. The AI reads them at session start and writes to them as
things change. Memory stops being a property of the session and becomes a
property of the project.

The structure matters more than the volume. A handful of small files with
known jobs ("decisions live here, progress lives here") beats one growing
NOTES.md, because both sides always know where to read and where to write.

## How to apply — human

- Create a `context/` (or similar) directory in the project with a few small
  files split by job — for example: intent (why the project exists), decisions
  (what was chosen and why), progress (works / in progress / not started),
  and log (dated gotchas and lessons).
- Open sessions by pointing the AI at the directory: "read the context files
  before doing anything."
- End sessions by having the AI update them: "update the context files with
  what changed." Review the diff — the files are yours, not the AI's.
- Record *why* alongside *what*. "Chose X" without the reason will get
  relitigated; "Chose X because Y failed under Z" stays settled.

## How to apply — agent

1. At session start, before any task work: look for the project's context
   files and read all of them. If they don't exist, propose creating them
   before proceeding on multi-session work.
2. Treat their contents as established fact senior to your assumptions. If
   the code contradicts the files, surface the conflict — don't silently pick
   one.
3. When a decision is made, a task completes, or an approach fails, update
   the relevant file in the same session — not "at the end," which never
   comes.
4. Write facts, dated, with reasons. Never record speculation as state.

## Narration

At session start:

> "Read the project context files — resuming from {last recorded state}."

On update:

> "Recording {decision/result} to {file} so the next session starts from it."

## Verification

- **Human:** the first ten minutes of a new session produce work, not
  re-explanation. If you're still re-briefing every time, the files aren't
  carrying the load.
- **Agent:** a session that starts from the files alone can state the project's
  goal, last state, and standing decisions without asking — and never proposes
  something the decisions file already rules out.

## Failure modes

- **The files become a dumping ground** — appending everything turns memory
  into noise nobody reads. Files have jobs; the log grows, the others get
  *updated*, not appended to.
- **Write-only memory** — updating files religiously but never reading them
  at session start. The read is the half that produces the benefit.
- **Stale state as fact** — files record what was true when written. Recorded
  claims about a changing world (versions, endpoints, what's deployed) need
  re-verification before being acted on.
- **Secrets and private context leak into files** — session memory tends to
  contain things that don't belong in a repository. Keep persistent context
  files out of anything public.

## Field notes

Observed across months of production sessions with frontier coding agents:
projects using a structured persistent-context directory could survive full
memory resets — a fresh session read five small files and continued
mid-implementation without re-briefing. The failure modes were observed too:
one project's log file grew until sessions stopped reading it, and a stale
"current state" note caused an agent to rebuild something that had shipped
weeks earlier. The design-psychology grounding — that precise behavior can
come from knowledge in the world rather than in the head — is Norman's
(cited above).

## How to apply it in a prompt

A session-start instruction, annotated:

> **"Before doing anything else, read every file under `context/`. Treat what
> they say as decisions already made — if you think one is wrong, say so, but
> don't silently override it."**
> — makes the read mandatory and ordered ("before doing anything else"), and
> sets the authority relationship: files outrank the AI's fresh guesses, while
> still leaving a lane for disagreement. Without that clause, the AI will
> quietly re-decide things.
>
> **"When we decide something, finish something, or hit a dead end this
> session, update the matching context file right then. Show me each update
> as a diff."**
> — binds writes to the moment things change ("right then"), because
> end-of-session batch updates get skipped. The diff clause keeps you the
> owner of your project's memory instead of a bystander to it.

Why this construction: the two instructions install the two halves of the
loop — read at start, write at change — as concrete behaviors tied to
concrete moments. Asking an AI to "remember things better" does nothing;
giving memory a location and a schedule does.
