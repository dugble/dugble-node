import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Email events", () => {
  it("lists email events with a limit", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            object: "list",
            data: [
              {
                id: "event_123",
                type: "delivered",
                occurred_at: "2026-08-10T08:00:00Z",
                provider: "ses",
              },
            ],
          },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    const response = await client.emails.events("email_123", { limit: 20 });

    expect(response.error).toBeNull();
    expect(response.data).toEqual({
      object: "list",
      data: [
        {
          id: "event_123",
          type: "delivered",
          occurred_at: "2026-08-10T08:00:00Z",
          provider: "ses",
        },
      ],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/emails/email_123/events?limit=20",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("encodes the email ID when listing events", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            object: "list",
            data: [],
          },
        }),
        { status: 200 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.emails.events("email/123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/emails/email%2F123/events",
      expect.objectContaining({ method: "GET" }),
    );
  });
});
