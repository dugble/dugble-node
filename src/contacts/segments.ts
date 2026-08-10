import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import type { ContactSegmentMembership } from "./types.js";

export class ContactSegments {
  constructor(private readonly client: Dugble) {}

  list(
    contactId: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactSegmentMembership[]>> {
    return this.client.get<ContactSegmentMembership[]>(
      `/contacts/${encodeURIComponent(contactId)}/segments`,
      options,
    );
  }

  add(
    contactId: string,
    segmentId: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactSegmentMembership>> {
    return this.client.post<ContactSegmentMembership>(
      `/contacts/${encodeURIComponent(contactId)}/segments/${encodeURIComponent(segmentId)}`,
      undefined,
      options,
    );
  }

  remove(
    contactId: string,
    segmentId: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<null>> {
    return this.client.delete<null>(
      `/contacts/${encodeURIComponent(contactId)}/segments/${encodeURIComponent(segmentId)}`,
      options,
    );
  }
}
