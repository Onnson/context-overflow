---
id: rederive-dont-patch
name: Re-Derive, Don't Patch
type: practice
category: dumber-after-the-update
problem: "My AI got worse after an update"
scent: "your long-tuned prompt keeps needing patches, and every patch fixes one symptom while waking another"
intent_signals:
  - '"this prompt worked perfectly before the update"'
  - prompt edits that only ever add rules, never remove them
  - stacked ALL-CAPS prohibitions at the end of a long system prompt
  - '"I told it to stop doing X and now it does Y instead"'
  - fixing one regression in the prompt breaks a different output
  - a system prompt full of clauses nobody remembers the reason for
related:
  sibling_of: [re-read-the-brief]
  contrasts_with: [personal-golden-set]
evidence: real-use
sources: []
inheritable: true
---

## Problem

Your best prompt — the one you tuned over months until it reliably produced
what you wanted — starts misbehaving after a model update. So you patch it:
"ALSO, don't restate the question." Better for a day, then a new failure.
Another patch. The prompt grows, the output gets stranger, and you land on
the natural conclusion: the model got dumber. Meanwhile the prompt has become
a document you're afraid to touch — every clause is there for a reason nobody
wrote down, and every edit fixes one symptom while waking up another.

## Mechanism

A heavily tuned prompt is not a neutral statement of what you want. It is a
statement of what you want *fitted to one specific model's failure surface*.
That odd emphasis ("be concrete, with examples") exists because the old model
drifted abstract. That prohibition ("never apologize before answering")
exists because the old model did exactly that. Over months, the prompt
accumulated dozens of these compensations — steering corrections for quirks
you stopped consciously noticing.

A real model change moves the failure surface. The quirks the prompt steered
around are gone or relocated, but the steering is still in the text — now
pushing against nothing, or pushing an already-corrected behavior past the
target (the conciseness clause you added for a rambly model makes a terse
model truncate). Patching adds new corrections on top of obsolete ones: the
prompt now encodes two models' worth of scar tissue, partly contradictory,
and the new model is trying to satisfy all of it at once. That is the
"dumber" you're seeing.

Re-derivation cuts the stack. State the intent plainly to the new model,
watch where it actually fails, and rebuild the prompt from those observed
failures only. The old prompt stays — as a reference catalog of what you
were once compensating for — but its clauses re-enter only by reproducing
their failure on the new model.

## How to apply — human

- Trigger on evidence of a real model change (a version migration, a
  confirmed behavior shift) — not on one bad output. Detecting the change is
  a separate job; this practice is what you do once you know.
- Separate specification from compensation first: format contracts, business
  rules, and domain constraints are part of the intent and carry over
  untouched. Only the steering is up for re-derivation.
- Before touching the prompt, write down the intent as if explaining it to a
  colleague: what you want, in a few plain sentences, with no steering
  language.
- Run the plain version on a handful of representative real tasks. Collect
  the actual failures — not the failures you remember from the old model,
  the ones in front of you.
- Rebuild: plain intent, plus one clause per observed failure. Label each
  clause with the failure it answers, so the next re-derivation is cheap.
- Keep the old prompt as an archive, not a source. Port a clause only when
  its failure reproduces. Expect most of it not to come back.

## How to apply — agent

When asked to fix or update a prompt after a model change:

1. Check the situation: does the prompt contain compensating instructions
   (prohibitions, emphasis, style corrections), and has the underlying model
   actually changed? If the change is unconfirmed, say so and suggest
   confirming before rebuilding.
2. Split the prompt into intent (task, format contracts, domain rules) and
   compensation (clauses that steer around a model behavior). Flag anything
   you cannot classify rather than guessing.
3. Propose running the intent-only version against representative inputs
   before any editing. Do not patch first.
4. From the runs, list observed failures of the new model. For each old
   compensation clause, record whether its failure reproduced.
5. Rebuild the prompt: intent, plus one clause per observed failure, each
   labeled with the failure it addresses. Omit clauses whose failure did not
   reproduce.
6. Deliver the rebuilt prompt alongside the archive: which clauses were
   dropped and what each had been compensating for, so your human can spot
   anything you misclassified.

## Narration

> "This prompt is tuned to the previous model. Before patching, I'll run the
> plain intent on {sample inputs} and rebuild from what actually fails."

> "Rebuilt: kept {n} clauses whose failures reproduced, dropped {m} that were
> compensating for behavior I can no longer trigger — list attached."

