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

describe("ContactProperties", () => {
  it("creates a contact property with a serialized fallback", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        response({ object: "contact_property", id: "property_123" }),
      );

    const client = new Dugble("dgb_team_test");
    await client.contactProperties.create({
      key: "company_name",
      type: "string",
      fallbackValue: "Unknown",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/contact-properties",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          key: "company_name",
          type: "string",
          fallback_value: "Unknown",
        }),
      }),
    );
  });

  it("lists contact properties with cursor pagination", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        response({ object: "list", has_more: false, data: [] }),
      );

    const client = new Dugble("dgb_team_test");
    await client.contactProperties.list({
      limit: 20,
      after: "property_123",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/contact-properties?limit=20&after=property_123",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("gets a contact property with an encoded id", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.contactProperties.get("property/123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/contact-properties/property%2F123",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("clears a fallback value with null", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        response({ object: "contact_property", id: "property_123" }),
      );

    const client = new Dugble("dgb_team_test");
    await client.contactProperties.update("property_123", {
      fallbackValue: null,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/contact-properties/property_123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ fallback_value: null }),
      }),
    );
  });

  it("deletes a contact property", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        response({
          object: "contact_property",
          id: "property_123",
          deleted: true,
        }),
      );

    const client = new Dugble("dgb_team_test");
    await client.contactProperties.delete("property_123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/contact-properties/property_123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
