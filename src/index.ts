export type { DugbleOptions } from "./client.js";
export { Dugble } from "./client.js";
export { Domains } from "./domains/domains.js";
export type {
  CreateDomainOptions,
  CreateDomainRequest,
  CreateDomainResponse,
  Domain,
  DomainCapabilities,
  DomainHealthStatus,
  DomainProvisioningResponse,
  DomainRecordStatus,
  DomainStatus,
  DomainTlsMode,
  DomainVerificationRecord,
} from "./domains/types.js";
export { EmailBatch } from "./emails/batch.js";
export { Emails } from "./emails/emails.js";
export type {
  Email,
  EmailAddress,
  EmailAttachment,
  EmailEvent,
  EmailEventList,
  EmailSummary,
  EmailTag,
  ListEmailEventsOptions,
  ListEmailsOptions,
  MutationResponse,
  SendEmailOptions,
  SendEmailResponse,
  UpdateEmailOptions,
} from "./emails/types.js";
export type {
  DugbleErrorResponse,
  DugbleResponse,
  IdempotentRequestOptions,
  RequestOptions,
} from "./interfaces.js";
export { SenderIds } from "./sender-ids/sender-ids.js";
export type {
  CreateSenderIdOptions,
  CreateSenderIdRequest,
  SenderId,
  SenderIdStatus,
} from "./sender-ids/types.js";
export { SmsBatch } from "./sms/batch.js";
export { Sms } from "./sms/sms.js";
export type {
  ListSmsEventsOptions,
  ListSmsOptions,
  SendSmsOptions,
  SendSmsResponse,
  SmsDestination,
  SmsEvent,
  SmsEventList,
  SmsFailure,
  SmsMessage,
  UpdateSmsOptions,
} from "./sms/types.js";
