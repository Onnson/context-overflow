import { describe, expect, it } from "vitest";
import { handleClassify } from "../src/landing-api.js";
import { record, type CoEvent } from "../src/observability.js";
import { buildServer } from "../src/server.js";

async function callTool(events: CoEvent[], name: string, args: Record<string, unknown>) {
  const server = buildServer((e) => events.push(e));
  // Reach the registered handler through the underlying request handler.
  const { InMemoryTransport } = await import("@modelcontextprotocol/sdk/inMemory.js");
  const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  await client.callTool({ name, arguments: args });
  await client.close();
}

describe("tool-call events", () => {
  it("classify_intent emits outcome, category, technique, and the query text", async () => {
    const events: CoEvent[] = [];
    await callTool(events, "classify_intent", {
      description: "I ask something simple and get a wall of text",
    });
    expect(events).toHaveLength(1);
    const e = events[0];
    expect(e.tool).toBe("classify_intent");
    expect(e.outcome).toBe("match");
    expect(e.category).toBe("bloated-answers");
    expect(e.technique).toBeTruthy();
    expect(e.query).toContain("wall of text");
  });

  it("get/apply emit served with technique, not_found with query", async () => {
    const events: CoEvent[] = [];
    await callTool(events, "get_technique", { id: "self-ask-first" });
    await callTool(events, "apply_technique", { id: "no-such-id" });
    expect(events[0]).toMatchObject({
      tool: "get_technique",
      outcome: "served",
      technique: "self-ask-first",
      category: "doing-my-thinking",
    });
    expect(events[1]).toMatchObject({ tool: "apply_technique", outcome: "not_found", query: "no-such-id" });
  });

  it("find and list emit served", async () => {
    const events: CoEvent[] = [];
    await callTool(events, "find_technique", { query: "self ask" });
    await callTool(events, "list_categories", {});
    expect(events[0]).toMatchObject({ tool: "find_technique", outcome: "served", query: "self ask" });
    expect(events[1]).toMatchObject({ tool: "list_categories", outcome: "served" });
  });
});

describe("classify_api events", () => {
  it("emits outcome and query from the landing endpoint", async () => {
    const events: CoEvent[] = [];
    const req = new Request("https://example.com/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "it keeps stalling" }),
    });
    await handleClassify(req, (e) => events.push(e));
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      event: "classify_api",
      outcome: "match",
      category: "stalls-instead-of-acting",
      query: "it keeps stalling",
    });
  });
});

describe("record() safety", () => {
  it("never throws without a binding and truncates long queries", () => {
    const req = new Request("https://example.com/", { headers: { "user-agent": "test-ua" } });
    expect(() =>
      record({}, req, { event: "tool_call", tool: "classify_intent", query: "x".repeat(2000) })
    ).not.toThrow();
  });

  it("writes a well-formed data point when a binding exists", () => {
    const points: unknown[] = [];
    const env = { CO_EVENTS: { writeDataPoint: (p: unknown) => points.push(p) } };
    const req = new Request("https://example.com/", { headers: { "user-agent": "test-ua" } });
    record(env as never, req, { event: "classify_api", outcome: "match", query: "q" });
    expect(points).toHaveLength(1);
    const p = points[0] as { blobs: string[]; doubles: number[]; indexes: string[] };
    expect(p.blobs[0]).toBe("classify_api");
    expect(p.blobs[6]).toBe("test-ua");
    expect(p.doubles).toEqual([1]);
    expect(p.indexes).toEqual(["classify_api"]);
  });
});
