import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Transport", () => {
  it("adds protected SDK headers", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {},
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.get("/test", {
      headers: {
        Authorization: "Bearer wrong_key",
        "User-Agent": "something-else",
        "X-Custom-Header": "custom-value",
      },
    });

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [, options] = call;
    const headers = new Headers(options?.headers);

    expect(headers.get("Authorization")).toBe("Bearer dug_test_example");
    expect(headers.get("Accept")).toBe("application/json");
    expect(headers.get("User-Agent")).toMatch(/^dugble-node\//);
    expect(headers.get("X-Custom-Header")).toBe("custom-value");
  });

  it("does not send Content-Type when the request has no body", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {},
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.get("/test");

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [, options] = call;
    const headers = new Headers(options?.headers);

    expect(headers.get("Content-Type")).toBeNull();
    expect(headers.get("Accept")).toBe("application/json");
  });

  it("does not send Content-Type for a bodyless POST", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {},
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.post("/test");

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [, options] = call;
    const headers = new Headers(options?.headers);

    expect(options?.method).toBe("POST");
    expect(headers.get("Content-Type")).toBeNull();
  });

  it("sends Content-Type when the request has a JSON body", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {},
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.post("/test", {
      hello: "world",
    });

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [, options] = call;
    const headers = new Headers(options?.headers);

    expect(options?.method).toBe("POST");
    expect(headers.get("Content-Type")).toBe("application/json");

    expect(JSON.parse(String(options?.body))).toEqual({
      hello: "world",
    });
  });

  it("unwraps successful API envelopes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            id: "resource_123",
          },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.get<{ id: string }>("/test");

    expect(response.data).toEqual({
      id: "resource_123",
    });
    expect(response.error).toBeNull();
  });

  it("returns structured API errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "The request is invalid",
          },
        }),
        {
          status: 400,
          headers: {
            "x-request-id": "req_123",
          },
        },
      ),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.get("/test");

    expect(response.data).toBeNull();
    expect(response.error).toEqual({
      code: "BAD_REQUEST",
      message: "The request is invalid",
      statusCode: 400,
      requestId: "req_123",
    });
  });

  it("returns NETWORK_ERROR when fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("connection refused"),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.get("/test");

    expect(response.data).toBeNull();
    expect(response.headers).toBeNull();
    expect(response.error).toEqual({
      code: "NETWORK_ERROR",
      message: "connection refused",
      statusCode: null,
    });
  });

  it("returns INVALID_RESPONSE when the API response is not valid JSON", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>Bad gateway</html>", {
        status: 502,
        headers: {
          "Content-Type": "text/html",
          "x-request-id": "req_invalid_json",
        },
      }),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.get("/test");

    expect(response.data).toBeNull();
    expect(response.error).toEqual({
      code: "INVALID_RESPONSE",
      message: "The Dugble API returned an invalid JSON response.",
      statusCode: 502,
      requestId: "req_invalid_json",
    });
    expect(response.headers).not.toBeNull();
  });

  it("handles 204 responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, {
        status: 204,
        headers: {
          "x-request-id": "req_204",
        },
      }),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.post("/test");

    expect(response.data).toBeNull();
    expect(response.error).toBeNull();
    expect(response.headers).not.toBeNull();
  });

  it("passes AbortSignal to fetch", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {},
        }),
        { status: 200 },
      ),
    );

    const controller = new AbortController();
    const client = new Dugble("dug_test_example");

    await client.get("/test", {
      signal: controller.signal,
    });

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [, options] = call;

    expect(options?.signal).toBe(controller.signal);
  });
});
