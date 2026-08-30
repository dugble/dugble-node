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
  it("creates a broadcast with owned message content", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 201));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.create({
      name: "August update",
      segmentId: "segment_123",
      topicId: "topic_123",
      fromEmail: "news@example.com",
      fromName: "Dugble",
      replyToEmail: "support@example.com",
      subject: "Hello {{first_name}}",
      previewText: "Your August update",
      html: "<h1>Hello {{{first_name}}}</h1>",
      text: "Hello {{{first_name}}}",
      variableBindings: { company: "Dugble" },
    });

    const call = fetchMock.mock.calls.at(0);
    if (!call) throw new Error("Expected fetch to be called once.");

    const [url, options] = call;
    expect(url).toBe("https://api.dugble.com/broadcasts");
    expect(options?.method).toBe("POST");
    expect(JSON.parse(String(options?.body))).toEqual({
      segment_id: "segment_123",
      subject: "Hello {{first_name}}",
      html: "<h1>Hello {{{first_name}}}</h1>",
      name: "August update",
      topic_id: "topic_123",
      from_email: "news@example.com",
      from_name: "Dugble",
      reply_to_email: "support@example.com",
      preview_text: "Your August update",
      text: "Hello {{{first_name}}}",
      variable_bindings: { company: "Dugble" },
    });
  });

  it("creates and schedules a broadcast in one request", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 201));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.create({
      segmentId: "segment_123",
      subject: "Scheduled update",
      html: "<p>Scheduled</p>",
      send: true,
      scheduledAt: new Date("2026-09-01T12:00:00.000Z"),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          segment_id: "segment_123",
          subject: "Scheduled update",
          html: "<p>Scheduled</p>",
          send: true,
          scheduled_at: "2026-09-01T12:00:00.000Z",
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

  it("updates draft content using its revision", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.update("broadcast/123", {
      revision: 4,
      name: "Updated name",
      segmentId: "segment_456",
      subject: "Updated subject",
      html: "<p>Updated body</p>",
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
          subject: "Updated subject",
          html: "<p>Updated body</p>",
          variable_bindings: { plan: "pro" },
        }),
      }),
    );
  });

  it("clears nullable broadcast content with null", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.update("broadcast_123", {
      revision: 5,
      topicId: null,
      fromEmail: null,
      fromName: null,
      replyToEmail: null,
      previewText: null,
      text: null,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          revision: 5,
          topic_id: null,
          from_email: null,
          from_name: null,
          reply_to_email: null,
          preview_text: null,
          text: null,
        }),
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
      scheduledAt: new Date("2026-09-01T12:00:00.000Z"),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123/send",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ scheduled_at: "2026-09-01T12:00:00.000Z" }),
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

  it("duplicates a broadcast and lets the backend default the name", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 201));

    const client = new Dugble("dgb_team_test");
    await client.broadcasts.duplicate("broadcast_123", {});

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/broadcasts/broadcast_123/duplicate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({}),
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
