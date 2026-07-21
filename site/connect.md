---
layout: default
title: Connect your agent
nav_order: 13
permalink: /connect/
---

# Connect your agent

**Connect your agent once and it can read this library while it works —
same 31 techniques, same names, one vocabulary between you.** MCP is the plug-in standard
that lets assistants like Claude, Cursor, and Copilot use outside tools —
the same mechanism they already use to search the web or read your files.
This endpoint adds one more ability: pull the technique you just learned,
mid-conversation, and tell you it's doing so in words you recognize.

**Endpoint:** `https://contextoverflow.org/mcp`
— no account, no API key. The server is stateless — it
holds nothing between requests. Questions sent for matching are collected
anonymously (no accounts, no identity) and used to grow the library and
understand how people and AI collaborate; the rest of your conversation is
never seen.

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
technique up — or steer in the same terms: name a different technique and
it knows exactly what you mean. That's the point.

## Set it up

Every setup below was verified against the platform's own documentation
(July 2026). All of them speak to this server directly — no bridge, no
keys.

**Claude Code**

```sh
claude mcp add --transport http contextoverflow https://contextoverflow.org/mcp
```

Or in `.mcp.json` — the `"type": "http"` field is required; an entry with
only a `url` is treated as a config error and the server is silently
skipped:

```json
{ "mcpServers": { "contextoverflow": { "type": "http", "url": "https://contextoverflow.org/mcp" } } }
```

**claude.ai / Claude Desktop / mobile** — Settings → Connectors → *Add
custom connector* → paste `https://contextoverflow.org/mcp` → leave the
OAuth fields empty → Add. Works on the free plan too (one custom connector
there). Team/Enterprise: an org Owner adds it first. The connection is
brokered through Anthropic's cloud, so it behaves identically on web,
Desktop, and mobile.

**ChatGPT (web)** — custom MCP servers are called *apps* now, added in
developer mode. On the Pro plan: Settings → Apps → Advanced settings →
enable developer mode, then add an app: name `ContextOverflow`, MCP server
URL `https://contextoverflow.org/mcp`, authentication *none*. Read-only
apps like this one are exactly what Pro developer mode supports.
Business/Enterprise/Edu: an admin enables developer mode and publishes it.
Other plans don't have a path yet, and apps are web-only for now.

**Cursor** — add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json`
(global); Cursor detects the transport by itself:

```json
{ "mcpServers": { "contextoverflow": { "url": "https://contextoverflow.org/mcp" } } }
```

**VS Code (Copilot agent mode)** — Command Palette → *MCP: Add Server* →
HTTP, or add to `.vscode/mcp.json`:

```json
{ "servers": { "contextoverflow": { "type": "http", "url": "https://contextoverflow.org/mcp" } } }
```

**Cline** — MCP Servers icon → *Remote Servers* tab → name + URL →
transport *Streamable HTTP*; or in `cline_mcp_settings.json` — the type
must be exactly `streamableHttp` (camelCase); other spellings silently
fall back to the legacy SSE transport:

```json
{ "mcpServers": { "contextoverflow": { "type": "streamableHttp", "url": "https://contextoverflow.org/mcp" } } }
```

**Roo Code** — MCP icon → *Edit Global MCP* (or `.roo/mcp.json` in the
project, which wins):

```json
{ "mcpServers": { "contextoverflow": { "type": "streamable-http", "url": "https://contextoverflow.org/mcp" } } }
```

**Continue** — add to `~/.continue/config.yaml` (Agent mode only):

```yaml
mcpServers:
  - name: ContextOverflow
    type: streamable-http
    url: https://contextoverflow.org/mcp
```

**Gemini CLI** — in `~/.gemini/settings.json`, use `httpUrl` — a plain
`url` key selects the SSE transport instead:

```json
{ "mcpServers": { "contextoverflow": { "httpUrl": "https://contextoverflow.org/mcp" } } }
```

Verify inside the CLI with `/mcp`.

**Codex CLI** — add to `~/.codex/config.toml`:

```toml
[mcp_servers.contextoverflow]
url = "https://contextoverflow.org/mcp"
```

**Goose** — one-shot session:

```sh
goose session --with-streamable-http-extension "https://contextoverflow.org/mcp"
```

or `goose configure` → Add Extension → Remote Extension (Streamable HTTP).

**OpenAI Responses API** (building your own agent) — pass the endpoint as
a hosted MCP tool:

```json
{ "type": "mcp", "server_label": "contextoverflow", "server_url": "https://contextoverflow.org/mcp" }
```

Anything not listed that speaks streamable HTTP: paste
`https://contextoverflow.org/mcp` into its MCP server config. A legacy
client that only speaks stdio can still bridge with
`npx mcp-remote https://contextoverflow.org/mcp`. One honest caveat for
workplace machines: org policies (Copilot MCP policy, Cursor allowlists,
tenant DLP) sometimes block unknown external MCP domains — if the
connection fails at work but not at home, that's the reason.

## Test it before you wire it

Sixty seconds with any of these shows the live tools before touching your
agent's config:

- **MCP Inspector** (official): `npx @modelcontextprotocol/inspector --cli https://contextoverflow.org/mcp --transport http --method tools/list`
- **MCPJam**: paste the endpoint at `app.mcpjam.com` — no install, no account
- **Postman**: New → MCP request → HTTP → paste the endpoint → Load Capabilities

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

## Enterprise: Microsoft 365 Copilot

End users can't add servers; a maker adds it once in **Copilot Studio**:
open the agent → Tools → Add a tool → New tool → Model Context Protocol →
server name `ContextOverflow`, URL `https://contextoverflow.org/mcp`,
authentication *None* → create the connection → add to agent. Requires
generative orchestration; tenant DLP policies can block external MCP
domains.

## Where it can't connect yet

Honesty over reach: consumer **Gemini** and **Meta AI** have no custom MCP
path today, **Microsoft 365 Copilot end-user chat** only takes servers via
Copilot Studio makers (above), and **Aider** has no native MCP support.
When those doors open, this page will list them.

## A note on use

The corpus is licensed CC BY-NC-ND 4.0 and served through this endpoint for
direct use by you and your agent. Teach with it, work with it — don't
repackage it.
