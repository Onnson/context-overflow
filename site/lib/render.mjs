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
 *
 * Layout layer (all added at render time; the corpus contract is untouched):
 * the page body is scoped by its group hue (`co-group-*`), the two apply
 * sections carry voice rails (you / your agent), narration renders as
 * speech, depth sections (failure modes, evidence) collapse behind
 * anchors-preserving <details>, and the prompt section is the one
 * high-salience card on the page.
 */
export function renderTechnique(entry, category, edges, byId, categoryBySlug) {
  const { fm, sections } = entry;
  const [typeLabel, typeClass] = TYPE_LABEL[fm.type];

  const lines = [
    "---",
    "layout: default",
    `title: ${JSON.stringify(fm.name)}`,
    `description: ${JSON.stringify(fm.scent)}`,
    `parent: ${JSON.stringify(category.title)}`,
    `permalink: /${category.slug}/${fm.id}/`,
    "---",
    "",
    `<div class="co-page co-group-${category.group}" markdown="1">`,
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
    '<div class="co-voice co-voice-you" markdown="1">',
    "",
    "## How to apply (you)",
    "",
    sections["How to apply — human"],
    "",
    "</div>",
    "",
    '<div class="co-voice co-voice-agent" markdown="1">',
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
    '<div class="co-narration" markdown="1">',
    "",
    sections["Narration"],
    "",
    "</div>",
    "",
    "**Your agent can pull this page itself, by name** — one-time setup on",
    "the [connect page](/connect/). Until then, the standing prompt at the",
    "bottom of this page carries the technique by hand.",
    "",
    "### How you know it's working",
    "",
    sections["Verification"],
    "",
    "</div>",
    "",
    '<details class="co-depth" markdown="1">',
    '<summary id="failure-modes">Failure modes</summary>',
    "",
    sections["Failure modes"],
    "",
    "</details>",
    "",
    '<details class="co-depth" markdown="1">',
    '<summary id="evidence--field-notes">Evidence &amp; field notes</summary>',
    "",
    evidenceBlock(fm),
    "",
    sections["Field notes"],
    "",
    "</details>",
    "",
    '<div class="co-prompt" markdown="1">',
    "",
    "## How to apply it in a prompt",
    "",
    sections["How to apply it in a prompt"],
    "",
    "</div>",
  ];

  const related = relatedBlock(edges.get(fm.id), byId, categoryBySlug);
  if (related) lines.push("", "---", "", related);
  lines.push("", jsonLd(fm, category), "", "</div>");
  return lines.join("\n") + "\n";
}

// TechArticle JSON-LD per technique page — headline/description mirror the
// page's own visible name and scent line (structured data must match text).
function jsonLd(fm, category) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: fm.name,
    description: fm.scent,
    url: `https://contextoverflow.org/${category.slug}/${fm.id}/`,
    isPartOf: { "@type": "WebSite", name: "ContextOverflow", url: "https://contextoverflow.org" },
    author: { "@type": "Organization", name: "ContextOverflow", url: "https://contextoverflow.org" },
  };
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
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
 * blind. The page body is scoped by its group hue like technique pages.
 */
export function renderCategory(category, navOrder, catEntries) {
  return [
    "---",
    "layout: default",
    `title: ${JSON.stringify(category.title)}`,
    `description: ${JSON.stringify(category.problem)}`,
    `nav_order: ${navOrder}`,
    "has_children: true",
    "has_toc: false",
    `permalink: /${category.slug}/`,
    "---",
    "",
    `<div class="co-page co-group-${category.group}" markdown="1">`,
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
    "</div>",
    "",
  ].join("\n");
}
