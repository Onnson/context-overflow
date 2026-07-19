import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { classify } from "./classify.js";
import { byId } from "./corpus.js";
import type { CoEvent } from "./observability.js";
import { applyTechnique } from "./tools/apply-technique.js";
import { classifyIntent } from "./tools/classify-intent.js";
import { findTechnique } from "./tools/find-technique.js";
import { getTechnique } from "./tools/get-technique.js";
import { listCategories } from "./tools/list-categories.js";

export const SERVER_INFO = { name: "contextoverflow", version: "0.1.0" };

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

/**
 * A fresh server per request — never reuse instances across requests
 * (cross-client response routing, CVE-2026-25536). The optional observe
 * callback receives one usage event per tool call.
 */
export function buildServer(observe?: (e: CoEvent) => void): McpServer {
  const server = new McpServer(SERVER_INFO, {
    instructions:
      "ContextOverflow serves thinking techniques shared by humans and agents. " +
      "Typical path: classify_intent (name the problem) → get_technique (learn it) → " +
      "apply_technique (run it) — but every tool stands alone. Narrate technique use " +
      "to your human in the exact vocabulary these tools return: they learned the same " +
      "techniques under the same names at contextoverflow.org.",
  });

  server.registerTool(
    "list_categories",
    {
      title: "List the eight problem categories",
      description:
        "The eight thinking-failure problems ContextOverflow covers, phrased the way a human experiences them. Start here to see what exists.",
      inputSchema: {},
    },
    async () => {
      observe?.({ event: "tool_call", tool: "list_categories", outcome: "served" });
      return text(listCategories());
    }
  );

  server.registerTool(
    "classify_intent",
    {
      title: "Match a problem description to techniques",
      description:
        "Describe what's going wrong — your human's complaint, or a failure you notice in your own behavior — and get the matching techniques. Deterministic matching; if the description fits two problems it returns one clarifying question instead of guessing.",
      inputSchema: {
        description: z
          .string()
          .min(1)
          .describe("The problem as experienced, in plain words — symptoms, not solution guesses"),
      },
    },
    async ({ description }) => {
      const r = classify(description);
      observe?.({
        event: "tool_call",
        tool: "classify_intent",
        outcome: r.kind,
        category: r.kind === "match" ? r.category : r.kind === "ambiguous" ? `${r.a}|${r.b}` : undefined,
        technique: r.kind === "match" ? r.ranked[0]?.entry.id : undefined,
        query: description,
      });
      return text(classifyIntent(description));
    }
  );

  server.registerTool(
    "find_technique",
    {
      title: "Look up a technique by name",
      description:
        "Direct lookup by technique id or name, for when you already know what you want. To match by symptom, use classify_intent instead.",
      inputSchema: {
        query: z.string().min(1).describe("Technique id (kebab-case) or name, exact or approximate"),
      },
    },
    async ({ query }) => {
      observe?.({ event: "tool_call", tool: "find_technique", outcome: "served", query });
      return text(findTechnique(query));
    }
  );

  server.registerTool(
    "get_technique",
    {
      title: "Learn a technique",
      description:
        "A technique's mechanism, agent instructions, narration template, verification, and failure modes — the agent-tailored slice. The full human page is linked, not inlined.",
      inputSchema: {
        id: z.string().min(1).describe("Technique id, e.g. from classify_intent or find_technique"),
      },
    },
    async ({ id }) => {
      const entry = byId.get(id);
      observe?.({
        event: "tool_call",
        tool: "get_technique",
        outcome: entry ? "served" : "not_found",
        category: entry?.category,
        technique: entry ? id : undefined,
        query: entry ? undefined : id,
      });
      return text(getTechnique(id));
    }
  );

  server.registerTool(
    "apply_technique",
    {
      title: "Run a technique now",
      description:
        "The minimal executable scaffold: steps (or self-diagnostic for anti-patterns), the narration line to say to your human, and the verification check that proves it worked.",
      inputSchema: {
        id: z.string().min(1).describe("Technique id to apply"),
      },
    },
    async ({ id }) => {
      const entry = byId.get(id);
      observe?.({
        event: "tool_call",
        tool: "apply_technique",
        outcome: entry ? "served" : "not_found",
        category: entry?.category,
        technique: entry ? id : undefined,
        query: entry ? undefined : id,
      });
      return text(applyTechnique(id));
    }
  );

  return server;
}
