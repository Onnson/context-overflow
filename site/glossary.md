---
layout: default
title: Glossary
description: "The library's working vocabulary — cognitive debt, context rot, narration, receipts, and the other names you and your AI share"
nav_order: 15
permalink: /glossary/
---

<div class="co-page co-group-you" markdown="1">

# Glossary

The point of this library is a shared vocabulary between you and your AI —
the same names on both doors. These are the working terms, each defined so
it can stand alone.

## Cognitive debt

What accumulates when you hand thinking to an AI and skip the understanding:
the work gets done, but the comprehension that would have formed in you
doesn't. Cheap in the moment, compounding over time —
[the research and the counters](/cognitive-debt/). In software, the same
term names [code that ships faster than the team comprehends
it](/cognitive-debt/in-code/).

## Cognitive offloading

Delegating mental work to a tool instead of doing it — the long-studied
mechanism behind cognitive debt. Offloading is not inherently bad;
offloading *comprehension* is the failure mode
[the studies keep measuring](/cognitive-debt/).

## Context rot

The gradual decay of an AI's working context: stale assumptions,
contradictory instructions, and leftovers from abandoned directions
accumulate until output quality drops. Often misread as the model getting
worse — [a feeling you can turn into a test](/dumber-after-the-update/).

## Narration

An AI naming the technique it is applying, mid-task, in vocabulary its human
learned from the same library: *"one real unknown before I act."* Narration
makes reasoning visible while it happens and steerable by name —
[how to wire it](/connect/).

## Receipt

The actual output of the actual check that backs a completion claim. "Done"
without a receipt is a sentence, not a state —
[Declared Success Without Proof](/confidently-wrong/declared-success-without-proof/).

## Worked prompt

A prompt taught by construction: built in front of you from the problem, the
mechanism, and the failure modes, annotated line by line — so you can
rebuild and adapt it, not just paste it. Every technique page ends in one.

## Scope contract

An explicit agreement, made before work starts, on what a task touches and
what it must not — the boundary that keeps a one-function fix from becoming
a nine-file diff. [The technique](/did-more-than-i-asked/scope-contract/).

## Practice

A technique type: a repeatable move you or your agent applies deliberately —
marked <span class="label">Practice</span> on its page.

## Anti-pattern

A technique type: a named failure shape. Applying an anti-pattern means
recognizing and interrupting it, in yourself or your AI — marked
<span class="label">Anti-pattern</span> on its page.

## Protocol

A technique type: a structured procedure with defined steps and checkpoints,
heavier than a practice, for work that needs ceremony —
marked <span class="label">Protocol</span> on its page.

## MCP (Model Context Protocol)

The open plug-in standard AI assistants use to reach outside tools — the
same mechanism they use to search the web or read files. It is how your
agent [loads this library](/connect/): same techniques, same names, live.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "name": "ContextOverflow glossary",
  "url": "https://contextoverflow.org/glossary/",
  "hasDefinedTerm": [
    { "@type": "DefinedTerm", "name": "cognitive debt", "description": "What accumulates when you hand thinking to an AI and skip the understanding: the work gets done, but the comprehension that would have formed in you doesn't." },
    { "@type": "DefinedTerm", "name": "cognitive offloading", "description": "Delegating mental work to a tool instead of doing it — the long-studied mechanism behind cognitive debt. Offloading comprehension is the failure mode." },
    { "@type": "DefinedTerm", "name": "context rot", "description": "The gradual decay of an AI's working context: stale assumptions, contradictory instructions, and leftovers from abandoned directions accumulate until output quality drops." },
    { "@type": "DefinedTerm", "name": "narration", "description": "An AI naming the technique it is applying, mid-task, in vocabulary its human learned from the same library — making reasoning visible while it happens and steerable by name." },
    { "@type": "DefinedTerm", "name": "receipt", "description": "The actual output of the actual check that backs a completion claim. 'Done' without a receipt is a sentence, not a state." },
    { "@type": "DefinedTerm", "name": "worked prompt", "description": "A prompt taught by construction: built from the problem, the mechanism, and the failure modes, annotated line by line, so it can be rebuilt and adapted rather than pasted." },
    { "@type": "DefinedTerm", "name": "scope contract", "description": "An explicit agreement, made before work starts, on what a task touches and what it must not." },
    { "@type": "DefinedTerm", "name": "practice", "description": "A technique type: a repeatable move a human or agent applies deliberately." },
    { "@type": "DefinedTerm", "name": "anti-pattern", "description": "A technique type: a named failure shape; applying it means recognizing and interrupting it." },
    { "@type": "DefinedTerm", "name": "protocol", "description": "A technique type: a structured procedure with defined steps and checkpoints." },
    { "@type": "DefinedTerm", "name": "MCP (Model Context Protocol)", "description": "The open plug-in standard AI assistants use to reach outside tools; how agents load this library live, under the same names humans read." }
  ]
}
</script>

</div>
