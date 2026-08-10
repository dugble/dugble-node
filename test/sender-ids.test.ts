import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Sender IDs", () => {
  it("creates a sender id with serialized options", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            id: "sender_123",
            team_id: "team_123",
            name: "Dugble",
            country_code: "GH",
            purpose: "Transactional notifications",
            status: "pending",
            created_at: "2026-08-10T00:00:00Z",
            updated_at: "2026-08-10T00:00:00Z",
          },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );

    const client = new Dugble("dgb_team_test");
    await client.senderIds.create({
      name: "Dugble",
      countryCode: "GH",
      purpose: "Transactional notifications",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/sender-ids",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Dugble",
          country_code: "GH",
          purpose: "Transactional notifications",
        }),
      }),
    );
  });

  it("deletes an encoded sender id", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Dugble("dgb_team_test");
    await client.senderIds.delete("sender/123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/sender-ids/sender%2F123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
