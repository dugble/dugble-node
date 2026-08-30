import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import {
  type CreateDomainOptions,
  type CreateDomainResponse,
  type Domain,
  type ListDomainsOptions,
  serializeCreateDomain,
  serializeUpdateDomain,
  type UpdateDomainOptions,
} from "./types.js";

export class Domains {
  constructor(private readonly client: Dugble) {}

  create(
    payload: CreateDomainOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<CreateDomainResponse>> {
    return this.client.post<CreateDomainResponse>(
      "/domains",
      serializeCreateDomain(payload),
      options,
    );
  }

  list(
    payload: ListDomainsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Domain[]>> {
    const query = new URLSearchParams();
    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.offset !== undefined)
      query.set("offset", String(payload.offset));
    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return this.client.get<Domain[]>(`/domains${suffix}`, options);
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Domain>> {
    return this.client.get<Domain>(
      `/domains/${encodeURIComponent(id)}`,
      options,
    );
  }

  update(
    id: string,
    payload: UpdateDomainOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Domain>> {
    return this.client.patch<Domain>(
      `/domains/${encodeURIComponent(id)}`,
      serializeUpdateDomain(payload),
      options,
    );
  }

  verify(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Domain>> {
    return this.client.post<Domain>(
      `/domains/${encodeURIComponent(id)}/verify`,
      undefined,
      options,
    );
  }

  delete(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Domain>> {
    return this.client.delete<Domain>(
      `/domains/${encodeURIComponent(id)}`,
      options,
    );
  }
}
