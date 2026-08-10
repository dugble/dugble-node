export type SenderIdStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "inactive";

export interface SenderId {
  id: string;
  team_id: string;
  name: string;
  country_code: string;
  purpose: string;
  status: SenderIdStatus;
  rejection_reason?: string;
  approved_at?: string;
  rejected_at?: string;
  suspended_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSenderIdOptions {
  name: string;
  countryCode: string;
  purpose: string;
  provider?: string;
}

export interface CreateSenderIdRequest {
  name: string;
  country_code: string;
  purpose: string;
  provider?: string;
}

export function serializeCreateSenderId(
  payload: CreateSenderIdOptions,
): CreateSenderIdRequest {
  const result: CreateSenderIdRequest = {
    name: payload.name,
    country_code: payload.countryCode,
    purpose: payload.purpose,
  };

  if (payload.provider !== undefined) result.provider = payload.provider;

  return result;
}
