import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import { ContactSegments } from "./segments.js";
import { ContactTopics } from "./topics.js";
import {
  type Contact,
  type CreateContactOptions,
  type ListContactsOptions,
  serializeCreateContact,
  serializeUpdateContact,
  type UpdateContactOptions,
} from "./types.js";

export class Contacts {
  readonly topics: ContactTopics;
  readonly segments: ContactSegments;

  constructor(private readonly client: Dugble) {
    this.topics = new ContactTopics(client);
    this.segments = new ContactSegments(client);
  }

  create(
    payload: CreateContactOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Contact>> {
    return this.client.post<Contact>(
      "/contacts",
      serializeCreateContact(payload),
      options,
    );
  }

  list(
    payload: ListContactsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Contact[]>> {
    const query = new URLSearchParams();
    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.offset !== undefined)
      query.set("offset", String(payload.offset));
    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return this.client.get<Contact[]>(`/contacts${suffix}`, options);
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Contact>> {
    return this.client.get<Contact>(
      `/contacts/${encodeURIComponent(id)}`,
      options,
    );
  }

  update(
    id: string,
    payload: UpdateContactOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Contact>> {
    return this.client.patch<Contact>(
      `/contacts/${encodeURIComponent(id)}`,
      serializeUpdateContact(payload),
      options,
    );
  }

  delete(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Contact>> {
    return this.client.delete<Contact>(
      `/contacts/${encodeURIComponent(id)}`,
      options,
    );
  }
}
