---
id: context-compression
name: Deliberate Context Compression
type: protocol
category: lost-the-thread
problem: "My AI forgets everything between sessions"
intent_signals:
  - the conversation is too long to continue but the work isn't done
  - important early context getting pushed out by recent noise
  - "summarize where we are so we can keep going"
  - carrying a project across the context window limit
related:
  sibling_of: [session-handoff]
evidence: real-use
sources: []
inheritable: true
---

## Problem

The conversation has grown past what the AI can hold well. Answers start
missing things that were established earlier; the AI re-asks settled
questions. You ask for a summary to continue in a fresh session — and get a
smooth narrative that reads well but, when you resume from it, turns out to
have silently dropped the two constraints that mattered and kept three
paragraphs of pleasantries.

Compression happened; you just didn't control what survived.

## Mechanism

When context must shrink — end of window, start of a new session, handing
work between tools — *something* decides what survives. Left implicit, that
decision favors recency and narrative smoothness over importance. Deliberate
compression replaces the implicit decision with an explicit priority order,
set before compressing:

1. **Critical, verbatim:** decisions with their reasons, standing
   constraints, exact values (names, paths, versions, numbers). These are
   the things paraphrase corrupts.
2. **Important, condensed:** current work state, open questions, what failed
   and why.
3. **Droppable, dropped:** exploration that led nowhere, resolved
   back-and-forth, pleasantries, superseded plans.

The inversion is the point: instead of asking "what's a good summary?", ask
"what must survive verbatim, what survives condensed, what dies?" A summary
optimizes for reading; a compression optimizes for *resuming*.

## How to apply — human

- Trigger compression before quality degrades, not after — when you notice
  re-asking or missed constraints, it's already late.
- Ask for compression by priority class, not "a summary" — the word
  "summary" invites narrative; the classes invite triage.
- Audit the critical tier: are your standing constraints there, word for
  word? Are exact values exact? Thirty seconds of checking protects the
  whole next session.
- Resume by feeding the compression and asking one probe question about a
  critical item before real work.

## How to apply — agent

When context must shrink, or the human asks:

1. Triage everything established this session into the three classes.
   Decisions, constraints, and exact values go to class 1 *verbatim* —
   never paraphrased.
2. Condense class 2 to state, not story: what is true now, not how it came
   to be true.
3. Drop class 3 and *say what was dropped* in one line ("dropped: two
   abandoned approaches, resolved discussion of X") — silent dropping is how
   compressions lie.
4. Output the compression under its classes, sized so the critical tier
   dominates.

## Narration

> "Compressing context: {n} critical items kept verbatim, work state
> condensed, dropped {summary of dropped}."

## Verification

- **Human:** resume from the compression alone and probe one constraint and
  one exact value. Verbatim survival = pass. A paraphrase of a constraint is
  a fail — paraphrase is where meaning shifts.
- **Agent:** every decision in the compression carries its reason; every
  dropped category is named. If the compression reads like an essay, it's a
  summary wearing the wrong name.

## Failure modes

- **Narrative gravity** — the compression turns into "the story so far,"
  smooth and lossy. Structure by class, never by chronology.
- **Paraphrased constraints** — "user prefers minimal changes" where the
  instruction was "never touch the auth module." The verbatim rule exists
  because constraints compress into vagueness first.
- **Hoarding** — classifying everything as critical, producing a compression
  nearly as long as the source. Triage that refuses to drop is not triage.
- **Compressing too late** — running the protocol after quality has
  degraded means the triage itself runs on degraded attention. The items it
  drops include things it already lost.

## Field notes

Observed across production sessions with frontier agents at context-window
boundaries. Uncontrolled end-of-window summaries repeatedly lost standing
constraints — one resumed session violated a "don't touch this directory"
instruction its predecessor had held for hours, because the summary rendered
it as general caution. Class-based compressions held: the verbatim tier
carried constraints and exact values across the boundary intact, and naming
what was dropped caught two cases where the human disagreed with the triage
and pulled an item back up. The three-class structure stabilized after
experiments with priority scoring — scores invited precision theater;
classes invite decisions.

## How to apply it in a prompt

The compression request, annotated:

> **"We need to carry this into a fresh session. Don't summarize — compress:
> class 1, verbatim: every decision with its reason, every standing
> instruction I've given, every exact name/path/number. Class 2, condensed:
> current state, open questions, what failed. Class 3: drop it, but list
> what you dropped in one line."**
> — "don't summarize — compress" breaks the narrative reflex before it
> starts. The class definitions do the real work: verbatim-vs-condensed-vs-
> dropped is a decision the AI can execute, where "keep the important stuff"
> is not. The dropped-list clause makes the invisible half of compression
> (what's gone) visible and auditable.
>
> **"I'll check class 1 before we continue — if a constraint of mine isn't
> there word for word, the compression failed."**
> — announces the audit and its standard. Knowing that verbatim survival of
> constraints is the pass condition changes what the AI protects under
> pressure of length.

Why this construction: compression quality is decided by what the compressor
optimizes for. Both lines aim the optimization — the first replaces "read
well" with explicit survival classes, the second attaches a concrete test to
the tier where silent loss does the most damage.
