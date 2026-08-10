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

describe("Audiences", () => {
  it("creates contacts with serialized profile and consent fields", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}, 201));

    const client = new Dugble("dgb_team_test");
    await client.contacts.create({
      email: "ada@example.com",
      phone: "+233201234567",
      firstName: "Ada",
      smsConsentStatus: "opted_in",
      smsConsentSource: "api",
      properties: { plan: "pro" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/contacts",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "ada@example.com",
          phone: "+233201234567",
          sms_consent_status: "opted_in",
          sms_consent_source: "api",
          first_name: "Ada",
          properties: { plan: "pro" },
        }),
      }),
    );
  });

  it("lists contact topics through the standard response envelope", async () => {
    const payload = {
      object: "list",
      has_more: false,
      data: [],
    };
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response(payload));

    const client = new Dugble("dgb_team_test");
    const result = await client.contacts.topics.list("contact/123", {
      limit: 20,
      after: "topic_123",
    });

    expect(result.data).toEqual(payload);
    expect(result.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/contacts/contact%2F123/topics?limit=20&after=topic_123",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("updates contact topics through the standard response envelope", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({ id: "contact_123" }));

    const client = new Dugble("dgb_team_test");
    const result = await client.contacts.topics.update("contact_123", [
      { id: "topic_123", subscription: "opt_out" },
    ]);

    expect(result.data).toEqual({ id: "contact_123" });
    expect(result.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/contacts/contact_123/topics",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify([
          { id: "topic_123", subscription: "opt_out" },
        ]),
      }),
    );
  });

  it("rejects an unwrapped successful response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "contact_123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Dugble("dgb_team_test");
    const result = await client.contacts.topics.update("contact_123", [
      { id: "topic_123", subscription: "opt_in" },
    ]);

    expect(result.data).toBeNull();
    expect(result.error).toEqual(
      expect.objectContaining({
        code: "APPLICATION_ERROR",
        statusCode: 200,
      }),
    );
  });

  it("adds and removes contact segment memberships", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({}, 201))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    const client = new Dugble("dgb_team_test");
    await client.contacts.segments.add("contact_123", "segment_123");
    const removed = await client.contacts.segments.remove(
      "contact_123",
      "segment_123",
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.dugble.com/contacts/contact_123/segments/segment_123",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.dugble.com/contacts/contact_123/segments/segment_123",
      expect.objectContaining({ method: "DELETE" }),
    );
    expect(removed.data).toBeNull();
    expect(removed.error).toBeNull();
  });

  it("lists topics with cursor pagination", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        response({ object: "list", has_more: false, data: [] }),
      );

    const client = new Dugble("dgb_team_test");
    await client.topics.list({ limit: 20, before: "topic_123" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/topics?limit=20&before=topic_123",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("lists contacts in a segment", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response([]));

    const client = new Dugble("dgb_team_test");
    await client.segments.contacts("segment/123", {
      limit: 50,
      offset: 10,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/segments/segment%2F123/contacts?limit=50&offset=10",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("removes suppressions in a batch by ids", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({ data: [] }));

    const client = new Dugble("dgb_team_test");
    await client.suppressions.batch.remove({ ids: ["suppression_123"] });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/suppressions/batch/remove",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ ids: ["suppression_123"] }),
      }),
    );
  });
});
