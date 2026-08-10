export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "queued"
  | "materializing"
  | "estimating"
  | "sending"
  | "sent"
  | "failed"
  | "canceled";

export type CampaignRecipientStatus =
  | "pending"
  | "processing"
  | "excluded"
  | "queued"
  | "failed";

export type CampaignExclusionReason =
  | "missing_phone"
  | "duplicate_phone"
  | "opted_out"
  | "consent_unknown"
  | "suppressed"
  | "invalid_phone";

export type CampaignSmsEncoding = "GSM-7" | "UCS-2";

export interface Campaign {
  id: string;
  team_id: string;
  name: string;
  status: CampaignStatus;
  segment_id: string;
  sender_id: string;
  body: string;
  scheduled_at?: string;
  queued_at?: string;
  canceled_at?: string;
  materialized_at?: string;
  sent_at?: string;
  audience_count: number;
  eligible_count: number;
  excluded_count: number;
  failed_count: number;
  estimated_segments: number;
  estimated_cost_units: number;
  estimated_billable_cost_units: number;
  preflight_allowance_segments: number;
  actual_segments: number;
  actual_charge_units: number;
  currency?: string;
  preflight_balance_units?: number;
  preflight_at?: string;
  rate_limit_per_second: number;
  daily_send_limit?: number;
  revision: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignOptions {
  name: string;
  segmentId: string;
  senderId: string;
  body: string;
  rateLimitPerSecond?: number;
  dailySendLimit?: number;
}

export interface UpdateCampaignOptions {
  revision: number;
  name?: string;
  segmentId?: string;
  senderId?: string;
  body?: string;
  rateLimitPerSecond?: number;
  dailySendLimit?: number;
}

export interface ListCampaignsOptions {
  limit?: number;
  offset?: number;
}

export interface SendCampaignOptions {
  scheduledAt?: string | Date;
}

export interface DuplicateCampaignOptions {
  name: string;
}

export interface ListCampaignRecipientsOptions {
  limit?: number;
  offset?: number;
}

export interface CampaignPreview {
  body: string;
  encoding: CampaignSmsEncoding;
  characters: number;
  segments: number;
}

export interface CampaignRecipient {
  id: string;
  campaign_id: string;
  contact_id?: string;
  phone?: string;
  phone_country?: string;
  contact_snapshot: Record<string, unknown>;
  status: CampaignRecipientStatus;
  delivery_status?: string;
  delivered_at?: string;
  exclusion_reason?: CampaignExclusionReason;
  sms_message_id?: string;
  created_at: string;
  queued_at?: string;
  rendered_body?: string;
  attempt_count: number;
  failure_code?: string;
  failure_message?: string;
  encoding?: CampaignSmsEncoding;
  estimated_segments?: number;
  estimated_unit_cost_units?: number;
  estimated_cost_units?: number;
  actual_segments?: number;
  actual_charge_units?: number;
}

export interface CampaignCostEstimate {
  campaign_id: string;
  currency?: string;
  recipients: number;
  estimated_segments: number;
  estimated_cost_units: number;
  estimated_billable_cost_units: number;
  preflight_allowance_segments: number;
  minimum_recipient_cost_units: number;
  maximum_recipient_cost_units: number;
  actual_segments: number;
  actual_charge_units: number;
  preflight_balance_units?: number;
  preflight_at?: string;
}

export interface CampaignExclusionSummary {
  campaign_id: string;
  total: number;
  reasons: Partial<Record<CampaignExclusionReason, number>>;
}

export interface CampaignAnalytics {
  campaign_id: string;
  audience: number;
  eligible: number;
  excluded: number;
  queued: number;
  failed: number;
  sent: number;
  delivered: number;
  delivery_failed: number;
  estimated_segments: number;
  estimated_cost_units: number;
  estimated_billable_cost_units: number;
  actual_segments: number;
  actual_charge_units: number;
  currency?: string;
}

export interface CreateCampaignRequest {
  name: string;
  segment_id: string;
  sender_id: string;
  body: string;
  rate_limit_per_second?: number;
  daily_send_limit?: number;
}

export interface UpdateCampaignRequest {
  revision: number;
  name?: string;
  segment_id?: string;
  sender_id?: string;
  body?: string;
  rate_limit_per_second?: number;
  daily_send_limit?: number;
}

export interface SendCampaignRequest {
  scheduled_at?: string;
}

export function serializeCreateCampaign(
  payload: CreateCampaignOptions,
): CreateCampaignRequest {
  const result: CreateCampaignRequest = {
    name: payload.name,
    segment_id: payload.segmentId,
    sender_id: payload.senderId,
    body: payload.body,
  };

  if (payload.rateLimitPerSecond !== undefined) {
    result.rate_limit_per_second = payload.rateLimitPerSecond;
  }
  if (payload.dailySendLimit !== undefined) {
    result.daily_send_limit = payload.dailySendLimit;
  }

  return result;
}

export function serializeUpdateCampaign(
  payload: UpdateCampaignOptions,
): UpdateCampaignRequest {
  const result: UpdateCampaignRequest = { revision: payload.revision };

  if (payload.name !== undefined) result.name = payload.name;
  if (payload.segmentId !== undefined) result.segment_id = payload.segmentId;
  if (payload.senderId !== undefined) result.sender_id = payload.senderId;
  if (payload.body !== undefined) result.body = payload.body;
  if (payload.rateLimitPerSecond !== undefined) {
    result.rate_limit_per_second = payload.rateLimitPerSecond;
  }
  if (payload.dailySendLimit !== undefined) {
    result.daily_send_limit = payload.dailySendLimit;
  }

  return result;
}

export function serializeSendCampaign(
  payload: SendCampaignOptions,
): SendCampaignRequest {
  const result: SendCampaignRequest = {};

  if (payload.scheduledAt !== undefined) {
    result.scheduled_at =
      payload.scheduledAt instanceof Date
        ? payload.scheduledAt.toISOString()
        : payload.scheduledAt;
  }

  return result;
}
