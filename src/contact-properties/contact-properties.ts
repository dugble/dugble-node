import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import {
  type ContactProperty,
  type ContactPropertyDeleteResponse,
  type ContactPropertyList,
  type ContactPropertyMutationResponse,
  type CreateContactPropertyOptions,
  type ListContactPropertiesOptions,
  serializeCreateContactProperty,
  serializeUpdateContactProperty,
  type UpdateContactPropertyOptions,
} from "./types.js";

export class ContactProperties {
  constructor(private readonly client: Dugble) {}

  create(
    payload: CreateContactPropertyOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactPropertyMutationResponse>> {
    return this.client.post<ContactPropertyMutationResponse>(
      "/contact-properties",
      serializeCreateContactProperty(payload),
      options,
    );
  }

  list(
    payload: ListContactPropertiesOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactPropertyList>> {
    const query = new URLSearchParams();
    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.after !== undefined) query.set("after", payload.after);
    if (payload.before !== undefined) query.set("before", payload.before);
    const suffix = query.size > 0 ? `?${query.toString()}` : "";

    return this.client.get<ContactPropertyList>(
      `/contact-properties${suffix}`,
      options,
    );
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactProperty>> {
    return this.client.get<ContactProperty>(
      `/contact-properties/${encodeURIComponent(id)}`,
      options,
    );
  }

  update(
    id: string,
    payload: UpdateContactPropertyOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactPropertyMutationResponse>> {
    return this.client.patch<ContactPropertyMutationResponse>(
      `/contact-properties/${encodeURIComponent(id)}`,
      serializeUpdateContactProperty(payload),
      options,
    );
  }

  delete(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<ContactPropertyDeleteResponse>> {
    return this.client.delete<ContactPropertyDeleteResponse>(
      `/contact-properties/${encodeURIComponent(id)}`,
      options,
    );
  }
}
