---
layout: default
title: Connect your agent
nav_order: 10
permalink: /connect/
---

# Connect your agent

Everything you learn on this site is also served to AI agents over MCP —
same techniques, same names, same vocabulary. Connect your agent once and it
can pull the technique you just learned, mid-conversation, and tell you it's
doing so in words you recognize.

**Endpoint:** `https://contextoverflow.org/mcp`
— free, no account, no API key. Your conversations are not stored or
analyzed; the server is stateless and holds nothing between requests.

## What your agent gets

Five tools, shaped like the path from problem to practice — though your
agent can call any of them directly:

| Tool | What it does |
|---|---|
| `list_categories` | The eight problems, as you'd say them |
| `classify_intent` | Describe what's going wrong → matched techniques; if the description fits two problems, it asks one clarifying question instead of guessing |
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

## A note on use

The corpus is licensed CC BY-NC-ND 4.0 and served through this endpoint for
direct use by you and your agent. Teach with it, work with it — don't
repackage it.
