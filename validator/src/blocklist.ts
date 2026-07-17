import { createHash } from "node:crypto";

/**
 * Privacy blocklist — build-failing.
 *
 * Certain names, project identifiers, and phrases from the corpus's origin
 * environment must never appear in any public artifact. The terms are not
 * stored here in plaintext — a public repository must not disclose the very
 * words it bans — only their SHA-256 digests. The scanner hashes every
 * 1-gram and 2-gram of normalized text and fails the build on a match,
 * reporting the matched text locally (the match is only recoverable when
 * the term is already present, i.e., when the leak already exists).
 *
 * There is deliberately no allowlist: a legitimate collision is resolved by
 * rewording, never by exempting.
 */
const BLOCKED_DIGESTS = new Set([
  "01979b66ee1794c473f53cafff0889e714aac28b2515e3572072424b919634f3",
  "83d1f3ea4a6454945febd9c72dc116f18835df079f1570d5d66119ac3ea7ea52",
  "3164ce82f9cba0251951fd4137317aed723dbf1b7d6e7470be3c81613272af41",
  "838b3abf49036ad2443f3fe78c6120f816fdf057be2a559d6ee379744de695c6",
  "68925cf043e92f25c7feff95d42c79170996b52a26f76b063c94bf5727e251b2",
  "301367bcaf3584470e40c76942b942350c0c0c3cabb7eba2e48fe70210d155c5",
  "52cc1292d409d77a0995a1b8d4763f7bbd72b5c5b22f3bb1b33fb538c943ade2",
  "8df6d404b49cda767ccb3a380c95ed73bd312cc99f0512d4d42cc0a9578a5b6d",
  "2b726fe07b4c50ba2f7cd053ea5d2686f775f789f1356405be51fc8bddad4949",
  "ad08e9c78fc012753819743cdb922698880527a8b79287efc35c9d25e7e714a7",
  "6c033c8020c7e46982878e94ed7c34f5a1ddc03a71a6e2d44b2846b539d45b30",
  "0ce0c8a35f762e88211491a8225937931f32bbf8a631d9b8607cd6a5ad95ae40",
  "b7e507f7b30caff568e11c613de215eba2f861b8545ef8c30298fdf9ddcd97e8",
  "3f7840ca44ad810ed06059f35a22dfab7c7492c8a60a0dfa7e5dc14c7c882cdb",
  "1fdd09833201a724ad027842e44a7753941cca5e0b5d1abdf5a3a94301412cc2",
  "ec6f049478046f72becb006a2339202eae93911281dd610a7c869adec1ba3297",
  "795b104abe3e4134960ca245ded0e617f162c751209347b7f003bc35e062f43e",
  "76891d6fef4278faeebbcacde7f0ae391e6b5911cd004fe5e3c62649417545cf",
  "70e0378cb382c367677a60f53555984eb6d6dfbe1a510c9b35921d979134bc83",
  "0e667efb9676969d1f07334dd7c73e49d0fdc7936c5466c5b88656e1949297d3",
  "27ce135e3b780a2fd22737bd06d9ba95257c5f909b432b0bce5789812fcda80a",
  "c02df3e7eee6b5d03a29ab9235b7ab160a5306331c76203d26aafafe9b37f0b4",
  "a598026f05cde9f5e1d4a8950ca3f487577858effc47374436624f03a3e976c1",
  "59d7847ee5d0cacd5cde14624457fa1e5a09eb8f89332ccb24160022fbb7c114",
  "5dd95c98aff2e783a09348f600def0d5e4e476f71e85e9be91de86aab36544cd",
  "d7a2c260f4a352b88057b8621d36e3464a441b3f145c3200596d904660fbe37d",
]);

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Returns a hit description per blocked term found in the text. */
export function scanForBlocked(text: string): string[] {
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const hits = new Set<string>();
  for (let i = 0; i < tokens.length; i++) {
    if (BLOCKED_DIGESTS.has(sha256(tokens[i]))) {
      hits.add(`blocked term → "${tokens[i]}"`);
    }
    if (i + 1 < tokens.length) {
      const bigram = `${tokens[i]} ${tokens[i + 1]}`;
      if (BLOCKED_DIGESTS.has(sha256(bigram))) {
        hits.add(`blocked term → "${bigram}"`);
      }
    }
  }
  return [...hits];
}
