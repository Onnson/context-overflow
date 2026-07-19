import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { handleDashboard } from "../src/dashboard.js";

describe("/_dash", () => {
  it("is invisible without a configured key (404 via SELF, no key in test env)", async () => {
    const res = await SELF.fetch("https://example.com/_dash");
    expect(res.status).toBe(404);
    const withGuess = await SELF.fetch("https://example.com/_dash?key=guess");
    expect(withGuess.status).toBe(404);
  });

  it("rejects a wrong key even when a key is configured", async () => {
    const req = new Request("https://example.com/_dash?key=wrong");
    const res = await handleDashboard(req, { DASH_KEY: "right" });
    expect(res.status).toBe(404);
  });

  it("reports missing data access with a correct key but no token", async () => {
    const req = new Request("https://example.com/_dash?key=right");
    const res = await handleDashboard(req, { DASH_KEY: "right" });
    expect(res.status).toBe(503);
  });
});
