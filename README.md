# Context Overflow

**Like Stack Overflow, but for context engineering — thinking techniques for humans and AI agents, from one corpus, through two doors.**

Most guides teach you to write better prompts. Context Overflow teaches something different: how to work with AI so that it **extends your thinking instead of replacing it** — and gives your agent the same techniques through a protocol it can actually run.

## The two doors

**For humans — [contextoverflow.org](https://contextoverflow.org).** A curated, categorized corpus of thinking techniques. No login, no feed. You arrive with a problem — the site opens with *"What are you trying to get done?"* — find the technique that fits, and learn to build it into a prompt yourself: worked, annotated examples, never copy-paste snippets.

**For agents — MCP at `contextoverflow.org/mcp`.** The same corpus served over Streamable HTTP; free, keyless, stateless. Five tools:

| Tool | What it does |
|---|---|
| `list_categories` | The eight problems, as a human would say them |
| `classify_intent` | Symptom description → matching techniques; genuinely ambiguous → one clarifying question, never a guess |
| `find_technique` | Direct lookup by name |
| `get_technique` | Mechanism, agent instructions, verification, failure modes |
| `apply_technique` | The runnable scaffold + narration line + the check that proves it worked |

Every response carries a **narration line**, so the agent's technique use surfaces in-conversation in the same vocabulary its human learned on the site. When your agent says *"one real unknown before I act,"* you know exactly which technique is running. Both sides of the pair get smarter; neither goes opaque. Setup for every client: [contextoverflow.org/connect](https://contextoverflow.org/connect/).

## The eight problems

`lost-the-thread` · `doing-my-thinking` · `confidently-wrong` · `agrees-with-everything` · `stalls-instead-of-acting` · `bloated-answers` · `starting-blind` · `problem-too-big`

Each named for the problem as you experience it — "My AI forgets everything between sessions," "It tells me I'm right even when I'm not." Every technique lives in exactly one, and answers it.

## What makes an entry

Entries are grounded in real production use (generalized field notes) or published research (verified citations only — an unverifiable attribution doesn't ship). Every entry states its **mechanism**, its **verification check**, and its **failure modes** — if we can't tell you how to know it worked, it doesn't ship. The full contract: [`corpus/SCHEMA.md`](corpus/SCHEMA.md).

## Repository layout

- `corpus/` — the techniques. The repo **is** the database; site and MCP are two views of it.
- `site/` — the human door: Jekyll, generated from the corpus at build time.
- `mcp/` — the agent door: a stateless TypeScript Cloudflare Worker, corpus compiled in, no LLM inside.
- `validator/` — the gate both doors build behind: schema, section order, edge integrity, and a build-failing privacy blocklist.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: issues and discussion are open; corpus and code contributions require a CLA (activating shortly after launch), and every entry must pass the validator and carry real evidence.

## License

- `corpus/` — [CC BY-NC-ND 4.0](corpus/LICENSE.md)
- everything else — [Elastic License 2.0](LICENSE)
