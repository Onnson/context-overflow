---
id: dependency-analysis-first
name: Map Dependencies, Work Backward
type: practice
category: problem-too-big
problem: "The task is too big and it (or I) can't hold it"
intent_signals:
  - big tasks started from whatever piece looked most tractable
  - work blocking on prerequisites discovered mid-flight
  - '"where do we even start" on a many-part problem'
  - finished pieces waiting on unfinished ones to mean anything
related:
  sibling_of: [mode-separation, tree-of-thought-branching]
evidence: both
sources:
  - "Dixit, A. K. & Nalebuff, B. J. (2008). The Art of Strategy. W. W. Norton — ch. 2, 'Games Solvable by Backward Reasoning' (look forward, reason backward)."
inheritable: true
---

## Problem

The task is too big to hold, so work starts *somewhere* — usually at the
most visible or most interesting piece. Three pieces later, the pattern
emerges: piece two turns out to need a decision that piece four was
supposed to produce; the finished component sits unusable waiting on an
interface that doesn't exist; a "quick part" reveals itself as
downstream of everything. Effort is being spent; the task isn't
shrinking, because the *order* was never designed — and on a big task,
order is most of the design.

## Mechanism

Two moves, in sequence:

**Map the dependencies.** Break the task into parts, then ask of each:
what must exist before this can start? What does it produce that others
need? The output is a small directed graph — and the graph immediately
reveals structure the flat to-do list hides: which pieces are
prerequisites for everything (do first), which are independent (do
anytime, or in parallel), and where the *critical path* runs — the
chain of dependent pieces that determines how long everything takes.

**Reason backward from the goal.** Instead of asking "what can I start
on?", ask "what does the finished state require? and what does *that*
require?" — walking from the end to the present. This is the
look-forward-reason-backward principle from sequential decision theory
(cited above): in any multi-step undertaking where later steps depend
on earlier ones, the correct early moves are found by working back from
the end, not forward from the beginning. Forward-from-here picks the
tractable piece; backward-from-goal picks the *enabling* piece. They
disagree constantly, and backward is right.

The payoff for a too-big task is that bigness itself gets restructured:
the graph converts one unholdable problem into small ordered pieces,
each workable without holding the whole — the holding has been done
once, up front, and written down.

## How to apply — human

- Before letting work start on a many-part task, ask for the map: "break
  this down, and for each piece: what does it need, what does it
  produce? Then give me the order, working backward from done."
- Read the graph for its two headline facts: what's on the critical path
  (protect it), and what's independent (parallelize it or defer it).
- Challenge the first move: "why this piece first?" The answer should be
  "everything needs it" or "it's on the critical path" — not "it seemed
  approachable."
- Keep the map alive: when a dependency is discovered mid-flight, it
  goes into the graph — a surprise prerequisite is the map correcting
  itself, if the map exists to correct.

## How to apply — agent

For tasks with several interdependent parts:

1. Decompose into pieces sized so each is holdable on its own.
2. For each piece, record needs (prerequisites) and produces (outputs
   other pieces consume). Note the unknowns as dependencies too — "the
   decision on X" can block a piece as hard as code can.
3. Work backward from the goal state to find the enabling order; then
   check forward: any cycle (A needs B needs A) means the decomposition
   is wrong — split the piece that breaks the cycle.
4. Present: the pieces, the graph (prose or list is fine), the critical
   path, what can run in parallel, and the first move with its
   *because*.
5. During execution, on discovering an unmapped dependency: update the
   map and re-derive the order before continuing — don't route around
   it ad hoc.

## Narration

> "Mapping before starting: {n} pieces. Critical path: {chain}.
> Starting with {piece} because {what depends on it}."

## Verification

- **Human:** mid-task blocking surprises ("we can't do this until…")
  trend toward zero, and at any moment there's an answer to "why are we
  working on this piece now?" that cites the graph.
- **Agent:** each completed piece was consumable when finished (its
  dependents could actually use it), and no started piece hit an
  unmapped prerequisite. Every hit that does occur gets traced: was the
  dependency unknowable up front, or unasked-about? Only the first kind
  is innocent.

## Failure modes

- **Map worship** — spending the project on ever-finer decomposition.
  The map exists to produce an order and a first move; when it has,
  start. Unknowns can ride along as mapped risks — they don't all need
  resolving up front.
- **Forward relapse** — making the map, then starting on the appealing
  piece anyway. The tell: the first move's justification doesn't
  mention what depends on it.
- **Cycle denial** — papering over circular dependencies ("we'll stub
  it") instead of re-cutting the decomposition. Cycles are information:
  the pieces are drawn wrong.
- **Static map** — treating the day-one graph as the truth after
  reality has amended it. The practice's second half is maintenance;
  an outdated map orders work by a world that no longer exists.

## Field notes

The backward principle is Dixit & Nalebuff's rule one for sequential
games (cited): anticipate where paths lead and reason back from
outcomes to choose the current move — the general form of solving
multi-step problems from the end. In production sessions with frontier
agents, dependency mapping ran as a standing planning technique
(identify prerequisites, risks, and critical-path elements before
execution), and the observed difference was starkest on multi-week
efforts: mapped work produced pieces that were consumable on
completion, while unmapped work repeatedly manufactured the signature
failure — finished components idling against missing prerequisites
discovered at integration time. The unknowns-as-dependencies refinement
came from practice: the blocking prerequisite was as often an unmade
decision as unbuilt code, and graphs that carried decisions as nodes
caught those blocks at planning time.

## How to apply it in a prompt

Opening a many-part task, annotated:

> **"Don't start work yet. Break this into pieces, and for each one
> tell me: what it needs before it can start (including decisions, not
> just code), and what it produces that other pieces use. Then work
> backward from the finished state and give me the order — critical
> path, what can go in parallel, and your first move with the reason
> it's first."**
> — "don't start work yet" holds the forward reflex at the door.
> "Including decisions" widens the dependency net to the non-code
> prerequisites that cause half the real blocks. The backward clause
> aims the ordering at enablement rather than tractability, and
> requiring the first move's *reason* makes the appealing-piece relapse
> visible in one line.
>
> **"When something turns out to depend on a thing we didn't map, stop
> and update the map before routing around it."**
> — makes the graph a living document. Discovered dependencies are the
> map improving — but only if they're fed back; the ad-hoc route-around
> is how a good day-one map becomes decoration by week two.

Why this construction: a too-big task defeats you through order, not
size — every piece is workable; the sequence is what wasn't designed.
Both lines put sequence under explicit construction (backward, from
the goal) and explicit maintenance (updates on contact), which is the
entire content of the practice: hold the whole thing once, in a form
that lets you never hold it again.
