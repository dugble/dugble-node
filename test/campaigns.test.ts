import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

function response(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Campaigns", () => {
  it("creates a campaign with serialized SMS settings", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 201));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.create({
      name: "August SMS",
      segmentId: "segment_123",
      senderId: "sender_123",
      body: "Hello from Dugble",
      rateLimitPerSecond: 25,
      dailySendLimit: 1000,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/campaigns",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "August SMS",
          segment_id: "segment_123",
          sender_id: "sender_123",
          body: "Hello from Dugble",
          rate_limit_per_second: 25,
          daily_send_limit: 1000,
        }),
      }),
    );
  });

  it("lists campaigns with offset pagination", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response([]));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.list({ limit: 50, offset: 10 });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/campaigns?limit=50&offset=10",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("gets and deletes a campaign with an encoded id", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({}));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.get("campaign/123");
    await client.campaigns.delete("campaign/123");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.dugble.com/campaigns/campaign%2F123",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.dugble.com/campaigns/campaign%2F123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("updates a draft using its revision and can clear its daily limit", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.update("campaign_123", {
      revision: 4,
      name: "Updated SMS",
      segmentId: "segment_456",
      senderId: "sender_456",
      body: "Updated body",
      rateLimitPerSecond: 50,
      dailySendLimit: 0,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/campaigns/campaign_123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          revision: 4,
          name: "Updated SMS",
          segment_id: "segment_456",
          sender_id: "sender_456",
          body: "Updated body",
          rate_limit_per_second: 50,
          daily_send_limit: 0,
        }),
      }),
    );
  });

  it("previews a campaign without a request body", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.preview("campaign_123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/campaigns/campaign_123/preview",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("body");
  });

  it("sends immediately without an unnecessary request body", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 202));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.send("campaign_123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/campaigns/campaign_123/send",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("body");
  });

  it("schedules through send using an ISO timestamp", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 202));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.send("campaign_123", {
      scheduledAt: new Date("2026-08-11T12:00:00.000Z"),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/campaigns/campaign_123/send",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ scheduled_at: "2026-08-11T12:00:00.000Z" }),
      }),
    );
  });

  it("cancels and duplicates campaigns", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({}, 201));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.cancel("campaign_123");
    await client.campaigns.duplicate("campaign_123", {
      name: "September SMS",
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.dugble.com/campaigns/campaign_123/cancel",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("body");
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.dugble.com/campaigns/campaign_123/duplicate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "September SMS" }),
      }),
    );
  });

  it("lists campaign recipients with pagination", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response([]));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.recipients("campaign_123", {
      limit: 25,
      offset: 5,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/campaigns/campaign_123/recipients?limit=25&offset=5",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("gets cost estimate, exclusions, and analytics", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({}));

    const client = new Dugble("dgb_team_test");
    await client.campaigns.costEstimate("campaign_123");
    await client.campaigns.exclusions("campaign_123");
    await client.campaigns.analytics("campaign_123");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.dugble.com/campaigns/campaign_123/cost-estimate",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.dugble.com/campaigns/campaign_123/exclusions",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://api.dugble.com/campaigns/campaign_123/analytics",
      expect.objectContaining({ method: "GET" }),
    );
  });
});
