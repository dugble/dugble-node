import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import {
  type CreateTemplateOptions,
  type ListTemplatesOptions,
  type PreviewTemplateOptions,
  serializeCreateTemplate,
  serializePreviewTemplate,
  serializeTestSendTemplate,
  serializeUpdateTemplate,
  type Template,
  type TemplateDeleteResponse,
  type TemplateList,
  type TemplateMutationResponse,
  type TemplatePreview,
  type TemplateTestSendResponse,
  type TestSendTemplateOptions,
  type UpdateTemplateOptions,
} from "./types.js";
import { TemplateVersions } from "./versions.js";

export class Templates {
  readonly versions: TemplateVersions;

  constructor(private readonly client: Dugble) {
    this.versions = new TemplateVersions(client);
  }

  create(
    payload: CreateTemplateOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateMutationResponse>> {
    return this.client.post<TemplateMutationResponse>(
      "/templates",
      serializeCreateTemplate(payload),
      options,
    );
  }

  list(
    payload: ListTemplatesOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateList>> {
    const query = new URLSearchParams();
    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.offset !== undefined)
      query.set("offset", String(payload.offset));
    const suffix = query.size > 0 ? `?${query.toString()}` : "";

    return this.client.get<TemplateList>(`/templates${suffix}`, options);
  }

  get(
    template: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Template>> {
    return this.client.get<Template>(
      `/templates/${encodeURIComponent(template)}`,
      options,
    );
  }

  update(
    template: string,
    payload: UpdateTemplateOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateMutationResponse>> {
    return this.client.patch<TemplateMutationResponse>(
      `/templates/${encodeURIComponent(template)}`,
      serializeUpdateTemplate(payload),
      options,
    );
  }

  delete(
    template: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateDeleteResponse>> {
    return this.client.delete<TemplateDeleteResponse>(
      `/templates/${encodeURIComponent(template)}`,
      options,
    );
  }

  publish(
    template: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateMutationResponse>> {
    return this.client.post<TemplateMutationResponse>(
      `/templates/${encodeURIComponent(template)}/publish`,
      undefined,
      options,
    );
  }

  duplicate(
    template: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateMutationResponse>> {
    return this.client.post<TemplateMutationResponse>(
      `/templates/${encodeURIComponent(template)}/duplicate`,
      undefined,
      options,
    );
  }

  preview(
    template: string,
    payload: PreviewTemplateOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplatePreview>> {
    const request = serializePreviewTemplate(payload);
    const body = Object.keys(request).length > 0 ? request : undefined;

    return this.client.post<TemplatePreview>(
      `/templates/${encodeURIComponent(template)}/preview`,
      body,
      options,
    );
  }

  testSend(
    template: string,
    payload: TestSendTemplateOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateTestSendResponse>> {
    return this.client.post<TemplateTestSendResponse>(
      `/templates/${encodeURIComponent(template)}/test-send`,
      serializeTestSendTemplate(payload),
      options,
    );
  }
}
