import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import { frontmatterSchema, type Frontmatter } from "./schema.js";
import { checkSections } from "./sections.js";
import { scanForBlocked } from "./blocklist.js";

const ROOT = join(import.meta.dirname, "..", "..");
const TECHNIQUES_DIR = join(ROOT, "corpus", "techniques");
const SKIP_DIRS = new Set([
  ".git",
  ".claude",
  "node_modules",
  "persistent_context",
  "_site",
  ".jekyll-cache",
  "vendor",
  ".bundle",
]);

const errors: string[] = [];
const fail = (file: string, msg: string) => errors.push(`${relative(ROOT, file)}: ${msg}`);

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

// Pass 1 — technique files: frontmatter, sections, id/path agreement.
const entries = new Map<string, Frontmatter>();
const techniqueFiles = [...walk(TECHNIQUES_DIR)].filter((f) => f.endsWith(".md"));

for (const file of techniqueFiles) {
  const raw = readFileSync(file, "utf8");
  const match = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) {
    fail(file, "no frontmatter block");
    continue;
  }
  const [, fmRaw, body] = match;

  let fm: Frontmatter;
  try {
    fm = frontmatterSchema.parse(parseYaml(fmRaw));
  } catch (e: any) {
    const issues = e.issues ?? [{ path: [], message: String(e) }];
    for (const issue of issues) fail(file, `frontmatter ${issue.path.join(".")}: ${issue.message}`);
    continue;
  }

  if (fm.id !== basename(file, ".md")) fail(file, `id '${fm.id}' does not match filename`);
  if (fm.category !== basename(dirname(file))) {
    fail(file, `category '${fm.category}' does not match directory`);
  }
  if (entries.has(fm.id)) fail(file, `duplicate id '${fm.id}'`);
  entries.set(fm.id, fm);

  for (const msg of checkSections(body)) fail(file, msg);
}

// Pass 2 — related-edge integrity: every edge targets an existing entry id.
for (const [id, fm] of entries) {
  for (const [edge, targets] of Object.entries(fm.related)) {
    for (const target of targets ?? []) {
      if (!entries.has(target)) fail(join(TECHNIQUES_DIR, id), `related.${edge} → '${target}' does not exist`);
      if (target === id) fail(join(TECHNIQUES_DIR, id), `related.${edge} → self-reference`);
    }
  }
}

// Pass 3 — privacy blocklist over every public file in the repository.
// One owner-ruled carve-out: the site footer's creator credit may carry
// exactly these identity digests; everything else stays blocked there too.
const FOOTER_CREDIT_PATH = "site/_includes/footer_custom.html";
const FOOTER_IDENTITY_DIGESTS = new Set([
  "76891d6fef4278faeebbcacde7f0ae391e6b5911cd004fe5e3c62649417545cf",
  "27ce135e3b780a2fd22737bd06d9ba95257c5f909b432b0bce5789812fcda80a",
  "ad08e9c78fc012753819743cdb922698880527a8b79287efc35c9d25e7e714a7",
]);
for (const file of walk(ROOT)) {
  const exempt = relative(ROOT, file) === FOOTER_CREDIT_PATH ? FOOTER_IDENTITY_DIGESTS : undefined;
  const hits = scanForBlocked(readFileSync(file, "utf8"), exempt);
  for (const hit of hits) fail(file, hit);
}

if (errors.length > 0) {
  console.error(`FAIL — ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`OK — ${entries.size} entries valid, edges intact, blocklist clean.`);
