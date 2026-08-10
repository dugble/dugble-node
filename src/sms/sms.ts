import type { Dugble } from "../client.js";
import type {
  DugbleResponse,
  IdempotentRequestOptions,
  RequestOptions,
} from "../interfaces.js";
import { SmsBatch } from "./batch.js";
import {
  type ListSmsEventsOptions,
  type ListSmsOptions,
  type SendSmsOptions,
  type SendSmsResponse,
  type SmsEventList,
  type SmsMessage,
  serializeSendSms,
  type UpdateSmsOptions,
} from "./types.js";

export class Sms {
  readonly batch: SmsBatch;

  constructor(private readonly client: Dugble) {
    this.batch = new SmsBatch(client);
  }

  send(
    payload: SendSmsOptions,
    options: IdempotentRequestOptions = {},
  ): Promise<DugbleResponse<SendSmsResponse>> {
    return this.client.post<SendSmsResponse>(
      "/sms",
      serializeSendSms(payload),
      options,
    );
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SmsMessage>> {
    return this.client.get<SmsMessage>(
      `/sms/${encodeURIComponent(id)}`,
      options,
    );
  }

  list(
    payload: ListSmsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SmsMessage[]>> {
    const query = new URLSearchParams();

    if (payload.limit !== undefined) {
      query.set("limit", String(payload.limit));
    }

    if (payload.offset !== undefined) {
      query.set("offset", String(payload.offset));
    }

    const suffix = query.size > 0 ? `?${query.toString()}` : "";

    return this.client.get<SmsMessage[]>(`/sms${suffix}`, options);
  }

  update(
    payload: UpdateSmsOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SendSmsResponse>> {
    return this.client.patch<SendSmsResponse>(
      `/sms/${encodeURIComponent(payload.id)}`,
      {
        scheduled_at: payload.scheduledAt,
      },
      options,
    );
  }

  cancel(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SendSmsResponse>> {
    return this.client.post<SendSmsResponse>(
      `/sms/${encodeURIComponent(id)}/cancel`,
      undefined,
      options,
    );
  }

  events(
    id: string,
    payload: ListSmsEventsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SmsEventList>> {
    const query = new URLSearchParams();

    if (payload.limit !== undefined) {
      query.set("limit", String(payload.limit));
    }

    const suffix = query.size > 0 ? `?${query.toString()}` : "";

    return this.client.get<SmsEventList>(
      `/sms/${encodeURIComponent(id)}/events${suffix}`,
      options,
    );
  }

  syncStatus(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SmsMessage>> {
    return this.client.post<SmsMessage>(
      `/sms/${encodeURIComponent(id)}/sync-status`,
      undefined,
      options,
    );
  }
}
