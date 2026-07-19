export type TechniqueType = "practice" | "anti-pattern" | "protocol";
export type Evidence = "real-use" | "literature" | "both";

export interface RelatedEdges {
  prevents?: string[];
  prevented_by?: string[];
  contrasts_with?: string[];
  sibling_of?: string[];
  derived_from?: string[];
}

/**
 * The agent-tailored slice of a technique entry. Human-destination sections
 * (Problem narrative, How to apply — human, Field notes, the annotated
 * prompt walkthrough) deliberately stay out of the bundle: agents have token
 * limits, and the full page lives at siteUrl.
 */
export interface TechniqueEntry {
  id: string;
  name: string;
  type: TechniqueType;
  category: string;
  problem: string;
  intentSignals: string[];
  related: RelatedEdges;
  evidence: Evidence;
  sources: string[];
  siteUrl: string;
  sections: {
    mechanism: string;
    applyAgent: string;
    narration: string;
    verification: { human: string; agent: string };
    failureModes: string;
  };
}

export interface CategoryInfo {
  slug: string;
  problem: string;
  entryIds: string[];
}

export interface CorpusBundle {
  categories: CategoryInfo[];
  entries: TechniqueEntry[];
}
