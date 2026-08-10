export { Broadcasts } from "./broadcasts/broadcasts.js";
export type {
  Broadcast,
  BroadcastAnalytics,
  BroadcastExclusionReason,
  BroadcastExclusionSummary,
  BroadcastPreview,
  BroadcastRecipient,
  BroadcastRecipientStatus,
  BroadcastStatus,
  CreateBroadcastOptions,
  CreateBroadcastRequest,
  DuplicateBroadcastOptions,
  ListBroadcastRecipientsOptions,
  ListBroadcastsOptions,
  PreviewBroadcastOptions,
  PreviewBroadcastRequest,
  SendBroadcastOptions,
  SendBroadcastRequest,
  UpdateBroadcastOptions,
  UpdateBroadcastRequest,
} from "./broadcasts/types.js";
export { Campaigns } from "./campaigns/campaigns.js";
export type {
  Campaign,
  CampaignAnalytics,
  CampaignCostEstimate,
  CampaignExclusionReason,
  CampaignExclusionSummary,
  CampaignPreview,
  CampaignRecipient,
  CampaignRecipientStatus,
  CampaignSmsEncoding,
  CampaignStatus,
  CreateCampaignOptions,
  CreateCampaignRequest,
  DuplicateCampaignOptions,
  ListCampaignRecipientsOptions,
  ListCampaignsOptions,
  SendCampaignOptions,
  SendCampaignRequest,
  UpdateCampaignOptions,
  UpdateCampaignRequest,
} from "./campaigns/types.js";
export type { DugbleOptions } from "./client.js";
export { Dugble } from "./client.js";
export { Contacts } from "./contacts/contacts.js";
export { ContactSegments } from "./contacts/segments.js";
export { ContactTopics } from "./contacts/topics.js";
export type {
  Contact,
  ContactSegmentMembership,
  ContactTopic,
  ContactTopicList,
  ContactTopicSubscription,
  CreateContactOptions,
  CreateContactRequest,
  ListContactsOptions,
  ListContactTopicsOptions,
  SmsConsentSource,
  SmsConsentStatus,
  UpdateContactOptions,
  UpdateContactRequest,
  UpdateContactTopic,
  UpdateContactTopicsResponse,
} from "./contacts/types.js";
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
export { Segments } from "./segments/segments.js";
export type {
  CreateSegmentOptions,
  ListSegmentContactsOptions,
  ListSegmentsOptions,
  Segment,
  SegmentContact,
} from "./segments/types.js";
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
export { SuppressionBatch } from "./suppressions/batch.js";
export { Suppressions } from "./suppressions/suppressions.js";
export type {
  BatchAddSuppressionsOptions,
  BatchAddSuppressionsResponse,
  BatchRemoveSuppressionsOptions,
  BatchRemoveSuppressionsResponse,
  CreateSuppressionOptions,
  ListSuppressionsOptions,
  Suppression,
  SuppressionDeleteResponse,
  SuppressionList,
  SuppressionMutationResponse,
  SuppressionOrigin,
} from "./suppressions/types.js";
export { Templates } from "./templates/templates.js";
export type {
  CreateTemplateOptions,
  CreateTemplateRequest,
  ListTemplatesOptions,
  ListTemplateVersionsOptions,
  PreviewTemplateOptions,
  PreviewTemplateRequest,
  Template,
  TemplateDeleteResponse,
  TemplateList,
  TemplateListItem,
  TemplateMutationResponse,
  TemplatePreview,
  TemplateRevertResponse,
  TemplateStatus,
  TemplateTestSendResponse,
  TemplateVariable,
  TemplateVariableFallback,
  TemplateVariableOptions,
  TemplateVariableRequest,
  TemplateVariableType,
  TemplateVersion,
  TemplateVersionVariable,
  TestSendTemplateOptions,
  TestSendTemplateRequest,
  UpdateTemplateOptions,
  UpdateTemplateRequest,
} from "./templates/types.js";
export { TemplateVersions } from "./templates/versions.js";
export { Topics } from "./topics/topics.js";
export type {
  CreateTopicOptions,
  CreateTopicRequest,
  ListTopicsOptions,
  Topic,
  TopicDeleteResponse,
  TopicList,
  TopicMutationResponse,
  TopicSubscription,
  TopicVisibility,
  UpdateTopicOptions,
  UpdateTopicRequest,
} from "./topics/types.js";
