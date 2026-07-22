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
  const catEntries = entries.filter((e) => e.fm.category === category.slug);
  writeFileSync(join(dir, "index.md"), renderCategory(category, i + 2, catEntries));
}
for (const entry of entries) {
  const category = categoryBySlug.get(entry.fm.category);
  const page = renderTechnique(entry, category, edges, byId, categoryBySlug);
  writeFileSync(join(OUT, category.slug, `${entry.fm.id}.md`), page);
}

// Hand-written JSON-LD gate: every ld+json block in static site pages must
// parse, or the build fails before anything ships malformed structured data.
import { readFileSync, readdirSync } from "node:fs";
let ldBlocks = 0;
for (const f of readdirSync(SITE).filter((f) => f.endsWith(".md") || f.endsWith(".html"))) {
  const text = readFileSync(join(SITE, f), "utf8");
  for (const m of text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
      ldBlocks++;
    } catch (e) {
      console.error(`invalid JSON-LD in site/${f}: ${e.message}`);
      process.exit(1);
    }
  }
}

console.log(
  `generated ${CATEGORIES.length} category pages, ${entries.length} technique pages; ${ldBlocks} static JSON-LD blocks valid`
);
