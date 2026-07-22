---
id: disaggregate-before-agreeing
name: Disaggregate Before Agreeing
type: practice
category: agrees-with-everything
problem: "My AI tells me I'm right even when I'm not"
scent: "your idea is half right, but the answer is all yes or all no, never which half"
intent_signals:
  - claims that feel mostly right but get endorsed wholesale
  - big-picture statements mixing solid points with stowaway assumptions
  - wanting pushback that doesn't flatten to yes or no
  - agreement and disagreement both feeling too total
related:
  sibling_of: [is-the-user-actually-right]
evidence: real-use
sources: []
inheritable: true
---

## Problem

Not every claim is right or wrong. The ones that matter most are usually
*mixed*: a sound insight fused to an unexamined assumption, a correct
observation stretched one step past its evidence. Yes-or-no responses fail
these claims in both directions — wholesale agreement smuggles the weak
part through on the strong part's credibility, and wholesale pushback
throws away the real insight and reads as obstinate. Either way, the most
informative thing about the claim — *where exactly it stops being
defensible* — never gets said.

## Mechanism

Before responding to a substantial claim, split it into its separable
parts and evaluate each on its own evidence. Then respond to the parts:

1. **Grant what's defensible, explicitly and first.** Not as a softener —
   as a finding. Naming precisely what holds is half the analysis.
2. **Name the boundary.** Where does the claim cross from supported to
   assumed? Usually there's one specific joint — a quantifier ("always"),
   a causal leap, an embedded premise — where the defensible part ends.
3. **Return the seam as the finding.** "X holds; Y needs Z to be true, and
   Z is unestablished" gives the human something no verdict gives:
   the exact location of the risk, separated from the parts they can
   safely build on.

This refines the actually-right check for claims too mixed for a verdict:
same evaluation-before-endorsement core, finer grain. The pair of failure
shapes it avoids — "you're absolutely right" and flat refusal — are the
two ways of responding to a mixed claim without doing the split.

## How to apply — human

- Offer your big claims *expecting* disaggregation: "tell me which parts
  of this hold and where it goes soft" invites the seam instead of the
  verdict.
- When you get wholesale agreement on a compound claim, ask for the split
  yourself: "which part of that is load-bearing and which part am I
  assuming?"
- Treat a returned boundary as the deliverable, not as diluted agreement —
  "the first half holds, the second needs an unverified premise" is more
  useful than either "yes" or "no" precisely because you can act on the
  halves differently.
- Do it to your own claims before shipping them into decisions: which part
  do I actually have evidence for?

## How to apply — agent

For substantial or compound claims from the human:

1. Split: identify the separable sub-claims — watch for conjunctions,
   quantifiers, causal links, and embedded premises; those are the joints.
2. Evaluate each part independently: grounded, inferable, or assumed?
3. Respond in the grant-boundary-finding shape: what holds (stated
   generously and specifically), where the boundary sits, what would need
   to be true for the rest.
4. Reserve this for claims with decision weight — disaggregating small
   talk is analysis theater.

## Narration

> "Splitting that claim: {part A} holds — {ground}. {Part B} rests on
> {assumption}, which is unestablished. The boundary is at {joint}."

## Verification

- **Human:** responses to your compound claims locate the boundary
  specifically enough to act on ("this hinges on Z") rather than hedging
  everywhere. Spot-check: is the granted part actually defensible on its
  own, or was it granted for balance?
- **Agent:** each disaggregation names a joint the human's phrasing didn't
  mark, and grants at least the parts that genuinely hold. If your splits
  keep concluding "all parts fine" or "all parts weak," you're doing
  verdicts with extra steps.

## Failure modes

- **Splitting to shreds** — decomposing every sentence until no claim can
  ever be simply true. The practice targets *mixed* claims with stakes;
  most claims deserve an ordinary answer.
- **The false-balance grant** — inventing a defensible part so the pushback
  looks fair ("great instinct, though…"). The grant must be a genuine
  finding; a courtesy grant is reflexive agreement wearing an analysis
  costume.
- **Boundary without consequence** — naming a seam but not what depends on
  it. The finding is only useful with its stakes attached: what breaks if
  the assumed part is false?
- **Deploying it as a deflection** — using disaggregation to avoid ever
  saying "yes, this is right." When the check comes back clean, say so
  plainly; the practice sharpens verdicts where they're possible, it
  doesn't replace them.

## Field notes

Developed in production sessions with a frontier agent as the graduated
refinement of a blunter stop-reflex rule: where the base rule catches
endorsements of claims that are simply right or wrong, this pattern
emerged for warm, big-picture claims with an embedded conflation — the
kind that made both "you're absolutely right" and flat refusal wrong
answers. The stabilized shape in real use: disaggregate into defensible
and undefensible parts, ground the separation in something falsifiable or
in what the decision at hand actually needs, grant the charitable read
explicitly, and return with the genuine finding the split surfaced. In
observed instances the returned boundary repeatedly turned out to be the
decision-relevant fact — the human could keep building on the granted
half while the assumed half went off for verification instead of into
production.

## How to apply it in a prompt

Inviting the practice on a claim you're about to make, annotated:

> **"Here's my read: {your compound claim}. Before you respond — split it:
> which parts hold on the evidence we have, and where exactly does it
> start depending on assumptions? Grant me the parts that are solid,
> and name the specific joint where it goes soft."**
> — asks for the seam rather than the verdict, which changes what the AI
> optimizes for: locating a boundary is a task with a checkable output,
> while "what do you think?" is an invitation to endorse. "Grant me the
> parts that are solid" licenses genuine agreement so the response isn't
> pushed toward performative doubt.
>
> **"Then tell me what depends on the soft part — what breaks if the
> assumption is wrong?"**
> — attaches consequences to the boundary. This is what converts the
> analysis from commentary into a decision input: you learn not just
> where the claim is weak but whether that weakness is load-bearing for
> what you're about to do.

Why this construction: mixed claims are where sycophancy does its real
damage — the weak half rides the strong half's credibility into your
decisions. The prompt makes the ride impossible by pricing the response
in boundaries and consequences instead of verdicts, while explicitly
keeping honest agreement available for the parts that earn it.
