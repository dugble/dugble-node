import { describe, expectTypeOf, it } from "vitest";

import type {
  Broadcast,
  CreateBroadcastOptions,
  EmailAnalytics,
  EmailAttachment,
  ListDomainsOptions,
  ListEmailEventsOptions,
  ListSmsOptions,
  ListTopicsOptions,
  SegmentAudienceSize,
  SmsAnalytics,
  UpdateBroadcastOptions,
  UpdateDomainOptions,
} from "../src/index.js";

describe("synced public SDK contracts", () => {
  it("exports the new public contract types from the package root", () => {
    expectTypeOf<ListDomainsOptions>().toMatchTypeOf<{
      limit?: number;
      offset?: number;
    }>();
    expectTypeOf<UpdateDomainOptions>().toMatchTypeOf<{
      tls?: "opportunistic" | "enforced";
    }>();
    expectTypeOf<ListEmailEventsOptions>().toMatchTypeOf<{
      limit?: number;
      offset?: number;
    }>();
    expectTypeOf<ListTopicsOptions>().toMatchTypeOf<{
      limit?: number;
      offset?: number;
    }>();
    expectTypeOf<SegmentAudienceSize>().toMatchTypeOf<{
      segment_id: string;
      count: number;
    }>();
    expectTypeOf<ListSmsOptions>().toHaveProperty("status");
    expectTypeOf<EmailAnalytics>().toHaveProperty("windows");
    expectTypeOf<SmsAnalytics>().toHaveProperty("delivery_by_country");
    expectTypeOf<CreateBroadcastOptions>().toHaveProperty("subject");
    expectTypeOf<CreateBroadcastOptions>().toHaveProperty("html");
    expectTypeOf<UpdateBroadcastOptions>().toHaveProperty("revision");
    expectTypeOf<Broadcast>().not.toHaveProperty("template_id");
  });

  it("requires serializable email attachment content", () => {
    const attachment: EmailAttachment = {
      content: "aGVsbG8=",
      filename: "hello.txt",
      contentType: "text/plain",
    };

    expectTypeOf(attachment).toMatchTypeOf<EmailAttachment>();

    const unsupportedAttachment: EmailAttachment = {
      content: "aGVsbG8=",
      filename: "hello.txt",
      // @ts-expect-error Local filesystem paths are not part of the public API.
      path: "/tmp/hello.txt",
    };

    expectTypeOf(unsupportedAttachment).toMatchTypeOf<EmailAttachment>();
  });
});
