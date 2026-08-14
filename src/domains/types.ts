export type DomainStatus =
  | "not_started"
  | "pending"
  | "verified"
  | "partially_verified"
  | "partially_failed"
  | "failed"
  | "temporary_failure"
  | "disabled";

export type DomainHealthStatus = "unknown" | "healthy" | "degraded";
export type DomainRegion = "us-east-1" | "eu-north-1";
export type DomainTlsMode = "opportunistic" | "enforced";
export type DomainRecordStatus = "pending" | "verified" | "failed";

export interface DomainVerificationRecord {
  record: string;
  name: string;
  value: string;
  type: string;
  status: DomainRecordStatus;
  ttl: string;
  priority?: number;
}

export interface Domain {
  id: string;
  team_id: string;
  name: string;
  provider?: string;
  provider_account?: string;
  region: DomainRegion;
  provider_external_id?: string;
  status: DomainStatus;
  provider_status?: string;
  records: DomainVerificationRecord[];
  tls: DomainTlsMode;
  failure_reason?: string;
  health_status: DomainHealthStatus;
  consecutive_health_failures: number;
  last_checked_at?: string;
  last_health_checked_at?: string;
  last_health_failure_at?: string;
  verified_at?: string;
  disabled_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDomainOptions {
  name: string;
  region: DomainRegion;
  tls?: DomainTlsMode;
}

export interface DomainProvisioningResponse {
  status: "provisioning";
  message: string;
  retry_after_seconds: number;
}

export type CreateDomainResponse = Domain | DomainProvisioningResponse;

export interface CreateDomainRequest {
  name: string;
  region: DomainRegion;
  tls?: DomainTlsMode;
}

export function serializeCreateDomain(
  payload: CreateDomainOptions,
): CreateDomainRequest {
  const result: CreateDomainRequest = {
    name: payload.name,
    region: payload.region,
  };

  if (payload.tls !== undefined) result.tls = payload.tls;

  return result;
}
