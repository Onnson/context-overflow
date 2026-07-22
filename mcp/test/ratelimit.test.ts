import { describe, expect, it } from "vitest";
import { rateLimit, type RateLimiter } from "../src/ratelimit.js";

const allow: RateLimiter = { limit: async () => ({ success: true }) };
const deny: RateLimiter = { limit: async () => ({ success: false }) };

const post = (ip?: string) =>
  new Request("https://example.com/classify", {
    method: "POST",
    headers: ip ? { "CF-Connecting-IP": ip } : {},
  });

describe("rateLimit", () => {
  it("returns 429 with Retry-After when the limiter denies", async () => {
    const res = await rateLimit(deny, post("1.2.3.4"));
    expect(res?.status).toBe(429);
    expect(res?.headers.get("Retry-After")).toBe("10");
  });

  it("proceeds (null) when the limiter allows", async () => {
    expect(await rateLimit(allow, post("1.2.3.4"))).toBeNull();
  });

  it("fails open (null) when the binding is absent", async () => {
    expect(await rateLimit(undefined, post("1.2.3.4"))).toBeNull();
  });

  it("fails open (null) when there is no client IP", async () => {
    expect(await rateLimit(deny, post())).toBeNull();
  });

  it("keys the limit on the client IP", async () => {
    const seen: string[] = [];
    const spy: RateLimiter = {
      limit: async ({ key }) => {
        seen.push(key);
        return { success: true };
      },
    };
    await rateLimit(spy, post("9.9.9.9"));
    expect(seen).toEqual(["9.9.9.9"]);
  });
});
