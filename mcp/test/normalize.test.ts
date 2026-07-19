import { describe, expect, it } from "vitest";
import { tokenize } from "../src/normalize.js";

describe("tokenize", () => {
  it("drops stopwords and single characters", () => {
    expect(tokenize("the AI is a tool")).toEqual(["tool"]);
  });

  it("marks the token after a negator", () => {
    expect(tokenize("the AI is not a tool")).toEqual(["not_tool"]);
    expect(tokenize("it never asked me")).toEqual(["not_ask"]);
    expect(tokenize("it doesn't check anything")).toEqual(["not_check", "anyth"]);
  });

  it("folds inflections onto one stem", () => {
    const stemOf = (w: string) => tokenize(w)[0];
    expect(stemOf("declared")).toBe(stemOf("declares"));
    expect(stemOf("summarized")).toBe(stemOf("summarize"));
    expect(stemOf("answers")).toBe(stemOf("answering"));
    expect(stemOf("confirmation")).toBe(stemOf("confirmations"));
  });

  it("handles quoted utterances and apostrophes", () => {
    const tokens = tokenize(`"you're absolutely right!" opening replies`);
    expect(tokens).toContain("right");
    expect(tokens[0]).toBe(tokenize("absolute")[0]);
  });

  it("returns empty for stopword-only input", () => {
    expect(tokenize("it is what it is")).toEqual([]);
  });
});
