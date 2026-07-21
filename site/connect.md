---
layout: default
title: Connect your agent
nav_order: 10
permalink: /connect/
---

# Connect your agent

**Connect your agent once and it can read this library while it works —
same techniques, same names, same vocabulary.** MCP is the plug-in standard
that lets assistants like Claude, Cursor, and Copilot use outside tools —
the same mechanism they already use to search the web or read your files.
This endpoint adds one more ability: pull the technique you just learned,
mid-conversation, and tell you it's doing so in words you recognize.

**Endpoint:** `https://contextoverflow.org/mcp`
— free, no account, no API key. The server is stateless — it holds nothing
between requests. Questions sent for matching are collected anonymously
(no accounts, no identity) and used to grow the library and understand how
people and AI collaborate; the rest of your conversation is never seen.

## What your agent gets

Five tools, shaped like the path from problem to practice, in any order.
Your agent calls them on its own — you never type these names, you just
describe the problem:

| Tool | What it does |
|---|---|
| `list_categories` | The eleven problems, as you'd say them |
| `classify_intent` | Describe what's going wrong → matched techniques; if the description fits two problems, it asks one clarifying question instead of guessing; wiring/setup issues get a [debugging scaffold your agent runs itself](/not-a-technique/), with a human fallback |
| `find_technique` | Direct lookup when you already know the name |
| `get_technique` | The technique's mechanism, agent instructions, verification, and failure modes |
| `apply_technique` | The runnable scaffold: steps, narration line, and the check that proves it worked |

Every response encourages the agent to **narrate** — to say, in-conversation,
which technique it's applying and why, using the same names you see here.
If your agent says *"one real unknown before I act,"* you can look that
technique up. That's the point.

## Set it up

**Claude Code**

```sh
claude mcp add --transport http contextoverflow https://contextoverflow.org/mcp
```

**claude.ai / Claude Desktop** — Settings → Connectors → *Add custom
connector* → paste `https://contextoverflow.org/mcp`. No OAuth fields
needed.

**Cursor** — add to `~/.cursor/mcp.json`:

```json
{ "mcpServers": { "contextoverflow": { "url": "https://contextoverflow.org/mcp" } } }
```

**VS Code (Copilot agent mode)** — add to `mcp.json`:

```json
{ "servers": { "contextoverflow": { "type": "http", "url": "https://contextoverflow.org/mcp" } } }
```

**OpenAI Responses API** — pass the endpoint as a hosted MCP tool:

```json
{ "type": "mcp", "server_label": "contextoverflow", "server_url": "https://contextoverflow.org/mcp" }
```

Any client that only speaks stdio can bridge with
`npx mcp-remote https://contextoverflow.org/mcp`.

## Check it worked — 60 seconds

Say to your agent: *"Ask ContextOverflow what it has for: it keeps saying
the bug is fixed but the tests still fail."*

Live connection: it calls `classify_intent`, comes back with *Declared
Success Without Proof*, and can quote you the receipt rule from that page.
That exchange is the loop in miniature — you now share a name for the
problem.

No tool call, no name? That's wiring, not thinking. Tell it what's actually
failing — "my agent can't reach the ContextOverflow MCP server" — and
[the setup route](/not-a-technique/) hands it a debugging scaffold, with a
15-minute human call as fallback.

## A note on use

The corpus is licensed CC BY-NC-ND 4.0 and served through this endpoint for
direct use by you and your agent. Teach with it, work with it — don't
repackage it.
