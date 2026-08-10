import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import type {
  ContactTopicList,
  ListContactTopicsOptions,
  UpdateContactTopic,
  UpdateContactTopicsResponse,
} from "./types.js";

export class ContactTopics {
  constructor(private readonly client: Dugble) {}

  list(
    contactId: string,
    payload: ListContactTopicsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactTopicList>> {
    const query = new URLSearchParams();

    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.after !== undefined) query.set("after", payload.after);
    if (payload.before !== undefined) query.set("before", payload.before);

    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return this.client.get<ContactTopicList>(
      `/contacts/${encodeURIComponent(contactId)}/topics${suffix}`,
      options,
    );
  }

  update(
    contactId: string,
    payload: UpdateContactTopic[],
    options: RequestOptions = {},
  ): Promise<DugbleResponse<UpdateContactTopicsResponse>> {
    return this.client.patch<UpdateContactTopicsResponse>(
      `/contacts/${encodeURIComponent(contactId)}/topics`,
      payload,
      options,
    );
  }
}
