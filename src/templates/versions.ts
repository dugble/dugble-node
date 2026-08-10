import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import type {
  ListTemplateVersionsOptions,
  TemplateRevertResponse,
  TemplateVersion,
} from "./types.js";

export class TemplateVersions {
  constructor(private readonly client: Dugble) {}

  list(
    template: string,
    payload: ListTemplateVersionsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateVersion[]>> {
    return this.client.get<TemplateVersion[]>(
      `/templates/${encodeURIComponent(template)}/versions${paginationQuery(payload)}`,
      options,
    );
  }

  get(
    template: string,
    versionId: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateVersion>> {
    return this.client.get<TemplateVersion>(
      `/templates/${encodeURIComponent(template)}/versions/${encodeURIComponent(versionId)}`,
      options,
    );
  }

  revert(
    template: string,
    versionId: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TemplateRevertResponse>> {
    return this.client.post<TemplateRevertResponse>(
      `/templates/${encodeURIComponent(template)}/versions/${encodeURIComponent(versionId)}/revert`,
      undefined,
      options,
    );
  }
}

function paginationQuery(payload: ListTemplateVersionsOptions): string {
  const query = new URLSearchParams();

  if (payload.limit !== undefined) query.set("limit", String(payload.limit));
  if (payload.offset !== undefined) query.set("offset", String(payload.offset));

  return query.size > 0 ? `?${query.toString()}` : "";
}
