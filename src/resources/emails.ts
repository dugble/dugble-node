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

interface EmailAttachmentRequest {
  content?: string;
  filename?: string;
  path?: string;
  content_type?: string;
  content_id?: string;
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
  attachments?: EmailAttachmentRequest[];
  tags?: EmailTag[];
  scheduled_at?: string;
  metadata?: Record<string, unknown>;
}

function serializeAttachment(
  attachment: EmailAttachment,
): EmailAttachmentRequest {
  const result: EmailAttachmentRequest = {};

  if (attachment.content !== undefined) result.content = attachment.content;
  if (attachment.filename !== undefined) result.filename = attachment.filename;
  if (attachment.path !== undefined) result.path = attachment.path;
  if (attachment.contentType !== undefined) {
    result.content_type = attachment.contentType;
  }
  if (attachment.contentId !== undefined) {
    result.content_id = attachment.contentId;
  }

  return result;
}

export function serializeSendEmail(payload: SendEmailOptions): SendEmailRequest {
  const result: SendEmailRequest = {
    to: payload.to,
    subject: payload.subject,
  };

  if (payload.from !== undefined) result.from = payload.from;
  if (payload.html !== undefined) result.html = payload.html;
  if (payload.text !== undefined) result.text = payload.text;
  if (payload.replyTo !== undefined) result.reply_to = payload.replyTo;
  if (payload.cc !== undefined) result.cc = payload.cc;
  if (payload.bcc !== undefined) result.bcc = payload.bcc;
  if (payload.headers !== undefined) result.headers = payload.headers;
  if (payload.attachments !== undefined) {
    result.attachments = payload.attachments.map(serializeAttachment);
  }
  if (payload.tags !== undefined) result.tags = payload.tags;
  if (payload.scheduledAt !== undefined) {
    result.scheduled_at = payload.scheduledAt;
  }
  if (payload.metadata !== undefined) result.metadata = payload.metadata;

  return result;
}

export class EmailBatch {
  constructor(private readonly client: Dugble) {}

  send(
    payload: SendEmailOptions[],
    options: IdempotentRequestOptions = {},
  ): Promise<DugbleResponse<SendEmailResponse[]>> {
    return this.client.post<SendEmailResponse[]>(
      "/emails/batch",
      payload.map(serializeSendEmail),
      options,
    );
  }
}

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
