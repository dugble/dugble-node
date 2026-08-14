import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Domains", () => {
  it("creates a domain with the supported configuration", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            id: "domain_123",
            team_id: "team_123",
            name: "example.com",
            region: "us-east-1",
            status: "pending",
            records: [],
            tls: "enforced",
            health_status: "unknown",
            consecutive_health_failures: 0,
            created_at: "2026-08-10T00:00:00Z",
            updated_at: "2026-08-10T00:00:00Z",
          },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );

    const client = new Dugble("dgb_team_test");
    await client.domains.create({
      name: "example.com",
      region: "us-east-1",
      tls: "enforced",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/domains",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "example.com",
          region: "us-east-1",
          tls: "enforced",
        }),
      }),
    );
  });

  it("omits tls when it is not provided", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: {} }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Dugble("dgb_team_test");
    await client.domains.create({
      name: "example.com",
      region: "eu-north-1",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/domains",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "example.com",
          region: "eu-north-1",
        }),
      }),
    );
  });

  it("verifies an encoded domain id", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new Dugble("dgb_team_test");
    await client.domains.verify("domain/123");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/domains/domain%2F123/verify",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
