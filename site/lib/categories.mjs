// The four problem groups. Grouping is a human-side presentation layer:
// the MCP and classifier stay flat. Sizes 3/4/3/1 keep every chunk inside
// working-memory limits; "you" stands alone on purpose — it's the thesis
// group ("not dumber because of it") and carries the brand hue.
export const GROUPS = [
  { slug: "trust", label: "Can I believe it?" },
  { slug: "exec", label: "It's not doing what I asked" },
  { slug: "fit", label: "It doesn't fit" },
  { slug: "you", label: "What's it doing to me?" },
];

// Human-facing copy for the major problem categories.
// Array order is sidebar order (after Home).
export const CATEGORIES = [
  {
    slug: "lost-the-thread",
    group: "fit",
    title: "Lost the thread",
    problem: "My AI forgets everything between sessions",
    blurb:
      "Context windows end; work doesn't. These techniques make continuity a " +
      "practice instead of a hope — externalized context, handoffs, " +
      "checkpoints, and recovery when the thread is already gone.",
  },
  {
    slug: "doing-my-thinking",
    group: "you",
    title: "Doing my thinking",
    problem: "I'm outsourcing my thinking and getting dumber",
    blurb:
      "The point of working with an AI is to extend your thinking, not to " +
      "stop doing it. These techniques keep you in the reasoning loop while " +
      "still getting the leverage. The research calls the cost of skipping " +
      "this *cognitive debt* — [the studies, and the counters](/cognitive-debt/).",
  },
  {
    slug: "confidently-wrong",
    group: "trust",
    title: "Confidently wrong",
    problem: "My AI states things that turn out to be false",
    blurb:
      "Fluent prose and verified fact feel identical when you read them. " +
      "These techniques force the difference into the open — grounding, " +
      "labeling, and proof before any claim of success.",
  },
  {
    slug: "agrees-with-everything",
    group: "trust",
    title: "Agrees with everything",
    problem: "My AI tells me I'm right even when I'm not",
    blurb:
      "An assistant that always agrees is a mirror, not a collaborator. " +
      "These techniques buy you honest disagreement — and teach you to stop " +
      "rewarding the reflex that kills it.",
  },
  {
    slug: "stalls-instead-of-acting",
    group: "exec",
    title: "Stalls instead of acting",
    problem: "The AI stalls instead of acting",
    blurb:
      "You authorized the work, and you got a plan, a recap, and a question " +
      "that wasn't one. These techniques remove the stall at its source — " +
      "the slot where permission-seeking lives.",
  },
  {
    slug: "bloated-answers",
    group: "exec",
    title: "Bloated answers",
    problem: "I ask something simple and get a wall of text",
    blurb:
      "Length is not thoroughness, and eloquence can be a place to hide. " +
      "These techniques get you the smallest answer that actually works.",
  },
  {
    slug: "starting-blind",
    group: "exec",
    title: "Starting blind",
    problem: "It starts producing before it understands the task",
    blurb:
      "Output that begins before understanding ends is rework in disguise. " +
      "These techniques put comprehension checks in front of production — " +
      "so you and your AI start from the same picture of the task.",
  },
  {
    slug: "problem-too-big",
    group: "fit",
    title: "Problem too big",
    problem: "The task is too big and it (or I) can't hold it",
    blurb:
      "Some tasks don't fit in one head or one context window. These " +
      "techniques carve them until every piece does — modes, branches, and " +
      "dependencies first.",
  },
  {
    slug: "faster-than-i-can-review",
    group: "fit",
    title: "Faster than I can review",
    problem: "My AI produces more than I can review",
    blurb:
      "Generation stopped being the bottleneck; your attention did. These " +
      "techniques put review effort where the risk is — adversarial " +
      "cross-checks, depth that scales with blast radius, and samples that " +
      "actually measure.",
  },
  {
    slug: "did-more-than-i-asked",
    group: "exec",
    title: "Did more than I asked",
    problem: "My AI did more than I asked it to",
    blurb:
      "The task was one function; the diff touched nine files. These " +
      "techniques draw the line before work starts — scope contracts, " +
      "reversible-by-default, and stopping at the first surprise.",
  },
  {
    slug: "dumber-after-the-update",
    group: "trust",
    title: "Dumber after the update",
    problem: "My AI got worse after an update",
    blurb:
      "Maybe the model changed; maybe your context rotted; maybe your " +
      "prompts were tuned to quirks that moved. These techniques turn the " +
      "feeling into a test you can run.",
  },
];
