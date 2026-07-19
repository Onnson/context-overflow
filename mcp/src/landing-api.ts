import { classify } from "./classify.js";
import { CORPUS, categoryBySlug } from "./corpus.js";

/**
 * JSON endpoint behind the landing page's prompt box — the same
 * intent-classifying layer the MCP serves, shaped for a browser to render
 * links from. Same-origin with the site; deterministic; stores nothing.
 */

const SITE = "https://contextoverflow.org";

const categoryInfo = (slug: string) => {
  const c = categoryBySlug.get(slug)!;
  return { slug, problem: c.problem, url: `${SITE}/${slug}/` };
};

export async function handleClassify(request: Request): Promise<Response> {
  let description = "";
  try {
    const body = (await request.json()) as { description?: unknown };
    description = String(body.description ?? "").slice(0, 500);
  } catch {
    return Response.json({ error: "body must be JSON: {description}" }, { status: 400 });
  }
  if (!description.trim()) {
    return Response.json({ error: "description must be non-empty" }, { status: 400 });
  }

  const result = classify(description);

  if (result.kind === "match") {
    return Response.json({
      kind: "match",
      category: categoryInfo(result.category),
      alsoConsider: result.alsoConsider ? categoryInfo(result.alsoConsider) : null,
      techniques: result.ranked.slice(0, 3).map(({ entry }) => ({
        id: entry.id,
        name: entry.name,
        type: entry.type,
        url: entry.siteUrl,
      })),
    });
  }
  if (result.kind === "ambiguous") {
    return Response.json({
      kind: "ambiguous",
      options: [categoryInfo(result.a), categoryInfo(result.b)],
    });
  }
  return Response.json({
    kind: "no_match",
    options: CORPUS.categories.map((c) => categoryInfo(c.slug)),
  });
}
