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

describe("Templates", () => {
  it("creates a categorized template with serialized variables", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.templates.create({
      name: "Welcome email",
      alias: "welcome",
      category: "welcome",
      from: "Dugble <hello@example.com>",
      subject: "Welcome, {{{first_name}}}",
      html: "<h1>Welcome, {{{first_name}}}</h1>",
      replyTo: ["support@example.com"],
      variables: [
        {
          key: "first_name",
          type: "string",
          fallbackValue: "friend",
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/templates",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Welcome email",
          html: "<h1>Welcome, {{{first_name}}}</h1>",
          category: "welcome",
          alias: "welcome",
          from: "Dugble <hello@example.com>",
          subject: "Welcome, {{{first_name}}}",
          reply_to: ["support@example.com"],
          variables: [
            {
              key: "first_name",
              type: "string",
              fallback_value: "friend",
            },
          ],
        }),
      }),
    );
  });

  it("lists templates with offset pagination", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        response({ object: "list", data: [], has_more: false }),
      );

    const client = new Dugble("dgb_team_test");
    await client.templates.list({ limit: 20, offset: 40 });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/templates?limit=20&offset=40",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("gets and deletes a template with an encoded identifier", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({}));

    const client = new Dugble("dgb_team_test");
    await client.templates.get("welcome/primary");
    await client.templates.delete("welcome/primary");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.dugble.com/templates/welcome%2Fprimary",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.dugble.com/templates/welcome%2Fprimary",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("updates a template using the public API field names", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.templates.update("welcome", {
      name: "Welcome v2",
      alias: "welcome-v2",
      category: "notification",
      from: "Team <team@example.com>",
      subject: "Hello {{{first_name}}}",
      html: "<p>Hello {{{first_name}}}</p>",
      replyTo: [],
      text: "Hello {{{first_name}}}",
      variables: [{ key: "first_name", type: "string" }],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/templates/welcome",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          name: "Welcome v2",
          html: "<p>Hello {{{first_name}}}</p>",
          alias: "welcome-v2",
          category: "notification",
          from: "Team <team@example.com>",
          subject: "Hello {{{first_name}}}",
          reply_to: [],
          text: "Hello {{{first_name}}}",
          variables: [{ key: "first_name", type: "string" }],
        }),
      }),
    );
  });

  it("publishes and duplicates without request bodies", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({}));

    const client = new Dugble("dgb_team_test");
    await client.templates.publish("welcome");
    await client.templates.duplicate("welcome");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.dugble.com/templates/welcome/publish",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("body");
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.dugble.com/templates/welcome/duplicate",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock.mock.calls[1]?.[1]).not.toHaveProperty("body");
  });

  it("previews the current version without an unnecessary body", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.templates.preview("welcome");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/templates/welcome/preview",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock.mock.calls[0]?.[1]).not.toHaveProperty("body");
  });

  it("previews a selected version with variables", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({}));

    const client = new Dugble("dgb_team_test");
    await client.templates.preview("welcome", {
      versionId: "version_123",
      variables: { first_name: "Ada" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/templates/welcome/preview",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          version_id: "version_123",
          variables: { first_name: "Ada" },
        }),
      }),
    );
  });

  it("sends a template test email", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response({ object: "email", id: "email_123" }, 202));

    const client = new Dugble("dgb_team_test");
    const result = await client.templates.testSend("welcome", {
      to: "ada@example.com",
      versionId: "version_123",
      variables: { first_name: "Ada" },
    });

    expect(result.data).toEqual({ object: "email", id: "email_123" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/templates/welcome/test-send",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          to: "ada@example.com",
          version_id: "version_123",
          variables: { first_name: "Ada" },
        }),
      }),
    );
  });

  it("lists, retrieves, and reverts template versions", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(response([]));

    const client = new Dugble("dgb_team_test");
    await client.templates.versions.list("welcome", {
      limit: 25,
      offset: 5,
    });
    await client.templates.versions.get("welcome", "version/123");
    await client.templates.versions.revert("welcome", "version/123");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.dugble.com/templates/welcome/versions?limit=25&offset=5",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.dugble.com/templates/welcome/versions/version%2F123",
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://api.dugble.com/templates/welcome/versions/version%2F123/revert",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock.mock.calls[2]?.[1]).not.toHaveProperty("body");
  });
});
