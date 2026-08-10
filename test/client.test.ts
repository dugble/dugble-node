import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Emails", () => {
  it("sends authorization, JSON, and idempotency headers", async () => {
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
        to: ["customer@example.com"],
        subject: "Welcome",
        html: "<h1>Welcome</h1>",
        replyTo: "support@example.com",
        scheduledAt: "2026-08-10T07:00:00.000Z",
        attachments: [
          {
            filename: "hello.txt",
            content: "aGVsbG8=",
            contentType: "text/plain",
            contentId: "hello",
          },
        ],
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

    expect(JSON.parse(String(options?.body))).toEqual({
      from: "Dugble <hello@example.com>",
      to: ["customer@example.com"],
      subject: "Welcome",
      html: "<h1>Welcome</h1>",
      reply_to: "support@example.com",
      scheduled_at: "2026-08-10T07:00:00.000Z",
      attachments: [
        {
          filename: "hello.txt",
          content: "aGVsbG8=",
          content_type: "text/plain",
          content_id: "hello",
        },
      ],
    });
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

  it("gets an email", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            object: "email",
            id: "email_123",
          },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.emails.get("email/123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/emails/email%2F123",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("lists emails with pagination", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: [],
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.emails.list({ limit: 25, offset: 50 });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/emails?limit=25&offset=50",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("updates a scheduled email", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            object: "email",
            id: "email_123",
          },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.emails.update({
      id: "email_123",
      scheduledAt: "2026-08-10T07:00:00.000Z",
    });

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [url, options] = call;

    expect(url).toBe("https://api.dugble.com/emails/email_123");
    expect(options?.method).toBe("PATCH");
    expect(JSON.parse(String(options?.body))).toEqual({
      scheduled_at: "2026-08-10T07:00:00.000Z",
    });
  });

  it("cancels an email", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            object: "email",
            id: "email_123",
          },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.emails.cancel("email_123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/emails/email_123/cancel",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sends multiple emails with emails.batch.send", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: [
            { object: "email", id: "email_1" },
            { object: "email", id: "email_2" },
          ],
        }),
        { status: 202 },
      ),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.emails.batch.send(
      [
        {
          from: "Dugble <hello@example.com>",
          to: ["foo@example.com"],
          subject: "hello world",
          html: "it works!",
        },
        {
          from: "Dugble <hello@example.com>",
          to: ["bar@example.com"],
          subject: "world hello",
          html: "it works!",
        },
      ],
      { idempotencyKey: "batch_123" },
    );

    expect(response.error).toBeNull();
    expect(response.data).toHaveLength(2);

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [url, options] = call;

    expect(url).toBe("https://api.dugble.com/emails/batch");
    expect(options?.method).toBe("POST");
    expect(new Headers(options?.headers).get("Idempotency-Key")).toBe(
      "batch_123",
    );
    expect(JSON.parse(String(options?.body))).toHaveLength(2);
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
