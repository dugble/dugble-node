import { describe, expect, it } from "vitest";

import { Dugble } from "../src/index.js";

describe("Dugble", () => {
  it("creates a client", () => {
    const client = new Dugble("dug_test_example");

    expect(client.baseUrl).toBe("https://api.dugble.com");
  });

  it("rejects an empty API key", () => {
    expect(() => new Dugble("")).toThrow("Dugble API key is required.");
  });
});
