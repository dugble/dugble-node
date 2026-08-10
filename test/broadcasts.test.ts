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

describe("Broadcasts", () => {
  it("creates a broadcast with serialized audience fields", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 201));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.create({
      name: "August update",
      segmentId: "segment_123",
      topicId: "topic_123",
      template: "newsletter",
      variableBindings: { company: "Dugble" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "August update",
          segment_id: "segment_123",
          template: "newsletter",
          topic_id: "topic_123",
          variable_bindings: { company: "Dugble" },
        }),
      }),
    );
  });

  it("lists broadcasts with offset pagination", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response([]));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.list({ limit: 50, offset: 10 });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts?limit=50&offset=10",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("updates a draft using its revision", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.update("broadcast/123", {
      revision: 4,
      name: "Updated name",
      segmentId: "segment_456",
      template: "template_456",
      variableBindings: { plan: "pro" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast%2F123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          revision: 4,
          name: "Updated name",
          segment_id: "segment_456",
          template: "template_456",
          variable_bindings: { plan: "pro" },
        }),
      }),
    );
  });

  it("clears a broadcast topic with null", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.update("broadcast_123", {
      revision: 5,
      topicId: null,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ revision: 5, topic_id: null }),
      }),
    );
  });

  it("sends immediately without an unnecessary request body", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 202));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.send("broadcast_123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123/send",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("body");
  });

  it("schedules a broadcast using an ISO timestamp", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 202));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.send("broadcast_123", {
      scheduledAt: new Date("2026-08-11T12:00:00.000Z"),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123/send",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ scheduled_at: "2026-08-11T12:00:00.000Z" }),
      }),
    );
  });

  it("previews a broadcast with variables", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.preview("broadcast_123", {
      variables: { first_name: "Ada" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123/preview",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ variables: { first_name: "Ada" } }),
      }),
    );
  });

  it("duplicates a broadcast into a new draft", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 201));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.duplicate("broadcast_123", {
      name: "September update",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123/duplicate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "September update" }),
      }),
    );
  });

  it("lists recipients with pagination", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response([]));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.recipients("broadcast_123", {
      limit: 25,
      offset: 5,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123/recipients?limit=25&offset=5",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("gets exclusions and analytics", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({}));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.exclusions("broadcast_123");
    await client.broadcasts.analytics("broadcast_123");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.dugble.com/broadcasts/broadcast_123/exclusions",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.dugble.com/broadcasts/broadcast_123/analytics",
      expect.objectContaining({ method: "GET" }),
    );
  });
});
