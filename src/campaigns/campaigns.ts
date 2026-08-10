import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import {
  type Campaign,
  type CampaignAnalytics,
  type CampaignCostEstimate,
  type CampaignExclusionSummary,
  type CampaignPreview,
  type CampaignRecipient,
  type CreateCampaignOptions,
  type DuplicateCampaignOptions,
  type ListCampaignRecipientsOptions,
  type ListCampaignsOptions,
  type SendCampaignOptions,
  serializeCreateCampaign,
  serializeSendCampaign,
  serializeUpdateCampaign,
  type UpdateCampaignOptions,
} from "./types.js";

export class Campaigns {
  constructor(private readonly client: Dugble) {}

  create(
    payload: CreateCampaignOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Campaign>> {
    return this.client.post<Campaign>(
      "/campaigns",
      serializeCreateCampaign(payload),
      options,
    );
  }

  list(
    payload: ListCampaignsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Campaign[]>> {
    return this.client.get<Campaign[]>(
      `/campaigns${paginationQuery(payload)}`,
      options,
    );
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Campaign>> {
    return this.client.get<Campaign>(
      `/campaigns/${encodeURIComponent(id)}`,
      options,
    );
  }

  update(
    id: string,
    payload: UpdateCampaignOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Campaign>> {
    return this.client.patch<Campaign>(
      `/campaigns/${encodeURIComponent(id)}`,
      serializeUpdateCampaign(payload),
      options,
    );
  }

  delete(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Campaign>> {
    return this.client.delete<Campaign>(
      `/campaigns/${encodeURIComponent(id)}`,
      options,
    );
  }

  preview(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<CampaignPreview>> {
    return this.client.post<CampaignPreview>(
      `/campaigns/${encodeURIComponent(id)}/preview`,
      undefined,
      options,
    );
  }

  send(
    id: string,
    payload: SendCampaignOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Campaign>> {
    const request = serializeSendCampaign(payload);
    const body = Object.keys(request).length > 0 ? request : undefined;

    return this.client.post<Campaign>(
      `/campaigns/${encodeURIComponent(id)}/send`,
      body,
      options,
    );
  }

  cancel(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Campaign>> {
    return this.client.post<Campaign>(
      `/campaigns/${encodeURIComponent(id)}/cancel`,
      undefined,
      options,
    );
  }

  duplicate(
    id: string,
    payload: DuplicateCampaignOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Campaign>> {
    return this.client.post<Campaign>(
      `/campaigns/${encodeURIComponent(id)}/duplicate`,
      payload,
      options,
    );
  }

  recipients(
    id: string,
    payload: ListCampaignRecipientsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<CampaignRecipient[]>> {
    return this.client.get<CampaignRecipient[]>(
      `/campaigns/${encodeURIComponent(id)}/recipients${paginationQuery(payload)}`,
      options,
    );
  }

  costEstimate(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<CampaignCostEstimate>> {
    return this.client.get<CampaignCostEstimate>(
      `/campaigns/${encodeURIComponent(id)}/cost-estimate`,
      options,
    );
  }

  exclusions(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<CampaignExclusionSummary>> {
    return this.client.get<CampaignExclusionSummary>(
      `/campaigns/${encodeURIComponent(id)}/exclusions`,
      options,
    );
  }

  analytics(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<CampaignAnalytics>> {
    return this.client.get<CampaignAnalytics>(
      `/campaigns/${encodeURIComponent(id)}/analytics`,
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
