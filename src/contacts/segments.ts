import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import type { ContactSegmentMembership } from "./types.js";

export class ContactSegments {
  constructor(
    private readonly client: Dugble,
    private readonly contactId: string,
  ) {}

  list(
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactSegmentMembership[]>> {
    return this.client.get<ContactSegmentMembership[]>(
      `/contacts/${encodeURIComponent(this.contactId)}/segments`,
      options,
    );
  }

  add(
    segmentId: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactSegmentMembership>> {
    return this.client.post<ContactSegmentMembership>(
      `/contacts/${encodeURIComponent(this.contactId)}/segments/${encodeURIComponent(segmentId)}`,
      undefined,
      options,
    );
  }

  remove(
    segmentId: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<null>> {
    return this.client.delete<null>(
      `/contacts/${encodeURIComponent(this.contactId)}/segments/${encodeURIComponent(segmentId)}`,
      options,
    );
  }
}
