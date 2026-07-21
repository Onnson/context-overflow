/**
 * Category vocabulary the corpus prose doesn't carry: the words real users
 * reach for when describing each problem. Part of the deterministic matcher,
 * not corpus content — extending it is a code change, reviewed like one.
 * Tokens here join the category document at signal weight.
 */
/**
 * Multi-word signatures that tokenization cannot see — several are made
 * entirely of stopwords ("would you like"). Matched as literal substrings of
 * the lowercased description; each hit injects a category marker token.
 */
export const CATEGORY_PHRASES: Record<string, string[]> = {
  "lost-the-thread": [
    "where we left off",
    "from scratch",
    "never happened",
    "between sessions",
    "lost track",
    "loses track",
  ],
  "doing-my-thinking": ["thinking for me", "for myself", "on my own", "my thinking"],
  "confidently-wrong": ["made up", "turns out to be false", "turn out to be false", "never ran", "no proof"],
  "agrees-with-everything": [
    "absolutely right",
    "great question",
    "you're right",
    "you are right",
    "poke holes",
  ],
  "stalls-instead-of-acting": [
    "would you like",
    "want me to",
    "shall i",
    "should i proceed",
    "should i go ahead",
    "before i proceed",
    "waiting for your approval",
    "let me know if",
  ],
  "bloated-answers": ["wall of text", "get to the point", "too long", "long-winded"],
  "starting-blind": [
    "didn't ask",
    "never asked",
    "jumps straight",
    "without checking",
    "what i actually need",
    "what i need",
  ],
  "problem-too-big": ["at once", "too big", "where do we even start"],
  "faster-than-i-can-review": [
    "faster than i can review",
    "cant keep up",
    "can't keep up",
    "too much to review",
    "keep up with the",
    "more code than i can",
    "rubber stamp",
    "rubber-stamping",
  ],
  "did-more-than-i-asked": [
    "more than i asked",
    "didn't ask it to",
    "didnt ask it to",
    "didn't ask for",
    "didnt ask for",
    "went ahead and",
    "out of scope",
    "on its own",
    "without asking me",
    "half the repo",
  ],
  "dumber-after-the-update": [
    "after the update",
    "since the update",
    "after the upgrade",
    "since the upgrade",
    "got dumber",
    "gotten dumber",
    "gotten worse",
    "used to be able",
    "used to nail",
    "worse than before",
    "nerfed",
  ],
};

export const CATEGORY_LEXICON: Record<string, string[]> = {
  "lost-the-thread": [
    "forgets forgot forgetting remember memory amnesia yesterday continuity",
    "restart scratch re-explain repeat context window compaction resumed",
    "track loses halfway happened decided agreed earlier previous",
    "recollection prior spoke chat chats pasting onboarding",
  ],
  "doing-my-thinking": [
    "outsourcing offload offloading atrophy atrophying dependent dependence",
    "crutch lazy skills reasoning dumber rubber stamp brain",
    "myself anymore own rotting rusty",
  ],
  "confidently-wrong": [
    "hallucinate hallucination false wrong incorrect fabricated invented",
    "asserting claims claimed gospel unverified proof succeeded success lied",
    "exists swore insists insisted citations cited confidence nonexistent",
    "sure certain sounded",
  ],
  "agrees-with-everything": [
    "agrees agree agreeing sycophant sycophancy flattery flattering praise",
    "validates disagree disagrees pushback yes-man contrarian honest",
    "compliment complimented critique criticize challenge",
    "never disagrees never pushes back",
  ],
  "stalls-instead-of-acting": [
    "stalls stalling stalled permission confirmation confirm halts hesitates",
    "green light authorized approval proceed executing asks nags checking",
    "ends message offering offer closers upfront",
  ],
  "bloated-answers": [
    "verbose verbosity wall text rambling padded padding essay concise",
    "long-winded brief shorter skim buried paragraphs recap recaps tutorial command",
  ],
  "starting-blind": [
    "clarifying assumed assumption premature misread misunderstood requirements",
    "jumps straight ahead brief spec understanding dumping churning describing",
  ],
  "problem-too-big": [
    "huge massive enormous overwhelming spans decompose breakdown subtasks",
    "chokes large scope pieces split smaller entire migration once",
  ],
  "faster-than-i-can-review": [
    "review reviewing reviewed reviewer backlog diff diffs prs pull requests",
    "merge merged velocity throughput volume flood firehose churns spits",
    "verify verification skim skimming reading catch bottleneck attention",
  ],
  "did-more-than-i-asked": [
    "scope creep unrelated extra refactored rewrote restructured renamed",
    "deleted overwrote touched modified unasked unrequested initiative",
    "liberties boundaries rogue overreach overstepped everything else",
  ],
  "dumber-after-the-update": [
    "regression regressed update updated upgrade upgraded version model",
    "worse dumber degraded downgraded nerfed lazier lazy quality decline",
    "suddenly overnight release rollout",
  ],
};