## Verification

- **Human:** every clause in the rebuilt prompt can answer "what failure does
  this prevent, observed on the current model?" The rebuilt prompt is usually
  markedly shorter than the patched one. Track whether it stays short: if it
  regrows by patches within days, the re-derivation missed failures — run it
  again with more samples.
- **Agent:** trace-check the final text. Each instruction traces to the
  stated intent or to a failure observed during this rebuild; none traces
  only to "it was in the old prompt." The dropped-clause list is complete —
  a silent drop is indistinguishable from a lost requirement.

## Failure modes

- **Re-deriving on rumor.** One weird output is not a model change.
  Rebuilding a working prompt because of a bad day throws away valid,
  hard-won compensation. This is the boundary with `personal-golden-set`:
  the golden set is the detector that tells you a real change happened; this
  practice is the response once it has. Don't run the response without the
  detection.
- **Amnesia instead of re-derivation.** Deleting task specification along
  with the scar tissue — the output format, the business rule, the safety
  constraint that was never about the model. If you didn't separate intent
  from compensation first, the rebuild loses requirements and you'll
  rediscover them the expensive way.
- **Rebuilding from too few samples.** The old prompt encoded months of
  encountered cases; three test inputs will surface three failures. The
  archive exists to check the rebuild against known past traps — use it as
  a test list, not as a source of clauses.
- **Re-deriving everything at once.** Doing this to a fleet of prompts
  simultaneously turns a calibration exercise into an outage. Start with the
  one that matters most, learn the new model's actual failure surface there,
  then the rest goes faster.
- **Patching the tiny prompt.** For a two-line prompt, a patch is cheaper
  than a rebuild. This practice earns its cost on long-lived, heavily tuned
  prompts where the compensation has accumulated beyond anyone's memory.

## Field notes

Observed in production sessions with frontier coding agents across model
upgrades. The recurring shape: a long-lived system prompt that degraded
after an upgrade, then degraded further as prohibitions were stacked on top —
each patch answering the newest symptom, several patches contradicting older
clauses whose purpose had been forgotten. In one generalized instance,
restating the intent plainly and rebuilding from observed failures produced
a prompt roughly a third the length of the patched version, which
outperformed it on the same tasks; most dropped clauses mapped to failure
modes that could no longer be reproduced on the new model, and the two
failures that had persisted showed up in different forms that needed newly
written clauses — the old wording for them steered the wrong way. The
consistent lesson: the patched prompt wasn't wrong about the old model, it
was answering a model that was no longer there.

## How to apply it in a prompt

What you hand your agent once a real change has landed, annotated:

> **"The model behind this prompt changed, and the prompt is tuned to the
> old one. Don't edit it yet. Here is what the prompt is actually for:
> {two or three plain sentences of intent}. Run that plain version on
> {the last ten real inputs} and show me where it fails."**
> — the load-bearing move is the plain restatement of intent by *you*, not
> extracted by the agent: you are the one who knows which parts were
> requirements and which were steering. Forbidding edits until after the
> runs prevents the reflexive patch, which is the failure this practice
> replaces.
>
> **"Then rebuild: the plain intent, plus one clause per failure you
> actually saw, each labeled with the failure it addresses. The old prompt
> is attached as reference — port a clause only if its failure reproduced
> on these runs, and list every clause you dropped with what it had been
> compensating for."**
> — per-clause burden of proof is what keeps scar tissue out: a clause
> enters the new prompt by reproducing its failure, not by seniority. The
> labels make the *next* model change cheap, and the dropped-clause list is
> your audit — it's where you catch a requirement misfiled as a workaround.
>
> **"Anything that's a task rule rather than a model workaround — output
> format, domain constraints — carries over untouched. If you can't tell
> which one a clause is, ask."**
> — the guardrail against this practice's own worst failure, deleting
> specification as if it were compensation. The ask-don't-guess clause
> matters because misclassification here is silent: a dropped format rule
> looks identical to a dropped workaround until something downstream breaks.

Why this construction: patching treats the prompt as the asset; this prompt
treats the *intent* as the asset and the old prompt as evidence about a
model that no longer exists. Every structural piece — the edit ban before
observation, the per-clause reproduction requirement, the protected
specification — exists to stop clauses from surviving on habit, because
habit is exactly how two models' worth of contradictory steering ends up in
one prompt.
