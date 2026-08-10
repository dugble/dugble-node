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
export type DomainTlsMode = "opportunistic" | "enforced";
export type DomainRecordStatus = "pending" | "verified" | "failed";

export interface DomainCapabilities {
  sending: boolean;
  receiving: boolean;
}

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
  region: string;
  provider_external_id?: string;
  status: DomainStatus;
  provider_status?: string;
  records: DomainVerificationRecord[];
  open_tracking: boolean;
  click_tracking: boolean;
  tracking_subdomain?: string;
  active_tracking_subdomain?: string;
  tls: DomainTlsMode;
  capabilities: DomainCapabilities;
  custom_return_path: string;
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
  region: string;
  customReturnPath?: string;
  openTracking?: boolean;
  clickTracking?: boolean;
  trackingSubdomain?: string;
  tls?: DomainTlsMode;
  capabilities?: DomainCapabilities;
}

export interface DomainProvisioningResponse {
  status: "provisioning";
  message: string;
  retry_after_seconds: number;
}

export type CreateDomainResponse = Domain | DomainProvisioningResponse;

export interface CreateDomainRequest {
  name: string;
  region: string;
  custom_return_path?: string;
  open_tracking?: boolean;
  click_tracking?: boolean;
  tracking_subdomain?: string;
  tls?: DomainTlsMode;
  capabilities?: DomainCapabilities;
}

export function serializeCreateDomain(
  payload: CreateDomainOptions,
): CreateDomainRequest {
  const result: CreateDomainRequest = {
    name: payload.name,
    region: payload.region,
  };

  if (payload.customReturnPath !== undefined) {
    result.custom_return_path = payload.customReturnPath;
  }
  if (payload.openTracking !== undefined) {
    result.open_tracking = payload.openTracking;
  }
  if (payload.clickTracking !== undefined) {
    result.click_tracking = payload.clickTracking;
  }
  if (payload.trackingSubdomain !== undefined) {
    result.tracking_subdomain = payload.trackingSubdomain;
  }
  if (payload.tls !== undefined) result.tls = payload.tls;
  if (payload.capabilities !== undefined) {
    result.capabilities = payload.capabilities;
  }

  return result;
}
