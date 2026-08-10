import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import {
  type CreateDomainOptions,
  type CreateDomainResponse,
  type Domain,
  serializeCreateDomain,
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

  list(options: RequestOptions = {}): Promise<DugbleResponse<Domain[]>> {
    return this.client.get<Domain[]>("/domains", options);
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
