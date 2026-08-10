import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import { SuppressionBatch } from "./batch.js";
import type {
  CreateSuppressionOptions,
  ListSuppressionsOptions,
  Suppression,
  SuppressionDeleteResponse,
  SuppressionList,
  SuppressionMutationResponse,
} from "./types.js";

export class Suppressions {
  readonly batch: SuppressionBatch;

  constructor(private readonly client: Dugble) {
    this.batch = new SuppressionBatch(client);
  }

  create(
    payload: CreateSuppressionOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SuppressionMutationResponse>> {
    return this.client.post<SuppressionMutationResponse>(
      "/suppressions",
      payload,
      options,
    );
  }

  list(
    payload: ListSuppressionsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SuppressionList>> {
    const query = new URLSearchParams();
    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.after !== undefined) query.set("after", payload.after);
    if (payload.before !== undefined) query.set("before", payload.before);
    if (payload.origin !== undefined) query.set("origin", payload.origin);
    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return this.client.get<SuppressionList>(`/suppressions${suffix}`, options);
  }

  get(
    identifier: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Suppression>> {
    return this.client.get<Suppression>(
      `/suppressions/${encodeURIComponent(identifier)}`,
      options,
    );
  }

  delete(
    identifier: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SuppressionDeleteResponse>> {
    return this.client.delete<SuppressionDeleteResponse>(
      `/suppressions/${encodeURIComponent(identifier)}`,
      options,
    );
  }
}
