# Context Overflow

**Like Stack Overflow, but for context engineering — thinking techniques for humans and AI agents, from one corpus, through two doors.**

Most guides teach you to write better prompts. Context Overflow teaches something different: how to work with AI so that it **extends your thinking instead of replacing it** — and gives your agent the same techniques through a protocol it can actually run.

## The two doors

- **For humans — [contextoverflow.org](https://contextoverflow.org):** a curated, categorized database of thinking techniques. No login, no feed. You arrive with a goal ("What are you trying to get done?"), find the technique that fits, and learn how to build it into a prompt yourself — worked, annotated examples, never copy-paste snippets.
- **For agents — MCP at contextoverflow.online:** a self-contained MCP server exposing the same corpus through a four-stage arc: `classify_intent → find_technique → get_technique → apply_technique`. Every response carries a narration line, so the agent's reasoning surfaces in the conversation in the same vocabulary its human learned on the site. Both sides of the pair get smarter; neither goes opaque.

## What's in the corpus

Techniques, practices, and anti-patterns for working with AI: keeping context across sessions, catching confident wrongness, breaking sycophancy loops, acting instead of stalling, engaging your own judgment instead of offloading it. Entries are grounded in real production use (see each entry's Field Notes) or in published research (cited), and every entry states its verification check and failure modes — if we can't tell you how to know it worked, it doesn't ship.

The schema every entry follows: [`corpus/SCHEMA.md`](corpus/SCHEMA.md).

## Status

Pre-launch. The contract and first entries are in place; the corpus is being seeded.

## Contributing

Contributions will open after launch and will require a contributor license agreement. Until then, issues and discussion are welcome.

## License

- `corpus/` — [CC BY-NC-ND 4.0](corpus/LICENSE.md)
- everything else — [Elastic License 2.0](LICENSE)
