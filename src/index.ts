export type { DugbleOptions } from "./client.js";
export { Dugble } from "./client.js";
export { EmailBatch } from "./emails/batch.js";
export { Emails } from "./emails/emails.js";
export type {
  Email,
  EmailAddress,
  EmailAttachment,
  EmailSummary,
  EmailTag,
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
