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
  contentType?: string;
  contentId?: string;
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
  replyTo?: EmailAddress | EmailAddress[];
  cc?: EmailAddress | EmailAddress[];
  bcc?: EmailAddress | EmailAddress[];
  headers?: Record<string, string>;
  attachments?: EmailAttachment[];
  tags?: EmailTag[];
  scheduledAt?: string;
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

export interface EmailSummary {
  id: string;
  to_email: string;
  to_name: string | null;
  subject: string;
  status: string;
  provider: string | null;
  queued_at: string;
  submitted_at: string | null;
  delivered_at: string | null;
  created_at: string;
}

export interface ListEmailsOptions {
  limit?: number;
  offset?: number;
}

export interface UpdateEmailOptions {
  id: string;
  scheduledAt: string;
}

export interface MutationResponse {
  object: "email";
  id: string;
}

interface SendEmailRequest {
  from?: EmailAddress;
  to: EmailAddress | EmailAddress[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: EmailAddress | EmailAddress[];
  cc?: EmailAddress | EmailAddress[];
  bcc?: EmailAddress | EmailAddress[];
  headers?: Record<string, string>;
  attachments?: Array<{
    content?: string;
    filename?: string;
    path?: string;
    content_type?: string;
    content_id?: string;
  }>;
  tags?: EmailTag[];
  scheduled_at?: string;
  metadata?: Record<string, unknown>;
}

export function serializeSendEmail(payload: SendEmailOptions): SendEmailRequest {
  return {
    from: payload.from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    reply_to: payload.replyTo,
    cc: payload.cc,
    bcc: payload.bcc,
    headers: payload.headers,
    attachments: payload.attachments?.map((attachment) => ({
      content: attachment.content,
      filename: attachment.filename,
      path: attachment.path,
      content_type: attachment.contentType,
      content_id: attachment.contentId,
    })),
    tags: payload.tags,
    scheduled_at: payload.scheduledAt,
    metadata: payload.metadata,
  };
}

export class Emails {
  constructor(private readonly client: Dugble) {}

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
