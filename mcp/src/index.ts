import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { handleClassify } from "./landing-api.js";
import { buildServer } from "./server.js";

const SITE = "https://contextoverflow.org";
const CONNECT_DOC = `${SITE}/connect/`;

/** DNS-rebinding defense: browsers must only reach this from our own pages. */
function originAllowed(origin: string): boolean {
  try {
    const { protocol, hostname } = new URL(origin);
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    return protocol === "https:" && (hostname === "contextoverflow.org" || hostname === "www.contextoverflow.org");
  } catch {
    return false;
  }
}

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !originAllowed(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID",
    "Access-Control-Expose-Headers": "Mcp-Session-Id, MCP-Protocol-Version",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function withHeaders(response: Response, headers: Record<string, string>): Response {
  const out = new Response(response.body, response);
  for (const [k, v] of Object.entries(headers)) out.headers.set(k, v);
  return out;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (origin && !originAllowed(origin)) {
      return new Response("Forbidden origin", { status: 403 });
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === "/mcp" || url.pathname === "/mcp/") {
      if (request.method === "POST") {
        const server = buildServer();
        const transport = new WebStandardStreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
          enableJsonResponse: true,
        });
        await server.connect(transport);
        const response = await transport.handleRequest(request);
        return withHeaders(response, corsHeaders(origin));
      }
      return new Response(
        `This is the ContextOverflow MCP endpoint — an agent connects here over Streamable HTTP (POST).\nSetup instructions for every client: ${CONNECT_DOC}\nThe human side of the corpus: ${SITE}\n`,
        {
          status: 405,
          headers: {
            Allow: "POST, OPTIONS",
            "Content-Type": "text/plain; charset=utf-8",
            ...corsHeaders(origin),
          },
        }
      );
    }

    if (url.pathname === "/classify") {
      if (request.method === "POST") {
        return withHeaders(await handleClassify(request), corsHeaders(origin));
      }
      return new Response("POST JSON {description} to classify.", {
        status: 405,
        headers: { Allow: "POST, OPTIONS", ...corsHeaders(origin) },
      });
    }

    if (request.method === "GET") return Response.redirect(SITE, 302);
    return new Response(
      `Not an MCP endpoint. POST JSON-RPC to /mcp — setup instructions: ${CONNECT_DOC}\n`,
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders(origin) } }
    );
  },
};
