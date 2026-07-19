# Contributing to Context Overflow

Thanks for wanting to make the corpus better. A few things are different
here than in a typical open-source repo — read this before opening a PR.

## The short version

- **Issues and discussion: open now.** Found a technique that misfires, a
  claim that doesn't hold, a category that doesn't fit your problem? Open an
  issue — disagreement with evidence is the most valuable contribution there is.
- **Corpus and code PRs: require a signed CLA.** The corpus is licensed
  CC BY-NC-ND 4.0 and the code Elastic License 2.0; a contributor license
  agreement keeps that licensing sustainable. The CLA flow activates shortly
  after launch — PRs opened before then will wait on it.

## Contributing a technique

One file = one technique. The complete contract is
[`corpus/SCHEMA.md`](corpus/SCHEMA.md) — a person who has read only that
file and one existing entry should be able to write a valid new one. The
bar, in brief:

1. **All nine sections, in order, none skipped.** If a section is genuinely
   hard to write, the technique isn't ready.
2. **Evidence is real.** `real-use` entries carry generalized, anonymous
   field notes from real production use. `literature` entries carry
   verifiable citations — if the citation can't be verified, the claim
   ships as real-use or not at all.
3. **A verification check.** A technique without a check is a belief.
4. **Failure modes, including over-application.** Every practice can be done
   wrong; say how.
5. **No personal or private provenance.** No names, no project identifiers,
   no session-specific phrases. The validator's privacy blocklist is
   build-failing and has no allowlist — a collision is resolved by
   rewording, never by exempting.

Run the validator before pushing:

```sh
cd validator && npm ci && npm run validate
```

A PR whose entry fails the validator, or whose citations can't be verified,
will be asked to revise — the gate is the contract, not a reviewer's mood.

## Contributing to site/ or mcp/

Both are deliberately small. `site/` renders the corpus for humans; `mcp/`
serves it to agents — stateless, deterministic, no LLM inside. Changes that
add state, keys, analytics, or runtime model calls are out of scope by
design; open an issue first if you think the design should change.

Tests must stay green (`cd mcp && npm test`), and the corpus validator runs
inside both build pipelines — a corpus violation fails every build.
