---
id: clean-context-ab
name: Clean-Context A/B
type: practice
category: dumber-after-the-update
problem: "My AI got worse after an update"
intent_signals:
  - '"it got dumber overnight" right after a version bump'
  - a prompt that worked for months suddenly failing
  - asking to roll back to the previous model version
  - regression reports coming from a weeks-old session
  - instructions file that has only ever grown, never been audited
  - every model update coinciding with a new complaint
related:
  sibling_of: [personal-golden-set, recentering]
evidence: real-use
sources: []
inheritable: true
---

## Problem

The update lands, and within a day your agent feels worse. It misreads a
task it used to handle, ignores an instruction it used to follow, produces
something clumsy where it used to be sharp. The timing seems damning: it
worked before the version bump, it fails after. You start drafting the
rollback request or the "new model is worse" post. But there's a second
suspect standing right next to the model, and it never gets questioned:
everything you've accumulated around the model. The session that's been
running for days. The instructions file that has tripled since you wrote it.
The stacked directives from different months that quietly contradict each
other. The update is the only change with a timestamp, so it absorbs the
blame for every change without one.

## Mechanism

This is an attribution error with a specific shape. Context degrades
gradually — sessions bloat, instruction files accrete, old directives
collide with new ones — but gradual degradation doesn't trigger suspicion.
An update does. So the visible, dated event gets charged with the invisible,
undated crime, and you end up debugging the wrong component: filing model
regressions when the model is fine, or trimming instructions when the model
actually changed.

The fix is ordinary experimental control: vary one factor. Hold the task
constant and zero out the accumulated context — fresh session, minimal
instructions, the same ask made self-contained. Two outcomes, and each has
its own next action:

- **Fails clean too** → the accumulation is cleared; the model is the live
  suspect. Now characterize the change properly — run your golden set of
  known-good tasks and see what else moved.
- **Works clean** → the model is cleared for this task; your context is the
  problem. That's not a regression, it's a lost-the-thread job: find the
  bloat or the contradiction, trim it, restart.

The value isn't just the verdict — it's that the A/B converts an
unfalsifiable feeling ("it's dumber") into a one-experiment diagnosis with
a named follow-up either way.

## How to apply — human

1. Pick one concrete failing task, not a vibe. "It feels worse" isn't
   testable; "it now proposes the wrong migration for this schema" is.
2. Build the clean arm honestly: a fresh session, standing instructions
   off or moved aside (global and project-level both), and the same ask
   written so it's self-contained — everything the task needs, in the
   prompt, with no references to prior conversation.
3. Run both arms. If outputs vary run-to-run, run each arm more than once
   before trusting a verdict.
4. Act on the result. Fails clean: stop trimming instructions and run your
   golden set to map the model change. Works clean: stop blaming the
   update and go find what rotted — the contradiction, the stale
   directive, the session that should have ended last week.
5. Don't stop at the verdict. An A/B without the follow-up is just a
   better-documented complaint.

## How to apply — agent

When your human says you've gotten worse since an update:

1. Don't defend the model and don't agree by reflex. Propose the A/B and
   name both suspects.
2. Reconstruct the failing task as a self-contained prompt: inline every
   fact it currently gets from session state or standing files, so the
   clean run needs none of them.
3. Enumerate the standing instructions currently in force that plausibly
   touch this task. Flag any pair that pulls in different directions —
   contradictions are a common form of rot.
4. You can't open the fresh session yourself. Hand your human the clean
   prompt plus the checklist of what to disable, so the clean arm is
   actually clean.
5. When the result comes back, state which suspect it clears and the
   matching next step: golden set if it failed clean, context cleanup if
   it worked clean.

## Narration

> "Before we charge the update: here's {task} as a self-contained prompt —
> run it in a fresh session with standing instructions off and we compare."

> "It {failed/worked} clean too, so the suspect is {the model — golden set
> next / our accumulated context — cleanup next}."

## Verification

- **Human:** the experiment ends in one of the two named follow-ups, and
  the follow-up resolves the original complaint — either the cleanup
  restores the behavior, or the golden set documents a real change you can
  act on. Longer term, track one thing: whether "it got dumber" recurs
  after every update. If the clean arm keeps coming back green, the
  updates were never the cause, and that's worth knowing about yourself.
- **Agent:** audit the clean arm for leakage before trusting it. Did the
  "fresh" run still load a global instructions file, project memory, or a
  reference to earlier conversation? A confounded clean arm produces a
  confident verdict in the wrong direction, which is worse than no
  experiment.

## Failure modes

- **Dirty clean arm** — the fresh session silently loads the same global
  instructions file that's under suspicion. The arms don't differ where
  you think they do, and the model gets convicted or acquitted on
  contaminated evidence.
- **Task drift between arms** — the ask gets rephrased while being made
  self-contained, so the arms differ in two ways. The clean prompt must
  change the context, not the task.
- **One-sample verdicts** — model output varies run to run. A single pass
  or fail in each arm settles nothing borderline; repeat before ruling.
- **Acquittal creep** — "works clean" clears the model for this task only,
  not for the whole update; "fails clean" convicts it for this task only —
  the clean prompt itself could still be the problem. Keep verdicts scoped
  to what was tested.
- **Cleanup by arson** — the works-clean verdict prompts deleting the
  entire accumulated setup instead of locating the rotten part. Some of
  that accumulation is earned calibration; the job is finding the
  contradiction, not burning the file.

## Field notes

Observed in production sessions with frontier coding agents. The recurring
shape: a post-update regression report where the failing task passed
immediately in a clean session; the trace led to an instructions file that
had grown for months by pure accretion, including two directives in direct
contradiction — the degradation predated the update but was only noticed
after it, because the update supplied a suspect. The opposite case also
occurred: a task that failed clean as well, where repeated clean runs
confirmed a genuine behavior change, and the self-contained repro became
the substance of a usable regression report instead of a complaint. The
consistent signature across instances: the visible change absorbed the
blame for the invisible one. Nobody suspects a file they only ever append
to.

## How to apply it in a prompt

The message that starts the experiment, annotated:

> **"You've been getting {task} wrong, and it started around the update.
> Before we blame the model: write the smallest fully self-contained
> version of this task — everything it needs inside one prompt, no
> references to this session or our standing files — so I can run it
> fresh."**
> — the agent builds the clean arm because the agent is the one who knows
> what the task silently depends on. A human-written "clean" prompt tends
> to leave out context the task actually needs, which makes the clean arm
> fail for the wrong reason and convict the model falsely.
>
> **"Then list every standing instruction currently active that could
> touch this task, and point out any two that pull in different
> directions."**
> — puts the second suspect in the lineup explicitly. Accumulated
> instructions are invisible precisely because they're always loaded;
> forcing an enumeration is often diagnostic by itself — contradiction
> pairs surface before the experiment even runs.
>
> **"I'll run the clean prompt in a fresh session with instructions off.
> If it fails there too, we run the golden set next. If it works, we're
> doing a context cleanup — not filing a regression."**
> — pre-commits each outcome to an action. This is the load-bearing part:
> without it, a works-clean result gets rationalized away ("it was
> probably a fluke") and the complaint survives its own acquittal. Naming
> the follow-ups in advance makes the verdict binding.

Why this construction: the failure lives in attribution, and attribution
errors don't yield to "are you sure it's the model?" — that question just
invites a more confident yes. The prompt works structurally instead: it
manufactures the missing control condition, drags the unexamined suspect
into view, and binds both possible verdicts to their next step before the
result is known, so neither side of the experiment can be argued with
after the fact.
