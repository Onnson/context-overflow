import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

const MCP_URL = "https://example.com/mcp";

function rpc(body: unknown, headers: Record<string, string> = {}) {
  return SELF.fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const initRequest = (id: number) => ({
  jsonrpc: "2.0",
  id,
  method: "initialize",
  params: {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "test-client", version: "0.0.0" },
  },
});

const callRequest = (id: number, name: string, args: Record<string, unknown>) => ({
  jsonrpc: "2.0",
  id,
  method: "tools/call",
  params: { name, arguments: args },
});

describe("streamable http endpoint", () => {
  it("answers initialize statelessly — JSON body, no session header", async () => {
    const res = await rpc(initRequest(1));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(res.headers.get("mcp-session-id")).toBeNull();
    const body = (await res.json()) as any;
    expect(body.result.serverInfo.name).toBe("contextoverflow");
  });

  it("lists exactly the five tools", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 2, method: "tools/list" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    const names = body.result.tools.map((t: any) => t.name).sort();
    expect(names).toEqual([
      "apply_technique",
      "classify_intent",
      "find_technique",
      "get_technique",
      "list_categories",
    ]);
  });

  it("executes tools/call and the response narrates", async () => {
    const res = await rpc(
      callRequest(3, "classify_intent", {
        description: "I ask something simple and get a wall of text",
      })
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.result.content[0].text).toContain("**Narrate**");
    expect(body.result.content[0].text).toContain("bloated-answers");
  });

  it("routes concurrent requests with identical JSON-RPC ids to the right callers", async () => {
    const [a, b] = await Promise.all([
      rpc(callRequest(7, "get_technique", { id: "caution-as-evasion-loop" })),
      rpc(callRequest(7, "get_technique", { id: "self-ask-first" })),
    ]);
    const [bodyA, bodyB] = [(await a.json()) as any, (await b.json()) as any];
    expect(bodyA.result.content[0].text).toContain("Caution-as-Evasion Loop");
    expect(bodyB.result.content[0].text).toContain("Self-Ask");
  });

  it("rejects GET on /mcp with 405 and a pointer to the connect docs", async () => {
    const res = await SELF.fetch(MCP_URL);
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toContain("POST");
    expect(await res.text()).toContain("contextoverflow.org/connect");
  });

  it("rejects disallowed origins with 403", async () => {
    const res = await rpc(initRequest(4), { Origin: "https://evil.example.com" });
    expect(res.status).toBe(403);
  });

  it("accepts our own origin and reflects CORS headers", async () => {
    const res = await rpc(initRequest(5), { Origin: "https://contextoverflow.org" });
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://contextoverflow.org");
  });

  it("answers preflight for allowed origins", async () => {
    const res = await SELF.fetch(MCP_URL, {
      method: "OPTIONS",
      headers: { Origin: "https://contextoverflow.org", "Access-Control-Request-Method": "POST" },
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-headers")).toContain("Mcp-Protocol-Version");
  });

  it("redirects strays to the site", async () => {
    const res = await SELF.fetch("https://example.com/", { redirect: "manual" });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://contextoverflow.org/");
  });

  it("explains stray POSTs instead of redirecting them", async () => {
    const res = await SELF.fetch("https://example.com/wrong-path", {
      method: "POST",
      body: "{}",
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("/mcp");
  });

  it("treats /mcp/ with a trailing slash as the endpoint", async () => {
    const res = await SELF.fetch("https://example.com/mcp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 11, method: "tools/list" }),
    });
    expect(res.status).toBe(200);
  });

  it("serves CORS headers on the GET 405 for allowed origins", async () => {
    const res = await SELF.fetch(MCP_URL, {
      headers: { Origin: "https://contextoverflow.org" },
    });
    expect(res.status).toBe(405);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://contextoverflow.org");
  });

  describe("landing /classify endpoint", () => {
    const classifyReq = (body: unknown) =>
      SELF.fetch("https://example.com/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    it("returns a match with technique links", async () => {
      const res = await classifyReq({ description: "I ask something simple and get a wall of text" });
      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.kind).toBe("match");
      expect(body.category.slug).toBe("bloated-answers");
      expect(body.techniques[0].url).toContain("https://contextoverflow.org/bloated-answers/");
    });

    it("returns two options on ambiguity", async () => {
      const res = await classifyReq({
        description: "it tells me I'm right even when I'm wrong and buries everything in walls of text",
      });
      const body = (await res.json()) as any;
      expect(body.kind).toBe("ambiguous");
      expect(body.options).toHaveLength(2);
    });

    it("routes setup complaints to the free consultation", async () => {
      const res = await classifyReq({
        description: "agent is doing something and its running in the background and i dont know whats happening",
      });
      const body = (await res.json()) as any;
      expect(body.kind).toBe("setup");
      expect(body.url).toBe("https://contextoverflow.org/not-a-technique/");
      expect(body.cal).toContain("https://cal.com/onnson/15min");
    });

    it("returns the eight-problem menu on no match", async () => {
      const res = await classifyReq({ description: "how do I bake sourdough bread" });
      const body = (await res.json()) as any;
      expect(body.kind).toBe("no_match");
      expect(body.options).toHaveLength(8);
    });

    it("rejects empty and malformed bodies with 400, GET with 405", async () => {
      expect((await classifyReq({ description: "" })).status).toBe(400);
      const bad = await SELF.fetch("https://example.com/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{nope",
      });
      expect(bad.status).toBe(400);
      expect((await SELF.fetch("https://example.com/classify")).status).toBe(405);
    });
  });

  // The behaviors below live in the SDK — pinned so an SDK upgrade that
  // changes any of them fails loudly here instead of in a client.
  describe("pinned SDK transport behaviors", () => {
    it("notification-only POST returns 202 with no body", async () => {
      const res = await rpc({ jsonrpc: "2.0", method: "notifications/initialized" });
      expect(res.status).toBe(202);
    });

    it("DELETE returns 405 in stateless mode", async () => {
      const res = await SELF.fetch(MCP_URL, { method: "DELETE" });
      expect(res.status).toBe(405);
    });

    it("missing Accept header is rejected with 406", async () => {
      const res = await SELF.fetch(MCP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 12, method: "tools/list" }),
      });
      expect(res.status).toBe(406);
    });

    it("unsupported MCP-Protocol-Version is rejected with 400", async () => {
      const res = await rpc(
        { jsonrpc: "2.0", id: 13, method: "tools/list" },
        { "MCP-Protocol-Version": "1999-01-01" }
      );
      expect(res.status).toBe(400);
    });

    it("a spurious Mcp-Session-Id is tolerated in stateless mode", async () => {
      const res = await rpc(
        { jsonrpc: "2.0", id: 14, method: "tools/list" },
        { "Mcp-Session-Id": "not-a-real-session" }
      );
      expect(res.status).toBe(200);
    });

    it("malformed JSON body returns 400 with a parse error", async () => {
      const res = await SELF.fetch(MCP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: "{not json",
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as any;
      expect(body.error.code).toBe(-32700);
    });
  });
});
