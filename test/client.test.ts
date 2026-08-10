import { describe, expect, it } from "vitest";

import { Dugble } from "../src/index.js";

describe("Dugble", () => {
  it("creates a client with the default base URL", () => {
    const client = new Dugble("dug_test_example");

    expect(client.baseUrl).toBe("https://api.dugble.com");
  });

  it("rejects an empty API key", () => {
    expect(() => new Dugble("")).toThrow(
      'Missing API key. Pass it to the constructor: new Dugble("dug_123")',
    );
  });

  it("rejects an API key containing only whitespace", () => {
    expect(() => new Dugble("   ")).toThrow(TypeError);
  });

  it("accepts a custom base URL", () => {
    const client = new Dugble("dug_test_example", {
      baseUrl: "http://localhost:8080",
    });

    expect(client.baseUrl).toBe("http://localhost:8080");
  });

  it("removes trailing slashes from the base URL", () => {
    const client = new Dugble("dug_test_example", {
      baseUrl: "http://localhost:8080///",
    });

    expect(client.baseUrl).toBe("http://localhost:8080");
  });
});
