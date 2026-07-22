# The Technique File Contract

Every entry in the corpus is one markdown file at
`corpus/techniques/<category>/<id>.md`. This document is the complete contract:
a person (or agent) who has read only this file and one existing entry should
be able to write a valid new entry.

One file = one technique. The same file is rendered as a learning page for
humans (the website) and served as executable guidance for agents (the MCP).
Write every sentence for the human reader; structure every section so a
machine can serve it.

## Frontmatter

```yaml
---
id: action-first-when-clear        # kebab-case, unique, matches filename
name: Action-First When Clear, Ask When Unclear
type: practice                     # practice | anti-pattern | protocol
category: stalls-instead-of-acting # one of the taxonomy categories below
problem: "The AI stalls instead of acting"   # the problem as the human experiences it
scent: "it recaps, asks, and offers options — anything but the approved work"
                                   # one complaint-voiced line (≤ ~18 words) locating this
                                   # technique inside its category; rendered on the category
                                   # page as the "which version of it is yours?" line; must
                                   # stay faithful to the Problem section
intent_signals:                    # phrases/behaviors that indicate this entry applies;
  - repeated confirmation requests after a clear instruction   # used by MCP classify/find
  - approve/edit/rewrite closers
related:                           # typed edges to other entry ids (all optional)
  prevents: []                     #   practice → anti-pattern it corrects
  prevented_by: []                 #   anti-pattern → practice that corrects it
  contrasts_with: []               #   opposite-direction failure or approach
  sibling_of: []                   #   same family, different situation
  derived_from: []                 #   source technique/framework
evidence: real-use                 # real-use | literature | both
sources: []                        # required non-empty if evidence includes literature;
                                   # verified citations only
inheritable: true                  # true = generalizes beyond one specific human-AI pair;
                                   # only inheritable entries belong in this corpus
---
```

## Taxonomy

Categories are named after the problem as the human experiences it. Every
entry lives in exactly one:

| category | the problem |
|---|---|
| `lost-the-thread` | "My AI forgets everything between sessions" |
| `doing-my-thinking` | "I'm outsourcing my thinking and getting dumber" |
| `confidently-wrong` | "My AI states things that turn out to be false" |
| `agrees-with-everything` | "My AI tells me I'm right even when I'm not" |
| `stalls-instead-of-acting` | "The AI stalls instead of acting" |
| `bloated-answers` | "I ask something simple and get a wall of text" |
| `starting-blind` | "It starts producing before it understands the task" |
| `problem-too-big` | "The task is too big and it (or I) can't hold it" |
| `faster-than-i-can-review` | "My AI produces more than I can review" |
| `did-more-than-i-asked` | "My AI did more than I asked it to" |
| `dumber-after-the-update` | "My AI got worse after an update" |

## Body sections — all nine, in this order, none skipped

An entry missing any section does not ship. If a section is genuinely hard to
write, that is information: the technique is not ready for the corpus.

1. **`## Problem`** — what it feels like from the human's side, in concrete
   recognizable behavior. No theory yet.
2. **`## Mechanism`** — why it happens / why the technique works. This is the
   understanding layer; a reader who stops here should still think differently.
3. **`## How to apply — human`** — what the human does, as behavior. For
   anti-patterns: how to recognize it in your AI and what to do when you see it.
4. **`## How to apply — agent`** — the steps an agent executes, written as
   directly followable instructions. For anti-patterns: the self-diagnostic.
   Served by the MCP `apply_technique` tool.
5. **`## Narration`** — the one or two lines the agent says in-conversation so
   its human sees the technique running. Written as a template with `{slots}`
   the agent fills. This is the mutual-legibility contract: the same words the
   human learned here are the words they hear from their agent.
6. **`## Verification`** — how you know it worked, for both sides. A technique
   without a check is a belief, not a technique.
7. **`## Failure modes`** — how applying this goes wrong, including
   over-application. Name the opposite-direction failure if it has an entry
   (`contrasts_with`).
8. **`## Field notes`** — provenance. For `real-use` evidence: generalized,
   anonymous accounts of real production instances — real enough to recognize,
   never identifying people, projects, or private context. For `literature`:
   what the cited work showed.
9. **`## How to apply it in a prompt`** — a worked, annotated example: an
   actual prompt with the technique visibly constructed inside it, each part
   explained so the reader understands why it is built that way and can build
   their own. Never a bare copy-paste snippet — the annotation is the content.
   This section is the destination of the human page.

## Writing rules

- Address the human reader throughout ("you", "your agent"). Machine-facing
  structure lives in the frontmatter and section boundaries, not in the prose.
- Plain language over jargon; where a term of art is needed, define it in place.
- No personal or private provenance: no names, no project identifiers, no
  session-specific phrases. Field notes use real-use framing
  ("observed in production sessions with a frontier coding agent") without
  identifying detail.
- Claims of literature evidence require a verifiable citation in `sources`.
  A claim that cannot be cited is stated as real-use experience or removed.
- Every `related:` edge must point at an existing entry id. One-directional
  declaration is enough; renderers resolve both directions.
