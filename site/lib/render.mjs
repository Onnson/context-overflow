const TYPE_LABEL = {
  practice: ["Practice", "label-green"],
  "anti-pattern": ["Anti-pattern", "label-red"],
  protocol: ["Protocol", "label-purple"],
};

/**
 * Renders one technique entry as a Jekyll page in the human presentation
 * order: Problem → Mechanism → How to apply (you) → What your agent does
 * with this → Failure modes → Evidence & field notes → How to apply it in
 * a prompt, closed by resolved related-technique links.
 */
export function renderTechnique(entry, category, edges, byId, categoryBySlug) {
  const { fm, sections } = entry;
  const [typeLabel, typeClass] = TYPE_LABEL[fm.type];

  const lines = [
    "---",
    "layout: default",
    `title: ${JSON.stringify(fm.name)}`,
    `parent: ${JSON.stringify(category.title)}`,
    `permalink: /${category.slug}/${fm.id}/`,
    "---",
    "",
    `# ${fm.name}`,
    "",
    typeLabel,
    `{: .label .${typeClass} }`,
    "",
    `> ${fm.problem}`,
    "",
    "## Problem",
    "",
    sections["Problem"],
    "",
    "## Mechanism",
    "",
    sections["Mechanism"],
    "",
    "## How to apply (you)",
    "",
    sections["How to apply — human"],
    "",
    "## What your agent does with this",
    "",
    sections["How to apply — agent"],
    "",
    "### How it sounds",
    "",
    "The narration your agent uses so you can see the technique running —",
    "the same words you just learned here:",
    "",
    sections["Narration"],
    "",
    "**Your agent can pull this page itself, by name** — one-time setup on",
    "the [connect page](/connect/). Until then, the standing prompt at the",
    "bottom of this page carries the technique by hand.",
    "",
    "### How you know it's working",
    "",
    sections["Verification"],
    "",
    "## Failure modes",
    "",
    sections["Failure modes"],
    "",
    "## Evidence & field notes",
    "",
    evidenceBlock(fm),
    "",
    sections["Field notes"],
    "",
    "## How to apply it in a prompt",
    "",
    sections["How to apply it in a prompt"],
  ];

  const related = relatedBlock(edges.get(fm.id), byId, categoryBySlug);
  if (related) lines.push("", "---", "", related);
  return lines.join("\n") + "\n";
}

function evidenceBlock(fm) {
  const parts = [];
  if (fm.evidence === "real-use" || fm.evidence === "both") {
    parts.push(
      "**Evidence:** real production use — the field notes below are " +
        "generalized accounts of real instances."
    );
  }
  if (fm.evidence === "literature" || fm.evidence === "both") {
    parts.push(
      "**Sources:**",
      "",
      ...fm.sources.map((s) => `- ${s}`)
    );
  }
  return parts.join("\n");
}

function relatedBlock(byLabel, byId, categoryBySlug) {
  if (!byLabel || byLabel.size === 0) return "";
  const lines = ["**Related techniques**", ""];
  for (const [label, ids] of byLabel) {
    for (const id of [...ids].sort()) {
      const target = byId.get(id);
      const cat = categoryBySlug.get(target.fm.category);
      lines.push(`- ${label}: [${target.fm.name}](/${cat.slug}/${id}/)`);
    }
  }
  return lines.join("\n");
}

/**
 * Renders a category landing page. The theme's auto child list is suppressed
 * (has_toc: false) in favor of scent lines — each technique introduced by the
 * complaint-voiced moment it covers, so a reader can choose without clicking
 * blind.
 */
export function renderCategory(category, navOrder, catEntries) {
  return [
    "---",
    "layout: default",
    `title: ${JSON.stringify(category.title)}`,
    `nav_order: ${navOrder}`,
    "has_children: true",
    "has_toc: false",
    `permalink: /${category.slug}/`,
    "---",
    "",
    `# ${category.title}`,
    "",
    `> "${category.problem}"`,
    "",
    category.blurb,
    "",
    "## Which version of it is yours?",
    "",
    ...catEntries.map(
      (e) => `- [${e.fm.name}](/${category.slug}/${e.fm.id}/) — ${e.fm.scent}`
    ),
    "",
  ].join("\n");
}
