export type BroadcastStatus =
  | "draft"
  | "scheduled"
  | "queued"
  | "sent"
  | "failed"
  | "canceled";

export type BroadcastRecipientStatus =
  | "pending"
  | "excluded"
  | "queued"
  | "failed";

export type BroadcastExclusionReason =
  | "invalid_email"
  | "global_unsubscribe"
  | "suppressed"
  | "topic_unsubscribed"
  | "contact_unavailable";

export interface Broadcast {
  id: string;
  team_id: string;
  name: string;
  status: BroadcastStatus;
  segment_id: string;
  topic_id?: string;
  from_email: string;
  from_name?: string;
  reply_to_email?: string;
  subject: string;
  preview_text?: string;
  html: string;
  text?: string;
  variable_bindings: Record<string, unknown>;
  scheduled_at?: string;
  queued_at?: string;
  sent_at?: string;
  canceled_at?: string;
  audience_count: number;
  eligible_count: number;
  suppressed_count: number;
  queued_count: number;
  failed_count: number;
  revision: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBroadcastOptions {
  name?: string;
  segmentId: string;
  topicId?: string;
  fromEmail?: string;
  fromName?: string;
  replyToEmail?: string;
  subject: string;
  previewText?: string;
  html: string;
  text?: string;
  variableBindings?: Record<string, unknown>;
  send?: boolean;
  scheduledAt?: string | Date;
}

export interface UpdateBroadcastOptions {
  revision: number;
  name?: string;
  segmentId?: string;
  topicId?: string | null;
  fromEmail?: string | null;
  fromName?: string | null;
  replyToEmail?: string | null;
  subject?: string;
  previewText?: string | null;
  html?: string;
  text?: string | null;
  variableBindings?: Record<string, unknown>;
}

export interface ListBroadcastsOptions {
  limit?: number;
  offset?: number;
}

export interface SendBroadcastOptions {
  scheduledAt?: string | Date;
}

export interface PreviewBroadcastOptions {
  variables?: Record<string, unknown>;
}

export interface DuplicateBroadcastOptions {
  name?: string;
}

export interface ListBroadcastRecipientsOptions {
  limit?: number;
  offset?: number;
}

export interface BroadcastRecipient {
  id: string;
  broadcast_id: string;
  contact_id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  contact_snapshot: Record<string, unknown>;
  status: BroadcastRecipientStatus;
  exclusion_reason?: BroadcastExclusionReason;
  email_message_id?: string;
  created_at: string;
  queued_at?: string;
}

export interface BroadcastExclusionSummary {
  object: string;
  broadcast_id: string;
  total: number;
  reasons: Record<string, number>;
}

export interface BroadcastAnalytics {
  object: string;
  broadcast_id: string;
  audience: number;
  eligible: number;
  excluded: number;
  queued: number;
  delivered: number;
  bounced: number;
  complained: number;
  failed: number;
  opened: number;
  clicked: number;
}

export interface BroadcastPreview {
  from_email: string;
  from_name?: string;
  reply_to_email?: string;
  subject: string;
  preview_text?: string;
  html: string;
  text?: string;
}

export interface CreateBroadcastRequest {
  name?: string;
  segment_id: string;
  topic_id?: string;
  from_email?: string;
  from_name?: string;
  reply_to_email?: string;
  subject: string;
  preview_text?: string;
  html: string;
  text?: string;
  variable_bindings?: Record<string, unknown>;
  send?: boolean;
  scheduled_at?: string;
}

export interface UpdateBroadcastRequest {
  revision: number;
  name?: string;
  segment_id?: string;
  topic_id?: string | null;
  from_email?: string | null;
  from_name?: string | null;
  reply_to_email?: string | null;
  subject?: string;
  preview_text?: string | null;
  html?: string;
  text?: string | null;
  variable_bindings?: Record<string, unknown>;
}

export interface SendBroadcastRequest {
  scheduled_at?: string;
}

export interface PreviewBroadcastRequest {
  variables?: Record<string, unknown>;
}

function serializeDate(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

export function serializeCreateBroadcast(
  payload: CreateBroadcastOptions,
): CreateBroadcastRequest {
  const result: CreateBroadcastRequest = {
    segment_id: payload.segmentId,
    subject: payload.subject,
    html: payload.html,
  };

  if (payload.name !== undefined) result.name = payload.name;
  if (payload.topicId !== undefined) result.topic_id = payload.topicId;
  if (payload.fromEmail !== undefined) result.from_email = payload.fromEmail;
  if (payload.fromName !== undefined) result.from_name = payload.fromName;
  if (payload.replyToEmail !== undefined) {
    result.reply_to_email = payload.replyToEmail;
  }
  if (payload.previewText !== undefined) {
    result.preview_text = payload.previewText;
  }
  if (payload.text !== undefined) result.text = payload.text;
  if (payload.variableBindings !== undefined) {
    result.variable_bindings = payload.variableBindings;
  }
  if (payload.send !== undefined) result.send = payload.send;
  if (payload.scheduledAt !== undefined) {
    result.scheduled_at = serializeDate(payload.scheduledAt);
  }

  return result;
}

export function serializeUpdateBroadcast(
  payload: UpdateBroadcastOptions,
): UpdateBroadcastRequest {
  const result: UpdateBroadcastRequest = { revision: payload.revision };

  if (payload.name !== undefined) result.name = payload.name;
  if (payload.segmentId !== undefined) result.segment_id = payload.segmentId;
  if (payload.topicId !== undefined) result.topic_id = payload.topicId;
  if (payload.fromEmail !== undefined) result.from_email = payload.fromEmail;
  if (payload.fromName !== undefined) result.from_name = payload.fromName;
  if (payload.replyToEmail !== undefined) {
    result.reply_to_email = payload.replyToEmail;
  }
  if (payload.subject !== undefined) result.subject = payload.subject;
  if (payload.previewText !== undefined) {
    result.preview_text = payload.previewText;
  }
  if (payload.html !== undefined) result.html = payload.html;
  if (payload.text !== undefined) result.text = payload.text;
  if (payload.variableBindings !== undefined) {
    result.variable_bindings = payload.variableBindings;
  }

  return result;
}

export function serializeSendBroadcast(
  payload: SendBroadcastOptions,
): SendBroadcastRequest {
  const result: SendBroadcastRequest = {};

  if (payload.scheduledAt !== undefined) {
    result.scheduled_at = serializeDate(payload.scheduledAt);
  }

  return result;
}
