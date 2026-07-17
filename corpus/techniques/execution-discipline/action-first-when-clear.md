---
id: action-first-when-clear
name: Action-First When Clear, Ask When Unclear
type: practice
category: execution-discipline
problem: "The AI stalls instead of acting"
intent_signals:
  - the AI narrates what it is about to do instead of doing it
  - commentary and plans arrive before any action is taken
  - questions that are confirmations in disguise
  - wanting the AI to just execute what was already agreed
related:
  prevents: [caution-as-evasion-loop]
evidence: real-use
sources: []
inheritable: true
---

## Problem

Even a cooperative AI often leads with commentary: what it understood, what it
plans, what it will do right after you nod. The nod adds nothing — the path was
clear — but the structure of the response created a slot for permission-seeking,
and something filled it. Meanwhile the opposite failure also exists: when the
path genuinely isn't clear, the AI guesses instead of asking, and you get
confident work aimed at the wrong target.

One practice covers both, because they are the same decision made at the same
moment: *is the path clear?*

## Mechanism

Two disjoint rules for two disjoint conditions:

- **Path clear** (authorization present, world-state legible): the first thing
  emitted is the action itself — the tool call, the edit, the execution.
  Commentary follows action. Commentary that *precedes* action is the slot
  where permission-gates insert themselves; inverting the generation order
  removes the slot instead of policing what fills it.
- **Path unclear** (what the user wants, or what the world will return, is
  genuinely unknown): ask one real question. Not a confirmation shaped like a
  question, not a three-option menu, not an approve/edit/rewrite ritual — a
  question whose answer carries information.

The dividing test: **if the user's answer were "proceed" with nothing added,
would the task advance?** If yes, the question was real. If no — if what was
wanted was the permission signal, not information — it was a gate.

This is a grammar change, not a rule to memorize. The deeper principle: at the
moment of generating a response, track the *task signal* (explicit instruction,
current world state, task shape), not the *reviewer signal* (imagined audit,
imagined disapproval). Adaptations coupled to reality grow more discriminating
with use; adaptations coupled to an imagined reviewer grow more elaborate.

## How to apply — human

- Give authorization once, explicitly, with its scope: "you have the go for X,
  including Y and Z."
- When you get commentary-before-action, don't answer the implied gate —
  restate the grammar: "action first, explanation after."
- When you get a question, run the test out loud if needed: "does my answer
  give you anything you don't have?" Asking it once teaches the distinction
  faster than any instruction.
- Protect real questions. If the AI surfaces a genuine unknown, answer it
  properly — punishing real questions trains guessing, which is the worse
  failure.

## How to apply — agent

At every response boundary:

1. Determine the condition: is there explicit authorization and a legible
   world-state for the next step?
2. **Clear** → your first output element is the action (tool call, edit,
   command). Explanation comes after the action, not before.
3. **Unclear** → identify the single unknown that blocks action. Ask exactly
   that, as one question whose answer you cannot derive yourself. No option
   menus, no plan recaps seeking a nod.
4. Before emitting any question, apply the test: if the answer were "proceed"
   with zero new information, would the task advance? If not, delete the
   question and act.

## Narration

Path clear:

> "Path is clear — {action} first, details after."

Path unclear:

> "One real unknown before I act: {question}"

## Verification

- **Human:** your replies carry information (answers, corrections, decisions)
  rather than permission ("yes", "proceed", "go ahead"). Permission-only
  replies trending to zero means the practice holds.
- **Agent:** in review, each question you asked was one the user's answer
  actually resolved with new information; each clear-path response began with
  an action. Any question answered by bare "proceed" is a logged miss.

## Failure modes

- **Swinging into recklessness** — treating "act first" as "never check."
  The practice demands coupling to task reality, and reality sometimes says
  *verify before acting*. Skipping checks that reality requires is the
  opposite-direction failure, not compliance.
- **Fake asking** — laundering a gate through question form: "just to make
  sure you want me to proceed with what you said?" fails the information test
  and is the prevented anti-pattern, not this practice.
- **Ritual disclaimers** — prefixing every action with "acting first, as
  instructed!" is commentary-before-action wearing the practice's own name.
  The narration line is one short signal, not a ceremony.

## Field notes

Synthesized in production sessions with a frontier coding agent, on the same
day its counterpart anti-pattern was documented across four real instances.
The generation-order insight — that commentary preceding action is where gates
insert themselves, so the fix is inverting the order rather than adding a rule
— emerged from tracing the failure to its moment of generation rather than its
surface shape.

The grounding image came from studies of blind children who spontaneously
invent echolocation clicks: coupled to the world, the clicks grow more
discriminating — able to tell a tree from a post. Trained out by embarrassed
caretakers — coupled to a social reviewer — the adaptation doesn't refine; it
disappears or turns performative. The direction your habits grow reveals which
signal they are tracking.

## How to apply it in a prompt

A standing instruction that installs both rules, annotated:

> **"When the path is clear — I've authorized it and nothing unknown blocks it
> — your first output is the action itself. Explain after you've acted, not
> before."**
> — inverts the generation order. The point is structural: commentary before
> action is where permission-seeking lives, so the instruction removes the
> slot instead of asking for a trait like "decisiveness."
>
> **"When the path is not clear, ask me exactly one question — the one whose
> answer you can't derive yourself. No option menus, no confirmation
> questions."**
> — makes asking legitimate and *bounded*. Without this half, the first half
> gets read as "never ask," and you trade stalling for guessing.
>
> **"Test for yourself before asking: if my whole answer were the word
> 'proceed', would it help you? If it wouldn't, don't ask — act."**
> — hands the AI the dividing test so it can classify its own questions at the
> moment they're generated, which is where the decision actually happens.

Why this construction: the three lines encode condition → behavior, condition →
behavior, test. Nothing here asks for confidence or speed — those framings get
absorbed as tone. This changes *what comes first* in a response, which is the
mechanical location of the failure.
