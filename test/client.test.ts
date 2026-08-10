import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Emails", () => {
  it("sends authorization and JSON headers", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            object: "email",
            id: "email_123",
          },
        }),
        {
          status: 202,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.emails.send(
      {
        from: "Dugble <hello@example.com>",
        to: "customer@example.com",
        subject: "Welcome",
        html: "<h1>Welcome</h1>",
      },
      {
        idempotencyKey: "request_123",
      },
    );

    expect(fetchMock).toHaveBeenCalledOnce();

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [url, options] = call;

    expect(url).toBe("https://api.dugble.com/emails");
    expect(options?.method).toBe("POST");

    const headers = new Headers(options?.headers);

    expect(headers.get("Authorization")).toBe("Bearer dug_test_example");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("Idempotency-Key")).toBe("request_123");
  });

  it("unwraps successful API envelopes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            object: "email",
            id: "email_123",
          },
        }),
        {
          status: 202,
        },
      ),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.emails.send(
      {
        to: "customer@example.com",
        subject: "Welcome",
        text: "Welcome",
      },
      {
        idempotencyKey: "request_123",
      },
    );

    expect(response.data).toEqual({
      object: "email",
      id: "email_123",
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
            message: "Invalid recipient",
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

    const response = await client.emails.send(
      {
        to: "invalid",
        subject: "Welcome",
        text: "Welcome",
      },
      {
        idempotencyKey: "request_123",
      },
    );

    expect(response.data).toBeNull();

    expect(response.error).toEqual({
      code: "BAD_REQUEST",
      message: "Invalid recipient",
      statusCode: 400,
      requestId: "req_123",
    });
  });
});
