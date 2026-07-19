import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CATEGORIES } from "./lib/categories.mjs";
import { loadCorpus, resolveEdges } from "./lib/corpus.mjs";
import { renderCategory, renderTechnique } from "./lib/render.mjs";

const SITE = import.meta.dirname;
const ROOT = join(SITE, "..");
const VALIDATOR = join(ROOT, "validator");
const OUT = join(SITE, "techniques");

// Pre-build gate: the corpus validator must pass before anything is generated.
if (!existsSync(join(VALIDATOR, "node_modules"))) {
  const install = spawnSync("npm", ["ci"], { cwd: VALIDATOR, stdio: "inherit" });
  if (install.status !== 0) process.exit(install.status ?? 1);
}
const gate = spawnSync("npm", ["run", "validate"], { cwd: VALIDATOR, stdio: "inherit" });
if (gate.status !== 0) {
  console.error("site build aborted: corpus validation failed");
  process.exit(gate.status ?? 1);
}

const entries = loadCorpus(join(ROOT, "corpus", "techniques"));
const edges = resolveEdges(entries);
const byId = new Map(entries.map((e) => [e.fm.id, e]));
const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

rmSync(OUT, { recursive: true, force: true });
for (const [i, category] of CATEGORIES.entries()) {
  const dir = join(OUT, category.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.md"), renderCategory(category, i + 2));
}
for (const entry of entries) {
  const category = categoryBySlug.get(entry.fm.category);
  const page = renderTechnique(entry, category, edges, byId, categoryBySlug);
  writeFileSync(join(OUT, category.slug, `${entry.fm.id}.md`), page);
}

console.log(`generated ${CATEGORIES.length} category pages, ${entries.length} technique pages`);
