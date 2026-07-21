---
id: personal-golden-set
name: Personal Golden Set
type: practice
category: dumber-after-the-update
problem: "My AI got worse after an update"
intent_signals:
  - '"it got dumber after the update"'
  - '"it used to handle this kind of thing fine"'
  - vague sense of quality drop with no specific failing task to point at
  - wanting to roll back or pin an old model without evidence
  - '"is it just me or did the new version get worse"'
  - blaming the model for a session that has been running for hours
related:
  sibling_of: [clean-context-ab]
  derived_from: [declared-success-without-proof]
evidence: real-use
sources: []
inheritable: true
---

## Problem

An update lands — new model version, new tool defaults, a changed system
prompt — and the work starts feeling worse. Sloppier refactors, summaries
that miss the point, a tone you don't remember. But when you try to say
*what* got worse, you can't: no single output is clearly broken, the
feeling is spread across everything. So you're stuck between two bad
moves: ride it out on the suspicion you're imagining things, or pin the
old model on the suspicion you're not. Either way you're arguing with a
feeling, and feelings don't lose arguments — they just cost you either
the improvements you're refusing or the confidence you're bleeding.

## Mechanism

"It got dumber" is unfalsifiable without a baseline, and your memory is
not a baseline. You remember peak outputs, not median ones; recent
frustration outweighs older frustration; and your own tasks drift over
weeks, so today's failures are being compared against different work, not
the same work done better. The claim can't be settled because nothing
fixed is being measured.

A golden set fixes the measurement: five to ten of *your* recurring
tasks with known-good outputs, saved as runnable prompts. After any
change, rerun the set in fresh sessions and compare. Now "worse" is a
diff — these two tasks regressed, these seven held — and the diff routes
the decision: pin, adapt prompts, or accept the trade.

This is the same move as requiring receipts for "done": a claim about
state — here, "the model regressed" — doesn't get accepted on fluency or
feeling; it gets grounded in an executed check. The set also catches the
inverse illusion, which turns out to be common: the session has degraded
— context bloated, early misreadings compounding — while the model is
fine. Rerun the set fresh; if it holds, the suspect is your session, not
the update.

## How to apply — human

- Build the set from your actual work, not from benchmark-style puzzles:
  a refactor it nailed, a summary you verified against the source, a bug
  it genuinely found. Five to ten tasks; each entry is a prompt, the
  known-good output, and one sentence on what makes that output good.
- Make each prompt self-contained — paste the input code or text into
  the prompt itself, so it runs identically in six months regardless of
  what your repo looks like then.
- Rerun on trigger, not on schedule: model update, tool change, system
  prompt edit — and also whenever a long session makes you mutter "it
  got worse," before you blame the model.
- Read the diff per task, not as a mood. Regressions clustered in one
  task type mean adapt or pin *for that class*; a clean set during a bad
  session means restart the session.
- Maintain it: when your work shifts, retire stale tasks and capture new
  known-good outputs. A set that no longer resembles your work measures
  nothing.

## How to apply — agent

When your human reports quality degradation after a change, or asks for
a golden-set run:

1. Locate the saved set. If none exists, offer to build one now from
   recent verified-good work in this conversation or the project history
   — capture prompt, known-good output, and grading criteria per task.
2. Run each task in a fresh context: no accumulated conversation, no
   prior discussion of the tasks in scope. A rerun inside a polluted
   session measures the pollution, not the model.
3. Compare each fresh output to the saved known-good *against its stated
   criteria*, not by string similarity — models legitimately vary in
   surface form.
4. Report per task: held / regressed / changed-but-acceptable, with the
   concrete diff for every regression.
5. Do not issue an overall verdict without the per-task table. If the
   full set holds, say so and name the alternative hypothesis explicitly:
   the degraded thing may be the session or the prompts, not the model.

## Narration

> "Running your golden set against {change}: {n} saved tasks, fresh
> session each, compared to the known-good outputs."

> "Golden set result: {held} held, {regressed} regressed ({which
> tasks}), {changed} changed-but-acceptable — per-task diffs below."

## Verification

- **Human:** you can answer "worse at what, exactly?" with task names
  and diffs instead of a feeling, and your pin/adapt/accept decision
  traces to specific regressions. If you're still saying "it just seems
  dumber," the set isn't being run or isn't covering your real work.
- **Agent:** every regression claim points at a saved baseline and a
  fresh rerun performed in this session — never at remembered quality.
  If you're about to agree that "the model got worse" without a set run,
  that agreement is the unfalsifiable claim wearing your voice.

## Failure modes

- **Stale set** — the tasks no longer represent your work, so the set
  passes while real work degrades. Refresh entries when your work shifts.
- **Teaching to the test** — tuning prompts until the set passes,
  optimizing for ten frozen tasks at the expense of everything else. The
  set is a thermometer, not a target.
- **Exact-match grading** — treating any surface difference from the
  saved output as regression. Grade against each entry's criteria;
  otherwise every rerun "fails" and the signal drowns.
- **Contaminated reruns** — running the set inside a session that
  already discussed the tasks or the suspected regression. Only fresh
  contexts count.
- **Set as dismissal** — "the set passed, so nothing regressed" is too
  strong; the set covers only what it covers. A clean run redirects the
  investigation, it doesn't close it.

## Field notes

Observed across production use with frontier coding agents through
several model and tool updates. Before a saved set existed, every
"it got dumber" episode ended the same way: unresolvable argument,
superstitious model-pinning, or quiet erosion of trust. With a set, the
episodes split into distinguishable cases. In one, reruns showed a real
regression concentrated in a single task class — multi-file refactors —
while summaries and bug-finding held; adapting the prompts for that
class resolved it without abandoning the update. In several others, the
set passed unchanged and the felt degradation traced to long, bloated
sessions; a fresh session restored quality with the model untouched.
The consistent lesson: the same complaint — "worse since the update" —
described opposite underlying situations, and only a fixed baseline
could tell them apart.

## How to apply it in a prompt

Two prompts: one builds the set, one runs it. Annotated.

Building it, once, while things are working:

> **"From our recent work, pick 5-10 tasks I bring you repeatedly where
> the output was verifiably good — a refactor that shipped, a summary I
> checked against the source, a bug you actually found. For each, write
> a fully self-contained prompt (all input code or text pasted inline),
> the known-good output, and one sentence on what makes it good. Save
> the whole set to {file}."**
> — "verifiably good" filters the baseline to outputs that earned their
> place with a receipt, not outputs that merely felt good at the time.
> "Self-contained" is load-bearing: a prompt that references your repo
> measures your repo's drift, not the model's. The one-sentence "what
> makes it good" becomes the grading criteria — without it, future
> comparisons collapse into string matching, which fails on every
> harmless rephrase.

Running it, after any change:

> **"{The model/tool/config} changed. Run each task in {file} in a
> fresh context, compare against its saved output using its criteria,
> and give me a per-task verdict: held / regressed / changed-but-acceptable,
> with the diff for each regression. No overall verdict without the
> table."**
> — "fresh context" kills the contaminated-rerun failure: a run inside
> the current session inherits the current session's rot. The three-way
> verdict matters because a binary pass/fail either hides benign
> variation or drowns you in false regressions. The last sentence
> removes the free summary sentence — "seems fine overall" is exactly
> the ungrounded state claim this practice exists to replace, the same
> way "done" without output is.

Why this construction: the complaint "it got worse" lives where no
measurement exists, and instructions like "tell me honestly if quality
dropped" can't create one — the agent's memory of past quality is no
better than yours. These prompts create the missing instrument first
and then constrain the report to what the instrument actually read.
