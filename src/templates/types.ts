export type TemplateStatus = "draft" | "published";
export type TemplateVariableType = "string" | "number";
export type TemplateVariableFallback = string | number;

export interface TemplateVariableOptions {
  key: string;
  type: TemplateVariableType;
  fallbackValue?: TemplateVariableFallback;
}

export interface TemplateVariableRequest {
  key: string;
  type: TemplateVariableType;
  fallback_value?: TemplateVariableFallback;
}

export interface TemplateVariable {
  id: string;
  key: string;
  type: TemplateVariableType;
  fallback_value: TemplateVariableFallback | null;
  created_at: string;
  updated_at: string;
}

export interface Template {
  object: "template";
  id: string;
  current_version_id: string;
  alias: string | null;
  name: string;
  created_at: string;
  updated_at: string;
  status: TemplateStatus;
  published_at: string | null;
  from: string | null;
  subject: string | null;
  reply_to: string[] | null;
  html: string;
  text: string | null;
  variables: TemplateVariable[];
  has_unpublished_versions: boolean;
}

export interface TemplateListItem {
  id: string;
  name: string;
  status: TemplateStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  alias: string | null;
}

export interface TemplateList {
  object: "list";
  data: TemplateListItem[];
  has_more: boolean;
}

export interface TemplateMutationResponse {
  object: "template";
  id: string;
}

export interface TemplateDeleteResponse extends TemplateMutationResponse {
  deleted: true;
}

export interface TemplateVersionVariable {
  key: string;
  type: TemplateVariableType;
  fallback_value?: TemplateVariableFallback;
}

export interface TemplateVersion {
  id: string;
  team_id: string;
  template_id: string;
  version_number: number;
  from_email?: string;
  from_name?: string;
  reply_to_email?: string;
  subject: string;
  html: string;
  text?: string;
  variables: TemplateVersionVariable[];
  based_on_version_id?: string;
  change_note?: string;
  created_at: string;
}

export interface TemplateRevertResponse {
  id: string;
  team_id: string;
  name: string;
  alias: string | null;
  current_version_id?: string;
  published_version_id?: string;
  published_at?: string;
  has_unpublished_changes: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplatePreview {
  template_id: string;
  version_id: string;
  subject: string;
  html: string;
  text?: string;
  from_email?: string;
  from_name?: string;
  reply_to?: string;
}

export interface TemplateTestSendResponse {
  object: string;
  id: string;
}

export interface CreateTemplateOptions {
  name: string;
  html: string;
  alias?: string;
  from?: string;
  subject?: string;
  replyTo?: string | string[];
  text?: string;
  variables?: TemplateVariableOptions[];
}

export interface UpdateTemplateOptions {
  name?: string;
  html?: string;
  alias?: string;
  from?: string;
  subject?: string;
  replyTo?: string | string[];
  text?: string;
  variables?: TemplateVariableOptions[];
}

export interface ListTemplatesOptions {
  limit?: number;
  after?: string;
  before?: string;
}

export interface ListTemplateVersionsOptions {
  limit?: number;
  offset?: number;
}

export interface PreviewTemplateOptions {
  versionId?: string;
  variables?: Record<string, unknown>;
}

export interface TestSendTemplateOptions {
  to: string;
  versionId?: string;
  variables?: Record<string, unknown>;
}

export interface CreateTemplateRequest {
  name: string;
  html: string;
  alias?: string;
  from?: string;
  subject?: string;
  reply_to?: string | string[];
  text?: string;
  variables?: TemplateVariableRequest[];
}

export interface UpdateTemplateRequest {
  name?: string;
  html?: string;
  alias?: string;
  from?: string;
  subject?: string;
  reply_to?: string | string[];
  text?: string;
  variables?: TemplateVariableRequest[];
}

export interface PreviewTemplateRequest {
  version_id?: string;
  variables?: Record<string, unknown>;
}

export interface TestSendTemplateRequest {
  to: string;
  version_id?: string;
  variables?: Record<string, unknown>;
}

export function serializeCreateTemplate(
  payload: CreateTemplateOptions,
): CreateTemplateRequest {
  const result: CreateTemplateRequest = {
    name: payload.name,
    html: payload.html,
  };

  if (payload.alias !== undefined) result.alias = payload.alias;
  if (payload.from !== undefined) result.from = payload.from;
  if (payload.subject !== undefined) result.subject = payload.subject;
  if (payload.replyTo !== undefined) result.reply_to = payload.replyTo;
  if (payload.text !== undefined) result.text = payload.text;
  if (payload.variables !== undefined) {
    result.variables = serializeTemplateVariables(payload.variables);
  }

  return result;
}

export function serializeUpdateTemplate(
  payload: UpdateTemplateOptions,
): UpdateTemplateRequest {
  const result: UpdateTemplateRequest = {};

  if (payload.name !== undefined) result.name = payload.name;
  if (payload.html !== undefined) result.html = payload.html;
  if (payload.alias !== undefined) result.alias = payload.alias;
  if (payload.from !== undefined) result.from = payload.from;
  if (payload.subject !== undefined) result.subject = payload.subject;
  if (payload.replyTo !== undefined) result.reply_to = payload.replyTo;
  if (payload.text !== undefined) result.text = payload.text;
  if (payload.variables !== undefined) {
    result.variables = serializeTemplateVariables(payload.variables);
  }

  return result;
}

export function serializePreviewTemplate(
  payload: PreviewTemplateOptions,
): PreviewTemplateRequest {
  const result: PreviewTemplateRequest = {};

  if (payload.versionId !== undefined) result.version_id = payload.versionId;
  if (payload.variables !== undefined) result.variables = payload.variables;

  return result;
}

export function serializeTestSendTemplate(
  payload: TestSendTemplateOptions,
): TestSendTemplateRequest {
  const result: TestSendTemplateRequest = { to: payload.to };

  if (payload.versionId !== undefined) result.version_id = payload.versionId;
  if (payload.variables !== undefined) result.variables = payload.variables;

  return result;
}

function serializeTemplateVariables(
  variables: TemplateVariableOptions[],
): TemplateVariableRequest[] {
  return variables.map((variable) => {
    const result: TemplateVariableRequest = {
      key: variable.key,
      type: variable.type,
    };

    if (variable.fallbackValue !== undefined) {
      result.fallback_value = variable.fallbackValue;
    }

    return result;
  });
}
