import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Domains", () => {
  it("creates a domain with serialized options", async () => {
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
            open_tracking: true,
            click_tracking: false,
            tls: "opportunistic",
            capabilities: { sending: true, receiving: false },
            custom_return_path: "send",
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
      openTracking: true,
      clickTracking: false,
      customReturnPath: "send",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dugble.com/domains",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "example.com",
          region: "us-east-1",
          custom_return_path: "send",
          open_tracking: true,
          click_tracking: false,
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
