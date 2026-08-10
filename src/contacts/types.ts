export type SmsConsentStatus = "unknown" | "opted_in" | "opted_out";
export type SmsConsentSource = "api" | "import" | "manual";
export type ContactTopicSubscription = "opt_in" | "opt_out";

export interface Contact {
  id: string;
  team_id: string;
  email: string;
  phone?: string;
  normalized_phone?: string;
  phone_country?: string;
  sms_consent_status: SmsConsentStatus;
  sms_consent_updated_at?: string;
  sms_consent_source?: SmsConsentSource;
  first_name?: string;
  last_name?: string;
  unsubscribed: boolean;
  properties: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateContactOptions {
  email: string;
  phone?: string;
  smsConsentStatus?: SmsConsentStatus;
  smsConsentSource?: SmsConsentSource;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
  properties?: Record<string, unknown>;
}

export interface UpdateContactOptions {
  email?: string;
  phone?: string;
  smsConsentStatus?: SmsConsentStatus;
  smsConsentSource?: SmsConsentSource;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
  properties?: Record<string, unknown>;
}

export interface ListContactsOptions {
  limit?: number;
  offset?: number;
}

export interface ContactTopic {
  id: string;
  name: string;
  description: string | null;
  subscription: ContactTopicSubscription;
}

export interface ContactTopicList {
  object: "list";
  has_more: boolean;
  data: ContactTopic[];
}

export interface ListContactTopicsOptions {
  limit?: number;
  after?: string;
  before?: string;
}

export interface UpdateContactTopic {
  id: string;
  subscription: ContactTopicSubscription;
}

export interface UpdateContactTopicsResponse {
  id: string;
}

export interface ContactSegmentMembership {
  id: string;
  team_id: string;
  name: string;
  created_at: string;
  assigned_at: string;
}

export interface CreateContactRequest {
  email: string;
  phone?: string;
  sms_consent_status?: SmsConsentStatus;
  sms_consent_source?: SmsConsentSource;
  first_name?: string;
  last_name?: string;
  unsubscribed?: boolean;
  properties?: Record<string, unknown>;
}

export interface UpdateContactRequest {
  email?: string;
  phone?: string;
  sms_consent_status?: SmsConsentStatus;
  sms_consent_source?: SmsConsentSource;
  first_name?: string;
  last_name?: string;
  unsubscribed?: boolean;
  properties?: Record<string, unknown>;
}

export function serializeCreateContact(
  payload: CreateContactOptions,
): CreateContactRequest {
  const result: CreateContactRequest = { email: payload.email };

  if (payload.phone !== undefined) result.phone = payload.phone;
  if (payload.smsConsentStatus !== undefined) {
    result.sms_consent_status = payload.smsConsentStatus;
  }
  if (payload.smsConsentSource !== undefined) {
    result.sms_consent_source = payload.smsConsentSource;
  }
  if (payload.firstName !== undefined) result.first_name = payload.firstName;
  if (payload.lastName !== undefined) result.last_name = payload.lastName;
  if (payload.unsubscribed !== undefined) {
    result.unsubscribed = payload.unsubscribed;
  }
  if (payload.properties !== undefined) result.properties = payload.properties;

  return result;
}

export function serializeUpdateContact(
  payload: UpdateContactOptions,
): UpdateContactRequest {
  const result: UpdateContactRequest = {};

  if (payload.email !== undefined) result.email = payload.email;
  if (payload.phone !== undefined) result.phone = payload.phone;
  if (payload.smsConsentStatus !== undefined) {
    result.sms_consent_status = payload.smsConsentStatus;
  }
  if (payload.smsConsentSource !== undefined) {
    result.sms_consent_source = payload.smsConsentSource;
  }
  if (payload.firstName !== undefined) result.first_name = payload.firstName;
  if (payload.lastName !== undefined) result.last_name = payload.lastName;
  if (payload.unsubscribed !== undefined) {
    result.unsubscribed = payload.unsubscribed;
  }
  if (payload.properties !== undefined) result.properties = payload.properties;

  return result;
}
