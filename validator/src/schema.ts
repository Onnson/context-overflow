import { z } from "zod";

export const CATEGORIES = [
  "lost-the-thread",
  "doing-my-thinking",
  "confidently-wrong",
  "agrees-with-everything",
  "stalls-instead-of-acting",
  "bloated-answers",
  "starting-blind",
  "problem-too-big",
  "faster-than-i-can-review",
  "did-more-than-i-asked",
  "dumber-after-the-update",
] as const;

const idPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const edgeList = z.array(z.string().regex(idPattern)).default([]);

export const frontmatterSchema = z
  .object({
    id: z.string().regex(idPattern, "id must be kebab-case"),
    name: z.string().min(1),
    type: z.enum(["practice", "anti-pattern", "protocol"]),
    category: z.enum(CATEGORIES),
    problem: z.string().min(1),
    intent_signals: z.array(z.string().min(1)).min(1),
    related: z
      .object({
        prevents: edgeList,
        prevented_by: edgeList,
        contrasts_with: edgeList,
        sibling_of: edgeList,
        derived_from: edgeList,
      })
      .strict()
      .partial()
      .default({}),
    evidence: z.enum(["real-use", "literature", "both"]),
    sources: z.array(z.string().min(1)).default([]),
    inheritable: z.literal(true, {
      errorMap: () => ({
        message: "only inheritable entries belong in this corpus",
      }),
    }),
  })
  .strict()
  .superRefine((fm, ctx) => {
    if (fm.evidence !== "real-use" && fm.sources.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `evidence '${fm.evidence}' requires non-empty sources (verified citations only)`,
        path: ["sources"],
      });
    }
    if (fm.evidence === "real-use" && fm.sources.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "sources present but evidence is 'real-use' — use 'literature' or 'both'",
        path: ["evidence"],
      });
    }
  });

export type Frontmatter = z.infer<typeof frontmatterSchema>;
