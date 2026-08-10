import { afterEach, describe, expect, it, vi } from "vitest";

import { Dugble } from "../src/index.js";

afterEach(() => {
  vi.restoreAllMocks();
});

function successResponse(object: "email" | "sms") {
  return new Response(
    JSON.stringify({
      success: true,
      data: { object, id: `${object}_123` },
    }),
    { status: 202 },
  );
}

describe("Idempotency", () => {
  it("generates a key for email sends", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(successResponse("email"));

    const client = new Dugble("dug_test_example");

    await client.emails.send({
      to: "customer@example.com",
      subject: "Welcome",
      text: "Welcome",
    });

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const headers = new Headers(call[1]?.headers);
    const idempotencyKey = headers.get("Idempotency-Key");

    expect(idempotencyKey).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("generates a key for SMS batch sends", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: [{ object: "sms", id: "sms_123" }],
        }),
        { status: 202 },
      ),
    );

    const client = new Dugble("dug_test_example");

    await client.sms.batch.send([
      {
        to: "+233555000000",
        from: "Dugble",
        body: "Hello from Dugble",
      },
    ]);

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    const headers = new Headers(call[1]?.headers);

    expect(headers.get("Idempotency-Key")).toBeTruthy();
  });

  it("uses a caller-provided key when supplied", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(successResponse("sms"));

    const client = new Dugble("dug_test_example");

    await client.sms.send(
      {
        to: "+233555000000",
        from: "Dugble",
        body: "Hello from Dugble",
      },
      { idempotencyKey: "order_123_sms" },
    );

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    expect(new Headers(call[1]?.headers).get("Idempotency-Key")).toBe(
      "order_123_sms",
    );
  });

  it("does not add a key to non-idempotent POST operations", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(successResponse("sms"));

    const client = new Dugble("dug_test_example");

    await client.sms.syncStatus("sms_123");

    const call = fetchMock.mock.calls.at(0);

    if (!call) {
      throw new Error("Expected fetch to be called once.");
    }

    expect(new Headers(call[1]?.headers).has("Idempotency-Key")).toBe(false);
  });
});
