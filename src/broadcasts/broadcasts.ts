import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import {
  type Broadcast,
  type BroadcastAnalytics,
  type BroadcastExclusionSummary,
  type BroadcastPreview,
  type BroadcastRecipient,
  type CreateBroadcastOptions,
  type DuplicateBroadcastOptions,
  type ListBroadcastRecipientsOptions,
  type ListBroadcastsOptions,
  type PreviewBroadcastOptions,
  type SendBroadcastOptions,
  serializeCreateBroadcast,
  serializeSendBroadcast,
  serializeUpdateBroadcast,
  type UpdateBroadcastOptions,
} from "./types.js";

export class Broadcasts {
  constructor(private readonly client: Dugble) {}

  create(
    payload: CreateBroadcastOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Broadcast>> {
    return this.client.post<Broadcast>(
      "/broadcasts",
      serializeCreateBroadcast(payload),
      options,
    );
  }

  list(
    payload: ListBroadcastsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Broadcast[]>> {
    return this.client.get<Broadcast[]>(
      `/broadcasts${paginationQuery(payload)}`,
      options,
    );
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Broadcast>> {
    return this.client.get<Broadcast>(
      `/broadcasts/${encodeURIComponent(id)}`,
      options,
    );
  }

  update(
    id: string,
    payload: UpdateBroadcastOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Broadcast>> {
    return this.client.patch<Broadcast>(
      `/broadcasts/${encodeURIComponent(id)}`,
      serializeUpdateBroadcast(payload),
      options,
    );
  }

  delete(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Broadcast>> {
    return this.client.delete<Broadcast>(
      `/broadcasts/${encodeURIComponent(id)}`,
      options,
    );
  }

  send(
    id: string,
    payload: SendBroadcastOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Broadcast>> {
    const request = serializeSendBroadcast(payload);
    const body = Object.keys(request).length > 0 ? request : undefined;

    return this.client.post<Broadcast>(
      `/broadcasts/${encodeURIComponent(id)}/send`,
      body,
      options,
    );
  }

  cancel(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Broadcast>> {
    return this.client.post<Broadcast>(
      `/broadcasts/${encodeURIComponent(id)}/cancel`,
      undefined,
      options,
    );
  }

  duplicate(
    id: string,
    payload: DuplicateBroadcastOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Broadcast>> {
    return this.client.post<Broadcast>(
      `/broadcasts/${encodeURIComponent(id)}/duplicate`,
      payload,
      options,
    );
  }

  preview(
    id: string,
    payload: PreviewBroadcastOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<BroadcastPreview>> {
    const body = payload.variables === undefined ? undefined : payload;

    return this.client.post<BroadcastPreview>(
      `/broadcasts/${encodeURIComponent(id)}/preview`,
      body,
      options,
    );
  }

  recipients(
    id: string,
    payload: ListBroadcastRecipientsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<BroadcastRecipient[]>> {
    return this.client.get<BroadcastRecipient[]>(
      `/broadcasts/${encodeURIComponent(id)}/recipients${paginationQuery(payload)}`,
      options,
    );
  }

  exclusions(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<BroadcastExclusionSummary>> {
    return this.client.get<BroadcastExclusionSummary>(
      `/broadcasts/${encodeURIComponent(id)}/exclusions`,
      options,
    );
  }

  analytics(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<BroadcastAnalytics>> {
    return this.client.get<BroadcastAnalytics>(
      `/broadcasts/${encodeURIComponent(id)}/analytics`,
      options,
    );
  }
}

function paginationQuery(payload: { limit?: number; offset?: number }): string {
  const query = new URLSearchParams();

  if (payload.limit !== undefined) query.set("limit", String(payload.limit));
  if (payload.offset !== undefined) query.set("offset", String(payload.offset));

  return query.size > 0 ? `?${query.toString()}` : "";
}
