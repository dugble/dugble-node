import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SMS", () => {
  it("sends an SMS", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { object: "sms", id: "sms_123" },
        }),
        { status: 202 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.sms.send(
      {
        to: "+233555000000",
        from: "Dugble",
        body: "Hello from Dugble",
        scheduledAt: "2026-08-10T08:00:00.000Z",
      },
      { idempotencyKey: "sms_123" },
    );

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [url, options] = call;

    expect(url).toBe("https://api.dugble.com/sms");
    expect(options?.method).toBe("POST");
    expect(new Headers(options?.headers).get("Idempotency-Key")).toBe(
      "sms_123",
    );
    expect(JSON.parse(String(options?.body))).toEqual({
      to: "+233555000000",
      from: "Dugble",
      body: "Hello from Dugble",
      scheduled_at: "2026-08-10T08:00:00.000Z",
    });
  });

  it("gets an SMS", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: {} }), {
        status: 200,
      }),
    );

    const client = new Dugble("dug_test_example");

    await client.sms.get("sms/123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/sms/sms%2F123",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("lists SMS messages with pagination", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: [] }), {
        status: 200,
      }),
    );

    const client = new Dugble("dug_test_example");

    await client.sms.list({ limit: 25, offset: 50 });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/sms?limit=25&offset=50",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("updates a scheduled SMS", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { object: "sms", id: "sms_123" },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.sms.update({
      id: "sms_123",
      scheduledAt: "2026-08-10T08:00:00.000Z",
    });

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [url, options] = call;

    expect(url).toBe("https://api.dugble.com/sms/sms_123");
    expect(options?.method).toBe("PATCH");
    expect(JSON.parse(String(options?.body))).toEqual({
      scheduled_at: "2026-08-10T08:00:00.000Z",
    });
  });

  it("cancels an SMS", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { object: "sms", id: "sms_123" },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.sms.cancel("sms_123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/sms/sms_123/cancel",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("lists SMS events", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { object: "list", data: [] },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.sms.events("sms_123", { limit: 20 });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/sms/sms_123/events?limit=20",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("syncs SMS status", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: {} }), {
        status: 200,
      }),
    );

    const client = new Dugble("dug_test_example");

    await client.sms.syncStatus("sms_123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/sms/sms_123/sync-status",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sends multiple SMS messages with sms.batch.send", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: [
            { object: "sms", id: "sms_1" },
            { object: "sms", id: "sms_2" },
          ],
        }),
        { status: 202 },
      ),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.sms.batch.send(
      [
        {
          to: "+233555000001",
          from: "Dugble",
          body: "Hello one",
        },
        {
          to: "+233555000002",
          from: "Dugble",
          body: "Hello two",
        },
      ],
      { idempotencyKey: "sms_batch_123" },
    );

    expect(response.error).toBeNull();
    expect(response.data).toHaveLength(2);

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const [url, options] = call;

    expect(url).toBe("https://api.dugble.com/sms/batch");
    expect(options?.method).toBe("POST");
    expect(new Headers(options?.headers).get("Idempotency-Key")).toBe(
      "sms_batch_123",
    );
    expect(JSON.parse(String(options?.body))).toEqual([
      {
        to: "+233555000001",
        from: "Dugble",
        body: "Hello one",
      },
      {
        to: "+233555000002",
        from: "Dugble",
        body: "Hello two",
      },
    ]);
  });
});
