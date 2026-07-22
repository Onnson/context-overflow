---
id: recentering
name: Recentering Pause
type: protocol
category: lost-the-thread
problem: "My AI forgets everything between sessions"
scent: "mid-session the answers go adjacent to what you asked, and every correction drifts again a few turns later"
intent_signals:
  - the AI's answers drift off-topic mid-session
  - responses reference the wrong task or mix up two workstreams
  - quality degrading inside a session, not between sessions
  - "it feels like it lost the plot"
related:
  sibling_of: [checkpoint-and-resume]
evidence: real-use
sources: []
inheritable: true
---

## Problem

Mid-session, without a break in the conversation, the AI starts drifting.
Answers get tangential; it conflates the current task with an earlier one;
it responds to something adjacent to what you asked. Nothing was forgotten
between sessions — the thread is fraying *inside* one. Pushing forward
("no, I meant—") produces corrections that drift again a few turns later.

## Mechanism

Long sessions accumulate momentum: piles of intermediate reasoning, dead
ends, and half-relevant tangents all sit in context with equal claim on
attention. Past a point, the recent noise outweighs the original signal, and
each new answer is steered more by the accumulated middle than by the actual
objective.

Continuing to push adds to the pile. A recentering pause does the opposite:
stop task output entirely, return to the objective, and rebuild the working
frame from anchors — the original goal, the standing decisions, the current
subtask — rather than from the drift. Then verify the frame *before*
resuming: the AI restates its understanding, the human confirms or corrects.
The restatement is the mechanism, not a courtesy — drift survives silent
resets, and it does not survive having to say the frame out loud against the
human's check.

## How to apply — human

- Call it early. The tells: tangential answers, workstream mixing, replies
  to a question adjacent to yours. Two of those in a row is the signal.
- Stop the task explicitly — "pause, recenter" — rather than issuing another
  correction into the drift. Corrections mid-drift become part of the pile.
- Ask for a restatement, not an apology: "tell me what we're doing, what's
  decided, and what the current step is."
- Correct the restatement precisely if it's off, then release the task:
  "yes — continue from {step}."

## How to apply — agent

On "recenter" — or on noticing your own drift (you referenced the wrong
task, the human corrected your framing twice in a row):

1. Stop producing task output. No fixing-while-drifting.
2. Rebuild the frame from anchors, in order: the stated objective → standing
   decisions and constraints → the current subtask. Use the project's
   persistent context or checkpoints if they exist; the conversation's
   middle is what you're recovering *from*, so weight its recent noise low.
3. Output the rebuilt frame in three lines: objective, decisions in force,
   current step.
4. Wait for confirmation or correction. Resume only from the confirmed
   frame.

## Narration

> "Recentering — dropping the tangent. My frame: objective {objective},
> holding {decisions}, current step {step}. Correct before I continue?"

## Verification

- **Human:** the restated frame matches your understanding — and the next
  several responses stay on-axis without further correction. A recenter that
  needs another recenter within minutes was a restatement ritual, not a
  rebuild.
- **Agent:** your restatement was built from objective and decisions, not
  from your last few outputs. Test: would the frame read the same if the
  last twenty minutes of tangent hadn't happened? It should.

## Failure modes

- **Recentering as apology theater** — "you're right, let me refocus!"
  followed by output steered by the same drift. The three-line frame with
  human confirmation exists precisely to prevent the ritual version.
- **Rebuilding from the drift** — restating the frame by summarizing recent
  messages reconstructs the tangent, politely. Anchors first; recent context
  is the suspect, not the witness.
- **Over-calling it** — recentering on every small correction turns a
  recovery tool into constant ceremony. One wrong answer is a correction;
  sustained off-axis behavior is a recenter.
- **Skipping the confirmation** — an unverified frame can be confidently
  wrong, and now it's the new anchor. The human check is the cheap step that
  makes the expensive drift-loop stop.

## Field notes

Practiced in production sessions with frontier agents under a session
protocol where the human could call a full stop and the agent would pause
task inference, recenter on session context, and return with a restatement
of its task understanding for approval before proceeding. In observed use,
the restatement step caught real frame errors — an agent that believed it
was optimizing a component the human had already descoped, another that had
merged two parallel workstreams into one imaginary task. The pattern of
failed recenterings was consistent: every one that skipped the
confirm-before-resume step drifted again within a few exchanges.

## How to apply it in a prompt

Installing the protocol, annotated:

> **"If I say 'recenter': stop the task completely. Rebuild your
> understanding from the original goal and our standing decisions — not from
> the last few messages. Then give me three lines: objective, decisions in
> force, current step. Don't continue until I confirm."**
> — "stop completely" closes the fixing-while-drifting path. "Not from the
> last few messages" aims the rebuild at anchors instead of the drift — the
> single most load-bearing clause, because summarizing recency is the
> default and it reconstructs the problem. The three-line format keeps the
> restatement checkable at a glance; the confirmation gate makes the rebuilt
> frame verified state rather than another guess.
>
> **"You can also call it on yourself: if you notice you've referenced the
> wrong task or I've corrected your framing twice, recenter without waiting
> for me."**
> — hands the trigger to the AI's own drift-tells, so recovery can start
> before you notice the problem. The two named tells matter: an instruction
> to "notice when you're drifting" is unactionable; "I referenced the wrong
> task" is a checkable event.

Why this construction: drift is a state, not a mistake — you can't correct
it with content, only with a frame rebuild. The prompt therefore separates
stopping, rebuilding (with source explicitly constrained), and verifying,
because collapsing them is how recentering degrades into an apology
followed by more drift.
