import type { Dugble } from "../client.js";
import type {
  DugbleResponse,
  IdempotentRequestOptions,
  RequestOptions,
} from "../interfaces.js";
import { EmailBatch } from "./batch.js";
import {
  type Email,
  type EmailSummary,
  type ListEmailsOptions,
  type MutationResponse,
  type SendEmailOptions,
  type SendEmailResponse,
  serializeSendEmail,
  type UpdateEmailOptions,
} from "./types.js";

export class Emails {
  readonly batch: EmailBatch;

  constructor(private readonly client: Dugble) {
    this.batch = new EmailBatch(client);
  }

  send(
    payload: SendEmailOptions,
    options: IdempotentRequestOptions = {},
  ): Promise<DugbleResponse<SendEmailResponse>> {
    return this.client.post<SendEmailResponse>(
      "/emails",
      serializeSendEmail(payload),
      options,
    );
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Email>> {
    return this.client.get<Email>(`/emails/${encodeURIComponent(id)}`, options);
  }

  list(
    payload: ListEmailsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<EmailSummary[]>> {
    const query = new URLSearchParams();

    if (payload.limit !== undefined) {
      query.set("limit", String(payload.limit));
    }

    if (payload.offset !== undefined) {
      query.set("offset", String(payload.offset));
    }

    const suffix = query.size > 0 ? `?${query.toString()}` : "";

    return this.client.get<EmailSummary[]>(`/emails${suffix}`, options);
  }

  update(
    payload: UpdateEmailOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<MutationResponse>> {
    return this.client.patch<MutationResponse>(
      `/emails/${encodeURIComponent(payload.id)}`,
      {
        scheduled_at: payload.scheduledAt,
      },
      options,
    );
  }

  cancel(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<MutationResponse>> {
    return this.client.post<MutationResponse>(
      `/emails/${encodeURIComponent(id)}/cancel`,
      undefined,
      options,
    );
  }
}
