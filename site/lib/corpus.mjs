import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { parse as parseYaml } from "yaml";

/** Loads every technique entry: frontmatter + body sections keyed by heading. */
export function loadCorpus(techniquesDir) {
  const entries = [];
  for (const category of readdirSync(techniquesDir)) {
    const dir = join(techniquesDir, category);
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const raw = readFileSync(join(dir, file), "utf8");
      const match = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
      if (!match) throw new Error(`${category}/${file}: no frontmatter`);
      const fm = parseYaml(match[1]);
      if (fm.id !== basename(file, ".md")) {
        throw new Error(`${category}/${file}: id/filename mismatch`);
      }
      entries.push({ fm, sections: splitSections(match[2]) });
    }
  }
  return entries;
}

/** Splits a body into { "Section name": "content" }. */
function splitSections(body) {
  const parts = body.split(/^## (.+)$/m);
  const sections = {};
  for (let i = 1; i < parts.length; i += 2) {
    sections[parts[i].trim()] = parts[i + 1].trim();
  }
  return sections;
}

/**
 * Resolves related edges in both directions (one-directional declaration in
 * the corpus is enough — the contract says renderers resolve the reverse).
 * Returns Map<id, Map<label, Set<id>>>.
 */
export function resolveEdges(entries) {
  const FORWARD = {
    prevents: "Prevents",
    prevented_by: "Prevented by",
    contrasts_with: "Contrasts with",
    sibling_of: "Same family",
    derived_from: "Derived from",
  };
  const REVERSE = {
    prevents: "Prevented by",
    prevented_by: "Prevents",
    contrasts_with: "Contrasts with",
    sibling_of: "Same family",
    derived_from: "Basis of",
  };
  const edges = new Map(entries.map((e) => [e.fm.id, new Map()]));
  const add = (id, label, target) => {
    const byLabel = edges.get(id);
    if (!byLabel.has(label)) byLabel.set(label, new Set());
    byLabel.get(label).add(target);
  };
  for (const { fm } of entries) {
    for (const [edge, targets] of Object.entries(fm.related ?? {})) {
      for (const target of targets ?? []) {
        add(fm.id, FORWARD[edge], target);
        add(target, REVERSE[edge], fm.id);
      }
    }
  }
  return edges;
}
