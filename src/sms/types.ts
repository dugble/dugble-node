export interface SendSmsOptions {
  to: string;
  from: string;
  body: string;
  metadata?: Record<string, unknown>;
  scheduledAt?: string;
}

export interface SendSmsResponse {
  object: "sms";
  id: string;
}

export interface SmsFailure {
  code: string;
  message: string;
}

export interface SmsDestination {
  country: string;
}

export interface SmsMessage {
  object: "sms";
  id: string;
  message_id: string | null;
  to: string;
  from: string;
  body: string;
  last_event: string;
  destination: SmsDestination;
  segments: number;
  metadata: Record<string, unknown> | null;
  scheduled_at: string | null;
  failure?: SmsFailure | null;
  submitted_at?: string | null;
  delivered_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SmsEvent {
  id: string;
  type: string;
  occurred_at: string;
  provider?: string | null;
  code?: string | null;
  message?: string | null;
}

export interface SmsEventList {
  object: "list";
  data: SmsEvent[];
}

export interface SmsAnalyticsRate {
  name: string;
  value: number;
}

export interface SmsAnalyticsPoint {
  date: string;
  total: number;
  delivered: number;
  failed: number;
}

export interface SmsAnalyticsWindow {
  days: number;
  rates: SmsAnalyticsRate[];
  series: SmsAnalyticsPoint[];
}

export interface SmsCountryAnalytics {
  country: string;
  total: number;
  delivered: number;
  failed: number;
}

export interface SmsAnalytics {
  object: "sms.analytics";
  windows: SmsAnalyticsWindow[];
  delivery_by_country: SmsCountryAnalytics[];
}

export interface ListSmsOptions {
  limit?: number;
  offset?: number;
  status?:
    | "queued"
    | "processing"
    | "submitted"
    | "sent"
    | "delivered"
    | "undelivered"
    | "rejected"
    | "failed"
    | "expired"
    | "unknown"
    | "canceled";
  sender?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ListSmsEventsOptions {
  limit?: number;
}

export interface UpdateSmsOptions {
  id: string;
  scheduledAt: string;
}

export interface SendSmsRequest {
  to: string;
  from: string;
  body: string;
  metadata?: Record<string, unknown>;
  scheduled_at?: string;
}

export function serializeSendSms(payload: SendSmsOptions): SendSmsRequest {
  const result: SendSmsRequest = {
    to: payload.to,
    from: payload.from,
    body: payload.body,
  };

  if (payload.metadata !== undefined) result.metadata = payload.metadata;
  if (payload.scheduledAt !== undefined) {
    result.scheduled_at = payload.scheduledAt;
  }

  return result;
}
