import type { Dugble } from "../client.js";
import type {
  DugbleResponse,
  IdempotentRequestOptions,
  RequestOptions,
} from "../interfaces.js";

export type EmailAddress =
  | string
  | {
      email: string;
      name?: string;
    };

export interface EmailAttachment {
  content?: string;
  filename?: string;
  path?: string;
  content_type?: string;
  content_id?: string;
}

export interface EmailTag {
  name: string;
  value: string;
}

export interface SendEmailOptions {
  from?: EmailAddress;
  to: EmailAddress | EmailAddress[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: EmailAddress | EmailAddress[];
  cc?: EmailAddress | EmailAddress[];
  bcc?: EmailAddress | EmailAddress[];
  headers?: Record<string, string>;
  attachments?: EmailAttachment[];
  tags?: EmailTag[];
  scheduled_at?: string;
  metadata?: Record<string, unknown>;
}

export interface SendEmailResponse {
  object: "email";
  id: string;
}

export interface Email {
  object: "email";
  id: string;
  message_id: string | null;
  to: string[];
  from: string;
  created_at: string;
  subject: string;
  html: string | null;
  text: string | null;
  bcc: string[];
  cc: string[];
  reply_to: string[];
  last_event: string;
  scheduled_at: string | null;
  tags: EmailTag[];
}

export interface UpdateEmailOptions {
  scheduled_at: string;
}

export interface MutationResponse {
  object: "email";
  id: string;
}

export class Emails {
  constructor(private readonly client: Dugble) {}

  send(
    payload: SendEmailOptions,
    options: IdempotentRequestOptions = {},
  ): Promise<DugbleResponse<SendEmailResponse>> {
    return this.client.post<SendEmailResponse>("/emails", payload, options);
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Email>> {
    return this.client.get<Email>(`/emails/${encodeURIComponent(id)}`, options);
  }

  update(
    id: string,
    payload: UpdateEmailOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<MutationResponse>> {
    return this.client.patch<MutationResponse>(
      `/emails/${encodeURIComponent(id)}`,
      payload,
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
